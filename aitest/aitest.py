"""AI 출제 수준 테스트 — 시험지 나누기 → 문항 만들기 → 자동 검사 → 선생님 검토 화면 → 결과 보고서.

사용법은 README.md 를 본다. 빠른 확인:
    python aitest.py all --mock --name demo        # API 없이 흐름만 확인
    python aitest.py all --name eng-sep --subject 영어 inputs/2026-09-영어.pdf --units 18-24,31-34
"""

import argparse
import base64
import csv
import json
import mimetypes
import re
import statistics
import sys
import threading
import time
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from fractions import Fraction
from pathlib import Path

import prompts as P

ROOT = Path(__file__).resolve().parent
OUTPUTS = ROOT / "outputs"
TEMPLATE = ROOT / "review_template.html"

DEFAULT_MODEL = "claude-opus-5-5"
# 100만 토큰당 달러 (입력, 출력). 보고서의 비용 추정에만 쓴다.
PRICES = {
    "claude-opus-5-5": (4.00, 20.00),
    "claude-sonnet-5-5": (2.00, 10.00),
    "claude-haiku-5-5": (0.10, 0.50),
}
# 안전 분류기가 요청을 거절하면 서버가 다른 모델로 다시 돌린다. Haiku 는 이 기능이 없다.
FALLBACK_MODELS = {"claude-opus-5-5", "claude-sonnet-5-5"}
FALLBACK_BETA = "server-side-fallback-2026-07-01"
CODE_TOOL = {"type": "code_execution_20260521", "name": "code_execution"}
MAX_PDF_BYTES = 30 * 1024 * 1024

# 보고서 판정 기준 (README 의 '판정 기준' 과 같다)
ASIS_OK = 0.80      # '그대로 사용' 비율이 이 이상이면 일괄 생성(통째로 넣기)을 기본으로
USABLE_OK = 0.70    # '그대로 + 고쳐서' 비율이 이 이상이면 지문 골라 돌리기 + 검토 화면
SPLIT_OK = 0.90     # 지문 나누기 정확도가 이 미만이면 나누기 확인 화면이 필요


class CallError(Exception):
    pass


# ---------------------------------------------------------------------------
# API 호출
# ---------------------------------------------------------------------------

class Claude:
    def __init__(self, model: str, log_path: Path):
        import anthropic

        self.anthropic = anthropic
        self.client = anthropic.Anthropic(max_retries=4)
        self.model = model
        self.log_path = log_path
        self.lock = threading.Lock()

    def _stream(self, kind, ref, **kwargs):
        kwargs.setdefault("model", self.model)
        if self.model in FALLBACK_MODELS:
            kwargs["betas"] = [FALLBACK_BETA]
            kwargs["fallbacks"] = "default"
        started = time.time()
        with self.client.beta.messages.stream(**kwargs) as stream:
            msg = stream.get_final_message()
        self._log(kind, ref, msg, time.time() - started)
        if msg.stop_reason == "refusal":
            raise CallError(f"모델이 요청을 거절함 ({getattr(msg.stop_details, 'category', None)})")
        if msg.stop_reason == "max_tokens":
            raise CallError("응답이 max_tokens 에서 잘림")
        return msg

    def _log(self, kind, ref, msg, seconds):
        u = msg.usage
        row = {
            "at": datetime.now().isoformat(timespec="seconds"),
            "kind": kind,
            "ref": ref,
            "model": msg.model,
            "stop_reason": msg.stop_reason,
            "input_tokens": u.input_tokens,
            "output_tokens": u.output_tokens,
            "cache_read_input_tokens": getattr(u, "cache_read_input_tokens", 0) or 0,
            "cache_creation_input_tokens": getattr(u, "cache_creation_input_tokens", 0) or 0,
            "seconds": round(seconds, 1),
            "request_id": getattr(msg, "_request_id", None),
        }
        with self.lock, self.log_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")

    def json_call(self, kind, ref, system, content, schema, effort, max_tokens=32000):
        msg = self._stream(
            kind, ref,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": content}],
            output_config={"effort": effort, "format": {"type": "json_schema", "schema": schema}},
        )
        text = next((b.text for b in msg.content if b.type == "text"), "")
        return json.loads(text)

    def code_json_call(self, kind, ref, system, content, effort, max_tokens=32000):
        """code_execution 으로 계산하게 한 뒤 마지막 글에서 JSON 을 꺼낸다."""
        messages = [{"role": "user", "content": content}]
        for _ in range(4):
            msg = self._stream(
                kind, ref,
                max_tokens=max_tokens,
                system=system,
                messages=messages,
                tools=[CODE_TOOL],
                output_config={"effort": effort},
            )
            if msg.stop_reason != "pause_turn":
                break
            # 서버 쪽 도구 반복이 멈춘 경우: 받은 내용을 그대로 붙여 다시 보내면 이어서 한다.
            messages.append({"role": "assistant", "content": msg.content})
        text = "\n".join(b.text for b in msg.content if b.type == "text")
        return last_json(text)


