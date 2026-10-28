// 해시 주소로 화면을 고르고, 화면 모듈의 view() 를 #app 에 그린다.
// 동작은 data-a="<action>" 속성으로 위임해 현재 화면의 onAction / onInput 에 넘긴다.
import * as exams from './views/exams.js';
import * as library from './views/library.js';
import * as wizard from './views/wizard.js';
import { createStore } from './store.js';

const VIEWS = { exams, library, paper: library, upload: library, new: wizard };

export function route(hash) {
  const raw = String(hash || '').replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs));
  const [head, id] = path.split('/').filter(Boolean);
  if (head === 'library' && id) return { name: 'paper', params: { paperId: id }, query };
  if (head === 'library') return { name: 'library', params: {}, query };
  if (head === 'upload') return { name: 'upload', params: {}, query };
  if (head === 'new') return { name: 'new', params: id ? { examId: id } : {}, query };
  return { name: 'exams', params: {}, query };
}

export const state = { data: null, store: null, ui: {} };

export function render() {
  const r = route(location.hash);
  state.route = r;
  const view = VIEWS[r.name];
  document.getElementById('app').innerHTML = view.view(state, r);
  const navName = r.name === 'paper' || r.name === 'upload' ? 'library' : r.name === 'new' ? 'exams' : r.name;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === navName) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  view.afterRender?.(state, r);
}

export function toast(msg) {
  const el = document.querySelector('.pt-toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { el.hidden = true; }, 2400);
}

function closePopovers(except) {
  document.querySelectorAll('[data-popover]').forEach((p) => {
    if (p === except) return;
    p.querySelector('.cl-popover__panel').hidden = true;
    p.querySelector('[aria-haspopup]').setAttribute('aria-expanded', 'false');
  });
}

function setDrawer(open) {
  document.getElementById('cl-ws-sidebar').classList.toggle('is-open', open);
  document.querySelector('.cl-ws-backdrop').hidden = !open;
  document.querySelector('[data-a="drawer-open"]').setAttribute('aria-expanded', String(open));
}

function shellAction(a, el) {
  if (a === 'popover') {
    const pop = el.closest('[data-popover]');
    const panel = pop.querySelector('.cl-popover__panel');
    closePopovers(pop);
    panel.hidden = !panel.hidden;
    el.setAttribute('aria-expanded', String(!panel.hidden));
    return true;
  }
  if (a === 'drawer-open') { setDrawer(true); return true; }
  if (a === 'drawer-close') { setDrawer(false); return true; }
  if (a === 'demo-reset') {
    if (!confirm('데모에서 만든 시험지와 붙여 넣은 지문을 모두 지울까요?')) return true;
    state.store.reset();
    state.ui = {};
    location.hash = '#/exams';
    render();
    toast('데모를 처음 상태로 되돌렸어요');
    return true;
  }
  return false;
}

function current() { return VIEWS[state.route.name]; }

if (typeof document !== 'undefined') {
  state.data = window.EXAM_DATA || { demo: 'sample', papers: [], pool: [] };
  state.store = createStore();
  if (!state.store.persistent) document.querySelector('[data-demo-tag]').textContent = '데모 · 저장되지 않음';

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-a]');
    if (!e.target.closest('[data-popover]')) closePopovers();
    if (!el || el.matches('input, textarea, select')) return;
    if (el.closest('.cl-ws-sidebar') && el.tagName === 'A') setDrawer(false);
    if (shellAction(el.dataset.a, el)) return;
    current().onAction?.(el.dataset.a, el, state);
  });
  const onInput = (e) => {
    const el = e.target.closest('[data-a]');
    if (!el || !el.matches('input, textarea, select')) return;
    // 글 입력 칸은 input 만, 체크 · 선택 칸은 change 만 받는다. 글 칸의 change(포커스 잃을 때)까지 받으면
    // 다시 그리는 도중에 또 그리게 된다.
    const choice = el.matches('select, [type=checkbox], [type=radio]');
    if ((e.type === 'change') !== choice) return;
    current().onInput?.(el.dataset.a, el, state, e.type);
  };
  document.addEventListener('input', onInput);
  document.addEventListener('change', onInput);
  window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });
  render();
}
