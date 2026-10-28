// ③ 검토: 왼쪽 문항 목록(주의 문항 먼저) · 오른쪽 문항 카드(근거 강조 · 배지 · 고치기 · 다시 만들기 · 빼기).
import { render, toast } from '../app.js';
import { FLAGS, CIRCLED, groupOf } from '../constants.js';
import { generate } from '../generator.js';
import { esc, rich, badge } from '../ui.js';
import { unitsOf } from './wizard.js';

const warnFlags = (it) => (it.flags || []).filter((f) => f !== 'type_changed');
const isFlagged = (it) => warnFlags(it).length > 0;

// 주의 문항을 앞으로(만든 직후 한 번). 같은 무리 안에서는 원래 순서를 지킨다.
export function flaggedFirst(items) {
  return [...items.filter(isFlagged), ...items.filter((i) => !isFlagged(i))];
}

function counts(wiz) {
  const warn = wiz.items.filter(isFlagged).length;
  const changed = wiz.items.filter((i) => (i.flags || []).includes('type_changed')).length;
  return `${wiz.items.length}문항 · 주의 ${warn}${changed ? ` · 유형 바꿈 ${changed}` : ''}`;
}

export function summary(wiz) {
  return `<strong>${counts(wiz)}</strong> <span class="pt-sub">· 확인함 ${wiz.items.filter((i) => i.checked).length}</span>`;
}

export function canNext(wiz) { return wiz.items.length ? true : '문항이 없어요. 이전 단계에서 다시 만들어 주세요'; }

// 지문을 이스케이프한 뒤 <u> 만 살리고, 근거 문장의 첫 일치에 <mark>.
function passageHtml(text, evidence) {
  let html = rich(text);
  (evidence || []).forEach((e) => {
    const needle = rich(e);
    const at = needle ? html.indexOf(needle) : -1;
    if (at >= 0) html = `${html.slice(0, at)}<mark>${needle}</mark>${html.slice(at + needle.length)}`;
  });
  return html;
}

const label = (wiz, it) => (it.group === 'writing' ? '서술형' : groupOf(wiz.subject, it.group)?.label || '');

function list(wiz) {
  const shown = wiz.items.filter((it) => !wiz.todoOnly || !it.checked);
  return `<ol class="pt-ilist">${shown.map((it) => {
    const n = wiz.items.indexOf(it) + 1;
    return `<li data-id="${it.id}" data-flagged="${isFlagged(it) ? 1 : 0}" class="${it.id === wiz.cur ? 'is-cur' : ''}">
      <button type="button" class="pt-ilist__pick" data-a="pick" data-v="${it.id}"><span class="pt-ilist__no">${n}</span><span><strong>${esc(it.subtype || label(wiz, it))}</strong> <span class="pt-sub">${esc(label(wiz, it))}</span>
        <span class="pt-ilist__state">${isFlagged(it) ? badge('주의', 'danger') : ''}${it.checked ? badge('확인함', 'success') : badge('확인 필요', 'neutral')}</span></span></button>
      <span class="pt-ilist__move"><button type="button" class="cl-icon-btn" data-a="move-up" data-v="${it.id}" aria-label="${n}번 위로" ${n === 1 ? 'disabled' : ''}>↑</button><button type="button" class="cl-icon-btn" data-a="move-down" data-v="${it.id}" aria-label="${n}번 아래로" ${n === wiz.items.length ? 'disabled' : ''}>↓</button></span></li>`;
  }).join('') || '<li class="pt-sub">확인할 문항이 없어요</li>'}</ol>`;
}

function card(wiz, state) {
  const it = wiz.items.find((x) => x.id === wiz.cur) || wiz.items[0];
  if (!it) return '<div class="pt-icard"></div>';
  const unit = unitsOf(wiz, state).find((u) => u.unitKey === `${it.paperId}/${it.unitId}`);
  const badges = (it.flags || []).map((f) => badge(FLAGS[f], f === 'type_changed' ? 'warning' : 'danger')).join(' ') || badge('자동 검사 통과', 'success');
  const choices = (it.choices || []).length
    ? `<ol class="pt-choices">${it.choices.map((c, i) => `<li class="${i + 1 === it.answer ? 'is-answer' : ''}">${String(c).trim() === CIRCLED[i] ? '' : `${CIRCLED[i] || i + 1} `}${rich(c)}</li>`).join('')}</ol>` : '';
  const answer = it.answer > 0
    ? `<p><strong>정답 ${CIRCLED[it.answer - 1] || (it.choices[it.answer - 1] ?? it.answer)}</strong></p>`
    : `<p><strong>모범 답안</strong> ${esc(it.answer_text)}</p>${it.rubric?.length ? `<p><strong>채점 기준</strong></p><ul>${it.rubric.map((r) => `<li>${esc(r.criterion)} (${r.point}점)</li>`).join('')}</ul>` : ''}`;
  const body = wiz.editing === it.id
    ? `<label class="pt-field">발문<textarea class="cl-textarea" data-a="edit-stem" rows="4">${esc(it.stem)}</textarea></label>
       ${(it.choices || []).map((c, i) => `<label class="pt-field">선택지 ${CIRCLED[i] || i + 1}<input class="cl-input" data-a="edit-choice" data-i="${i}" value="${esc(c)}"></label>`).join('')}
       ${it.answer > 0 ? `<label class="pt-field">정답 번호<select class="cl-select" data-a="edit-answer">${it.choices.map((_, i) => `<option value="${i + 1}" ${i + 1 === it.answer ? 'selected' : ''}>${CIRCLED[i] || i + 1}</option>`).join('')}</select></label>` : `<label class="pt-field">모범 답안<input class="cl-input" data-a="edit-answer-text" value="${esc(it.answer_text)}"></label>`}
       <label class="pt-field">해설<textarea class="cl-textarea" data-a="edit-expl" rows="3">${esc(it.explanation)}</textarea></label>
       <div class="pt-actions"><button type="button" class="cl-btn cl-btn--ghost" data-a="edit-cancel">취소</button><button type="button" class="cl-btn cl-btn--primary" data-a="edit-save">저장</button></div>`
    : `<div class="pt-stem">${rich(it.stem)}</div>${choices}<div class="pt-answer">${answer}<p>${rich(it.explanation)}</p></div>
       ${it.note ? `<p class="pt-demo-note">${esc(it.note)}</p>` : ''}
       <div class="pt-card-actions"><button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="edit">고치기</button><button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="regen">다시 만들기</button>
       <input class="cl-input pt-regen-req" data-a="regen-req" placeholder="한 줄 요청 (선택)" value="${esc(wiz.regenReq || '')}" aria-label="다시 만들 때 요청">
       <button type="button" class="cl-btn cl-btn--ghost cl-btn--sm" data-a="remove">빼기</button><span class="cl-toolbar__spacer"></span>
       <button type="button" class="cl-btn ${it.checked ? 'cl-btn--ghost' : 'cl-btn--tint'} cl-btn--sm" data-a="mark-done">${it.checked ? '확인 취소' : '확인함'}</button></div>`;
  return `<div class="pt-review-grid"><section class="cl-card pt-src" aria-label="원래 지문"><span class="pt-label">${esc(unit?.paperTitle || '')} · ${esc(unit?.numbers || '')}번 ${esc(unit?.type_label || '')}</span>
      <div class="pt-passage">${passageHtml(unit?.passage || '', it.evidence)}</div><p class="pt-sub">노란색: 정답 근거 문장</p></section>
    <section class="cl-card pt-icard" aria-label="만든 문항"><div class="pt-row">${badge(label(wiz, it), 'info')} ${it.subtype ? badge(it.subtype, 'neutral') : ''} ${badges}</div>${body}</section></div>`;
}

