// 해시 주소로 화면을 고르고, 화면 모듈의 view() 를 #app 에 그린다.
// 동작은 data-a="<action>" 속성으로 위임해 현재 화면의 onAction / onInput 에 넘긴다.
import * as exams from './views/exams.js';
import * as library from './views/library.js';
import * as wizard from './views/wizard.js';
import { createStore } from './store.js';

const VIEWS = { exams, library, paper: library, upload: library, new: wizard };

// 주소는 '#이름' 또는 '#이름-id' 만 쓴다(아티팩트 링크 규칙). '#new?…' 쿼리는 로컬 검사용으로만 읽는다.
const NAMES = ['exams', 'library', 'upload', 'paper', 'new'];

export function route(hash) {
  const raw = String(hash || '').replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs));
  const name = NAMES.find((n) => path === n || path.startsWith(`${n}-`)) || 'exams';
  const id = path.length > name.length ? path.slice(name.length + 1) : '';
  if (name === 'paper') return { name, params: { paperId: id }, query };
  if (name === 'new') return { name, params: id ? { examId: id } : {}, query };
  return { name, params: {}, query };
}

export function href(name, id) {
  return id ? `#${name}-${id}` : `#${name}`;
}

export const state = { data: null, store: null, ui: {} };

// 같은 주소로 다시 가면 hashchange 가 일어나지 않으므로 직접 다시 그린다.
export function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

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

// 지우기처럼 되돌릴 수 없는 버튼: 첫 번째 누름은 글을 바꿔 묻고, 4초 안에 다시 누르면 실행한다.
export function armed(el, ask) {
  if (el.dataset.armed === '1') return true;
  const label = el.textContent;
  el.dataset.armed = '1';
  el.textContent = ask;
  el.classList.add('pt-armed');
  setTimeout(() => { if (el.isConnected) { el.dataset.armed = ''; el.textContent = label; el.classList.remove('pt-armed'); } }, 4000);
  return false;
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
    // 아티팩트 화면에서는 confirm() 이 막혀 있어, 한 번 더 누르게 해서 확인한다.
    if (!armed(el, '한 번 더 누르면 처음으로')) return true;
    state.store.reset();
    state.ui = {};
    location.hash = '#exams';
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
