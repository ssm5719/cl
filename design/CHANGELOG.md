# 변경 기록

## v1.3 — 2026.10.28 (밤) · 공통 부품 정리

- 규칙: 모든 화면은 CSS · 디자인시스템 안의 부품만 쓴다. README 에 "공통 부품 먼저" 장과 부품 표.
- 새 부품 6개(문서 + 미리보기): Link(`cl-link` · `cl-more-link`) · Status(`cl-count` · `cl-status` · `cl-tag` · `cl-reveal`) · Composer(`cl-composer`) · MiniList(`cl-mini-list`) · Popover(카드형 · `cl-person` · `cl-subhead` · `cl-link-list`) · FileCard(`cl-filecard` · `cl-docview`).
- 기존 부품 변형 추가: Button `--soft · --dark · --line · --float · --on-dark · --md · --xl · --block · __arrow`, IconButton `--round · --soft · --on-dark · --xs · --md · --lg`, Tabs `--line`, Empty `--line · --sm`(옛 `cl-pub-empty`), Avatar `--ph · --md · --lg · --fill`(옛 `cl-avatar-ph`).
- 화면 전용 클래스 → 공통: `cl-ptabs` · `cl-ask*` · `cl-prelated*` · `cl-tpop*` · `cl-docfile*` · `cl-pub-empty*` · `cl-avatar-ph` · `cl-cd-pill` · `cl-home-pill` · `cl-home-btn*` · `cl-home-more(-btn)` · `cl-home-slider__ctl` · `cl-home-tile__more` · `cl-ua-copy` · `cl-mt-enter` · `cl-mt-course__open` · `cl-gs-link` · `cl-pw-reset` · `cl-mm-kw` · `cl-ma-state` · `cl-ip-warn`. 바꾸는 표는 Button README.
- 토큰: 글자 고정 단계 `cl-fs-10 ~ cl-fs-72`(20개), 모서리 `cl-radius-3xs`(2) · `cl-radius-xl`(16), 색 `cl-on-ink-2` · `cl-on-ink-muted` · `cl-on-ink-faint` · `cl-surface-dark-hover` · `cl-disabled-bg` · `cl-media-bg`. 실험실 CSS · 수정안 · 화면의 직접 쓴 px · hex 430곳을 토큰으로(반 픽셀 글자는 가까운 단계로).
- `components/bundle.css` 를 `design/build_bundle.js` 로 다시 만듦 — student.css · public.css 와 제안 항목까지 포함.

## v1.2 — 2026.10.28 (오후)

- 학원 메인 대시보드형(NM1) 확정 — AcademyPublic 에 한 장, CSS 묶음에 추가. 배치 · 선생님 검은 칸은 그대로.
- Button 에 `cl-btn--pill`(알약 모서리) · `cl-btn--undo`(상태 → 되돌리기, 올리면 위험 색) 추가. 전체강좌 수강중 · 수강신청이 화면 전용 클래스 대신 이것을 쓴다.
- 토큰 2개 추가: `--cl-primary-wash`(#f7f3fd, 사진 없는 선생님 원 바탕) · `--cl-primary-line`(#e4d7f8, 연보라 판 위 흰 버튼 테두리). 실험실에서 직접 적던 #F7F3FD · #E4D7F8 · #E9DDFB · #A1A1A6 · #3A3A3D 를 토큰(wash · line · tint-hover · ink-faint · surface-dark)으로 바꿈.
- 학원 공개 화면 부품 문서 `components/AcademyPublic/README.md` 와 CSS(`components/bundle.css` 끝) — NE1 · NI1 · NC1 · NQ4 · NQ5 · NF4 · NS1 · NT6(확정), NP1 · NP2 · NP3(제안).
- Avatar · Button · Tabs README 에 공개 화면 규칙 한 단락씩.
- 토큰 3개 더: `--cl-fs-section-pub`(26~32) · `--cl-fs-body-sm-pub`(15) · `--cl-radius-2xs`(6) — 실험실에서 쓰던 값을 `tokens.json` 에 등록.
- 규칙 문서를 `api/` 밖 `public-ui-rules.md` 로 옮김(`api/` 는 디자인시스템 아티팩트가 만드는 곳).
- 디자인시스템 아티팩트(클라우드러닝 작업공간)에 같은 내용 반영 — README 에 "학원 공개 화면" 장, 새 장 "학원 공개 화면 UI 규칙", 부품 AcademyPublic(미리보기 포함).

## v1.1 — 2026.10.28

- 학원 공개 화면 UI 규칙 한 장으로 정리(`public-ui-rules.md`) — 글자 · 여백 · 선과 상자 · 색 · 움직임 · 빈 상태 · 사람 아이콘 · 이동 · 문장.
- Empty 에 "학원 공개 화면" 규칙 추가 — 회색 점선 상자 `cl-pub-empty`, 화면별 문장 표, 새 목록 화면을 만들 때 순서(`components/Empty/README.md`).

## v1.0 — 2026.10.26

디자인시스템 아티팩트의 내용을 이 저장소로 옮겼습니다.

- 토큰 · 부품 24개 · 적용 범위 · 점검 목록 전부.
- 아이콘 41개와 로고는 아티팩트 자산 저장소에 그대로 두었습니다(`api/assets/` 참고).
- `design-system.json` 은 아티팩트 내부 파일이라 제외했습니다.

### 그 전에 정한 것

| 날짜 | |
| --- | --- |
| 2026.10.22 | `cl-warning` 을 **#9A5200** 으로 확정(#CE6E00 은 흰 배경 3.59:1 로 글자에 못 씀) · 적용 범위에 다크모드 범위 추가 |
| 2026.10.22 | 포털 · 학원 페이지 CSS 확인 — 세 화면 묶음이 같은 공통 파일을 씀(`ver=1.6.28`) |
| 2026.10.19 | 화면 5개와 CSS 4개를 기준으로 첫 점검 목록 작성 |
