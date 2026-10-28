// 문항 배분 계산과 generate(). 화면은 generate() 한 함수만 부른다.
// 1차(데모)는 미리 만든 문항 풀에서 꺼내고, 2차에는 이 함수 안쪽만 AI 호출로 바꾼다.
import { GROUPS, groupOf, TEXT, CIRCLED } from './constants.js';

export function countSummary({ units, mode, perUnit, total }) {
  if (mode === 'total') return `지문 ${units}개 · 총 ${total}문항`;
  return `지문 ${units}개 × ${perUnit}문항 = ${units * perUnit}문항`;
}

export function allocate(unitKeys, settings) {
  const out = {};
  const n = unitKeys.length;
  unitKeys.forEach((k, i) => {
    if (settings.countMode === 'total') {
      const t = Math.max(0, Math.floor(settings.total || 0));
      out[k] = Math.floor(t / n) + (i < t % n ? 1 : 0);
    } else if (settings.countMode === 'custom') {
      out[k] = Math.max(0, Math.floor((settings.custom || {})[k] || 0));
    } else {
      out[k] = settings.perUnit;
    }
  });
  return out;
}

// 지문마다 고른 묶음을 돌려 쓴다. 시작점을 지문마다 하나씩 밀어 시험지 전체에서 섞이게 한다.
export function planDistribution(units, settings, subject) {
  const counts = allocate(units.map((u) => u.unitKey), settings);
  const chosen = settings.groups || [];
  const slots = [];
  units.forEach((u, i) => {
    const fitting = chosen.filter((key) => groupOf(subject, key)?.fits(u));
    const changed = fitting.length === 0;
    const pool = changed ? [GROUPS[subject].find((g) => g.fits(u)).key] : fitting;
    for (let j = 0; j < counts[u.unitKey]; j++) {
      const group = pool[(i + j) % pool.length];
      const subs = (settings.subtypes || {})[group] || [];
      const subtype = subs.length ? subs[(i + j) % subs.length] : null;
      slots.push({ unitKey: u.unitKey, group, subtype, changed });
    }
  });
  return slots;
}

const isObjective = (it) => (it.choices || []).length >= 4 && it.answer > 0;
const isPosition = (it) => it.choices.every((c) => CIRCLED.includes(String(c).trim()));
// 해설의 ①~⑤ 가 선택지가 아니라 발문의 밑줄 표시를 가리키거나(어법 개수 등), 선택지 순서가 정해진 문항(1개~5개, (A)-(B)-(C) 순서)은 섞지 않는다.
const ORDERED = /^\s*(\d+\s*개|\([A-E]\)(\s*[-–]\s*\([A-E]\))+)\s*$/;
const keepOrder = (it) => /[①②③④⑤]/.test(String(it.stem || '')) || it.choices.every((c) => ORDERED.test(String(c)));

export function answerDistribution(items) {
  const d = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  items.filter(isObjective).forEach((it) => { if (d[it.answer] !== undefined) d[it.answer]++; });
  return d;
}

export function needsShuffle(items) {
  const n = items.filter(isObjective).length;
  if (!n) return false;
  return Math.max(...Object.values(answerDistribution(items))) / n > 0.4;
}

// 정답 선택지를 목표 위치와 맞바꾸고, 해설 속 두 번호도 맞바꾼다.
export function shuffleAnswers(items, seed) {
  let k = 0;
  return items.map((it) => {
    if (!isObjective(it) || isPosition(it) || keepOrder(it)) return it;
    const len = it.choices.length;
    const target = ((k++ + seed) % len) + 1;
    if (target === it.answer) return it;
    const a = it.answer - 1;
    const b = target - 1;
    const choices = it.choices.slice();
    [choices[a], choices[b]] = [choices[b], choices[a]];
    const explanation = String(it.explanation || '').replace(/[①②③④⑤]/g, (c) =>
      c === CIRCLED[a] ? CIRCLED[b] : c === CIRCLED[b] ? CIRCLED[a] : c);
    return { ...it, choices, answer: target, explanation };
  });
}

let seq = 0;
const keyOf = (it) => `${it.paperId}/${it.unitId}`;

export async function generate(units, settings, subject, pool, exclude = []) {
  const slots = planDistribution(units, settings, subject);
  const used = new Set(exclude);
  const byKey = Object.fromEntries(units.map((u) => [u.unitKey, u]));
  const items = [];
  const notes = [];
  for (const slot of slots) {
    const free = pool.filter((it) => keyOf(it) === slot.unitKey && !used.has(it.id));
    const exact = free.filter((it) => it.group === slot.group);
    // 서술형은 형태와 관계없다. 객관식은 고른 형태(5지 · 4지 · OX)가 같은 문항을 먼저 쓴다.
    const formOk = (it) => !settings.form || it.form === '서답' || it.form === settings.form;
    const pick = exact.find((it) => formOk(it) && (!slot.subtype || it.subtype === slot.subtype))
      || exact.find(formOk) || exact[0] || free.find(formOk) || free[0];
    if (!pick) {
      const msg = TEXT.noDemoItems(byKey[slot.unitKey].numbers);
      if (!notes.includes(msg)) notes.push(msg);
      continue;
    }
    used.add(pick.id);
    const flags = [...(pick.flags || [])];
    if (slot.changed && !flags.includes('type_changed')) flags.push('type_changed');
    items.push({
      ...pick, id: `g${Date.now().toString(36)}${++seq}`, poolId: pick.id, flags,
      note: exact.includes(pick) && formOk(pick) ? pick.note : TEXT.demoSubstitute,
    });
  }
  await new Promise((r) => setTimeout(r, 0));
  return { items, notes };
}
