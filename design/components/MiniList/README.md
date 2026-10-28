# MiniList

좁은 칸(오른쪽 칸 · 작은 창) 안의 작은 목록. 2026.10.28 (강의 보기 '관련 질문').

- 줄 `cl-mini-list__item`: [배지 64 고정 | 제목 / 정보], 안쪽 16 · 20, 줄 아래 1px `cl-hairline`, hover `cl-row-hover`.
- 제목 `cl-mini-list__title` `cl-fs-ui` 500 한 줄 말줄임, 정보 `cl-mini-list__meta` 13 회색 한 줄.
- 강조 글자 `cl-mini-list__mark`(보라 500) — '이 강의'.
- 끝 줄 `cl-mini-list__foot` — [전체 보기 ↗] 13 회색 가운데.
- 배지 없이 쓰려면 `cl-mini-list--plain`.

옛 클래스 `.cl-prelated*` → 위로.
