# 클라우드러닝 작업공간 — 디자인시스템

관리자 · 선생님 · 학생 · 학원 페이지가 함께 쓰는 **공통층**(토큰 · 글자 · 간격 · 부품)을 적은 문서입니다. 화면별 수정안은 [`../lab/`](../lab/) 에 있습니다.

| 파일 | |
| --- | --- |
| `README.md` | 이 문서. 말투 · 색 · 글자 · 간격 · 반경 · 화면 틀 · 아이콘 규칙 |
| `scope.md` | 적용 범위. 세 화면 묶음이 같은 CSS 를 쓰는 기록, 다크모드 범위 |
| `audit.md` | 점검 · 수정 목록. 아직 정할 것 포함 |
| `tokens.css` · `tokens.json` | 토큰. CSS 는 `var(--cl-…)` 로 읽습니다 |
| `api/tokens.md` | 토큰 값 전체 표 |
| `api/components/*.md` | 부품 24개 요약 카드 |
| `components/<이름>/README.md` | 부품 상세 + `preview.html` 미리보기 |
| `components/bundle.css` | 미리보기용 CSS 묶음 |
| `fonts/` | Pretendard Variable |

아이콘 41개와 로고는 디자인시스템 아티팩트의 자산 저장소에 있습니다. 목록과 받는 방법은 `api/assets/Icons.md` · `api/assets/Logos.md` 에 적혀 있고, 화면에서는 모두 인라인 SVG(`stroke="currentColor"`)로 들어가 있습니다.

---

클라우드러닝 학원 관리자 · 선생님 작업공간의 화면 규칙이다. 값은 `tokens.json` 하나에서 오고, CSS는 `var(--cl-…)` 로 읽는다. 공개 화면(학원 홈페이지)은 글자 단계만 함께 적어 두었다.

수정할 곳과 정할 것은 "점검 · 수정 목록" 장에 모았다. 이 장은 지금 코드가 따르는 규칙이다.

이 시스템을 관리자 · 선생님 · 학원 페이지 · 포털 중 어디까지 쓰는지는 "적용 범위" 장에 적었다.

## 말투

화면 글은 짧은 존댓말 평서문으로 쓴다. 코드 주석은 "~한다" 체로 쓴다.

- 버튼은 동작 이름 그대로: "선생님 생성", "엑셀 다운로드", "새로고침", "삭제".
- 설명은 무엇을 하면 어떻게 되는지 한두 문장으로 쓴다: "선생님을 만들기 전에 과목을 먼저 만들어 주세요."
- 상태 안내는 사실과 다음 행동을 같이 쓴다: "CMS 에서 다시 올려주세요 → 콘텐츠 목록".
- 빈 상태는 무엇이 없는지 쓴다: "기간 안에 기록이 없습니다".
- 숫자 뒤 단위는 띄우지 않는다(14명, 3건, 30일). 날짜는 `2025.11.24`, 짧은 범위는 `09-20 ~ 10-19`.
- 이모지와 느낌표는 쓰지 않는다.
- 목록 이름은 "~ 목록", 만드는 버튼은 "~ 생성"이 많다. "만들기" · "추가"와 섞여 있어 정리 중(점검 6).

## 색

보라는 학원 대표색이다. 누를 수 있는 것과 지금 고른 것에만 쓴다.

- 주 버튼 배경 · 포커스 테두리 · 그래프 막대: `cl-primary`. 흰 글자를 얹는다.
- 링크 글자 · 현재 메뉴 글자 · 연보라 바탕 위 글자: `cl-primary-pressed`. `cl-primary` 는 흰 배경 위 글자로 쓰면 4.85:1 이라 작업공간 기준(6:1)에 못 미친다.
- 고른 행 · 정보 배지 · 학기 칩 바탕: `cl-primary-tint`.
- 본문 글자 `cl-ink`, 메뉴 글자 `cl-ink-2`, 보조 글자 `cl-ink-muted`. `cl-ink-faint` 는 비활성과 입력 칸 안내 글자에만 쓴다.
- 바탕은 `cl-canvas`(본문), `cl-sidebar`(사이드바 · 브랜드 칸), `cl-parchment`(회백색 상자), `cl-hover`(hover · 보기 전환 바탕).
- 선은 세 단계다: 카드 · 떠 있는 패널 둘레 `cl-hairline`, 표 머리 · 탭 줄 · 구역 경계 `cl-grid-head`, 표 행 사이 `cl-grid-row`. 입력 칸 테두리는 `cl-control-border`.
- 상태색은 글자와 연한 바탕을 한 쌍으로 쓴다: `cl-success` / `cl-success-bg`, `cl-warning` / `cl-warning-bg`, `cl-danger` / `cl-danger-bg`. 배지 · 상태 점 · 진도 표시 밖에서는 쓰지 않는다.
- 진도는 `cl-heat-0`(시작 전) → `cl-heat-1`(1~49%) → `cl-heat-2`(50~99%) → `cl-heat-3`(완료).

