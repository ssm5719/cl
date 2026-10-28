// 화면들이 함께 쓰는 작은 도우미.
export const ME = '김지수';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// 데이터 글에 들어 있는 <u>밑줄</u> 만 살린다.
export const rich = (s) => esc(s).replace(/&lt;(\/?)u&gt;/g, '<$1u>');

// 데모 문항 풀에 문항이 있는 지문('paperId/unitId').
export const demoKeys = (state) => new Set((state.data?.pool || []).map((it) => `${it.paperId}/${it.unitId}`));
export const badge = (text, tone = 'neutral') => `<span class="cl-badge cl-badge--${tone}">${esc(text)}</span>`;

export const firstLine = (s, n = 60) => {
  const t = String(s || '').replace(/<\/?u>/g, '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n)}…` : t;
};

export function pageHead(parent, title, actions = '') {
  return `<div class="cl-page__head cl-page__head--row"><div><p class="cl-page__parent">${parent}</p><h1 class="cl-page__title">${esc(title)}</h1></div>${actions ? `<div class="cl-page__actions">${actions}</div>` : ''}</div>`;
}

export function allPapers(state) {
  return [...state.data.papers, ...state.store.listPasted()];
}

export const paperMeta = (p) => `${p.kind} · ${p.grade} · ${p.ym}`;
