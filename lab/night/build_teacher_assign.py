"""선생님 과제 관리 — 과제가 있는 목록 · 채점 화면 · 통계 창 · 지금 마감 · 과제 수정 확인 창. t-assign 에서 만든다. 기본 화면을 고치면 다시 실행.
테스트 사이트(관리자 → 선생님 계정으로 들어가기 → 과제 관리)에서 본 구조 그대로, 학생 · 과제는 실험실 가짜 값."""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
src = open('t-assign.html').read()
I = lambda p, w=16: f'<svg class="cl-icon" width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{p}</svg>'
DOTS = '<circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle>'
X = '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
BACK = '<path d="m15 18-6-6 6-6"></path>'; NEXT = '<path d="m9 18 6-6-6-6"></path>'
CHART = '<path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>'
PEN = '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>'
INBOX = '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>'
FILE = '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path>'
def main_of(s): return s.index('<main id="cl-main"'), s.index('</main>')
def put_main(inner, title, extra=''):
    a, b = main_of(src)
    s = src[:a] + '<main id="cl-main" class="cl-ws-main" tabindex="-1">' + inner + '</main>' + src[b + 7:]
    s = re.sub(r'<title>[^<]*', '<title>' + title, s, count=1)
    if extra: s = s.replace('</body>', extra + '\n</body>', 1)
    return s
# ---------- 목록 (과제 3개)
ROWS = [('a1', '수열의 극한', '2027년 수능', '2026.10.27', 100, 'info', '진행중', 'neutral', '채점 전', '2026.11.30 10:22', 'D-32', '0 / 7'),
        ('a2', '이차방정식 근의 공식 연습', '공통수학', '2026.10.20', 50, 'info', '진행중', 'warning', '채점 중 3/5', '2026.11.03 23:59', 'D-5', '5 / 7'),
        ('a3', '함수의 그래프 그리기', '함수', '2026.10.06', 100, 'neutral', '마감', 'success', '채점 완료', '2026.10.20 23:59', '', '7 / 7')]
def row(r, link):
    k, t, c, d, pt, st, stl, gr, grl, due, dd, sub = r
    go = ' data-lab-go="t-assign-read"' if link else ''
    menu = ''.join(f'<button type="button" role="menuitem" class="cl-menu__item"{(" data-lab-go=%s" % chr(34) + g + chr(34)) if (link and g) else ""}>{n}</button>' for n, g in
                   (('과제 통계', 't-assign-stats-dlg'), ('과제 수정', 't-assign-edit-dlg'), ('지금 마감', 't-assign-close-dlg' if st == 'info' else '')))
    menu += '<button type="button" role="menuitem" class="cl-menu__item cl-menu__item--danger">과제 삭제</button>'
    return (f'<tr><td data-primary=""><a class="cl-table__title" href="#"{go}>{t}</a><span class="cl-table__sub">출제 {d} · {pt}점</span></td>'
            f'<td class="cl-ta-course" data-label="강좌">{c}</td><td data-label="상태"><span class="cl-badge cl-badge--{st}">{stl}</span></td>'
            f'<td data-label="채점"><span class="cl-badge cl-badge--{gr}">{grl}</span></td><td class="cl-num" data-label="마감">{due}' + (f'<span class="cl-table__sub">{dd}</span>' if dd else '') + '</td>'
            f'<td class="cl-table__num" data-label="제출">{sub}</td><td class="cl-tg-actions"><a class="cl-btn cl-btn--ghost cl-btn--sm" href="#"{go}>채점</a>'
            f'<div class="cl-row-menu"><button type="button" class="cl-icon-btn cl-row-menu__trigger" aria-label="{t} 메뉴" aria-haspopup="menu" aria-expanded="false">{I(DOTS,18)}</button>'
            f'<div class="cl-row-menu__panel cl-menu" role="menu" hidden="">{menu}</div></div></td></tr>')
