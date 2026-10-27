# -*- coding: utf-8 -*-
"""fixes-night.js — 실험실 fixes.js 와 같은 형식. 승인되면 이 배열을 fixes.js 끝에 붙이고 status 를 바꾼다."""
import json, pathlib
HERE = pathlib.Path(__file__).resolve().parent
def js(x): return x.replace('\\', '\\\\').replace('`', '\\`').replace('\n', '\\n')
PUBS = ['a-main', 'a-courses', 'a-course-read', 'a-player', 'a-about', 'a-teachers', 'a-teacher-read', 'a-qna', 'a-board', 'a-board-read', 's-qna-read', 's-qna-edit', 's-qna-delete-dlg']
F = []
def fx(id, group, status, kind, layer, screens, title, current, next_, css, dom='', markup='', note='', targets=()):
    F.append(dict(id=id, group=group, status=status, kind=kind, layer=layer, screens=screens, title=title, current=current, next=next_, css=css, dom=dom, markup=markup, note=note, targets=list(targets)))

fx('NB1', 1, '제안', 'CSS', '공통 틀', [s for s in PUBS if s not in ('a-main', 'a-courses', 'a-course-read', 'a-player')],
   '공개 화면 제목 띠 — 전체강좌 머리와 같은 단계 · 여백 · 선 폭',
   '학원소개 · 선생님소개 · Q&A · 자유게시판의 제목 띠(.cl-pub-band) 제목이 clamp(36, 3.9vw, 56) 로 1440 화면에서 55px. 위 여백 62 · 아래 32, 위치↔제목 12, 부제 17px 진한 회색, 아래 선은 화면 끝에서 끝까지. 전체강좌 · 강좌 상세(40 · 16 · 15 · 선 1200 폭)와 다르다',
   '제목 40(--cl-fs-display), 위 40 · 아래 24, 위치↔제목 16, 부제 15 회색, 아래 선은 본문 1200 폭',
   """/* 제목 띠를 전체강좌 머리와 같은 단계 · 여백으로 */
.cl-pub-band { padding: 40px 0 0; border-bottom: 0; }
.cl-pub-band > .cl-pub-wrap::after { content: ""; display: block; height: 1px; margin-top: 24px; background: var(--cl-hairline); }
.cl-pub-band__crumb { gap: 4px; margin-bottom: 16px; font-size: var(--cl-fs-caption); }
.cl-pub-band__title { font-size: var(--cl-fs-display); letter-spacing: -0.03em; }
.cl-pub-band__sub { margin-top: 8px; font-size: var(--cl-fs-body-sm-pub); color: var(--cl-ink-muted); }
@media (max-width: 900px) { .cl-pub-band { padding-top: 24px; } }""", targets=['.cl-pub-band'],
   note='야간 검수 리포트 1절. 띠를 쓰는 화면 전부(학원소개 · 선생님소개 · Q&A · 자유게시판 · 로그인 제외)가 함께 바뀐다.')
