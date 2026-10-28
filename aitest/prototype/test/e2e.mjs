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
const REAL = BASE.includes('dist');
// 예시 데이터 시나리오는 저장소 화면에서, 실제 데이터 시나리오는 dist(아티팩트 묶음)에서만 돈다.
export const step = (name, fn) => { if (!REAL) scenarios.push({ name, fn }); };
const realStep = (name, fn) => { if (REAL) scenarios.push({ name, fn }); };

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
  assert(page.url().endsWith('#library'), `주소가 #library 가 아님: ${page.url()}`);
  await see(page, 'h1:has-text("시험 보관함")');
  await page.click('.cl-ws-nav >> text=시험 출제');
  assert(page.url().endsWith('#exams'), '주소가 #exams 가 아님');
  await page.waitForSelector('.cl-ws-nav [data-nav="exams"][aria-current="page"]', { timeout: 2000 });
});

step('세 너비에서 가로 스크롤 없음', async (page) => {
  for (const w of [1440, 1024, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const h of ['#exams', '#library', '#new']) {
      await open(page, h);
      assert(await noHScroll(page), `${w}px ${h} 에서 가로 스크롤`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
});


step('보관함: 과목 필터 · 지문별 보기 · 함께 보기', async (page) => {
  await open(page, '#library');
  await see(page, 'td >> text=2026 내신 대비 예시 · 고2 영어');
  assert(await page.isVisible('td >> text=함께 보기'), '남이 올린 시험지에 함께 보기 없음');
  await page.click('[data-a="lib-subject"][data-v="국어"]');
  await page.waitForSelector('td >> text=2026 내신 대비 예시 · 고2 영어', { state: 'detached' });
  await page.click('[data-a="lib-subject"][data-v="전체"]');
  await page.click('[data-a="lib-view"][data-v="unit"]');
  await see(page, 'text=그림 필요');
});

step('보관함: 시험지 상세에서 이 지문으로 만들기', async (page) => {
  await open(page, '#library');
  await page.click('a >> text=2026 내신 대비 예시 · 고2 영어');
  await see(page, 'h1:has-text("2026 내신 대비 예시 · 고2 영어")');
  assert(page.url().includes('#paper-s-en'), page.url());
  assert(await page.isVisible('.cl-badge >> text=그림 필요'), '그림 지문 배지 없음');
  await page.click('[data-a="make-unit"] >> nth=0');
  await page.waitForFunction(() => location.hash === '#new');
  await see(page, '.pt-basket >> text=18번');
});

step('보관함: 시험지 올리기 → 나누기 결과 확인 → 저장', async (page) => {
  await open(page, '#library');
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
  await page.waitForFunction(() => location.hash.startsWith('#paper-'));
});

step('보관함: 지문 추가 → 직접 추가 행', async (page) => {
  await open(page, '#library');
  await page.click('[data-a="add-passage"]');
  await page.fill('[data-a="ap-title"]', '교과서 3과 본문');
  await page.fill('[data-a="ap-text"]', 'Reading opens doors to new worlds. It helps us understand people who are different from us.');
  await page.click('[data-a="ap-save"]');
  await see(page, 'td >> text=교과서 3과 본문');
  assert(await page.isVisible('td >> text=직접 추가'), '종류 직접 추가 없음');
});


const barText = (page) => page.textContent('.pt-bar__summary');

step('① 자료: 전체 선택은 그림 지문을 빼고, 0개면 다음 비활성', async (page) => {
  await open(page, '#new?paper=s-en');
  await see(page, '.pt-steps [aria-current="step"] >> text=자료');
  assert(await page.isDisabled('[data-a="wiz-next"]'), '고른 지문이 없는데 다음이 켜져 있음');
  await page.click('[data-a="src-all"]');
  assert((await barText(page)).includes('고른 지문 4개'), await barText(page));
  assert(await page.isDisabled('[data-unit="s-en/u03"] input'), '그림 지문 체크박스가 켜져 있음');
  await see(page, '[data-unit="s-en/u03"] >> text=그림이 있어 자동 출제에서 빠져요');
  assert(!(await page.isDisabled('[data-a="wiz-next"]')), '다음이 꺼져 있음');
});

step('① 자료: 주소로 고른 지문 · 바구니에서 빼고 되돌리기', async (page) => {
  await open(page, '#new?units=s-en/u02');
  await see(page, '.pt-basket >> text=22번');
  assert((await barText(page)).includes('고른 지문 1개'), await barText(page));
  await page.click('.pt-basket [data-a="basket-remove"]');
  assert((await barText(page)).includes('고른 지문 0개'), '빼기 안 됨');
  await page.click('[data-a="basket-undo"]');
  assert((await barText(page)).includes('고른 지문 1개'), '되돌리기 안 됨');
});

step('① 자료: 지문 붙여넣기 · 권리 확인은 처음 한 번만 · 작성 중 저장', async (page) => {
  await open(page, '#new');
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
  await open(page, '#exams');
  await open(page, '#new');
  await page.click('[data-a="src-tab"][data-v="paste"]');
  assert(!(await page.isVisible('[data-a="rights"]')), '두 번째에도 권리 확인을 받음');
});


async function toMethod(page, units = 's-en/u01,s-en/u02,s-en/u04') {
  await open(page, `#new?units=${units}`);
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
  await open(page, '#new');
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


async function toReview(page) {
  await open(page, '#new?units=s-en/u02,s-en/u04');
  await page.click('[data-a="wiz-next"]');
  await page.click('[data-a="grp"][data-v="original"]');
  for (const g of ['main', 'blank', 'writing']) await page.click(`[data-a="grp"][data-v="${g}"]`);
  await page.click('[data-a="per-unit"][data-v="3"]');
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토', 6000);
}

step('③ 검토: 요약 · 주의 문항이 맨 위 · 근거 강조 · 배지 · 대신 쓴 문항', async (page) => {
  await toReview(page);
  await see(page, '.pt-review-sum:has-text("6문항 · 주의 2")');
  const first = await page.getAttribute('.pt-ilist li >> nth=0', 'data-flagged');
  assert(first === '1', '첫 행이 주의 문항이 아님');
  await page.click('.pt-ilist [data-a="pick"] >> nth=0');
  assert(await page.isVisible('.pt-icard .cl-badge >> text=/다시 풀었더니 답이 다름|원래 정답 노출 의심/'), '주의 배지 없음');
  await see(page, '.pt-src mark');
  await page.click('[data-a="filter-todo"]');
  await page.click('[data-a="mark-done"]');
  assert(await page.locator('.pt-ilist li').count() === 5, '확인함 표시한 문항이 확인 필요 목록에서 빠지지 않음');
  await page.click('[data-a="filter-todo"]');
  await see(page, 'text=데모: 미리 만든 문항으로 대신 보여 줘요');
});

step('③ 검토: 고치기 · 다시 만들기 · 빼기 · 순서 · 서술형', async (page) => {
  await toReview(page);
  await page.click('[data-a="edit"]');
  await page.fill('[data-a="edit-stem"]', '고친 발문입니다');
  await page.click('[data-a="edit-save"]');
  await see(page, '.pt-icard >> text=고친 발문입니다');
  await page.click('[data-a="regen"]');
  await see(page, '.pt-toast:has-text("다시 만들었어요"), .pt-toast:has-text("더 만들 데모 문항이 없어요")');
  const firstId = await page.getAttribute('.pt-ilist li >> nth=0', 'data-id');
  await page.click('.pt-ilist li >> nth=0 >> [data-a="move-down"]');
  const ids = await page.$$eval('.pt-ilist li', (ls) => ls.map((l) => l.dataset.id));
  assert(ids[1] === firstId, `순서 바꾸기 안 됨: ${firstId} / ${ids.join(',')}`);
  await page.click('[data-a="remove"]');
  await see(page, '.pt-review-sum >> text=5문항');
  await page.click('.pt-ilist li:has-text("서술형") [data-a="pick"] >> nth=0');
  await see(page, '.pt-icard >> text=모범 답안');
  await see(page, '.pt-icard >> text=채점 기준');
});


// 원래 유형 그대로 · 지문당 1문항이면 예시 데이터에서 정답이 ③ ③ ② 로 몰린다.
async function toPrint(page) {
  await open(page, '#new?units=s-en/u01,s-en/u02,s-en/u04');
  await page.click('[data-a="wiz-next"]');
  await page.click('[data-a="per-unit"][data-v="1"]');
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토', 6000);
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=인쇄');
}
const cols = (page) => page.$eval('.pt-sheet__body', (el) => getComputedStyle(el).columnCount);

step('④ 인쇄: 탭 · 단 · 정답 위치 · 출처 · 정답 섞기 · 인쇄 호출', async (page) => {
  await toPrint(page);
  await page.click('[data-a="cols"][data-v="1"]');
  assert(await cols(page) === '1' || await cols(page) === 'auto', '1단이 아님');
  await page.click('[data-a="cols"][data-v="2"]');
  assert(await cols(page) === '2', '2단이 아님');
  await page.click('[data-a="answer-at"][data-v="below"]');
  await see(page, '.pt-sheet .pt-q-answer');
  await page.click('[data-a="answer-at"][data-v="none"]');
  assert(await page.locator('.pt-sheet .pt-q-answer').count() === 0, '정답 빼기가 안 됨');
  await see(page, '.pt-sheet >> text=2026 내신 대비 예시 · 고2 영어 22번 변형');
  await page.click('[data-a="sheet"][data-v="answers"]');
  await see(page, '.pt-sheet >> text=정답 · 해설');
  await see(page, '[data-a="shuffle"]');
  await page.click('[data-a="shuffle"]');
  await page.waitForSelector('[data-a="shuffle"]', { state: 'detached' });
  await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; });
  await page.click('[data-a="print"]');
  assert(await page.evaluate(() => window.__printed) === 1, '인쇄가 호출되지 않음');
});

step('만든 시험지 목록: 저장 · 다시 인쇄 · 이어서 고치기 · 복사 · 삭제 · 처음으로', async (page) => {
  await open(page, '#exams');
  await see(page, 'text=아직 만든 시험지가 없어요');
  await toPrint(page);
  await page.fill('[data-a="title"]', '10월 변형 1회');
  await page.click('[data-a="save-done"]');
  await page.waitForFunction(() => location.hash === '#exams');
  await see(page, 'tr:has-text("10월 변형 1회") >> text=완성');
  await page.click('tr:has-text("10월 변형 1회") [data-a="ex-print"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=인쇄');
  await open(page, '#exams');
  await page.click('tr:has-text("10월 변형 1회") [data-a="ex-edit"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토');
  await open(page, '#exams');
  await page.click('tr:has-text("10월 변형 1회") [data-a="ex-copy"]');
  await see(page, 'td >> text=10월 변형 1회 (복사)');
  await page.fill('[data-a="ex-q"]', '복사');
  assert(await page.locator('tbody tr').count() === 1, '검색이 안 됨');
  await page.fill('[data-a="ex-q"]', '');
  await page.click('tr:has-text("10월 변형 1회 (복사)") [data-a="ex-del"]');
  await see(page, 'tr:has-text("10월 변형 1회 (복사)") [data-a="ex-del"]:has-text("한 번 더 누르면 삭제")');
  await page.click('tr:has-text("10월 변형 1회 (복사)") [data-a="ex-del"]');
  await page.waitForSelector('td >> text=10월 변형 1회 (복사)', { state: 'detached' });
  await page.click('[data-a="demo-reset"]');
  await see(page, '[data-a="demo-reset"]:has-text("한 번 더 누르면 처음으로")');
  await page.click('[data-a="demo-reset"]');
  await see(page, 'text=아직 만든 시험지가 없어요');
});

step('모든 단계 · 세 너비에서 가로 스크롤 없음', async (page) => {
  for (const w of [1440, 1024, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await toPrint(page);
    assert(await noHScroll(page), `${w}px 인쇄 단계에서 가로 스크롤`);
    await page.click('[data-a="wiz-go"][data-v="3"]');
    assert(await noHScroll(page), `${w}px 검토 단계에서 가로 스크롤`);
    await page.click('[data-a="wiz-go"][data-v="2"]');
    assert(await noHScroll(page), `${w}px 방식 단계에서 가로 스크롤`);
  }
});


step('④ 인쇄: 지문은 같은 지문 문항 묶음마다 한 번만, [1~2] 머리말과 함께', async (page) => {
  await open(page, '#new?units=s-en/u01');
  await page.click('[data-a="wiz-next"]');
  await page.click('[data-a="grp"][data-v="detail"]');
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토', 6000);
  await page.click('[data-a="wiz-next"]');
  const text = await page.textContent('.pt-sheet');
  assert(text.split('Starting next Monday').length - 1 === 1, '지문이 한 번 인쇄되지 않음');
  assert(text.includes('[1~2] 다음 글을 읽고 물음에 답하시오.'), '[1~2] 머리말 없음');
});


// ---------------------------------------------------------------- 최종 리뷰에서 나온 경우

step('③ · ④ 에서 고친 내용은 새로 고쳐도 남는다', async (page) => {
  await toReview(page);
  await page.click('[data-a="remove"]');
  await page.click('[data-a="edit"]');
  await page.fill('[data-a="edit-stem"]', '새로 고침 뒤에도 남는 발문');
  await page.click('[data-a="edit-save"]');
  await page.reload();
  await see(page, '.pt-review-sum >> text=5문항');
  await see(page, 'text=새로 고침 뒤에도 남는 발문');
  await page.click('[data-a="wiz-next"]');
  await page.fill('[data-a="title"]', '남는 제목');
  await page.click('[data-a="cols"][data-v="1"]');
  await page.reload();
  await see(page, '.pt-steps [aria-current="step"] >> text=인쇄');
  assert(await page.inputValue('[data-a="title"]') === '남는 제목', '제목이 남지 않음');
  assert(await page.getAttribute('[data-a="cols"][data-v="1"]', 'aria-pressed') === 'true', '1단이 남지 않음');
});

step('② 문제 만드는 중에는 이전 · 단계 이동이 막히고, 다른 메뉴로 가면 그 화면에 남는다', async (page) => {
  await toMethod(page);
  await page.click('[data-a="wiz-next"]');
  await see(page, 'text=/지문 3개 중 \\d개 완료/');
  assert(await page.locator('[data-a="wiz-go"]').count() === 0, '만드는 중에 단계 이동 버튼이 있음');
  assert(await page.isDisabled('[data-a="wiz-prev"]'), '만드는 중에 이전이 켜져 있음');
  await page.click('.cl-ws-nav >> text=시험 보관함');
  await page.waitForTimeout(2500);
  assert(page.url().endsWith('#library'), `만들기 화면으로 끌려감: ${page.url()}`);
  assert(await page.isVisible('h1:has-text("시험 보관함")'), '보관함 화면이 아님');
});

step('① 자료: 데모 문항이 있는 지문 표시 · 붙여 넣은 지문만이면 ② 에서 알려 줌', async (page) => {
  await open(page, '#new?paper=s-en');
  await see(page, '[data-unit="s-en/u01"] >> text=데모 문항 있음');
  assert(!(await page.isVisible('[data-unit="s-en/u03"] >> text=데모 문항 있음')), '그림 지문에 데모 표시');
  await page.click('[data-a="src-tab"][data-v="paste"]');
  await see(page, 'text=데모에서는 붙여 넣은 지문으로 문항이 나오지 않아요');
  await page.fill('[data-a="paste-title"]', '교과서 1과');
  await page.fill('[data-a="paste-text"]', 'Good habits are built one small step at a time.');
  if (await page.isVisible('[data-a="rights"]')) await page.check('[data-a="rights"]');
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=방식');
  assert(await page.isDisabled('[data-a="wiz-next"]'), '데모 문항이 없는데 문제 만들기가 켜져 있음');
  assert((await page.getAttribute('[data-a="wiz-next"]', 'title')).includes('데모 문항'), '이유 안내 없음');
  await see(page, '.pt-bar__why >> text=고른 지문에 데모 문항이 없어요');
});

step('다음 버튼이 꺼져 있으면 이유를 바에 글로 보여 준다', async (page) => {
  await toMethod(page);
  await page.click('[data-a="grp"][data-v="original"]');
  assert(await page.isDisabled('[data-a="wiz-next"]'), '묶음이 없는데 문제 만들기가 켜져 있음');
  await see(page, '.pt-bar__why >> text=어떤 문제를 만들지 하나 이상 골라 주세요');
  await page.click('[data-a="grp"][data-v="original"]');
  assert(await page.locator('.pt-bar__why').count() === 0, '켜져 있는데 이유 문구가 남음');
});

step('① 자료: [데모 문항 있는 지문만 선택]', async (page) => {
  await open(page, '#new?paper=s-en');
  await page.click('[data-a="src-demo"]');
  assert((await barText(page)).includes('고른 지문 4개'), await barText(page));
  assert(!(await page.isChecked('[data-unit="s-en/u03"] input')), '그림 지문이 골라짐');
});

step('① 에서 과목을 바꾸면 ② 묶음이 그 과목 기본값으로', async (page) => {
  await toMethod(page);
  await page.click('[data-a="grp"][data-v="original"]');
  await page.click('[data-a="grp"][data-v="blank"]');
  await page.click('[data-a="wiz-go"][data-v="1"]');
  await page.click('[data-a="src-subject"][data-v="국어"]');
  await page.click('[data-a="src-all"]');
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=방식');
  assert(await page.getAttribute('[data-a="grp"][data-v="original"]', 'aria-pressed') === 'true', '원래 유형 그대로가 기본으로 돌아오지 않음');
  assert(!(await page.textContent('.pt-bar__summary')).includes('빈칸'), '다른 과목 묶음이 남음');
});

step('① 에서 고른 지문을 바꾸면 ③ · ④ 로 바로 건너뛸 수 없다', async (page) => {
  await toReview(page);
  await page.click('[data-a="wiz-go"][data-v="1"]');
  await page.click('.pt-basket [data-a="basket-remove"] >> nth=0');
  assert(await page.locator('[data-a="wiz-go"][data-v="3"]').count() === 0, '지문을 바꿨는데 ③ 으로 건너뛸 수 있음');
});

step('완성한 시험지를 다시 열어 보기만 해도 완성 그대로', async (page) => {
  await toPrint(page);
  await page.fill('[data-a="title"]', '완성 유지');
  await page.click('[data-a="save-done"]');
  await page.waitForFunction(() => location.hash === '#exams');
  await page.click('tr:has-text("완성 유지") [data-a="ex-print"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=인쇄');
  await page.click('[data-a="wiz-prev"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토');
  await page.click('.cl-ws-nav >> text=시험 출제');
  await see(page, 'tr:has-text("완성 유지")');
  const badge = await page.textContent('tr:has-text("완성 유지") .cl-badge');
  assert(badge.trim() === '완성', `상태가 바뀜: ${badge}`);
});

realStep('실제 데이터: 보관함 → 상세 → 빈칸 지문 4개 → 만들기 → 검토 → 인쇄 안내 → 저장', async (page) => {
  await open(page);
  await see(page, 'text=아직 만든 시험지가 없어요');
  await open(page, '#library');
  await page.click('a >> text=2026 10월 고2 학력평가 영어');
  await see(page, '.cl-badge >> text=그림 필요');
  await page.click('[data-a="make-paper"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=자료');
  await page.click('[data-a="src-type"][data-v="빈칸"]');
  await page.click('[data-a="src-all"]');
  assert((await barText(page)).includes('고른 지문 4개'), await barText(page));
  await page.click('[data-a="wiz-next"]');
  await page.click('[data-a="grp"][data-v="original"]');
  for (const g of ['main', 'blank', 'writing']) await page.click(`[data-a="grp"][data-v="${g}"]`);
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=검토', 8000);
  await see(page, '.pt-notes >> text=데모 문항이 없어요');
  await see(page, '.pt-src mark');
  await page.click('[data-a="wiz-next"]');
  await see(page, 'text=링크로 연 화면에서는 인쇄가 막혀 있어요');
  assert(await page.locator('[data-a="print"]').count() === 0, '아티팩트에서 인쇄 버튼이 보임');
  await page.click('[data-a="save-done"]');
  await see(page, 'td >> text=완성');
});

realStep('실제 데이터: 영어 [데모 문항 있는 지문만 선택] → 10개 → 문제 만들기 켜짐', async (page) => {
  await open(page, '#new');
  await page.click('[data-a="src-demo"]');
  assert((await page.textContent('.pt-bar__summary')).includes('고른 지문 10개'), await page.textContent('.pt-bar__summary'));
  await page.click('[data-a="wiz-next"]');
  await see(page, '.pt-steps [aria-current="step"] >> text=방식');
  assert(!(await page.isDisabled('[data-a="wiz-next"]')), '문제 만들기가 꺼져 있음');
});

realStep('실제 데이터: 국어 전체 선택은 그림 지문 2묶음을 뺀다', async (page) => {
  await open(page, '#new?paper=r-ko');
  await page.click('[data-a="src-all"]');
  assert((await barText(page)).includes('고른 지문 13개'), await barText(page));
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
    // 아티팩트 화면에서는 confirm() 이 항상 false 다. 같은 조건으로 검사한다.
    page.on('dialog', (d) => d.dismiss());
    try {
      await s.fn(page, ctx);
      if (errors.length) throw new Error('페이지 오류: ' + errors.join(' | '));
      console.log(`ok   ${s.name}`);
    } catch (e) {
      failed++;
      console.log(`FAIL ${s.name}\n     ${e.message.split('\n').slice(0, 3).join(' / ')}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
console.log(failed ? `${failed} failed` : 'ok');
process.exit(failed ? 1 : 0);
