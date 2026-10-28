// ① 자료 고르기: [보관함에서] 시험지 → 지문 고르기 / [지문 붙여넣기].
import { render } from '../app.js';
import { SUBJECTS, TEXT } from '../constants.js';
import { esc, firstLine, allPapers, paperMeta } from '../ui.js';
import { goStep, rerenderKeepFocus } from './wizard.js';

const pasteValid = (wiz) => wiz.paste.filter((p) => p.title.trim() && p.text.trim());

export function summary(wiz) {
  const n = wiz.tab === 'paste' ? pasteValid(wiz).length : wiz.selected.length;
  return `<strong>고른 지문 ${n}개</strong>`;
}

export function canNext(wiz, state) {
  if (wiz.tab === 'paste') {
    if (!pasteValid(wiz).length) return '지문 제목과 본문을 넣어 주세요';
    if (!state.store.rightsAgreed() && !wiz.rights) return '자료 사용 권리를 확인해 주세요';
    return true;
  }
  return wiz.selected.length ? true : '지문을 하나 이상 골라 주세요';
}

export function next(wiz, state) {
  if (wiz.tab === 'paste') {
    if (wiz.rights) state.store.agreeRights();
    const today = new Date().toISOString().slice(0, 10);
    const paper = {
      id: `x${wiz.examId}`, subject: wiz.subject, title: pasteValid(wiz)[0].title + (pasteValid(wiz).length > 1 ? ` 외 ${pasteValid(wiz).length - 1}개` : ''),
      kind: '직접 추가', grade: '고2', ym: today.slice(0, 7), by: '김지수', date: today,
      units: pasteValid(wiz).map((p, i) => ({ id: `u${String(i + 1).padStart(2, '0')}`, numbers: String(i + 1), type_label: p.title.trim(), genre: '기타', passage: p.text.trim(), questions: [], has_figure: false, figure_desc: '', confidence: 'high', note: '' })),
    };
    wiz.pastedPaper = paper;
    wiz.selected = paper.units.map((u) => `${paper.id}/${u.id}`);
    if (wiz.pasteToLibrary) state.store.savePasted(paper);
  }
  return goStep(wiz, state, 2);
}

export function view(wiz, state) {
  const subj = `<div class="pt-row"><span class="pt-label">과목</span><div class="cl-segmented pt-seg" role="group" aria-label="과목">${SUBJECTS.map((s) => `<button type="button" class="cl-segmented__item" data-a="src-subject" data-v="${s}" aria-pressed="${wiz.subject === s}">${s}</button>`).join('')}</div></div>`;
  const tabs = `<div class="cl-tabs" role="tablist">${[['library', '보관함에서'], ['paste', '지문 붙여넣기']].map(([k, l]) => `<button type="button" class="cl-tab" role="tab" data-a="src-tab" data-v="${k}" aria-selected="${wiz.tab === k}">${l}</button>`).join('')}</div>`;
  return `${subj}${tabs}${wiz.tab === 'paste' ? pasteView(wiz, state) : libraryView(wiz, state)}`;
}

function libraryView(wiz, state) {
  const papers = allPapers(state).filter((p) => p.subject === wiz.subject && (!wiz.paperQ || p.title.includes(wiz.paperQ)));
  const paper = papers.find((p) => p.id === wiz.paperId) || papers[0];
  const left = `<div class="pt-col"><label class="cl-search pt-full"><input type="search" placeholder="시험지 이름 검색" value="${esc(wiz.paperQ)}" data-a="src-q" aria-label="시험지 이름 검색"></label>
    <ul class="pt-paperlist">${papers.map((p) => {
      const n = wiz.selected.filter((k) => k.startsWith(`${p.id}/`)).length;
      return `<li><button type="button" class="pt-paper" data-a="src-paper" data-v="${p.id}" aria-pressed="${paper?.id === p.id}"><strong>${esc(p.title)}</strong><span class="pt-sub">${esc(paperMeta(p))} · 지문 ${p.units.length}${n ? ` · <b>${n}개 고름</b>` : ''}</span></button></li>`;
    }).join('') || '<li class="pt-sub">이 과목 시험지가 없어요. 보관함에 먼저 올려 주세요.</li>'}</ul></div>`;
  let right = '<div class="pt-col"></div>';
  if (paper) {
    const types = [...new Set(paper.units.filter((u) => !u.has_figure).map((u) => u.type_label))];
    const shown = paper.units.filter((u) => !wiz.typeFilter || u.type_label === wiz.typeFilter);
    right = `<div class="pt-col pt-col--wide"><div class="cl-toolbar"><button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="src-all">전체 선택</button><button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="src-none">선택 해제</button>
      <div class="cl-chips">${['', ...types].map((t) => `<button type="button" class="cl-chip" data-a="src-type" data-v="${esc(t)}" aria-pressed="${wiz.typeFilter === t}">${t ? `${esc(t)}만` : '모든 유형'}</button>`).join('')}</div></div>
      <ul class="pt-units">${shown.map((u) => {
        const key = `${paper.id}/${u.id}`;
        return `<li class="pt-unit${u.has_figure ? ' is-off' : ''}" data-unit="${key}"><label class="cl-check"><input type="checkbox" data-a="src-unit" data-v="${key}" ${wiz.selected.includes(key) ? 'checked' : ''} ${u.has_figure ? 'disabled' : ''}>
          <span><strong>${esc(u.numbers)}번</strong> <span class="pt-sub">${esc(u.type_label)}</span><span class="pt-unit__line">${esc(firstLine(u.passage || u.questions[0]?.stem, 90))}</span>
          ${u.has_figure ? `<span class="pt-unit__why">${TEXT.figureBlocked}</span>` : ''}</span></label></li>`;
      }).join('')}</ul></div>`;
  }
  return `<div class="pt-source">${left}${right}</div>${basket(wiz, state)}`;
}