fx('NB2', 1, '제안', '마크업', '화면별', ['a-about'], '학원소개 본문 — 큰 제목 · 사진 모서리 · 버튼 · 정보 줄',
   '큰 제목 40px 이 띠 제목 바로 아래 또 있고 띠 부제와 같은 문장이 두 번. 사진 모서리 16, 블로그 · 유튜브 버튼 40 · 15 · 600, [+1장 더 보기] hover 없음, 주소 · 전화 줄 15px · 간격 6',
   '큰 제목 26~32(섹션 제목), 같은 문장이면 띠 부제 숨김, 사진 8, 버튼 36 · 14 · 500, 더 보기 14 + hover 밑줄, 정보 줄 14 · 간격 8',
   """.cl-about { padding-top: 40px; }
.cl-about__headline { font-size: var(--cl-fs-section-pub); letter-spacing: -0.025em; }
.cl-about__photo { border-radius: var(--cl-radius-sm); }
.cl-about__info { gap: 8px 16px; font-size: var(--cl-fs-ui); }
.cl-about__broken { font-size: var(--cl-fs-ui); }
.cl-about__sns .cl-home-pill { height: 36px; padding: 0 14px; font-size: var(--cl-fs-ui); font-weight: 500; }
.cl-about__more { font-size: var(--cl-fs-ui); text-underline-offset: 3px; }
.cl-about__more:hover { text-decoration: underline; }
.cl-lightbox__count { font-size: var(--cl-fs-caption); font-variant-numeric: tabular-nums; }""",
   dom="""var sub = doc.querySelector('.cl-pub-band__sub'), h = doc.querySelector('.cl-about__headline');
if (sub && h && sub.textContent.trim() === h.textContent.trim()) sub.hidden = true;""", targets=['.cl-about'])
fx('NT1', 2, '제안', 'CSS', '화면별', ['a-teachers'], '선생님 목록 — 모서리 · 글자 토큰',
   '카드 모서리 10, 이름 18 · 한마디 14 · 과목 13 · 좋아요 13 직접 적음, 과목 칩 13.5', '모서리 8, 17 · 14 · 13 · 13 토큰, 칩 14',
   """.cl-teacher-card { border-radius: var(--cl-radius-sm); }
.cl-teacher-card__subject, .cl-teacher-card__meta { font-size: var(--cl-fs-caption); }
.cl-teacher-card__name { font-size: var(--cl-fs-body-public); }
.cl-teacher-card__comment { font-size: var(--cl-fs-ui); }
.cl-teacher-card__btn { font-size: var(--cl-fs-ui); font-weight: 500; }
.cl-teachers__chips .cl-chip { font-size: var(--cl-fs-ui); }
@media (max-width: 600px) { .cl-teacher-card__name { font-size: var(--cl-fs-body-public); } }""", targets=['.cl-teacher-grid'],
   markup='사진 없는 칸의 성 한 글자(.cl-teacher-card__photo__initial)를 AM10 과 같은 36px 사람 아이콘으로.')
fx('NT2', 2, '제안', 'CSS', '화면별', ['a-teachers'], '[정할 것] 선생님 목록 — 가짜 [프로필] 버튼 빼고 hover 화살표 · 칩 고름 연보라',
   '카드 전체가 링크인데 [프로필] 가짜 버튼이 또 있고, 그 아래 끝이 사진보다 20px 낮다. 고른 칩은 검정 채움',
   '버튼을 빼고 글 묶음을 사진 가운데로, 이름 옆 hover 화살표(AM16). 고른 칩은 연보라 + 보라 글자, 숫자는 배지',
   """.cl-teacher-card { align-items: center; }
.cl-teacher-card__btn { display: none; }
.cl-teacher-card__body { align-self: center; padding-top: 0; }
.cl-teacher-card__meta { margin-bottom: 0; }
.cl-teacher-card__name::after { content: "›"; margin-left: 10px; color: var(--cl-primary); opacity: 0; transition: opacity 150ms ease-out; }
.cl-teacher-card:hover .cl-teacher-card__name::after { opacity: 1; }
.cl-teachers__chips .cl-chip[aria-pressed="true"] { background: var(--cl-primary-tint); color: var(--cl-primary-pressed); box-shadow: none; font-weight: 600; }
.cl-teachers__chips .cl-chip__count { height: 20px; min-width: 20px; padding: 0 6px; border-radius: var(--cl-radius-pill); display: inline-grid; place-items: center; font-size: var(--cl-fs-micro); background: var(--cl-hover); color: var(--cl-ink-muted); }
.cl-teachers__chips .cl-chip[aria-pressed="true"] .cl-chip__count { background: var(--cl-canvas); color: var(--cl-primary-pressed); }
@media (max-width: 900px) { .cl-teachers__chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; } .cl-teachers__chips .cl-chip { flex: none; } }""",
   targets=['.cl-teachers__chips', '.cl-teacher-grid'], note='모바일에서 칩이 여러 줄로 쌓여 화면 하나를 먹는 것도 전체강좌처럼 가로 넘김으로 함께 바꿨다.')
