# 시험 출제 · 시험 보관함 프로토타입 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 선생님 관리자 화면 안에서 '시험 보관함 → 새 시험지 만들기 4단계 → 인쇄 · 저장 → 만든 시험지 목록'을 눌러 볼 수 있는 프로토타입을 만들고, 실제 1차 테스트 문항을 넣은 사내 공유 아티팩트로 올린다.

**Architecture:** 빌드 도구 없는 정적 페이지. 화면은 ES 모듈 몇 개로 나누고, 문항을 만드는 부분은 `generator.js` 의 `generate()` 하나로 감싸 2차에 AI 호출로 바꿀 수 있게 한다. 데이터는 `data/*.json` 을 `build.py` 가 `data/data.js`(전역 `window.EXAM_DATA`)로 바꿔 넣는다 — 예시 데이터는 저장소에, 실제 데이터는 아티팩트 묶음에만 들어간다.

**Tech Stack:** HTML · CSS · 브라우저 JS(ES 모듈, 외부 라이브러리 없음), 기존 `lab/css/*` 디자인 시스템, 테스트는 `node --test`(Node 22) · Playwright(설치되어 있음) · Python `unittest`.

**Spec:** `aitest/docs/specs/2026-10-28-exam-prototype-design.md`

## Global Constraints

- 과목은 영어 · 국어만. 수학 · 학생 응시 · 배포 · 채점 · 사용량 한도 화면은 만들지 않는다.
- 화면 글은 한국어. 화면 모양은 `lab/css/cl-tokens.css` · `base.css` · `components.css` · `teacher.css` 를 그대로 쓰고, 새 부품만 `app.css` 에 더한다. 색 · 간격은 `--cl-*` 토큰만 쓴다.
- 단계 이름은 정확히 `① 자료` `② 방식` `③ 검토` `④ 인쇄`.
- 문항 수 요약 글은 정확히 `지문 {n}개 × {k}문항 = {n×k}문항` (총 문항 수 모드는 `지문 {n}개 · 총 {t}문항`).
- 항상 적용 규칙 문구 3개: `원래 문항의 정답이 새 문항에 드러나지 않게` · `정답 번호 고르게` · `고른 지문 안에서만 출제`.
- 정답 한 번호가 전체의 40%를 넘으면 [정답 위치 섞기] 를 보인다.
- 그림이 필요한 지문(`has_figure: true`)은 고를 수 없고 `그림이 있어 자동 출제에서 빠져요` 를 보인다.
- 실제 학력평가 지문 · 문항(`data/real.json`, `dist/`)은 저장소에 올리지 않는다(`.gitignore`). 아티팩트는 비공개로 만들고 공유는 사용자가 정한다.
- 저장은 브라우저 `localStorage` 만(키 접두사 `cl-exam-proto:`), 막혀 있어도 화면은 메모리로 동작한다. 구석에 `데모 · 이 브라우저에만 저장` 과 [데모 처음으로].
- 너비 1440 · 1024 · 390 에서 가로 스크롤이 생기지 않는다.

## Review Focus

- 데모 문항 풀에 없는 (지문, 묶음)을 고름 → 같은 지문의 다른 문항으로 대신하고 카드에 `데모: 미리 만든 문항으로 대신 보여 줘요`. 빈 결과 · 오류 없음. (Task 2 테스트)
- 고른 묶음이 지문에 하나도 맞지 않음(예: 독서 지문에 '표현 · 감상'만) → 맞는 다른 묶음으로 바꾸고 `유형 바꿈` 주의 표시. (Task 2 테스트)
- 그림 지문이 섞인 시험지에서 [전체 선택] → 그림 지문은 빠지고 요약 수에도 안 들어감. (Task 6 e2e)
- 총 문항 수 모드에서 총수 < 지문 수 (예: 지문 8개 · 총 3문항) → 앞 3개 지문에 1문항씩, 나머지 0, 요약 `지문 8개 · 총 3문항`; 총 0 이하는 [문제 만들기] 비활성. (Task 2 테스트 · Task 7 e2e)
- `localStorage` 가 예외를 던짐(사생활 보호 모드) → 화면은 그대로 동작, 저장만 안 됨. (Task 3 테스트)

