import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GROUPS, FLAGS, RULES } from '../js/constants.js';
import {
  countSummary, allocate, planDistribution, answerDistribution, needsShuffle, shuffleAnswers, generate,
} from '../js/generator.js';

const unit = (id, extra = {}) => ({ paperId: 'p', id, unitKey: `p/${id}`, numbers: id.slice(1), type_label: '글의 요지', genre: '기타', passage: 'x', ...extra });
const mc = (id, answer, extra = {}) => ({
  id, paperId: 'p', unitId: 'u1', group: 'main', subtype: '요지', form: '5지', stem: 'Q',
  choices: ['가', '나', '다', '라', '마'], answer, answer_text: '', explanation: `${'①②③④⑤'[answer - 1]}이 정답이다. ①은 오답이다.`,
  evidence: [], rubric: [], flags: [], ...extra,
});

test('묶음 키는 설계 문서 표 그대로', () => {
  assert.deepEqual(GROUPS.영어.map((g) => g.key), ['main', 'detail', 'blank', 'flow', 'summary', 'grammar', 'writing']);
  assert.deepEqual(GROUPS.국어.map((g) => g.key), ['fact', 'infer', 'apply', 'vocab', 'lit', 'writing']);
  assert.equal(FLAGS.answer_leak, '원래 정답 노출 의심');
  assert.equal(RULES.length, 3);
});

test('문항 수 요약 글', () => {
  assert.equal(countSummary({ units: 8, mode: 'perUnit', perUnit: 2 }), '지문 8개 × 2문항 = 16문항');
  assert.equal(countSummary({ units: 8, mode: 'total', total: 3 }), '지문 8개 · 총 3문항');
});

test('총 문항 수가 지문 수보다 적으면 앞 지문부터 1개씩', () => {
  const r = allocate(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], { countMode: 'total', total: 3 });
  assert.deepEqual(Object.values(r), [1, 1, 1, 0, 0, 0, 0, 0]);
});

test('총 10문항을 지문 4개에 나누면 3 · 3 · 2 · 2', () => {
  assert.deepEqual(Object.values(allocate(['a', 'b', 'c', 'd'], { countMode: 'total', total: 10 })), [3, 3, 2, 2]);
});

test('지문별 개수 모드는 정한 값, 안 정한 지문은 0', () => {
  assert.deepEqual(allocate(['a', 'b'], { countMode: 'custom', custom: { a: 2 } }), { a: 2, b: 0 });
});

test('묶음 두 개 · 지문당 2문항이면 지문마다 두 묶음이 하나씩', () => {
  const slots = planDistribution([unit('u1'), unit('u2')], { groups: ['main', 'blank'], countMode: 'perUnit', perUnit: 2, subtypes: {} }, '영어');
  for (const k of ['p/u1', 'p/u2']) {
    assert.deepEqual(slots.filter((s) => s.unitKey === k).map((s) => s.group).sort(), ['blank', 'main']);
  }
});

