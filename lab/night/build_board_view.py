"""관리자 자유게시글 목록 — 행 메뉴 [보기] 창. board 에서 만든다. 기본 화면을 고치면 다시 실행.
테스트 사이트(관리자 → 자유게시글 목록 → 행 ⋯ → 보기)에서 본 구조 그대로, 연락처는 가짜 번호."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
src = open('board.html').read()
X = '<svg class="cl-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
body = ('<div class="cl-stack"><p class="cl-muted">관리자 (admin) · 2023.06.20 10:42</p><div class="cl-prose"><div class="toastui-editor-contents" style="overflow-wrap: break-word;">'
        '<p>2023년 여름 방학 특강을 오픈할 예정입니다.</p><p>특강에 관심이 있으신 분들은 학원으로 직접</p><p>문의주시기 바랍니다. </p><p><br></p><p>02-0000-0000</p></div></div></div>')
d = ('<div class="lab-scrim" style="position:absolute;inset:0;z-index:90;background:var(--cl-scrim, rgba(0,0,0,.4))" data-lab-go="board"></div>'
     '<dialog open class="cl-dialog cl-dialog--modal cl-dialog--lg" aria-labelledby="dlg-t" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);margin:0;z-index:100">'
     f'<div class="cl-dialog__head"><h2 class="cl-dialog__title" id="dlg-t">여름 방학 특강 안내</h2><button type="button" class="cl-icon-btn" aria-label="닫기" data-lab-go="board">{X}</button></div>'
     f'<div class="cl-dialog__body">{body}</div></dialog>')
s = src.replace('</body>', d + '\n</body>', 1)
s = re.sub(r'<title>[^<]*', '<title>자유게시글 보기 (창)', s, count=1)
open('board-view-dlg.html', 'w').write(s)
p = open('board.html').read()
p = re.sub(r'(<button type="button" role="menuitem" class="cl-menu__item")(?: data-lab-go="[^"]*")?(>(?:(?!</button>).)*?</svg>보기</button>)', r'\1 data-lab-go="board-view-dlg"\2', p, count=1, flags=re.S)
p = p.replace('<button type="button" class="cl-mb-title">여름 방학 특강 안내</button>', '<button type="button" class="cl-mb-title" data-lab-go="board-view-dlg">여름 방학 특강 안내</button>', 1)
open('board.html', 'w').write(p)
print('ok')