---

## 파일 구조

```
aitest/prototype/
├─ package.json            {"type":"module","private":true} — node --test 용
├─ index.html              작업공간 틀(상단 바 · 사이드바 '나의 시험') + <main id="app">
├─ app.css                 새 부품: 단계 표시 · 칩 묶음 · 아래 고정 바 · 문항 카드 · A4 미리보기 · 데모 표시
├─ print.css               @media print — A4, 1단/2단, 문항 안 쪼개짐
├─ js/constants.js         과목 · 종류 · 유형 묶음(GROUPS) · 주의 사유(FLAGS) · 문구
├─ js/generator.js         순수 계산 + generate() (데모: 풀에서 꺼냄)
├─ js/store.js             localStorage 감싸기 · 만든 시험지 · 붙여 넣은 지문
├─ js/app.js               해시 라우터 · 그리기 · 이벤트 위임
├─ js/views/exams.js       만든 시험지 목록
├─ js/views/library.js     보관함 목록 · 시험지 상세 · 시험지 올리기(데모)
├─ js/views/wizard.js      4단계 틀(단계 표시 · 아래 바 · 단계 전환)
├─ js/views/step-source.js ① 자료
├─ js/views/step-method.js ② 방식 + 진행 화면
├─ js/views/step-review.js ③ 검토
├─ js/views/step-print.js  ④ 인쇄 · 저장
├─ data/sample.json        직접 쓴 예시 데이터 (올림)
├─ data/real.json          실제 1차 테스트 데이터 (올리지 않음)
├─ data/data.js            build.py 결과 (sample 로 만든 것만 올림)
├─ build.py                data.js 만들기 · 아티팩트 묶음(dist/) 만들기
├─ test/*.test.js          node --test
├─ test/test_build.py      unittest
└─ test/e2e.mjs            Playwright 시나리오
```

설계 문서 8장의 `app.js` 를 화면별 파일로 나눴다(한 파일이 4단계 전부를 들면 너무 커서).

## 데이터 모양 (모든 Task 공통)

```
EXAM_DATA = { demo: 'sample'|'real', papers: Paper[], pool: Item[] }
Paper = { id, subject:'영어'|'국어', title, kind:'수능'|'모의평가'|'학력평가'|'내신'|'직접 추가',
          grade:'고1'|'고2'|'고3', ym:'2026-10', by, date, units: Unit[] }
Unit  = aitest split 단위 그대로 { id, numbers, type_label, passage, questions[], has_figure,
          figure_desc, confidence:'high'|'low', note } + { genre:'독서'|'문학'|'기타' }
Item  = { id, paperId, unitId, group, subtype, form:'5지'|'4지'|'OX'|'서답',
          stem, choices[], answer, answer_text, explanation, evidence[], rubric:[{point,criterion}],
          flags: FlagKey[], note?:string }
FlagKey = 'solve_mismatch' | 'no_evidence' | 'answer_leak' | 'type_changed'
Exam (저장) = { id, title, subject, status:'draft'|'done', step:1..4, source:{unitRefs:[{paperId,unitId}]},
          settings, items: Item[], print:{cols:1|2, answerAt:'sheet'|'below'|'none', showSource:bool,
          showNameBox:bool}, createdAt, updatedAt }
settings = { groups: string[], subtypes: {[group]: string[]}, form, level:'원래'|'쉽게'|'어렵게'|'섞어서',
             countMode:'perUnit'|'total'|'custom', perUnit:1|2|3, total:number, custom:{[unitKey]:number},
             choiceLang:'auto'|'ko'|'en', request:string }
unitKey = `${paperId}/${unitId}`
```

---

### Task 1: 뼈대 — 작업공간 틀 · 라우터 · 테스트 도구

**Files:**
- Create: `aitest/prototype/package.json`, `index.html`, `app.css`, `js/app.js`, `test/e2e.mjs`, `test/smoke.test.js`
- Modify: `aitest/.gitignore` (추가: `prototype/data/real.json`, `prototype/dist/`)

