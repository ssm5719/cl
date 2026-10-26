# Sidebar

작업공간 왼쪽 메뉴. 메뉴 검색, 묶음 이름(접기 · 펼치기), 메뉴 항목, 아래 바로가기.

- 너비 `cl-w-ws-sidebar`(240px), 배경 `cl-sidebar`, 오른쪽 1px `cl-sidebar-border`.
- 메뉴 검색: ⌘K 로 연다. 결과 창은 사이드바보다 넓게 본문 위로 펼친다. 접힌 묶음의 메뉴도 찾는다. 검색 칸과 첫 메뉴 사이 16px.
- 단독 메뉴(대시보드): 묶음 이름 없이 메뉴만. 묶음 이름과 같은 위계(15px 600 `cl-ink-2`, 아이콘 있음), 현재 화면이면 `cl-primary-tint` 바탕.
- 묶음 이름 `cl-ws-nav__label`: `<button aria-expanded>` — 높이 34px, 15px 600 `cl-ink-2`, 앞에 그 묶음 아이콘 16px(접은 아이콘 줄과 같은 것), 오른쪽 꺾쇠. 누르면 접고 펼친다(높이 · 꺾쇠 0.22초). 처음엔 모두 펼침, 이후 사용자가 접고 편 상태를 기억(localStorage `cl.ws.nav.open`). 현재 메뉴가 든 묶음은 늘 펼침.
- 메뉴 항목: 높이 `cl-h-nav-item`(34px), 15px `cl-ink-2`, **아이콘 없음**, 왼쪽 40px(묶음 이름 글자보다 8px 안쪽), 항목 사이 5px, 묶음 사이 12px. hover `cl-nav-hover`.
- 현재 메뉴(`aria-current="page"`): 바탕 `cl-canvas`, `cl-ring-active`, 글자 `cl-primary-pressed` 600.
- 접기 버튼: 브랜드 칸 오른쪽 `cl-ws-collapse` — 240px ↔ 56px 아이콘 줄. 상태 기억(localStorage `cl.ws.collapsed`), 첫 화면 그리기 전에 적용해 깜빡임 없음.
- 태블릿(1280px 이하)은 56px 아이콘 레일(접기 버튼 없음), 모바일(900px 이하)은 300px 서랍으로 바뀐다.
- 움직임은 `prefers-reduced-motion: reduce` 에서 끈다.

## 지금 어긋난 곳

- 관리자 묶음 이름 "강좌 관리"가 선생님 화면 제목 "강좌 관리"와 같다.
- 15px 는 글자 단계에 없다 — 사이드바 토큰(`cl-fs-nav`)을 새로 둔다.
