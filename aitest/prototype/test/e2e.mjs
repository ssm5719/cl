// 화면 시나리오 검사. 사용: node test/e2e.mjs [--base aitest/prototype/]
// 저장소 루트를 http.server 로 띄우고 Playwright 로 누른다. 페이지 오류가 하나라도 나면 실패.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const argBase = process.argv.indexOf('--base');
const BASE = argBase > 0 ? process.argv[argBase + 1] : 'aitest/prototype/';
const PORT = 8099;
const URL0 = `http://127.0.0.1:${PORT}/${BASE.replace(/^\/|\/?$/g, '')}/`;

const scenarios = [];
export const step = (name, fn) => scenarios.push({ name, fn });

function assert(cond, msg) { if (!cond) throw new Error(msg); }
async function noHScroll(page) {
  return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
}
// 화면 그리기는 hashchange 뒤에 일어나므로 바로 확인하지 말고 기다린다.
async function see(page, selector, timeout = 3000) {
  await page.waitForSelector(selector, { timeout, state: 'visible' });
}
async function open(page, hash = '') {
  await page.goto(URL0 + hash);
  await page.waitForSelector('#app > *');
}
const ctx = { assert, noHScroll, open, see };

// ---------------------------------------------------------------- 시나리오

step('사이드바로 보관함 · 출제 화면 이동', async (page) => {
  await open(page);
  await page.click('.cl-ws-nav >> text=시험 보관함');
  assert(page.url().endsWith('#/library'), `주소가 #/library 가 아님: ${page.url()}`);
  await see(page, 'h1:has-text("시험 보관함")');
  await page.click('.cl-ws-nav >> text=시험 출제');
  assert(page.url().endsWith('#/exams'), '주소가 #/exams 가 아님');
  await page.waitForSelector('.cl-ws-nav [data-nav="exams"][aria-current="page"]', { timeout: 2000 });
});

step('세 너비에서 가로 스크롤 없음', async (page) => {
  for (const w of [1440, 1024, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const h of ['#/exams', '#/library', '#/new']) {
      await open(page, h);
      assert(await noHScroll(page), `${w}px ${h} 에서 가로 스크롤`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
});


step('보관함: 과목 필터 · 지문별 보기 · 함께 보기', async (page) => {
  await open(page, '#/library');
  await see(page, 'td >> text=2026 내신 대비 예시 · 고2 영어');
  assert(await page.isVisible('td >> text=함께 보기'), '남이 올린 시험지에 함께 보기 없음');
  await page.click('[data-a="lib-subject"][data-v="국어"]');
  await page.waitForSelector('td >> text=2026 내신 대비 예시 · 고2 영어', { state: 'detached' });
  await page.click('[data-a="lib-subject"][data-v="전체"]');
  await page.click('[data-a="lib-view"][data-v="unit"]');
  await see(page, 'text=그림 필요');
});

step('보관함: 시험지 상세에서 이 지문으로 만들기', async (page) => {
  await open(page, '#/library');
  await page.click('a >> text=2026 내신 대비 예시 · 고2 영어');
  await see(page, 'h1:has-text("2026 내신 대비 예시 · 고2 영어")');
  assert(page.url().includes('#/library/s-en'), page.url());
  assert(await page.isVisible('.cl-badge >> text=그림 필요'), '그림 지문 배지 없음');
  await page.click('[data-a="make-unit"] >> nth=0');
  await page.waitForFunction(() => location.hash.startsWith('#/new?units='));
});

step('보관함: 시험지 올리기 → 나누기 결과 확인 → 저장', async (page) => {
  await open(page, '#/library');
  await page.click('[data-a="go-upload"]');
  await see(page, 'h1:has-text("시험지 올리기")');
  await page.click('[data-a="up-file"] >> nth=0');
  await page.click('[data-a="up-start"]');
  await see(page, 'text=지문을 나누고 있어요');
  await see(page, 'h2:has-text("나누기 결과 확인")', 5000);
  assert(await page.isVisible('.cl-badge >> text=그림 필요'), '그림 필요 배지 없음');
  await page.click('[data-a="up-edit"] >> nth=0');
  await see(page, '.pt-toast >> text=데모에서는 보기만 돼요');
  await page.click('[data-a="up-save"]');
  await page.waitForFunction(() => location.hash.startsWith('#/library/'));
});

step('보관함: 지문 추가 → 직접 추가 행', async (page) => {
  await open(page, '#/library');
  await page.click('[data-a="add-passage"]');
  await page.fill('[data-a="ap-title"]', '교과서 3과 본문');
  await page.fill('[data-a="ap-text"]', 'Reading opens doors to new worlds. It helps us understand people who are different from us.');
  await page.click('[data-a="ap-save"]');
  await see(page, 'td >> text=교과서 3과 본문');
  assert(await page.isVisible('td >> text=직접 추가'), '종류 직접 추가 없음');
});

// ---------------------------------------------------------------- 실행

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const browser = await chromium.launch();
let failed = 0;
try {
  for (const s of scenarios) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('dialog', (d) => d.accept());
    try {
      await s.fn(page, ctx);
      if (errors.length) throw new Error('페이지 오류: ' + errors.join(' | '));
      console.log(`ok   ${s.name}`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${s.name}\n     ${e.message.split('\n')[0]}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
console.log(failed ? `${failed} failed` : 'ok');
process.exit(failed ? 1 : 0);
