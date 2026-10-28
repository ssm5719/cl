// design/components/bundle.css 를 실험실 CSS · 수정안(fixes.js)에서 다시 만든다.  node design/build_bundle.js
const fs = require('fs'), path = require('path');
const L = p => path.join(__dirname, '..', 'lab', p);
const w = {}; require('vm').runInNewContext(fs.readFileSync(L('fixes.js'), 'utf8'), { window: w });
const old = fs.readFileSync(path.join(__dirname, 'components/bundle.css'), 'utf8');
const behav = old.slice(old.indexOf('/* ===== cl-tokens.css 공통 동작 ===== */'), old.indexOf('/* ===== base.css ===== */'));
const head = `/* 클라우드러닝 작업공간 · 학원 공개 화면 — 컴포넌트 스타일 (만든 날 ${process.argv[2] || ''})
   원본: 실험실 lab/css 의 base · components · manager · teacher · student · public.css + fixes.js 의 확정 · 제안 항목 CSS.
   이 파일은 design/build_bundle.js 로 만든다 — 손으로 고치지 말고 실험실 CSS 를 고친 뒤 다시 만든다.
   색 · 글자 크기 · 간격 · 반경 · 그림자 · 높이 값은 tokens.json 에서 온다(tokens.css 가 :root 에 선언). px · hex 를 직접 쓰지 않는다.
   아래 :root 는 tokens.json 에 넣을 수 없는 값만 둔다. */
:root {
  --cl-font: var(--font-sans);
  --cl-ws-gutter: clamp(16px, 2.8cqw, 40px);
  --cl-pub-gutter: max(20px, calc((100cqw - 1200px) / 2));
  --cl-glass-filter: saturate(180%) blur(20px);
  --cl-press: scale(0.97);
  --cl-dur: 150ms;
  --cl-ease: ease-out;
  --cl-focus: 2px solid var(--cl-primary);
}

`;
let out = head + behav;
for (const f of ['base', 'components', 'manager', 'teacher', 'student', 'public']) out += `/* ===== ${f}.css ===== */\n` + fs.readFileSync(L(`css/${f}.css`), 'utf8').trim() + '\n\n';
for (const st of ['확정', '제안']) {
  out += st === '확정' ? '/* ===== 디자인 수정(확정) — 실험실 fixes.js 의 확정 항목 CSS. 개발 반영 대상 ===== */\n'
                       : '/* ===== 디자인 수정(제안) — 실험실에서 보는 중. 확정되면 위로 올라간다 ===== */\n';
  for (const x of w.LAB_FIXES.filter(x => x.status === st && (x.css || '').trim()))
    out += `/* --- ${x.id} [${st}] ${(x.title || '').replace(/\*\//g, '')} --- */\n${x.css.trim()}\n\n`;
}
fs.writeFileSync(path.join(__dirname, 'components/bundle.css'), out);
console.log('bundle.css', out.length, 'bytes');
