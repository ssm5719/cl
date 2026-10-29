// 개발 전달 문서를 실험실(lab/fixes.js · lab/index.html · lab/css)에서 다시 만든다.
//   node handoff/build_handoff.js 2026.10.29
// 손으로 고친 내용은 다음 실행 때 지워진다 — README.md · AI_PROMPT.md 만 손으로 쓴 파일이다.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..'), LAB = path.join(ROOT, 'lab'), OUT = __dirname;
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10).replace(/-/g, '.');
const BASE_COMMIT = '14d5e0b'; // 실험실에 받은 화면 · CSS 를 처음 넣은 커밋 (2026-10-19 사이트 파일)

const w = {}; require('vm').runInNewContext(fs.readFileSync(path.join(LAB, 'fixes.js'), 'utf8'), { window: w });
const NOTES = w.LAB_NOTES || [];
// 포털 2차(fixes-portal.js · p- 화면)는 1차 229건과 따로 센다 — 1차 문서 · fixes.json · fixes.css 에 섞지 않고 09-포털.md 로만 낸다
const wp = {}; require('vm').runInNewContext(fs.readFileSync(path.join(LAB, 'fixes-portal.js'), 'utf8'), { window: wp });
const isPortal = f => (f.screens || []).length > 0 && f.screens.every(s => /^p-/.test(s));
const PORTAL = (wp.LAB_FIXES || []).filter(isPortal);
const FIXES = w.LAB_FIXES.filter(f => !isPortal(f));
const html = fs.readFileSync(path.join(LAB, 'index.html'), 'utf8');
const SCREENS = eval(html.match(/const SCREENS = (\[[\s\S]*?\n  \]);/)[1]);
const LAYERS = ['토큰', '공통 틀', '공통 부품', '화면별'];
const layerOf = f => f.layer || (f.kind === '토큰' ? '토큰' : /^(F|G)/.test(f.id) ? '공통 틀' : /^(A4|A5|H1|H3|B2)$/.test(f.id) ? '공통 부품' : '화면별');
const workOf = f => f.work || (f.markup || f.dom ? '프론트 수정' : 'CSS만');
const nameOf = id => (SCREENS.find(x => x.id === id) || {}).name || id;
const screenNames = f => (f.screens || []).includes('all') ? '전체' : (f.screens || []).map(nameOf).join(', ');
const strip = t => (t || '').trim();

// 영역 — 화면 id 로 나눈다
const AREAS = [
  { key: 'common', file: '01-공통.md', title: '공통 — 토큰 · 머리 틀 · 공통 부품 · 여러 영역에 걸친 수정' },
  { key: 'admin', file: '02-관리자.md', title: '관리자 화면' },
  { key: 'teacher', file: '03-선생님.md', title: '선생님 화면' },
  { key: 'student', file: '04-학생.md', title: '학생 화면 (학생 작업공간 · 나의 강의실)' },
  { key: 'public', file: '05-학원-공개화면.md', title: '학원 공개 화면 (메인 · 전체강좌 · 강좌 상세 · 강의 보기 · 학원소개 · 선생님 · Q&A · 자유게시판)' },
  { key: 'player', file: '08-동영상플레이어.md', title: '동영상 플레이어 (LABY 플레이어 · cms.atedu.co.kr — 학원 사이트와 별도 서비스, 플레이어 담당에게 전달)' },
];
const areaOfScreen = id => /^p-/.test(id) ? 'portal' : id === 'player-laby' ? 'player' : /^a-/.test(id) ? 'public' : /^s-/.test(id) ? 'student' : (/^t-/.test(id) || id === 'courses' || id === 'login-stat-t') ? 'teacher' : 'admin';
const areaOf = f => {
  if ((f.screens || []).includes('all')) return 'common';
  const set = new Set((f.screens || []).map(areaOfScreen));
  return set.size === 1 ? [...set][0] : 'common';
};

const confirmed = FIXES.filter(f => f.status === '확정').sort((a, b) => LAYERS.indexOf(layerOf(a)) - LAYERS.indexOf(layerOf(b)));
const proposed = FIXES.filter(f => f.status === '제안');

