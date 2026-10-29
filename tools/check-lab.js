// 실험실 첫 화면이 오류 없이 뜨는지 본다.  (cd lab && python3 -m http.server 8765) 후  node tools/check-lab.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8765/index.html'); await p.waitForTimeout(4000);
  const t = await p.evaluate(() => document.querySelector('#stageInfo') ? document.querySelector('#stageInfo').textContent.trim() : '');
  console.log(errs.length ? 'ERR\n' + errs.join('\n') : 'ok', '·', t); await b.close(); process.exit(errs.length ? 1 : 0);
})();
