"""aitest 실행 결과를 프로토타입 실제 데이터(data/real.json)로 바꾼다. real.json 은 저장소에 올리지 않는다.

    python3 tools/to_real.py

읽는 것 (aitest/outputs, 저장소에 없음)
  eng-2610 / kor-2610                 1차 테스트: 나눈 시험지(split.json) + 원래 유형 그대로 문항(items.json)
  eng-2610-groups / kor-2610-groups   유형 묶음 풀 문항(items.json, auto 포함)
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent          # aitest/prototype
OUT = HERE.parent / 'outputs'

PAPERS = {
    '영어': {'id': 'r-en', 'run': 'eng-2610', 'title': '2026 10월 고2 학력평가 영어', 'by': '이현우', 'date': '2026-10-22'},
    '국어': {'id': 'r-ko', 'run': 'kor-2610', 'title': '2026 10월 고2 학력평가 국어', 'by': '김지수', 'date': '2026-10-22'},
}
# 지문 자체는 글로 읽히고, 그림은 마지막 문항(20번)에만 필요한 묶음 — 자동 출제 대상으로 둔다.
FIGURE_ONLY_IN_ONE_QUESTION = {('국어', '17~20')}


def norm(s):
    return re.sub(r'\s+', ' ', re.sub(r'</?u>', '', str(s or ''))).strip()


def genre(subject, unit):
    if subject != '국어':
        return '기타'
    label = unit['type_label']
    return '문학' if label.startswith('문학') else '독서' if label.startswith('독서') else '기타'


def leak_strings(unit):
    """원래 문항의 정답 후보 중, 새 문항 지문에 다시 나오면 '원래 정답 노출'로 볼 글."""
    q = (unit.get('questions') or [{}])[0]
    if unit['type_label'] == '빈칸':
        return [c for c in q.get('choices', []) if len(norm(c)) >= 8]
    if unit['type_label'] == '문장 삽입':
        lines = [l for l in str(q.get('stem', '')).split('\n') if l.strip()]
        return lines[-1:] if len(lines) > 1 else []
    return []


def flags_of(item, unit):
    auto = item.get('auto') or {}
    out = []
    if auto.get('solve_match') is False or auto.get('issues'):
        out.append('solve_mismatch')
    if auto.get('evidence_ok') is False:
        out.append('no_evidence')
    stem = norm(item['stem'])
    if any(norm(s) and norm(s) in stem for s in leak_strings(unit)):
        out.append('answer_leak')
    return out


def load(run, name):
    p = OUT / run / name
    return json.loads(p.read_text(encoding='utf-8')) if p.exists() else None


def convert():
    papers, pool = [], []
    for subject, meta in PAPERS.items():
        split = load(meta['run'], 'split.json')
        if not split:
            raise SystemExit(f"aitest/outputs/{meta['run']}/split.json 이 없습니다.")
        units = []
        for u in split['units']:
            u = {k: u[k] for k in ('id', 'numbers', 'type_label', 'passage', 'questions', 'has_figure', 'figure_desc', 'confidence', 'note')}
            u['genre'] = genre(subject, u)
            if (subject, u['numbers']) in FIGURE_ONLY_IN_ONE_QUESTION:
                u['has_figure'] = False
                u['note'] = (u['note'] + ' ' if u['note'] else '') + '20번만 그림이 필요해 지문은 자동 출제 대상으로 둠'
            units.append(u)
        by_id = {u['id']: u for u in units}
        papers.append({'id': meta['id'], 'subject': subject, 'title': meta['title'], 'kind': '학력평가', 'grade': '고2',
                       'ym': '2026-10', 'by': meta['by'], 'date': meta['date'], 'units': units})
        for run, group_default in ((meta['run'], 'original'), (meta['run'] + '-groups', None)):
            data = load(run, 'items.json')
            if not data:
                continue
            for it in data['items']:
                unit = by_id[it['unit_id']]
                if unit['has_figure']:
                    continue
                form = it.get('form') or '5지'
                pool.append({
                    'id': f"{meta['id']}-{'o' if group_default else 'g'}-{it['id']}", 'paperId': meta['id'], 'unitId': it['unit_id'],
                    'group': group_default or it['group'], 'subtype': it.get('subtype') or it['type_label'], 'form': form,
                    'stem': it['stem'], 'choices': it['choices'], 'answer': it['answer'], 'answer_text': it.get('answer_text', ''),
                    'explanation': it['explanation'], 'evidence': it.get('evidence', []), 'rubric': it.get('rubric', []),
                    'flags': flags_of(it, unit),
                })
    return {'demo': 'real', 'papers': papers, 'pool': pool}


if __name__ == '__main__':
    data = convert()
    (HERE / 'data' / 'real.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
    flagged = sum(1 for i in data['pool'] if i['flags'])
    print(f"data/real.json ← 시험지 {len(data['papers'])} · 문항 풀 {len(data['pool'])} (주의 {flagged})")