**Interfaces:**
- Produces: `js/app.js` 의 `route(hash: string) -> {name:'exams'|'new'|'library'|'paper'|'upload', params, query}` (`query` 는 `?a=b&c=d` 를 객체로) 와 `render()`; 화면 모듈은 `export function view(state, params) -> string(HTML)` 과 `export function onAction(action: string, el: HTMLElement, state) -> void` 를 내보낸다. 이벤트는 `data-a="<action>"` 속성으로 위임.
- 라우트: `#/exams`(기본), `#/new`, `#/new/:examId`, `#/library`, `#/library/:paperId`, `#/upload`.

- [ ] **Step 1: 실패하는 테스트** — `test/smoke.test.js`: `route('#/library/p1')` → `{name:'paper', params:{paperId:'p1'}}`, `route('')` → `{name:'exams'}`, `route('#/new/e9')` → `{name:'new', params:{examId:'e9'}}`, `route('#/new?paper=p1')` → `query.paper === 'p1'`.
- [ ] **Step 2:** `cd aitest/prototype && node --test` → FAIL (모듈 없음).
- [ ] **Step 3: 구현** — `index.html` 은 `lab/screens/t-assign.html` 의 `<body class="cl-scope cl-ws-body">` 틀(상단 바 · 사이드바 · 브랜드)을 옮기고, 사이드바 '나의 강좌' 아래에 묶음 `나의 시험` (메뉴 `시험 출제` → `#/exams`, `시험 보관함` → `#/library`)을 넣는다. 상단 '새로 만들기' 메뉴에 `시험지 만들기`(`#/new`). CSS 는 `../../lab/css/` 4개 + `app.css` + `print.css`. 현재 메뉴에 `aria-current="page"`. `route()` 는 순수 함수(DOM 없이 import 가능하게 DOM 코드는 `if (typeof document !== 'undefined')` 안에서 시작).
- [ ] **Step 4:** `node --test` → PASS.
- [ ] **Step 5: e2e 뼈대** — `test/e2e.mjs`: `aitest/prototype` 상위(`/home/user/cl`)를 `python3 -m http.server 8099` 로 띄우고 `http://127.0.0.1:8099/aitest/prototype/` 를 연다. `--base <경로>`(기본 `aitest/prototype/`)로 다른 폴더(`dist/`)도 열 수 있게 하고, 함수 `step(name, fn)` 로 시나리오를 쌓고, 페이지 오류(`pageerror`)가 하나라도 있으면 실패. 이번 Task 시나리오: 사이드바 `시험 보관함` 클릭 → 주소 `#/library`, `시험 출제` 클릭 → `#/exams`; 너비 1440 · 1024 · 390 에서 `document.documentElement.scrollWidth <= innerWidth`.
- [ ] **Step 6:** `node test/e2e.mjs` → `ok` 출력.
- [ ] **Step 7: 커밋** — `git add aitest/prototype aitest/.gitignore && git commit -m "prototype: 작업공간 틀 · 라우터 · 테스트 도구"`

### Task 2: 유형 묶음 · 문항 배분 · generate()

**Files:**
- Create: `js/constants.js`, `js/generator.js`, `test/generator.test.js`

**Interfaces:**
- Produces (`constants.js`): `GROUPS: {영어: Group[], 국어: Group[]}`, `Group = {key, label, subtypes: string[], fits(unit) -> bool}` — 키 · 라벨 · 세부 유형은 설계 문서 4장 표 그대로(영어 `main`대의 파악 · `detail`세부 내용 · `blank`빈칸 · `flow`글의 흐름 · `summary`요약문 · `grammar`어법 · 어휘 · `writing`서술형 / 국어 `fact`사실적 읽기 · `infer`추론적 읽기 · `apply`<보기> 적용 · 비판 · `vocab`어휘 · `lit`표현 · 감상 · `writing`서술형). 추가로 `ORIGINAL = {key:'original', label:'원래 유형 그대로'}`. `fits` 규칙: 영어 안내문 · 도표 단위에는 `flow` · `summary` · `blank` 안 맞음; 국어 `lit` 는 `unit.genre==='문학'` 만, `apply` 는 모두. `FLAGS = {solve_mismatch:'다시 풀었더니 답이 다름', no_evidence:'근거 문장이 지문에 없음', answer_leak:'원래 정답 노출 의심', type_changed:'유형 바꿈'}`. `RULES` = Global Constraints 의 문구 3개.
- Produces (`generator.js`):
  - `countSummary({units:number, mode, perUnit, total}) -> string`
  - `allocate(unitKeys: string[], settings) -> {[unitKey]: number}`
  - `planDistribution(units: Unit[] (각 unitKey 포함), settings, subject) -> Slot[]`, `Slot = {unitKey, group, subtype|null, changed:bool}`
  - `answerDistribution(items) -> {1..5: number}`, `needsShuffle(items) -> bool`, `shuffleAnswers(items, seed:number) -> Item[]`
  - `async generate(units, settings, subject, pool) -> {items: Item[], notes: string[]}`

