# Popover

여는 버튼 아래에 붙어 열리는 작은 창. 페이지를 옮기지 않고 정보를 보여 줄 때 쓴다(강의 보기 선생님, 계정 메뉴, 알림).

- 틀 `cl-popover`(인라인 버튼 옆이면 `cl-popover--inline`) 안에 `cl-popover__panel`: 흰 바탕, `cl-shadow-float` + 1px `cl-hairline`, 모서리 12. 기본은 오른쪽 끝 맞춤, `--start` 는 왼쪽 끝 맞춤.
- 카드형 `cl-popover__panel--card`: 폭 320 · 안쪽 20 · 모서리 8 · 버튼 아래 8. 2026.10.28.
- 여는 버튼은 `aria-expanded` 로 열림을 알리고, 바깥 클릭 · Esc 로 닫는다.

## 카드 안 부품

| 클래스 | 모양 |
| --- | --- |
| `cl-person` | [아바타 | 이름 `cl-person__name` 15 · 600 / 부제 `cl-person__sub` 13 회색], 사이 12. 아바타는 `cl-avatar cl-avatar--lg`(44) |
| `cl-subhead` | 목록 위 회색 작은 제목 13 · 500 + `cl-count`, 위 20 · 아래 8 |
| `cl-link-list` | 위아래 선으로 나눈 링크 줄 `cl-link-list__item`(위아래 10, `cl-fs-ui`), 글은 `cl-link-list__text` 한 줄 말줄임, 끝에 배지 하나. 올리면 글자 보라 |
| 맨 아래 버튼 | `cl-btn cl-btn--soft cl-btn--md cl-btn--block`, 목록과 16 |

옛 클래스 `.cl-tpop*` · `.cl-tpop-wrap` → 위로.
