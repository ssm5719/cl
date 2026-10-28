import { test } from 'node:test';
import assert from 'node:assert/strict';
import { route } from '../js/app.js';

test('빈 주소는 만든 시험지 목록', () => {
  assert.equal(route('').name, 'exams');
});

test('시험지 상세 주소에서 시험지 id 를 꺼낸다', () => {
  assert.deepEqual(route('#/library/p1').params, { paperId: 'p1' });
  assert.equal(route('#/library/p1').name, 'paper');
});

test('이어서 고치기 주소에서 시험지 id 를 꺼낸다', () => {
  const r = route('#/new/e9');
  assert.equal(r.name, 'new');
  assert.deepEqual(r.params, { examId: 'e9' });
});

test('쿼리를 객체로 꺼낸다', () => {
  assert.equal(route('#/new?paper=p1').query.paper, 'p1');
  assert.equal(route('#/new?paper=p1').name, 'new');
});
