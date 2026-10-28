"""학원 공개 화면 빈 상태 변형 만들기 — screens/<id>-empty.html

기본 화면(screens/<id>.html)에서 목록 부분만 빈 상태로 바꿔 다시 만든다.
기본 화면을 고쳤으면 이 파일을 다시 실행: python3 lab/night/build_empty.py
규칙 · 문장: design/components/Empty/README.md "학원 공개 화면" (실험실 fix NE1)
"""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
SVG='<svg class="cl-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">{}</svg>'
IC={
 'book':'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
 'user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
 'qna':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path>',
 'file':'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>',
 'msg':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>',
}
def empty(icon,title,desc=None,extra=''):
    d=f'<p class="cl-empty__desc">{desc}</p>' if desc else ''
    return f'<div class="cl-empty cl-empty--line{extra}">{SVG.format(IC[icon])}<p class="cl-empty__title">{title}</p>{d}</div>'
def cut(s,start_pat,tag):
    i=s.index(start_pat); depth=0; k=i
    for m in re.finditer(rf'<(/?){tag}\b[^>]*>',s[i:]):
        depth+= -1 if m.group(1) else 1
        if depth==0: return s[:i], s[i+m.end():]
    raise Exception(start_pat)
def nopag(s):
    return re.sub(r'<nav class="cl-pagination".*?</nav>','',s,flags=re.S)
# 전체강좌
s=open('a-courses.html').read(); a,b=cut(s,'<ul class="cl-cs-cards"','ul')
s=a+empty('book','조건에 맞는 강좌가 없습니다','검색어나 분류를 바꿔 보세요')+b
s=re.sub(r'(class="cl-cs-count" data-count="">총 <strong class="cl-num">)\d+',r'\g<1>0',s)
open('a-courses-empty.html','w').write(nopag(s))
# 선생님 목록
s=open('a-teachers.html').read(); a,b=cut(s,'<ul class="cl-teacher-grid"','ul')
s=a+empty('user','등록된 선생님이 없습니다')+b
s=re.sub(r'(선생님 전체<span class="cl-chip__count cl-num">)\d+',r'\g<1>0',s)
open('a-teachers-empty.html','w').write(nopag(s))
# Q&A
s=open('a-qna.html').read(); a,b=cut(s,'<ul class="cl-qna-list"','ul')
s=a+empty('qna','아직 질문이 없습니다','강의를 듣다 궁금한 점이 생기면 질문해 주세요')+b
s=s.replace('질문 16개','질문 0개')
open('a-qna-empty.html','w').write(nopag(s))
# 자유게시판
s=open('a-board.html').read(); a,b=cut(s,'<ol class="cl-post-list"','ol')
s=a+empty('file','아직 게시글이 없습니다')+b
s=re.sub(r'게시글 \d+개','게시글 0개',s)
open('a-board-empty.html','w').write(nopag(s))
# 게시글 읽기 — 댓글 없음
s=open('a-board-read.html').read(); a,b=cut(s,'<ul class="cl-comments__list"','ul')
s=a+empty('msg','아직 댓글이 없습니다',extra=' cl-empty--sm')+b
s=re.sub(r'(cl-comments__title">댓글 <span class="cl-num">)\d+',r'\g<1>0',s)
open('a-board-read-empty.html','w').write(s)
# 선생님 상세 — 담당 강좌 없음: 박채원 선생님(목록에서 박채원 카드가 여기로 옴)
s=open('a-teacher-read.html').read(); a,c=cut(s,'<ul class="cl-teacher__course-list"','ul')
s=a+empty('book','담당 강좌가 없습니다',extra=' cl-teacher__course-empty')+c
s=re.sub(r'(cl-teacher__courses-title">담당 강좌 <span class="cl-num">)\d+',r'\g<1>0',s)
s=re.sub(r'<div class="cl-teacher__more">.*?</div>','<div class="cl-teacher__more"></div>',s,flags=re.S)
s=s.replace('<title>장현석 선생님','<title>박채원 선생님',1)
s=s.replace('<span data-band-crumb-last="">장현석</span>','<span data-band-crumb-last="">박채원</span>')
s=s.replace('<span class="cl-teacher__avatar"><span class="cl-teacher__avatar-initial" aria-hidden="true">장</span></span><h2 class="cl-teacher__name">장현석 선생님</h2>',
            '<span class="cl-teacher__avatar"><img src="../img/teacher-f.jpg" alt=""></span><h2 class="cl-teacher__name">박채원 선생님</h2>')
s=re.sub(r'<dl class="cl-teacher__info">.*?</dl>','<dl class="cl-teacher__info"><div><dt>담당과목</dt><dd>동영상녹화</dd></div></dl>',s,flags=re.S)
assert '박채원 선생님</h2>' in s
open('a-teacher-read-empty.html','w').write(s)
print('ok')
