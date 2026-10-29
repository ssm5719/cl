# 클라우드러닝 리디자인 — 작업 메모 (새 세션은 이것부터 읽는다)

클라우드러닝 LMS(학원용 강의 · 관리 서비스) 화면을 다시 디자인하는 저장소다. 실제 서비스 코드는 여기 없다. 여기서 만드는 것은 ① 수정 실험실(지금 화면 ↔ 수정안 비교), ② 디자인시스템, ③ 개발 전달 문서다.

마지막 정리: 2026.10.29 · 이 파일은 작업할 때마다 같이 고친다(결정 · 규칙 · 남은 일).

## 링크

| 무엇 | 어디 |
| --- | --- |
| 실험실(공유 — 링크 있으면 누구나) | https://claude.ai/artifact/AfVULfvaMGXWB5xz8yFDtF — 원본 `lab/` |
| 디자인시스템(나만 봄 · 공유는 사용자가) | https://claude.ai/artifact/2nbjQGz77YFHYVLdiLMHdM — 원본 `design/` |
| 개발 전달 문서 | https://github.com/ssm5719/cl/tree/main/handoff |
| 테스트 사이트(보기만) | https://guest.lab241.com — 학원 · 관리자 · 선생님 · 학생 |
| 포털(2차) | https://cloudlearning.lab241.com |
| 동영상 플레이어(별도 서비스) | cms.atedu.co.kr "LABY플레이어 v2.0" — video.js 7.21 위에 직접 만든 조작 줄 |

## 사용자와 일하는 방식

- 사용자는 디자이너다. 한국어로, 짧고 쉬운 말로 답한다. 개발 용어 · 내부 경로는 꼭 필요할 때만.
- "진행" · "묻지 말고" 라고 하면 묻지 않고 끝까지 하고, 끝난 뒤 바꾼 것 · 판단한 것 · 남은 것을 정리해 알린다.
- **바꾸기 전 / 후를 화면으로 나란히 보여 주는 것**을 좋아한다. 시각 변경은 캡처 비교를 같이 낸다.
- 바꾸면 **실험실 · GitHub(design · handoff) · 디자인시스템 아티팩트를 함께** 갱신한다. 하나만 고치고 끝내지 않는다.
- 끝났다고 말하기 전에 확인한다: 실험실이 뜨는지(`node tools/check-lab.js`), 건수가 맞는지(`handoff/counts.json` = 영역 파일 본문 `###` 수), 푸시됐는지.

## 지키는 규칙

### 안전
- 실제 사이트(guest.lab241.com 등)는 **보기만** 한다. 저장 · 삭제 · 전송 · 수정 · 추가 버튼은 누르지 않는다. 창 · 팝업을 열고 닫는 것은 괜찮고, 확인 버튼(마감 · 수정하기 · 수강 취소 · 바꾸기 등)은 누르지 않는다.
- 비밀번호 입력 · 로그인은 하지 않는다. 사용자가 로그인해 둔 탭을 본다.
- 선생님 화면 보기: 관리자 → 선생님 목록 → 장현석 → [선생님 계정으로 들어가기] (사용자가 허락한 방법). 그 상태의 프로필 드롭다운 → [홈페이지] = 로그인한 학원 메인.
- 테스트 사이트 탭은 사용자 허락 없이 열어 보고, 다 본 뒤 닫지 않아도 된다.
- **실험실 아티팩트를 통째로 덮어써서 기존 작업을 망가뜨리지 않는다.** 바꾼 파일만 올린다(`files` 에 그 파일만).

### 디자인
- **CSS · 디자인시스템 안의 것만 쓴다.** 공통 부품(Button · Link · Status · Tabs · Composer · MiniList · Popover · FileCard · Empty · Avatar · VideoPlayer)에서 먼저 찾고, 정말 다를 때만 새 부품을 만들어 `lab/css/components.css` 와 `design/components/<이름>/`(README + preview) 에 **둘 다** 등록한다. 화면 전용 클래스는 자리(간격 · 칸)만.
- **값은 모두 토큰**(`var(--cl-…)`). px · hex 를 직접 쓰지 않는다. 새 값이 필요하면 토큰부터: `lab/css/cl-tokens.css` + `design/tokens.json` + `design/tokens.css`.
- AI 티 나는 디자인(보라 그라데이션, 이모지 장식, 왼쪽 색 줄 카드, 채우기용 숫자)을 피한다.
- 글: 날짜 `2026.10.20`, 숫자 뒤 단위 붙여 쓰기(14명 · 3건), 만드는 버튼은 "만들기". 존댓말 평서문, 이모지 · 느낌표 없음.
- 연락처 · 전화번호는 가짜 값(010-0000-0107 꼴). 썸네일 · 사진 자리는 회색.