const filesOf = f => {
  if ((f.screens || []).includes('all')) return '모든 화면 (`lab/screens/*.html`)';
  const fs_ = (f.screens || []).map(id => '`lab/screens/' + id + '.html`');
  return fs_.length > 6 ? fs_.slice(0, 6).join(' · ') + ` 외 ${fs_.length - 6}개 (07-화면목록 참고)` : fs_.join(' · ');
};
function item(f) {
  const L = [`### ${f.id} · ${f.title}`, ''];
  L.push(`- 화면: ${screenNames(f)}`, `- 실험실 화면 파일: ${filesOf(f)}`, `- 층: ${layerOf(f)} · 작업: ${workOf(f)}`, `- 지금: ${strip(f.current)}`, `- 바꿀 모습: ${strip(f.next)}`);
  if (f.when) L.push(`- 보이는 조건: ${strip(f.when)}`);
  if (f.howTo) L.push(`- 확인하는 길: ${strip(f.howTo)}`);
  if (f.variants) L.push(`- 바뀌는 경우: ${strip(f.variants)}`);
  if (f.scope) L.push(`- CSS 범위: \`${f.scope}\` 안에서만`);
  if (f.markup) L.push(`- 마크업 · 스크립트: ${strip(f.markup)}`);
  if (f.server) L.push(`- 서버: ${strip(f.server)}`);
  if (f.note) L.push(`- 참고: ${strip(f.note)}`);
  L.push('');
  if (f.spec) L.push('#### 새 화면 명세', '', '```text', strip(f.spec), '```', '', '새 화면은 AI_PROMPT.md 의 [새 화면 만드는 법] 대로 만든다. 마크업은 위 실험실 화면 파일의 `<main>` 안을 기준으로 하고, 글 · 숫자는 API 데이터로 채운다.', '');
  if (f.css && f.css.trim()) L.push('```css', f.css.trim(), '```', '');
  if (f.dom && f.dom.trim()) L.push('<details><summary>실험실에서 마크업을 바꾼 스크립트 (결과 확인용 — 그대로 붙이지 말고 템플릿 · JS 에서 같은 결과를 만든다)</summary>', '', '```js', f.dom.trim(), '```', '', '</details>', '');
  L.push(`확인: 실험실 "${f.id}" 수정안 화면과 같아야 한다.`, '');
  return L.join('\n');
}

const files = {};
for (const A of AREAS) {
  const list = confirmed.filter(f => areaOf(f) === A.key);
  const L = [`# ${A.title}`, '', `> ${DATE} 기준 · 확정 ${list.length}건 · 층 순서(토큰 → 공통 틀 → 공통 부품 → 화면별)로 적었다. 먼저 [README](README.md) 의 규칙을 읽는다.`, ''];
  if (A.key === 'player') L.push('> 디자인시스템 부품: [VideoPlayer](../design/components/VideoPlayer/README.md) — 부분별 클래스 · LABY 클래스 대응 · 값 · 동작, 미리보기 `preview.html`. 공통 CSS 는 `lab/css/components.css` 의 `cl-vplayer` 블록, 색은 `cl-player-*` 토큰(`lab/css/cl-tokens.css`). 아이콘 8개: `design/assets/Icons/player-*.svg`.', '');
  if (A.key === 'common') {
    L.push('## 0. 공통 CSS 파일 (가장 먼저)', '',
      '이 묶음은 아래 항목들보다 **먼저** 적용한다. 화면별 수정이 이 토큰 · 부품을 쓴다.', '',
      '1. **토큰** — `lab/css/cl-tokens.css` 를 기준으로 새 토큰을 더한다. 추가된 것: 글자 고정 단계 `--cl-fs-10 ~ --cl-fs-72`, 모서리 `--cl-radius-3xs`(2) · `--cl-radius-2xs`(6) · `--cl-radius-xl`(16), 색 `--cl-on-ink-2` · `--cl-on-ink-muted` · `--cl-on-ink-faint` · `--cl-surface-dark-hover` · `--cl-disabled-bg` · `--cl-media-bg`, 공개 화면 글자 `--cl-fs-body-sm-pub` · `--cl-fs-section-pub` (다크 값 포함).',
      '2. **px · hex 를 토큰으로** — base · components · manager · teacher · student · public.css 의 `font-size: 14px`, `border-radius: 6px`, `#fff` 같은 직접 값 430곳을 토큰으로 바꿨다. 값은 같고(반 픽셀 글자 13.5 → 14 등만 반올림) 화면 변화는 거의 없다. 바뀐 줄은 [`css-changes.diff`](css-changes.diff).',
      '3. **공통 부품 v1.3** — `lab/css/components.css` 맨 끝 "공통 부품 v1.3" 묶음을 그대로 옮긴다(새 클래스만이라 기존 화면에 영향 없음). 부품 설명은 [`../design/components/`](../design/components/) 의 Button · Link · Status · Tabs · Composer · MiniList · Popover · FileCard · Empty · Avatar README.',
      '4. **이미지 파일** — `lab/img/teacher-placeholder.svg`(사진 없는 선생님 선 아이콘)를 서비스 이미지 폴더에 둔다. **강좌 기본 썸네일**(썸네일을 올리지 않은 강좌에 쓰는 그림, 640×360)은 지금 쓰는 분홍 그림 대신 `lab/img/course-default.png`(연보라 바탕 · 책 위 두 사람, 2026.10.29)로 바꾼다 — 전체강좌 · 메인 · 강좌 상세 · 선생님 상세 · 나의 강의실 등 기본 썸네일이 나오는 모든 곳.', '',
      '> 포털(cloudlearning.lab241.com)도 같은 `cl-tokens.css` · `base.css` · `components.css` 를 불러온다. 배포 뒤 포털 로그인 · 회원가입 화면이 그대로인지 한 번 확인한다. 포털 화면 수정은 2차.', '');
  }
  if (!list.length) L.push('없음', '');
  for (const ly of LAYERS) {
    const g = list.filter(f => layerOf(f) === ly); if (!g.length) continue;
    L.push(`## ${ly} (${g.length})`, '', ...g.map(item));
  }
  files[A.file] = L.join('\n');
}

