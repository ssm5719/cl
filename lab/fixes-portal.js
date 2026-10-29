/* 포털 2차 수정안 (cloudlearning.lab241.com) — 1차 fixes.js 229건과 따로 센다.
   화면 id 는 p- 로 시작한다. handoff 는 09-포털.md 로 따로 만든다(build_handoff.js).
   모두 .cl-portal(포털 body) 안에서만 적용한다. 값은 cl 토큰만 쓴다. 기준 CSS: lab/css/portal/ (사이트 2026.10.29 사본) */
window.LAB_FIXES = (window.LAB_FIXES || []).concat([
  {
    id: 'PT1', group: 10, status: '제안', kind: '토큰', layer: '토큰', screens: ['p-main'],
    title: '포털 색 변수(--pt-*)를 공통 토큰으로 — 그라데이션 · 보라 그림자 없애기',
    current: 'portal.css 맨 위 `.cl-portal` 에 포털 전용 변수 30여 개를 hex 로 따로 둔다(`--pt-violet: #904AE8` · `--pt-blue-tint: #E8EEFF` · `--pt-orange-tint` · `--pt-green-tint` …). 그라데이션 3개(`--pt-grad` 보라→파랑)와 보라빛 그림자 6개(`--pt-shadow-*`)도 여기서 나온다. 1차 디자인시스템 토큰(`--cl-*`)과 이름 · 값이 따로 놀아서 학원 대표색을 바꿔도 포털은 안 바뀐다',
    next: '`--pt-*` 를 모두 `--cl-*` 토큰을 가리키게 바꾼다. 그라데이션 3개는 단색 `--cl-primary` · 선 `--cl-hairline` 으로, 카드 그림자는 1px 링(`--cl-ring`)으로, 보라빛 큰 그림자와 그림 그림자는 없앤다. 파랑 · 주황 · 초록 연한 바탕은 회백색 `--cl-parchment` 하나로 모은다. **이 한 묶음으로 버튼 · 체크 · 숫자 · 테두리의 그라데이션이 전부 단색이 된다**',
    css: `/* 포털 전용 변수 → 공통 토큰 (값을 따로 두지 않는다) */
.cl-portal {
  --pt-violet: var(--cl-primary); --pt-violet-ink: var(--cl-primary-pressed); --pt-violet-light: var(--cl-primary-on-dark);
  --pt-violet-tint: var(--cl-primary-tint); --pt-violet-mist: var(--cl-primary-wash); --pt-canvas: var(--cl-canvas);
  --pt-blue: var(--cl-primary); --pt-blue-deep: var(--cl-primary); --pt-blue-ink: var(--cl-primary-pressed); --pt-blue-tint: var(--cl-parchment);
  --pt-orange-tint: var(--cl-parchment); --pt-orange-ink: var(--cl-ink); --pt-green-tint: var(--cl-parchment); --pt-green-ink: var(--cl-ink);
  --pt-ink: var(--cl-ink); --pt-ink-2: var(--cl-ink-2); --pt-muted: var(--cl-ink-muted); --pt-placeholder: var(--cl-ink-muted);
  --pt-band: var(--cl-parchment); --pt-line: var(--cl-hairline); --pt-input-line: var(--cl-control-border); --pt-check-line: var(--cl-mark-muted);
  --pt-row-line: var(--cl-grid-row); --pt-required: var(--cl-danger);
  --pt-grad: var(--cl-primary); --pt-grad-diag: var(--cl-primary); --pt-grad-border: var(--cl-hairline);
  --pt-shadow-card: var(--cl-ring); --pt-shadow-card-hover: 0 0 0 1px var(--cl-primary); --pt-shadow-glass: var(--cl-ring);
  --pt-shadow-primary: none; --pt-shadow-dialog: var(--cl-shadow-float); --pt-art-shadow: none;
}`,
    markup: 'CSS 만. portal.css 1~38행의 `--pt-*` 값을 위처럼 `var(--cl-…)` 로 바꾼다. 다음 정리 때는 `--pt-*` 를 쓰는 자리를 `--cl-*` 로 직접 바꾸고 변수를 지운다(포털 전용 변수를 남기지 않는다). 이 항목은 포털 모든 화면(메인 · 요금제 · 학원 목록 · 고객센터 · 로그인 · 회원가입 · 약관 · 개설 신청)에 같이 적용된다',
    targets: ['.cl-pt-main-hero__title', '.cl-pt-day__num', '.cl-pt-gborder'],
    note: '체크박스 테두리는 `--cl-mark-muted`(#8E8E93, 흰 바탕 3.3:1) — 입력 칸 테두리 `--cl-control-border` 는 너무 옅어 체크박스가 안 보인다(1.5:1). 안내 글자색 `--pt-placeholder`(#86868B, 3.6:1)는 4.5:1 에 못 미쳐 `--cl-ink-muted` 로.'
  },
  {
    id: 'PT2', group: 10, status: '제안', kind: 'CSS', layer: '공통 틀', screens: ['p-main'],
    title: '머리 줄 · 배경 — 유리 효과와 오로라 그라데이션 빼기',
    current: '머리 줄이 반투명 흰색 + 뒤 흐림(`backdrop-filter: blur(20px)`). 첫 화면 · 하위 화면 머리는 라벤더 · 하늘 · 복숭아 원형 그라데이션 3겹(`.cl-pt-aurora`), 그 아래는 연보라→흰색 그라데이션(`.cl-pt-after-hero`)',
    next: '머리 줄은 흰색 단색 + 아래 옅은 선 하나. 오로라와 그 아래 그라데이션은 흰 바탕(`--cl-canvas`)으로. 색 덩어리 대신 **첫 화면의 실제 서비스 화면 캡처가 주인공**이 되게 둔다',
    css: `.cl-portal .cl-pt-header { background: var(--cl-canvas); -webkit-backdrop-filter: none; backdrop-filter: none; }
.cl-portal .cl-pt-aurora, .cl-portal .cl-pt-aurora--hero, .cl-portal .cl-pt-after-hero { background: var(--cl-canvas); }`,
    targets: ['.cl-pt-header', '.cl-pt-main-hero'],
    note: '포털 모든 화면에 같이 적용(공통 틀). 다크모드는 포털이 쓰지 않으므로(scope.md) 라이트 값만 본다.'
  },
  {
    id: 'PT3', group: 10, status: '제안', kind: '마크업', layer: '공통 부품', screens: ['p-main'],
    title: '포털 버튼(cl-pt-btn) → 공통 Button(cl-btn) — 크기 이름 맞추기',
    current: '포털은 버튼을 따로 만든다(`cl-pt-btn`). 크기 이름이 공통 Button 과 같은데 값이 다르다 — `--xs` 40 · `--sm` 44 · `--md` 48 · `--lg` 52 · `--xl` 56 (공통은 `--xs` 26 · `--sm` 28 · `--md` 36 · `--lg` 44 · `--xl` 48). 주 버튼은 보라→파랑 그라데이션 + 보라 그림자, 보조 버튼은 유리(`--glass` 뒤 흐림)',
    next: '공통 `cl-btn` 으로 바꾼다. 모양은 공개 화면 규칙(public-ui-rules 10장) 그대로 알약. 대응: `cl-pt-btn--primary --xl` → `cl-btn cl-btn--primary cl-btn--xl cl-btn--pill`(48) · `--glass` · `--secondary` → `cl-btn--soft`(회백색) · 머리 줄 `--dark --xs` → `cl-btn--dark cl-btn--md cl-btn--pill`(36) · 어두운 띠 `--white --lg` → `cl-btn--on-dark cl-btn--lg cl-btn--pill`(44). 그라데이션 · 그림자 · 뒤 흐림은 쓰지 않는다',
    dom: `var MAP = { xl: 'cl-btn--xl', lg: 'cl-btn--lg', md: 'cl-btn--lg', sm: 'cl-btn--md', xs: 'cl-btn--md' };
var KIND = { primary: 'cl-btn--primary', secondary: 'cl-btn--soft', glass: 'cl-btn--soft', soft: 'cl-btn--soft', dark: 'cl-btn--dark', white: 'cl-btn--on-dark' };
doc.querySelectorAll('.cl-pt-btn').forEach(function (b) {
  var cls = ['cl-btn', 'cl-btn--pill'];
  b.classList.forEach(function (c) { var m = c.match(/^cl-pt-btn--(.+)$/); if (!m) { if (c !== 'cl-pt-btn') cls.push(c); return; }
    if (MAP[m[1]]) cls.push(MAP[m[1]]); else if (KIND[m[1]]) cls.push(KIND[m[1]]); else if (m[1] === 'block') cls.push('cl-btn--block'); });
  if (!cls.some(function (c) { return /^cl-btn--(md|lg|xl)$/.test(c); })) cls.push('cl-btn--xl');
  b.className = cls.join(' ');
});`,
    css: `/* 머리 줄 [무료 상담] 왼쪽 띄움은 그대로 */
.cl-portal .cl-pt-actions .cl-btn--dark { margin-left: var(--cl-space-2); }
/* 포털은 a 글자색을 물려받게 해 두었다(.cl-portal :where(a)) — 채운 버튼은 글자색을 다시 정한다 */
.cl-portal a:is(.cl-btn--primary, .cl-btn--dark, .cl-btn--on-dark) { color: var(--cl-on-ink); }
.cl-portal a:is(.cl-btn--soft) { color: var(--cl-ink); }
.cl-portal a.cl-link { color: var(--cl-primary-pressed); }`,
    markup: '템플릿의 `cl-pt-btn …` 클래스를 위 대응표대로 `cl-btn …` 로 바꾼다. 포털 전 화면(메인 · 요금제 · 학원 목록 [둘러보기][강좌목록] · 개설 신청 [취소][신청하기] · 로그인 · 회원가입). 다 바꾼 뒤 portal.css 187~211행 `.cl-pt-btn` 묶음을 지운다. `.cl-pt-link` 는 공통 `cl-link` 로',
    targets: ['.cl-pt-main-hero__actions .cl-btn', '.cl-pt-actions .cl-btn'],
    note: '1차 CLAUDE.md 결정 — "포털 cl-pt-* 클래스는 cl-btn 크기 이름과 겹친다, 공통 Button 으로 맞추는 방향". 56 → 48 로 낮아지지만 누르는 영역(44 이상)은 지킨다. 알약 모양은 1차와 같이 유지(알약 4px 여부는 아직 사용자 답 기다리는 중).'
  },
  {
    id: 'PT4', group: 10, status: '제안', kind: 'CSS', layer: '공통 부품', screens: ['p-main'],
    title: '카드 · 사진 모서리 10종 → 8 · 16 두 가지',
    current: '포털 안 모서리가 14 · 16 · 18 · 20 · 24 · 26 · 28 · 30 · 32px 로 제각각이다(카드 24, 유리 판 28, 그라데이션 테두리 26 · 32, 알림 카드 20, 숫자 카드 24, 사진 틀 28 …)',
    next: '1차 규칙대로 카드 · 판 · 작은 사진 = 8(`--cl-radius-sm`), 큰 사진 · 화면 캡처 틀 = 16(`--cl-radius-xl`), 알약 · 원은 그대로',
    css: `.cl-portal :is(.cl-pt-card, .cl-pt-glass, .cl-pt-chart, .cl-pt-stat, .cl-pt-review, .cl-pt-bento__lead, .cl-pt-bento__card, .cl-pt-quota__tile, .cl-pt-gborder, .cl-pt-gborder > *, .cl-pt-gborder--lg, .cl-pt-gborder--lg > *, .cl-pt-seodang__step, .cl-pt-legal, .cl-pt-inquiry, .cl-pt-side-link, .cl-pt-submitbar, .cl-pt-mine-card, .cl-pt-myband__item, .cl-pt-radio-card, .cl-pt-notice) { border-radius: var(--cl-radius-sm); }
.cl-portal :is(.cl-pt-product__frame, .cl-pt-day__shot) { border-radius: var(--cl-radius-xl); }
.cl-portal :is(.cl-pt-product__frame img, .cl-pt-day__shot img, .cl-pt-bento__lead img) { border-radius: var(--cl-radius-sm); }`,
    targets: ['.cl-pt-chart', '.cl-pt-review', '.cl-pt-day__shot'],
    note: '1차 G7 · AM6(카드 · 사진 8)과 같은 값. 포털 전 화면 공통.'
  },
  {
    id: 'PT5', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '메인 첫 화면 — 3D 그림 · 라벨 칩 · 그라데이션 글자 · 가짜 알림 빼기',
    current: '첫 화면에 3D 그림 5개(학사모 · 책 · 구름 2 · 별), 제목 위 알약 칩 "✦ 학원 107곳이 선택한 온라인 캠퍼스", 제목 "온라인 캠퍼스" 만 보라→파랑 그라데이션 글자, 화면 캡처 위에 떠 있는 알림 카드 2개("평균 진도율 93%" · "새 답변 김하늘 선생님이 답했어요")와 유리 틀',
    next: '3D 그림과 칩을 뺀다. 제목은 한 색(검정)으로 — 단어 하나만 색을 바꾸지 않는다. 가짜 알림 카드 두 개를 빼고, 화면 캡처는 회백색 틀(16) 안에 크게. 학원 수는 아래 숫자 띠(PT8)에서 "누적 이용 학원 107곳" 으로 한 번만 말한다',
    dom: `doc.querySelectorAll('.cl-pt-main-hero .cl-pt-art, .cl-pt-main-hero > .cl-pt-chip, .cl-pt-product__note').forEach(function (e) { e.remove(); });
doc.querySelectorAll('.cl-pt-main-hero__title .cl-pt-grad-text').forEach(function (s) { s.replaceWith(doc.createTextNode(s.textContent)); });`,
    css: `.cl-portal .cl-pt-main-hero { padding-top: var(--cl-space-8); }
.cl-portal .cl-pt-main-hero__title { margin-top: 0; font-size: var(--cl-fs-72); line-height: 1.15; letter-spacing: -0.025em; }
.cl-portal .cl-pt-main-hero__lead { margin-top: var(--cl-space-5); font-size: var(--cl-fs-lead); color: var(--cl-ink-2); }
.cl-portal .cl-pt-main-hero__actions { margin-top: var(--cl-space-6); }
.cl-portal .cl-pt-product__frame { padding: var(--cl-space-3); background: var(--cl-parchment); -webkit-backdrop-filter: none; backdrop-filter: none; box-shadow: none; }
@media (max-width: 1080px) { .cl-portal .cl-pt-main-hero__title { font-size: var(--cl-fs-56); } }
@media (max-width: 600px) { .cl-portal .cl-pt-main-hero { padding-top: var(--cl-space-7); } .cl-portal .cl-pt-main-hero__title { font-size: var(--cl-fs-40); } .cl-portal .cl-pt-main-hero__lead { font-size: var(--cl-fs-17); } }`,
    markup: '`resources/views/portal/main` 첫 화면에서 `.cl-pt-art` 그림 5개, `.cl-pt-chip`, `.cl-pt-product__note` 2개를 지운다. 제목의 `<span class="cl-pt-grad-text">` 를 벗긴다(글자만 남김). 그림 파일(visual-hat · visual-book · solution-cloud · intro-benefit-star)은 메인에서 더 쓰지 않는다',
    targets: ['.cl-pt-main-hero__title', '.cl-pt-product__frame'],
    note: '"평균 진도율 93%" · "김하늘 선생님이 답했어요" 는 실제 값이 아닌 장식 숫자 · 장식 문장이다. 처음 온 사람이 실제 데이터로 읽을 수 있어 뺀다. 피그마 시안의 3D 그림 레이어 이름이 "Gemini_Generated_Image" — AI 로 만든 그림이다.'
  },
  {
    id: 'PT6', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '메인 첫 화면 — 학생용 검색창을 글 링크로',
    current: '원장님에게 말하는 첫 화면 한가운데, [무료 상담 신청] · [학원 개설 신청] 아래에 학생용 큰 검색창("학생이라면, 다니는 학원을 찾아보세요" + [찾기])이 있다. 행동이 세 갈래로 나뉘고 검색창이 두 버튼보다 넓어 시선을 가져간다',
    next: '검색창을 빼고 두 버튼 아래에 한 줄 "학생이라면 **다니는 학원 찾기**" 링크(→ 학원 목록)를 둔다. 학생 길은 남기고 첫 화면의 주인공은 원장님 행동 두 개',
    dom: `var f = doc.querySelector('.cl-pt-main-hero .cl-pt-finder'); if (f) { var p = doc.createElement('p'); p.className = 'cl-pt-main-hero__student'; p.innerHTML = '학생이라면 <a class="cl-link" href="#">다니는 학원 찾기</a>'; f.replaceWith(p); }`,
    css: `.cl-portal .cl-pt-main-hero__student { margin-top: var(--cl-space-4); font-size: var(--cl-fs-15); color: var(--cl-ink-muted); }
.cl-portal .cl-pt-main-hero__student .cl-link { font-weight: 600; }`,
    markup: '첫 화면의 `<form class="cl-pt-finder">` 를 지우고 `<p class="cl-pt-main-hero__student">학생이라면 <a class="cl-link" href="/portal/org">다니는 학원 찾기</a></p>` 를 둔다. 학원 목록 화면의 검색은 그대로',
    targets: ['.cl-pt-main-hero__student'],
    note: '점검 M7.'
  },
  {
    id: 'PT7', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '로고 띠 — "클라우드러닝" 글자 대신 실제 학원 로고',
    current: '고객사 로고 자리에 "클라우드러닝" 글자 알약 두 개만 60초 동안 옆으로 흐른다(`cl-pt-marquee`). 처음 온 사람에게는 비어 있는 자리처럼 보인다',
    next: '실제 이용 학원 로고 13개(운영 포털 학원 목록 위에서부터, 2026.10.29)를 회색조로 가지런히 놓는다. 흐르지 않는다. 위에 작은 제목 "클라우드러닝을 쓰는 학원". 로고는 학원이 올린 그림 그대로, 크기만 높이 32 로 맞춘다',
    dom: `var s = doc.querySelector('.cl-pt-logos'); if (s) {
  var L = [['megastudy','메가스터디학원'],['gakin','각인학원'],['daechi-sangsang','대치상상학원'],['vision','언어비전국어전문학원'],['dashnaru','대시나루국어학원'],['cea','최은미영어학원'],['yunsam','윤쌤영어'],['primeleaders','프라임리더스'],['aaa','에이에이에이유학'],['baekryeon','백련수학전문학원'],['bong','봉국어학원'],['banhada','반하다학원'],['learnershigh','러너스하이수학학원']];
  s.className = 'cl-pt-logos cl-pt-gutter'; s.setAttribute('aria-labelledby', 'pt-logos-title'); s.removeAttribute('aria-label');
  s.innerHTML = '<h2 id="pt-logos-title" class="cl-pt-logos__title">클라우드러닝을 쓰는 학원</h2><ul class="cl-pt-logos__grid">' + L.map(function (x) { return '<li><img src="../img/portal/logos/' + x[0] + '.png" alt="' + x[1] + '" loading="lazy"></li>'; }).join('') + '</ul>';
}`,
    css: `.cl-portal .cl-pt-logos { padding: var(--cl-space-7) var(--cl-pub-gutter); border-bottom: 1px solid var(--cl-hairline); display: flex; flex-direction: column; align-items: center; gap: var(--cl-space-5); }
.cl-portal .cl-pt-logos__title { font-size: var(--cl-fs-15); font-weight: 500; color: var(--cl-ink-muted); }
.cl-portal .cl-pt-logos__grid { width: 100%; margin: 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; justify-content: center; gap: var(--cl-space-6) var(--cl-space-5); }
.cl-portal .cl-pt-logos__grid li { flex: 0 0 144px; height: var(--cl-space-7); display: grid; place-items: center; }
/* 가로로 긴 로고는 폭 128 에서, 네모난 로고는 높이 48 에서 멈춘다 — 둘이 비슷한 무게로 보인다 */
.cl-portal .cl-pt-logos__grid img { display: block; max-height: var(--cl-space-7); max-width: 128px; width: auto; height: auto; object-fit: contain; filter: grayscale(1) contrast(1.25); mix-blend-mode: multiply; }
@media (max-width: 600px) { .cl-portal .cl-pt-logos__grid { gap: var(--cl-space-4); } .cl-portal .cl-pt-logos__grid li { flex-basis: calc((100% - var(--cl-space-4) * 2) / 3); } .cl-portal .cl-pt-logos__grid img { max-height: var(--cl-space-5); max-width: 96px; } }`,
    markup: '`<section class="cl-pt-logos">` 의 흐르는 줄(`.cl-pt-logos__track`)을 `<h2 class="cl-pt-logos__title">` + `<ul class="cl-pt-logos__grid"><li><img alt="학원 이름"></li>…</ul>` 로 바꾼다. 로고는 학원 목록과 같은 학원 이미지(`OrgImage` · `OrgGroupImage`)를 쓰고, 이미지가 없는 학원은 넣지 않는다. 순서는 학원 목록과 같게. `@keyframes cl-pt-marquee` 는 지운다',
    server: '메인에 보낼 학원 로고 목록: 운영 중이고 로고 이미지가 있는 학원을 학원 목록 순서대로 12~16개. 간판 사진 · 전화번호가 든 그림 · 흰 로고(흰 바탕에서 안 보임)는 빼는 표시가 있으면 좋다',
    targets: ['.cl-pt-logos'],
    note: '사용자 확인(2026.10.29): 운영 포털(cloudlearning.atedu.co.kr/portal/org) 위에서부터 써도 됨. 실험실에는 저장된 목록 안에 있던 13곳을 넣었다 — 전공시학원(흰 로고) · MY1연세수학(간판 사진) · 폴잉글리쉬(전화번호 간판)는 뺐다. 회색조 + 흰 바탕 합치기(multiply)로 로고마다 다른 색 · 흰 바탕이 띠처럼 보이지 않게 했다.'
  },
  {
    id: 'PT8', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '숫자 띠 — "누적 이용 학원 107곳" · 파스텔 카드 대신 선',
    current: '숫자 4개가 각각 보라 · 파랑 · 주황 · 초록 파스텔 카드에 3D 그림(요술봉 · 학사모 · 책)과 함께 있다. 첫 칸 "107 학원 · 지난 1년간 76개 학원이 새로 선택" — 107 은 누적인데 "학원" 으로만 써서 지금 이용 학원 수로 읽힌다. "76개" 는 그래프(2024년 60 → 107, 47곳)와 맞지 않는다',
    next: '카드 · 그림을 빼고 네 칸을 위 옅은 선 하나로 나눈다. 숫자는 검정 한 색. 첫 칸은 **"107 · 누적 이용 학원"**, 확인 안 된 "지난 1년간 76개" 문장은 뺀다. 나머지 세 칸 문장은 그대로',
    dom: `var st = doc.querySelectorAll('.cl-pt-stat'); if (st[0]) { var s = st[0].querySelector('strong'); if (s) s.textContent = '누적 이용 학원'; var sp = st[0].querySelector('span'); if (sp) sp.textContent = '2022년부터 클라우드러닝을 쓴 학원'; }
doc.querySelectorAll('.cl-pt-stat img').forEach(function (i) { i.remove(); });`,
    css: `.cl-portal .cl-pt-stats { gap: var(--cl-space-5); }
.cl-portal .cl-pt-stat { padding: var(--cl-space-5) 0 0; border-radius: 0; background: none; border-top: 1px solid var(--cl-hairline); gap: var(--cl-space-1); }
.cl-portal .cl-pt-stat b { margin-top: 0; font-size: var(--cl-fs-56); font-weight: 700; letter-spacing: -0.025em; color: var(--cl-ink); }
.cl-portal .cl-pt-stat strong { margin-top: var(--cl-space-2); font-size: var(--cl-fs-17); }
.cl-portal .cl-pt-stat span { font-size: var(--cl-fs-14); color: var(--cl-ink-muted); }
@media (max-width: 600px) { .cl-portal .cl-pt-stat b { font-size: var(--cl-fs-40); } }`,
    markup: '숫자 카드의 `.cl-pt-stat--violet/blue/orange/green` 과 `<img>` 를 지운다. 첫 칸 이름 "학원" → "누적 이용 학원", 설명 "지난 1년간 N개 학원이 새로 선택" → "2022년부터 클라우드러닝을 쓴 학원"',
    server: '107 은 누적 이용 학원 수(지금 이용 중 51곳, 사용자 2026.10.29). "지난 1년간 N개" 를 다시 쓰려면 같은 기준(누적)으로 계산한 값인지 확인한다',
    targets: ['.cl-pt-stats'],
    note: '점검 M1 · M8. 피그마 시안 「2 count-up」처럼 카드 없이 숫자 · 이름 · 설명만 둔다. 시안의 회색 선 아이콘은 넣지 않았다 — 숫자가 이미 충분히 크고, 아이콘 네 개가 더해지면 아이콘 카드 줄이 다시 생긴다.'
  },
  {
    id: 'PT9', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '성장 그래프 — 학원 수 마지막 값 66 → 107 · "누적" · 출처 한 줄',
    current: '"운영 학원 수" 그래프가 10 → 33 → 60 → **66** 으로 끝난다. 바로 위 숫자 띠는 107 이라 한 화면 안에서 숫자가 다르다. 두 그래프 모두 선 아래 그라데이션 채움, 학생 수는 파랑. 출처가 없다',
    next: '그래프 이름을 "누적 학원 수" 로, 마지막 값을 **107** 로(피그마 시안과 같은 값, 점 위치 다시 계산). 두 그래프 모두 보라 선 하나, 아래 채움 없음. 그래프 아래 오른쪽에 "데이터 기준: 2022년~현재 클라우드러닝 서비스 운영 데이터" 한 줄',
    dom: `var ch = doc.querySelectorAll('.cl-pt-chart');
if (ch[0]) { var c = ch[0], cap = c.querySelector('figcaption strong'); if (cap) cap.textContent = '누적 학원 수';
  var svg = c.querySelector('svg'); svg.setAttribute('aria-label', '누적 학원 수: 2022년 10곳, 2023년 33곳, 2024년 60곳, 현재 107곳');
  var Y = [120.3, 98.0, 71.8, 26.3], X = [20, 113, 206, 290];
  svg.querySelector('polyline').setAttribute('points', X.map(function (x, i) { return x + ',' + Y[i]; }).join(' '));
  svg.querySelectorAll('circle').forEach(function (k, i) { k.setAttribute('cy', Y[i]); });
  svg.querySelectorAll('text').forEach(function (t, i) { t.setAttribute('y', Y[i] - 10); if (i === 3) t.textContent = '107'; }); }
var box = doc.querySelector('.cl-pt-charts'); if (box && !doc.querySelector('.cl-pt-charts__source')) { var p = doc.createElement('p'); p.className = 'cl-pt-charts__source'; p.textContent = '데이터 기준: 2022년~현재 클라우드러닝 서비스 운영 데이터'; box.after(p); }`,
    css: `.cl-portal .cl-pt-chart { box-shadow: var(--cl-ring); padding: var(--cl-space-5); }
.cl-portal .cl-pt-chart svg path[fill^="url"] { display: none; }
.cl-portal .cl-pt-chart svg polyline, .cl-portal .cl-pt-chart svg g[stroke] { stroke: var(--cl-primary); }
.cl-portal .cl-pt-chart svg text[font-weight] { fill: var(--cl-primary-pressed); }
.cl-portal .cl-pt-chart__axis { font-size: var(--cl-fs-13); }
.cl-portal .cl-pt-charts__source { margin-top: calc(var(--cl-space-4) * -1); align-self: flex-end; font-size: var(--cl-fs-13); color: var(--cl-ink-muted); }`,
    markup: '그래프 이름 "운영 학원 수" → "누적 학원 수". 그래프 그리는 쪽에서 학원 수 마지막 점을 숫자 띠와 같은 누적 값(107)으로 넣는다(66 은 다른 기준으로 센 값으로 보인다). 선 아래 `<path fill="url(#…)">` 와 `<linearGradient>` 를 지우고 두 그래프 선 · 점 색을 `--cl-primary` 로. 그래프 묶음 아래 `<p class="cl-pt-charts__source">` 추가',
    server: '그래프의 "현재" 학원 수를 숫자 띠와 같은 누적 기준으로. 지금 66 이 어떤 기준(이번 달 이용? 결제?)인지 확인 필요',
    targets: ['.cl-pt-charts', '.cl-pt-charts__source'],
    note: '사용자 결정(2026.10.29): "누적 이용 학원 107곳", 그래프 마지막 값 107. 피그마 「6 성장 추이」 시안의 출처 줄을 다시 넣었다.'
  },
  {
    id: 'PT10', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '영문 작은 제목 6개 빼기',
    current: '섹션 제목마다 위에 작은 영문 보라 글자 — GROWTH · WHY CLOUDLEARNING · A DAY ON CLOUDLEARNING · e-SEODANG 2.0 · PRICING · REVIEWS. 바로 아래 한국어 제목과 같은 말을 한 번 더 한다',
    next: '모두 뺀다. 한국어 제목만 둔다',
    dom: `doc.querySelectorAll('.cl-pt-main .cl-pt-eyebrow').forEach(function (e) { e.remove(); });`,
    css: `.cl-portal .cl-pt-main .cl-pt-eyebrow { display: none; }`,
    markup: '메인의 `<span class="cl-pt-eyebrow">` 6개를 지운다',
    targets: ['.cl-pt-h2'],
    note: '점검 M5. 공개 화면 규칙 9장 "같은 말을 두 번 쓰지 않는다".'
  },
  {
    id: 'PT11', group: 10, status: '제안', kind: 'CSS', layer: '화면별', screens: ['p-main'],
    title: '섹션 제목 · 큰 글자 크기를 토큰으로',
    current: '제목 크기가 화면 폭에 따라 늘어나는 값이다(첫 제목 83.52 · 섹션 47.52 · 하루 31.68 · 상담 63.36 · 요금 79.2px). 자간 -0.045em 로 너무 좁다. 글자 크기 단계가 8개 넘게 쓰인다',
    next: '고정 단계 토큰으로: 섹션 제목 40(`--cl-fs-40`, 휴대폰 28), 하루 제목 28(휴대폰 22), 요금 72(휴대폰 40), 상담 제목 56(휴대폰 32). 자간은 -0.025em 하나',
    css: `.cl-portal .cl-pt-h2 { font-size: var(--cl-fs-40); line-height: 1.25; letter-spacing: -0.025em; }
.cl-portal .cl-pt-day__text h3 { font-size: var(--cl-fs-28); letter-spacing: -0.025em; }
.cl-portal .cl-pt-pricing__amount { font-size: var(--cl-fs-72); letter-spacing: -0.025em; }
.cl-portal .cl-pt-consult__text h2 { font-size: var(--cl-fs-56); letter-spacing: -0.025em; line-height: 1.15; }
@media (max-width: 600px) { .cl-portal .cl-pt-h2 { font-size: var(--cl-fs-28); } .cl-portal .cl-pt-day__text h3 { font-size: var(--cl-fs-22); } .cl-portal .cl-pt-pricing__amount { font-size: var(--cl-fs-40); } .cl-portal .cl-pt-consult__text h2 { font-size: var(--cl-fs-32); } }`,
    targets: ['.cl-pt-h2', '.cl-pt-pricing__amount'],
    note: '점검 M11. 1차 규칙 "CSS 의 글자 크기는 모두 변수로" (2026.10.28).'
  },
  {
    id: 'PT12', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '고민 → 해결 — 3D 아이콘과 색 다른 카드 정리',
    current: '고민 카드 4개가 각각 보라 · 파랑 · 주황 · 초록 바탕에 3D 아이콘(서류철 · 말풍선 · 파일 · 책 더미)을 얹고, 큰 카드는 검정 바탕에 보라 아이콘 네모 + 실제 진도율 화면',
    next: '3D 아이콘 · 아이콘 네모를 뺀다. 작은 카드 4개는 흰 바탕 하나(회백색 띠 위), 고민 문장은 보조 글자, 해결 문장은 검정 굵게. 큰 카드의 실제 화면 캡처는 그대로 둔다 — 이 섹션에서 유일한 그림',
    dom: `doc.querySelectorAll('.cl-pt-bento__card > img, .cl-pt-bento__icon').forEach(function (e) { e.remove(); });`,
    css: `.cl-portal .cl-pt-bento__card { background: var(--cl-canvas); padding: var(--cl-space-6); gap: var(--cl-space-3); }
.cl-portal .cl-pt-bento__card .cl-pt-bento__quote { color: var(--cl-ink-muted); }
.cl-portal .cl-pt-bento__lead { padding: var(--cl-space-6); }
.cl-portal .cl-pt-bento__lead .cl-pt-bento__quote { color: var(--cl-on-ink-muted); }`,
    markup: '`.cl-pt-bento__card` 의 `<img>` 4개, 큰 카드의 `.cl-pt-bento__icon` 을 지운다. 카드 색 클래스(`--violet/blue/orange/green`)도 지운다',
    targets: ['.cl-pt-bento'],
    note: '점검 M4 · M8.'
  },
  {
    id: 'PT13', group: 10, status: '제안', kind: 'CSS', layer: '화면별', screens: ['p-main'],
    title: '클라우드러닝의 하루 — 번호는 남기고 그라데이션 · 색 판 빼기',
    current: '01 ~ 04 번호가 80px 보라→파랑 그라데이션 글자. 화면 캡처 틀 바탕이 보라 · 파랑 · 주황 · 초록으로 하나씩 다르다',
    next: '하루 흐름은 실제 순서라 **번호는 남긴다**. 그라데이션을 빼고 보라 한 색 24px 로 작게. 캡처 틀은 회백색 하나(16), 캡처에는 그림자 대신 옅은 선',
    css: `.cl-portal .cl-pt-day__num { font-size: var(--cl-fs-24); font-weight: 700; letter-spacing: 0; background: none; -webkit-background-clip: border-box; background-clip: border-box; color: var(--cl-primary-pressed); }
.cl-portal .cl-pt-day__shot { background: var(--cl-parchment); padding: var(--cl-space-5); }
.cl-portal .cl-pt-day__shot img { box-shadow: var(--cl-ring); }
.cl-portal .cl-pt-day__text p { color: var(--cl-ink-2); }`,
    markup: '캡처 틀 색 클래스(`.cl-pt-day__shot--violet/blue/orange/green`)를 지운다',
    targets: ['.cl-pt-day__num', '.cl-pt-day__shot'],
    note: '번호는 장식이 아니라 순서 정보라서 남겼다(frontend-design 기준: 순서가 있는 내용에만 번호).'
  },
  {
    id: 'PT14', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '이서당 2.0 — 장비 사진 넣기 · 평면 바탕 · 단계 정리',
    current: '어두운 띠에 파란 빛 번짐(radial-gradient), 아이콘 카드 4개(STEP 1~4)만 있고 그림이 없다 — 무엇을 설치하는지 안 보인다. 4단계 카드만 보라로 꽉 채웠다. "STEP 4" 회색 글자 대비 3.6:1',
    next: '바탕은 검정 단색(`--cl-surface-dark`). 제목 옆에 **피그마 「e-Seodang Classroom」 장비 그림**(키오스크 · 노트북 · 휴대폰 · 카메라 2대)을 흰 판(16) 위에. 단계 4개는 카드 대신 위 선으로 나누고, 번호는 "1단계" 처럼 한국어로, 4단계도 다른 단계와 같은 모양',
    dom: `var sd = doc.querySelector('.cl-pt-seodang'); if (sd && !sd.querySelector('.cl-pt-seodang__media')) {
  var head = sd.querySelector('.cl-pt-seodang__head'); var wrap = doc.createElement('div'); wrap.className = 'cl-pt-seodang__top';
  head.before(wrap); wrap.append(head);
  var fig = doc.createElement('figure'); fig.className = 'cl-pt-seodang__media';
  fig.innerHTML = '<img src="../img/portal/eseodang-classroom.png" alt="이서당 2.0 키오스크, 강사추적 카메라, 고정형 카메라와 노트북 · 휴대폰 강의 화면" width="527" height="302">';
  wrap.append(fig);
  sd.querySelectorAll('.cl-pt-seodang__no').forEach(function (n, i) { n.textContent = (i + 1) + '단계'; });
  sd.querySelectorAll('.cl-pt-seodang__step.is-final').forEach(function (s) { s.classList.remove('is-final'); });
}`,
    css: `.cl-portal .cl-pt-seodang { background: var(--cl-surface-dark); }
.cl-portal .cl-pt-seodang__top { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; gap: var(--cl-space-7); }
.cl-portal .cl-pt-seodang__head p { color: var(--cl-on-ink-muted); }
.cl-portal .cl-pt-seodang__media { margin: 0; padding: var(--cl-space-5); border-radius: var(--cl-radius-xl); background: var(--cl-canvas); }
.cl-portal .cl-pt-seodang__media img { display: block; width: 100%; height: auto; }
.cl-portal .cl-pt-seodang__steps { gap: var(--cl-space-5); }
.cl-portal .cl-pt-seodang__step { padding: var(--cl-space-4) 0 0; border-radius: 0; background: none; box-shadow: none; border-top: 1px solid var(--cl-ink-2); gap: var(--cl-space-2); }
.cl-portal .cl-pt-seodang__icon { width: auto; height: auto; background: none; color: var(--cl-primary-on-dark); justify-content: start; }
.cl-portal .cl-pt-seodang__no { color: var(--cl-on-ink-muted); font-size: var(--cl-fs-14); }
.cl-portal .cl-pt-seodang__step strong { font-size: var(--cl-fs-17); }
@media (max-width: 900px) { .cl-portal .cl-pt-seodang__top { grid-template-columns: 1fr; } }`,
    markup: '이서당 섹션 머리를 `<div class="cl-pt-seodang__top">` 로 감싸 [제목 · 설명 | 장비 그림] 두 칸으로. 그림은 피그마 파일 "클라우드러닝-new" 노드 `62:240`(e-Seodang Classroom)을 PNG 2배로 내보내 `public/images/cloudlearning/portal/eseodang-classroom@2x.png` 로 둔다(실험실 그림은 1배 527×302 미리보기용). 단계 글자 "STEP N" → "N단계", 4단계 `is-final` 지움',
    targets: ['.cl-pt-seodang__media', '.cl-pt-seodang__steps'],
    note: '사용자 결정(2026.10.29): 이서당 장비 사진은 피그마 e-Seodang Classroom 사용. 같은 시안의 3D 교실 · 헤드폰 학생 그림(레이어 이름 Gemini_Generated_Image)은 쓰지 않는다.'
  },
  {
    id: 'PT15', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '요금 띠 — 그라데이션 테두리 · 3D 그림 빼기',
    current: '요금 상자를 보라→파랑 그라데이션 2px 테두리(`.cl-pt-gborder`)로 감쌌다. 저장 공간 · 트래픽 칸이 보라 · 파랑 바탕에 3D 파이 차트 · 그래프 그림. 링크 끝에 화살표 글자 "→"',
    next: '옅은 선 테두리 상자(8) 하나. 두 칸은 회백색 바탕에 숫자만. 링크는 공통 `cl-link`, 글자 "→" 는 뺀다',
    dom: `doc.querySelectorAll('.cl-pt-quota__tile img').forEach(function (i) { i.remove(); });
doc.querySelectorAll('.cl-pt-pricing .cl-pt-link').forEach(function (a) { a.className = 'cl-link'; a.textContent = a.textContent.replace(/\\s*→\\s*$/, ''); });`,
    css: `.cl-portal .cl-pt-gborder { padding: 0; background: none; box-shadow: var(--cl-ring); }
.cl-portal .cl-pt-quota__tile { background: var(--cl-parchment); color: var(--cl-ink); }
.cl-portal .cl-pt-quota__tile span { color: var(--cl-ink-muted); font-weight: 500; }
.cl-portal .cl-pt-pricing__side .cl-link { font-size: var(--cl-fs-16); font-weight: 600; }`,
    markup: '`.cl-pt-gborder` 를 지우고 안쪽 `.cl-pt-pricing` 에 옅은 선 테두리를 준다. `.cl-pt-quota__tile` 의 `<img>` 2개, 색 클래스(`--violet/blue`)를 지운다. "요금제 자세히 보기 →" → "요금제 자세히 보기"(`cl-link`)',
    targets: ['.cl-pt-pricing', '.cl-pt-quota'],
    note: '점검 M3 · M4.'
  },
  {
    id: 'PT16', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '후기 — 별 다섯 개 · 인물 사진 빼기',
    current: '후기 3개 모두 별 5개 + 모델 같은 인물 사진 + 이름 대신 "입시 전문 선생님" 같은 설명. 누가 말했는지 알 수 없는데 별점과 사진이 붙어 있어 지어낸 후기처럼 보인다',
    next: '별점과 사진을 뺀다. 후기 글과 "입시 전문 선생님 · 고등 수학 · 10년 차" 만 둔다. 카드는 흰 바탕 하나',
    dom: `doc.querySelectorAll('.cl-pt-review__stars, .cl-pt-review figcaption img').forEach(function (e) { e.remove(); });`,
    css: `.cl-portal .cl-pt-review { padding: var(--cl-space-6); gap: var(--cl-space-5); }
.cl-portal .cl-pt-review blockquote { margin: 0; color: var(--cl-ink); }`,
    markup: '후기 카드의 `.cl-pt-review__stars` 와 `figcaption img` 를 지운다. 사진 파일 academy-stories-teacher-01~03 은 쓰지 않는다',
    server: '학원 이름을 밝혀도 되는 실제 후기가 생기면 "학원 이름 · 과목" 으로 바꾼다(지금은 익명)',
    targets: ['.cl-pt-reviews'],
    note: '점검 M9. 실제 후기인지, 학원 이름을 써도 되는지는 아직 확인 전 — 확인되면 학원 이름을 넣는 쪽이 가장 믿음이 간다.'
  },
  {
    id: 'PT17', group: 10, status: '제안', kind: '마크업', layer: '화면별', screens: ['p-main'],
    title: '마지막 상담 띠 — 보라 그라데이션 판 · 무지개 · 종이비행기 빼기',
    current: '마지막 띠가 보라→파랑 그라데이션 + 흰 빛 번짐, 왼쪽 위 무지개 그림, 제목 아래 3D 종이비행기. 제목 63px 굵기 800',
    next: '연보라 단색 판(`--cl-primary-tint`)에 검정 글자. 무지개 · 비행기를 뺀다. 오른쪽 상담 창은 흰 바탕 + 옅은 선 그대로(AI 상담 기능은 바꾸지 않음)',
    dom: `doc.querySelectorAll('.cl-pt-consult__rainbow, .cl-pt-consult__plane').forEach(function (e) { e.remove(); });`,
    css: `.cl-portal .cl-pt-consult { background: var(--cl-primary-tint); color: var(--cl-ink); }
.cl-portal .cl-pt-consult__text h2 { font-weight: 700; }
.cl-portal .cl-pt-consult__text p { color: var(--cl-ink-2); font-size: var(--cl-fs-18); }
.cl-portal .cl-pt-consult__text a { color: var(--cl-primary-pressed); }
.cl-portal .cl-chat.cl-pt-consult__chat { box-shadow: var(--cl-ring); }
.cl-portal .cl-pt-float__ai { box-shadow: var(--cl-shadow-float); }`,
    markup: '`.cl-pt-consult__rainbow` · `.cl-pt-consult__plane` 그림을 지운다. 떠 있는 [AI 상담] 버튼 그림자는 보라 빛 대신 공통 `--cl-shadow-float`',
    targets: ['.cl-pt-consult'],
    note: '점검 M3 · M4 · M6. 상담 창(portal-chat.css) 안쪽은 1차 공통 부품과 맞는지 고객센터 화면에서 같이 본다.'
  }
]);
