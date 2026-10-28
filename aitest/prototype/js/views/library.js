// 시험 보관함: 목록(시험지별 · 지문별) · 시험지 상세 · 시험지 올리기(데모) · 지문 추가.
import { render, toast } from '../app.js';
import { SUBJECTS, KINDS, GRADES } from '../constants.js';
import { ME, esc, badge, firstLine, pageHead, allPapers, paperMeta } from '../ui.js';

const ui = (state) => (state.ui.library ||= { view: 'paper', subject: '전체', grade: '전체', kind: '전체', q: '', adding: false });

export function view(state, r) {
  if (r.name === 'paper') return detail(state, r.params.paperId);
  if (r.name === 'upload') return upload(state);
  return list(state);
}

// ---------------------------------------------------------------- 목록

function filtered(state) {
  const v = ui(state);
  return allPapers(state).filter((p) =>
    (v.subject === '전체' || p.subject === v.subject) &&
    (v.grade === '전체' || p.grade === v.grade) &&
    (v.kind === '전체' || p.kind === v.kind) &&
    (!v.q || p.title.includes(v.q)));
}

const select = (a, value, options, label) =>
  `<select class="cl-select" data-a="${a}" aria-label="${label}">${['전체', ...options].map((o) => `<option value="${o}" ${o === value ? 'selected' : ''}>${o === '전체' ? `${label} 전체` : o}</option>`).join('')}</select>`;

function list(state) {
  const v = ui(state);
  const papers = filtered(state);
  const actions = `<button type="button" class="cl-btn cl-btn--ghost" data-a="add-passage">지문 추가</button><button type="button" class="cl-btn cl-btn--primary" data-a="go-upload">시험지 올리기</button>`;
  const tabs = `<div class="cl-tabs" role="tablist">${[['paper', '시험지별'], ['unit', '지문별']].map(([k, l]) => `<button type="button" class="cl-tab" role="tab" data-a="lib-view" data-v="${k}" aria-selected="${v.view === k}">${l}</button>`).join('')}</div>`;
  const toolbar = `<div class="cl-toolbar"><div class="cl-chips">${['전체', ...SUBJECTS].map((s) => `<button type="button" class="cl-chip" data-a="lib-subject" data-v="${s}" aria-pressed="${v.subject === s}">${s === '전체' ? '내 담당 과목 전체' : s}</button>`).join('')}</div>
    ${select('lib-grade', v.grade, GRADES, '학년')}${select('lib-kind', v.kind, KINDS, '종류')}
    <span class="cl-toolbar__spacer"></span><label class="cl-search"><input type="search" placeholder="시험지 이름 검색" value="${esc(v.q)}" data-a="lib-q" aria-label="시험지 이름 검색"></label></div>`;
  const body = !papers.length
    ? `<div class="cl-empty"><p class="cl-empty__title">조건에 맞는 시험지가 없어요</p><p class="cl-empty__desc">기출 PDF를 올리면 AI가 지문별로 나눠 보관해요.</p><button type="button" class="cl-btn cl-btn--primary" data-a="go-upload">시험지 올리기</button></div>`
    : v.view === 'paper' ? paperTable(papers) : unitTable(papers);
  return `<div class="cl-page pt-wide">${pageHead('나의 시험', '시험 보관함', actions)}
    <p class="pt-lead">같은 학원 · 같은 과목 선생님끼리 함께 봐요. 내가 올린 시험지만 고치거나 지울 수 있어요.</p>
    ${v.adding ? addForm() : ''}${tabs}${toolbar}${body}</div>`;
}

function paperTable(papers) {
  return `<div class="cl-table-wrap"><table class="cl-table"><thead><tr><th>시험지</th><th>과목</th><th>학년</th><th class="cl-table__num">지문</th><th class="cl-table__num">그림 지문</th><th>올린 사람 · 날짜</th><th>동작</th></tr></thead><tbody>
    ${papers.map((p) => `<tr><td><a class="cl-table__title" href="#/library/${p.id}">${esc(p.title)}</a><span class="cl-table__sub">${esc(paperMeta(p))}</span></td>
      <td>${p.subject}</td><td>${p.grade}</td><td class="cl-table__num">${p.units.length}</td><td class="cl-table__num">${p.units.filter((u) => u.has_figure).length}</td>
      <td>${p.by === ME ? '나' : esc(p.by)}<span class="cl-table__sub">${p.date}</span></td>
      <td class="cl-table__nowrap">${p.kind === '직접 추가' ? '<span class="pt-kind">직접 추가</span> ' : ''}${p.by === ME ? `<button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="demo-only">수정</button> <button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="demo-only">삭제</button>` : '<span class="pt-sub">함께 보기</span>'}</td></tr>`).join('')}
  </tbody></table></div>`;
}