// 제안 · 메모
{
  const L = ['# 아직 확정 아님 — 적용하지 않는다', '', `> ${DATE} 기준 · 제안 ${proposed.length}건. 실험실에서 보는 중인 안이다. AI 도구는 이 파일의 항목을 고치지 않는다. 확정되면 영역 문서로 옮겨진다.`, ''];
  L.push('| ID | 화면 | 내용 |', '| --- | --- | --- |', ...proposed.map(f => `| ${f.id} | ${screenNames(f).replace(/\|/g, '/')} | ${f.title.replace(/\|/g, '/')} |`), '');
  if (NOTES.length) { L.push('## 개발 확인 메모 (화면 수정 아님 — 먼저 정할 것)', ''); NOTES.forEach(n => L.push(`### ${n.id} · ${n.title}`, '', `- 구분: ${n.level} · ${n.area}`, `- 화면: ${n.screens}`, `- 무엇: ${strip(n.what)}`, `- 영향: ${strip(n.impact)}`, `- 확인할 것: ${strip(n.check)}`, `- 정할 것: ${strip(n.options)}`, '')); }
  files['06-제안-확인메모.md'] = L.join('\n');
}

// 화면 목록 (실험실에서 비교할 곳)
{
  const L = ['# 화면 목록', '', '실험실(`lab/index.html`, 저장소를 내려받아 `python3 -m http.server` 로 열거나 실험실 아티팩트)에서 화면을 고르고 [수정안] 으로 바꿔 비교한다. 각 화면에 걸린 확정 항목 ID 를 적었다.', ''];
  for (const A of AREAS.slice(1)) {
    L.push(`## ${A.title}`, '', '| 화면 id | 이름 | 확정 항목 |', '| --- | --- | --- |');
    SCREENS.filter(s => areaOfScreen(s.id) === A.key).forEach(s => {
      const ids = confirmed.filter(f => (f.screens || []).includes(s.id)).map(f => f.id);
      L.push(`| \`${s.id}\` | ${s.name} | ${ids.join(' ') || '—'} |`);
    });
    L.push('');
  }
  files['07-화면목록.md'] = L.join('\n');
}

// 기계용
files['fixes.json'] = JSON.stringify({ date: DATE, confirmed: confirmed.map(f => ({ id: f.id, area: areaOf(f), layer: layerOf(f), work: workOf(f), screens: f.screens, title: f.title, files: (f.screens || []).includes('all') ? ['lab/screens/*.html'] : (f.screens || []).map(id => 'lab/screens/' + id + '.html'), current: f.current, next: f.next, when: f.when, scope: f.scope, markup: f.markup, server: f.server, spec: f.spec, css: f.css, dom: f.dom })), proposed: proposed.map(f => ({ id: f.id, title: f.title, screens: f.screens })) }, null, 2);
files['fixes.css'] = `/* fixes.css — 확정 수정안 CSS 전부 (${DATE}, ${confirmed.length}건, 층 순서).\n   공통 CSS(01-공통 0번) 다음에 불러오거나, 각 규칙을 원본 파일 안으로 옮긴다. */\n\n` +
  confirmed.filter(f => f.css && f.css.trim()).map(f => `/* ${f.id} · ${f.title} */\n${f.css.trim()}`).join('\n\n') + '\n';
