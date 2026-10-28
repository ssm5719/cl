"""관리자 CMS 콘텐츠 관리 — 행 메뉴 창 3개(소유자 변경 · 공개설정 · 강좌 · 강의 조회). cms 에서 만든다. 기본 화면을 고치면 다시 실행.
테스트 사이트(관리자 → CMS 콘텐츠 관리 → 행 ⋯)에서 본 구조 그대로, 이름은 실험실 가짜 값."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
src = open('cms.html').read()
X = '<svg class="cl-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
TITLE = '수학수능기출26 해설 영상'
def dlg(size, title, body):
    return ('<div class="lab-scrim" style="position:absolute;inset:0;z-index:90;background:var(--cl-scrim, rgba(0,0,0,.4))" data-lab-go="cms"></div>'
            f'<dialog open class="cl-dialog cl-dialog--modal cl-dialog--{size}" aria-labelledby="dlg-t" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);margin:0;z-index:100">'
            f'<div class="cl-dialog__head"><h2 class="cl-dialog__title" id="dlg-t">{title}</h2><button type="button" class="cl-icon-btn" aria-label="닫기" data-lab-go="cms">{X}</button></div>'
            f'<div class="cl-dialog__body">{body}</div></dialog>')
T = ['장현석 (teacher01)', '조하늘 (teacher02)', '박채원 (teacher03)', '윤서진 (teacher04)', '이준서 (teacher05)', '서지우 (teacher06)', '최민재 (teacher07)', '정다은 (teacher08)', '강예린 (teacher09)', '오태윤 (teacher10)', '문성호 (teacher11)', '이수아 (teacher12)', '고은비 (teacher13)', '신지호 (teacher14)', '정민규 (teacher15)', '김도윤 (teacher16)', '김서윤 (teacher17)', '심재원 (teacher18)', '유하린 (teacher19)', '김나연 (teacher20)', '고건우 (teacher21)', '임소연 (teacher22)', '탁지환 (teacher23)', '고태민 (teacher24)']
OWNER = dlg('md', '소유자 변경',
    f'<form class="cl-form"><p class="cl-muted">{TITLE} · 지금 소유자: 탁유원 (ywtag001)</p>'
    '<div class="cl-field"><label class="cl-field__label" for="cms-owner">새 소유자</label><select class="cl-select" style="width:100%;max-width:none" id="cms-owner" required="">'
    '<option value="">선생님을 고르세요</option>' + ''.join(f'<option>{t}</option>' for t in T) + '</select></div>'
    '<p class="cl-field__help">새 소유자의 나의 자료실 미분류로 옮겨집니다. 이미 강의로 올린 콘텐츠는 그대로 재생됩니다.</p>'
    '<div class="cl-dialog__actions"><button type="submit" class="cl-btn cl-btn--primary">바꾸기</button></div></form>')
VIS = dlg('md', '공개설정',
    '<form class="cl-form"><p class="cl-muted">콘텐츠 1개의 공개설정을 바꿉니다. 회원공개는 학원에 로그인한 사람만 볼 수 있습니다.</p>'
    '<div class="cl-radio-group" role="radiogroup" aria-label="공개설정">'
    + ''.join(f'<label class="cl-radio"><input type="radio" name="vis"{" checked" if i == 1 else ""}><span>{n}</span></label>' for i, n in enumerate(['전체공개', '회원공개', '비공개']))
    + '</div><div class="cl-dialog__actions"><button type="submit" class="cl-btn cl-btn--primary">바꾸기</button></div></form>')
USE = dlg('lg', '강좌 · 강의 조회',
    f'<p class="cl-muted" style="margin:0 0 12px">{TITLE}</p><div class="cl-empty"><p class="cl-empty__title">이 콘텐츠를 쓰는 강의가 없습니다</p></div>')
def build(out, d, title):
    s = src.replace('</body>', d + '\n</body>', 1)
    s = re.sub(r'<title>[^<]*', '<title>' + title, s, count=1)
    open(out, 'w').write(s)
build('cms-owner-dlg.html', OWNER, 'CMS 소유자 변경 (창)')
build('cms-visibility-dlg.html', VIS, 'CMS 공개설정 (창)')
build('cms-usage-dlg.html', USE, 'CMS 강좌 · 강의 조회 (창)')
# 첫 행 메뉴에서 창으로
p = open('cms.html').read()
for label, go in (('소유자 변경', 'cms-owner-dlg'), ('공개설정', 'cms-visibility-dlg'), ('강좌 · 강의 조회', 'cms-usage-dlg')):
    p = re.sub(r'(<button type="button" role="menuitem" class="cl-menu__item")(?: data-lab-go="[^"]*")?(>(?:(?!</button>).)*?</svg>' + re.escape(label) + '</button>)',
               r'\1 data-lab-go="' + go + r'"\2', p, count=1, flags=re.S)
open('cms.html', 'w').write(p)
print('ok', [l for l in ('cms-owner-dlg', 'cms-visibility-dlg', 'cms-usage-dlg') if l in p])
