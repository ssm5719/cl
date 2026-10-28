# 시험 출제 · 시험 보관함 프로토타입

선생님 관리자 페이지에 들어갈 **시험 출제**(변형 시험지 만들기 → 검토 → 인쇄)와 **시험 보관함**(기출 · 교재 원본)을 눌러 볼 수 있게 만든 화면입니다.
1차는 내부 기획 확인 · 보고용, 2차는 선생님 사용성 테스트용입니다. 실제 서비스 코드가 아니고, AI 호출 없이 미리 만들어 둔 문항을 꺼내 보여 줍니다.

- 설계: [`../docs/specs/2026-10-28-exam-prototype-design.md`](../docs/specs/2026-10-28-exam-prototype-design.md)
- 구현 계획: [`../docs/plans/2026-10-28-exam-prototype.md`](../docs/plans/2026-10-28-exam-prototype.md)

## 두 가지 판

| | 데이터 | 어디서 여나 |
|---|---|---|
| 저장소 판 | `data/sample.json` — 직접 쓴 예문 · 예시 문항 | GitHub Pages `https://ssm5719.github.io/cl/aitest/prototype/` (켜져 있을 때), 또는 아래처럼 로컬 |
| 아티팩트 판 (사내 공유) | `data/real.json` — 2026년 10월 고2 학력평가 국어 · 영어로 만든 실제 변형 문항 | Claude 아티팩트(비공개) `https://claude.ai/artifact/HhXNsX3e9JCHD6y2msmMkW` — 공유 범위는 올린 사람이 정합니다 |

실제 문항은 원본 시험지(EBSi "무단 전재 및 재배포 금지")에서 나온 것이라 **`real.json` 과 `dist/` 는 저장소에 올리지 않습니다**(`aitest/.gitignore`).

아티팩트 판에서는 다음이 다릅니다.

- 인쇄가 막혀 있어 [인쇄 / PDF 저장] 자리에 안내 문구가 나옵니다. 인쇄 모양은 ④ 미리보기로 봅니다. 실제 인쇄를 보여 줘야 하면 로컬에서 dist 를 엽니다.
- 만든 시험지는 그 브라우저에만 저장됩니다. 위쪽 [처음으로] 를 두 번 누르면 지웁니다.

## 로컬에서 열기

저장소 루트에서 서버를 띄웁니다(`lab/css` 를 함께 쓰기 때문에 루트에서 띄워야 합니다).

```bash
python3 -m http.server 8000
```

브라우저에서 `http://localhost:8000/aitest/prototype/` 를 엽니다.

## 검사

`aitest/prototype` 에서 돌립니다.

```bash
node --test test/*.test.js
```

```bash
python3 -m unittest discover -s test
```

```bash
node test/e2e.mjs
```

e2e 는 Playwright 로 저장소 루트를 8099 포트에 띄워 화면을 눌러 봅니다. 실제 데이터 판을 검사하려면 `--base aitest/prototype/dist/` 를 붙입니다.

## 실제 데이터로 아티팩트 다시 만들기

1. `aitest/outputs/` 에 1차(`eng-2610`, `kor-2610`) · 유형 묶음(`eng-2610-groups`, `kor-2610-groups`) 실행 결과가 있어야 합니다.
2. 실제 데이터로 바꾸고 dist 를 만듭니다.

```bash
python3 tools/to_real.py
```

```bash
python3 build.py --real
```

3. `dist/index.html` 과 나머지 파일을 같은 아티팩트로 다시 올립니다(Claude 에게 "프로토타입 아티팩트 다시 올려 줘").
4. `python3 build.py` 로 `data/data.js` 를 예시 데이터로 되돌립니다. dist 를 만든 뒤에도 저장소 쪽 `data.js` 는 예시 그대로지만, 확인 삼아 돌려 두세요.

## 파일

| 파일 | 내용 |
|---|---|
| `index.html` | 껍데기(위쪽 막대 · 왼쪽 메뉴). 화면 내용은 `js/views/` 가 그립니다 |
| `js/app.js` | 주소(`#exams` · `#library` · `#paper-<id>` · `#upload` · `#new` · `#new-<id>`) · 그리기 · 공통 동작 |
| `js/constants.js` | 과목 · 유형 묶음(영어 7 · 국어 6) · 주의 표시 · 문구 |
| `js/generator.js` | 문항 수 나누기 · 유형 배분 · 문항 풀에서 꺼내기 · 정답 위치 섞기 |
| `js/store.js` | 만든 시험지 · 붙여 넣은 지문 저장(브라우저 저장소, 안 되면 메모리) |
| `js/views/` | 보관함 · 만든 시험지 목록 · 출제 4단계(자료 · 방식 · 검토 · 인쇄) |
| `app.css` · `print.css` | 프로토타입 전용 부품 · A4 인쇄 |
| `build.py` | 데이터를 `data/data.js` 로 넣기, `--real` 이면 아티팩트용 `dist/` |
| `tools/to_real.py` | aitest 실행 결과 → `data/real.json` |