TABLE = ('<div class="cl-table-wrap"><table class="cl-table cl-ta-table"><thead><tr><th scope="col">과제</th><th scope="col">강좌</th><th scope="col">상태</th><th scope="col">채점</th><th scope="col">마감</th><th scope="col" class="cl-table__num">제출</th><th scope="col"><span class="cl-sr-only">관리</span></th></tr></thead><tbody>'
         + ''.join(row(r, i == 0) for i, r in enumerate(ROWS)) + '</tbody></table></div>')
a, b = main_of(src); m = src[a:b]
m = re.sub(r'<div data-list="">.*</div> </div>$', '<div data-list="">' + TABLE + '</div> </div>', m.strip(), flags=re.S) if False else m
ml = re.sub(r'(<div data-list="">).*?(</div>\s*</div>\s*)$', lambda x: x.group(1) + TABLE + '</div> </div>', m, flags=re.S)
ml = ml.replace('<button type="button" class="cl-chip" aria-pressed="true">전체<span class="cl-chip__count cl-num">0</span>', '<button type="button" class="cl-chip" aria-pressed="true">전체<span class="cl-chip__count cl-num">3</span>')
ml = ml.replace('진행중<span class="cl-chip__count cl-num">0</span>', '진행중<span class="cl-chip__count cl-num">2</span>').replace('마감<span class="cl-chip__count cl-num">0</span>', '마감<span class="cl-chip__count cl-num">1</span>')
LIST = src[:a] + ml + src[b:]
LIST = re.sub(r'<title>[^<]*', '<title>과제 관리 · 과제 있음', LIST, count=1)
open('t-assign-list.html', 'w').write(LIST)
# ---------- 창 (목록 위)
def dlg(cls, title, body, back='t-assign-list', confirm=False):
    head = '' if confirm else f'<div class="cl-dialog__head"><h2 class="cl-dialog__title" id="dlg-t">{title}</h2><button type="button" class="cl-icon-btn" aria-label="닫기" data-lab-go="{back}">{I(X,18)}</button></div>'
    inner = (f'<h2 class="cl-dialog__title" id="dlg-t">{title}</h2>' + body) if confirm else f'<div class="cl-dialog__body">{body}</div>'
    return ('<div class="lab-scrim" style="position:absolute;inset:0;z-index:90;background:var(--cl-scrim, rgba(0,0,0,.4))" data-lab-go="' + back + '"></div>'
            f'<dialog open class="cl-dialog {cls}" aria-labelledby="dlg-t" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);margin:0;z-index:100">{head}{inner}</dialog>')
def bars(items):
    return '<ul class="cl-ta-bars">' + ''.join(f'<li><span>{n}</span><span class="cl-ta-meter"><span style="width:{p}%"></span></span><span class="cl-num">{c}명 ({p}%)</span></li>' for n, c, p in items) + '</ul>'
STU = [('고기영', 'student01'), ('김리원', 'riwon1224'), ('사혜인', 'sahyein1'), ('송희정', 'lampsong'), ('케비', 'kebi12345'), ('홍길동', 'student06'), ('이호준', 'student07')]
STATS = ('<div class="cl-ta-stats"><p class="cl-muted">2027년 수능 · 수열의 극한</p><dl class="cl-kpi">'
         + ''.join(f'<div class="cl-kpi__item"><dt>{k}</dt><dd class="cl-num">0</dd></div>' for k in ('총합', '평균', '최고점', '최저점')) + '</dl>'
         + '<section class="cl-ta-stats__section"><h3 class="cl-ta-stats__title">제출률</h3>' + bars([('제출', 0, 0), ('미제출', 7, 100)]) + '</section>'
         + '<section class="cl-ta-stats__section"><h3 class="cl-ta-stats__title">점수 분포</h3>' + bars([('81~100점', 0, 0), ('61~80점', 0, 0), ('41~60점', 0, 0), ('21~40점', 0, 0), ('미채점 · 0~20점', 7, 100)]) + '</section>'
         + '<section class="cl-ta-stats__section"><h3 class="cl-ta-stats__title">순위</h3><div class="cl-table-wrap cl-ta-ranks"><table class="cl-table"><thead><tr><th scope="col">순위</th><th scope="col">학생</th><th scope="col" class="cl-table__num">점수</th><th scope="col">채점일</th></tr></thead><tbody>'
         + ''.join(f'<tr><td class="cl-num" data-label="순위">1</td><td data-primary="">{n} ({i})</td><td class="cl-table__num" data-label="점수">미채점</td><td class="cl-num cl-muted" data-label="채점일"></td></tr>' for n, i in STU)
         + '</tbody></table></div></section></div>')
