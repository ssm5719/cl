import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../js/store.js';

function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
const exam = (id, extra = {}) => ({ id, title: '9월 변형', subject: '영어', status: 'done', items: [], ...extra });

test('저장한 시험지는 다시 열어도 남는다', () => {
  const s = memoryStorage();
  createStore(s).saveExam(exam('e1'));
  assert.deepEqual(createStore(s).listExams().map((e) => e.id), ['e1']);
  assert.equal(createStore(s).persistent, true);
});

test('같은 id 로 저장하면 덮어쓴다', () => {
  const st = createStore(memoryStorage());
  st.saveExam(exam('e1'));
  st.saveExam(exam('e1', { title: '고침' }));
  assert.equal(st.listExams().length, 1);
  assert.equal(st.getExam('e1').title, '고침');
});

test('저장소가 막혀 있어도 메모리로 동작하고 예외를 던지지 않는다', () => {
  const st = createStore(blocked);
  assert.equal(st.persistent, false);
  st.saveExam(exam('e1'));
  assert.equal(st.listExams().length, 1);
});

test('복사하면 제목에 (복사)를 붙이고 작성 중으로', () => {
  const st = createStore(memoryStorage());
  st.saveExam(exam('e1'));
  const c = st.copyExam('e1');
  assert.equal(c.title, '9월 변형 (복사)');
  assert.equal(c.status, 'draft');
  assert.notEqual(c.id, 'e1');
  assert.ok(c.createdAt, '복사본에도 만든 날이 있어야 함');
  assert.equal(st.listExams().length, 2);
});

test('삭제 · 붙여 넣은 지문 · 처음으로', () => {
  const st = createStore(memoryStorage());
  st.saveExam(exam('e1'));
  st.deleteExam('e1');
  assert.equal(st.listExams().length, 0);
  st.savePasted({ id: 'x1', title: '교과서 3과' });
  assert.equal(st.listPasted().length, 1);
  st.reset();
  assert.equal(st.listPasted().length, 0);
});