fx('NT3', 2, '제안', '마크업', '화면별', ['a-teacher-read'], '선생님 상세 — 이름 · 정보 줄 · 빈 소개글 · 배지',
   '이름 24 · 600, 담당과목 · 한마디가 180px 칸 격자라 한마디가 3줄로 접힘, 빈 소개글(<p><br></p>)이 46px 빈칸, 모서리 10 · 12',
   '이름 26 · 700, 줄마다 [이름표 80 | 값], 빈 소개글 숨김, 모서리 8, 담당 강좌 숫자는 회색 배지',
   """.cl-teacher { padding-top: 40px; }
.cl-teacher__card { border-radius: var(--cl-radius-sm); }
.cl-teacher__avatar { border-radius: var(--cl-radius-sm); }
.cl-teacher__name { font-size: var(--cl-fs-list-title); font-weight: 700; }
/* dl 안에 <div><dt/><dd/></div> 로 싸여 있다 — 줄마다 [이름표 80 | 값] */
.cl-teacher__info { grid-template-columns: minmax(0, 1fr); gap: 8px; font-size: var(--cl-fs-ui); }
.cl-teacher__info > div { display: grid; grid-template-columns: 80px minmax(0, 1fr); gap: 16px; align-items: baseline; }
.cl-teacher__info dt { font-size: var(--cl-fs-ui); }
.cl-teacher__info dd { margin: 0; font-size: var(--cl-fs-ui); }
.cl-teacher__desc { font-size: var(--cl-fs-body-public); }
.cl-teacher__desc.is-empty { display: none; }
.cl-teacher__courses-title { display: flex; align-items: center; gap: 6px; font-size: var(--cl-fs-body-public); }
.cl-teacher__courses-title .cl-num { height: 22px; min-width: 22px; padding: 0 7px; border-radius: var(--cl-radius-pill); display: inline-grid; place-items: center; font-size: var(--cl-fs-micro); font-weight: 500; background: var(--cl-hover); color: var(--cl-ink-muted); }
.cl-teacher__course strong { font-size: var(--cl-fs-body-sm-pub); }
.cl-teacher__course > span { font-size: var(--cl-fs-caption); }""",
   dom="""doc.querySelectorAll('.cl-teacher__desc').forEach(function (d) { if (!d.textContent.trim() && !d.querySelector('img, iframe, table')) d.classList.add('is-empty'); });""",
   targets=['.cl-teacher__card'])
