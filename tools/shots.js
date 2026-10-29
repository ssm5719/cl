// 모든 실험실 화면을 수정안으로 그려 저장하고, 가로 넘침을 찾는다.
// node tools/shots.js <저장 폴더> [1440,390] [포트 8765]  — 바꾸기 전/후 비교는 git archive 로 옛 lab 을 다른 포트에 띄워 두 번 돌린다.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const apply = require('./apply');
(async () => {
  const [out, widths = '1440,390', port = '8765'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const base = `http://localhost:${port}`; const scrs = fs.readdirSync(path.join(__dirname, '../lab/screens')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5));
  const b = await chromium.launch(); const errs = [];
  for (const w of widths.split(',')) {
    const ctx = await b.newContext({ viewport: { width: +w, height: 900 } });
    await Promise.all([0, 1, 2, 3].map(async k => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(`${w} ${p.url()} ${e.message}`));
      for (let i = k; i < scrs.length; i += 4) { const scr = scrs[i];
        try { await apply(p, base, scr); await p.waitForTimeout(700);
          const sw = await p.evaluate(() => document.documentElement.scrollWidth); if (sw > +w) errs.push(`넘침 ${w} ${scr} ${sw}`);
          await p.screenshot({ path: `${out}/${scr}-${w}.png`, fullPage: true }); } catch (e) { errs.push(scr + ' ' + e.message); } }
      await p.close(); }));
    await ctx.close();
  }
  console.log(errs.join('\n') || 'ok'); await b.close();
})();
