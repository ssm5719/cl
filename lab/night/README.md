# 야간 자율 검수 (2026.10.27) — 승인 전 묶음

실험실에는 아직 연결하지 않았다. 리포트: 「야간 자율 검수 및 패치 리포트」 문서.

| 파일 | 내용 |
| --- | --- |
| `public-add.css` | 실제 `public.css` 에서 가져온, 실험실 `css/public.css` 에 없던 절(학원소개 · 선생님 목록 · 선생님 상세 · 게시판 목록). 값은 그대로 |
| `screens/*.html` | 실험실 화면 6개 — a-about · a-teachers · a-teacher-read · a-qna · a-board · a-board-read. 실제 마크업 구조, 사진은 회색 칸 · 기본 사람 그림, 연락처는 가짜 |
| `fixes-night.js` | 패치 12개(NB1 · NB2 · NT1~4 · NQ1~3 · NF1~3), 실험실 `fixes.js` 와 같은 형식, 모두 `제안` |
| `build_screens.py` · `make_fixes.py` | 위 두 가지를 다시 만드는 스크립트 |

## 승인 후 적용 (5분)

1. `public-add.css` 내용을 `css/public.css` 끝에 붙인다.
2. `screens/*.html` 을 `../screens/` 로 옮긴다.
3. `index.html` SCREENS 에 6줄 추가 (학원 탭), 머리 메뉴 이동표 `NAV_A` 에 학원소개 · 선생님소개 · Q&A · 자유게시판 연결.
4. `fixes-night.js` 의 배열을 `fixes.js` 끝에 붙이고, 승인된 항목은 `status: '확정'`, 접은 항목은 `'보류'`.
5. 머리 · 꼬리말 · 글자 단계 fix(AM1 · AM2 · AM8 · AM14 · AM17 · AM18~22 · AC1 · AD1 · AD5 · G7)의 screens 에 새 화면 6개를 더한다.

## 적용 기록

- 2026.10.28 — 확정 후보 8개(NB1 · NB2 · NT1 · NT3 · NQ1 · NQ2 · NF1 · NF2)를 `fixes.js` 에 `확정`으로 넣고, 화면 6개 · `public-add.css` 를 실험실에 반영. 정할 것 4개(NT2 · NT4 · NQ3 · NF3)는 이 폴더의 `fixes-night.js` 에만 있다.
- 2026.10.28 — 빈 화면 6개(`a-courses-empty` · `a-teachers-empty` · `a-teacher-read-empty` · `a-qna-empty` · `a-board-empty` · `a-board-read-empty`)와 `NE1`(점선 빈 상태) 추가. 빈 화면은 `build_empty.py` 가 기본 화면에서 만든다 — 기본 화면을 고치면 다시 실행. 규칙은 `design/components/Empty/README.md` "학원 공개 화면".
- 2026.10.28 — 학원 Q&A 상세 `a-qna-read`(a-qna 틀 + s-qna-read 본문, 답변 2개)를 `build_qna_read.py` 로 만듦. NQ4(목록 상태 상자 정사각형) · NQ5(상세 정리) 확정.
- 2026.10.28 — `a-qna-read-empty`(답변 없음) 추가, 목록의 답변대기 질문이 이 화면으로 감. 같은 `build_qna_read.py` 가 만든다.
- 2026.10.28 — NF4(게시글 읽기 머리 선 · [목록으로] 오른쪽 아래, Q&A 상세와 같은 규칙) 확정. 댓글 0개면 개수 배지 숨김(NE1).
- 2026.10.28 — 문서 강의 `a-player-doc`(PDF) · `a-player-doc-hwp`(한글 · 워드) 추가, `build_player_doc.py` 가 a-player 에서 만든다. 영상 화면 · 강좌 상세의 수학수능기출26 이 여기로 연결. NP3(제안).
- 2026.10.28 — 전체강좌 학생 로그인 `a-courses-s`(수강 상태 7개, `build_courses_student.py`) · NC1(카드형 · 목록형 여백 · 상태 표시) 확정.
- 2026.10.28 — 수강 상태 버튼을 공통 부품으로: `cl-btn--undo`(수강중 → 수강 취소) · `cl-btn--pill`, 수강신청은 `cl-btn--tint cl-btn--pill`. lab/css/components.css 에 정의, NC1 의 화면 전용 클래스(cl-cs-state · cl-cs-apply) 삭제.
- 2026.10.28 — 학원 메인 대시보드형 `a-main-dash`(테스트 사이트 마크업, `build_main_dash.py`) · 대시보드 CSS(`public-dash.css` → css/public.css 끝) · NM1(제안).
- 2026.10.28 — NM1 확정(배치 변경 · 선생님 칸 흰색은 빼고).

