"""학원 전체강좌 · 학생 로그인 — a-courses 틀에 강좌 7개 · 수강 상태. 기본 화면을 고치면 다시 실행."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
s = open('a-courses.html').read()
I = lambda p, w=13: f'<svg class="cl-icon" width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{p}</svg>'
USERS = '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'
HEART = '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>'
CHECK = '<path d="M20 6 9 17l-5-5"></path>'; PLUS = '<path d="M5 12h14"></path><path d="M12 5v14"></path>'
C = [('2027년 수능', '수능 · 2027', 2, 7, 0, 1), ('2026년 수능 기출', '수능 · 2027', 2, 1, 0, 1), ('이차방정식의 근과 계수의 관계', '수능 · 2027', 1, 1, 0, 1),
     ('무한히 계속 더했지만 유한이 된다?', '수능 · 2027', 2, 1, 0, 1), ('함수', '지수/로그 · 지수함수', 2, 0, 0, 0), ('공통수학', '공통수학 · 공통수학1', 2, 0, 0, 0), ('중학교1학년수학복습', '중학수학복습 · 중1', 0, 0, 0, 0)]
def state(on):
    return (f'<button type="button" class="cl-btn cl-btn--undo cl-btn--pill lab-live" aria-label="수강중 · 누르면 수강 취소"><span class="cl-btn__now">{I(CHECK, 12)}수강중</span><span class="cl-btn__undo">수강 취소</span></button>' if on else
            f'<button type="button" class="cl-btn cl-btn--tint cl-btn--pill lab-live">{I(PLUS, 12)}수강신청</button>')
def card(c):
    n, m, l, st, lk, on = c
    return (f'<li class="cl-cs-card"><a class="cl-cs-card__link" href="#" data-lab-go="a-course-read"><span class="cl-cs-thumb cl-cs-thumb--card"><img src="../img/course-default.png" alt=""></span>'
            f'<span class="cl-cs-meta">{m}</span><strong class="cl-cs-name">{n}</strong><span class="cl-cs-teacher" title="장현석">장현석</span></a>'
            f'<div class="cl-cs-card__foot"><span class="cl-cs-stats"><span aria-label="강의 {l}">강의 {l}</span><span aria-label="수강생 {st}">{I(USERS)}{st}</span><span aria-label="좋아요 {lk}">{I(HEART)}{lk}</span></span>'
            f'<span class="cl-toolbar__spacer"></span>{state(on)}</div></li>')
s = re.sub(r'<ul class="cl-cs-cards">.*?</ul>', '<ul class="cl-cs-cards">' + ''.join(card(c) for c in C) + '</ul>', s, count=1, flags=re.S)
s = re.sub(r'(class="cl-cs-count" data-count="">총 <strong class="cl-num">)\d+', r'\g<1>7', s)
# 머리: 학생 로그인
s = s.replace('<span class="cl-pub-hide-mobile">선생님 페이지</span><span class="cl-pub-show-mobile">선생님</span>', '<span class="cl-pub-hide-mobile">내 강의실</span><span class="cl-pub-show-mobile">내 강의실</span>')
s = s.replace('data-lab-go="t-course-read"', 'data-lab-go="s-learn"', 1)
s = s.replace('<div class="cl-menu__head"><strong>장현석 선생님</strong><span>dkjang</span></div>', '<div class="cl-menu__head"><strong>사혜인 학생</strong><span>sahyein1</span></div>')
s = s.replace('data-avatar-fallback="장" data-avatar-role="teacher"', 'data-avatar-fallback="사" data-avatar-role="student"')

# 계정 메뉴: 학원 사이트 학생 메뉴(테스트 사이트와 같은 항목 · 순서). 묶음 가르기 · 아이콘 색은 AM17 이 맞춘다
def ic(p): return '<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + p + '</svg>'
MI = [('수강중인 강좌', 's-learn', '<circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon>'),
      ('나의 글 목록', 's-qna', '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>'),
      ('좋아요 강좌', 's-like-course', HEART),
      ('나의 정보', 's-info', '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>'),
      ('이용 매뉴얼', '', '<path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>'),
      ('고객센터', '', '<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>')]
items = ''.join('<a role="menuitem" class="cl-menu__item" href="#"' + (f' data-lab-go="{g}"' if g else '') + f'>{ic(p)}{n}</a>' for n, g, p in MI)
s = re.sub(r'(<div class="cl-menu__head"><strong>사혜인 학생</strong><span>sahyein1</span></div>).*?(<button type="button" role="menuitem" class="cl-menu__item" data-logout="">)', lambda m: m.group(1) + items + m.group(2), s, count=1, flags=re.S)
open('a-courses-s.html', 'w').write(s)
print('ok')