files['css-changes.diff'] = cp.execSync(`git -C "${ROOT}" diff ${BASE_COMMIT} HEAD -- lab/css/cl-tokens.css lab/css/base.css lab/css/components.css lab/css/manager.css lab/css/teacher.css lab/css/student.css`, { maxBuffer: 64 << 20 }).toString();

// 포털 2차 — 09-포털.md · portal-fixes.css (1차와 따로)
{
  const P = PORTAL.slice().sort((a, b) => LAYERS.indexOf(layerOf(a)) - LAYERS.indexOf(layerOf(b)));
  const pc = P.filter(f => f.status === '확정'), pp = P.filter(f => f.status === '제안'), ph = P.filter(f => f.status === '보류');
  const L = ['# 포털 (2차 · cloudlearning.lab241.com)', '',
    `> ${DATE} 기준 · 확정 ${pc.length}건 · 제안 ${pp.length}건 · 보류 ${ph.length}건. **1차 229건과 따로 센다.** 층 순서(토큰 → 공통 틀 → 공통 부품 → 화면별)로 적었다. 먼저 [README](README.md) 의 규칙을 읽는다.`, '',
    '> 실험실 기준 CSS 는 `lab/css/portal/`(사이트 2026.10.29 사본 — cl-tokens · base · components · portal · portal-chat). 모든 수정은 `.cl-portal`(포털 body) 안에서만 적용한다. 1차 공통 CSS(cl-tokens · base · components)는 바꾸지 않는다.', '',
    '> **제안** 항목은 디자인 쪽 확인 중이다 — 확정으로 바뀌기 전에는 적용하지 않는다.', '',
    '## 화면', '', '| 화면 id | 이름 | 항목 |', '| --- | --- | --- |',
    ...SCREENS.filter(s => /^p-/.test(s.id)).map(s => `| \`${s.id}\` | ${s.name} | ${P.filter(f => f.screens.includes(s.id)).map(f => f.id).join(' ')} |`), ''];
  for (const [label, g0] of [['확정', pc], ['제안 (아직 적용하지 않음)', pp]]) {
    if (!g0.length) continue;
    L.push(`## ${label} (${g0.length})`, '');
    for (const ly of LAYERS) { const g = g0.filter(f => layerOf(f) === ly); if (!g.length) continue; L.push(`### ${ly} (${g.length})`, '', ...g.map(f => item(f).replace(/^### /, '#### ').replace(/\n#### 새 화면 명세/, '\n##### 새 화면 명세'))); }
  }
  files['09-포털.md'] = L.join('\n');
  files['portal-fixes.css'] = `/* portal-fixes.css — 포털 2차 수정안 CSS (${DATE}, 확정 ${pc.length} · 제안 ${pp.length}). portal.css 다음에 불러온다. 제안 항목도 들어 있다 — 확정된 것만 옮긴다. */\n\n` +
    P.filter(f => f.status !== '보류' && f.css && f.css.trim()).map(f => `/* ${f.id} [${f.status}] · ${f.title} */\n${f.css.trim()}`).join('\n\n') + '\n';
  files.__portalCount = { confirmed: pc.length, proposed: pp.length, held: ph.length, screens: SCREENS.filter(s => /^p-/.test(s.id)).map(s => s.id) };
}

const portalCount = files.__portalCount; delete files.__portalCount;
for (const [f, c] of Object.entries(files)) fs.writeFileSync(path.join(OUT, f), c);
const count = Object.fromEntries(AREAS.map(A => [A.key, confirmed.filter(f => areaOf(f) === A.key).length]));
fs.writeFileSync(path.join(OUT, 'counts.json'), JSON.stringify({ date: DATE, confirmed: confirmed.length, proposed: proposed.length, ...count, newScreens: confirmed.filter(f => f.spec).map(f => f.id), portal: portalCount }, null, 2));
console.log('handoff', DATE, 'confirmed', confirmed.length, count, 'proposed', proposed.length, 'portal', JSON.stringify(portalCount));