- [ ] **Step 1: 실패하는 테스트** (`test/generator.test.js`):
  - `countSummary({units:8, mode:'perUnit', perUnit:2})` === `'지문 8개 × 2문항 = 16문항'`; `countSummary({units:8, mode:'total', total:3})` === `'지문 8개 · 총 3문항'`.
  - `allocate(['a','b','c','d','e','f','g','h'], {countMode:'total', total:3})` → a·b·c 가 1, 나머지 0. `{countMode:'total', total:10}` 을 지문 4개에 → `[3,3,2,2]`.
  - `planDistribution` 지문 2개 · perUnit 2 · groups `['main','blank']` → 각 지문에 `main` 1 · `blank` 1(같은 지문에 같은 묶음 두 번 없음, 묶음 수보다 perUnit 이 크면 그때만 반복).
  - 국어 독서 지문 · groups `['lit']` → 모든 슬롯 `changed:true`, `group` 은 `fits` 를 통과하는 첫 묶음(`fact`).
  - `generate` 풀에 (지문, 묶음)이 없으면 같은 지문의 다른 문항을 쓰고 `note === '데모: 미리 만든 문항으로 대신 보여 줘요'`; 그 지문에 풀이 전혀 없으면 결과에서 빠지고 `notes` 에 `'{numbers}번은 데모 문항이 없어요'`. 결과 `items.length` 는 0 이 아니다(풀에 하나라도 있으면).
  - `changed` 슬롯에서 나온 문항의 `flags` 에 `'type_changed'` 포함.
  - `needsShuffle` 는 정답 5개 중 3개가 ②일 때 true(60% > 40%), 2개일 때 false. `shuffleAnswers` 결과는 각 문항의 정답 선택지 글이 그대로이고, `needsShuffle` 가 false.
- [ ] **Step 2:** `node --test` → FAIL.
- [ ] **Step 3: 구현.** `planDistribution`: 지문마다 `allocate` 개수만큼, 고른 묶음 중 `fits` 통과한 것을 순서대로 돌려 쓴다(라운드 로빈 시작점을 지문마다 하나씩 밀어 전체적으로 섞이게). 통과하는 게 없으면 GROUPS 순서상 첫 `fits` 통과 묶음 + `changed:true`. `generate` 는 데모라 `await new Promise(r=>setTimeout(r, 0))` 정도만 두고(진행 화면 시간은 Task 7 에서 화면이 조절), 같은 풀 문항을 두 번 쓰지 않는다. `shuffleAnswers` 는 seed 기반 결정적 섞기로 정답 위치를 1~5에 고르게 돌린다(서답 · OX 제외).
- [ ] **Step 4:** `node --test` → PASS.
- [ ] **Step 5: 커밋** — `prototype: 유형 묶음 · 문항 배분 · generate`

### Task 3: 저장소(store)

**Files:**
- Create: `js/store.js`, `test/store.test.js`

**Interfaces:**
- Produces: `createStore(storage = globalThis.localStorage) -> { listExams(), getExam(id), saveExam(exam), deleteExam(id), copyExam(id) -> Exam, listPasted(), savePasted(paper), reset(), persistent: bool }`. 키 `cl-exam-proto:exams`, `cl-exam-proto:pasted`. `copyExam` 은 제목에 ` (복사)` 를 붙이고 `status:'draft'`.