function basket(wiz, state) {
  const papers = allPapers(state);
  const chips = wiz.selected.map((key) => {
    const [pid, uid] = key.split('/');
    const p = papers.find((x) => x.id === pid);
    const u = p?.units.find((x) => x.id === uid);
    return u ? `<li class="pt-basket__item">${esc(u.numbers)}번 <span class="pt-sub">${esc(firstLine(p.title, 18))}</span><button type="button" class="cl-icon-btn" data-a="basket-remove" data-v="${key}" aria-label="${esc(u.numbers)}번 빼기">✕</button></li>` : '';
  }).join('');
  return `<section class="pt-basket" aria-label="고른 지문"><span class="pt-label">고른 지문</span><ul>${chips || '<li class="pt-sub">아직 고른 지문이 없어요</li>'}</ul>${wiz.removed.length ? '<button type="button" class="cl-text-btn" data-a="basket-undo">되돌리기</button>' : ''}</section>`;
}

function pasteView(wiz, state) {
  const rows = wiz.paste.map((p, i) => `<div class="cl-card pt-panel"><div class="pt-row"><label class="pt-field pt-grow">지문 제목 <input class="cl-input" data-a="paste-title" data-i="${i}" value="${esc(p.title)}" placeholder="예: 교과서 3과 본문"></label>
    ${wiz.paste.length > 1 ? `<button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="paste-del" data-i="${i}">지우기</button>` : ''}</div>
    <label class="pt-field">지문 <textarea class="cl-textarea" data-a="paste-text" data-i="${i}" rows="5" placeholder="지문을 붙여 넣으세요">${esc(p.text)}</textarea></label></div>`).join('');
  const rights = state.store.rightsAgreed() ? '' : `<label class="cl-check pt-rights"><input type="checkbox" data-a="rights" ${wiz.rights ? 'checked' : ''}> <span><strong>(처음 한 번)</strong> 이 자료를 수업 목적으로 쓸 권리가 있음을 확인합니다.</span></label>`;
  return `<p class="pt-lead">교과서 · 부교재 지문을 붙여 넣어 바로 문제를 만들어요. 붙여 넣은 지문에는 '원래 문항'이 없어서 '원래 유형 그대로'는 쓸 수 없어요.</p>
    ${rows}<button type="button" class="cl-btn cl-btn--ghost" data-a="paste-add">+ 지문 추가</button>
    <label class="cl-check"><input type="checkbox" data-a="paste-lib" ${wiz.pasteToLibrary ? 'checked' : ''}> 보관함에도 저장</label>${rights}`;
}

export function onAction(a, el, wiz, state) {
  const v = el.dataset.v;
  if (a === 'src-subject') {
    if (v === wiz.subject) return;
    wiz.subject = v;
    wiz.selected = [];
    wiz.paperId = allPapers(state).find((p) => p.subject === v)?.id || null;
    wiz.typeFilter = '';
    return render();
  }
  if (a === 'src-tab') { wiz.tab = v; return render(); }
  if (a === 'src-paper') { wiz.paperId = v; wiz.typeFilter = ''; return render(); }
  if (a === 'src-type') { wiz.typeFilter = v; return render(); }
  const paper = allPapers(state).find((p) => p.id === wiz.paperId);
  if (a === 'src-all' && paper) {
    const keys = paper.units.filter((u) => !u.has_figure && (!wiz.typeFilter || u.type_label === wiz.typeFilter)).map((u) => `${paper.id}/${u.id}`);
    wiz.selected = [...new Set([...wiz.selected, ...keys])];
    return render();
  }
  if (a === 'src-none' && paper) { wiz.selected = wiz.selected.filter((k) => !k.startsWith(`${paper.id}/`)); return render(); }
  if (a === 'basket-remove') { wiz.selected = wiz.selected.filter((k) => k !== v); wiz.removed.push(v); return render(); }
  if (a === 'basket-undo') { const k = wiz.removed.pop(); if (k && !wiz.selected.includes(k)) wiz.selected.push(k); return render(); }
  if (a === 'paste-add') { wiz.paste.push({ title: '', text: '' }); return render(); }
  if (a === 'paste-del') { wiz.paste.splice(Number(el.dataset.i), 1); return render(); }
  return undefined;
}

export function onInput(a, el, wiz) {
  if (a === 'src-unit') {
    const k = el.dataset.v;
    wiz.selected = el.checked ? [...wiz.selected, k] : wiz.selected.filter((x) => x !== k);
    return render();
  }
  if (a === 'src-q') { wiz.paperQ = el.value.trim(); return rerenderKeepFocus(); }
  if (a === 'paste-title') wiz.paste[Number(el.dataset.i)].title = el.value;
  if (a === 'paste-text') wiz.paste[Number(el.dataset.i)].text = el.value;
  if (a === 'paste-lib') wiz.pasteToLibrary = el.checked;
  if (a === 'rights') wiz.rights = el.checked;
  if (['paste-title', 'paste-text', 'rights', 'paste-lib'].includes(a)) rerenderKeepFocus();
  return undefined;
}

