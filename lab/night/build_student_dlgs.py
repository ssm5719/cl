"""학생 목록 행 메뉴의 창 3개(수강목록 · 가입 신청서 · 그룹) — students 에서 만든다. 기본 화면을 고치면 다시 실행.
테스트 사이트(관리자 → 학생 목록 → 행 ⋯)에서 본 구조 그대로, 이름 · 강좌는 실험실 가짜 값."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
src = open('students.html').read()
X = '<svg class="cl-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
def dlg(size, title, body):
    return ('<div class="lab-scrim" style="position:absolute;inset:0;z-index:90;background:var(--cl-scrim, rgba(0,0,0,.4))" data-lab-go="students"></div>'
            f'<dialog open class="cl-dialog cl-dialog--modal cl-dialog--{size}" aria-labelledby="dlg-t" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);margin:0;z-index:100">'
            f'<div class="cl-dialog__head"><h2 class="cl-dialog__title" id="dlg-t">{title}</h2><button type="button" class="cl-icon-btn" aria-label="닫기" data-lab-go="students">{X}</button></div>'
            f'<div class="cl-dialog__body">{body}</div></dialog>')
COURSES = dlg('lg', '김리원 · 수강목록',
    '<div class="cl-table-wrap"><table class="cl-table"><thead><tr><th scope="col">커리큘럼</th><th scope="col">강좌</th><th scope="col">강좌 코드</th></tr></thead><tbody>'
    + ''.join(f'<tr><td data-label="커리큘럼">{a}</td><td data-primary="">{b}</td><td class="cl-num cl-muted" data-label="강좌 코드">{c}</td></tr>' for a, b, c in
              [('수학1', '2027년 수능', 'cos0010186'), ('랩241', '공통수학', 'cos0010142'), ('랩241', '함수', 'cos0010117')])
    + '</tbody></table></div>')
JOIN = dlg('md', '김리원 · 가입 신청서',
    '<dl class="cl-mu-doc"><dt>희망 과목</dt><dd>수학</dd><dt>하고 싶은 말</dt><dd>학원 홈페이지에서 가입했습니다.\n주말반도 들을 수 있을까요?</dd></dl>')
G = [('테스트그룹', '6명 · 2024.06.17', 0), ('보충학습반', '13명 · 2024.04.24', 1), ('lab241', '13명 · 2023.12.08', 0), ('B반', '1명 · 2023.08.23', 0), ('A반', '4명 · 2023.08.23', 0)]
GROUP = dlg('lg', '김리원 (riwon1224) · 그룹',
    '<div class="cl-stack"><input type="search" class="cl-input" placeholder="그룹 이름 검색" aria-label="그룹 이름 검색"><div><ul class="cl-mu-groups">'
    + ''.join(f'<li><span class="cl-mu-groups__name"><strong>{n}</strong><span class="cl-muted cl-num">{m}</span></span>'
              + ('<span class="cl-badge cl-badge--success">참가 중</span><button type="button" class="cl-btn cl-btn--sm cl-btn--ghost">그룹에서 빼기</button>' if on
                 else '<button type="button" class="cl-btn cl-btn--sm cl-btn--tint">그룹에 넣기</button>') + '</li>' for n, m, on in G)
    + '</ul></div></div>')
def build(out, d, title):
    s = src.replace('</body>', d + '\n</body>', 1)
    s = re.sub(r'<title>[^<]*', '<title>' + title, s, count=1)
    open(out, 'w').write(s)
build('students-courses-dlg.html', COURSES, '학생 수강목록 (창)')
build('students-join-dlg.html', JOIN, '학생 가입 신청서 (창)')
build('students-group-dlg.html', GROUP, '학생 그룹 (창)')
# 학생 목록 — 김리원 행 메뉴에서 창으로
p = open('students.html').read()
m = re.search(r'aria-label="김리원 메뉴".*?</div>', p, flags=re.S)
seg = m.group(0)
for label, go in (('수강목록', 'students-courses-dlg'), ('가입 신청서', 'students-join-dlg'), ('그룹', 'students-group-dlg')):
    seg = re.sub(r'<button type="button" role="menuitem" class="cl-menu__item"( data-lab-go="[^"]*")?>(<svg(?:(?!</svg>).)*</svg>)' + label + '</button>',
                 r'<button type="button" role="menuitem" class="cl-menu__item" data-lab-go="' + go + r'">\2' + label + '</button>', seg, count=1, flags=re.S)
p = p[:m.start()] + seg + p[m.end():]
open('students.html', 'w').write(p)
print('ok')
