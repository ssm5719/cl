// 새 시험지 만들기 4단계의 틀: 단계 표시 · 아래 고정 바 · 단계 전환 · 작성 중 저장.
// 각 단계 모듈은 view(wiz, state) · summary(wiz, state) · canNext(wiz, state) · next?(wiz, state)
// · onAction?(a, el, wiz, state) · onInput?(a, el, wiz, state) 를 내보낸다.
import { render } from '../app.js';
import { allPapers, esc } from '../ui.js';
import * as source from './step-source.js';
import * as method from './step-method.js';
import * as review from './step-review.js';
import * as print from './step-print.js';

const STEPS = [source, method, review, print];
const LABELS = ['자료', '방식', '검토', '인쇄'];

export function defaultSettings() {
  return {
    groups: ['original'], subtypes: {}, form: '5지', level: '원래', countMode: 'perUnit', perUnit: 2, total: 10,
    custom: {}, choiceLang: 'auto', request: '',
  };
}

function newWiz(state, r) {
  const papers = allPapers(state);
  // 보관함에서 '이 지문으로 만들기' 등으로 넘어온 선택(state.ui.newPreset)을 한 번만 쓴다. 쿼리는 로컬 검사용.
  const q = { ...(r.query || {}), ...(state.ui.newPreset || {}) };
  state.ui.newPreset = null;
  const preset = (q.units || '').split(',').filter(Boolean);
  const paper = papers.find((p) => p.id === (q.paper || preset[0]?.split('/')[0]));
  const subject = paper?.subject || '영어';
  return {
    examId: `e${Date.now().toString(36)}`, step: 1, reached: 1, subject, title: '',
    tab: 'library', paperId: paper?.id || papers.find((p) => p.subject === subject)?.id || null,
    selected: preset, removed: [], typeFilter: '', paperQ: '',
    paste: [{ title: '', text: '' }], pasteToLibrary: true, pastedPaper: null,
    settings: defaultSettings(), items: [], notes: [],
    print: { cols: 2, answerAt: 'sheet', showSource: true, showNameBox: true, sheet: 'paper' },
  };
}

function fromExam(exam) {
  const wiz = { ...newWizShape(), ...exam.wiz, examId: exam.id };
  wiz.reached = Math.max(wiz.reached || 1, wiz.step || 1);
  return wiz;
}
function newWizShape() {
  return { removed: [], typeFilter: '', paperQ: '', paste: [{ title: '', text: '' }], notes: [] };
}

export function wizOf(state) {
  const r = state.route;
  if (state.ui.wizHash !== location.hash || !state.ui.wiz) {
    const exam = r.params.examId && state.store.getExam(r.params.examId);
    state.ui.wiz = exam ? fromExam(exam) : newWiz(state, r);
    state.ui.wizHash = location.hash;
  }
  return state.ui.wiz;
}

// 고른 지문(보관함 + 붙여 넣은 지문)을 화면 계산에 쓰는 모양으로.
export function unitsOf(wiz, state) {
  const papers = [...allPapers(state), ...(wiz.pastedPaper ? [wiz.pastedPaper] : [])];
  return wiz.selected.map((key) => {
    const [paperId, unitId] = key.split('/');
    const p = papers.find((x) => x.id === paperId);
    const u = p?.units.find((x) => x.id === unitId);
    return u && { ...u, paperId, unitKey: key, paperTitle: p.title, paperKind: p.kind, paperYm: p.ym };
  }).filter(Boolean);
}

// status 를 주지 않으면 저장된 상태(완성 · 작성 중)를 그대로 둔다. 열어 보기만 해도 '작성 중'으로 돌아가지 않게.
export function saveDraft(wiz, state, status) {
  status ||= state.store.getExam(wiz.examId)?.status || 'draft';
  const title = wiz.title || `${wiz.subject} 변형 시험지 ${new Date().toISOString().slice(5, 10).replace('-', '/')}`;
  const { examId, generating, ...rest } = wiz;
  const sourceLabel = [...new Set(unitsOf(wiz, state).map((u) => u.paperTitle))].join(' · ');
  state.store.saveExam({ id: examId, title, subject: wiz.subject, status, step: wiz.step, count: wiz.items.length, source: wiz.selected, sourceLabel, wiz: rest });
  const target = `#new-${examId}`;
  if (location.hash !== target) {
    history.replaceState(null, '', target);
    state.ui.wizHash = target;
  }
}

