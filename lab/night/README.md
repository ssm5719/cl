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
