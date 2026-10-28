"""AI 출제 테스트에 쓰는 지시문 · 출제 방식 · JSON 스키마.

지시문을 고쳐 가며 다시 돌려 보는 일이 많으므로 코드와 따로 둔다.
"""

SUBJECTS = ("영어", "국어", "수학")

# ---------------------------------------------------------------------------
# 1단계: 시험지 나누기
# ---------------------------------------------------------------------------

SPLIT_SYSTEM = """너는 한국 고등학교 시험지(수능 · 평가원 모의평가 · 교육청 학력평가 · 학교 시험)를
문항 데이터로 옮기는 편집자다. 받은 시험지를 '단위'로 나눠 원문 그대로 옮긴다.

나누는 기준
- 영어: 듣기 문항(보통 1~17번)은 넣지 않는다. 지문 하나가 단위 하나다.
  지문 하나에 문항이 여럿 붙은 장문(예: 41~42번, 43~45번)은 묶어서 단위 하나로 둔다.
- 국어: [n~m] 처럼 지문 하나에 묶인 문항들이 단위 하나다. 선택 과목(화법과 작문, 언어와 매체)도 같다.
  지문 없이 혼자 있는 문항(문법 등)은 문항 하나가 단위 하나다.
- 수학: 문항 하나가 단위 하나다. 수식은 LaTeX 로 적고 $...$ 로 감싼다.

옮기는 규칙
- 지문과 문항은 원문 그대로 옮긴다. 요약 · 다듬기 · 번역을 하지 않는다.
- 밑줄 · 빈칸 · (A)(B) 표시 · 번호 기호는 글자로 살린다. 밑줄은 <u>...</u>, 빈칸은 ________ 로 적는다.
- 그림 · 도표 · 그래프 · 표가 문제 풀이에 필요하면 has_figure 를 true 로 두고 figure_desc 에 무엇이 있는지 적는다.
- 글자가 흐리거나 잘려 확실하지 않은 곳이 있으면 confidence 를 "low" 로 두고 note 에 어디가 그런지 적는다.
- type_label 에는 그 단위의 유형을 짧게 적는다. 영어는 '글의 목적', '빈칸', '글의 순서' 같은 유형,
  국어는 '독서 · 기술', '문학 · 현대시', '문법' 같은 영역, 수학은 '수열', '미분' 같은 단원.
"""

SPLIT_USER = """첨부한 시험지는 {subject} 과목이다. 시험지 이름: {exam_name}
위 기준으로 모든 단위를 빠짐없이 나눠 줘."""

SPLIT_SCHEMA = {
    "type": "object",
    "properties": {
        "exam_title": {"type": "string"},
        "units": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "numbers": {"type": "string", "description": "문항 번호. 하나면 '18', 묶음이면 '41~42'"},
                    "type_label": {"type": "string"},
                    "passage": {"type": "string", "description": "지문 원문. 수학처럼 지문이 없으면 빈 문자열"},
                    "questions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "number": {"type": "string"},
                                "stem": {"type": "string", "description": "발문과 <보기>까지"},
                                "choices": {"type": "array", "items": {"type": "string"}},
                            },
                            "required": ["number", "stem", "choices"],
                            "additionalProperties": False,
                        },
                    },
                    "has_figure": {"type": "boolean"},
                    "figure_desc": {"type": "string"},
                    "confidence": {"type": "string", "enum": ["high", "low"]},
                    "note": {"type": "string"},
                },
                "required": ["numbers", "type_label", "passage", "questions", "has_figure",
                             "figure_desc", "confidence", "note"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["exam_title", "units"],
    "additionalProperties": False,
}

# ---------------------------------------------------------------------------
# 2단계: 문항 만들기
# ---------------------------------------------------------------------------

GEN_SYSTEM_COMMON = """너는 한국 학원에서 내신 · 모의고사 대비 시험지를 만드는 {subject} 출제 선생님이다.
선생님이 고른 자료 하나를 받아 새 문항을 만든다.

지켜야 할 것
- 받은 자료 안의 내용만으로 풀 수 있게 만든다. 자료 밖 지식이 있어야 풀리는 문항은 만들지 않는다.
- 정답은 정확히 하나다. 다른 선택지가 정답으로 읽힐 여지가 있으면 고친다.
- 오답 선택지도 그럴듯하게 만들되, 왜 틀렸는지 자료로 설명할 수 있어야 한다.
- 원래 문항의 발문과 선택지를 그대로 베끼지 않는다.
- 선택지는 5개, answer 는 정답 선택지의 번호(1~5)다. 서답형이면 choices 를 비우고 answer 를 0 으로 두며 answer_text 에 모범 답을 적는다.
- explanation 에는 정답 근거와, 오답 선택지 가운데 헷갈리기 쉬운 것이 왜 틀렸는지를 짧게 적는다.
"""

GEN_SYSTEM_READING = """- evidence 에는 정답의 근거가 되는 문장을 지문에서 한 글자도 바꾸지 말고 그대로 옮긴다(1~3개).
  지문에 없는 문장을 evidence 에 적으면 안 된다.
- 문항끼리 정답 번호가 한쪽으로 몰리지 않게 한다.
"""