## 지금까지 (1차 — 전달 완료)

- 범위: 관리자 · 선생님 · 학생 작업공간 + 학원 공개 화면(메인 · 전체강좌 · 강좌 상세 · 강의 보기 · 학원소개 · 선생님 · Q&A · 자유게시판) + 동영상 플레이어.
- **확정 230건 · 제안 0 · 보류 2(G5 · AP3)** — 공통 40 · 관리자 89 · 선생님 15 · 학생 35 · 학원 50 · 플레이어 1. 개발 확인 메모 1건(R-1 선생님이 학원 전체 그룹을 지우거나 이름을 바꿀 수 있음).
- 2026.10.29 개발 공유용 Slack 글(실험실 + handoff 링크)을 만들어 사용자에게 줬다.

### 주요 결정과 이유
- **포털은 2차.** 포털의 `cl-pt-*` 클래스가 `cl-btn` 크기 이름과 겹친다(pt `--xs` 가 높이 40). 포털도 같은 cl-tokens · base · components.css 를 불러오므로, 공통 CSS 를 바꾸면 포털 로그인 · 가입 화면 영향을 같이 본다.
- **모서리**: 버튼 · 아이콘 버튼 · 입력 칸 · 글 상자 · 선택 칸 · 검색 칸 · 보기 전환 · 쪽 번호 = `--cl-radius-control` 4px(NR1). 그 안에 든 칸 = `--cl-radius-3xs` 2px. 카드 · 사진 = 8px(G7 · AM6, `--cl-radius-md` 는 없앰). 떠 있는 패널 12px. **알약 · 동그라미 버튼은 그대로 pill** — 4px 로 바꾸지 않았다(사용자에게 "알약도 4px 로?" 물었고 답 없음 — 묻기 전에 바꾸지 않는다). 목록 줄처럼 쓰는 버튼(사이드바 메뉴 · 분류 고르기)과 사진 · 카드형 버튼도 그대로.
- **화면 테마(SL3)**: 고르는 곳은 계정 메뉴 한 곳 [기기 설정 · 라이트 · 다크]. 작업공간 · 학원 로그인 후 = 기기 설정. 학원 로그인 전 · 포털 = 라이트 고정. 플레이어는 원래 검정.
- **SQ5**: 로그인 후 Q&A · 자유게시판 상세도 다크 범위. **LC5**: 과목이 5개를 넘으면 칩 대신 선택 칸. **SB2 · SQ6**: 학생 자유게시판 상세 · 글쓰기, Q&A 상세를 나의 강의실 안에 새 화면으로(새 화면 명세는 `spec` 필드).
- **동영상 플레이어(NL1 · VideoPlayer)**: 영상 위 그라데이션 조작 줄, 진행 막대를 버튼 위로(보라), 정지 빼고 10초 뒤로 · 앞으로, 스피커 누르면 X 스피커로 음소거, 배속 알약 + 위로 열리는 목록, 재생 중 3초 가만히 → 사라짐, 밖으로 나가면 바로 페이드(유튜브처럼), 멈춤 · 포커스 · 배속 목록 열림이면 안 숨김. 좁은 플레이어(폭 520 이하)는 플레이어 폭 기준(container query). 가운데 재생 아이콘은 삼각형 무게중심을 원 가운데에(오른쪽으로 밀지 않음). 색은 `cl-player-*` 토큰. **멈췄을 때 가운데 버튼을 PC 에서 뺄지** 제안만 했고 사용자가 보류 — 지금은 남아 있다.
- **강좌 기본 썸네일**: 2026.10.29 분홍 그림 → 연보라 바탕 · 책 위 두 사람(`lab/img/course-default.png` = 디자인시스템 Images `course-default.png`). 개발에는 01-공통 "이미지 파일" 항목으로 전달.
- **디자인시스템 tokens.css**: 아티팩트의 `project/tokens.css` 는 페이지가 만든다(누군가 화면에서 저장할 때만 다시 생성) — 직접 쓰지 않는다. 그래서 `components/bundle.css` 맨 앞에 `:where(:root)` 토큰 대비 값을 둔다(우선순위 0, tokens.css 가 있으면 그쪽이 이김).

## 남은 일