function unitTable(papers) {
  const rows = papers.flatMap((p) => p.units.map((u) => ({ p, u })));
  return `<div class="cl-table-wrap"><table class="cl-table"><thead><tr><th>번호 · 유형</th><th>첫 줄</th><th>원래 시험지</th><th></th></tr></thead><tbody>
    ${rows.map(({ p, u }) => `<tr><td class="cl-table__nowrap">${esc(u.numbers)}번<span class="cl-table__sub">${esc(u.type_label)}</span></td>
      <td>${esc(firstLine(u.passage || u.questions[0]?.stem))}</td><td>${esc(p.title)}</td>
      <td class="cl-table__nowrap">${u.has_figure ? badge('그림 필요', 'warning') : `<button type="button" class="cl-btn cl-btn--tint cl-btn--sm" data-a="make-unit" data-v="${p.id}/${u.id}">이 지문으로 만들기</button>`}</td></tr>`).join('')}
  </tbody></table></div>`;
}

function addForm() {
  return `<section class="cl-card pt-panel" aria-label="지문 추가"><h2 class="cl-section-title">지문 추가</h2>
    <div class="pt-form-row"><label class="pt-field">과목 <select class="cl-select" data-a="ap-subject">${SUBJECTS.map((s) => `<option>${s}</option>`).join('')}</select></label>
    <label class="pt-field pt-grow">지문 제목 <input class="cl-input" data-a="ap-title" placeholder="예: 교과서 3과 본문"></label></div>
    <label class="pt-field">지문 <textarea class="cl-textarea" data-a="ap-text" rows="6" placeholder="지문을 붙여 넣으세요"></textarea></label>
    <div class="pt-actions"><button type="button" class="cl-btn cl-btn--ghost" data-a="ap-cancel">취소</button><button type="button" class="cl-btn cl-btn--primary" data-a="ap-save">보관함에 저장</button></div></section>`;
}

// ---------------------------------------------------------------- 상세

function findPaper(state, id) { return allPapers(state).find((p) => p.id === id); }

function unitBadges(u) {
  return [u.has_figure ? badge('그림 필요', 'warning') : '', u.confidence === 'low' ? badge('AI가 확실하지 않음', 'danger') : ''].join(' ');
}

function detail(state, id) {
  const p = findPaper(state, id);
  if (!p) return `<div class="cl-page">${pageHead('시험 보관함', '시험지를 찾을 수 없어요')}<a class="cl-text-btn" href="#/library">← 보관함으로</a></div>`;
  const actions = `<a class="cl-btn cl-btn--primary" href="#/new?paper=${p.id}">이 시험지로 만들기</a>`;
  return `<div class="cl-page pt-wide"><a class="cl-text-btn pt-back" href="#/library">← 시험 보관함</a>${pageHead(`${p.subject} · ${paperMeta(p)}`, p.title, actions)}
    <p class="pt-lead">올린 사람 ${p.by === ME ? '나' : esc(p.by)} · ${p.date} · 지문 ${p.units.length}개 (그림 지문 ${p.units.filter((u) => u.has_figure).length}개)</p>
    <div class="cl-table-wrap"><table class="cl-table"><thead><tr><th>번호</th><th>유형</th><th>첫 줄</th><th>표시</th><th></th></tr></thead><tbody>
    ${p.units.map((u) => `<tr><td class="cl-table__nowrap">${esc(u.numbers)}번</td><td class="cl-table__nowrap">${esc(u.type_label)}</td><td>${esc(firstLine(u.passage || u.questions[0]?.stem))}</td><td class="cl-table__nowrap">${unitBadges(u)}</td>
      <td class="cl-table__nowrap">${u.has_figure ? '<span class="pt-sub">자동 출제 제외</span>' : `<button type="button" class="cl-btn cl-btn--tint cl-btn--sm" data-a="make-unit" data-v="${p.id}/${u.id}">이 지문으로 만들기</button>`}</td></tr>`).join('')}
    </tbody></table></div></div>`;
}

// ---------------------------------------------------------------- 올리기(데모)

const up = (state) => (state.ui.upload ||= { stage: 'pick', paperId: null });

