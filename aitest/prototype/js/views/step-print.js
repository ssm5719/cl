// ④ 인쇄 · 저장: A4 미리보기(문제지 / 정답 · 해설지) · 단 · 정답 위치 · 출처 · 정답 분포 · 인쇄 · 저장.
import { render, toast } from '../app.js';
import { CIRCLED } from '../constants.js';
import { answerDistribution, needsShuffle, shuffleAnswers } from '../generator.js';
import { esc, rich } from '../ui.js';
import { unitsOf, saveDraft, rerenderKeepFocus } from './wizard.js';

export function summary(wiz) {
  return `<strong>${wiz.items.length}문항 · ${wiz.print.cols}단</strong> <span class="pt-sub">· 정답 ${{ sheet: '별지', below: '문항 아래', none: '빼기' }[wiz.print.answerAt]}</span>`;
}
export const canNext = () => true;

const titleOf = (wiz) => wiz.title || `${wiz.subject} 변형 시험지`;

function sourceOf(wiz, state, it) {
  const u = unitsOf(wiz, state).find((x) => x.unitKey === `${it.paperId}/${it.unitId}`);
  return u ? `${u.paperTitle} ${u.numbers}번 변형` : '';
}

const answerText = (it) => (it.answer > 0 ? CIRCLED[it.answer - 1] || String(it.answer) : it.answer_text);

function question(wiz, state, it, n) {
  const pos = (it.choices || []).every((c) => CIRCLED.includes(String(c).trim()));
  const choices = (it.choices || []).length && !pos
    ? `<ol class="pt-q-choices">${it.choices.map((c, i) => `<li>${CIRCLED[i] || i + 1} ${rich(c)}</li>`).join('')}</ol>`
    : pos ? `<p class="pt-q-pos">${it.choices.join('  ')}</p>` : '<div class="pt-q-lines" aria-hidden="true"></div>';
  const src = wiz.print.showSource ? `<p class="pt-q-src">${esc(sourceOf(wiz, state, it))}</p>` : '';
  const ans = wiz.print.answerAt === 'below' ? `<p class="pt-q-answer">정답 ${esc(answerText(it))}</p>` : '';
  return `<section class="pt-q"><p class="pt-q-stem"><b>${n}.</b> ${rich(it.stem)}</p>${choices}${src}${ans}</section>`;
}

// 발문에 지문을 통째로 다시 실은 문항(빈칸 · 순서 · 어법 변형 등)은 원래 지문을 따로 찍지 않는다.
function selfContained(it, unit) {
  return !unit?.passage || String(it.stem).length > unit.passage.length * 0.5;
}

// 같은 지문을 쓰는 연속 문항을 묶어 '[1~2] 다음 글을 읽고 물음에 답하시오.' + 지문을 한 번만 찍는다.
function blocks(wiz, state) {
  const units = unitsOf(wiz, state);
  const out = [];
  wiz.items.forEach((it, i) => {
    const unit = units.find((u) => u.unitKey === `${it.paperId}/${it.unitId}`);
    const last = out[out.length - 1];
    if (selfContained(it, unit)) out.push({ unit: null, items: [[it, i + 1]] });
    else if (last?.unit && last.unit === unit) last.items.push([it, i + 1]);
    else out.push({ unit, items: [[it, i + 1]] });
  });
  return out;
}

function paperSheet(wiz, state) {
  const head = `<header class="pt-sheet__head"><h2>${esc(titleOf(wiz))}</h2>${wiz.print.showNameBox ? '<p class="pt-sheet__name">학원 ____________ · 이름 ____________ · 점수 ______</p>' : ''}</header>`;
  const body = blocks(wiz, state).map((b) => {
    const qs = b.items.map(([it, n]) => question(wiz, state, it, n)).join('');
    if (!b.unit) return qs;
    const a = b.items[0][1];
    const z = b.items[b.items.length - 1][1];
    const range = a === z ? `[${a}]` : `[${a}~${z}]`;
    return `<section class="pt-q pt-q--passage"><p class="pt-q-lead">${range} 다음 글을 읽고 물음에 답하시오.</p><div class="pt-q-passage">${rich(b.unit.passage)}</div></section>${qs}`;
  }).join('');
  return `<div class="pt-sheet">${head}<div class="pt-sheet__body" style="column-count:${wiz.print.cols}">${body}</div></div>`;
}