1. **포털 2차** — 메인 · 요금제 · 학원 목록 · 고객센터 · 로그인 · 회원가입 · 약관. 먼저 화면을 둘러보고 화면 목록과 고칠 곳 후보를 보여 준다. 1차 230건과 섞지 말고 따로 센다(새 영역 · 새 handoff 파일).
2. 사용자 답 기다리는 것: 알약 버튼도 4px? · 플레이어 멈춤 시 가운데 버튼 PC 에서 빼기? · 보류 G5 · AP3.
3. 디자인시스템 아티팩트 공유(개발자가 보려면 사용자가 공유 메뉴에서 열어야 함).

## 저장소 구조와 만드는 법

- `lab/` 실험실 — `index.html`(SCREENS 목록 · 화면 전환 · 수정안 켜고 끄기), `screens/*.html`(화면 123개, 2026.10.19 저장본 + 새로 만든 화면), `css/`(cl-tokens · base · components · manager · teacher · student · public), `fixes.js`(`window.LAB_FIXES` 수정 항목 · `LAB_NOTES` 개발 메모), `night/build_*.py`(화면 만드는 스크립트).
  - 수정 항목 필드: `id, group, status(확정|제안|보류), kind, layer(토큰|공통 틀|공통 부품|화면별), screens(화면 id 배열 — 반드시 넣는다, 빠지면 실험실이 멈춤), title, current, next, when, howTo, css, dom, markup, server, spec, targets, note`.
  - `layer` 는 위 네 값 중 하나만 — 다른 값이면 handoff 문서에서 빠진다(NX1 이 '공통' 으로 빠졌던 적 있음).
  - `fixes.js` 를 고치면 `index.html` 의 `fixes.js?v=N` 숫자를 올린다.
  - 새 항목은 `LAB_FIXES` 배열 끝(= `LAB_NOTES` 앞)에 넣는다. 파일 맨 끝 `];` 는 LAB_NOTES 의 끝이다.
- `design/` 디자인시스템 원본 — `tokens.json` · `tokens.css` · `README.md` · `components/<부품>/README.md + preview.html` · `assets/Icons/*.svg` · `CHANGELOG.md` · `public-ui-rules.md` · `scope.md` · `audit.md`.
  - `node design/build_bundle.js 2026.10.29` → `components/bundle.css`(실험실 CSS + 확정 · 제안 수정 CSS + 토큰 대비 값). 손으로 고치지 않는다.
- `handoff/` 개발 전달 — `README.md` · `AI_PROMPT.md` 만 손으로 쓰고 나머지는 `node handoff/build_handoff.js 2026.10.29` 로 만든다(01-공통 … 05, 06 메모, 07 화면 목록, 08 플레이어, fixes.json/css, counts.json, css-changes.diff). `css-changes.diff` 는 커밋된 것 기준이라 **커밋 뒤 한 번 더** 돌려 다시 커밋한다. 건수가 바뀌면 `handoff/README.md` 의 "확정 N건" · 표 숫자도 고친다.
- `tools/` 점검 스크립트(README 참고). `aitest/` 는 별개(AI 시험 출제 기능).

### 아티팩트 올리기
- 실험실: `file_path=lab/index.html`, `root=lab`, `url=실험실 링크`, `files` 에 **바꾼 파일만**(예 `{"fixes.js":"fixes.js","css/components.css":"css/components.css"}`).
- 디자인시스템(Design System 타입): 올리기 전에 `project/design-system.json` 과 바꿀 파일을 **먼저 read** 해서 그 사본을 고친다(아티팩트 쪽 README 에는 페이지가 붙인 "Consuming" 장이 있으니 저장소 README 로 덮지 말고 사본에 같은 수정을 한다). `project/` 아래만 쓰고 `api/` · `tokens.css` · `manifest.json` 은 쓰지 않는다. `design-system.json` 은 마지막에, `lastChange`(at · by "Claude" · via · note)를 고쳐 같이 올린다.
- 아이콘 같은 그림은 에셋으로 올리고(`asset:true`, `file_paths`) 돌아온 id 를 `assetGroups.Icons.files` · `order` 에 적는다. 아이콘 형식: 24 격자, `stroke="currentColor"`, 작업공간 선 1.75(플레이어 아이콘은 2).

### 커밋
- `main` 에 바로 커밋 · `git push origin HEAD:main`. 메시지는 한국어로 무엇을 · 왜. 끝에 세션이 알려 주는 Co-Authored-By · Claude-Session 줄.
