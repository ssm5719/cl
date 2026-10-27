# -*- coding: utf-8 -*-
"""야간 검수 화면 6개 — 실제 사이트(2026.10.27) 마크업 구조 그대로, 사진은 회색 칸 · 기본 사람 그림으로."""
import pathlib
LAB = pathlib.Path(__file__).resolve().parent.parent
OUT = pathlib.Path(__file__).resolve().parent / 'screens'
shell = (LAB / 'screens/a-courses.html').read_text(encoding='utf-8')

P = {
 'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
 'share': '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line>',
 'chev': '<path d="m9 18 6-6-6-6"></path>', 'chevl': '<path d="m15 18-6-6 6-6"></path>',
 'ext': '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>',
 'search': '<circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>',
 'clock': '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>',
 'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
 'cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>',
 'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
 'mega': '<path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>',
 'edit': '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>',
 'list': '<path d="M3 12h.01"></path><path d="M3 18h.01"></path><path d="M3 6h.01"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M8 6h13"></path>',
 'file': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
}
def ic(k, s=16):
    return (f'<svg class="cl-icon" width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{P[k]}</svg>')
PH = '<span class="cl-ph" style="display:block;width:100%;height:100%">사진</span>'
PERSON = '<img src="../img/default-person.svg" alt="">'

def band(title, sub, crumbs):
    c = '<a href="#" data-lab-go="a-main">홈</a>'
    for i, (t, go) in enumerate(crumbs):
        c += ' <span aria-hidden="true">›</span> '
        c += f'<a href="#" data-lab-go="{go}">{t}</a>' if go else f'<span data-band-crumb-last="">{t}</span>'
    s = f'<p class="cl-pub-band__sub">{sub}</p>' if sub else ''
    return f'<div class="cl-pub-band"><div class="cl-pub-wrap"><nav class="cl-pub-band__crumb" aria-label="현재 위치">{c}</nav><h1 class="cl-pub-band__title">{title}</h1>{s}</div></div>'

def page(name, title, nav, main):
    a, b = shell.index('<main'), shell.index('</main>') + len('</main>')
    out = shell[:a] + f'<main id="cl-main" class="cl-pub-main" tabindex="-1">{main}</main>' + shell[b:]
    out = out.replace('<title>전체강좌 | 클라우드러닝</title>', f'<title>{title} | 클라우드러닝</title>')
    out = out.replace('<a class="cl-pub-nav__item is-active" href="#" aria-current="page">전체강좌</a>', '<a class="cl-pub-nav__item" href="#">전체강좌</a>')
    if nav:
        out = out.replace(f'<a class="cl-pub-nav__item" href="#">{nav}</a>', f'<a class="cl-pub-nav__item" href="#" aria-current="page">{nav}</a>', 1)
    (OUT / f'{name}.html').write_text(out, encoding='utf-8')

# 1 학원소개
desc = ('<h3>랩241은 영상 시스템 설계, 영상 솔루션 컨설팅, 및 온라인 교육 플랫폼을 선도해 나가는 기업입니다.</h3>'
        '<p>2015년 영상 시장에서 독보적인 기업으로 도약하기 위해 뜻을 모아 새롭게 시작하였습니다.</p>'
        '<p>빠르게 발전하는 영상 환경을 분석하고, 변화하는 트렌드에 민감하게 반응하여 영상 시장에 안정적으로 정착하였습니다.</p>'
        '<p>그리고 독자적으로 개발한 영상 저장 장비와 솔루션은 시장에 좋은 반응을 이끌어내며 전문 영상 솔루션 기업으로 자리매김했습니다.</p>')
pill = lambda t: f'<a class="cl-home-pill" href="#"><span class="cl-home-pill__logo" style="width:22px;height:22px;border-radius:999px;background:var(--cl-hover)"></span>{t}{ic("ext", 14)}</a>'
photos = ''.join(f'<button type="button" class="cl-about__photo{" is-extra" if i == 3 else ""}" aria-label="갤러리 {i+1} 크게 보기">{PH}</button>' for i in range(4))
page('a-about', '학원소개', '학원소개',
     band('학원소개', '믿음으로 선택한 고객에게 신뢰로 보답해온 랩241', [('학원소개', None)]) +
     '<div class="cl-pub-wrap cl-about" data-about=""><div class="cl-about__text"><h2 class="cl-about__headline">믿음으로 선택한 고객에게 신뢰로 보답해온 랩241</h2>'
     f'<div class="cl-about__desc toastui-editor-contents"><div class="toastui-editor-contents">{desc}</div></div>'
     '<dl class="cl-about__info"><dt>주소</dt><dd>서울특별시 금천구 가산동 000로 00 0000호</dd><dt>전화</dt><dd><a class="cl-num" href="#">02-0000-0000</a></dd></dl>'
     f'<div class="cl-about__sns">{pill("블로그")}{pill("유튜브")}</div></div>'
     f'<div class="cl-about__gallery is-count-3">{photos}<button type="button" class="cl-about__more">+1장 더 보기</button></div></div>')

