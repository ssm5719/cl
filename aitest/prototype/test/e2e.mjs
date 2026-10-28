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


const barText = (page) => page.textContent('.pt-bar__summary');

step('① 자료: 전체 선택은 그림 지문을 빼고, 0개면 다음 비활성', async (page) => {
  await open(page, '#/new?paper=s-en');
  await see(page, '.pt-steps [aria-current="step"] >> text=자료');
  assert(await page.isDisabled('[data-a="wiz-next"]'), '고른 지문이 없는데 다음이 켜져 있음');
  await page.click('[data-a="src-all"]');
  assert((await barText(page)).includes('고른 지문 4개'), await barText(page));
  assert(await page.isDisabled('[data-unit="s-en/u03"] input'), '그림 지문 체크박스가 켜져 있음');
  await see(page, '[data-unit="s-en/u03"] >> text=그림이 있어 자동 출제에서 빠져요');
  assert(!(await page.isDisabled('[data-a="wiz-next"]')), '다음이 꺼져 있음');
});

step('① 자료: 주소로 고른 지문 · 바구니에서 빼고 되돌리기', async (page) => {
  await open(page, '#/new?units=s-en/u02');
  await see(page, '.pt-basket >> text=22번');
  assert((await barText(page)).includes('고른 지문 1개'), await barText(page));
  await page.click('.pt-basket [data-a="basket-remove"]');
  assert((await barText(page)).includes('고른 지문 0개'), '빼기 안 됨');
  await page.click('[data-a="basket-undo"]');
  assert((await barText(page)).includes('고른 지문 1개'), '되돌리기 안 됨');
});

step('① 자료: 지문 붙여넣기 · 권리 확인은 처음 한 번만 · 작성 중 저장', async (page) => {
  await open(page, '#/new');
  await page.click('[data-a="src-tab"][data-v="paste"]');
  await page.fill('[data-a="paste-title"] >> nth=0', '교과서 1과');
  await page.fill('[data-a="paste-text"] >> nth=0', 'Good habits are built one small step at a time.');
  await page.click('[data-a="paste-add"]');
  await page.fill('[data-a="paste-title"] >> nth=1', '교과서 2과');
  await page.fill('[data-a="paste-text"] >> nth=1', 'Curiosity makes learning feel like play.');
  assert(await page.isDisabled('[data-a="wiz-next"]'), '권리 확인 전에 다음이 켜져 있음');
  await page.check('[data-a="rights"]');
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=방식');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('cl-exam-proto:exams') || '[]'));
  assert(saved.some((e) => e.status === 'draft'), '작성 중 시험지가 저장되지 않음');
  await open(page, '#/exams');
  await open(page, '#/new');
  await page.click('[data-a="src-tab"][data-v="paste"]');
  assert(!(await page.isVisible('[data-a="rights"]')), '두 번째에도 권리 확인을 받음');
});


async function toMethod(page, units = 's-en/u01,s-en/u02,s-en/u04') {
  await open(page, `#/new?units=${units}`);
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=방식');
}

step('② 방식: 묶음 칩 · 지문당 문항 수 · 세부 유형 · 형태 · 규칙', async (page) => {
  await toMethod(page);
  await see(page, '[data-a="grp"][data-v="original"]');
  await page.click('[data-a="grp"][data-v="original"]');
  await page.click('[data-a="grp"][data-v="main"]');
  await page.click('[data-a="grp"][data-v="blank"]');
  await page.click('[data-a="per-unit"][data-v="2"]');
  assert((await barText(page)).includes('지문 3개 × 2문항 = 6문항'), await barText(page));
  await page.click('[data-a="sub-toggle"]');
  for (const t of ['주제', '제목', '요지', '주장', '목적']) await see(page, `[data-sub-group="main"] >> text=${t}`);
  await page.click('[data-a="form"][data-v="OX"]');
  assert(await page.isDisabled('[data-a="grp"][data-v="writing"]'), 'OX 인데 서술형이 켜져 있음');
  for (const r of ['원래 문항의 정답이 새 문항에 드러나지 않게', '정답 번호 고르게', '고른 지문 안에서만 출제']) await see(page, `text=${r}`);
});

step('② 방식: 총 문항 수 · 지문별 개수 · 자세히 설정', async (page) => {
  await toMethod(page);
  await page.click('[data-a="count-mode"][data-v="total"]');
  await page.fill('[data-a="total"]', '2');
  assert((await barText(page)).includes('지문 3개 · 총 2문항'), await barText(page));
  await see(page, '.pt-alloc >> text=18번 1');
  await page.fill('[data-a="total"]', '0');
  assert(await page.isDisabled('[data-a="wiz-next"]'), '총 0문항인데 문제 만들기가 켜져 있음');
  await page.click('[data-a="count-mode"][data-v="custom"]');
  await page.fill('[data-a="custom"][data-v="s-en/u01"]', '3');
  assert((await barText(page)).includes('총 7문항'), await barText(page));
  await page.click('[data-a="more-toggle"]');
  await see(page, '[data-a="choice-lang"]');
  assert(await page.getAttribute('[data-a="request"]', 'maxlength') === '200', '직접 요청 200자 제한 없음');
});

step('② 방식: 붙여 넣은 지문만이면 원래 유형 그대로 비활성', async (page) => {
  await page.goto('about:blank');
  await open(page, '#/new');
  await page.click('[data-a="src-tab"][data-v="paste"]');
  await page.fill('[data-a="paste-title"]', '교과서 1과');
  await page.fill('[data-a="paste-text"]', 'Good habits are built one small step at a time.');
  if (await page.isVisible('[data-a="rights"]')) await page.check('[data-a="rights"]');
  await page.click('[data-a="wiz-next"]');
  assert(await page.isDisabled('[data-a="grp"][data-v="original"]'), '원래 유형 그대로가 켜져 있음');
  await see(page, 'text=붙여 넣은 지문에는 원래 유형이 없어요');
});

step('② 방식: 문제 만들기 → 진행 → ③ 검토', async (page) => {
  await toMethod(page);
  await page.click('[data-a="wiz-next"]');
  await see(page, 'text=/지문 3개 중 \\d개 완료/');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토', 6000);
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