open('t-assign-stats-dlg.html', 'w').write(LIST.replace('<title>과제 관리 · 과제 있음', '<title>과제 통계 (창)').replace('</body>', dlg('cl-dialog--modal cl-dialog--lg', '과제 통계', STATS) + '\n</body>', 1))
CLOSE = '<p class="cl-dialog__desc">마감일이 지금으로 바뀌어 학생이 더 이상 제출할 수 없습니다.</p><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--text cl-btn--lg" data-lab-go="t-assign-list">취소</button><button type="button" class="cl-btn cl-btn--primary cl-btn--lg">마감</button></div>'
open('t-assign-close-dlg.html', 'w').write(LIST.replace('<title>과제 관리 · 과제 있음', '<title>지금 마감 (창)').replace('</body>', dlg('cl-dialog--confirm', '[수열의 극한] 과제를 지금 마감할까요?', CLOSE, confirm=True) + '\n</body>', 1))
EDIT = '<p class="cl-dialog__desc">수정하면 지금까지 입력한 점수가 모두 지워집니다. 그래도 수정할까요?</p><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--text cl-btn--lg" data-lab-go="t-assign-list">취소</button><button type="button" class="cl-btn cl-btn--primary cl-btn--lg">수정하기</button></div>'
open('t-assign-edit-dlg.html', 'w').write(LIST.replace('<title>과제 관리 · 과제 있음', '<title>과제 수정 확인 (창)').replace('</body>', dlg('cl-dialog--confirm', '과제를 수정하면 채점을 다시 해야 합니다.', EDIT, confirm=True) + '\n</body>', 1))
# ---------- 채점 화면 (제출 4 · 미제출 3, 둘째 학생 제출물을 보는 중)
SUB = [('김리원', 'riwon1224', '2026.10.28 21:14', ''), ('사혜인', 'sahyein1', '2026.10.29 08:02', '85'), ('송희정', 'lampsong', '2026.10.29 09:40', ''), ('케비', 'kebi12345', '2026.10.29 09:51', '')]
NOT = [('고기영', 'student01'), ('홍길동', 'student06'), ('이호준', 'student07')]
def stu(n, i, score, cur=False):
    sc = f'<span class="cl-ta-student__score cl-num is-graded">{score}</span>' if score else '<span class="cl-ta-student__score cl-num" aria-label="미채점">—</span>'
    return (f'<li><button type="button" class="cl-ta-student"{" aria-current=" + chr(34) + "true" + chr(34) if cur else ""}><span class="cl-avatar cl-avatar--tint" aria-hidden="true">{n[0]}</span>'
            f'<span class="cl-ta-student__name"><strong>{n}</strong><span class="cl-muted">{i}</span></span>{sc}</button></li>')
STUDENTS = ('<nav class="cl-card cl-ta-students" aria-label="학생 목록" data-students="">'
            f'<div class="cl-ta-group"><h2 class="cl-ta-group__title">제출<span class="cl-num cl-muted"> {len(SUB)}</span></h2><ul class="cl-ta-group__list">' + ''.join(stu(n, i, s, k == 0) for k, (n, i, w, s) in enumerate(SUB)) + '</ul></div>'
            f'<div class="cl-ta-group"><h2 class="cl-ta-group__title">미제출<span class="cl-num cl-muted"> {len(NOT)}</span></h2><ul class="cl-ta-group__list">' + ''.join(stu(n, i, '') for n, i in NOT) + '</ul></div></nav>')
