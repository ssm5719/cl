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

// ---------------------------------------------------------------- 실행

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 700));
const browser = await chromium.launch();
let failed = 0;
try {
  for (const s of scenarios) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
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
