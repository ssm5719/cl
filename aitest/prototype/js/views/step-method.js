// ② 만들 방식: 유형 묶음 칩 · 세부 유형 · 형태 · 난이도 · 문항 수 · 자세히 설정 → 문제 만들기.
import { render } from '../app.js';
import { GROUPS, ORIGINAL, FORMS, LEVELS, LEVEL_LABEL, RULES } from '../constants.js';
import { countSummary, allocate, generate } from '../generator.js';
import { esc } from '../ui.js';
import { unitsOf, goStep, rerenderKeepFocus } from './wizard.js';
import { flaggedFirst } from './step-review.js';

const PROGRESS_MS = 600;

const isPasted = (u) => u.paperKind === '직접 추가';

function counts(wiz, state) {
  const units = unitsOf(wiz, state);
  return { units, alloc: allocate(units.map((u) => u.unitKey), wiz.settings) };
}

function totalOf(wiz, state) {
  return Object.values(counts(wiz, state).alloc).reduce((a, b) => a + b, 0);
}

// 붙여 넣은 지문만 골랐으면 '원래 유형 그대로'를 쓸 수 없다. OX 면 서술형을 쓸 수 없다.
function originalAllowed(wiz, state) { return unitsOf(wiz, state).some((u) => !isPasted(u)); }
function normalize(wiz, state) {
  const s = wiz.settings;
  if (!originalAllowed(wiz, state)) s.groups = s.groups.filter((g) => g !== 'original');
  if (s.form === 'OX') s.groups = s.groups.filter((g) => g !== 'writing');
  if (!s.groups.length && wiz.groupsTouched !== true) s.groups = [GROUPS[wiz.subject][0].key];
}

export function summary(wiz, state) {
  if (wiz.generating) return `<strong>문제를 만들고 있어요</strong>`;
  const s = wiz.settings;
  const n = unitsOf(wiz, state).length;
  const text = s.countMode === 'perUnit'
    ? countSummary({ units: n, mode: 'perUnit', perUnit: s.perUnit })
    : countSummary({ units: n, mode: 'total', total: totalOf(wiz, state) });
  const labels = s.groups.map((k) => (k === 'original' ? ORIGINAL.label : GROUPS[wiz.subject].find((g) => g.key === k)?.label)).filter(Boolean);
  return `<strong>${text}</strong>${labels.length ? ` <span class="pt-sub">· ${labels.map(esc).join(' · ')}</span>` : ''}`;
}

export function canNext(wiz, state) {
  if (wiz.generating) return '만드는 중이에요';
  if (!wiz.settings.groups.length) return '어떤 문제를 만들지 하나 이상 골라 주세요';
  if (totalOf(wiz, state) < 1) return '문항 수를 1개 이상으로 정해 주세요';
  return true;
}

export async function next(wiz, state) {
  const units = unitsOf(wiz, state);
  const { alloc } = counts(wiz, state);
  const working = units.filter((u) => alloc[u.unitKey] > 0);
  wiz.generating = { done: 0, total: working.length };
  render();
  const result = await generate(units, wiz.settings, wiz.subject, state.data.pool);
  for (let i = 1; i <= working.length; i++) {
    await new Promise((r) => setTimeout(r, PROGRESS_MS));
    if (state.ui.wiz !== wiz) return;
    wiz.generating.done = i;
    render();
  }
  wiz.items = flaggedFirst(result.items);
  wiz.cur = null;
  wiz.notes = result.notes;
  wiz.generating = null;
  return goStep(wiz, state, 3);
}

function chip(key, label, wiz, disabled, why = '') {
  const on = wiz.settings.groups.includes(key);
  return `<button type="button" class="cl-chip pt-grp" data-a="grp" data-v="${key}" aria-pressed="${on && !disabled}" ${disabled ? `disabled title="${esc(why)}"` : ''}>${esc(label)}</button>`;
}