fx('NT4', 9, '제안', 'CSS', '화면별', ['a-teacher-read'], '[정할 것] 선생님 상세 두 열 — [프로필 | 담당 강좌 360]',
   '상자 최대 860px — 1200 화면에서 오른쪽 340px 빈칸', '강좌 상세 · 강의 보기와 같은 [넓은 칸 | 360] 두 열, 담당 강좌는 따라 내려옴',
   """@media (min-width: 1101px) {
  .cl-teacher { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 32px; align-items: start; }
  .cl-teacher__card { max-width: none; }
  .cl-teacher__courses { position: sticky; top: calc(var(--cl-h-public-header) + 16px); }
}""", targets=['.cl-teacher'])
fx('NQ1', 4, '제안', 'CSS', '화면별', ['a-qna'], 'Q&A 목록 — 상태 상자 · 줄 여백 · 글자 토큰',
   '상태 상자 글자 11px(단계 밖) · 숫자 20 · 모서리 10, 줄 여백 18', '12 · 19 · 8, 여백 16, 나머지 토큰',
   """.cl-qna-item { padding: var(--cl-space-4) var(--cl-space-2); }
.cl-qna-item__status { border-radius: var(--cl-radius-sm); }
.cl-qna-item__status small { font-size: var(--cl-fs-micro); }
.cl-qna-item__status strong { font-size: var(--cl-fs-lead); }
.cl-qna-item__course, .cl-qna-item__meta { font-size: var(--cl-fs-caption); }
.cl-qna-item__title { font-size: var(--cl-fs-body-public); }
.cl-post-toolbar__count { font-size: var(--cl-fs-ui); }
@media (max-width: 900px) { .cl-qna-item__title { font-size: var(--cl-fs-body-sm-pub); } }""", targets=['.cl-qna-list'])
fx('NQ2', 4, '제안', 'CSS', '화면별', ['s-qna-read', 's-qna-edit'], 'Q&A 읽기 · 쓰기 — 답변 상자 · Q./A. 굵기 · 편집기 색',
   '답변 상자 모서리 14 · 여백 18/20, Q./A. 800, 로그인 안내 모서리 12, 편집기 도구 줄 #F7F9FC 고정, 글자 수 12', '8 · 16/20, 700, 8, 토큰, 13',
   """.cl-thread__answer { padding: 16px 20px; border-radius: var(--cl-radius-sm); }
.cl-thread__q, .cl-thread__a { font-weight: 700; }
.cl-thread__guest { border-radius: var(--cl-radius-sm); }
.cl-thread__course { font-size: var(--cl-fs-ui); }
.cl-thread__answer-meta { font-size: var(--cl-fs-caption); }
.cl-thread__answer-body { font-size: var(--cl-fs-body-sm-pub); }
.cl-editor-count { font-size: var(--cl-fs-caption); }
.cl-scope .toastui-editor-defaultUI-toolbar { background: var(--cl-parchment); border-bottom-color: var(--cl-hairline); }
.cl-scope .toastui-editor-defaultUI, .cl-scope .toastui-editor-ww-container, .cl-scope .toastui-editor-mode-switch { background: var(--cl-canvas); border-color: var(--cl-hairline); }
@media (max-width: 900px) { .cl-thread__answer { padding: 16px; } }""", targets=['.cl-thread__answers'])
fx('NQ3', 1, '제안', 'CSS', '화면별', ['a-qna'], '[정할 것] 공개 화면 정렬 모양 하나로 — 캡슐 버튼',
   '정렬이 전체강좌는 캡슐 버튼, 강좌 상세는 선택 상자, Q&A 는 회색 트랙 스위치', '전체강좌의 캡슐 버튼(고름 = 연보라 + 보라 글자)으로',
   """.cl-post-toolbar .cl-segmented { padding: 0; gap: 2px; background: transparent; }
.cl-post-toolbar .cl-segmented__item { height: 30px; padding: 0 12px; border-radius: var(--cl-radius-pill); font-size: var(--cl-fs-ui); color: var(--cl-ink-muted); box-shadow: none; }
.cl-post-toolbar .cl-segmented__item[aria-pressed="true"] { background: var(--cl-primary-tint); color: var(--cl-primary-pressed); font-weight: 600; }""", targets=['.cl-post-order'])
fx('NF1', 9, '제안', '마크업', '화면별', ['a-board'], '자유게시판 목록 — 머리줄 정렬 · 글자 토큰 · 댓글 수 배지',
   '번호 머리 왼쪽인데 번호 가운데, 작성자 머리 가운데인데 이름 왼쪽. 제목 15 · 날짜 14 직접 적음, 공지 제목 700, 댓글 수 "[1]"',
   '머리와 내용 같은 쪽, 토큰, 공지 600, 댓글 수 회색 캡슐 배지',
   """.cl-post-row--head > :nth-child(1) { text-align: center; }
.cl-post-row--head > :nth-child(3) { text-align: left; }
.cl-post-row { font-size: var(--cl-fs-body-sm-pub); }
.cl-post-row--head { font-size: var(--cl-fs-caption); }
.cl-post-row__num, .cl-post-row__date, .cl-post-row__views { font-size: var(--cl-fs-ui); font-variant-numeric: tabular-nums; }
.cl-post-row.is-notice .cl-post-row__title { font-weight: 600; }
.cl-post-row__comments { height: 20px; min-width: 20px; padding: 0 6px; border-radius: var(--cl-radius-pill); display: inline-grid; place-items: center; background: var(--cl-hover); color: var(--cl-ink-muted); font-size: var(--cl-fs-micro); font-weight: 500; }
@media (max-width: 900px) { .cl-post-row__date { font-size: var(--cl-fs-caption); } }""",
   dom="""doc.querySelectorAll('.cl-post-row__comments').forEach(function (c) { c.textContent = c.textContent.replace(/[\\[\\]]/g, ''); c.setAttribute('aria-label', c.title); });""",
   targets=['.cl-post-list'])