학원마다 대표색을 바꿀 때는 `cl-primary` · `cl-primary-pressed` · `cl-primary-on-dark` · `cl-primary-tint` 네 개만 바꾼다. 코드에 예시 두 벌이 있다.

| 학원 색 | primary | pressed | on-dark | tint |
| --- | --- | --- | --- | --- |
| 보라(기본) | #904AE8 | #7A35D0 | #B78AF7 | #F3ECFD |
| 파랑 | #2F6BDE | #1F55BD | #8DB5FF | #EAF1FD |
| 초록 | #1E7F54 | #156442 | #6FD3A0 | #E6F4EC |

다크모드가 두 번째 테마로 들어가 있다. 밝은 테마 토큰마다 짝이 되는 어두운 값이 `tokens.json` 에 있다. 진한 바탕 위 흰 글자는 `cl-canvas` 로 읽어, 테마가 바뀌면 같이 뒤집힌다.

## 글자

글꼴은 Pretendard Variable 하나다(`sans`). 숫자가 세로로 줄 서는 곳(표, 숫자 띠, 날짜)은 `cl-num` 으로 고정폭 숫자를 쓴다.

작업공간 글자 단계:

| 단계 | 크기 · 굵기 | 쓰는 곳 |
| --- | --- | --- |
| `page-title` | 24px 700, 줄높이 1.35, 자간 -0.025em | 화면 제목 h1 |
| `section-title` | 16px 700 | 섹션 제목 h2 (`cl-section-title`) |
| `ui` / `ui-strong` | 14px 400 / 600 | 본문 · 표 · 메뉴 / 버튼 · 표 제목 칸 · 탭 |
| `table-head` | 13px 500 | 표 머리 |
| `caption` | 13px 400 | 설명 · 날짜 · 도움말 |
| `micro` | 12px 500 | 배지 · 범례 · 메뉴 묶음 이름 |

기본 줄높이 1.5, 자간 -0.005em. 코드는 크기를 `cl-fs-page-title` · `cl-fs-section-title` · `cl-fs-ui` · `cl-fs-table-head` · `cl-fs-caption` · `cl-fs-micro` 로 읽는다. 터치 기기의 입력 칸만 16px 로 올린다(iOS 확대 방지).

"코드에 직접 적은 크기" 묶음은 토큰 밖에서 쓰이고 있는 크기다. 새 화면에는 쓰지 않는다.

## 간격 · 크기

- 간격은 4px 단위: `cl-space-1`(4) · `-2`(8) · `-3`(12) · `-4`(16) · `-5`(24) · `-6`(32) · `-7`(48) · `-8`(80).
- 화면 좌우 여백은 `--cl-ws-gutter`(화면 폭의 2.8%, 16~40px), 위 24px. 900px 이하는 20px 16px.
- 컨트롤 높이: 버튼 · 검색 칸 · 선택 칸 `cl-h-control`(32px), 폼 입력 칸 `cl-h-control-lg`(40px), 표 머리 `cl-h-table-head`(40px), 표 행 `cl-h-table-row`(44px), 도구 줄 `cl-h-toolbar`(44px), 사이드바 메뉴 `cl-h-nav-item`(34px).
- 모바일에서 누르는 영역은 `cl-touch`(44px) 이상. 작은 버튼은 보이는 크기는 두고 누르는 영역만 넓힌다.
- 틀: 상단 바 `cl-h-ws-topbar`(56px), 사이드바 `cl-w-ws-sidebar`(240px).

## 반경 · 테두리 · 그림자

- 반경: 체크박스 `cl-radius-xs`(4), 버튼 · 입력 칸 `cl-radius-sm`(8), 카드 `cl-radius-md`(10), 떠 있는 패널 · 대화상자 · 토스트 `cl-radius-lg`(12), 칩 · 아바타 · 진도 막대 `cl-radius-pill`. 배지 · 메뉴 항목 · 보기 전환 칸은 6px.
- 테두리는 1px 실선이 기본이다. 테두리 버튼은 border 대신 `cl-ring`(1px 링)을 쓴다.
- 그림자는 화면 위에 뜨는 것에만: 메뉴 · 대화상자 · 토스트 `cl-shadow-float`, 일괄 작업 바 `cl-shadow-bulkbar`. 카드에는 그림자를 쓰지 않는다.
- 포커스는 `cl-primary` 2px 실선, 2px 띄운다(`cl-focus-offset`).