export async function goStep(wiz, state, n) {
  wiz.step = n;
  wiz.reached = Math.max(wiz.reached, n);
  saveDraft(wiz, state);
  render();
  window.scrollTo(0, 0);
}

export function view(state) {
  const wiz = wizOf(state);
  const step = STEPS[wiz.step - 1];
  const ok = step.canNext(wiz, state);
  const stepper = `<ol class="pt-steps" aria-label="만들기 단계">${LABELS.map((l, i) => {
    const n = i + 1;
    const cur = n === wiz.step ? 'aria-current="step"' : '';
    const label = `${'①②③④'[i]} ${l}`;
    return `<li>${n <= wiz.reached && n !== wiz.step && !wiz.generating ? `<button type="button" class="pt-step is-done" data-a="wiz-go" data-v="${n}">${label}</button>` : `<span class="pt-step${n < wiz.reached ? ' is-done' : ''}" ${cur}>${label}</span>`}</li>`;
  }).join('<li class="pt-steps__sep" aria-hidden="true">→</li>')}</ol>`;
  const nextLabel = ['다음: 만들 방식', '문제 만들기', '다음: 인쇄', ''][wiz.step - 1];
  const bar = `<div class="pt-bar"><div class="pt-bar__summary">${step.summary(wiz, state)}</div>
    ${wiz.step > 1 ? `<button type="button" class="cl-btn cl-btn--ghost" data-a="wiz-prev" ${wiz.generating ? 'disabled' : ''}>이전</button>` : ''}
    ${nextLabel ? `<button type="button" class="cl-btn cl-btn--primary" data-a="wiz-next" ${ok === true ? '' : 'disabled'} title="${ok === true ? '' : esc(ok)}">${nextLabel}</button>` : ''}</div>`;
  return `<div class="cl-page pt-wide pt-wizard"><a class="cl-text-btn pt-back" href="#exams">← 시험 출제</a>
    <div class="cl-page__head"><p class="cl-page__parent">시험 출제</p><h1 class="cl-page__title">새 시험지 만들기</h1></div>
    ${stepper}${step.view(wiz, state)}${bar}</div>`;
}

// ① 에서 지문 · 과목을 바꾸면 만든 문항이 맞지 않으니 ③ · ④ 로 건너뛰지 못하게 한다.
// ③ · ④ 에서 고친 내용은 바로 저장한다(새로 고쳐도 남게).
const mark = (wiz) => `${wiz.subject}|${wiz.selected.join(',')}`;
function afterChange(wiz, state, before) {
  if (state.ui.wiz !== wiz) return;
  if (wiz.step === 1 && mark(wiz) !== before && wiz.reached > 2) { wiz.reached = 2; render(); }
  if (wiz.step >= 3) saveDraft(wiz, state);
}

export async function onAction(a, el, state) {
  const wiz = wizOf(state);
  const step = STEPS[wiz.step - 1];
  if (wiz.generating && (a === 'wiz-go' || a === 'wiz-prev')) return;
  if (a === 'wiz-go') return goStep(wiz, state, Number(el.dataset.v));
  if (a === 'wiz-prev') return goStep(wiz, state, wiz.step - 1);
  if (a === 'wiz-next') {
    if (step.canNext(wiz, state) !== true) return;
    if (step.next) return step.next(wiz, state);
    return goStep(wiz, state, wiz.step + 1);
  }
  const before = mark(wiz);
  const r = await step.onAction?.(a, el, wiz, state);
  afterChange(wiz, state, before);
  return r;
}

export function onInput(a, el, state) {
  const wiz = wizOf(state);
  const before = mark(wiz);
  STEPS[wiz.step - 1].onInput?.(a, el, wiz, state);
  afterChange(wiz, state, before);
}

// 입력 중 다시 그려도 입력 칸 커서를 지킨다.
export function rerenderKeepFocus() {
  const el = document.activeElement;
  const key = el?.dataset?.a;
  const idx = key ? [...document.querySelectorAll(`[data-a="${key}"]`)].indexOf(el) : -1;
  const pos = el?.selectionStart;
  render();
  if (idx < 0) return;
  const again = document.querySelectorAll(`[data-a="${key}"]`)[idx];
  if (again) { again.focus(); if (pos != null && again.setSelectionRange) again.setSelectionRange(pos, pos); }
}