fx('NF2', 2, '제안', 'CSS', '화면별', ['a-board-read', 's-qna-read'], '게시글 · 질문 읽기 — 글자 토큰 · 댓글 배지 · 모바일 정보 줄 · 로그아웃 댓글창',
   '정보 14 · 본문 16 · 댓글 제목 19 · 댓글 15 직접 적음, 댓글 수 보라 글자, 모바일에서 [인쇄]만 다음 줄, 로그아웃인데 댓글 입력 · [등록] 활성',
   '13 · 17 · 19 · 15 토큰, 회색 배지, [공유][인쇄] 한 줄, 로그아웃이면 안내 상자',
   """.cl-post__title { font-size: var(--cl-fs-section-pub); }
.cl-post__meta { font-size: var(--cl-fs-caption); }
.cl-post__body { font-size: var(--cl-fs-body-public); }
.cl-comments__title { display: flex; align-items: center; gap: 6px; font-size: var(--cl-fs-lead); }
.cl-comments__title .cl-num { height: 22px; min-width: 22px; padding: 0 7px; border-radius: var(--cl-radius-pill); display: inline-grid; place-items: center; background: var(--cl-hover); color: var(--cl-ink-muted); font-size: var(--cl-fs-micro); font-weight: 500; }
.cl-comment__meta { font-size: var(--cl-fs-caption); }
.cl-comment__text { font-size: var(--cl-fs-body-sm-pub); }
.cl-comment__initial { font-size: var(--cl-fs-ui); }
.cl-comment:has(.cl-comment__avatar img) .cl-post-writer .cl-icon { display: none; }
/* 모바일에서 공통 규칙이 빈칸(spacer)을 숨겨 [인쇄]만 떨어진다 — 이 줄에서는 빈칸을 줄바꿈으로 쓴다 */
@media (max-width: 900px) { .cl-post__meta .cl-toolbar__spacer { display: block; flex: 0 0 100%; height: 0; } .cl-post__meta { row-gap: 8px; } }
.cl-comments__form.is-guest { display: none; }
.cl-comments__guest { margin: 0; padding: 20px; border-radius: var(--cl-radius-sm); background: var(--cl-parchment); text-align: center; color: var(--cl-ink-2); }
.cl-comments__guest a { color: var(--cl-primary-pressed); font-weight: 600; }""",
   markup='로그아웃이면 .cl-comments__form 에 is-guest 를 붙이고 그 자리에 <p class="cl-comments__guest"><a href="/user/auth/login">로그인</a>하면 댓글을 남길 수 있어요</p>.',
   targets=['.cl-post', '.cl-comments'])
fx('NF3', 2, '제안', 'CSS', '화면별', ['a-board-read', 's-qna-read'], '[정할 것] 읽기 화면은 띠 제목을 빼고 글 제목을 화면 제목으로',
   '띠 제목 "자유게시판" 55px 아래 글 제목 31px — 화면의 주인공인 글이 더 작다', '[위치] 16 [글 제목 40] — 강좌 상세와 같은 구조',
   """.cl-pub-main:has(.cl-post) .cl-pub-band__title, .cl-pub-main:has(.cl-post) .cl-pub-band__sub { display: none; }
.cl-pub-main:has(.cl-post) .cl-pub-band { padding-top: 40px; }
.cl-pub-main:has(.cl-post) .cl-pub-band > .cl-pub-wrap::after { display: none; }
.cl-pub-main:has(.cl-post) .cl-pub-band__crumb { margin-bottom: 0; }
.cl-pub-main:has(.cl-post) .cl-post-page { padding-top: 16px; }
.cl-pub-main:has(.cl-post) .cl-post__title { font-size: var(--cl-fs-display); letter-spacing: -0.03em; }""", targets=['.cl-pub-band'])

out = ['/* 야간 자율 검수(2026.10.27) — 승인 전. 실험실에는 아직 연결하지 않았다. */', 'window.LAB_FIXES_NIGHT = [']
for f in F:
    out.append('  {')
    for k in ('id', 'group', 'status', 'kind', 'layer'):
        out.append(f'    {k}: {json.dumps(f[k], ensure_ascii=False)},')
    out.append(f'    screens: {json.dumps(f["screens"], ensure_ascii=False)},')
    for k in ('title', 'current', 'next'):
        out.append(f'    {k}: {json.dumps(f[k] if k != "next" else f["next"], ensure_ascii=False)},')
    out.append(f'    css: `{js(f["css"])}`,')
    if f['dom']: out.append(f'    dom: `{js(f["dom"])}`,')
    if f['markup']: out.append(f'    markup: {json.dumps(f["markup"], ensure_ascii=False)},')
    out.append(f'    targets: {json.dumps(f["targets"], ensure_ascii=False)},')
    out.append(f'    note: {json.dumps("야간 검수 리포트 · " + f["note"] if f["note"] else "야간 검수 리포트", ensure_ascii=False)}')
    out.append('  },')
out[-1] = '  }'
out.append('];')
(HERE / 'fixes-night.js').write_text('\n'.join(out) + '\n', encoding='utf-8')
print(len(F), 'entries')
