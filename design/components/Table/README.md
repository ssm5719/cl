# Table

여러 행을 같은 칸으로 비교하는 목록. 작업공간 목록 화면의 기본이다.

- 너비는 본문 가득(본문 최대 1,680px — PageHead "화면 폭"), 숫자는 고정폭(`tabular-nums`).
- 머리: 높이 `cl-h-table-head`(40px), `cl-fs-table-head` 500 `cl-ink-muted`, 아래 1px `cl-grid-head`.
- 행: 최소 높이 `cl-h-table-row`(44px), 안쪽 8px 12px, 아래 1px `cl-grid-row`, hover · 키보드 포커스(`:focus-within`) 바탕 `cl-hover`(#F4F4F6) — 넓은 표에서 한 줄을 끝까지 따라갈 수 있게. 터치 기기(`hover: none`)에서는 hover 바탕 없음. 고른 행 `cl-primary-tint` 가 hover 보다 우선.
- 첫 칸 왼쪽 여백 0. 날짜 · 보조 값은 `cl-muted`.
- 빈 값: 소속 그룹처럼 값이 없으면 `—`(`cl-muted`), 휴대폰은 "미등록".
- 행 끝 메뉴는 `cl-icon-btn` + 떠 있는 `cl-menu`.
- 900px 이하에서는 카드형 행으로 바뀐다 (MobileCard).

## 지금 어긋난 곳

- "미등록"은 보통 글자색이고 `—` 는 흐리게 나온다. 빈 값 표시가 두 가지다.
- 휴대폰 번호에 하이픈이 없다(01067060246).
- 첫 칸(`data-primary`)이 아이디다. 사람 목록은 이름이 첫 칸이어야 모바일 카드 제목이 이름이 된다.
