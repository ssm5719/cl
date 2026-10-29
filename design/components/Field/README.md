# Field

폼 입력 한 칸: 이름표, 입력 칸, 도움말 또는 오류.

- `cl-field` 세로 쌓기, 사이 6px, 최대 너비 420px.
- 이름표 600. 입력 칸 `cl-input`: 높이 `cl-h-control-lg`(40px), 좌우 12px, 테두리 `cl-control-border`, 반경 `cl-radius-control`(4px), 안내 글자 `cl-ink-faint`.
- 포커스: `cl-primary` 2px 바깥선, 테두리는 숨긴다.
- 도움말 `cl-field__help`(`cl-fs-caption`, `cl-ink-muted`). 입력 칸 · 입력 줄 · 선택 버튼 줄 · 목록 바로 아래에 둘 때는 위 6px(`cl-field` 밖에 놓여도 같은 간격). 제목 바로 아래 설명은 4px. 오류는 `is-invalid` + `cl-field__error`(`cl-danger`, 500), 테두리도 `cl-danger`.
- 여러 줄 입력(`textarea.cl-input`)도 같은 글꼴 · `cl-fs-ui` · `cl-ink`, 위아래 10px, 줄높이 1.6. 브라우저 기본 글자(13.3px 검정)가 남지 않게 `font: inherit`.
- 입력 칸과 한 줄에 놓는 버튼(키워드 [추가], 코드 [복사] 등)은 입력 칸과 같은 높이 `cl-h-control-lg`(40px), 글자 `cl-fs-ui` 600. `--sm` 버튼을 입력 칸 옆에 두지 않는다.
- 2단 배치(`cl-mtf-row`) 행 사이 20px — 도움말 아래에 다음 이름표가 붙지 않게.
- 터치 기기에서는 입력 글자를 16px 로 올린다(iOS 확대 방지).