# 2 선생님 목록
T = [('이서당', '조하늘', '과학과 수학을 사랑하며, 학생들이 흥미를 느끼도록 노력하겠습니다.', 3, True),
     ('동영상녹화', '박채원', '', 0, True), ('수학', '최민재', '', 0, True), ('국어', '정다은', '', 0, True),
     ('수학 · 영어 · 국어', '선우진', '', 0, False)]
cards = ''
for sub, n, cm, like, photo in T:
    ph = PERSON if photo else f'<span class="cl-teacher-card__photo__initial" aria-hidden="true">{n[0]}</span>'
    cmt = f'<span class="cl-teacher-card__comment">{cm}</span>' if cm else ''
    cards += (f'<li><a class="cl-teacher-card" href="#" data-lab-go="a-teacher-read"><span class="cl-teacher-card__photo">{ph}</span><span class="cl-teacher-card__body">'
              f'<span class="cl-teacher-card__subject" title="{sub}">{sub}</span><strong class="cl-teacher-card__name">{n} 선생님</strong>{cmt}'
              f'<span class="cl-teacher-card__meta">{ic("heart", 13)}좋아요 {like}</span><span class="cl-teacher-card__btn">프로필</span></span></a></li>')
chips = '<button type="button" class="cl-chip" aria-pressed="true">선생님 전체<span class="cl-chip__count cl-num">20</span></button>' + ''.join(
    f'<button type="button" class="cl-chip" aria-pressed="false">{c}</button>' for c in ['수학', '국어', '영어', '이서당'])
page('a-teachers', '선생님소개', '선생님소개',
     band('선생님소개', '우리 학원 선생님을 소개합니다', [('선생님소개', None)]) +
     f'<div class="cl-pub-wrap cl-teachers"><div class="cl-chips cl-teachers__chips" role="group" aria-label="과목">{chips}</div>'
     f'<div data-list=""><ul class="cl-teacher-grid">{cards}</ul></div></div>')

# 3 선생님 상세
courses = ''.join(f'<li><a class="cl-teacher__course" href="#" data-lab-go="a-course-read"><strong>{t}</strong><span>{m}</span>{ic("chev")}</a></li>' for t, m in
                  [('중학교1학년수학복습', '중학수학복습 · 중1 · 수강생 0'), ('공통수학', '공통수학 · 공통수학1 · 수강생 0'), ('함수', '지수/로그 · 지수함수 · 수강생 0'), ('무한히 계속 더했지만 유한이 된다?', '수능 · 2027 · 수강생 0')])
page('a-teacher-read', '장현석 선생님', '선생님소개',
     band('선생님소개', '우리 학원의 선생님을 소개합니다', [('선생님소개', 'a-teachers'), ('장현석', None)]) +
     '<div class="cl-pub-wrap cl-teacher"><section class="cl-teacher__card" aria-label="프로필">'
     f'<div class="cl-teacher__head"><span class="cl-teacher__avatar">{PERSON}</span><h2 class="cl-teacher__name">장현석 선생님</h2></div>'
     '<dl class="cl-teacher__info"><div><dt>담당과목</dt><dd>수학</dd></div><div><dt>한마디</dt><dd>과학과 수학을 사랑하며, 학생들이 흥미를 느끼도록 노력하겠습니다.</dd></div></dl>'
     '<div class="cl-teacher__desc toastui-editor-contents"><div class="toastui-editor-contents"><div><p><br></p></div></div></div>'
     f'<div class="cl-cd__pills"><button type="button" class="cl-cd-pill cl-like-btn" aria-pressed="false">{ic("heart")}<span class="cl-num">좋아요 0</span></button><button type="button" class="cl-cd-pill">{ic("share")}공유하기</button></div></section>'
     f'<section class="cl-teacher__card cl-teacher__courses"><h2 class="cl-teacher__courses-title">담당 강좌 <span class="cl-num">7</span></h2><ul class="cl-teacher__course-list">{courses}</ul><div class="cl-teacher__more"></div></section></div>')