## 화면 틀

- 넓은 화면(1280px 초과): 상단 바 + 240px 사이드바 + 본문.
- 1280px 이하: 사이드바가 56px 아이콘 레일이 된다.
- 900px 이하: 사이드바가 햄버거 서랍(300px)이 되고, 표는 카드형 행이 되고, 일괄 작업 바는 화면 아래에 붙는다.
- 목록 화면 머리는 상위 메뉴 → 제목 + 버튼 → 설명 → (탭) → 도구 줄 → 표 → 합계 · 쪽 번호 순서로 쌓는다. 화면마다 아직 다르다(점검 1).

## 움직임

- 버튼 · 링크의 색과 크기 변화는 150ms ease-out.
- 누르면 0.97 로 살짝 줄어든다.
- 동작을 줄이기 설정(`prefers-reduced-motion`)이면 로딩 회전을 멈춘다.

## 아이콘

- 선 아이콘 한 벌을 쓴다. 24 격자, 선 굵기 1.75, 둥근 끝 · 둥근 모서리, 색은 글자색(`currentColor`).
- 크기: 사이드바 · 메뉴 · 버튼 16px, 알림 · 행 메뉴 18px, 모바일 상단 바 20~22px, 검색 칸 14~15px.
- 사이드바 메뉴 아이콘은 평소 `cl-ink-muted`, hover 와 현재 메뉴에서는 글자색을 따른다.
- 아이콘만 있는 버튼에는 `aria-label` 을 단다. 장식 아이콘은 `aria-hidden`.
- Icons 묶음 파일은 화면에서 쓰는 아이콘을 그대로 옮긴 것이다. 파일로 볼 때는 검은 선으로 보인다.

## 로고

- 상단 바 브랜드 칸에 24×24 로 넣는다(`cl-ws-brand__logo`, 반경 6px). 로고가 없는 학원은 `cl-primary` 바탕 네모에 첫 글자(`cl-ws-brand__mark`).
- Logos 묶음은 지금 화면에 들어간 클라우드러닝 로고다. 학원이 로고를 올리면 그 로고로 바뀐다.

---

## Consuming this system (generated — do not edit)

> 아래는 디자인시스템 아티팩트가 자동으로 붙이는 안내입니다. 아티팩트 안에서는 모든 파일이 `project/` 밑에 있지만, **이 폴더에서는 `project/` 를 떼고 읽으면 됩니다** (`api/tokens.md`, `tokens.css`).

Every path named below is under `project/` in this design system: read `project/api/tokens.md`, not `api/tokens.md`.

24 components are documented without a runnable `components/bundle.js`: read each component’s card, and its README where it has one (`components/<Comp>/README.md`), and build to those guidelines. Tokens: the values are on `api/tokens.md`; a Slides deck or Design canvas also takes `tokens.json` by file path. On a Design canvas, also copy `tokens.css` to `project/ds/<folder>/tokens.css` in the call that installs this system, and link it in each artboard that uses this system, right after the `support.js` line and before the system’s other stylesheets: `<link rel="stylesheet" href="ds/<folder>/tokens.css">` (with one `../` in front for each folder the artboard is in).

Fonts: `tokens.css` loads each font from its file, by path.

- **Design canvas:** copy `fonts/PretendardVariable.woff2` to the same paths under the canvas’s `project/ds/<folder>/` (`<folder>` is the folder you install this system under; `fonts/PretendardVariable.woff2` lands on `project/ds/<folder>/fonts/PretendardVariable.woff2`), in the same call that installs this system; the copy of `tokens.css` that each artboard links loads them from there. If the install’s reply leaves a font out, bring that font in as for any other page.
- **Slides deck:** for each family you use in the deck (`faces` holds at most the number of typefaces Slides’ `deck-files.md` gives), install its file with the system and name the path it lands on as that family’s `src` in `project/deck.json` `faces`, under the key in the Slides column. A deck takes a font as a file only under the rule in Slides’ `fonts.md` (no space or leading underscore in its path, for two): any other font, or one kept by id, is uploaded as `fonts.md` says.
- **Any other page:** one file per family is enough (below: the upright face nearest regular weight; bold and italic synthesize). Fetch it as the fetch column says (Artifact tool `read`, that id or path as `path`), upload it as an asset (`publish`, `file_path`, `asset:true`) and declare it with an `@font-face { font-family: "<family>"; src: url(<uploaded>) }` rule.

