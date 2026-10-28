// 시험 출제 · 만든 시험지 목록: 다시 인쇄 · 이어서 고치기 · 복사해서 새로 만들기 · 삭제.
import { render, toast } from '../app.js';
import { SUBJECTS } from '../constants.js';
import { esc, badge, pageHead } from '../ui.js';

const ui = (state) => (state.ui.exams ||= { subject: '전체', q: '' });

export function view(state) {
  const v = ui(state);
  const all = state.store.listExams();
  const rows = all.filter((e) => (v.subject === '전체' || e.subject === v.subject) && (!v.q || e.title.includes(v.q)));
  const actions = '<a class="cl-btn cl-btn--primary" href="#/new">새 시험지 만들기</a>';
  if (!all.length) {
    return `<div class="cl-page pt-wide">${pageHead('나의 시험', '시험 출제', actions)}<div class="cl-empty"><p class="cl-empty__title">아직 만든 시험지가 없어요</p>
      <p class="cl-empty__desc">보관함의 기출 지문이나 붙여 넣은 지문으로 변형 문제지를 만들어 보세요.</p>
      <div class="pt-actions"><a class="cl-btn cl-btn--primary" href="#/new">새 시험지 만들기</a><a class="cl-btn cl-btn--ghost" href="#/upload">보관함에 시험지 올리기</a></div></div></div>`;
  }
  const toolbar = `<div class="cl-toolbar"><div class="cl-chips">${['전체', ...SUBJECTS].map((s) => `<button type="button" class="cl-chip" data-a="ex-subject" data-v="${s}" aria-pressed="${v.subject === s}">${s}</button>`).join('')}</div>
    <span class="cl-toolbar__spacer"></span><label class="cl-search"><input type="search" data-a="ex-q" value="${esc(v.q)}" placeholder="제목 검색" aria-label="제목 검색"></label></div>`;
  const table = `<div class="cl-table-wrap"><table class="cl-table"><thead><tr><th>제목</th><th>과목</th><th class="cl-table__num">문항</th><th>상태</th><th>만든 날</th><th>동작</th></tr></thead><tbody>
    ${rows.map((e) => `<tr><td><a class="cl-table__title" href="#/new/${e.id}" data-a="ex-edit" data-v="${e.id}">${esc(e.title)}</a><span class="cl-table__sub">${esc(e.sourceLabel || '')}</span></td>
      <td>${e.subject}</td><td class="cl-table__num">${e.count || 0}</td><td>${e.status === 'done' ? badge('완성', 'success') : badge('작성 중', 'warning')}</td><td class="cl-table__nowrap">${String(e.createdAt || '').slice(0, 10)}</td>
      <td class="cl-table__nowrap">${e.status === 'done' ? `<button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="ex-print" data-v="${e.id}">다시 인쇄</button> ` : ''}<button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="ex-edit" data-v="${e.id}">이어서 고치기</button>
        <button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="ex-copy" data-v="${e.id}">복사</button> <button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="ex-del" data-v="${e.id}">삭제</button></td></tr>`).join('') || '<tr><td colspan="6" class="pt-sub">조건에 맞는 시험지가 없어요</td></tr>'}
    </tbody></table></div>`;
  return `<div class="cl-page pt-wide">${pageHead('나의 시험', '시험 출제', actions)}${toolbar}${table}</div>`;
}

function openAt(state, id, step) {
  const exam = state.store.getExam(id);
  if (!exam) return;
  const wizStep = step || Math.min(exam.wiz?.reached || exam.step || 1, 3);
  state.store.saveExam({ ...exam, step: wizStep, wiz: { ...exam.wiz, step: wizStep } });
  state.ui.wiz = null;
  location.hash = `#/new/${id}`;
}

export function onAction(a, el, state) {
  const v = ui(state);
  const id = el.dataset.v;
  if (a === 'ex-subject') { v.subject = id; return render(); }
  if (a === 'ex-print') return openAt(state, id, 4);
  if (a === 'ex-edit') return openAt(state, id, null);
  if (a === 'ex-copy') { state.store.copyExam(id); toast('복사했어요'); return render(); }
  if (a === 'ex-del') {
    if (!confirm('이 시험지를 지울까요? 되돌릴 수 없어요.')) return undefined;
    state.store.deleteExam(id);
    toast('지웠어요');
    return render();
  }
  return undefined;
}

export function onInput(a, el, state) {
  if (a !== 'ex-q') return;
  ui(state).q = el.value.trim();
  const pos = el.selectionStart;
  render();
  const q = document.querySelector('[data-a="ex-q"]');
  q.focus();
  q.setSelectionRange(pos, pos);
}