## 2026.10.28 밤 — 공통 부품 정리 · 숨은 화면

- 토큰: 글자 고정 단계 `--cl-fs-10 ~ 72`, 모서리 `--cl-radius-3xs/2xs/xl`, 색 `on-ink-2/muted/faint` · `surface-dark-hover` · `disabled-bg` · `media-bg`. css/*.css · fixes.js css · 화면 안 style 의 px/hex 430곳을 토큰으로(tok2.py).
- components.css 끝 "공통 부품 v1.3" — Button/IconButton 변형, Link, Status, Tabs--line, Composer, MiniList, Popover 카드, Avatar 변형, Empty--line, FileCard, DocView.
- 공통으로 바꾼 수정안: NP1 · NP2 · NP3 · NE1 · NI1 · AM13 · NM1 · AD5 · AE(학원소개 SNS) · U5 · C6 · I2 · X4 · I4 · Z3 · S3 · Z8. 새 수정안 NX1(공개 버튼 7종 → 공통) · NG1 · NO1 · NV1(게시글 보기 창, 처음에 NB1 로 적었다가 겹쳐서 바꿈).
- 새 화면(테스트 사이트에서 찾음): students-courses-dlg · students-join-dlg · students-group-dlg(build_student_dlgs.py), cms-owner-dlg · cms-visibility-dlg · cms-usage-dlg(build_cms_dlgs.py), board-view-dlg(build_board_view.py).
- 화면 속 전화번호를 가짜 번호(010-0000-01xx · 02-0000-0000)로.
- design/build_bundle.js 로 bundle.css 다시 만듦.

## 2026.10.29 — 선생님 화면 실제 사이트 점검

- 관리자 → 선생님 계정으로 들어가기(장현석)로 선생님 화면 전체를 열어 봄. 실험실과 구성이 같음, 가로 넘침 없음.
- 실험실에 없던 화면 추가(build_teacher_assign.py): t-assign-list(과제 있는 목록) · t-assign-read(채점) · t-assign-stats-dlg · t-assign-close-dlg · t-assign-edit-dlg.
- NA1 확정 — 과제 통계 창: 채점 0명이면 KPI '—', '미채점 · 0~20점' 분리, 미채점 순위 '—', 미제출 · 미채점 막대 회색.
- 동영상 플레이어(LABY 플레이어 v2.0 · cms.atedu.co.kr)를 `screens/player-laby.html` 로 옮김(지금 모습 — 플레이어 값 그대로) · NL1(제안) 조작 줄 수정안: 영상 위 그라데이션, 진행 막대 버튼 위 · 보라, 정지 빼고 10초 이동, 음량 막대 올릴 때만, 배속 [1.0×] 꺼냄, 멈추면 가운데 재생 버튼, 휴대폰 줄임.
- 학생 제안 26건 확정(SQ5 · LC5 · SB2 는 제안 유지). SQ6 · SB2 에 새 화면 명세(spec) 추가.
- handoff: 항목마다 실험실 화면 파일 경로, 새 화면 명세 블록, AI_PROMPT 에 [새 화면 만드는 법].
- SL3(제안) 고침 — 화면 테마는 로그인한 화면의 계정 메뉴 한 곳: 작업공간 + 학원 사이트 로그인 후(머리 프로필 드롭다운 · 휴대폰 서랍), 로그인 전 학원 · 포털은 라이트 고정. 학원 화면 25개에도 적용.
- NL1 — 스피커를 누르면 음소거 아이콘(X)으로 바뀌고 막대 0, 다시 누르면 원래 음량.
- NL1 — 자동 숨김: 재생 중 3초 가만히 · 밖으로 나가면 1초 뒤 조작 줄 · 커서 숨김, 움직이면 다시(유튜브처럼). 멈춤 · 키보드 · 배속 목록 열림 중엔 늘 보임.
- SL3 실험실 버그: 계정 메뉴 안 클릭을 실험실이 막아 [다크]가 안 먹던 것 — data-lab-own 로 통과. NL1: 마우스가 영상 밖으로 나가면 바로 페이드아웃(0.25초).
- AD6 · SL3 · NP1 · NP2 · NP3 · AM4 · SQ2 · SQ3 · SQ4 확정(남은 제안 SQ5 · SB2 · LC5). NQ5 를 로그인 학생 Q&A 상세(s-qna-read)에도. 실험실: 번호로 찾으면 그 항목만 적용하던 것을 그 화면의 수정안 전부 + 찾은 항목만 빨간 점선으로 바꿈(AD6 이 옛 화면처럼 보이던 이유).