function answerSheet(wiz) {
  const rows = wiz.items.map((it, i) => `<section class="pt-q"><p class="pt-q-stem"><b>${i + 1}.</b> 정답 ${esc(answerText(it))}</p>
    <p>${rich(it.explanation)}</p>${it.rubric?.length ? `<p><b>채점 기준</b> ${it.rubric.map((r) => `${esc(r.criterion)} (${r.point}점)`).join(' · ')}</p>` : ''}</section>`).join('');
  return `<div class="pt-sheet pt-sheet--answers"><header class="pt-sheet__head"><h2>${esc(titleOf(wiz))} · 정답 · 해설</h2></header><div class="pt-sheet__body" style="column-count:1">${rows}</div></div>`;
}

export function view(wiz, state) {
  const p = wiz.print;
  const seg = (a, opts, cur) => `<div class="cl-segmented pt-seg" role="group">${opts.map(([v, l]) => `<button type="button" class="cl-segmented__item" data-a="${a}" data-v="${v}" aria-pressed="${String(cur) === String(v)}">${l}</button>`).join('')}</div>`;
  const dist = answerDistribution(wiz.items);
  const distLine = `${Object.entries(dist).map(([k, n]) => `${CIRCLED[k - 1]} ${n}`).join(' · ')}`;
  const settings = `<div class="cl-card pt-panel pt-print-settings">
    <label class="pt-field">시험지 제목<input class="cl-input" data-a="title" value="${esc(wiz.title)}" placeholder="${esc(titleOf(wiz))}"></label>
    <div class="pt-row"><span class="pt-label">단</span>${seg('cols', [[1, '1단'], [2, '2단']], p.cols)}</div>
    <div class="pt-row"><span class="pt-label">정답</span>${seg('answer-at', [['sheet', '별지'], ['below', '문항 아래'], ['none', '빼기']], p.answerAt)}</div>
    <label class="cl-check"><input type="checkbox" data-a="show-source" ${p.showSource ? 'checked' : ''}> 출처 표시</label>
    <label class="cl-check"><input type="checkbox" data-a="show-name" ${p.showNameBox ? 'checked' : ''}> 학원명 · 이름 칸</label>
    <div class="pt-dist"><span class="pt-label">정답 분포</span> ${distLine}
      ${needsShuffle(wiz.items) ? '<p class="pt-sub">한 번호에 정답이 몰려 있어요.</p><button type="button" class="cl-btn cl-btn--tint cl-btn--sm" data-a="shuffle">정답 위치 섞기</button>' : ''}</div>
    <div class="pt-actions pt-actions--col"><button type="button" class="cl-btn cl-btn--ghost" data-a="print">인쇄 / PDF 저장</button><button type="button" class="cl-btn cl-btn--primary" data-a="save-done">저장하고 목록으로</button></div></div>`;
  const tabs = `<div class="cl-tabs" role="tablist">${[['paper', '문제지'], ['answers', '정답 · 해설지']].map(([k, l]) => `<button type="button" class="cl-tab" role="tab" data-a="sheet" data-v="${k}" aria-selected="${p.sheet === k}">${l}</button>`).join('')}</div>`;
  return `<div class="pt-print">${settings}<div class="pt-preview">${tabs}${p.sheet === 'answers' ? answerSheet(wiz) : paperSheet(wiz, state)}</div></div>`;
}

function printNow(wiz, state) {
  let root = document.getElementById('print-root');
  if (!root) { root = document.createElement('div'); root.id = 'print-root'; document.body.appendChild(root); }
  root.innerHTML = paperSheet(wiz, state) + (wiz.print.answerAt === 'sheet' ? answerSheet(wiz) : '');
  window.print();
}

export function onAction(a, el, wiz, state) {
  const p = wiz.print;
  const v = el.dataset.v;
  if (a === 'cols') p.cols = Number(v);
  else if (a === 'answer-at') p.answerAt = v;
  else if (a === 'sheet') p.sheet = v;
  else if (a === 'shuffle') { wiz.items = shuffleAnswers(wiz.items, wiz.items.length + 1); toast('정답 위치를 섞었어요. 해설 번호도 함께 바꿨어요'); }
  else if (a === 'print') return printNow(wiz, state);
  else if (a === 'save-done') {
    saveDraft(wiz, state, 'done');
    state.ui.wiz = null;
    location.hash = '#/exams';
    return toast('저장했어요');
  } else return undefined;
  return render();
}

export function onInput(a, el, wiz) {
  if (a === 'title') { wiz.title = el.value; return rerenderKeepFocus(); }
  if (a === 'show-source') wiz.print.showSource = el.checked;
  if (a === 'show-name') wiz.print.showNameBox = el.checked;
  return render();
}
