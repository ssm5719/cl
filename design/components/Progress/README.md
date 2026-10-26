# Progress

진도율처럼 0~100% 값을 막대로 보여 준다.

- `cl-progress`: 막대 높이 6px, 반경 `cl-radius-pill`, 바탕 `cl-heat-0`, 채움 `cl-primary`, 100% 는 `is-done` 으로 `cl-success`. 값 글자는 `cl-fs-caption` 600, 최소 너비 36px.
- 표 안 작은 막대(`cl-pd-mini`)는 바탕이 `#ECECEF` 직접 값이다.
- 진도 단계 색은 `cl-heat-0`~`cl-heat-3` 을 쓴다(시작 전 · 1~49% · 50~99% · 완료).

## 지금 어긋난 곳

- `#ECECEF` 가 진도 · 점수 막대 바탕으로 6곳에 직접 적혀 있다. `cl-heat-0`(#F4F4F6)과도 다르다.