class MockClaude:
    """API 없이 흐름 · 검토 화면 · 보고서를 확인하기 위한 가짜 응답."""

    model = "mock"

    def __init__(self, log_path: Path):
        self.log_path = log_path
        self.lock = threading.Lock()
        self.n = 0

    def _log(self, kind, ref):
        with self.lock:
            self.n += 1
            row = {"at": datetime.now().isoformat(timespec="seconds"), "kind": kind, "ref": ref,
                   "model": "mock", "stop_reason": "end_turn", "input_tokens": 3000,
                   "output_tokens": 900, "cache_read_input_tokens": 0,
                   "cache_creation_input_tokens": 0, "seconds": 1.0, "request_id": None}
            with self.log_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")

    def json_call(self, kind, ref, system, content, schema, effort, max_tokens=32000):
        self._log(kind, ref)
        if kind == "split":
            return json.loads((ROOT / "mock" / "split.json").read_text(encoding="utf-8"))
        if kind == "generate":
            text = content if isinstance(content, str) else content[-1]["text"]
            passage = text.split("[지문]\n", 1)[-1].split("\n\n")[0]
            sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", passage) if len(s.strip()) > 20]
            count = int(re.search(r"문항 수: (\d+)", text).group(1))
            items = []
            for k in range(count):
                good = (k + len(ref)) % 4 != 0
                ev = sentences[k % len(sentences)] if (good and sentences) else "This sentence is not in the passage."
                items.append({
                    "type_label": "모의 · 내용 일치",
                    "stem": f"[모의 데이터 {ref}-{k + 1}] 윗글의 내용과 일치하는 것은?",
                    "choices": ["선택지 가", "선택지 나", "선택지 다", "선택지 라", "선택지 마"],
                    "answer": (k % 5) + 1,
                    "answer_text": "",
                    "explanation": "모의 데이터라 해설이 없습니다.",
                    "evidence": [ev],
                })
            return {"items": items}
        if kind == "verify":
            m = re.search(r"\[모의 데이터 [^\]]*-(\d+)\]", content)
            k = int(m.group(1)) if m else 1
            return {"answer": ((k - 1) % 5) + 1 if k % 3 else 1, "answer_text": "",
                    "issues": [] if k % 3 else ["복수 정답"], "reason": "모의 검사"}
        raise ValueError(kind)

    def code_json_call(self, kind, ref, system, content, effort, max_tokens=32000):
        return self.json_call(kind, ref, system, content, P.VERIFY_SCHEMA, effort)


# ---------------------------------------------------------------------------
# 도우미
# ---------------------------------------------------------------------------

def last_json(text: str) -> dict:
    """글 안의 마지막 JSON 객체를 꺼낸다."""
    for m in reversed(list(re.finditer(r"\{", text))):
        try:
            return json.loads(text[m.start():text.rindex("}") + 1])
        except (json.JSONDecodeError, ValueError):
            continue
    raise CallError("응답에서 JSON 을 찾지 못함")


