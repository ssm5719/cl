import { test } from 'node:test';
import assert from 'node:assert/strict';
import { route, href } from '../js/app.js';

// 아티팩트 링크에는 '#이름'(영문 · 숫자 · 하이픈)만 통한다. '#/경로' 나 '?쿼리'를 쓰지 않는다.
test('빈 주소는 만든 시험지 목록', () => {
  assert.equal(route('').name, 'exams');
  assert.equal(route('#exams').name, 'exams');
});

test('시험지 상세 주소에서 시험지 id 를 꺼낸다 (id 에 하이픈이 있어도)', () => {
  const r = route('#paper-r-en');
  assert.equal(r.name, 'paper');
  assert.deepEqual(r.params, { paperId: 'r-en' });
});

test('이어서 고치기 주소에서 시험지 id 를 꺼낸다', () => {
  const r = route('#new-e9');
  assert.equal(r.name, 'new');
  assert.deepEqual(r.params, { examId: 'e9' });
  assert.deepEqual(route('#new').params, {});
});

test('보관함 · 올리기 주소', () => {
  assert.equal(route('#library').name, 'library');
  assert.equal(route('#upload').name, 'upload');
});

test('주소 만들기는 하이픈 이름만 쓴다', () => {
  assert.equal(href('paper', 'r-en'), '#paper-r-en');
  assert.equal(href('new', 'e9'), '#new-e9');
  assert.equal(href('library'), '#library');
  for (const h of [href('paper', 'r-en'), href('new', 'e9'), href('exams')]) assert.match(h, /^#[A-Za-z0-9-]+$/);
});

test('검사용으로 #new 뒤 쿼리는 계속 읽는다(로컬 테스트 전용)', () => {
  assert.equal(route('#new?paper=s-en').query.paper, 's-en');
});
