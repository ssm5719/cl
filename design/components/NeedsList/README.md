# NeedsList

대시보드 '확인 필요': 관리자가 지금 처리할 일을 상태 순서로 모은 목록.

- 구역 너비 300px, 위아래 20px, 오른쪽 1px `cl-grid-head`.
- 제목 `cl-md-title` 14px 700.
- 항목 `cl-md-need`: 안쪽 10px, 반경 8px, 점 8px + 굵은 한 줄 + 보조 한 줄(`cl-fs-caption` `cl-ink-muted`). 누르면 해당 목록으로 간다.
- 점 색: 주의 `cl-warning`, 위험 `cl-danger`, 그 밖 `cl-ink-muted`.
- 구역 아래 끝에 도움말(`cl-field__help`).

## 지금 어긋난 곳

- 제목이 14px 로 본문과 같다. `cl-fs-section-title`(16px)이 있는데 쓰지 않는다 (점검 2).
- 배경: 주의 항목은 `#FFF9F0`, 위험 항목은 배경이 없다 (점검 4). 선택자 `.cl-md-need.is-warning:first-child` 가 "첫 항목만"을 노렸지만 항목마다 `<li>` 안 첫째라 모든 주의 항목에 걸린다.
- 순서가 들어온 순서라 위험(빨강)이 가운데에 있다.
- 아래 도움말은 '전체 사용 용량' 이야기라 이 목록과 관계가 없다.