- [ ] **Step 1: 실패하는 테스트** — 가짜 storage 객체로 저장 → 다시 `createStore` 해도 `listExams()` 에 남음; `getItem`/`setItem` 이 예외를 던지는 storage 로 만들면 `persistent === false` 이고 `saveExam` → `listExams()` 에 보이지만(메모리) 예외 없음; `copyExam` 제목 · 상태 확인; `reset()` 후 빈 목록.
- [ ] **Step 2:** FAIL 확인 → **Step 3:** 구현(모든 storage 호출 try/catch) → **Step 4:** PASS → **Step 5: 커밋** `prototype: 브라우저 저장`

### Task 4: 예시 데이터 · 데이터 검사 · build.py

**Files:**
- Create: `data/sample.json`, `test/data.test.js`, `build.py`, `test/test_build.py`, `data/data.js`(생성물)

**Interfaces:**
- Consumes: 데이터 모양(위), `GROUPS` · `FLAGS`(Task 2).
- Produces: `python3 build.py` → `data/data.js` (`window.EXAM_DATA = {...};`, sample). `python3 build.py --real` → `dist/` 에 화면 파일 전부 + `lab/css` 4개를 `dist/css/` 로 복사(index.html 의 `../../lab/css/` 를 `css/` 로 바꿈) + `dist/data/data.js`(real). `real.json` 이 없으면 종료 코드 1, 메시지 `data/real.json 이 없습니다`.

- [ ] **Step 1: 예시 데이터 작성** — 직접 쓴 지문만(기출 · 교재 문장 금지): 영어 시험지 1부(가상의 `2026 내신 대비 예시 · 고2`, 지문 4개: 목적 · 요지 · 빈칸 · 순서 각 1, 그중 1개는 `has_figure:true` 도표), 국어 1부(독서 1 · 문학(현대시) 1). 풀: 영어 지문마다 맞는 묶음별 1문항 + 서술형 1, 국어 묶음마다 1문항 + 서술형 1(채점 기준 포함). `answer_leak` · `solve_mismatch` 가 붙은 문항 각 1개.
- [ ] **Step 2: 실패하는 테스트** (`test/data.test.js`) — sample(있으면 real 도): 모든 `pool[].unitId` 가 해당 paper 에 있음; `group` 이 `GROUPS[subject]` 키 또는 `original`; 객관식은 `choices.length` 5(4지는 4, OX 는 2) · `answer` 범위 안; 서답은 `answer===0` 이고 `rubric.length>0`; `flags` 는 `FLAGS` 키만; `has_figure` 단위의 풀 문항 0개.
- [ ] **Step 3:** `node --test` → FAIL(파일 없음/누락) → 데이터 고쳐 PASS.
- [ ] **Step 4: build 테스트** (`test/test_build.py`, `python3 -m unittest`) — 임시 폴더에 복사한 prototype 에서 `build.py` 실행 → `data/data.js` 가 `window.EXAM_DATA = ` 로 시작하고 JSON 부분이 `demo:"sample"`; `--real` 은 real.json 없으면 코드 1; 가짜 real.json 이 있으면 `dist/index.html` 에 `../../lab/css` 문자열이 없고 `dist/css/teacher.css` 존재.
- [ ] **Step 5:** 구현 → `cd aitest/prototype && python3 -m unittest test/test_build.py` PASS, `node --test` PASS.
- [ ] **Step 6: 커밋** — `prototype: 예시 데이터 · 데이터 검사 · build`

### Task 5: 시험 보관함 (목록 · 상세 · 올리기 데모)

**Files:**
- Create: `js/views/library.js`; Modify: `js/app.js`, `app.css`, `test/e2e.mjs`

**Interfaces:**
- Consumes: `EXAM_DATA.papers`, `store.listPasted()`.
- Produces: 상세 화면의 [이 지문으로 만들기] → `#/new?units=<paperId>/<unitId>`, [이 시험지로 만들기] → `#/new?paper=<paperId>` (Task 6 이 이 쿼리를 읽는다).