def norm_text(s: str) -> str:
    s = unicodedata.normalize("NFKC", s or "")
    s = re.sub(r"</?u>", "", s)
    s = s.translate(str.maketrans({"‘": "'", "’": "'", "“": '"', "”": '"', "—": "-", "–": "-"}))
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s.rstrip(".!?\"' ")


def norm_answer(s: str):
    s = unicodedata.normalize("NFKC", str(s or "")).replace("$", "").replace(" ", "")
    s = s.replace("\\frac{", "(").replace("}{", ")/(").replace("}", ")").replace("{", "(")
    try:
        return Fraction(s.replace("(", "").replace(")", "")) if "/" in s else Fraction(s)
    except (ValueError, ZeroDivisionError):
        return s.lower()


def unit_first_no(unit) -> int:
    m = re.match(r"\d+", unit["numbers"])
    return int(m.group()) if m else 0


def parse_ranges(spec: str):
    nums = set()
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            nums.update(range(int(a), int(b) + 1))
        else:
            nums.add(int(part))
    return nums


def run_dir(name: str) -> Path:
    d = OUTPUTS / name
    d.mkdir(parents=True, exist_ok=True)
    return d


def load(path: Path):
    if not path.exists():
        sys.exit(f"{path.name} 가 없습니다. 앞 단계를 먼저 실행하세요.")
    return json.loads(path.read_text(encoding="utf-8"))


