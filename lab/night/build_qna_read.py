"""학원 Q&A 상세(선생님 로그인) — a-qna 틀 + s-qna-read 본문, 답변 2개"""
import re, os
os.chdir(os.path.join(os.path.dirname(__file__), '..', 'screens'))
shell=open('a-qna.html').read(); src=open('s-qna-read.html').read()
main=src[src.index('<main'):src.index('</main>')+7]
main=main.replace('<a href="#">홈</a>','<a href="#" data-lab-go="a-main">홈</a>').replace('<a href="#">Q&amp;A</a>','<a href="#" data-lab-go="a-qna">Q&amp;A</a>')
main=main.replace('<a class="cl-btn cl-btn--ghost" href="#">목록으로</a>','<a class="cl-btn cl-btn--ghost" href="#" data-lab-go="a-qna">목록으로</a>')
# 답변 2개
m1=re.search(r'<li class="cl-thread__answer is-teacher">.*?</li>',main,re.S).group(0)
second=re.sub(r'(<a class="cl-post-writer is-teacher" href="#">.*?)임소연 선생님',r'\g<1>장현석 선생님',m1,flags=re.S)
second=second.replace('2024.06.17 15:17','2024.06.18 09:02').replace('data-nodeid="2"','data-nodeid="3"')
second=re.sub(r'<div data-nodeid="3">.*?</div>','<div data-nodeid="3"><p>수강 기간이 끝난 뒤에도 다시 보고 싶으면 학원으로 연락 주세요. 기간을 한 번 연장해 드립니다.</p></div>',second,flags=re.S)
main=main.replace('</li></ol>','</li>'+second+'</ol>',1)
main=main.replace('<span class="cl-badge cl-badge--success">답변 1</span>','<span class="cl-badge cl-badge--success">답변 2</span>')
main=re.sub(r'(data-answer-count="">)\d+',r'\g<1>2',main)
i=shell.index('<main'); j=shell.index('</main>')+7
out=shell[:i]+main+shell[j:]
out=out.replace('<title>Q&amp;A','<title>Q&amp;A 질문',1)
open('a-qna-read.html','w').write(out)
# 목록 → 상세
q=open('a-qna.html').read().replace('data-lab-go="s-qna-read"','data-lab-go="a-qna-read"'); open('a-qna.html','w').write(q)
print('ok')
