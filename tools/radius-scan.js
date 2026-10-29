// 모든 화면의 버튼 · 입력 칸 모서리를 실제로 그려서 모은다. 4px 이 아닌 것만 보여 준다(알약 · 원 제외).
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const apply = require('./apply');
(async () => {
  const base = 'http://localhost:' + (process.argv[2] || '8765');
  const scrs = fs.readdirSync(path.join(__dirname, '../lab/screens')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5));
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const agg = {};
  await Promise.all([0, 1, 2, 3, 4, 5].map(async k => { const p = await ctx.newPage();
    for (let i = k; i < scrs.length; i += 6) { const scr = scrs[i]; try { await apply(p, base, scr); await p.waitForTimeout(300);
      const l = await p.evaluate(() => { const o = new Set();
        document.querySelectorAll('button,input,textarea,select,a.cl-btn,[role=button],[class*="btn"]').forEach(e => {
          if (['checkbox', 'radio', 'range', 'hidden', 'file', 'color'].includes(e.type)) return;
          const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return; const cs = getComputedStyle(e); const rad = parseFloat(cs.borderTopLeftRadius) || 0;
          if (rad === 4 || rad >= Math.min(r.width, r.height) / 2 - 1) return;
          o.add(e.tagName.toLowerCase() + '.' + [...e.classList].filter(c => !c.startsWith('lab-')).join('.') + ' r' + rad); }); return [...o]; });
      l.forEach(x => (agg[x] = agg[x] || []).push(scr)); } catch (e) {} } await p.close(); }));
  Object.entries(agg).sort((a, b) => b[1].length - a[1].length).forEach(([k, v]) => console.log(v.length, k, v.slice(0, 4).join(',')));
  await b.close();
})();
