# Menu

버튼을 누르면 뜨는 동작 목록(행 메뉴 ⋯, 계정 메뉴, 새로 만들기, 엑셀 메뉴).

- 패널 `cl-popover__panel`: 최소 너비 200px, 배경 `cl-canvas`, 반경 `cl-radius-lg`, 그림자 `cl-shadow-float` + 1px `cl-hairline` 링. 버튼 아래 6px.
- 안쪽 6px. 항목 높이 36px, 좌우 10px, 반경 6px, 아이콘 16px, hover `cl-hover`.
- 되돌리기 어려운 동작(삭제)은 맨 아래, `cl-menu__item--danger`.
- 행 메뉴 항목 글자는 14px(직접 값).