- [ ] **Step 1: e2e 먼저** — 보관함: [시험지별]/[지문별] 전환, 과목 필터(국어 고르면 영어 시험지 사라짐), 시험지 행 클릭 → 상세(지문 수 · 그림 지문 배지 `그림 필요` 표시) → [이 지문으로 만들기] → 주소가 `#/new?units=`. [시험지 올리기] → 파일 고르기(데모: 예시 시험지 이름 버튼) → `지문을 나누고 있어요` → 나누기 결과 확인(배지 `그림 필요` · `AI가 확실하지 않음`) → [보관함에 저장] → 상세. [지문 추가] → 제목 · 본문 입력 → 저장 → 목록에 종류 `직접 추가` 행(store.savePasted). 남이 올린 시험지 행에는 수정 · 삭제 대신 `함께 보기`.
- [ ] **Step 2:** `node test/e2e.mjs` → FAIL.
- [ ] **Step 3:** 구현. 표는 `components.css` 의 표 · 칩 · 버튼 클래스를 쓴다. 나누기 결과 확인의 '고치기 · 합치기 · 나누기'는 버튼만 두고 누르면 `데모에서는 보기만 돼요` 토스트. 올린 시험지는 데모 데이터의 다른 시험지를 '새로 올린 것'으로 보여 준다(store 에 저장하지 않음).
- [ ] **Step 4:** e2e PASS → **Step 5: 커밋** `prototype: 시험 보관함`

### Task 6: ① 자료 고르기 + 마법사 틀

**Files:**
- Create: `js/views/wizard.js`, `js/views/step-source.js`; Modify: `js/app.js`, `app.css`, `test/e2e.mjs`

**Interfaces:**
- Consumes: `store`, 쿼리 `units` · `paper`(Task 5).
- Produces: 마법사 상태 `wiz = {examId, step:1..4, subject, selected: unitKey[], pasted: Paper|null, settings, items}`; `wizard.js` 의 `goStep(n)` · 아래 바 요약(`지문 {n}개` 단계 1, Task 7 부터 문항 수 요약). 단계 이동 때마다 `store.saveExam({status:'draft', step, ...})`.

- [ ] **Step 1: e2e 먼저** — `#/new?paper=<영어 예시>` → 오른쪽 지문 목록에 그 시험지; [전체 선택] → 그림 지문 제외 개수만 선택되고 아래 바 `고른 지문 3개`; 그림 지문 체크박스 비활성 + 문구 `그림이 있어 자동 출제에서 빠져요`; 다른 시험지 지문 하나 더 체크 → `고른 지문 4개`; 바구니에서 하나 지우고 [되돌리기]; [지문 붙여넣기] 탭에서 지문 2개 입력 → 첫 사용 때만 권리 확인 체크 요구(두 번째 방문에선 없음); 선택 0개면 [다음] 비활성; 단계 표시 `① 자료` 활성. 목록(`#/exams`)에 `작성 중` 행이 생김.
- [ ] **Step 2:** FAIL → **Step 3:** 구현 → **Step 4:** PASS → **Step 5: 커밋** `prototype: 자료 고르기`

### Task 7: ② 방식 + 진행 화면

**Files:**
- Create: `js/views/step-method.js`; Modify: `app.css`, `test/e2e.mjs`

**Interfaces:**
- Consumes: `GROUPS` · `ORIGINAL` · `RULES`, `countSummary` · `allocate` · `generate`(Task 2).
- Produces: `wiz.items` 채움 → `goStep(3)`.

- [ ] **Step 1: e2e 먼저** — 영어 지문 3개 상태에서: 칩 `원래 유형 그대로` 보임(붙여 넣은 지문만 골랐으면 비활성 + 이유 `붙여 넣은 지문에는 원래 유형이 없어요`); `대의 파악` · `빈칸` 선택; 지문당 `2` → 아래 바 `지문 3개 × 2문항 = 6문항`; [세부 유형 펼치기] → `대의 파악` 아래 `주제 · 제목 · 요지 · 주장 · 목적` 체크; 형태 `OX` 선택 시 `서술형` 칩 비활성; `총 문항 수에 맞추기` → 총 2 입력 → `지문 3개 · 총 2문항` + 배분 미리보기, 0 입력 → [문제 만들기] 비활성; `지문별로 바꾸기` 표에서 개수 수정 반영; [자세히 설정] 열면 선택지 언어 · 직접 요청(200자 넘으면 입력 막힘); 규칙 문구 3개 보임; [문제 만들기] → `지문 3개 중 n개 완료` 진행(지문당 0.6초) → ③ 으로.
- [ ] **Step 2:** FAIL → **Step 3:** 구현(칩은 `aria-pressed`, 묶음 칩 최소 1개 선택해야 진행) → **Step 4:** PASS → **Step 5: 커밋** `prototype: 만들 방식`

