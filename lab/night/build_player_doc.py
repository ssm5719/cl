"""학원 강의 보기 · 문서 강의 — a-player 에서 만든다. 기본 화면을 고치면 다시 실행."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
src = open('a-player.html').read()
I = lambda p, w=16: f'<svg class="cl-icon" width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{p}</svg>'
FILE = '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>'
DL = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><path d="m7 10 5 5 5-5"></path><path d="M12 15V3"></path>'
EXT = '<path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>'
MINUS = '<path d="M5 12h14"></path>'; PLUS = '<path d="M5 12h14"></path><path d="M12 5v14"></path>'
def page(n):
    lines = ''.join(f'<span class="lab-line" style="width:{w}%"></span>' for w in ([42, 0, 88, 76, 92, 64, 0, 84, 90, 58, 0, 72, 86, 80] if n == 1 else [88, 70, 92, 0, 80, 86, 62, 0, 90, 74, 84, 0, 66, 88]))
    return f'<div class="cl-docview__page" aria-hidden="true">{lines}</div>'
def doc(kind, name, ext, meta):
    view = ''
    if kind == 'pdf':
        view = ('<div class="cl-docview">'
                '<div class="cl-docview__bar"><span class="cl-docview__name">' + name + '</span>'
                '<span class="cl-docview__tools"><span class="cl-num">1 / 40</span><span class="cl-docview__sep"></span>' + I(MINUS, 14) + '<span class="cl-num">100%</span>' + I(PLUS, 14) + '</span></div>'
                '<div class="cl-docview__pages">' + page(1) + page(2) + '</div>'
                '<!-- 실험실: 실제는 이 칸에 브라우저 PDF 보기(iframe, 영상과 같은 자리 · 같은 서버) --></div>')
    card = ('<div class="cl-docfile">'
            '<span class="cl-docfile__icon">' + I(FILE, 28) + '<em>' + ext + '</em></span>'
            '<p class="cl-docfile__name">' + name + '</p><p class="cl-docfile__meta">' + meta + '</p>'
            '<div class="cl-docfile__actions"><a class="cl-btn cl-btn--primary" href="#" download>' + I(DL) + '내려받기</a>'
            '<a class="cl-btn cl-btn--ghost" href="#" target="_blank">' + I(EXT) + '새 창으로 열기</a></div></div>')
    return f'<div class="cl-player" data-player=""><div class="cl-player__doc" data-doc-kind="{kind}">{view}{card}</div></div>'
def build(out, kind, name, ext, meta):
    s = src
    s = re.sub(r'<div class="cl-player" data-player="">.*?</div></div>', doc(kind, name, ext, meta), s, count=1, flags=re.S)
    s = re.sub(r'(<h1 class="cl-player-info__title" data-title="">).*?(</h1>)', r'\g<1>수학수능기출26\2', s, flags=re.S)
    s = re.sub(r'(<p class="cl-player-info__meta" data-meta="">).*?(</p>)', r'\g<1>2026.10.27 · 조회 0 · 공통수학 · 강의 2개\2', s, flags=re.S)
    s = s.replace('<title>[Playlist]', '<title>수학수능기출26 ·', 1)
    # 목록: 01 은 영상 강의로, 02 가 지금 강의
    s = re.sub(r'<a class="cl-playlist__item is-current" href="#" aria-current="page"><span class="cl-playlist__num cl-num">.*?</span>', '<a class="cl-playlist__item" href="#" data-lab-go="a-player"><span class="cl-playlist__num cl-num">01</span>', s, count=1, flags=re.S)
    s = re.sub(r'<a class="cl-playlist__item" href="#"( data-lab-go="a-player-doc")?><span class="cl-playlist__num cl-num">02</span>',
               '<a class="cl-playlist__item is-current" href="#" aria-current="page"><span class="cl-playlist__num cl-num">02</span>', s, count=1)
    open(out, 'w').write(s)
build('a-player-doc.html', 'pdf', '수학수능기출26.pdf', 'PDF', 'PDF · 40쪽 · 3.1MB')
build('a-player-doc-hwp.html', 'file', '수학수능기출26_해설.hwp', 'HWP', '한글 문서 · 2.4MB')
# 영상 강의 화면 · 강좌 상세에서 문서 강의로
p = open('a-player.html').read()
p = re.sub(r'<a class="cl-playlist__item" href="#"><span class="cl-playlist__num cl-num">02</span>', '<a class="cl-playlist__item" href="#" data-lab-go="a-player-doc"><span class="cl-playlist__num cl-num">02</span>', p, count=1)
open('a-player.html', 'w').write(p)
c = open('a-course-read.html').read()
c = re.sub(r'data-lab-go="a-player">수학수능기출26', 'data-lab-go="a-player-doc">수학수능기출26', c)
c = c.replace('data-lab-go="a-player" aria-label="수학수능기출26 보기"', 'data-lab-go="a-player-doc" aria-label="수학수능기출26 보기"')
open('a-course-read.html', 'w').write(c)
print('ok')
