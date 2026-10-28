"""학원 메인 · 대시보드형 — 테스트 사이트(2026.10.28) 마크업을 a-main 틀에 넣는다. 사진은 회색 칸 · 실험실 그림."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
s = open('a-main.html').read()
ARW = '<svg class="cl-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>'
def more(go, label): return f'<a class="cl-home-tile__more" href="#" data-lab-go="{go}" aria-label="{label}">{ARW}</a>'
def faces():
    out = ''
    for src in ['../img/teacher-m.jpg', '../img/teacher-f.jpg', '', '']:
        out += '<span class="cl-home-teacher__photo">' + (f'<img src="{src}" alt="" loading="lazy">' if src else '<span class="cl-home-teacher__initial">최</span>' if out.count('photo') == 2 else '<span class="cl-home-teacher__initial">정</span>') + '</span>'
    return out
SUBJ = ['전체', '동영상녹화', '유아교육학과', '기타어문학과', '간호학과', '독어독문학과', '일반행정', '선거행정', '외무영사', '전산개발', '방재안전', '일반전기', '한국어능력시험', '수학', '영어', '국어', '이서당', '클라우드러닝', '올댓에듀케이션']
chips = ''.join(f'<button type="button" class="cl-chip" aria-pressed="{"true" if i == 0 else "false"}">{t}</button>' for i, t in enumerate(SUBJ))
def ccard(cat, title):
    return (f'<a class="cl-home-ccard" href="#" data-lab-go="a-course-read"><span class="cl-home-course__thumb"><img src="../img/course-default.png" alt="" loading="lazy"></span>'
            f'<small class="cl-home-ccard__cat">{cat}</small><strong class="cl-home-ccard__title cl-clamp-2">{title}</strong><span class="cl-home-ccard__teacher">장현석 선생님</span></a>')
def news(items, go):
    return ''.join(f'<li class="cl-home-news__row"><a href="#" data-lab-go="{go}" class="cl-home-news__link">{t}</a><span class="cl-home-news__date cl-num">{d}</span></li>' for t, d in items)
home = f'''<div class="cl-home" data-home="" data-preset="dashboard" data-hide-std="0" data-academy-name="클라우드러닝">
<div class="cl-pub-wrap cl-home-slider cl-home-bento__slider" data-slider="" hidden=""></div>
<div class="cl-pub-wrap cl-home-bento">
<section class="cl-home-tile cl-home-tile--hero" aria-label="소개" data-sec="hero">
<div class="cl-home-hero__copy" data-hero-text=""><h1 class="cl-home-hero__title">클라우드러닝</h1><p class="cl-home-hero__sub">믿음으로 선택한 고객에게 신뢰로 보답해온 랩241</p>
<div class="cl-home-hero__actions"><a class="cl-btn cl-btn--primary cl-home-btn" href="#" data-lab-go="a-courses">전체강좌 보기</a></div>
<dl class="cl-home-stats" data-stats=""><div class="cl-home-stats__item"><dt>선생님</dt><dd class="cl-num">20</dd></div></dl></div>
<figure class="cl-home-hero__media" data-hero-media=""><span class="cl-ph" aria-hidden="true">학원 사진</span></figure></section>
<section class="cl-home-tile cl-home-tile--teachers" aria-labelledby="home-teachers" data-sec="teachers">
<div class="cl-home-tile__head"><h2 id="home-teachers" class="cl-home-tile__title">선생님 소개</h2>{more("a-teachers", "선생님 모두 보기")}</div>
<div class="cl-home-faces" data-teacher-faces="">{faces()}</div>
<ul class="cl-home-tile__rows" data-teachers=""><li><a class="cl-home-tile__row" href="#" data-lab-go="a-teacher-read"><strong>조하늘 선생님</strong><span>이서당</span></a></li><li><a class="cl-home-tile__row" href="#" data-lab-go="a-teacher-read-empty"><strong>박채원 선생님</strong><span>동영상녹화</span></a></li><li><a class="cl-home-tile__row" href="#" data-lab-go="a-teacher-read"><strong>최민재 선생님</strong><span>수학</span></a></li></ul></section>
<section class="cl-home-tile cl-home-tile--courses" aria-labelledby="home-featured" data-sec="featured">
<div class="cl-home-tile__head"><div><h2 id="home-featured" class="cl-home-tile__title">공개강좌</h2><p class="cl-home-tile__sub">클라우드러닝의 알찬 강좌를 미리 체험해보세요.</p></div>{more("a-courses", "전체강좌 보기")}</div>
<div class="cl-chips cl-home-chips" role="group" aria-label="과목" data-featured-subjects="">{chips}</div>
<div data-featured=""><div class="cl-home-ccards">{ccard("수학", "중학교1학년수학복습")}{ccard("수학", "공통수학")}{ccard("동영상녹화", "함수")}</div></div></section>
<section class="cl-home-tile cl-home-tile--banner" aria-label="배너" data-sec="banner" data-banner=""><a class="cl-home-banner" href="#"><span class="cl-ph" aria-hidden="true">배너</span></a></section>
<section class="cl-home-tile cl-home-tile--notices" aria-labelledby="home-notices" data-sec="notices">
<div class="cl-home-tile__head"><h2 id="home-notices" class="cl-home-tile__title">공지사항</h2>{more("a-board", "공지사항 더보기")}</div>
<ul class="cl-home-news__list" data-notices="">{news([("여름 방학 특강 안내", "2023.06.20"), ("2차학원보강입니다", "2023.02.07"), ("공지사항)학원 보강 안내", "2023.01.12")], "a-board-read")}</ul></section>
<section class="cl-home-tile cl-home-tile--boards" aria-labelledby="home-boards" data-sec="boards">
<div class="cl-home-tile__head"><h2 id="home-boards" class="cl-home-tile__title">자유게시판</h2>{more("a-board", "자유게시판 더보기")}</div>
<ul class="cl-home-news__list" data-boards="">{news([("화이팅", "2026.10.23"), ("수학 강의 많이 올려주세요", "2026.10.23"), ("student_test", "2026.10.21"), ("security_test", "2026.10.21")], "a-board-read")}</ul></section>
</div></div>'''
i = s.index('<main'); i = s.index('>', i) + 1; j = s.index('</main>')
s = s[:i] + '\n' + home + '\n' + s[j:]
open('a-main-dash.html', 'w').write(s)
print('ok')