export function view(wiz, state) {
  normalize(wiz, state);
  if (wiz.generating) {
    const g = wiz.generating;
    return `<div class="cl-card pt-panel pt-center"><div class="cl-loading"><span class="cl-loading__spinner" aria-hidden="true"></span></div>
      <p><strong>지문 ${g.total}개 중 ${g.done}개 완료</strong></p><p class="pt-sub">지문마다 문항을 만들고, 정답을 가린 채 다시 풀어 확인해요.</p>
      <div class="cl-progress"><div class="cl-progress__track"><div class="cl-progress__bar" style="width:${Math.round((g.done / Math.max(g.total, 1)) * 100)}%"></div></div></div></div>`;
  }
  const s = wiz.settings;
  const groups = GROUPS[wiz.subject];
  const origOk = originalAllowed(wiz, state);
  const { units, alloc } = counts(wiz, state);
  const chips = `<div class="cl-chips">${chip('original', ORIGINAL.label, wiz, !origOk, '붙여 넣은 지문에는 원래 유형이 없어요')}</div>
    ${origOk ? '' : '<p class="pt-sub">붙여 넣은 지문에는 원래 유형이 없어요</p>'}
    <div class="cl-chips">${groups.map((g) => chip(g.key, g.label, wiz, g.key === 'writing' && s.form === 'OX', 'OX 형태에서는 서술형을 만들 수 없어요')).join('')}</div>`;
  const subs = wiz.subOpen ? `<div class="pt-subs">${groups.filter((g) => s.groups.includes(g.key)).map((g) => `<div class="pt-subgroup" data-sub-group="${g.key}"><span class="pt-label">${esc(g.label)}</span>
      ${g.subtypes.map((t) => `<label class="cl-check"><input type="checkbox" data-a="sub" data-g="${g.key}" data-v="${esc(t)}" ${(s.subtypes[g.key] || []).includes(t) ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</div>`).join('') || '<p class="pt-sub">위에서 묶음을 고르면 세부 유형이 보여요.</p>'}
      <p class="pt-sub">하나도 고르지 않으면 묶음 안에서 지문에 맞는 유형을 AI가 고르고 섞어요.</p></div>` : '';
  const seg = (a, values, cur, labels = {}) => `<div class="cl-segmented pt-seg" role="group">${values.map((v) => `<button type="button" class="cl-segmented__item" data-a="${a}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${labels[v] || v}</button>`).join('')}</div>`;
  const formLabels = { '5지': '5지 선다', '4지': '4지 선다', OX: 'OX' };
  let count = '';
  if (s.countMode === 'perUnit') {
    count = `<div class="pt-row"><span class="pt-label">문항 수</span>지문당 ${seg('per-unit', [1, 2, 3], s.perUnit)}
      <strong>${countSummary({ units: units.length, mode: 'perUnit', perUnit: s.perUnit })}</strong></div>`;
  } else if (s.countMode === 'total') {
    count = `<div class="pt-row"><span class="pt-label">문항 수</span><label>총 <input class="cl-input pt-num" type="number" min="0" max="60" data-a="total" value="${s.total}"> 문항</label>
      <strong>${countSummary({ units: units.length, mode: 'total', total: s.total })}</strong></div>
      <p class="pt-alloc pt-sub">${units.map((u) => `${esc(u.numbers)}번 ${alloc[u.unitKey]}`).join(' · ')}</p>`;
  } else {
    count = `<div class="pt-row"><span class="pt-label">문항 수</span><strong>지문별로 정하기 · 총 ${totalOf(wiz, state)}문항</strong></div>
      <table class="cl-table pt-custom"><tbody>${units.map((u) => `<tr><td>${esc(u.numbers)}번 <span class="pt-sub">${esc(u.type_label)}</span></td><td><input class="cl-input pt-num" type="number" min="0" max="5" data-a="custom" data-v="${u.unitKey}" value="${alloc[u.unitKey]}" aria-label="${esc(u.numbers)}번 문항 수"></td></tr>`).join('')}</tbody></table>`;
  }
  const modes = `<div class="pt-links">${[['perUnit', '지문당 개수로'], ['total', '총 문항 수에 맞추기'], ['custom', '지문별로 바꾸기']].filter(([k]) => k !== s.countMode).map(([k, l]) => `<button type="button" class="cl-text-btn" data-a="count-mode" data-v="${k}">${l}</button>`).join('')}</div>`;
  const more = `<details class="pt-more" ${wiz.moreOpen ? 'open' : ''}><summary data-a="more-toggle">자세히 설정</summary>
    ${wiz.subject === '영어' ? `<label class="pt-field">선택지 언어 <select class="cl-select" data-a="choice-lang">${[['auto', '수능처럼 자동'], ['ko', '한국어'], ['en', '영어']].map(([v, l]) => `<option value="${v}" ${s.choiceLang === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>` : ''}
    <label class="pt-field">직접 요청 (선택) <textarea class="cl-textarea" data-a="request" maxlength="200" rows="3" placeholder="예: 내신 서술형처럼 조건을 두 개 넣어 주세요">${esc(s.request)}</textarea><span class="pt-sub">${s.request.length} / 200자</span></label></details>`;
  return `<section class="pt-section"><h2 class="cl-section-title">어떤 문제를 만들까요?</h2><p class="pt-sub">여러 개 고르면 지문마다 골고루 섞어요.</p>${chips}
      <button type="button" class="cl-text-btn" data-a="sub-toggle">${wiz.subOpen ? '세부 유형 접기' : '세부 유형 펼치기'}</button>${subs}</section>
    <section class="pt-section"><div class="pt-row"><span class="pt-label">형태</span>${seg('form', FORMS, s.form, formLabels)}</div>
      <div class="pt-row"><span class="pt-label">난이도</span>${seg('level', LEVELS, s.level, LEVEL_LABEL)}</div>
      ${count}${modes}</section>
    <section class="pt-section">${more}</section>
    <section class="pt-rules" aria-label="항상 적용되는 규칙"><span class="pt-label">항상 적용</span><ul>${RULES.map((r) => `<li>${r}</li>`).join('')}</ul></section>`;
}

export function onAction(a, el, wiz, state) {
  const s = wiz.settings;
  const v = el.dataset.v;
  if (a === 'grp') {
    wiz.groupsTouched = true;
    s.groups = s.groups.includes(v) ? s.groups.filter((g) => g !== v) : [...s.groups, v];
  } else if (a === 'sub-toggle') wiz.subOpen = !wiz.subOpen;
  else if (a === 'form') s.form = v;
  else if (a === 'level') s.level = v;
  else if (a === 'per-unit') s.perUnit = Number(v);
  else if (a === 'count-mode') {
    // 지문별로 바꿀 때는 '지문당 개수'에서 시작한다(총 문항 수 모드의 배분이 아니라).
    if (v === 'custom') s.custom = Object.fromEntries(unitsOf(wiz, state).map((u) => [u.unitKey, s.perUnit]));
    s.countMode = v;
  } else if (a === 'more-toggle') { wiz.moreOpen = !el.parentElement.open; return; }
  else return;
  render();
}

export function onInput(a, el, wiz) {
  const s = wiz.settings;
  if (a === 'sub') {
    const list = s.subtypes[el.dataset.g] || [];
    s.subtypes[el.dataset.g] = el.checked ? [...list, el.dataset.v] : list.filter((t) => t !== el.dataset.v);
    return render();
  }
  if (a === 'total') s.total = Math.max(0, Math.min(60, Number(el.value) || 0));
  else if (a === 'custom') s.custom[el.dataset.v] = Math.max(0, Math.min(5, Number(el.value) || 0));
  else if (a === 'choice-lang') { s.choiceLang = el.value; return undefined; }
  else if (a === 'request') s.request = el.value.slice(0, 200);
  else return undefined;
  return rerenderKeepFocus();
}