### Task 8: ③ 검토

**Files:**
- Create: `js/views/step-review.js`; Modify: `app.css`, `test/e2e.mjs`

**Interfaces:**
- Consumes: `wiz.items`, `FLAGS`, 단위 지문(근거 강조), `generate`(다시 만들기: 같은 지문 · 같은 묶음 · 이미 쓴 문항 제외).
- Produces: 고친 `wiz.items`(순서 포함), 문항별 `checked:bool`.

- [ ] **Step 1: e2e 먼저** — 요약 `6문항 · 주의 n · 유형 바꿈 m`; 목록 첫 행이 주의 문항; `확인 필요만 보기`; 카드에서 근거 문장이 `<mark>`; 주의 배지 글이 `FLAGS` 문구; [고치기] → 발문 수정 → [저장] 후 카드에 반영; [다시 만들기] → 다른 문항으로 바뀜(풀이 없으면 `더 만들 데모 문항이 없어요`); [빼기] → 5문항; ↑↓ 로 순서 변경; 서술형 카드에 `모범 답안` · `채점 기준`; 대신 쓴 문항에 데모 문구.
- [ ] **Step 2:** FAIL → **Step 3:** 구현(근거 강조는 `aitest/review_template.html` 의 `passageHtml` 방식 — 이스케이프 후 `<u>` 만 살리고 첫 일치에 `<mark>`) → **Step 4:** PASS → **Step 5: 커밋** `prototype: 검토`

### Task 9: ④ 인쇄 · 저장 + 만든 시험지 목록

**Files:**
- Create: `js/views/step-print.js`, `js/views/exams.js`, `print.css`; Modify: `app.css`, `test/e2e.mjs`

**Interfaces:**
- Consumes: `answerDistribution` · `needsShuffle` · `shuffleAnswers`, `store`.
- Produces: 완성된 `Exam`(`status:'done'`).

- [ ] **Step 1: e2e 먼저** — [문제지]/[정답 · 해설지] 탭; 1단/2단 전환 시 미리보기 `column-count` 바뀜; 정답 위치 `별지/문항 아래/빼기`; 출처 표시 켬 → 문항 아래 `2026 … 22번 변형`; 정답 분포가 몰린 데이터에서 [정답 위치 섞기] 보이고 누르면 사라짐; [인쇄 / PDF 저장] 은 `window.print` 호출(테스트에선 가로채서 호출 여부만 확인); [저장하고 목록으로] → `#/exams` 에 `완성` 행; 행 [다시 인쇄] → ④ 로 열림, [이어서 고치기] → ③, [복사해서 새로 만들기] → `(복사)` 행 생김, 삭제 → 확인 후 사라짐; 목록 과목 필터 · 제목 검색; 빈 목록 문구 `아직 만든 시험지가 없어요` 와 [새 시험지 만들기] · [보관함에 시험지 올리기]; [데모 처음으로] → 목록 비움. 마지막으로 전 시나리오를 1440 · 1024 · 390 에서 가로 스크롤 없음 확인.
- [ ] **Step 2:** FAIL → **Step 3:** 구현(`print.css`: `@page { size: A4; margin: 15mm }`, 문항 블록 `break-inside: avoid`, 화면 틀 숨김, 정답 별지는 `break-before: page`) → **Step 4:** PASS
- [ ] **Step 5:** Playwright `page.pdf()` 로 문제지 PDF 를 만들어 1쪽을 이미지로 열어 눈으로 확인(2단 · 문항 안 잘림).
- [ ] **Step 6: 커밋** — `prototype: 인쇄 · 저장 · 만든 시험지 목록`

### Task 10: 실제 데모 데이터 (1차 문항 + 유형 묶음 풀)

**Files:**
- Modify: `aitest/prompts.py`(묶음 지시문 추가), `aitest/README.md`(묶음 출제 설명 한 단락)
- Create: `aitest/prototype/tools/to_real.py`(outputs → real.json 변환), `aitest/results/2026-10-고2-유형묶음.md`
- Output (올리지 않음): `aitest/prototype/data/real.json`