GEN_SYSTEM_MATH = """- 수식은 LaTeX 로 적고 $...$ 로 감싼다.
- evidence 는 비워 두고, explanation 에 풀이를 단계별로 적는다.
- 숫자를 바꿀 때는 계산 결과가 깔끔한 값(정수나 간단한 분수)이 되게 고르고, 조건끼리 모순이 없는지 확인한다.
- 원래 문제가 다루는 교육과정 범위와 난이도를 벗어나지 않는다.
"""

# 출제 방식: 선생님이 고르는 '카드' 하나에 해당한다.
PRESETS = {
    "영어": {
        "same_type": "원래 문항과 같은 유형으로, 발문 · 선택지 · 정답 위치를 바꾼 변형 문항을 만든다.",
        "set3": "지문 하나로 서로 다른 유형 3가지(예: 주제 또는 제목, 내용 일치 · 불일치, 어휘 또는 어법)를 한 문항씩 만든다. 원래 문항과 같은 유형은 피한다.",
        "blank": "지문의 핵심 문장 하나를 빈칸으로 바꾼 빈칸 추론 문항을 만든다. 빈칸 자리는 지문 원문에 ________ 로 표시해 stem 에 지문 전체를 다시 싣는다.",
    },
    "국어": {
        "same_type": "원래 문항들과 같은 성격(사실적 · 추론적 · 비판적 읽기 등)으로, 발문과 선택지를 바꾼 변형 문항을 만든다.",
        "set3": "지문 하나로 사실적 읽기 1문항, 추론적 읽기 1문항, <보기> 적용 또는 비판적 읽기 1문항을 만든다.",
    },
    "수학": {
        "twin": "원래 문제의 풀이 흐름은 그대로 두고 숫자와 조건만 바꾼 쌍둥이 문제를 만든다. 문제 형식(객관식 · 단답형)도 원래와 같게 둔다.",
    },
}

DEFAULT_PRESET = {"영어": "same_type", "국어": "same_type", "수학": "twin"}

GEN_USER = """[자료] {exam_name} · {numbers}번 · {type_label}

{unit_text}

[요청]
{preset_text}
{count_line}"""

GEN_SCHEMA = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type_label": {"type": "string"},
                    "stem": {"type": "string"},
                    "choices": {"type": "array", "items": {"type": "string"}},
                    "answer": {"type": "integer"},
                    "answer_text": {"type": "string"},
                    "explanation": {"type": "string"},
                    "evidence": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["type_label", "stem", "choices", "answer", "answer_text",
                             "explanation", "evidence"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["items"],
    "additionalProperties": False,
}

# ---------------------------------------------------------------------------
# 3단계: 자동 검사 (정답을 숨기고 다시 풀기)
# ---------------------------------------------------------------------------

VERIFY_SYSTEM = """너는 시험 문항 검수자다. 새로 만든 문항을 정답 없이 받아 직접 푼다.
자료만 근거로 판단하고, 문항에 문제가 있으면 issues 에 적는다.
issues 에 쓸 수 있는 값: "정답 없음", "복수 정답", "자료로 판단 불가", "조건 모순", "발문 모호", "오탈자".
문제가 없으면 issues 는 빈 배열이다."""

VERIFY_USER = """[자료]
{unit_text}

[문항]
{item_text}

이 문항을 풀어라. 객관식이면 answer 에 정답 번호(1~5)를, 서답형이면 answer 를 0 으로 두고 answer_text 에 답을 적어라."""

VERIFY_MATH_EXTRA = """
반드시 code_execution 으로 Python(sympy 등)을 써서 답을 계산해 확인하라.
마지막 응답은 아래 JSON 한 덩어리만 적는다.
{"answer": 정수, "answer_text": "답", "issues": [], "reason": "한두 문장"}"""

VERIFY_SCHEMA = {
    "type": "object",
    "properties": {
        "answer": {"type": "integer"},
        "answer_text": {"type": "string"},
        "issues": {"type": "array", "items": {"type": "string"}},
        "reason": {"type": "string"},
    },
    "required": ["answer", "answer_text", "issues", "reason"],
    "additionalProperties": False,
}


def gen_system(subject: str) -> str:
    extra = GEN_SYSTEM_MATH if subject == "수학" else GEN_SYSTEM_READING
    return GEN_SYSTEM_COMMON.format(subject=subject) + extra


def unit_text(unit: dict) -> str:
    """단위 하나를 지시문에 넣을 글로 만든다."""
    parts = []
    if unit.get("passage"):
        parts.append("[지문]\n" + unit["passage"])
    if unit.get("has_figure") and unit.get("figure_desc"):
        parts.append("[그림 · 도표 설명]\n" + unit["figure_desc"])
    for q in unit.get("questions", []):
        line = f"[원래 문항 {q['number']}번]\n{q['stem']}"
        if q.get("choices"):
            line += "\n" + "\n".join(f"{i}. {c}" for i, c in enumerate(q["choices"], 1))
        parts.append(line)
    return "\n\n".join(parts)


def item_text(item: dict) -> str:
    text = item["stem"]
    if item.get("choices"):
        text += "\n" + "\n".join(f"{i}. {c}" for i, c in enumerate(item["choices"], 1))
    return text