def save(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def make_client(args, d: Path):
    log = d / "calls.jsonl"
    return MockClaude(log) if args.mock else Claude(args.model, log)


def file_block(path: Path) -> dict:
    data = path.read_bytes()
    if path.suffix.lower() in (".txt", ".md"):
        return {"type": "text", "text": f"[파일: {path.name}]\n{data.decode('utf-8')}"}
    if path.suffix.lower() == ".pdf":
        if len(data) > MAX_PDF_BYTES:
            sys.exit(f"{path.name}: 30MB 를 넘습니다. 쪽을 나눠 올려 주세요.")
        return {"type": "document", "source": {"type": "base64", "media_type": "application/pdf",
                                                "data": base64.b64encode(data).decode()}}
    media = mimetypes.guess_type(path.name)[0]
    if media not in ("image/png", "image/jpeg", "image/gif", "image/webp"):
        sys.exit(f"{path.name}: PDF · 이미지(png · jpg · gif · webp) · 텍스트(.txt)만 넣을 수 있습니다.")
    return {"type": "image", "source": {"type": "base64", "media_type": media,
                                         "data": base64.b64encode(data).decode()}}


def progress(done, total, label):
    print(f"\r  {label} {done}/{total}", end="", flush=True)
    if done == total:
        print()


# ---------------------------------------------------------------------------
# 단계
# ---------------------------------------------------------------------------

def cmd_split(args):
    d = run_dir(args.name)
    files = [Path(f) for f in args.files]
    if not files and not args.mock:
        sys.exit("나눌 시험지 파일(PDF · 이미지 · 텍스트)을 적어 주세요.")
    for f in files:
        if not f.exists():
            sys.exit(f"{f} 파일이 없습니다.")
    subject = args.subject or ("영어" if args.mock else None)
    if subject not in P.SUBJECTS:
        sys.exit("--subject 를 영어 · 국어 · 수학 중 하나로 적어 주세요.")
    exam_name = args.exam or (files[0].stem if files else "모의 데이터")
    client = make_client(args, d)

    print(f"[1/3] 시험지 나누기 · {exam_name} ({subject})")
    content = [file_block(f) for f in files]
    content.append({"type": "text", "text": P.SPLIT_USER.format(subject=subject, exam_name=exam_name)})
    started = time.time()
    data = client.json_call("split", exam_name, P.SPLIT_SYSTEM, content, P.SPLIT_SCHEMA,
                            effort=args.split_effort, max_tokens=64000)
    seconds = round(time.time() - started, 1)
    units = data["units"]
    for i, u in enumerate(units, 1):
        u["id"] = f"u{i:02d}"
    save(d / "split.json", {
        "subject": subject, "exam_name": exam_name, "exam_title": data["exam_title"],
        "files": [f.name for f in files], "model": client.model, "seconds": seconds,
        "created": datetime.now().isoformat(timespec="seconds"), "units": units,
    })
    fig = sum(u["has_figure"] for u in units)
    low = sum(u["confidence"] == "low" for u in units)
    print(f"  단위 {len(units)}개 · 그림 포함 {fig} · 확실하지 않음 {low} · {seconds}초")


def select_units(units, spec, include_figures):
    picked = units
    if spec:
        wanted = parse_ranges(spec)
        picked = [u for u in units if unit_first_no(u) in wanted]
    skipped = [] if include_figures else [u for u in picked if u["has_figure"]]
    return [u for u in picked if u not in skipped], skipped


def cmd_generate(args):
    d = run_dir(args.name)
    split = load(d / "split.json")
    subject = split["subject"]
    preset = args.preset or P.DEFAULT_PRESET[subject]
    if preset not in P.PRESETS[subject]:
        sys.exit(f"{subject} 출제 방식은 {', '.join(P.PRESETS[subject])} 중 하나입니다.")
    count = 3 if preset == "set3" else args.per_unit
    units, skipped = select_units(split["units"], args.units, args.include_figures)
    if not units:
        sys.exit("고른 단위가 없습니다. --units 범위를 확인해 주세요.")
    if (d / "items.json").exists() and not args.force:
        sys.exit("items.json 이 이미 있습니다. 다시 만들려면 --force 를 붙여 주세요(검토 기록과 맞지 않게 됩니다).")
    client = make_client(args, d)
    system = P.gen_system(subject)

    print(f"[2/3] 문항 만들기 · 방식 {preset} · 단위 {len(units)}개 × {count}문항"
          + (f" · 그림 포함 {len(skipped)}개 제외" if skipped else ""))

    def work(unit):
        text = P.GEN_USER.format(
            exam_name=split["exam_name"], numbers=unit["numbers"], type_label=unit["type_label"],
            unit_text=P.unit_text(unit), preset_text=P.PRESETS[subject][preset],
            count_line=f"문항 수: {count}개",
        )
        started = time.time()
        try:
            out = client.json_call("generate", unit["id"], system, text, P.GEN_SCHEMA, effort=args.effort)
            return unit, out["items"], None, time.time() - started
        except Exception as e:  # 한 단위가 실패해도 나머지는 계속한다
            return unit, [], f"{type(e).__name__}: {e}", time.time() - started

    items, failures, done = [], [], 0
    started = time.time()
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for unit, got, err, secs in pool.map(work, units):
            done += 1
            progress(done, len(units), "단위")
            if err:
                failures.append({"unit": unit["id"], "numbers": unit["numbers"], "error": err})
            for k, it in enumerate(got, 1):
                it.update({"id": f"{unit['id']}-{k}", "unit_id": unit["id"], "preset": preset,
                           "gen_seconds": round(secs, 1)})
                items.append(it)
    save(d / "items.json", {
        "preset": preset, "per_unit": count, "model": client.model, "effort": args.effort,
        "seconds": round(time.time() - started, 1), "skipped_figure_units": [u["id"] for u in skipped],
        "failures": failures, "items": items,
    })
    print(f"  문항 {len(items)}개" + (f" · 실패 {len(failures)}단위" if failures else ""))
    for f in failures:
        print(f"  ! {f['numbers']}번: {f['error']}")


def check_evidence(item, unit):
    if not item.get("evidence"):
        return False
    passage = norm_text(unit.get("passage", "") + " " + " ".join(q["stem"] for q in unit.get("questions", [])))
    return all(norm_text(e) and norm_text(e) in passage for e in item["evidence"])


def answers_match(item, v):
    if item.get("choices"):
        return item["answer"] == v.get("answer")
    return norm_answer(item.get("answer_text")) == norm_answer(v.get("answer_text"))


def cmd_verify(args):
    d = run_dir(args.name)
    split = load(d / "split.json")
    gen = load(d / "items.json")
    subject = split["subject"]
    units = {u["id"]: u for u in split["units"]}
    client = make_client(args, d)
    items = gen["items"]
    math = subject == "수학"
    print(f"[3/3] 자동 검사 · 문항 {len(items)}개 · 정답을 숨기고 다시 풀기"
          + (" (계산은 code_execution)" if math else " + 근거 문장 대조"))

    def work(item):
        unit = units[item["unit_id"]]
        text = P.VERIFY_USER.format(unit_text=P.unit_text(unit), item_text=P.item_text(item))
        try:
            if math:
                v = client.code_json_call("verify", item["id"], P.VERIFY_SYSTEM,
                                          text + P.VERIFY_MATH_EXTRA, effort=args.effort)
            else:
                v = client.json_call("verify", item["id"], P.VERIFY_SYSTEM, text, P.VERIFY_SCHEMA,
                                     effort=args.effort, max_tokens=16000)
            return item, v, None
        except Exception as e:
            return item, None, f"{type(e).__name__}: {e}"

    done = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        for item, v, err in pool.map(work, items):
            done += 1
            progress(done, len(items), "문항")
            ev = None if math else check_evidence(item, units[item["unit_id"]])
            if err:
                item["auto"] = {"error": err, "evidence_ok": ev, "solve_match": None, "pass": False}
                continue
            match = answers_match(item, v)
            issues = v.get("issues") or []
            item["auto"] = {
                "evidence_ok": ev, "solve_match": match, "solve_answer": v.get("answer"),
                "solve_answer_text": v.get("answer_text", ""), "issues": issues,
                "reason": v.get("reason", ""), "pass": match and not issues and ev is not False,
            }
    save(d / "items.json", gen)
    passed = sum(i["auto"]["pass"] for i in items)
    print(f"  자동 검사 통과 {passed}/{len(items)}")
    dist = answer_distribution(items)
    if dist:
        print("  정답 번호 분포 " + " · ".join(f"{k}번 {v}" for k, v in dist.items()))


def answer_distribution(items):
    mc = [i["answer"] for i in items if i.get("choices")]
    return {n: mc.count(n) for n in range(1, 6)} if mc else {}


def cmd_review(args):
    d = run_dir(args.name)
    split = load(d / "split.json")
    gen = load(d / "items.json")
    data = {
        "run": {"name": args.name, "subject": split["subject"], "exam_name": split["exam_name"],
                "exam_title": split["exam_title"], "model": gen["model"], "preset": gen["preset"],
                "mock": gen["model"] == "mock"},
        "units": split["units"],
        "items": gen["items"],
    }
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    html = TEMPLATE.read_text(encoding="utf-8").replace("/*__DATA__*/null", blob)
    out = d / "review.html"
    out.write_text(html, encoding="utf-8")
    print(f"검토 화면: {out}")
    print("  선생님께 이 파일을 보내 브라우저로 열게 하고, 다 보면 '결과 내려받기'로 받은 JSON 을 돌려받으세요.")


# ---------------------------------------------------------------------------
# 보고서
# ---------------------------------------------------------------------------

def pct(a, b):
    return f"{a / b * 100:.0f}%" if b else "-"


def cmd_report(args):
    d = run_dir(args.name)
    split = load(d / "split.json")
    gen = load(d / "items.json")
    items = {i["id"]: i for i in gen["items"]}
    reviews = [json.loads(Path(f).read_text(encoding="utf-8")) for f in args.reviews]
    for r in reviews:
        if r.get("run") != args.name:
            print(f"  ! {r.get('reviewer')} 의 기록은 '{r.get('run')}' 실행 것입니다. 그래도 합칩니다.")

    lines = [f"# AI 출제 테스트 결과 · {args.name}", "",
             f"- 시험지: {split['exam_name']} ({split['subject']}) · 모델 {gen['model']} · 방식 {gen['preset']}",
             f"- 검토한 선생님: {', '.join(r.get('reviewer') or '이름 없음' for r in reviews) or '없음'}",
             f"- 만든 날: {split['created'][:10]}", ""]

    # 1. 시험지 나누기
    unit_votes = [(uid, v) for r in reviews for uid, v in (r.get("units") or {}).items() if v.get("ok") is not None]
    split_ok = sum(v["ok"] for _, v in unit_votes)
    split_rate = split_ok / len(unit_votes) if unit_votes else None
    units = split["units"]
    lines += ["## 1. 시험지 나누기 (통째로 넣기)", "",
              "| 항목 | 값 |", "|---|---|",
              f"| 나눈 단위 | {len(units)}개 |",
              f"| 그림 · 도표 포함 (자동 생성에서 제외) | {sum(u['has_figure'] for u in units)}개 |",
              f"| AI 가 '확실하지 않음' 표시 | {sum(u['confidence'] == 'low' for u in units)}개 |",
              f"| 나누기 시간 | {split['seconds']}초 |",
              f"| 선생님 확인: 맞게 나눔 | {split_ok}/{len(unit_votes)} ({pct(split_ok, len(unit_votes))}) |", ""]
    reasons = tally(v.get("reasons") for _, v in unit_votes if not v["ok"])
    if reasons:
        lines += ["틀린 이유: " + " · ".join(f"{k} {n}" for k, n in reasons), ""]

    # 2. 문항 품질
    votes = [(iid, v) for r in reviews for iid, v in (r.get("items") or {}).items()
             if v.get("verdict") and iid in items]
    n = len(votes)
    asis = sum(v["verdict"] == "asis" for _, v in votes)
    edit = sum(v["verdict"] == "edit" for _, v in votes)
    reject = sum(v["verdict"] == "reject" for _, v in votes)
    lines += ["## 2. 문항 품질 (선생님 판정)", "",
              f"만든 문항 {len(items)}개 중 검토 {n}건" + (f" · 실패한 단위 {len(gen['failures'])}개" if gen["failures"] else ""), "",
              "| 판정 | 건수 | 비율 |", "|---|---|---|",
              f"| 그대로 사용 | {asis} | {pct(asis, n)} |",
              f"| 고쳐서 사용 | {edit} | {pct(edit, n)} |",
              f"| 사용 불가 | {reject} | {pct(reject, n)} |",
              f"| **쓸 수 있음 (그대로 + 고쳐서)** | {asis + edit} | {pct(asis + edit, n)} |", ""]
    by_type = {}
    for iid, v in votes:
        by_type.setdefault(items[iid]["type_label"], []).append(v["verdict"])
    if len(by_type) > 1:
        lines += ["| 유형 | 검토 | 그대로 | 쓸 수 있음 |", "|---|---|---|---|"]
        for t, vs in sorted(by_type.items(), key=lambda x: -len(x[1])):
            lines.append(f"| {t} | {len(vs)} | {pct(vs.count('asis'), len(vs))} | "
                         f"{pct(vs.count('asis') + vs.count('edit'), len(vs))} |")
        lines.append("")
    reasons = tally(v.get("reasons") for _, v in votes if v["verdict"] != "asis")
    if reasons:
        lines += ["고치거나 버린 이유: " + " · ".join(f"{k} {c}" for k, c in reasons), ""]
    dist = answer_distribution(gen["items"])
    if dist:
        lines += ["정답 번호 분포: " + " · ".join(f"{k}번 {c}" for k, c in dist.items()), ""]

    # 3. 검토 시간
    secs = [v["seconds"] for _, v in votes if v.get("seconds")]
    manual = [r.get("manual_minutes") for r in reviews if r.get("manual_minutes")]
    lines += ["## 3. 선생님 검토 시간", ""]
    if secs:
        med = statistics.median(secs)
        lines += [f"- 문항 하나 검토: 중앙값 {med:.0f}초 · 평균 {statistics.mean(secs):.0f}초",
                  f"- 쓸 수 있는 문항 하나를 얻는 데 든 검토 시간: {sum(secs) / max(asis + edit, 1):.0f}초"]
        if manual:
            m = statistics.mean(manual)
            lines.append(f"- 선생님이 직접 만들 때(답변 평균): 문항당 {m:.1f}분 → "
                         f"AI + 검토는 문항당 {sum(secs) / max(asis + edit, 1) / 60:.1f}분")
    else:
        lines.append("- 기록된 검토 시간이 없습니다.")
    lines.append("")

    # 4. 자동 검사가 선생님 판정을 맞히는지
    auto = [(items[iid]["auto"]["pass"], v["verdict"]) for iid, v in votes if items[iid].get("auto")]
    if auto:
        p = [vd for ok, vd in auto if ok]
        f = [vd for ok, vd in auto if not ok]
        lines += ["## 4. 자동 검사 (다시 풀기 · 근거 대조) 와 선생님 판정", "",
                  "| 자동 검사 | 문항 | 선생님이 '사용 불가' |", "|---|---|---|",
                  f"| 통과 | {len(p)} | {pct(p.count('reject'), len(p))} |",
                  f"| 걸림 | {len(f)} | {pct(f.count('reject'), len(f))} |", ""]

    # 5. 비용 · 시간
    calls = [json.loads(l) for l in (d / "calls.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()] \
        if (d / "calls.jsonl").exists() else []
    if calls:
        price_in, price_out = PRICES.get(gen["model"], (0, 0))
        tin = sum(c["input_tokens"] for c in calls)
        tout = sum(c["output_tokens"] for c in calls)
        cost = (tin * price_in + tout * price_out) / 1_000_000
        by_kind = {}
        for c in calls:
            k = by_kind.setdefault(c["kind"], [0, 0.0])
            k[0] += 1
            k[1] += c["seconds"]
        lines += ["## 5. 비용 · 대기 시간", "",
                  f"- 호출 {len(calls)}번 · 입력 {tin:,} 토큰 · 출력 {tout:,} 토큰 · 추정 ${cost:.2f}"
                  + (" (code_execution 컨테이너 비용 별도)" if split["subject"] == "수학" else ""),
                  f"- 쓸 수 있는 문항 하나당 약 ${cost / max(asis + edit, 1):.3f}" if n else "- 검토 전이라 문항당 비용은 아직 없습니다.",
                  "- " + " · ".join(f"{k} {v[0]}번 평균 {v[1] / v[0]:.0f}초" for k, v in by_kind.items()),
                  f"- 문항 만들기 전체 대기: {gen['seconds']}초 (동시 실행)", ""]

    # 6. 판정
    lines += ["## 6. 판정", ""]
    if n:
        a, u = asis / n, (asis + edit) / n
        if a >= ASIS_OK:
            lines.append(f"- **A · 일괄 생성 기본.** 그대로 사용 {a:.0%} ≥ {ASIS_OK:.0%}. 통째로 넣고 한꺼번에 만든 뒤 훑어보는 흐름이 됩니다.")
        elif u >= USABLE_OK:
            lines.append(f"- **B · 지문 골라 돌리기 + 검토 화면.** 쓸 수 있음 {u:.0%} ≥ {USABLE_OK:.0%}, 그대로 사용은 {a:.0%}. 문항별 고치기 · 다시 만들기가 꼭 필요합니다.")
        else:
            lines.append(f"- **C · 이번 범위에서 보류.** 쓸 수 있음 {u:.0%} < {USABLE_OK:.0%}. 지시문을 고쳐 다시 시험하거나 이 과목 · 방식을 뺍니다.")
    if split_rate is not None and split_rate < SPLIT_OK:
        lines.append(f"- 지문 나누기 정확도 {split_rate:.0%} < {SPLIT_OK:.0%}: 올린 뒤 '나누기 확인' 화면이 필요합니다.")
    if auto and p and f and p.count("reject") / len(p) <= 0.15 and f.count("reject") / len(f) >= 0.5:
        lines.append("- 자동 검사가 쓸모 있습니다: 걸린 문항을 미리 빼거나 표시해 보여 주면 검토가 줄어듭니다.")
    if not n:
        lines.append("- 선생님 검토 기록이 없어 판정하지 않았습니다.")
    lines.append("")

    out = d / "report.md"
    out.write_text("\n".join(l for l in lines if l is not None), encoding="utf-8")
    with (d / "report-items.csv").open("w", encoding="utf-8-sig", newline="") as fcsv:
        w = csv.writer(fcsv)
        w.writerow(["문항", "단위", "유형", "자동검사", "근거일치", "다시풀기일치", "검토자", "판정", "이유", "검토초", "메모"])
        for r in reviews:
            for iid, v in (r.get("items") or {}).items():
                if iid not in items:
                    continue
                it, au = items[iid], items[iid].get("auto", {})
                w.writerow([iid, it["unit_id"], it["type_label"], au.get("pass"), au.get("evidence_ok"),
                            au.get("solve_match"), r.get("reviewer"), v.get("verdict"),
                            " · ".join(v.get("reasons") or []), v.get("seconds"), v.get("memo", "")])
    print("\n".join(lines))
    print(f"\n저장: {out}\n      {d / 'report-items.csv'}")


def tally(lists):
    counts = {}
    for lst in lists:
        for x in lst or []:
            counts[x] = counts.get(x, 0) + 1
    return sorted(counts.items(), key=lambda kv: -kv[1])


def cmd_all(args):
    cmd_split(args)
    cmd_generate(args)
    cmd_verify(args)
    cmd_review(args)


# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="AI 출제 수준 테스트")
    sub = ap.add_subparsers(dest="cmd", required=True)

    def common(p):
        p.add_argument("--name", required=True, help="실행 이름. outputs/<이름>/ 에 결과가 쌓입니다")
        p.add_argument("--model", default=DEFAULT_MODEL)
        p.add_argument("--mock", action="store_true", help="API 없이 가짜 응답으로 흐름만 확인")
        p.add_argument("--workers", type=int, default=4, help="동시에 보낼 요청 수")
        p.add_argument("--effort", default="high", choices=["low", "medium", "high", "xhigh", "max"])

    def split_opts(p):
        p.add_argument("files", nargs="*", help="시험지 PDF · 이미지 · 텍스트(.txt) 파일")
        p.add_argument("--subject", choices=P.SUBJECTS)
        p.add_argument("--exam", help="시험지 이름 (기본: 파일 이름)")
        p.add_argument("--split-effort", default="medium", choices=["low", "medium", "high", "xhigh", "max"])

    def gen_opts(p):
        p.add_argument("--preset", help="출제 방식 (영어 same_type · set3 · blank / 국어 same_type · set3 / 수학 twin)")
        p.add_argument("--per-unit", type=int, default=2, help="지문(문항) 하나당 만들 문항 수 (set3 은 3 고정)")
        p.add_argument("--units", help="만들 단위의 첫 문항 번호. 예: 18-24,31")
        p.add_argument("--include-figures", action="store_true", help="그림 · 도표가 있는 단위도 만들기")
        p.add_argument("--force", action="store_true")

    p = sub.add_parser("split", help="1. 시험지를 지문 · 문항 단위로 나누기")
    common(p); split_opts(p); p.set_defaults(fn=cmd_split)
    p = sub.add_parser("generate", help="2. 고른 단위로 문항 만들기")
    common(p); gen_opts(p); p.set_defaults(fn=cmd_generate)
    p = sub.add_parser("verify", help="3. 자동 검사 (정답 숨기고 다시 풀기 · 근거 대조)")
    common(p); p.set_defaults(fn=cmd_verify)
    p = sub.add_parser("review", help="4. 선생님 검토 화면(review.html) 만들기")
    common(p); p.set_defaults(fn=cmd_review)
    p = sub.add_parser("report", help="5. 검토 결과를 합쳐 보고서 만들기")
    common(p); p.add_argument("reviews", nargs="+", help="검토 화면에서 내려받은 JSON 파일들")
    p.set_defaults(fn=cmd_report)
    p = sub.add_parser("all", help="1~4 를 한 번에")
    common(p); split_opts(p); gen_opts(p); p.set_defaults(fn=cmd_all)

    args = ap.parse_args()
    if args.cmd in ("generate", "verify", "review", "report") and not (run_dir(args.name) / "split.json").exists():
        sys.exit(f"outputs/{args.name}/split.json 이 없습니다. split 부터 실행하세요.")
    args.fn(args)


if __name__ == "__main__":
    main()