**Interfaces:**
- Consumes: `aitest/outputs/eng-2610` · `kor-2610` 의 `split.json` · `items.json`; `GROUPS`(Task 2) 의 키 · 세부 유형.
- Produces: `prompts.GROUP_PRESETS[subject][group]` (묶음별 출제 지시 한 문단, 서술형은 `answer 0 · answer_text 모범 답안 · rubric` 요구) — 2차 AI 연결에서 그대로 쓴다. `GEN_SCHEMA` 에 `subtype`(string) · `form`(enum) · `rubric`(array of {point:int, criterion:string}) 추가.

- [ ] **Step 1: 실패하는 테스트** — `aitest/test_prompts.py`(unittest): `GROUP_PRESETS` 의 키 집합이 `GROUPS` 키와 같음(영어 7 · 국어 6, `constants.js` 를 정규식으로 읽어 비교); `GEN_SCHEMA` 필수 키에 `subtype` · `form` · `rubric`.
- [ ] **Step 2:** FAIL → **Step 3:** `prompts.py` 구현 → PASS.
- [ ] **Step 4: 문항 풀 만들기** — 영어 10지문 · 국어 4묶음 각각, `fits` 를 통과하는 묶음마다 1문항(서술형 포함, OX · 4지 형태 2문항씩 섞음)을 1차 테스트와 같은 절차로 만든다: 묶음 지시문으로 만들기(지문마다 독립 요청) → 정답 가리고 다시 풀기(다른 작업자, 정답 파일 못 봄) → 근거 대조. 결과는 `aitest/outputs/eng-2610-groups` · `kor-2610-groups`.
- [ ] **Step 5:** `to_real.py` — 두 실행의 split · items 를 Paper · Item 으로 바꾸고 `flags` 계산(`solve_mismatch` · `no_evidence` 는 자동 검사 결과로, `answer_leak` 은 1차 테스트에서 확인된 u14-2 · u16-2 와 새 풀에서 원래 정답 문자열이 지문에 다시 들어간 경우). 1차 문항 32개는 `group:'original'`. 국어 단위 `genre` 는 `type_label` 이 `문학` 으로 시작하면 `문학`, `독서` 면 `독서`, 그 밖은 `기타`.
- [ ] **Step 6:** `python3 tools/to_real.py && node --test` → data 테스트가 real.json 까지 PASS.
- [ ] **Step 7:** `aitest/results/2026-10-고2-유형묶음.md` — 묶음 · 형태별 만든 수 / 자동 검사 통과 수 / 눈에 띈 점(특히 서술형 · OX). 시험 지문 문장은 옮기지 않는다.
- [ ] **Step 8: 커밋** — `aitest: 유형 묶음 지시문 · 실제 데모 데이터 변환 · 2차 결과` (real.json · outputs 는 올라가지 않는지 `git status` 로 확인)

### Task 11: 아티팩트 올리기 · 안내

**Files:**
- Create: `aitest/prototype/README.md`; Modify: `aitest/README.md`(파일 표에 prototype 추가), 루트 `README.md` 표 설명

**Interfaces:**
- Consumes: `build.py --real`(Task 4), real.json(Task 10).

- [ ] **Step 1:** `python3 build.py --real` → `dist/` 생성. `dist` 를 http.server 로 띄워 e2e 를 `--base dist/` 로 한 번 더 돌려 PASS(실제 데이터에서도 오류 없음).
- [ ] **Step 2:** Artifact 도구로 `dist/index.html` + 나머지 파일(`files`)을 **새 아티팩트**로 publish(제목 `시험 출제 프로토타입 2차안`, 비공개). 공유 범위는 사용자에게 맡긴다.
- [ ] **Step 3:** `aitest/prototype/README.md` — 여는 법(GitHub Pages 예시 데이터 · 로컬 `python3 -m http.server`), 테스트 명령 3개, 아티팩트 다시 올리는 법, 실제 데이터가 저장소에 없는 이유.
- [ ] **Step 4:** `git status` 로 `real.json` · `dist/` 가 없음을 확인하고 커밋 · 작업 브랜치 push · `main` 에 합치기.
