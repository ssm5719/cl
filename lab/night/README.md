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