WORK = ('<section class="cl-card cl-ta-work" aria-label="제출물" data-work=""><div class="cl-ta-work__head"><span class="cl-avatar" aria-hidden="true">김</span><div class="cl-ta-work__who"><strong>김리원</strong><span class="cl-muted">riwon1224</span></div>'
        f'<span class="cl-toolbar__spacer"></span><span class="cl-muted cl-num">1 / 7</span><button type="button" class="cl-icon-btn" aria-label="이전 학생" disabled="">{I(BACK)}</button><button type="button" class="cl-icon-btn" aria-label="다음 학생">{I(NEXT)}</button></div>'
        '<p class="cl-ta-work__when cl-muted">제출 2026.10.28 21:14</p><div class="cl-ta-work__body cl-prose"><p>1번: 분자 분모를 n² 으로 나누면 극한값은 3/2 입니다.</p><p>2번: 공비가 1/3 이므로 수렴하고, 합은 3/2 입니다.</p><p>3번은 풀이를 사진으로 첨부했습니다.</p></div>'
        f'<ul class="cl-files cl-ta-work__files"><li class="cl-file">{I(FILE)}<button type="button" class="cl-file__name">3번_풀이.jpg</button><span class="cl-file__size">1.2MB</span></li></ul></section>')
READ = ('<div class="cl-page cl-page--wide" data-assignment-sheet=""><div class="cl-page__head">'
        f'<a class="cl-back" href="#" data-lab-go="t-assign-list">{I(BACK)}과제 관리</a><div class="cl-page__head--row"><h1 class="cl-page__title" data-title="">수열의 극한</h1><span data-status=""><span class="cl-badge cl-badge--info">진행중</span></span>'
        f'<span class="cl-toolbar__spacer"></span><span class="cl-muted cl-num" data-progress="">채점 1 / 7</span><button type="button" class="cl-btn cl-btn--ghost" data-stats="" data-lab-go="t-assign-stats-dlg">{I(CHART)}통계</button>'
        f'<button type="button" class="cl-btn cl-btn--ghost" data-edit="" data-lab-go="t-assign-edit-dlg">{I(PEN)}과제 수정</button></div>'
        '<p class="cl-page__meta" data-meta="">2027년 수능 · 기간 2026.10.27 ~ 2026.11.30 10:22 (D-32) · 100점</p></div>'
        '<details class="cl-card cl-ta-brief" data-brief=""><summary>과제 설명 보기</summary><div class="cl-prose" data-brief-body=""><p>교재 3단원 연습문제 1~3번을 풀어 제출하세요. 풀이 과정이 보이게 써 주세요.</p></div></details>'
        f'<div class="cl-ta-sheet" data-sheet="">{STUDENTS}{WORK}</div>'
        '<div class="cl-savebar cl-ta-scorebar" data-scorebar=""><label class="cl-ta-scorebar__field" for="ta-score"><span>점수</span><input id="ta-score" class="cl-input cl-num" type="number" inputmode="numeric" min="0" max="100" step="1" data-score=""><span class="cl-muted cl-num" data-max="">/ 100</span></label>'
        '<div class="cl-ta-quick" role="group" aria-label="빠른 점수" data-quick="">' + ''.join(f'<button type="button" class="cl-btn cl-btn--ghost cl-btn--sm cl-num">{v}</button>' for v in (100, 90, 80, 0)) + '</div>'
        '<span class="cl-toolbar__spacer"></span><button type="button" class="cl-btn cl-btn--ghost cl-btn--lg" data-save="">채점</button><button type="button" class="cl-btn cl-btn--primary cl-btn--lg" data-save-next="">채점 후 다음<kbd class="cl-kbd">Enter</kbd></button></div></div>')
open('t-assign-read.html', 'w').write(put_main(READ, '수열의 극한 · 채점 | 클라우드러닝'))
# 기본 과제 관리(빈 화면) 에서 과제 있는 목록으로 가는 길은 실험실 화면 목록에서
print('ok')
