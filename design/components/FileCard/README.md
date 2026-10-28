# FileCard

파일 카드 · 문서 보기. 2026.10.28 (강의 보기 — 영상 없이 문서만 있는 강의).

## 파일 카드 `cl-filecard`

미리보기가 안 되는 파일(한글 · 워드 · PPT)과 휴대폰에서 쓴다. 가운데 정렬: [파일 아이콘 64 흰 칸 + 오른쪽 아래 종류 표시 `cl-filecard__ext`(보라 20)] / 이름 `cl-filecard__name` 17 · 600 / '종류 · 쪽수 · 크기' `cl-filecard__meta` 13 / 위 16 띄워 [내려받기 primary][새 창으로 열기 ghost] 40(`cl-h-control-lg`). 쪽수를 모르면 빼고 '종류 · 크기'.

## 문서 보기 `cl-docview`

PDF 를 칸 안에서 바로 볼 때(실제는 브라우저 PDF 보기 iframe). 먹색 머리 줄 44(`cl-surface-dark`, 이름 · 쪽 · 확대) 아래 `cl-disabled-bg` 바탕에 쪽(흰 A4 · 그림자)을 세로로.

영상 칸과 같은 16:9 자리에 넣는 배치(`.cl-player__doc`)는 강의 보기 화면 규칙(NP3)에 있다.

옛 클래스 `.cl-docfile*` → `cl-filecard*`.
