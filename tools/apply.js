// 실험실 화면 하나에 확정 · 제안 수정안(fixes.js)을 입힌다 — 다른 스크립트가 같이 쓴다.
module.exports = async function apply(p, base, scr) {
  await p.goto(`${base}/screens/${scr}.html`, { waitUntil: 'load' });
  await p.addScriptTag({ url: `${base}/fixes.js?` + Date.now() });
  await p.evaluate((scr) => {
    const fx = window.LAB_FIXES.filter(f => f.status !== '보류' && (!f.screens || f.screens.includes(scr) || f.screens.includes('all')));
    const s = document.createElement('style'); s.textContent = fx.map(f => f.css || '').join('\n'); document.head.appendChild(s);
    fx.forEach(f => { if (f.dom) try { new Function('doc', f.dom)(document); } catch (e) { console.error(f.id, e.message); } });
  }, scr);
};