function upload(state) {
  const u = up(state);
  const head = `<a class="cl-text-btn pt-back" href="#/library">← 시험 보관함</a>${pageHead('시험 보관함', '시험지 올리기')}`;
  if (u.stage === 'splitting') {
    return `<div class="cl-page pt-wide">${head}<div class="cl-card pt-panel pt-center"><div class="cl-loading"><span class="cl-loading__spinner" aria-hidden="true"></span></div>
      <p><strong>지문을 나누고 있어요 (약 2분)</strong></p><p class="pt-sub">다른 화면으로 나가도 계속 나누고, 끝나면 알려 드려요.</p></div></div>`;
  }
  if (u.stage === 'review') {
    const p = findPaper(state, u.paperId);
    const fig = p.units.filter((x) => x.has_figure).length;
    const low = p.units.filter((x) => x.confidence === 'low').length;
    return `<div class="cl-page pt-wide">${head}<h2 class="cl-section-title">나누기 결과 확인</h2>
      <p class="pt-lead">${esc(p.title)} · 지문 ${p.units.length}개로 나눴어요. ${fig || low ? `표시된 ${fig + low}곳만 확인해 주세요.` : '확인할 곳이 없어요.'}</p>
      <div class="cl-table-wrap"><table class="cl-table"><thead><tr><th>번호</th><th>유형</th><th>첫 줄</th><th>표시</th><th></th></tr></thead><tbody>
      ${p.units.map((x) => `<tr><td class="cl-table__nowrap">${esc(x.numbers)}번</td><td class="cl-table__nowrap">${esc(x.type_label)}</td><td>${esc(firstLine(x.passage || x.questions[0]?.stem))}</td><td class="cl-table__nowrap">${unitBadges(x)}</td>
        <td class="cl-table__nowrap"><button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="up-edit">고치기</button> <button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="up-edit">합치기</button> <button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="up-edit">나누기</button></td></tr>`).join('')}
      </tbody></table></div>
      <div class="pt-actions"><button type="button" class="cl-btn cl-btn--ghost" data-a="up-reset">다시 올리기</button><button type="button" class="cl-btn cl-btn--primary" data-a="up-save">보관함에 저장</button></div></div>`;
  }
  const files = state.data.papers.map((p) => `<button type="button" class="pt-file" data-a="up-file" data-v="${p.id}" aria-pressed="${u.paperId === p.id}"><strong>${esc(p.title)}.pdf</strong><span class="pt-sub">${p.subject} · ${p.units.length}개 지문</span></button>`).join('');
  const picked = u.paperId && findPaper(state, u.paperId);
  return `<div class="cl-page pt-wide">${head}<div class="cl-card pt-panel">
    <h2 class="cl-section-title">시험지 PDF</h2><p class="pt-sub">데모에서는 아래 파일 중 하나를 고르면 올린 것으로 봐요. 정답 · 해설 PDF는 있으면 함께 올려요(선택).</p>
    <div class="pt-files">${files}</div>
    ${picked ? `<div class="pt-form-row"><label class="pt-field">종류 <select class="cl-select">${KINDS.map((k) => `<option ${k === picked.kind ? 'selected' : ''}>${k}</option>`).join('')}</select></label>
      <label class="pt-field">학년 <select class="cl-select">${GRADES.map((g) => `<option ${g === picked.grade ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
      <label class="pt-field">시행 연월 <input class="cl-input" value="${picked.ym}"></label></div><p class="pt-sub">파일 이름을 보고 미리 채웠어요.</p>` : ''}
    <div class="pt-actions"><button type="button" class="cl-btn cl-btn--primary" data-a="up-start" ${picked ? '' : 'disabled'}>나누기 시작</button></div></div></div>`;
}

// ---------------------------------------------------------------- 동작

export function onAction(a, el, state) {
  const v = ui(state);
  if (a === 'lib-view') { v.view = el.dataset.v; return render(); }
  if (a === 'lib-subject') { v.subject = el.dataset.v; return render(); }
  if (a === 'make-unit') { location.hash = `#/new?units=${el.dataset.v}`; return; }
  if (a === 'go-upload') { state.ui.upload = { stage: 'pick', paperId: null }; location.hash = '#/upload'; return; }
  if (a === 'demo-only' || a === 'up-edit') return toast('데모에서는 보기만 돼요');
  if (a === 'add-passage') { v.adding = true; return render(); }
  if (a === 'ap-cancel') { v.adding = false; return render(); }
  if (a === 'ap-save') return savePassage(state);
  const u = up(state);
  if (a === 'up-file') { u.paperId = el.dataset.v; return render(); }
  if (a === 'up-start') {
    u.stage = 'splitting';
    render();
    setTimeout(() => { if (u.stage === 'splitting') { u.stage = 'review'; render(); } }, 1200);
    return;
  }
  if (a === 'up-reset') { state.ui.upload = { stage: 'pick', paperId: null }; return render(); }
  if (a === 'up-save') {
    const id = u.paperId;
    state.ui.upload = { stage: 'pick', paperId: null };
    toast('보관함에 저장했어요 (데모: 이미 있는 시험지를 보여 줘요)');
    location.hash = `#/library/${id}`;
  }
}

export function onInput(a, el, state) {
  const v = ui(state);
  if (a === 'lib-grade') { v.grade = el.value; render(); }
  if (a === 'lib-kind') { v.kind = el.value; render(); }
  if (a === 'lib-q') { v.q = el.value.trim(); const pos = el.selectionStart; render(); const q = document.querySelector('[data-a="lib-q"]'); q.focus(); q.setSelectionRange(pos, pos); }
}

function savePassage(state) {
  const title = document.querySelector('[data-a="ap-title"]').value.trim();
  const text = document.querySelector('[data-a="ap-text"]').value.trim();
  const subject = document.querySelector('[data-a="ap-subject"]').value;
  if (!title || !text) return toast('지문 제목과 지문을 넣어 주세요');
  const today = new Date().toISOString().slice(0, 10);
  state.store.savePasted({
    id: `x${Date.now().toString(36)}`, subject, title, kind: '직접 추가', grade: '고2', ym: today.slice(0, 7), by: ME, date: today,
    units: [{ id: 'u01', numbers: '1', type_label: '직접 추가 지문', genre: '기타', passage: text, questions: [], has_figure: false, figure_desc: '', confidence: 'high', note: '' }],
  });
  ui(state).adding = false;
  render();
  toast('보관함에 저장했어요');
}
