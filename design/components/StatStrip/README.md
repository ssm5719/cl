# StatStrip

대시보드 맨 위 숫자 띠. 핵심 숫자 여섯 개를 한 줄에 둔다.

- `cl-kpi`: 위아래 1px `cl-grid-head`, 칸 사이 1px `cl-grid-row`. 대시보드는 6칸(1280px 이하 3칸, 900px 이하 2칸).
- 칸 안쪽 14px 16px. 순서: 보조 줄(`cl-md-kpi__sub`, `cl-fs-micro` 500) → 값 → 이름(`cl-fs-caption` `cl-ink-muted`). 마크업은 이름 · 값 순서이고 `column-reverse` 로 뒤집는다.
- 값 22px 700 자간 -0.02em(토큰 밖), 단위는 `cl-fs-caption` 400 `cl-ink-muted`.
- 보조 줄 색: 늘었음 `cl-success`, 줄었음 `cl-danger`, 확인 필요 `cl-warning`.
- 집계 전 값은 `—`.

## 지금 어긋난 곳

- 값 22px 은 토큰이 없다.
- 보조 줄이 있는 칸과 없는 칸이 섞여 값 높이가 칸마다 다르다(학생 · 전체 사용 용량 · 트래픽만 보조 줄 있음).
- "전체 사용 용량은 매일 오전 9시에 갱신" 안내가 이 띠가 아니라 왼쪽 아래 '확인 필요' 구역 끝에 있다 (점검 4).