# 4 Q&A 목록
def qitem(course, title, writer, teacher, answers):
    st = (f'<span class="cl-qna-item__status is-answered"><strong class="cl-num">{answers}</strong><small>답변</small></span>' if answers else
          f'<span class="cl-qna-item__status is-waiting">{ic("clock", 18)}<small>답변대기</small></span>')
    w = (f'<a class="cl-post-writer is-teacher" href="#">{ic("cap", 14)}{writer} 선생님</a>' if teacher else f'<span class="cl-post-writer">{ic("user", 14)}{writer}</span>')
    return (f'<li class="cl-qna-item">{st}<div class="cl-qna-item__body"><div class="cl-qna-item__course"><a href="#">{course}</a><span class="cl-lock">{ic("lock", 12)}그룹강좌</span></div>'
            f'<a class="cl-qna-item__title" href="#" data-lab-go="s-qna-read"><span class="cl-clamp-2">{title}</span></a><div class="cl-qna-item__meta">{w}<span>2년 전</span></div></div></li>')
items = ''.join(qitem(*x) for x in [('겨울방학 영어 특강', 'PDF', '문성호', True, 0), ('수능 국어 문법 완성', '더 어려워료', '탁유원', False, 0),
                                     ('수능 국어 문법 완성', '주짓수를 더 배우고 싶어요', '탁유원', False, 4), ('수능 국어 문법 완성', '국어 동영상 6분 지점에 질문이 있습니다.', '탁유원', False, 0),
                                     ('고전 문학 읽기', '이 강의는 언제까제 볼수 있나요?', '사혜인', False, 1)])
toolbar = (f'<form class="cl-post-toolbar cl-post-toolbar--filters" role="search"><label class="cl-search">{ic("search", 15)}<input type="search" placeholder="궁금한 내용을 검색하세요" aria-label="질문 검색"></label>'
           '<span class="cl-selectbox"><button type="button" class="cl-select cl-selectbox__control cl-selectbox__button" aria-label="답변 여부"><span class="cl-selectbox__label">답변 여부 전체</span><span class="cl-selectbox__sizer" aria-hidden="true"><span>답변 여부 전체</span><span>답변대기</span><span>답변완료</span></span></button></span>'
           '<span class="cl-selectbox"><input type="text" class="cl-select cl-selectbox__control cl-selectbox__input" role="combobox" aria-label="강좌" placeholder="강좌 전체"></span>'
           '<div class="cl-segmented cl-post-order" role="group" aria-label="정렬"><button type="button" class="cl-segmented__item cl-segmented__item--text" aria-pressed="true">최신순</button><button type="button" class="cl-segmented__item cl-segmented__item--text" aria-pressed="false">답변 많은 순</button></div>'
           f'<span class="cl-toolbar__spacer"></span><a class="cl-btn cl-btn--primary" href="#">{ic("edit")}질문하기</a></form>')
pag = (f'<nav class="cl-pagination" aria-label="페이지"><button type="button" class="cl-pagination__arrow" aria-label="이전 쪽" disabled="">{ic("chevl")}</button>'
       '<button type="button" class="cl-pagination__page is-current" aria-current="page">1</button><button type="button" class="cl-pagination__page">2</button>'
       f'<button type="button" class="cl-pagination__arrow" aria-label="다음 쪽">{ic("chev")}</button></nav>')
page('a-qna', 'Q&A', 'Q&amp;A',
     band('Q&amp;A', '강의를 듣다 궁금한 점을 묻고 답해요', [('Q&amp;A', None)]) +
     f'<div class="cl-pub-wrap cl-post-page">{toolbar}<p class="cl-post-toolbar__count">질문 16개</p><div data-list=""><ul class="cl-qna-list">{items}</ul></div><div data-pagination="">{pag}</div></div>')