export function view(wiz, state) {
  if (!wiz.cur || !wiz.items.some((i) => i.id === wiz.cur)) wiz.cur = wiz.items[0]?.id;
  const notes = (wiz.notes || []).map((n) => `<li>${esc(n)}</li>`).join('');
  return `<div class="pt-review-head"><p class="pt-review-sum"><strong>${counts(wiz)}</strong></p>
      <label class="cl-check"><input type="checkbox" data-a="filter-todo" ${wiz.todoOnly ? 'checked' : ''}> 확인 필요만 보기</label></div>
    ${notes ? `<ul class="pt-notes">${notes}</ul>` : ''}
    <div class="pt-review">${list(wiz)}${card(wiz, state)}</div>`;
}

async function regen(wiz, state) {
  const it = wiz.items.find((x) => x.id === wiz.cur);
  const unit = unitsOf(wiz, state).find((u) => u.unitKey === `${it.paperId}/${it.unitId}`);
  const used = wiz.items.map((x) => x.poolId);
  const { items } = await generate([unit], { ...wiz.settings, groups: [it.group], subtypes: {}, countMode: 'perUnit', perUnit: 1 }, wiz.subject, state.data.pool, used);
  if (!items.length) return toast('더 만들 데모 문항이 없어요');
  wiz.items.splice(wiz.items.indexOf(it), 1, items[0]);
  wiz.cur = items[0].id;
  wiz.regenReq = '';
  render();
  return toast(wiz.regenReqUsed ? '요청을 반영해 다시 만들었어요 (데모)' : '다시 만들었어요');
}

export function onAction(a, el, wiz, state) {
  const v = el.dataset.v;
  const it = wiz.items.find((x) => x.id === wiz.cur);
  const move = (id, d) => {
    const i = wiz.items.findIndex((x) => x.id === id);
    const j = i + d;
    if (j < 0 || j >= wiz.items.length) return;
    [wiz.items[i], wiz.items[j]] = [wiz.items[j], wiz.items[i]];
  };
  if (a === 'pick') { wiz.cur = v; wiz.editing = null; }
  else if (a === 'move-up') move(v, -1);
  else if (a === 'move-down') move(v, 1);
  else if (a === 'mark-done') it.checked = !it.checked;
  else if (a === 'edit') wiz.editing = it.id;
  else if (a === 'edit-cancel') wiz.editing = null;
  else if (a === 'edit-save') {
    const q = (s) => document.querySelector(s);
    it.stem = q('[data-a="edit-stem"]').value;
    document.querySelectorAll('[data-a="edit-choice"]').forEach((inp) => { it.choices[Number(inp.dataset.i)] = inp.value; });
    if (it.answer > 0) it.answer = Number(q('[data-a="edit-answer"]').value);
    else it.answer_text = q('[data-a="edit-answer-text"]').value;
    it.explanation = q('[data-a="edit-expl"]').value;
    it.edited = true;
    wiz.editing = null;
    toast('고친 내용을 저장했어요');
  } else if (a === 'remove') {
    const i = wiz.items.indexOf(it);
    wiz.items.splice(i, 1);
    wiz.cur = wiz.items[Math.min(i, wiz.items.length - 1)]?.id;
    toast('문항을 뺐어요');
  } else if (a === 'regen') { wiz.regenReqUsed = !!(wiz.regenReq || '').trim(); return regen(wiz, state); }
  else return undefined;
  return render();
}

export function onInput(a, el, wiz) {
  if (a === 'filter-todo') { wiz.todoOnly = el.checked; render(); }
  if (a === 'regen-req') wiz.regenReq = el.value;
}