test('안내문에는 글의 흐름이 맞지 않아 다른 묶음으로 바꾸고 표시', () => {
  const slots = planDistribution([unit('u1', { type_label: '안내문' })], { groups: ['flow'], countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어');
  assert.equal(slots[0].changed, true);
  assert.equal(slots[0].group, 'main');
});

test('독서 지문에 표현 · 감상만 고르면 사실적 읽기로 바꿈', () => {
  const slots = planDistribution([unit('u1', { genre: '독서' })], { groups: ['lit'], countMode: 'perUnit', perUnit: 2, subtypes: {} }, '국어');
  assert.ok(slots.every((s) => s.changed && s.group === 'fact'));
});

test('풀에 맞는 묶음 문항이 없으면 같은 지문 다른 문항으로 대신하고 데모 문구', async () => {
  const pool = [mc('i1', 1, { group: 'detail' })];
  const { items } = await generate([unit('u1')], { groups: ['main'], countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어', pool);
  assert.equal(items.length, 1);
  assert.equal(items[0].note, '데모: 미리 만든 문항으로 대신 보여 줘요');
  assert.equal(items[0].poolId, 'i1');
});

test('풀이 전혀 없는 지문은 빠지고 알림 문구', async () => {
  const pool = [mc('i1', 1)];
  const { items, notes } = await generate([unit('u1'), unit('u9')], { groups: ['main'], countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어', pool);
  assert.equal(items.length, 1);
  assert.deepEqual(notes, ['9번은 데모 문항이 없어요']);
});

test('같은 풀 문항은 두 번 쓰지 않는다', async () => {
  const pool = [mc('i1', 1), mc('i2', 2)];
  const { items } = await generate([unit('u1')], { groups: ['main'], countMode: 'perUnit', perUnit: 3, subtypes: {} }, '영어', pool);
  assert.deepEqual(items.map((i) => i.poolId), ['i1', 'i2']);
});

test('유형을 바꾼 자리의 문항에는 유형 바꿈 표시', async () => {
  const pool = [mc('i1', 1)];
  const { items } = await generate([unit('u1', { type_label: '안내문' })], { groups: ['flow'], countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어', pool);
  assert.ok(items[0].flags.includes('type_changed'));
});

test('정답 한 번호가 40%를 넘으면 섞기 필요', () => {
  assert.equal(needsShuffle([mc('a', 2), mc('b', 2), mc('c', 2), mc('d', 1), mc('e', 3)]), true);
  assert.equal(needsShuffle([mc('a', 2), mc('b', 2), mc('c', 4), mc('d', 1), mc('e', 3)]), false);
  assert.deepEqual(answerDistribution([mc('a', 2), mc('b', 2)]), { 1: 0, 2: 2, 3: 0, 4: 0, 5: 0 });
});

test('정답 위치 섞기는 정답 글을 지키고 해설 번호도 바꾼다', () => {
  const items = [mc('a', 2), mc('b', 2), mc('c', 2), mc('d', 2), mc('e', 2)];
  const out = shuffleAnswers(items, 7);
  assert.equal(needsShuffle(out), false);
  out.forEach((it) => {
    assert.equal(it.choices[it.answer - 1], '나');
    assert.ok(it.explanation.startsWith(`${'①②③④⑤'[it.answer - 1]}이 정답이다.`));
  });
});

test('위치를 고르는 문항(선택지가 ①~⑤)은 섞지 않는다', () => {
  const pos = mc('p', 2, { choices: ['①', '②', '③', '④', '⑤'] });
  assert.deepEqual(shuffleAnswers([pos, pos, pos], 3).map((i) => i.answer), [2, 2, 2]);
});

test('고른 형태(OX)와 같은 풀 문항을 먼저 쓰고, 없으면 대신 쓰며 데모 문구', async () => {
  const pool = [mc('i1', 1), mc('i2', 1, { form: 'OX', choices: ['O', 'X'] })];
  const ox = await generate([unit('u1')], { groups: ['main'], form: 'OX', countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어', pool);
  assert.equal(ox.items[0].poolId, 'i2');
  const four = await generate([unit('u1')], { groups: ['main'], form: '4지', countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어', [mc('i1', 1)]);
  assert.equal(four.items[0].note, '데모: 미리 만든 문항으로 대신 보여 줘요');
});

test('다시 만들기는 이미 쓴 풀 문항을 빼고 고른다', async () => {
  const pool = [mc('i1', 1), mc('i2', 2)];
  const { items } = await generate([unit('u1')], { groups: ['main'], countMode: 'perUnit', perUnit: 1, subtypes: {} }, '영어', pool, ['i1']);
  assert.equal(items[0].poolId, 'i2');
});

test('정답 섞기: 발문에 ①~⑤ 표시가 있는 문항(어법 개수 등)은 해설 번호가 선택지가 아니라서 섞지 않는다', () => {
  const it = { id: 'g', stem: '밑줄 친 ①~⑤ 중 어법상 틀린 것의 개수는? ① went ② go ③ is ④ are ⑤ was', choices: ['1개', '2개', '3개', '4개', '5개'], answer: 2,
    explanation: '②와 ④가 틀렸다. ①③⑤는 맞다.' };
  const out = shuffleAnswers([it, it, it], 2);
  out.forEach((o) => { assert.equal(o.answer, 2); assert.equal(o.explanation, it.explanation); assert.deepEqual(o.choices, it.choices); });
});

test('정답 섞기: 순서가 정해진 선택지(1개~5개, (A)-(C)-(B) 순서)는 섞지 않는다', () => {
  const count = { id: 'c', stem: '틀린 것의 개수는?', choices: ['1개', '2개', '3개', '4개', '5개'], answer: 3, explanation: '세 곳이 틀렸다.' };
  const order = { id: 'o', stem: '주어진 글 다음에 이어질 순서로 가장 적절한 것은?', choices: ['(A)-(C)-(B)', '(B)-(A)-(C)', '(B)-(C)-(A)', '(C)-(A)-(B)', '(C)-(B)-(A)'], answer: 3, explanation: '③ 이 맞다.' };
  for (const seed of [1, 2, 3, 4]) {
    shuffleAnswers([count, order], seed).forEach((o, i) => assert.equal(o.answer, [count, order][i].answer));
  }
});