# 5 자유게시판 목록
def row(num, title, writer, kind, date, views, comments=0):
    notice = kind == 'notice'
    n = '<span class="cl-badge cl-badge--info">공지</span>' if notice else str(num)
    icn = {'notice': 'mega', 'student': 'user', 'teacher': 'cap'}[kind]
    w = (f'<a class="cl-post-writer is-teacher" href="#">{ic(icn, 14)}{writer} 선생님</a>' if kind == 'teacher' else f'<span class="cl-post-writer">{ic(icn, 14)}{writer}</span>')
    c = f'<span class="cl-post-row__comments cl-num" title="댓글 {comments}">[{comments}]</span>' if comments else ''
    return (f'<li class="cl-post-row{" is-notice" if notice else ""}"><span class="cl-post-row__num cl-num">{n}</span><span class="cl-post-row__main"><a class="cl-post-row__title" href="#" data-lab-go="a-board-read">{title}</a>{c}</span>'
            f'<span class="cl-post-row__writer">{w}</span><span class="cl-post-row__date cl-num">{date}</span><span class="cl-post-row__views cl-num"><span class="cl-sr-only">조회 </span>{views}</span></li>')
rows = ''.join([row(0, '여름 방학 특강 안내', '관리자', 'notice', '2023.06.20', 39), row(0, '2차학원보강입니다', '관리자', 'notice', '2023.02.07', 25),
                row(7, '화이팅', '사혜인', 'student', '2026.10.20', 6), row(6, '수학 강의 많이 올려주세요', '사혜인', 'student', '2026.10.20', 12),
                row(4, 'security_test', '스트릭스', 'teacher', '2026.10.20', 3), row(1, '수업 능률이 쑥쑥 향상 됩니다!!', '김하난', 'student', '2023.06.20', 67, 1)])
page('a-board', '자유게시판', '자유게시판',
     band('자유게시판', '학원 소식과 자유로운 이야기를 나눠요', [('자유게시판', None)]) +
     f'<div class="cl-pub-wrap cl-post-page"><div class="cl-post-toolbar"><span class="cl-post-toolbar__count">게시글 7개</span><span class="cl-toolbar__spacer"></span><a class="cl-btn cl-btn--primary" href="#">{ic("edit")}글쓰기</a></div>'
     '<div data-list=""><ol class="cl-post-list"><li class="cl-post-row cl-post-row--head" aria-hidden="true"><span>번호</span><span>제목</span><span>작성자</span><span>등록일</span><span>조회</span></li>'
     f'{rows}</ol></div></div>')

# 6 자유게시판 읽기
page('a-board-read', '게시글', '자유게시판',
     band('자유게시판', '', [('자유게시판', 'a-board'), ('게시글', None)]) +
     '<div class="cl-pub-wrap cl-post-page"><article class="cl-post"><header class="cl-post__head"><h2 class="cl-post__title">수업 능률이 쑥쑥 향상 됩니다!!</h2>'
     f'<div class="cl-post__meta"><span class="cl-post-writer">{ic("user", 14)}김하난</span><span class="cl-num">2026.10.20 10:41</span><span class="cl-num">조회 67</span><span class="cl-toolbar__spacer"></span>'
     f'<button type="button" class="cl-btn cl-btn--text cl-btn--sm">{ic("share", 14)}공유</button><button type="button" class="cl-btn cl-btn--text cl-btn--sm">{ic("file", 14)}인쇄</button></div></header>'
     '<div class="cl-post__body toastui-editor-contents"><div class="toastui-editor-contents"><p>집에서 동영상으로 천천히 강의를 다시 보며 할 수 있으니</p><p>이해가 안되었던 부분도 다시 확인하고 시간에 쫓겨 메모를 하지 않아도 되니</p><p>너무 너무 좋습니다.</p></div></div></article>'
     '<section class="cl-comments"><h2 class="cl-comments__title">댓글 <span class="cl-num">1</span></h2><form class="cl-comments__form"><label class="cl-sr-only" for="ci">댓글</label>'
     '<textarea id="ci" class="cl-input cl-comments__input" rows="3" placeholder="로그인 후 댓글을 남길 수 있습니다"></textarea><button type="submit" class="cl-btn cl-btn--primary">등록</button></form>'
     f'<ul class="cl-comments__list"><li class="cl-comment"><span class="cl-comment__avatar">{PERSON}</span><div class="cl-comment__body"><div class="cl-comment__meta"><span class="cl-post-writer">{ic("user", 14)}사혜인</span><span class="cl-num">2026.10.20 17:15</span></div><p class="cl-comment__text">동감입니다</p></div></li></ul></section>'
     f'<div class="cl-post-footer"><a class="cl-btn cl-btn--ghost" href="#" data-lab-go="a-board">{ic("list")}목록으로</a></div></div>')
print('ok', sorted(p.name for p in OUT.iterdir()))