| family | file | fetch | CSS | Slides `faces` key |
| --- | --- | --- | --- | --- |
| Pretendard Variable | `fonts/PretendardVariable.woff2` (weight 45 920) | `read` the file with `project/` in front | `var(--font-sans)` | `pretendard-variable` |

**Read, per thing:** a component’s props, parts and examples: `api/components/<Comp>.md`; token values: `api/tokens.md`; stored assets and their paths: `api/assets/<Group>.md`. After this README, fetch the cards and fonts you need in ONE message as parallel calls — none depends on another.

**Two rules.** Before you use a thing — a component, a token group, an icon, an asset — read its card from the index below; a value you did not read from a card is a guess. `tokens.json`, `manifest.json` and `design-system.json` are sources for tools: hand them over. `components/<Comp>/README.md` and `assets/<Group>/README.md` are the long-form second read a card links to; `SKILL.md` and `artifact-type/` beside them are authoring guidance, not needed to consume the system.

## Index (generated — do not edit)

**Tokens**

- `api/tokens.md` — Every token: surface, text, border, palette, type, spacing, radius, shadow, font-size, size. (14.1k)

**Icons and assets**

- `api/assets/Logos.md` — 1 file, by asset id. (0.9k)
- `api/assets/Icons.md` — 41 files, by asset id. (3.9k)

**Components** (`api/components/<Comp>.md`, 24)

- **Identity**: `Avatar` — 사람을 나타내는 원형 사진 자리. 사진이 없으면 이름 첫 글자를 넣는다
- **Status**: `Badge` — 행이나 카드의 상태를 한 단어로 보여 주는 표시다 · `Empty` — 목록이나 구역에 보여 줄 것이 없을 때 그 자리를 채운다 · `Progress` — 진도율처럼 0~100% 값을 막대로 보여 준다
- **Actions**: `Button` — 화면에서 누르는 동작은 모두 cl-btn 하나에 종류와 크기를 붙여 만든다
- **Dashboard**: `Chart` — 대시보드 막대 그래프(로그인 현황, 학습 시간대, 트래픽, 저장량) · `NeedsList` — 대시보드 '확인 필요': 관리자가 지금 처리할 일을 상태 순서로 모은 목록 · `StatStrip` — 대시보드 맨 위 숫자 띠. 핵심 숫자 여섯 개를 한 줄에 둔다
- **Filters**: `Chip` — 여러 값 중 하나로 목록을 거를 때 쓰는 알약 모양 버튼이다 · `Segmented` — 같은 목록을 다르게 보는 두세 가지 방식 중 하나를 고른다. 표/카드 보기, 대시보드 기간(오늘 · 7일 · 30일)에 쓴다 · `Toolbar` — 목록 바로 위에서 검색 · 거르기 · 개수를 한 줄에 모은다
- **Overlays**: `Dialog` — 흐름을 멈추고 확인을 받거나 짧은 입력을 받는 창 · `Menu` — 버튼을 누르면 뜨는 동작 목록(행 메뉴 ⋯, 계정 메뉴, 새로 만들기, 엑셀 메뉴)
- **Forms**: `Field` — 폼 입력 한 칸: 이름표, 입력 칸, 도움말 또는 오류
- **Data**: `MobileCard` — 900px 이하에서 표(cl-table)가 바뀌는 카드형 행. 따로 만드는 컴포넌트가 아니라 같은 표 마크업이 CSS로 바뀐다 · `SelectionBar` — 표에서 행을 고르면 화면 아래에 떠서 고른 행에 할 일을 보여 준다 · `Table` — 여러 행을 같은 칸으로 비교하는 목록. 작업공간 목록 화면의 기본이다 · `TeacherList` — 관리자 선생님 목록 표. 사람 목록의 기준 화면이다
- **Layout**: `PageHead` — 화면 맨 위: 상위 메뉴, 제목, 화면 단위 버튼, 설명 · `Sidebar` — 작업공간 왼쪽 메뉴. 메뉴 검색, 묶음 이름, 메뉴 항목, 아래 바로가기 · `Topbar` — 작업공간 맨 위 고정 줄: 브랜드, 학기, 알림, 계정
- **Navigation**: `Pagination` — 목록 아래 쪽 번호 · `Tabs` — 한 목록을 상태별로 나눠 볼 때 쓴다(학생 목록: 전체 · 승인 · 대기 · 탈퇴, 강좌 관리: 과목별)
- **Feedback**: `Toast` — 동작이 끝났다는 것을 화면 아래 가운데에 잠깐 알린다
