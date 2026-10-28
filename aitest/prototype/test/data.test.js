import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { GROUPS, FLAGS, KINDS, GRADES, SUBJECTS } from '../js/constants.js';

const files = ['sample', 'real'].map((n) => new URL(`../data/${n}.json`, import.meta.url)).filter((u) => existsSync(u));

test('예시 데이터 파일이 있다', () => {
  assert.ok(files.some((u) => u.pathname.endsWith('sample.json')));
});

for (const url of files) {
  const name = url.pathname.split('/').pop();
  const data = JSON.parse(readFileSync(url, 'utf8'));
  const papers = Object.fromEntries(data.papers.map((p) => [p.id, p]));

  test(`${name}: 시험지 정보가 정해진 값 안에 있다`, () => {
    for (const p of data.papers) {
      assert.ok(SUBJECTS.includes(p.subject), p.id);
      assert.ok(KINDS.includes(p.kind), `${p.id} kind ${p.kind}`);
      assert.ok(GRADES.includes(p.grade), p.id);
      for (const u of p.units) assert.ok(['독서', '문학', '기타'].includes(u.genre), `${p.id}/${u.id} genre`);
    }
  });

  test(`${name}: 문항 풀은 있는 지문을 가리키고 형식이 맞다`, () => {
    for (const it of data.pool) {
      const paper = papers[it.paperId];
      assert.ok(paper, `${it.id} paper`);
      const unit = paper.units.find((u) => u.id === it.unitId);
      assert.ok(unit, `${it.id} unit`);
      assert.ok(!unit.has_figure, `${it.id}: 그림 지문에는 풀 문항이 없어야 함`);
      assert.ok(it.group === 'original' || GROUPS[paper.subject].some((g) => g.key === it.group), `${it.id} group ${it.group}`);
      assert.ok(it.flags.every((f) => f in FLAGS), `${it.id} flags`);
      if (it.form === '서답') {
        assert.equal(it.answer, 0, it.id);
        assert.ok(it.answer_text && it.rubric.length > 0, `${it.id} 서답 모범 답 · 채점 기준`);
      } else {
        const n = { '5지': 5, '4지': 4, OX: 2 }[it.form];
        assert.equal(it.choices.length, n, `${it.id} choices`);
        assert.ok(it.answer >= 1 && it.answer <= n, `${it.id} answer`);
      }
    }
  });
}
