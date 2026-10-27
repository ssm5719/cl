/* 클라우드러닝 작업공간 수정안 — 이 파일 하나가 실험실 화면과 개발자 전달 내용을 같이 만든다.
   css  : 원본 CSS 뒤에 붙는 규칙 (개발자에게는 fixes.css 로 모아 전달)
   dom  : 마크업을 바꿔야 하는 수정. 실험실에서는 이 스크립트로 흉내 내고, 개발자에게는 설명(markup)을 전달한다.
   status: 제안 · 확정 · 보류 */
window.LAB_FIXES = [
  {
    id: 'T1', group: 7, status: '확정', kind: '토큰', screens: ['all', 'teacher-read', 'teacher-edit', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order'],
    title: '토큰 추가 · 분리 (화면 변화 없음)',
    current: '`#fff` 23곳 직접 값, `cl-primary` 하나로 버튼 배경과 글자를 같이 씀',
    next: '`cl-on-ink` #FFFFFF 추가, `cl-primary-fill` #904AE8 / `cl-primary-text` #7A35D0 로 나눔, 직접 값 6종 토큰화',
    css: `.cl-scope {
  --cl-on-ink: #FFFFFF;              /* 진한 배경(보라 · 먹색 · 빨강) 위 글자 */
  --cl-primary-fill: var(--cl-primary);        /* 주 버튼 배경 · 포커스 · 그래프 막대 */
  --cl-primary-text: var(--cl-primary-pressed);        /* 링크 · 현재 메뉴 · 연보라 위 글자 (흰 배경 6.47:1) */
  --cl-primary-tint-hover: #EADDFB;
  --cl-danger-pressed: #A8191A;
  --cl-row-hover: #FAFAFB;
  --cl-track: #ECECEF;
  --cl-nav-hover: #EFEFF1;
  --cl-scrim: rgba(0, 0, 0, .4);
}
.cl-btn--primary, .cl-btn--danger, .cl-chip[aria-pressed="true"],
.cl-pagination__page.is-current, .cl-toast, .cl-selbar, .cl-selbar__btn, .cl-selbar__close,
.cl-avatar, .cl-ws-brand__mark { color: var(--cl-on-ink); }
.cl-btn--danger:hover { background: var(--cl-danger-pressed); }
.cl-btn--tint:hover, .cl-ws-term:hover { background: var(--cl-primary-tint-hover); }
.cl-table tbody tr:hover { background: var(--cl-row-hover); }
.cl-ws-nav__item:hover, .cl-ws-rail__item:hover { background: var(--cl-nav-hover); }
.cl-pd-mini, .cl-pd-bar, .cl-ta-meter { background: var(--cl-track); }
.cl-dialog::backdrop { background: var(--cl-scrim); }`,
    targets: [],
    note: '값이 같아서 화면은 그대로다. 다크모드 전에 해 두는 정리.'
  },
  {
    id: 'A1', group: 1, status: '확정', kind: '마크업', screens: ['courses', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg'],
    title: '강좌 관리: 검색 · 보기 전환을 도구 줄로',
    current: '검색 칸과 보기 전환이 제목 줄에 있고, 쪽마다 선택은 표 아래',
    next: '제목 줄에는 [강좌 생성]만. 탭 아래 도구 줄: 검색(왼쪽) · 보기 전환 · 강좌 수(오른쪽)',
    markup: '`.cl-page__head` 안의 `form.cl-tc-search` 와 `.cl-segmented[data-view-toggle]` 를 탭(`.cl-tabs`) 아래 새 `<div class="cl-toolbar">` 로 옮긴다. 순서: 검색 → `cl-toolbar__spacer` → 보기 전환 → 강좌 수(`.cl-muted`).',
    dom: `const head=doc.querySelector('.cl-page__head'), tabs=doc.querySelector('.cl-tabs');
if(!head||!tabs) return;
const bar=doc.createElement('div'); bar.className='cl-toolbar';
const f=head.querySelector('.cl-tc-search'), v=head.querySelector('[data-view-toggle]');
const sp=doc.createElement('span'); sp.className='cl-toolbar__spacer';
const n=doc.createElement('span'); n.className='cl-muted'; n.textContent='강좌 1개';
if(f) bar.append(f); bar.append(sp); if(v) bar.append(v); bar.append(n);
tabs.after(bar);`,
    targets: ['.cl-toolbar']
  },
  {
    id: 'A2', group: 1, status: '확정', kind: '마크업', screens: ['teachers'],
    title: '선생님 목록: 보기 전환을 도구 줄로',
    current: '보기 전환이 제목 줄에 [노출 순서] · [선생님 생성]과 같이 있음',
    next: '도구 줄 오른쪽, 선생님 수 앞',
    markup: '`.cl-page__head` 의 `[data-view-toggle]` 을 `.cl-toolbar` 의 `[data-summary]` 앞으로 옮긴다.',
    dom: `const v=doc.querySelector('.cl-page__head [data-view-toggle]'), s=doc.querySelector('.cl-toolbar [data-summary]');
if(v&&s) s.before(v);`,
    targets: ['.cl-toolbar [data-view-toggle]']
  },
  {
    id: 'A3', group: 1, status: '확정', kind: '마크업', screens: ['courses', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg'],
    title: '강좌 관리: 상위 메뉴 · 설명 줄 추가',
    current: '상위 메뉴와 설명이 없다',
    next: '상위 메뉴 "나의 강좌", 설명 한 줄',
    markup: '제목 위에 `<p class="cl-page__parent">나의 강좌</p>`, 머리 아래에 `<p class="cl-page__meta">` 한 줄을 넣는다. 설명 문구는 위 문장 그대로 쓴다 (정함 · 2026-10-22).',
    dom: `const h=doc.querySelector('.cl-page__head'), t=h&&h.querySelector('.cl-page__title');
if(!t) return; const w=doc.createElement('div'); t.before(w);
const p=doc.createElement('p'); p.className='cl-page__parent'; p.textContent='나의 강좌'; w.append(p,t);
const m=doc.createElement('p'); m.className='cl-page__meta'; m.textContent='강좌를 누르면 강의 · 수강생 · 커뮤니티를 관리할 수 있습니다.'; h.after(m);`,
    targets: ['.cl-page__parent', '.cl-page__meta']
  },
  {
    id: 'A4', group: 1, status: '확정', kind: 'CSS', screens: ['students', 'teachers', 'subjects', 'courses', 'admins', 'groups', 'course-list', 'contents', 'cms', 'board', 'alarm', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn'],
    title: '화면 머리: 설명과 다음 줄 사이 띄우기 (모든 화면)',
    current: '설명(`cl-page__meta`) 바로 아래 4px 만에 탭 · 도구 줄이 붙어서 한 덩어리로 보인다',
    next: '설명 아래 `cl-space-5` 24px. 설명이 없는 화면은 머리 아래 기존 20px 그대로',
    css: `.cl-page__meta { margin-bottom: var(--cl-space-5); }`,
    targets: ['.cl-page__meta']
  },
  {
    id: 'A5', group: 1, status: '확정', kind: 'CSS', screens: ['students', 'courses', 'groups', 't-learn', 'group-create-dlg', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-learn-excel', 's-assign'],
    title: '탭: 글자 통일 · 간격 넓히기 · 개수 배지',
    current: '탭 이름 14px 600, 개수 12px 500 회색 글자, 탭 사이 2px',
    next: '탭 이름 14px 600 그대로(`cl-fs-ui`, 누르는 글자라 두께 유지). 탭 사이 `cl-space-2` 8px. 개수는 회색 알약 배지(12px 600), 고른 탭은 먹색 배지, 처리할 일이 있는 탭(대기)만 주의 색 배지',
    css: `.cl-tabs { gap: var(--cl-space-2); }
.cl-tab { font-size: var(--cl-fs-ui); }
.cl-tab__count { min-width: 20px; height: 20px; padding: 0 6px; border-radius: var(--cl-radius-pill); background: var(--cl-hover); color: var(--cl-ink-2); font-size: var(--cl-fs-micro); font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }
.cl-tab[aria-selected="true"] .cl-tab__count, .cl-tab[aria-current="page"] .cl-tab__count { background: var(--cl-ink); color: var(--cl-canvas); }
.cl-tab__count[data-tone="warning"] { background: var(--cl-warning-bg); color: var(--cl-warning); }`,
    markup: '처리할 일이 있는 탭의 개수에만 `data-tone="warning"` 을 붙인다(학생 목록 "대기", 0이면 붙이지 않음). 승인 · 탈퇴 같은 상태 색은 탭에 쓰지 않는다.',
    dom: `doc.querySelectorAll('.cl-tab').forEach(t=>{if(t.firstChild&&t.firstChild.textContent.trim()==='대기'){const c=t.querySelector('.cl-tab__count'); if(c&&+c.textContent>0) c.dataset.tone='warning';}});`,
    targets: ['.cl-tabs']
  },
  {
    id: 'B1', group: 2, status: '확정', kind: 'CSS', screens: ['dashboard'],
    title: '대시보드 섹션 제목 16px',
    current: '`.cl-md-title` 14px 700 — 본문과 같은 크기',
    next: '`cl-fs-section-title` 16px 700',
    css: `.cl-md-title { font-size: var(--cl-fs-section-title); }`,
    targets: ['.cl-md-title']
  },
  {
    id: 'B2', group: 2, status: '확정', kind: 'CSS', screens: ['dashboard'],
    title: '차트 축 · 최대값 12px',
    current: '11px (글자 단계 밖)',
    next: '`cl-fs-micro` 12px',
    css: `.cl-chart__max, .cl-chart__axis { font-size: var(--cl-fs-micro); }`,
    targets: ['.cl-chart__axis', '.cl-chart__max']
  },
  {
    id: 'B3', group: 2, status: '확정', kind: 'CSS', screens: ['courses', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg'],
    title: '강좌 이름 14.5px → 14px',
    current: '`.cl-tc-course__title` 14.5px',
    next: '`cl-fs-ui` 14px 600',
    css: `.cl-tc-course__title { font-size: var(--cl-fs-ui); font-weight: 600; }`,
    targets: ['.cl-tc-course__title']
  },
  {
    id: 'C1', group: 3, status: '확정', kind: 'CSS', screens: ['courses', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg'],
    title: '상단 [새로 만들기]를 연보라로',
    current: '`cl-btn--primary` — 본문 [강좌 생성]과 꽉 찬 보라가 둘',
    next: '`cl-btn--tint` 모양 (배경 `cl-primary-tint`, 글자 `cl-primary-pressed`)',
    css: `.cl-ws-create__btn.cl-btn--primary { background: var(--cl-primary-tint); color: var(--cl-primary-pressed); }
.cl-ws-create__btn.cl-btn--primary:hover { background: #EADDFB; }`,
    markup: '가능하면 CSS 덮어쓰기 대신 버튼 클래스를 `cl-btn--primary` → `cl-btn--tint` 로 바꾼다.',
    targets: ['.cl-ws-create__btn']
  },
  {
    id: 'C2', group: 3, status: '확정', kind: '마크업', screens: ['teachers'],
    title: '선생님 목록: 이름을 첫 칸으로, 아이디는 보조 정보',
    current: '첫 칸 아이디(보라 · 700, 누르면 그 계정으로 들어감), 둘째 칸 이름',
    next: '첫 칸 이름(사진 + 600, 누르면 상세), 둘째 칸 아이디(400 `cl-ink-muted`, 누르는 동작 없음). 계정으로 들어가기는 행 메뉴에만',
    markup: '열 순서를 이름 · 아이디 · 휴대폰 · 과목 · 등급 · 등록일로 바꾼다. `data-primary` 를 이름 칸으로 옮기고 아이디 칸에 `data-label="아이디"`. 아이디는 `<button class="cl-mt-id">` 대신 `<span class="cl-muted cl-num">`.',
    dom: `const t=doc.querySelector('[data-teacher-manage] table'); if(!t) return;
const hr=t.querySelector('thead tr'); hr.insertBefore(hr.children[1], hr.children[0]);
t.querySelectorAll('tbody tr').forEach(tr=>{const id=tr.children[0], nm=tr.children[1];
  tr.insertBefore(nm,id); id.removeAttribute('data-primary'); id.setAttribute('data-label','아이디');
  nm.setAttribute('data-primary',''); nm.removeAttribute('data-label');
  const b=id.querySelector('.cl-mt-id'); if(b){const s=doc.createElement('span'); s.className='cl-muted cl-num'; s.textContent=b.textContent; b.replaceWith(s);} });`,
    targets: ['[data-teacher-manage] tbody td[data-primary]']
  },
  {
    id: 'C3', group: 3, status: '확정', kind: '마크업', screens: ['teachers', 'students'],
    title: '"미등록" 흐리게 · 휴대폰 하이픈',
    current: '"미등록"이 일반 글자색, 번호 01067060246',
    next: '"미등록"은 `cl-muted`, 번호 010-6706-0246',
    markup: '휴대폰 칸 출력 시 값이 없으면 `<span class="cl-muted">미등록</span>`, 있으면 3-4-4(또는 3-3-4)로 하이픈을 넣는다.',
    dom: `doc.querySelectorAll('td[data-label="휴대폰"]').forEach(td=>{const v=td.textContent.trim();
  if(v==='미등록'){td.innerHTML='<span class="cl-muted">미등록</span>';}
  else if(/^01\\d{8,9}$/.test(v)){td.textContent=v.length===11?v.replace(/(\\d{3})(\\d{4})(\\d{4})/,'$1-$2-$3'):v.replace(/(\\d{3})(\\d{3})(\\d{4})/,'$1-$2-$3');}});`,
    targets: ['td[data-label="휴대폰"]']
  },
  {
    id: 'C4', group: 3, status: '확정', kind: 'CSS', screens: ['subjects', 'subject-create-dlg'],
    title: '과목 목록: 강좌 이름 보라 굵게 해제',
    current: '강좌 이름이 `cl-mt-id`(700 · `cl-primary-pressed`)',
    next: '`cl-table__title` 과 같게: 600 `cl-ink`, hover 때만 `cl-primary-pressed`',
    css: `[data-subject-manage] .cl-mt-id { font-weight: 600; color: var(--cl-ink); }
[data-subject-manage] .cl-mt-id:hover { color: var(--cl-primary-pressed); }`,
    markup: '가능하면 강좌 이름 버튼 클래스를 `cl-mt-id` 대신 `cl-table__title` 로.',
    targets: ['[data-subject-manage] .cl-mt-id']
  },
  {
    id: 'D1', group: 4, status: '확정', kind: 'CSS', screens: ['dashboard'],
    title: '확인 필요: 상태마다 같은 배경 규칙',
    current: '주의만 `#FFF9F0`(`:first-child` 선택자 오류), 위험은 배경 없음',
    next: '주의 `cl-warning-bg`, 위험 `cl-danger-bg`',
    css: `.cl-md-need.is-warning:first-child { background: transparent; }
.cl-md-need.is-warning { background: var(--cl-warning-bg); }
.cl-md-need.is-danger { background: var(--cl-danger-bg); }`,
    targets: ['.cl-md-need']
  },
  {
    id: 'D2', group: 4, status: '확정', kind: 'CSS', screens: ['dashboard'],
    title: '확인 필요: 위험을 맨 위로',
    current: '들어온 순서 (위험이 가운데)',
    next: '위험 → 주의 → 그 밖',
    css: `.cl-md-needs__list > li:has(.is-danger) { order: -1; }`,
    markup: '가능하면 서버에서 위험 · 주의 순으로 정렬해서 내려준다.',
    targets: ['.cl-md-need.is-danger']
  },
  {
    id: 'D3', group: 4, status: '확정', kind: '마크업', screens: ['dashboard'],
    title: '갱신 안내를 숫자 띠로',
    current: '"전체 사용 용량은 매일 오전 9시에 갱신…" 이 확인 필요 구역 맨 아래',
    next: '숫자 띠 "전체 사용 용량" 보조 줄에 "매일 09시 갱신", 구역 아래 문장은 뺀다',
    markup: '`.cl-md-needs__note` 를 지우고, 전체 사용 용량 칸의 `.cl-md-kpi__sub` 에 집계 전이면 "아직 집계 전 · 매일 09시 갱신", 집계 후면 "매일 09시 갱신"을 넣는다.',
    dom: `const n=doc.querySelector('.cl-md-needs__note'); if(n) n.remove();
doc.querySelectorAll('.cl-kpi__item').forEach(it=>{const dt=it.querySelector('dt'); if(dt&&dt.textContent.trim()==='전체 사용 용량'){const s=it.querySelector('.cl-md-kpi__sub'); if(s) s.textContent='아직 집계 전 · 매일 09시 갱신';}});`,
    targets: ['.cl-md-kpi .cl-kpi__item:nth-child(5)']
  },
  {
    id: 'D4', group: 4, status: '확정', kind: 'CSS', screens: ['dashboard'],
    title: '빈 그래프를 가볍게',
    current: '182px 회색 상자(`cl-parchment`, 반경 8px)',
    next: '배경 없이 바닥선(`cl-grid-head`)만, 높이 160px, 문장은 `cl-ink-muted`',
    css: `.cl-chart--empty { min-height: 160px; background: transparent; border-radius: 0; border-bottom: 1px solid var(--cl-grid-head); }`,
    targets: ['.cl-chart--empty']
  },
  {
    id: 'D5', group: 4, status: '확정', kind: 'CSS', screens: ['dashboard'],
    title: '숫자 띠: 값을 위에 맞춰 정렬',
    current: '칸마다 `column-reverse` 로 아래부터 쌓여서, 보조 줄이 있는 칸(학생 · 전체 사용 용량 · 트래픽)만 값이 위로 밀린다. "—" 높이가 칸마다 다르다',
    next: '모든 칸을 위에서부터 값 → 이름 → 보조 줄 순서로 쌓는다. 값 줄 높이 고정(32px)',
    css: `.cl-md-kpi .cl-kpi__item { flex-direction: column; justify-content: flex-start; gap: 2px; }
.cl-md-kpi .cl-kpi__item dd { order: 0; min-height: 32px; display: flex; align-items: baseline; line-height: 32px; }
.cl-md-kpi .cl-kpi__item dt { order: 1; }
.cl-md-kpi .cl-md-kpi__sub { order: 2; }`,
    dom: `/* 실험실 예시 값: 학생 · 오늘 로그인 두 칸에 숫자가 들어온 모습 (개발 반영 대상 아님) */
const items=[...doc.querySelectorAll('.cl-md-kpi .cl-kpi__item')];
const fill=(name,val,unit,sub,cls)=>{const it=items.find(i=>i.querySelector('dt')?.textContent.trim()===name); if(!it) return;
  it.querySelector('dd').innerHTML=val+'<small>'+unit+'</small>';
  if(sub){let s=it.querySelector('.cl-md-kpi__sub'); if(!s){s=doc.createElement('span'); it.append(s);} s.className='cl-md-kpi__sub '+(cls||''); s.textContent=sub;}};
fill('학생','128','명','승인 대기 14','is-warning');
fill('오늘 로그인','47','회','어제보다 +6','is-up');`,
    targets: ['.cl-md-kpi'],
    note: '학생 128명 · 오늘 로그인 47회는 숫자가 들어왔을 때 모습을 보려고 넣은 예시 값입니다.'
  },
  {
    id: 'E1', group: 5, status: '확정', kind: 'CSS', screens: ['teachers'],
    title: '모바일 선생님 카드 5줄 → 2~3줄',
    current: '아이디 / 이름 · 휴대폰 / 과목 · 등급 / 등록일 / ⋯ (5줄)',
    next: '1줄: 사진 + 이름, 오른쪽 ⋯ · 2줄 이하: 아이디 · 휴대폰 · 과목 · 등록일을 작은 회색 글자로 이어 쓰기, 등급 숨김',
    css: `@media (max-width: 900px) {
  [data-teacher-manage] .cl-table tr { display: flex; flex-wrap: wrap; align-items: center; column-gap: 6px; row-gap: 2px; padding: 10px 0; }
  [data-teacher-manage] .cl-table td[data-primary] { flex: 1 1 calc(100% - 48px); width: auto; }
  [data-teacher-manage] .cl-table td.cl-tg-actions { flex: none; width: auto; }
  [data-teacher-manage] .cl-table td[data-label] { order: 2; width: auto; font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); }
  [data-teacher-manage] .cl-table td[data-label]:not([data-primary])::before { content: none; }
  [data-teacher-manage] .cl-table td[data-label] ~ td[data-label]::before { content: "· "; }
  [data-teacher-manage] .cl-table td[data-label="등급"] { display: none; }
}`,
    note: 'C2(이름을 첫 칸으로)와 같이 켜야 의도대로 보인다.',
    targets: ['[data-teacher-manage] tbody tr:first-child']
  },
  {
    id: 'F1', group: 6, status: '확정', kind: '마크업', screens: ['dashboard', 'teachers', 'students', 'subjects', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg'],
    title: '사이드바 "대시보드" 묶음 이름 빼기',
    current: '"대시보드" 묶음 안에 "대시보드" 메뉴 하나',
    next: '묶음 이름 없이 메뉴만',
    markup: '사이드바 첫 `.cl-ws-nav__group` 의 `.cl-ws-nav__label` 을 출력하지 않는다.',
    dom: `const l=doc.querySelector('.cl-ws-nav__group .cl-ws-nav__label'); if(l&&l.textContent.trim()==='대시보드') l.remove();`,
    targets: ['.cl-ws-nav__group:first-child']
  },
  {
    id: 'F2', group: 6, status: '확정', kind: '문구', screens: ['teachers', 'courses', 'subjects', 'admins', 'admin-create', 'groups', 'course-list', 't-group', 't-assign', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page'],
    title: '"생성 · 추가" → "만들기"',
    current: '선생님 생성, 강좌 생성, 과목 추가 / 그룹 만들기, 과제 만들기',
    next: '선생님 만들기, 강좌 만들기, 과목 만들기, 관리자 만들기(목록 버튼 · 생성 화면 제목 · 저장 버튼)',
    markup: '버튼 · 메뉴 · 메뉴 검색 색인(`data-finder-index`)의 "생성"을 "만들기"로. "추가"는 있는 것을 넣을 때만(수강생 추가).',
    dom: `doc.querySelectorAll('.cl-btn, .cl-menu__item, .cl-page__title').forEach(b=>{b.childNodes.forEach(n=>{if(n.nodeType===3){n.textContent=n.textContent.replace('선생님 생성','선생님 만들기').replace('강좌 생성','강좌 만들기').replace('과목 추가','과목 만들기').replace('관리자 생성','관리자 만들기').replace('그룹 생성','그룹 만들기').replace('과제 생성','과제 만들기');}});});`,
    targets: ['.cl-page__head .cl-btn--primary']
  },
  {
    id: 'G1', group: 8, status: '확정', kind: '마크업', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '사이드바: 큰 주제 접기 · 펼치기',
    current: '묶음 6개 · 메뉴 27개가 늘 다 펼쳐져 있어 화면 아래까지 스크롤해야 한다. 묶음 이름 12px 회색',
    next: '묶음 이름을 누르면 접고 펼친다(꺾쇠 회전 + 높이가 0.22초 동안 부드럽게). 처음 접속 때는 모든 묶음을 펼쳐 두고(지금 화면과 같은 첫인상), 사용자가 접고 편 상태부터 기억한다. 묶음 이름 15px 600 `cl-ink-2`, 높이 34px',
    markup: '`.cl-ws-nav__label` 을 `<button class="cl-ws-nav__label" aria-expanded>` 로 바꾸고, 같은 묶음 메뉴를 `<div class="cl-ws-nav__items"><div class="cl-ws-nav__items-inner">…</div></div>` 로 감싼다. 접힘은 `.cl-ws-nav__items.is-closed` + 안쪽 링크 `tabindex="-1"`. 높이 애니메이션은 grid-template-rows 0fr ↔ 1fr. 묶음별 펼친 상태도 사용자별로 기억(localStorage `cl.ws.nav.open`). 저장된 값이 없으면 모두 펼친다. 메뉴 검색(⌘K)은 접힌 묶음의 메뉴도 찾는다.',
    css: `.cl-ws-nav__label { width: 100%; height: 34px; border: 0; background: transparent; font: inherit; font-size: 15px; font-weight: 600; color: var(--cl-ink-2); justify-content: space-between; border-radius: 6px; cursor: pointer; text-align: left; transition: background var(--cl-dur) var(--cl-ease), color var(--cl-dur) var(--cl-ease); }
.cl-ws-nav__label:hover { background: var(--cl-nav-hover, #EFEFF1); color: var(--cl-ink); }
.cl-ws-nav__label .cl-icon { color: var(--cl-ink-muted); transition: transform 220ms cubic-bezier(.2, .8, .2, 1); }
.cl-ws-nav__label[aria-expanded="false"] .cl-icon { transform: rotate(-90deg); }
.cl-ws-nav__items { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 220ms cubic-bezier(.2, .8, .2, 1), opacity 180ms ease-out; }
.cl-ws-nav__items.is-closed { grid-template-rows: 0fr; opacity: 0; }
.cl-ws-nav__items-inner { min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: 5px; padding-top: 5px; }
.cl-ws-nav__items:not(.is-closed) .cl-ws-nav__item { animation: cl-nav-in 220ms ease-out both; }
@keyframes cl-nav-in { from { transform: translateY(-4px); } to { transform: none; } }
@media (prefers-reduced-motion: reduce) { .cl-ws-nav__items, .cl-ws-nav__label .cl-icon { transition: none; } .cl-ws-nav__item { animation: none !important; } }`,
    dom: `let saved={}; try{saved=JSON.parse(localStorage.getItem('cl.ws.nav.open')||'{}');}catch(e){}
doc.querySelectorAll('.cl-ws-nav__group').forEach(g=>{const l=g.querySelector('.cl-ws-nav__label'); if(!l) return;
  const name=l.textContent.trim(); const items=[...g.querySelectorAll(':scope > .cl-ws-nav__item')];
  const box=doc.createElement('div'); box.className='cl-ws-nav__items'; const inner=doc.createElement('div'); inner.className='cl-ws-nav__items-inner';
  items.forEach(i=>inner.append(i)); box.append(inner); g.append(box);
  const b=doc.createElement('button'); b.type='button'; b.className='cl-ws-nav__label lab-live';
  const cur=!!inner.querySelector('[aria-current="page"]'); const first=!localStorage.getItem('cl.ws.nav.open'); const open=cur || (first ? true : saved[name]===true);
  const set=o=>{b.setAttribute('aria-expanded',o); box.classList.toggle('is-closed',!o); items.forEach(i=>o?i.removeAttribute('tabindex'):i.setAttribute('tabindex','-1'));};
  b.innerHTML='<span>'+name+'</span><svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  set(open);
  b.addEventListener('click',()=>{const o=b.getAttribute('aria-expanded')!=='true'; set(o); saved[name]=o; try{localStorage.setItem('cl.ws.nav.open',JSON.stringify(saved));}catch(e){}});
  l.replaceWith(b);});`,
    targets: ['.cl-ws-nav__label'],
    note: '묶음 이름을 눌러 보세요. 펼친 묶음은 화면을 바꿔도 기억합니다.'
  },
  {
    id: 'G2', group: 8, status: '확정', kind: '마크업', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '사이드바 접기 버튼 (로고 오른쪽) · 상태 기억',
    current: '넓은 화면에서는 사이드바를 접을 수 없다 (1280px 이하에서만 56px 아이콘 레일)',
    next: '브랜드 칸 오른쪽 버튼으로 240px ↔ 56px. 폭이 0.24초 동안 줄고 늘며 메뉴는 살짝 페이드. 접은 상태는 다음 접속에도 유지',
    markup: '`.cl-ws-brand` 안 오른쪽에 `<button class="cl-icon-btn cl-ws-collapse" aria-label="메뉴 접기" aria-pressed>` 를 둔다. 누르면 `.cl-ws` 에 `is-collapsed`. 상태는 localStorage `cl.ws.collapsed` 에 저장하고, 첫 화면이 그려지기 전에(`<head>` 안 짧은 스크립트) 클래스를 붙여 깜빡임이 없게 한다. 그 첫 적용 때는 `.cl-ws.no-anim` 으로 전환을 끈다.',
    css: `.cl-ws { transition: grid-template-columns 240ms cubic-bezier(.2, .8, .2, 1); }
.cl-ws.no-anim, .cl-ws.no-anim * { transition: none !important; animation: none !important; }
.cl-ws-sidebar { overflow: hidden; }
.cl-ws-brand { position: relative; padding-right: 44px; overflow: hidden; transition: width 240ms cubic-bezier(.2, .8, .2, 1), padding 240ms cubic-bezier(.2, .8, .2, 1); }
.cl-ws-collapse { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 28px; height: 28px; color: var(--cl-ink-muted); transition: right 240ms cubic-bezier(.2, .8, .2, 1), background var(--cl-dur) var(--cl-ease); }
.cl-ws-collapse:hover { color: var(--cl-ink); background: var(--cl-nav-hover, #EFEFF1); }
.cl-ws-collapse .cl-icon { transition: transform 240ms cubic-bezier(.2, .8, .2, 1); }
.cl-ws.is-collapsed { grid-template-columns: 56px minmax(0, 1fr); }
.cl-ws.is-collapsed .cl-ws-brand { width: 56px; padding: 0; }
.cl-ws.is-collapsed .cl-ws-brand > :not(.cl-ws-collapse) { opacity: 0; pointer-events: none; }
.cl-ws.is-collapsed .cl-ws-collapse { right: 14px; }
.cl-ws.is-collapsed .cl-ws-collapse .cl-icon { transform: scaleX(-1); }
.cl-ws.is-collapsed :is(.cl-ws-search, .cl-ws-profile, .cl-ws-nav, .cl-ws-sidebar__foot) { display: none; }
.cl-ws.is-collapsed .cl-ws-rail { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 0; animation: cl-fade-in 200ms 80ms ease-out both; }
.cl-ws:not(.is-collapsed) :is(.cl-ws-search, .cl-ws-nav) { animation: cl-fade-in 200ms 60ms ease-out both; }
@keyframes cl-fade-in { from { opacity: 0; } to { opacity: 1; } }
.cl-ws.is-collapsed .cl-ws-rail__item { width: 40px; height: 40px; border: 0; border-radius: 10px; background: transparent; display: grid; place-items: center; color: var(--cl-ink-2); text-decoration: none; }
.cl-ws.is-collapsed .cl-ws-rail__item:hover { background: var(--cl-nav-hover, #EFEFF1); }
.cl-ws.is-collapsed .cl-ws-rail__item[aria-current="true"] { background: var(--cl-canvas); box-shadow: var(--cl-ring); color: var(--cl-primary-pressed); }
@media (max-width: 1280px) { .cl-ws-collapse { display: none; } .cl-ws-brand { padding-right: 0; } }
@media (prefers-reduced-motion: reduce) { .cl-ws, .cl-ws-brand, .cl-ws-collapse, .cl-ws-collapse .cl-icon { transition: none; } .cl-ws-rail, .cl-ws-nav, .cl-ws-search { animation: none !important; } }`,
    dom: `const br=doc.querySelector('.cl-ws-brand'), ws=doc.querySelector('.cl-ws'); if(!br||!ws) return;
const b=doc.createElement('button'); b.type='button'; b.className='cl-icon-btn cl-ws-collapse lab-live';
b.innerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/></svg>';
const set=c=>{ws.classList.toggle('is-collapsed',c); b.setAttribute('aria-pressed',c); b.setAttribute('aria-label',c?'메뉴 펼치기':'메뉴 접기'); b.title=c?'메뉴 펼치기':'메뉴 접기';};
let c=false; try{c=localStorage.getItem('cl.ws.collapsed')==='1';}catch(e){}
ws.classList.add('no-anim'); set(c); requestAnimationFrame(()=>requestAnimationFrame(()=>ws.classList.remove('no-anim')));
b.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); const n=!ws.classList.contains('is-collapsed'); set(n); try{localStorage.setItem('cl.ws.collapsed',n?'1':'0');}catch(e){}});
br.append(b);`,
    targets: ['.cl-ws-collapse'],
    note: '데스크톱 폭에서 로고 오른쪽 버튼을 눌러 보세요. 접은 상태는 다른 화면 · 다음 접속에도 유지됩니다.'
  },
  {
    id: 'G3', group: 8, status: '확정', kind: 'CSS', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '사이드바 메뉴 글자 15px · 간격 넓게',
    current: '메뉴 글자 14px(`cl-fs-ui`), 메뉴 사이 1px, 묶음 이름 높이 28px',
    next: '메뉴 · 묶음 이름 모두 15px, 메뉴 사이 5px, 묶음 사이 8 → 12px, 메뉴는 묶음 이름보다 4px 들여쓰기, 검색 칸과 첫 메뉴 사이 8 → 16px. 단독 메뉴(대시보드)는 묶음 이름과 같은 15px 600 · 아이콘 없음, 현재 화면이면 연보라 바탕. 묶음 이름 34px, 메뉴 줄 높이 34px 그대로',
    css: `.cl-ws-nav__item { font-size: 15px; }
.cl-ws-nav__group { gap: 0; } /* 접힌 묶음에 빈 틈이 남지 않게 — 이름과 메뉴 사이 5px 은 안쪽 여백으로 */
.cl-ws-nav { gap: 12px; }
.cl-ws-nav__items-inner { padding-left: 4px; }
.cl-ws-nav { padding-top: 10px; } /* 검색 칸과 첫 메뉴 사이 8 → 16px (cl-space-4) */
/* 묶음 없는 단독 메뉴(대시보드)는 묶음 이름과 같은 위계 */
.cl-ws-nav__group:not(:has(.cl-ws-nav__label)) > .cl-ws-nav__item { height: 34px; font-size: 15px; font-weight: 600; color: var(--cl-ink-2); }
.cl-ws-nav__group:not(:has(.cl-ws-nav__label)) > .cl-ws-nav__item > .cl-icon { display: none; }
.cl-ws-nav__group:not(:has(.cl-ws-nav__label)) > .cl-ws-nav__item[aria-current="page"] { background: var(--cl-primary-tint); box-shadow: none; color: var(--cl-primary-pressed); }`,
    note: '15px 는 지금 글자 단계에 없다. 확정하면 사이드바용 토큰(`cl-fs-nav`)을 새로 둔다.',
    targets: []
  },
  {
    id: 'H1', group: 9, status: '확정', kind: 'CSS', screens: ['students', 'teachers', 'subjects', 'courses', 'admins', 'groups', 'course-list', 'contents', 'cms', 'board', 'alarm', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-assign', 's-qna', 's-board'],
    title: '공통 표: 머리 줄과 데이터 구분',
    current: '머리 줄이 데이터와 같은 흰 바탕에 13px 500 회색이라, 아래 행과 구분이 약하다. 첫 칸 왼쪽 여백 0',
    next: '머리 줄 바탕 `cl-sidebar`(#F7F7F8), 글자 13px 600 `cl-ink-2`, 위아래 1px `cl-grid-head`. 첫 칸 · 끝 칸 좌우 12px 로 바탕 안에 들어오게',
    css: `.cl-table thead th { background: var(--cl-sidebar); color: var(--cl-ink-2); font-weight: 600; border-top: 1px solid var(--cl-grid-head); border-bottom: 1px solid var(--cl-grid-head); }
.cl-table th:first-child, .cl-table td:first-child { padding-left: 12px; }
.cl-table th:last-child, .cl-table td:last-child { padding-right: 12px; }
.cl-table thead th .cl-sort { color: inherit; font-weight: inherit; }
.cl-table-wrap { border-top: 0; }`,
    note: '표 하나를 고치면 학생 · 선생님 · 과목 · 강좌 목록이 함께 바뀝니다. 다른 화면 탭에서도 확인해 보세요.',
    targets: ['.cl-table thead tr']
  },
  {
    id: 'H2', group: 9, status: '확정', kind: 'CSS', screens: ['students'],
    title: '학생 목록: 메모 칸이 편집 가능하다는 표시',
    current: '빈 메모는 회색 "메모 추가" 글자뿐이고, 연필 아이콘은 마우스를 올려야 보인다. 일반 글자와 구분이 안 된다',
    next: '빈 메모: 점선 테두리 알약 안에 "+ 메모" · 내용 있는 메모: 글자 뒤에 연필 아이콘 늘 표시(흐리게), hover 때 바탕 `cl-hover` + 진하게 · 누르면 그 자리에서 입력 칸으로 바뀜(Enter 저장, Esc 취소)',
    css: `.cl-mu-memo__btn { padding: 3px 8px; margin-left: -8px; border-radius: 6px; color: var(--cl-ink); }
.cl-mu-memo__btn svg { opacity: .45; }
.cl-mu-memo__btn:hover, .cl-mu-memo__btn:focus-visible { background: var(--cl-hover); }
.cl-mu-memo__btn:hover svg, .cl-mu-memo__btn:focus-visible svg { opacity: 1; color: var(--cl-ink); }
.cl-mu-memo__btn.is-empty { margin-left: 0; padding: 1px 10px 1px 8px; border: 1px dashed var(--cl-control-border); border-radius: var(--cl-radius-pill); color: var(--cl-ink-muted); font-size: var(--cl-fs-caption); }
.cl-mu-memo__btn.is-empty:hover { border-color: var(--cl-primary); border-style: solid; color: var(--cl-primary-pressed); background: var(--cl-primary-tint); }
.cl-mu-memo__btn.is-empty svg { display: none; }
.cl-mu-memo__btn.is-empty::before { content: "+"; font-weight: 600; }`,
    markup: '메모가 없을 때 버튼에 `is-empty` 를 붙이고 글자는 "메모"(앞의 + 는 CSS). 있을 때는 내용 + 연필 아이콘. 누르면 같은 칸에서 `<input class="cl-input cl-mu-memo__input">` 로 바꾸고 Enter · 바깥 클릭 저장, Esc 취소(지금 동작 유지).',
    dom: `const ex={'송희정':'2월 보강 2회 남음','김리원':'학부모 상담 요청'}; let n=0;
doc.querySelectorAll('.cl-mu-memo__btn').forEach(b=>{b.classList.add('lab-live');
  const who=(b.getAttribute('aria-label')||'').replace(' 메모 수정',''); const sp=b.querySelector('span'); const ico=b.querySelector('svg');
  const show=t=>{if(t){b.classList.remove('is-empty'); sp.className=''; sp.textContent=t;} else {b.classList.add('is-empty'); sp.className=''; sp.textContent='메모';}};
  let val=(sp&&!sp.classList.contains('cl-muted'))?sp.textContent:(ex[who]||''); show(val);
  b.addEventListener('click',e=>{e.preventDefault(); const inp=doc.createElement('input'); inp.className='cl-input cl-mu-memo__input lab-live'; inp.value=val; inp.placeholder='메모 입력 후 Enter';
    b.replaceWith(inp); inp.focus();
    const done=save=>{if(save) val=inp.value.trim(); show(val); inp.replaceWith(b);};
    inp.addEventListener('keydown',k=>{if(k.key==='Enter') done(true); if(k.key==='Escape') done(false);});
    inp.addEventListener('blur',()=>{if(inp.isConnected) done(true);});});});
const lock=doc.createElement('style'); lock.textContent='input.lab-live{pointer-events:auto}'; doc.head.append(lock);`,
    targets: ['.cl-mu-memo__btn'],
    note: '메모 칸을 눌러 보세요. 실제로 입력 칸으로 바뀝니다. 송희정 · 김리원 메모는 예시 값입니다.'
  },
  {
    id: 'H3', group: 9, status: '확정', kind: 'CSS', screens: ['students', 'teachers', 'subjects', 'courses', 'teacher-read', 'teacher-edit', 'admins', 'groups', 'course-list', 'contents', 'cms', 'board', 'alarm', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-assign', 's-qna', 's-board'],
    title: '공통 표: 누르는 글자 스타일 하나로',
    current: '누르는 글자가 화면마다 다르다 — 선생님 아이디 보라 700, 이름 600 먹색, 과목의 강좌 이름 보라 700, 담당 선생님 보라 400. 학생 아이디는 누를 수 없는데 굵게(700)',
    next: '누르는 글자는 모두 600 `cl-ink`, hover 때 `cl-primary-pressed` + 밑줄(3px 띄움). 누를 수 없는 글자는 굵게 쓰지 않는다(400)',
    css: `/* 표 안에서 누르는 글자 — 링크 · 버튼 공통 */
.cl-table :is(.cl-table__title, .cl-tc-course__title, .cl-mt-id, .cl-ms-teacher) {
  font-weight: 600; color: var(--cl-ink); text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px;
  transition: color var(--cl-dur) var(--cl-ease), text-decoration-color var(--cl-dur) var(--cl-ease); }
.cl-table :is(.cl-table__title, .cl-tc-course__title, .cl-mt-id, .cl-ms-teacher):hover {
  color: var(--cl-primary-pressed); text-decoration-color: currentColor; }
.cl-table :is(.cl-table__title, .cl-tc-course__title, .cl-mt-id, .cl-ms-teacher):focus-visible { outline: var(--cl-focus); outline-offset: 2px; border-radius: 2px; }
/* 누를 수 없는 첫 칸(학생 아이디)은 굵게 쓰지 않는다 */
.cl-table td[data-primary] > strong { font-weight: 400; }`,
    markup: '새 표를 만들 때 누르는 글자에는 `cl-table__title` 하나만 쓴다(`cl-mt-id` · `cl-ms-teacher` 는 이 클래스로 합친다). 누를 수 없는 값을 `<strong>` 으로 감싸지 않는다.',
    targets: ['.cl-table__title', '.cl-tc-course__title', '.cl-mt-id', '.cl-ms-teacher', 'td[data-primary] > strong'],
    note: '선생님 · 과목 · 강좌 화면에서도 확인해 보세요. 마우스를 올리면 보라 + 밑줄이 됩니다.'
  },
  {
    id: 'H4', group: 9, status: '확정', kind: '마크업', screens: ['students'],
    title: '검색 옆 [초기화] → [조건 초기화], 바꾼 조건이 있을 때만 활성',
    current: '"초기화" 글자 버튼이 늘 같은 모습. 무엇을 되돌리는지, 지금 되돌릴 게 있는지 알 수 없다',
    next: '안내 글자 "이름, 아이디, 휴대폰 등"(잘리지 않게). 되돌리기 아이콘 + "조건 초기화". 기본 상태에서는 흐린 비활성, 검색어 · 탭 · 정렬 · 쪽마다 중 하나라도 바뀌면 활성. 검색 칸 안에는 검색어 지우기(×)',
    css: `.cl-toolbar [data-reset] { gap: 4px; color: var(--cl-ink-2); }
.cl-toolbar [data-reset]:disabled { opacity: 1; color: var(--cl-ink-faint); background: transparent; cursor: default; }
.cl-search { position: relative; }
.cl-search__clear { position: absolute; right: 6px; width: 20px; height: 20px; border: 0; border-radius: 999px; background: var(--cl-hover); color: var(--cl-ink-muted); display: grid; place-items: center; cursor: pointer; }
.cl-search__clear[hidden] { display: none; }
.cl-search:has(.cl-search__clear:not([hidden])) input { padding-right: 32px; }`,
    markup: '버튼 글자를 "조건 초기화"로 바꾸고 앞에 되돌리기 아이콘(`rotate-ccw`, 14px). 검색어 · 탭 · 정렬 · 쪽마다가 기본값과 같으면 `disabled`. 검색 칸에 값이 있을 때만 `<button class="cl-search__clear" aria-label="검색어 지우기">` 표시. 안내 글자는 220px 칸에 들어가게 "이름, 아이디, 휴대폰 등"(기존 "아이디, 이름, 메모, 휴대폰, 이메일"은 잘림), 찾는 범위 전체는 `title`. 아이콘만 두지 않는 이유: 새로고침 아이콘은 대시보드 [새로고침](데이터 다시 불러오기)과 모양이 같아 뜻이 겹친다.',
    dom: `const r=doc.querySelector('[data-reset]'), inp=doc.querySelector('.cl-toolbar .cl-search input'); if(!r||!inp) return;
r.classList.add('lab-live'); inp.classList.add('lab-live'); inp.placeholder='이름, 아이디, 휴대폰 등'; inp.title='이름 · 아이디 · 메모 · 휴대폰 · 이메일로 찾습니다';
r.innerHTML='<svg class="cl-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>조건 초기화';
const x=doc.createElement('button'); x.type='button'; x.className='cl-search__clear lab-live'; x.setAttribute('aria-label','검색어 지우기'); x.hidden=true;
x.innerHTML='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
inp.closest('.cl-search').append(x);
const sync=()=>{const v=!!inp.value.trim(); r.disabled=!v; x.hidden=!v;};
inp.addEventListener('input',sync); x.addEventListener('click',()=>{inp.value=''; sync(); inp.focus();});
r.addEventListener('click',()=>{inp.value=''; sync();}); sync();
const st=doc.createElement('style'); st.textContent='input.lab-live{pointer-events:auto}'; doc.head.append(st);`,
    targets: ['[data-reset]'],
    note: '검색 칸에 아무 글자나 입력해 보세요. 버튼이 활성으로 바뀌고 × 가 나타납니다.'
  },
  {
    id: 'G4', group: 8, status: '확정', kind: '마크업', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '사이드바 아이콘을 묶음 이름으로 옮기기',
    current: '아이콘이 하위 메뉴 27개에 하나씩 있고 묶음 이름에는 없다. 접은 아이콘 줄(묶음 아이콘)과 펼친 메뉴의 아이콘이 서로 다르다',
    next: '묶음 이름 앞에 그 묶음의 아이콘(접은 아이콘 줄과 같은 것). 하위 메뉴는 아이콘 없이 글자만, 묶음 이름 글자보다 8px 안쪽(왼쪽 40px). 대시보드는 아이콘 다시 표시',
    markup: '`.cl-ws-nav__label` 버튼 안 이름 앞에 레일(`.cl-ws-rail__item`)과 같은 묶음 아이콘 16px 을 넣는다. 하위 메뉴 `<a class="cl-ws-nav__item">` 의 아이콘 `<svg>` 는 출력하지 않는다. 즐겨찾기는 넣지 않는다.',
    css: `.cl-ws-nav__label > span { display: inline-flex; align-items: center; gap: 8px; }
.cl-ws-nav__label > span .cl-icon { transform: none !important; color: var(--cl-ink-muted); }
.cl-ws-nav__label:hover > span .cl-icon { color: currentColor; }
.cl-ws-nav__items-inner { padding-left: 0; }
.cl-ws-nav__items-inner .cl-ws-nav__item { padding-left: 40px; }
.cl-ws-nav__items-inner .cl-ws-nav__item > .cl-icon { display: none; }
.cl-ws-nav__group:not(:has(.cl-ws-nav__label)) > .cl-ws-nav__item > .cl-icon { display: inline-block; color: currentColor; }`,
    dom: `const rail={}; doc.querySelectorAll('.cl-ws-rail__item[title]').forEach(r=>{const v=r.querySelector('svg'); if(v) rail[r.getAttribute('title').trim()]=v;});
doc.querySelectorAll('.cl-ws-nav__label').forEach(l=>{const sp=l.querySelector('span'); if(!sp) return; const v=rail[sp.textContent.trim()]; if(!v) return;
  const c=v.cloneNode(true); c.setAttribute('width','16'); c.setAttribute('height','16'); c.classList.add('cl-icon'); sp.prepend(c);});`,
    targets: ['.cl-ws-nav__label'],
    note: 'G1(접기 · 펼치기) 뒤에 적용된다. 끄면 지금까지의 모습과 비교할 수 있다.'
  },
  {
    id: 'C5', group: 3, status: '확정', kind: '마크업', screens: ['teachers'],
    title: '선생님 행 메뉴(⋯): 중복 빼기 · 구분선 · 빨간 삭제',
    current: '상세 보기 · 정보 수정 · 계정 들어가기 · 삭제가 같은 모양으로 나란히. 삭제에 `cl-menu__item--danger` 가 있지만 `.cl-row-menu__panel .cl-menu__item { color: ink }` 가 더 강해서 빨간색이 안 나온다. 계정 들어가기 아이콘이 "외부 링크"',
    next: '[정보 수정] ─ [선생님 계정으로 들어가기] ─ [삭제(빨강)]. "상세 보기"는 이름 링크와 같아서 뺀다. 계정 들어가기 아이콘은 "들어가기"(log-in)',
    css: `.cl-menu__sep { height: 1px; margin: 4px 6px; background: var(--cl-grid-row); }
.cl-row-menu__panel .cl-menu__item--danger, .cl-row-menu__panel .cl-menu__item--danger .cl-icon { color: var(--cl-danger); }
.cl-row-menu__panel .cl-menu__item--danger:hover { background: var(--cl-danger-bg); }`,
    markup: '행 메뉴에서 "상세 보기"를 지운다(이름 링크와 같은 곳). "정보 수정"은 상세 → 수정 두 단계를 줄이는 지름길이라 남긴다. 항목 사이에 `<div class="cl-menu__sep" role="separator"></div>` 두 개. "선생님 계정으로 들어가기" 아이콘을 log-in 모양으로 바꾸고, 같은 아이콘을 상세 화면 버튼 · 행 [들어가기] 버튼에도 쓴다. 학생 · 강좌 행 메뉴도 같은 규칙(되돌릴 수 없는 동작은 맨 아래, 구분선 뒤, 빨강).',
    dom: `doc.querySelectorAll('[data-teacher-manage] .cl-row-menu__panel').forEach(p=>{const it=[...p.children];
  const imp=it.find(i=>i.textContent.includes('계정으로 들어가기')), del=it.find(i=>i.classList.contains('cl-menu__item--danger'));
  const det=it.find(i=>i.textContent.trim()==='상세 보기'); if(det) det.remove();
  const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
  if(imp){imp.before(sep()); const v=imp.querySelector('svg'); if(v) v.outerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>';}
  if(del) del.before(sep());});
const first=doc.querySelector('[data-teacher-manage] tbody tr .cl-row-menu'); if(first){const t=first.querySelector('.cl-row-menu__trigger'), p=first.querySelector('.cl-row-menu__panel');
  t.classList.add('lab-live'); p.querySelectorAll('.cl-menu__item').forEach(i=>i.classList.add('lab-live'));
  const place=()=>{const r=t.getBoundingClientRect(); p.style.top=(r.bottom+4)+'px'; p.style.left=(r.right-200)+'px'; p.style.minWidth='200px';};
  p.hidden=false; place(); t.setAttribute('aria-expanded','true');
  t.addEventListener('click',e=>{e.preventDefault(); p.hidden=!p.hidden; if(!p.hidden) place();});}`,
    targets: [],
    note: '첫 행의 메뉴를 열어 두었습니다. ⋯ 를 눌러 닫고 열 수 있습니다.'
  },
  {
    id: 'C6', group: 3, status: '확정', kind: '마크업', screens: ['teachers'],
    title: '행에 마우스를 올리면 아이디 옆 [들어가기]',
    current: '아이디 글자를 누르면 계정 전환 확인창이 뜬다(숨은 동작)',
    next: '아이디는 회색 보통 글자. 행에 마우스를 올리거나 키보드로 행에 들어오면 아이디 오른쪽에 작은 [들어가기] 버튼(log-in 아이콘 + 글자, `cl-btn--ghost --xs`). 누르면 지금과 같은 확인창',
    css: `.cl-mt-enter { margin-left: 8px; height: 24px; padding: 0 8px; font-size: var(--cl-fs-micro); opacity: 0; transition: opacity var(--cl-dur) var(--cl-ease); }
.cl-table tbody tr:hover .cl-mt-enter, .cl-table tbody tr:focus-within .cl-mt-enter { opacity: 1; }
@media (hover: none), (max-width: 900px) { .cl-mt-enter { display: none; } }`,
    markup: '아이디 칸에 `<button type="button" class="cl-btn cl-btn--ghost cl-btn--xs cl-mt-enter" aria-label="장현석 선생님 계정으로 들어가기">들어가기</button>`. 키보드 · 화면 읽기 프로그램에서도 닿도록 `display:none` 이 아니라 투명도로 숨긴다. 터치 기기 · 모바일은 행 메뉴(⋯)를 쓴다.',
    dom: `doc.querySelectorAll('[data-teacher-manage] tbody td[data-label="아이디"]').forEach(td=>{const b=doc.createElement('button'); b.type='button'; b.className='cl-btn cl-btn--ghost cl-btn--xs cl-mt-enter';
  b.innerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>'.replace('width="16" height="16"','width="13" height="13"')+'들어가기'; td.append(b);});
const r=doc.querySelector('[data-teacher-manage] tbody tr:nth-child(2) .cl-mt-enter'); if(r) r.style.opacity='1';`,
    targets: ['[data-teacher-manage] tbody tr:nth-child(2) .cl-mt-enter'],
    note: 'C2 와 같이 켜야 합니다. 둘째 행은 마우스를 올린 상태를 보여 주려고 버튼을 늘 보이게 했습니다.'
  },
  {
    id: 'C7', group: 6, status: '확정', kind: '문구', screens: ['teachers'],
    title: '선생님 목록 설명에서 아이디 안내 문장 빼기',
    current: '"선생님을 만들기 전에 과목을 먼저 만들어 주세요. 아이디를 누르면 그 선생님 계정으로 들어가 강좌를 관리할 수 있습니다."',
    next: '"선생님을 만들기 전에 과목을 먼저 만들어 주세요."',
    dom: `const m=doc.querySelector('[data-teacher-manage] .cl-page__meta'); if(m) m.textContent='선생님을 만들기 전에 과목을 먼저 만들어 주세요.';`,
    markup: '선생님 목록 `.cl-page__meta` 문구를 바꾼다.',
    targets: ['.cl-page__meta']
  },
  {
    id: 'C8', group: 3, status: '확정', kind: '마크업', screens: ['courses', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page'],
    title: '선생님 계정으로 들어간 동안 맨 위 띠',
    current: '들어간 뒤 지금 누구 계정인지 표시가 없다. 돌아오는 길은 계정 메뉴 안 [사이트 관리]',
    next: '화면 맨 위 36px 먹색 띠: "장현석 선생님 계정으로 보는 중" + 오른쪽 [관리자로 돌아가기]. 띠는 스크롤해도 고정',
    css: `.cl-impersonate { position: sticky; top: 0; z-index: 40; height: 36px; padding: 0 12px 0 16px; display: flex; align-items: center; gap: 8px; background: var(--cl-ink); color: var(--cl-canvas); font-size: var(--cl-fs-caption); }
.cl-impersonate strong { font-weight: 600; }
.cl-impersonate__back { margin-left: auto; height: 26px; padding: 0 10px; border: 0; border-radius: 6px; background: rgba(255, 255, 255, .14); color: inherit; font: inherit; font-weight: 600; cursor: pointer; }
.cl-impersonate__back:hover { background: rgba(255, 255, 255, .24); }
.cl-impersonate ~ .cl-ws .cl-ws-topbar { top: 36px; }`,
    markup: '관리자가 선생님 계정으로 들어간 세션에서만 `<body>` 첫 요소로 띠를 출력한다. [관리자로 돌아가기]는 지금 [사이트 관리]와 같은 동작. 들어가기 확인창의 둘째 문장은 "들어간 뒤에는 화면 위 띠에서 언제든 관리자로 돌아올 수 있습니다."로 바꾼다.',
    dom: `const b=doc.createElement('div'); b.className='cl-impersonate'; b.setAttribute('role','status');
b.innerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>'+'<span><strong>장현석</strong> 선생님 계정으로 보는 중</span><button type="button" class="cl-impersonate__back">관리자로 돌아가기</button>';
doc.body.prepend(b);`,
    targets: ['.cl-impersonate']
  },
  {
    id: 'I1', group: 3, status: '확정', kind: '마크업', screens: ['teacher-read'],
    title: '선생님 상세: 버튼 4개 → 3개 (비밀번호 초기화는 수정 화면으로)',
    current: 'QR코드 보기 · 비밀번호 초기화 · 선생님 계정으로 들어가기 · 선생님 수정 이 한 줄에 같은 무게. 되돌릴 수 없는 비밀번호 초기화가 QR 보기와 같은 모양',
    next: '[QR코드 보기] [선생님 계정으로 들어가기(들어가기 아이콘)] [수정(주 버튼)]. 비밀번호 초기화는 수정 화면 비밀번호 칸 아래로(I4)',
    markup: '상세 화면 `.cl-page__head--row` 에서 `[data-reset-pw]` 버튼을 지운다. 순서: `cl-btn--ghost` [QR코드 보기] → `cl-btn--ghost` [선생님 계정으로 들어가기] → `cl-btn--primary` [수정]. 제목이 이미 선생님 이름이라 버튼은 "수정"으로 줄인다. 동작 코드: `read.js` 의 `data-reset-pw` 처리 부분은 I4 에서 `form.js` 로 옮긴다.',
    dom: `const row=doc.querySelector('[data-teacher-read] .cl-page__head--row'); if(!row) return;
const pw=row.querySelector('[data-reset-pw]'), en=row.querySelector('[data-enter]'), ed=row.querySelector('[data-edit]');
if(pw) pw.remove();
if(en){const v=en.querySelector('svg'); if(v) v.outerHTML='<svg class="cl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/></svg>';}
if(ed){ed.childNodes.forEach(n=>{if(n.nodeType===3) n.textContent=n.textContent.replace('선생님 수정','수정');});}
doc.querySelectorAll('[data-teacher-read] dd.cl-num').forEach(d=>{const v=d.textContent.trim(); if(/^01\\d{9}$/.test(v)) d.textContent=v.replace(/(\\d{3})(\\d{4})(\\d{4})/,'$1-$2-$3');});`,
    targets: ['[data-teacher-read] .cl-page__head--row .cl-btn']
  },
  {
    id: 'I2', group: 3, status: '확정', kind: '마크업', screens: ['teacher-read'],
    title: '선생님 상세: 맡은 강좌는 강좌 정보, 계정 전환은 이름 붙은 링크로',
    current: '강좌를 누르면 그 선생님 계정으로 바로 들어간다. 아래 회색 안내 문장으로만 알 수 있다',
    next: '강좌 줄을 누르면 강좌 상세(관리자 화면). 줄 오른쪽에 "선생님 계정으로 열기 →" 글자 링크를 따로 둔다. 안내 문장은 뺀다',
    css: `.cl-mt-course { display: grid; grid-template-columns: minmax(0, 1fr) auto; column-gap: 12px; }
.cl-mt-course__open { grid-column: 2; grid-row: 1 / span 2; align-self: center; display: inline-flex; align-items: center; gap: 4px; font-size: var(--cl-fs-caption); font-weight: 600; color: var(--cl-ink-2); text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px; }
.cl-mt-course__open:hover { color: var(--cl-primary-pressed); text-decoration-color: currentColor; }`,
    markup: '`.cl-mt-course` 를 강좌 상세 링크로 바꾸고, 옆에 `<a class="cl-mt-course__open">선생님 계정으로 열기</a>`(누르면 확인창). `.cl-field__help` "강좌를 누르면 이 선생님 계정으로…" 문장은 지운다.',
    dom: `doc.querySelectorAll('.cl-mt-course').forEach(c=>{const a=doc.createElement('span'); a.className='cl-mt-course__open'; a.innerHTML='선생님 계정으로 열기 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'; c.append(a);});
const help=[...doc.querySelectorAll('.cl-field__help')].find(p=>p.textContent.includes('강좌를 누르면')); if(help) help.remove();`,
    targets: ['.cl-mt-course']
  },
  {
    id: 'I3', group: 3, status: '확정', kind: '문구', screens: ['teacher-read'],
    title: '계정 들어가기 확인창 문구',
    current: '"장현석 선생님 계정으로 들어갈까요? / 선생님 화면에서 강좌 · 수강생을 대신 관리합니다. 계정 메뉴의 [사이트 관리]로 돌아올 수 있습니다." [취소] [들어가기]',
    next: '제목 그대로. 둘째 문장 → "들어간 뒤에는 화면 위 띠에서 언제든 관리자로 돌아올 수 있습니다." [취소] [들어가기] (C8 띠와 함께)',
    markup: '확인창 설명 둘째 문장만 바꾼다. 버튼 · 모양은 그대로(`cl-dialog--confirm`, 주 버튼 보라). 상세 화면 [선생님 계정으로 들어가기]를 눌러 실험실에서 볼 수 있다.',
    dom: `const en=doc.querySelector('[data-enter]'); if(!en) return; en.classList.add('lab-live');
en.addEventListener('click',e=>{e.preventDefault(); if(doc.querySelector('.lab-dlg')) return;
  const bg=doc.createElement('div'); bg.className='lab-dlg'; bg.style.cssText='position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.4);display:grid;place-items:start center;padding-top:160px';
  bg.innerHTML='<div class="cl-dialog cl-dialog--confirm" role="dialog" aria-modal="true" style="position:static;display:block;margin:0;width:440px"><h2 class="cl-dialog__title">장현석 선생님 계정으로 들어갈까요?</h2><p class="cl-dialog__desc">선생님 화면에서 강좌 · 수강생을 대신 관리합니다.\\n들어간 뒤에는 화면 위 띠에서 언제든 관리자로 돌아올 수 있습니다.</p><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--text lab-live" data-x>취소</button><button type="button" class="cl-btn cl-btn--primary lab-live" data-go>들어가기</button></div></div>';
  doc.body.append(bg); bg.querySelector('[data-x]').onclick=()=>bg.remove(); bg.querySelector('[data-go]').onclick=()=>{bg.remove(); parent.postMessage({labGo:'courses'},'*');};});`,
    targets: ['[data-enter]'],
    note: '[선생님 계정으로 들어가기]를 누르면 확인창이 뜨고, [들어가기]를 누르면 띠가 있는 선생님 화면으로 이동합니다.'
  },
  {
    id: 'I4', group: 3, status: '확정', kind: '마크업', screens: ['teacher-edit'],
    title: '선생님 수정: 비밀번호 칸 아래 [비밀번호 초기화]',
    current: '비밀번호 초기화가 상세 화면 버튼 줄에 QR코드 보기와 같은 모양으로 있다',
    next: '수정 화면 비밀번호 칸 도움말 끝에 "또는 [비밀번호 초기화]" 글자 버튼(빨강). 누르면 확인창 → [초기화](위험 버튼)',
    css: `.cl-pw-reset { margin-left: 4px; padding: 0; border: 0; background: none; font: inherit; font-weight: 600; color: var(--cl-danger); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.cl-pw-reset:hover { color: var(--cl-danger-pressed, #A8191A); }`,
    markup: '수정 화면 `#mtf-pw` 도움말(`.cl-field__help`)을 "바꿀 때만 입력하세요. 4자 이상 · 또는 <button type=\"button\" class=\"cl-pw-reset\" data-reset-pw>비밀번호 초기화</button>"로 바꾼다. 동작 코드: `read.js` 의 `data-reset-pw` 처리(확인창 + 초기화 요청)를 `form.js` 로 옮기고, 상세 화면 버튼은 지운다(I1). 확인창: 제목 "장현석 선생님 비밀번호를 초기화할까요?", 설명 "임시 비밀번호를 새로 만들고, 로그인되어 있던 기기는 로그아웃됩니다. / 선생님은 임시 비밀번호로 로그인한 뒤 새 비밀번호를 정해야 합니다.", 버튼 [취소] [초기화](`cl-btn--danger`). 지금 확인창 문구 그대로.',
    dom: `const inp=doc.querySelector('#mtf-pw'); if(!inp) return; const help=inp.parentElement.querySelector('.cl-field__help'); if(!help) return;
help.innerHTML='바꿀 때만 입력하세요. 4자 이상 · 또는 <button type="button" class="cl-pw-reset lab-live" data-reset-pw>비밀번호 초기화</button>';
help.querySelector('button').addEventListener('click',e=>{e.preventDefault(); if(doc.querySelector('.lab-dlg')) return;
  const bg=doc.createElement('div'); bg.className='lab-dlg'; bg.style.cssText='position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.4);display:grid;place-items:start center;padding-top:160px';
  bg.innerHTML='<div class="cl-dialog cl-dialog--confirm" role="dialog" aria-modal="true" style="position:static;display:block;margin:0;width:440px"><h2 class="cl-dialog__title">장현석 선생님 비밀번호를 초기화할까요?</h2><p class="cl-dialog__desc">임시 비밀번호를 새로 만들고, 로그인되어 있던 기기는 로그아웃됩니다.\\n선생님은 임시 비밀번호로 로그인한 뒤 새 비밀번호를 정해야 합니다.</p><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--text lab-live" data-x>취소</button><button type="button" class="cl-btn cl-btn--danger lab-live" data-x>초기화</button></div></div>';
  doc.body.append(bg); bg.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>bg.remove());});`,
    targets: ['#mtf-pw ~ .cl-field__help'],
    note: '[비밀번호 초기화]를 누르면 확인창이 뜹니다.'
  },
  {
    id: 'J1', group: 3, status: '확정', kind: '마크업', screens: ['admins'],
    title: '관리자 행 메뉴(⋯): 구분선 · 빨간 삭제',
    current: '정보 수정 · 삭제가 같은 모양. 삭제가 빨갛게 나오지 않는다(선생님 목록과 같은 원인)',
    next: '[정보 수정] ─ [삭제(빨강)]. 아이디 링크(→ 수정)와 겹치지만 기능이 늘 자리로 메뉴는 남긴다',
    markup: '선생님 행 메뉴(C5)와 같은 규칙: 삭제 앞에 `cl-menu__sep`, 삭제는 `cl-menu__item--danger`(C5 의 CSS 로 빨강). 아이디 링크는 공통 링크 스타일(H3)을 따른다.',
    dom: `doc.querySelectorAll('[data-admin-manage] .cl-row-menu__panel').forEach(p=>{const del=[...p.children].find(i=>i.textContent.trim()==='삭제'); if(del){del.classList.add('cl-menu__item--danger'); const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); del.before(d);}});
const first=doc.querySelector('[data-admin-manage] tbody tr .cl-row-menu'); if(first){const t=first.querySelector('.cl-row-menu__trigger'), p=first.querySelector('.cl-row-menu__panel');
  t.classList.add('lab-live'); const place=()=>{const r=t.getBoundingClientRect(); p.style.top=(r.bottom+4)+'px'; p.style.left=(r.right-200)+'px'; p.style.minWidth='200px';};
  p.hidden=false; place(); t.addEventListener('click',e=>{e.preventDefault(); p.hidden=!p.hidden; if(!p.hidden) place();});}
const st=doc.createElement('style'); st.textContent='.cl-menu__sep{height:1px;margin:4px 6px;background:var(--cl-grid-row)} .cl-row-menu__panel .cl-menu__item--danger,.cl-row-menu__panel .cl-menu__item--danger .cl-icon{color:var(--cl-danger)}'; doc.head.append(st);`,
    targets: [],
    note: '첫 행 메뉴를 열어 두었습니다.'
  },
  {
    id: 'J3', group: 1, status: '확정', kind: '마크업', screens: ['admin-create', 'admin-edit'],
    title: '관리자 생성 · 수정: 사진을 맨 아래로, (선택) 표시',
    current: '선택 항목인 사진이 아이디 · 비밀번호 · 이름보다 먼저 나온다',
    next: '아이디 → 비밀번호 → 이름 → 사진(선택) 순서. 사진 미리보기 96×125px 로 줄이기',
    css: `[data-admin-form] .cl-mtf-photo__preview { width: 96px; height: 125px; }`,
    markup: '`[data-admin-form]` 안 사진 `.cl-field` 를 이름 칸 뒤로 옮기고 이름표를 "사진 <span class=\"cl-muted\">(선택)</span>"으로. 관리자 사진이 실제로 쓰이는 곳(상단 계정 버튼 등)이 없다면 칸을 빼도 된다 — 개발 확인.',
    dom: `const sec=doc.querySelector('[data-admin-form] .cl-form__section'); if(!sec) return; const ph=sec.querySelector('.cl-mtf-photo'); const f=ph&&ph.closest('.cl-field'); if(!f) return; sec.append(f); const l=f.querySelector('.cl-field__label'); if(l) l.innerHTML='사진 <span class="cl-muted" style="font-weight:400">(선택)</span>';`,
    targets: ['[data-admin-form] .cl-mtf-photo']
  },
  {
    id: 'J4', group: 6, status: '확정', kind: '문구', screens: ['admin-edit', 'teacher-edit'],
    title: '수정 화면 제목에 누구인지 넣기',
    current: '제목이 "관리자 수정" · "선생님 수정"뿐이라 아이디 칸을 봐야 누구인지 안다',
    next: '"고요한 관리자 수정" · "장현석 선생님 수정"',
    markup: '수정 화면 `<h1 class="cl-page__title">` 를 "{이름} 관리자 수정" / "{이름} 선생님 수정"으로. 브라우저 탭 제목(`<title>`)도 같게.',
    dom: `const t=doc.querySelector('.cl-page__title'); if(!t) return; if(t.textContent.trim()==='관리자 수정') t.textContent='고요한 관리자 수정'; if(t.textContent.trim()==='선생님 수정') t.textContent='장현석 선생님 수정';`,
    targets: ['.cl-page__title']
  },
  {
    id: 'J5', group: 3, status: '확정', kind: '마크업', screens: ['admins', 'admin-read', 'admin-edit'],
    title: '관리자 상세 화면 추가 (아이디 → 상세 → 수정)',
    current: '아이디를 누르면 바로 수정 화면. 선생님은 상세를 거쳐서 흐름이 다르다',
    next: '아이디 → 관리자 상세(사진 · 아이디 · 이름 · 등록일 + 최근 로그인 · 권한) → [수정]. 행 메뉴 "정보 수정"은 지름길로 그대로',
    markup: '새 화면 `/manager/admin/read/{id}`: 선생님 상세(`[data-teacher-read]`)와 같은 틀(`cl-mt-read` 2단). 머리: ‹ 관리자 목록 / 이름 / [수정](주 버튼). 왼쪽 카드: 사진 · 아이디 · 이름 · 등록일. 오른쪽: 최근 로그인(로그인 상세 데이터), 권한(지금은 "학원 전체 관리" 한 가지). 관리자 목록의 아이디 링크는 상세로, 수정 화면의 ‹ 뒤로는 상세로 바꾼다. 최근 로그인 데이터를 줄 수 없으면 그 카드는 빼고 시작해도 된다.',
    dom: `doc.querySelectorAll('[data-admin-manage] .cl-table__title[data-lab-go]').forEach(a=>a.setAttribute('data-lab-go','admin-read'));`,
    targets: ['[data-admin-manage] .cl-table__title', '[data-admin-read] .cl-stack'],
    note: '실험실의 최근 로그인 · 권한 내용은 예시입니다. 끄면 아이디가 바로 수정으로 갑니다.'
  },
  {
    id: 'K1', group: 1, status: '확정', kind: '마크업', screens: ['groups', 'group-create-dlg'],
    title: '그룹 목록: 화면 머리 틀 맞추기',
    current: '검색 칸이 제목 줄에 있고, 설명 줄 자리에 "그룹 5개"(개수)가 들어 있다',
    next: '제목 줄에는 [그룹 만들기]만. 설명 한 줄 "학생을 반 단위로 묶어 수강 · 통계를 함께 관리합니다." 그 아래 도구 줄: 검색(왼쪽) · 그룹 수(오른쪽)',
    markup: '`.cl-page__head` 안 `form.cl-tc-search` 를 새 `<div class="cl-toolbar">` 로 옮기고, `[data-summary]`(그룹 N개)는 도구 줄 오른쪽 `<span class="cl-muted">` 로. 설명 `.cl-page__meta` 는 문구로 채운다. 선생님 · 관리자 목록과 같은 순서.',
    dom: `const head=doc.querySelector('[data-group-list] .cl-page__head'), meta=doc.querySelector('[data-group-list] [data-summary]'); if(!head||!meta) return;
const f=head.querySelector('.cl-tc-search'); const bar=doc.createElement('div'); bar.className='cl-toolbar';
const sp=doc.createElement('span'); sp.className='cl-toolbar__spacer'; const n=doc.createElement('span'); n.className='cl-muted'; n.textContent=meta.textContent;
if(f) bar.append(f); bar.append(sp, n);
const d=doc.createElement('p'); d.className='cl-page__meta'; d.textContent='학생을 반 단위로 묶어 수강 · 통계를 함께 관리합니다.';
meta.replaceWith(d); d.after(bar);`,
    targets: ['[data-group-list] .cl-toolbar', '[data-group-list] .cl-page__meta']
  },
  {
    id: 'K2', group: 3, status: '확정', kind: '마크업', screens: ['groups', 'group-create-dlg'],
    title: '그룹 목록: 행의 [편집] 버튼 빼기 · 메뉴 정리',
    current: '그룹 이름 링크와 [편집] 버튼이 같은 편집 화면으로 간다(같은 줄에 같은 길 두 개). 메뉴: 그룹 통계 · 복사(아이콘이 "강좌" 모양) · 이름 변경 · 삭제가 같은 모양',
    next: '[편집] 버튼은 빼고 그룹 이름 링크만(→ 편집). ⋯ 메뉴: [그룹 통계] ─ [복사(복사 아이콘) · 이름 변경] ─ [삭제(빨강)]',
    css: `[data-group-list] .cl-tg-actions > .cl-btn { display: none; }`,
    markup: '행의 `<a class="cl-btn cl-btn--ghost cl-btn--sm">편집</a>` 을 지운다(그룹 이름 링크와 같은 주소). 메뉴 "복사" 아이콘을 copy 모양으로 바꾸고, 그룹 통계 뒤 · 삭제 앞에 `cl-menu__sep`. 삭제는 `cl-menu__item--danger`(C5 CSS 로 빨강). "이름 변경"은 편집 화면을 거치지 않는 빠른 길이라 남긴다.',
    dom: `doc.querySelectorAll('[data-group-list] .cl-tg-actions > .cl-btn').forEach(b=>b.remove());
doc.querySelectorAll('[data-group-list] .cl-row-menu__panel').forEach(p=>{const it=[...p.children]; const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
  const cp=it.find(i=>i.textContent.trim()==='복사'), del=it.find(i=>i.textContent.trim()==='삭제');
  if(cp){cp.before(sep()); const v=cp.querySelector('svg'); if(v) v.outerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';} if(del) del.before(sep());});
const first=doc.querySelector('[data-group-list] tbody tr .cl-row-menu'); if(first){const t=first.querySelector('.cl-row-menu__trigger'), p=first.querySelector('.cl-row-menu__panel');
  t.classList.add('lab-live'); const place=()=>{const r=t.getBoundingClientRect(); p.style.top=(r.bottom+4)+'px'; p.style.left=(r.right-200)+'px'; p.style.minWidth='200px';};
  p.hidden=false; place(); t.addEventListener('click',e=>{e.preventDefault(); p.hidden=!p.hidden; if(!p.hidden) place();});}
const st=doc.createElement('style'); st.textContent='.cl-menu__sep{height:1px;margin:4px 6px;background:var(--cl-grid-row)} .cl-row-menu__panel .cl-menu__item--danger,.cl-row-menu__panel .cl-menu__item--danger .cl-icon{color:var(--cl-danger)}'; doc.head.append(st);`,
    targets: [],
    note: '첫 행 메뉴를 열어 두었습니다.'
  },
  {
    id: 'K3', group: 6, status: '확정', kind: '문구', screens: ['groups', 'group-create-dlg'],
    title: '그룹 만들기 창: 이름 · 버튼 · 예시 문구',
    current: '창 제목 · 저장 버튼 "그룹 생성", [취소]는 테두리 버튼, 예시 "예: 프론트엔드 A반"',
    next: '"그룹 만들기", [취소]는 글자 버튼(다른 확인창과 같게), 예시 "예: 중3 수학 A반"',
    markup: '그룹 만들기 창(`cl-dialog--modal --md`) 제목 · 제출 버튼을 "그룹 만들기"로, 취소 버튼을 `cl-btn--ghost` → `cl-btn--text`, `#grp-title` placeholder 를 "예: 중3 수학 A반"으로. 실험실에서는 [그룹 만들기]를 누르면 창이 뜬다.',
    dom: `const b=doc.querySelector('[data-group-list] [data-create]'); if(!b) return; b.classList.add('lab-live');
b.addEventListener('click',e=>{e.preventDefault(); if(doc.querySelector('.lab-dlg')) return;
  const bg=doc.createElement('div'); bg.className='lab-dlg'; bg.style.cssText='position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.4);display:grid;place-items:start center;padding-top:140px';
  bg.innerHTML='<div class="cl-dialog cl-dialog--modal cl-dialog--md" role="dialog" style="position:static;display:flex;margin:0"><div class="cl-dialog__head"><h2 class="cl-dialog__title">그룹 만들기</h2><button type="button" class="cl-icon-btn lab-live" data-x aria-label="닫기">✕</button></div><div class="cl-dialog__body"><div class="cl-field"><label class="cl-field__label" for="grp-title">그룹 이름</label><input id="grp-title" class="cl-input lab-live" type="text" maxlength="50" placeholder="예: 중3 수학 A반"><p class="cl-field__help">50자까지 입력할 수 있습니다.</p></div></div><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--text lab-live" data-x>취소</button><button type="button" class="cl-btn cl-btn--primary lab-live" data-x>그룹 만들기</button></div></div>';
  doc.body.append(bg); bg.querySelectorAll('[data-x]').forEach(x=>x.onclick=()=>bg.remove());});`,
    targets: ['[data-group-list] [data-create]'],
    note: '[그룹 만들기]를 누르면 창이 뜹니다.'
  },
  {
    id: 'K4', group: 3, status: '확정', kind: '마크업', screens: ['group-edit'],
    title: '그룹 편집: 이름을 이 화면에서 바로 바꾸기',
    current: '편집 화면인데 이름은 못 바꾼다. 도움말이 "그룹 이름은 그룹 목록의 ⋯ 메뉴에서 바꿉니다"로 목록으로 돌려보낸다',
    next: '제목 옆 연필 버튼 → 누르면 제목 자리가 입력 칸으로(Enter 저장 · Esc 취소). 도움말의 해당 문장은 뺀다',
    css: `.cl-title-edit { margin-left: 4px; color: var(--cl-ink-muted); }
.cl-title-edit:hover { color: var(--cl-ink); }
.cl-title-input { height: 40px; font-size: var(--cl-fs-page-title); font-weight: 700; max-width: 420px; }`,
    markup: '`h1[data-title]` 뒤에 `<button type="button" class="cl-icon-btn cl-title-edit" aria-label="그룹 이름 바꾸기">`(연필). 누르면 제목을 `<input class="cl-input cl-title-input">` 으로 바꾸고 Enter · 바깥 클릭 저장, Esc 취소. 저장은 목록 "이름 변경"과 같은 요청을 쓴다. `.cl-tg-help` 둘째 문장 삭제.',
    dom: `const h=doc.querySelector('[data-group-edit] h1[data-title]'); if(!h) return;
const b=doc.createElement('button'); b.type='button'; b.className='cl-icon-btn cl-title-edit lab-live'; b.setAttribute('aria-label','그룹 이름 바꾸기'); b.innerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>'; h.after(b);
b.addEventListener('click',()=>{const i=doc.createElement('input'); i.className='cl-input cl-title-input lab-live'; i.value=h.textContent; h.replaceWith(i); b.hidden=true; i.focus(); i.select();
  const done=ok=>{if(ok&&i.value.trim()) h.textContent=i.value.trim(); i.replaceWith(h); b.hidden=false;};
  i.addEventListener('keydown',k=>{if(k.key==='Enter') done(true); if(k.key==='Escape') done(false);}); i.addEventListener('blur',()=>{if(i.isConnected) done(true);});});
const help=doc.querySelector('.cl-tg-help'); if(help) help.textContent='엑셀로 여러 학생을 한 번에 넣거나 뺄 수 있습니다. 학생 목록에서 받은 엑셀을 그대로 쓰면 됩니다.';
const st=doc.createElement('style'); st.textContent='input.lab-live{pointer-events:auto}'; doc.head.append(st);`,
    targets: ['.cl-title-edit'],
    note: '제목 옆 연필을 눌러 보세요.'
  },
  {
    id: 'K5', group: 3, status: '확정', kind: '마크업', screens: ['group-edit'],
    title: '그룹 편집: 엑셀 버튼 3개 → [엑셀 ▾] 하나',
    current: '[엑셀 양식] [엑셀 추가] [엑셀 제거] 가 제목 줄에 같은 무게로 나란히',
    next: '[엑셀 ▾] 하나 → 메뉴: 양식 받기 ─ 엑셀로 학생 추가 · 엑셀로 학생 빼기. 학생 목록의 [엑셀 일괄 처리 ▾]와 같은 방식',
    markup: '세 버튼을 `cl-popover` 하나로 묶는다(학생 목록 엑셀 일괄 처리와 같은 마크업). 메뉴 항목 문구: "양식 받기", "엑셀로 학생 추가", "엑셀로 학생 빼기". 각 항목의 `data-excel-template` / `data-excel="append|remove"` 는 그대로 옮긴다.',
    dom: `const row=doc.querySelector('[data-group-edit] .cl-page__head--row'); if(!row) return; const bs=[...row.querySelectorAll('[data-excel-template],[data-excel]')]; if(!bs.length) return;
const w=doc.createElement('div'); w.className='cl-popover'; w.style.position='relative';
w.innerHTML='<button type="button" class="cl-btn cl-btn--ghost lab-live"><svg class="cl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m8 13 4 4"/><path d="m12 13-4 4"/></svg>엑셀 <svg class="cl-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="cl-popover__panel cl-menu" role="menu" style="min-width:200px"></div>';
const p=w.querySelector('.cl-menu'); const names={template:'양식 받기',append:'엑셀로 학생 추가',remove:'엑셀로 학생 빼기'};
bs.forEach((b,i)=>{b.className='cl-menu__item'; const k=b.dataset.excel||'template'; b.childNodes.forEach(n=>{if(n.nodeType===3) n.textContent=names[k];}); if(i===1){const s=doc.createElement('div'); s.className='cl-menu__sep'; p.append(s);} p.append(b);});
bs[0].parentNode; row.append(w); w.querySelector('button').addEventListener('click',()=>{p.hidden=!p.hidden;});
const st=doc.createElement('style'); st.textContent='.cl-menu__sep{height:1px;margin:4px 6px;background:var(--cl-grid-row)}'; doc.head.append(st);`,
    targets: ['[data-group-edit] .cl-popover'],
    note: '메뉴를 열어 둔 상태입니다. [엑셀]을 누르면 닫힙니다.'
  },
  {
    id: 'K6', group: 6, status: '확정', kind: '문구', screens: ['group-edit'],
    title: '그룹 편집: "원생" → "학생", 검색 안내 통일 (+ 중복 그룹원 확인)',
    current: '왼쪽 목록 이름이 "원생 목록"(다른 화면은 모두 "학생"). 검색 안내 "검색 (아이디, 이름, 메모)". 그룹원 목록에 이호준(lhj992)이 두 번 보인다',
    next: '"학생 목록" · "그룹원 목록", 검색 안내 "이름, 아이디, 메모" (학생 목록 검색과 같은 순서)',
    markup: '`.cl-dual__panel` 의 aria-label · `<strong>` 을 "학생 목록"으로, `.cl-dual__search` placeholder 를 "이름, 아이디, 메모"로. **개발 확인 필요: 테스트그룹 그룹원에 lhj992 가 두 번 들어 있다. 같은 학생이 한 그룹에 두 번 들어가지 않게 막혀 있는지 확인.**',
    dom: `doc.querySelectorAll('[data-group-edit] .cl-dual__panel').forEach(p=>{const s=p.querySelector('.cl-dual__head strong'); if(s&&s.textContent==='원생 목록'){s.textContent='학생 목록'; p.setAttribute('aria-label','학생 목록');} const i=p.querySelector('.cl-dual__search'); if(i) i.placeholder='이름, 아이디, 메모';});`,
    targets: ['[data-group-edit] .cl-dual__head strong']
  },
  {
    id: 'L1', group: 6, status: '확정', kind: '문구', screens: ['categories'],
    title: '분류 목록: 설명 한 줄로 · 조사 오류',
    current: '설명이 세 문장(만드는 순서 · 현재 학기 설정 · 순서 바꾸기)이고 "커리큘럼는"처럼 조사가 틀린다. 열 이름을 학원이 바꿀 수 있어서 조사를 고정으로 붙인 탓',
    next: '"커리큘럼 · 대분류 · 상세분류를 차례로 만들면 강좌를 만들 수 있습니다. 커리큘럼을 만든 뒤 [현재 학기로 설정]을 눌러 주세요." 두 문장. 순서 바꾸기 안내는 손잡이 툴팁(지금도 있음)으로 옮긴다',
    markup: '`.cl-page__meta` 를 한 문장으로. **조사 처리 확인 필요: 열 이름(`data-name-term` 등)이 바뀌어도 맞는 조사(은/는, 을/를)를 붙이거나, 조사가 필요 없는 문장 구조로 쓴다.** 다른 화면에서도 열 이름 변수 뒤에 조사를 붙인 곳이 있는지 같이 확인.',
    dom: `const m=doc.querySelector('[data-category-manage] .cl-page__meta'); if(m) m.textContent='커리큘럼 · 대분류 · 상세분류를 차례로 만들면 강좌를 만들 수 있습니다. 커리큘럼을 만든 뒤 [현재 학기로 설정]을 눌러 주세요.';`,
    targets: ['[data-category-manage] .cl-page__meta']
  },
  {
    id: 'L2', group: 4, status: '확정', kind: 'CSS', screens: ['categories'],
    title: '현재 학기 배지가 선택 표시에 묻힘',
    current: '고른 줄은 연보라 바탕 + 보라 글자인데, "현재 학기" 배지도 연보라(`cl-badge--info`)라 고른 줄 안에서 잘 안 보인다',
    next: '"현재 학기"는 상태라 성공 배지(초록 · `cl-badge--success`)로. 고른 줄 색과 겹치지 않는다',
    css: `[data-category-manage] .cl-mc-pick .cl-badge--info { background: var(--cl-success-bg); color: var(--cl-success); }`,
    markup: '가능하면 클래스를 `cl-badge--info` → `cl-badge--success` 로 바꾼다.',
    targets: ['[data-category-manage] .cl-badge']
  },
  {
    id: 'L3', group: 3, status: '확정', kind: 'CSS', screens: ['categories'],
    title: '분류 줄의 ↑↓ 버튼은 줄에 마우스를 올릴 때만',
    current: '줄마다 손잡이 · 번호 · 이름 · ⋯ · ↑ · ↓ 가 늘 보여서 12줄이면 버튼 48개가 깔린다',
    next: '↑↓ 는 줄에 마우스를 올리거나 키보드로 들어왔을 때만 보인다(자리는 그대로라 줄이 흔들리지 않음). 손잡이 · 번호 · ⋯ 는 그대로',
    css: `[data-category-manage] .cl-sortable__item > [data-up], [data-category-manage] .cl-sortable__item > [data-down] { opacity: 0; transition: opacity var(--cl-dur) var(--cl-ease); }
[data-category-manage] .cl-sortable__item:hover > [data-up], [data-category-manage] .cl-sortable__item:hover > [data-down],
[data-category-manage] .cl-sortable__item:focus-within > [data-up], [data-category-manage] .cl-sortable__item:focus-within > [data-down] { opacity: 1; }
@media (hover: none) { [data-category-manage] .cl-sortable__item > [data-up], [data-category-manage] .cl-sortable__item > [data-down] { opacity: 1; } }`,
    note: '실험실에서는 마우스를 올려 확인하세요. 터치 기기에서는 늘 보입니다.',
    targets: []
  },
  {
    id: 'L4', group: 6, status: '확정', kind: '마크업', screens: ['categories'],
    title: '대분류 열 제목에도 어느 커리큘럼인지',
    current: '상세분류 열 제목에는 "· 랩241 2023년 1학기"가 붙는데, 대분류 열 제목에는 고른 커리큘럼 이름이 없다',
    next: '"대분류 2 · 랩241" — 세 열이 같은 규칙(제목 · 개수 · 상위에서 고른 것)',
    markup: '대분류 열 `h2` 끝에 `<span class="cl-muted"> · {고른 커리큘럼 이름}</span>` 를 상세분류 열과 같은 방식으로 넣는다.',
    dom: `const h=doc.querySelector('[data-category-manage] [data-col="category"] h2'); if(h){const s=doc.createElement('span'); s.className='cl-muted'; s.textContent=' · 랩241'; h.append(s);}`,
    targets: ['[data-col="category"] h2']
  },
  {
    id: 'L5', group: 3, status: '확정', kind: '마크업', screens: ['categories'],
    title: '상세분류 줄은 "강좌 목록으로 가는 링크"라는 표시',
    current: '앞 두 열의 줄은 누르면 오른쪽 열이 바뀌는데, 상세분류 줄은 누르면 강좌 목록으로 이동한다. 모양이 같아서 결과를 예상할 수 없다',
    next: '상세분류 줄 오른쪽 "강좌 6" 뒤에 → 화살표, 마우스를 올리면 이름에 밑줄(공통 링크 스타일)',
    css: `[data-col="sub"] a.cl-mc-pick strong { text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px; transition: text-decoration-color var(--cl-dur) var(--cl-ease); }
[data-col="sub"] a.cl-mc-pick:hover strong { text-decoration-color: currentColor; color: var(--cl-primary-pressed); }
[data-col="sub"] a.cl-mc-pick .cl-muted::after { content: " →"; }`,
    markup: '`[data-col="sub"] a.cl-mc-pick` 의 개수 뒤에 → 화살표(CSS `::after` 또는 아이콘). 행 메뉴의 "강좌 보기"는 줄 링크와 같은 곳이라 빼도 된다.',
    targets: ['[data-col="sub"] .cl-mc-pick']
  },
  {
    id: 'L6', group: 1, status: '확정', kind: '마크업', screens: ['categories'],
    title: '분류 만들기 팝업: 입력 칸 폭 · 아래 줄 · 이름',
    current: '[+ 추가]를 누르면 뜨는 팝업(이름 변경 팝업도 같은 틀). 입력 칸이 팝업 폭을 다 채우지 않고 중간에서 끝나고, 아래 구분선은 양옆이 떠 있으면서 오른쪽으로 더 나가 있고, 버튼 오른쪽 끝이 입력 칸 · 선과 어긋난다. "새로 만드는 것"인데 "추가"라고 부른다',
    next: '입력 칸은 폭을 꽉 채운다. 아래 버튼 줄은 공통 대화상자 틀(`.cl-dialog--modal .cl-dialog__actions`: 팝업 끝까지 닿는 선, 좌우 20px)을 그대로 쓴다. 제목은 "커리큘럼 만들기"(열 이름 + 만들기), 버튼은 [만들기], 열 머리 버튼은 [+ 만들기]',
    css: `#mc-add .cl-input, [data-category-manage] ~ dialog .cl-input { width: 100% !important; }`,
    markup: '`.cl-dialog__actions` 를 `.cl-dialog__body` **밖**(형제)으로 옮긴다 — 그러면 공통 규칙이 선과 여백을 맞춘다. 입력 칸에 붙은 고정 폭을 지운다. 문구: 제목 `{열 이름} 만들기`, 확인 버튼 `만들기`, 열 머리 버튼 `+ 만들기`. 이름 변경 팝업도 같은 구조로(버튼은 `저장`).',
    dom: `const d=doc.getElementById('mc-add'); if(d){const a=d.querySelector('[data-mc-add-actions]'); if(a){a.removeAttribute('style'); d.append(a);} const ok=d.querySelector('[data-mc-add-ok]'); if(ok) ok.textContent='만들기';}
doc.querySelectorAll('[data-mc-add]').forEach(b=>{ b.childNodes.forEach(n=>{ if(n.nodeType===3) n.textContent=n.textContent.replace('추가','만들기'); }); });`,
    note: '열 머리의 [+ 만들기]를 눌러 팝업을 열어 보세요.',
    targets: ['[data-mc-add]']
  },
  {
    id: 'L7', group: 1, status: '확정', kind: 'CSS', screens: ['categories'],
    title: '분류 세 열의 상자 높이를 맞춤',
    current: '열마다 항목 수만큼만 높이가 생겨서(`align-items: start`) 커리큘럼 7개 · 대분류 2개 · 상세분류 3개일 때 상자 세 개의 아래 끝이 제각각이다. 대분류 · 상세분류가 비어 있을 때 특히 짧은 상자가 떠 보인다',
    next: '넓은 화면에서 세 상자는 가장 긴 열에 맞춰 같은 높이로 늘어난다. 한 열로 쌓이는 좁은 화면은 지금처럼 내용만큼',
    css: `@media (min-width: 901px) { .cl-mc-columns { align-items: stretch; } }`,
    markup: '`.cl-mc-columns` 의 `align-items: start` → `stretch`(한 열로 바뀌는 구간은 그대로). 상자 안 빈 상태 문구가 있다면 위쪽에 둔다.',
    note: '커리큘럼에 마우스를 올리면 hover 바탕(`cl-hover`)도 볼 수 있습니다. 지금 코드에 있는 효과 그대로입니다.',
    targets: ['.cl-mc-col']
  },
  {
    id: 'M1', group: 6, status: '확정', kind: '문구', screens: ['subjects', 'subject-create-dlg'],
    title: '과목 목록: 설명 두 문장으로',
    current: '설명이 세 문장. 마지막 "과목을 고르면 그 과목의 강좌가 보입니다."는 화면을 보면 알 수 있다',
    next: '"과목은 선생님과 강좌에 붙는 담당 분야입니다(예: 웹 개발). 선생님을 만들기 전에 과목을 먼저 만들어 주세요."',
    dom: `const m=doc.querySelector('[data-subject-manage] .cl-page__meta'); if(m) m.textContent='과목은 선생님과 강좌에 붙는 담당 분야입니다(예: 웹 개발). 선생님을 만들기 전에 과목을 먼저 만들어 주세요.';`,
    targets: ['[data-subject-manage] .cl-page__meta']
  },
  {
    id: 'M2', group: 1, status: '확정', kind: 'CSS', screens: ['subjects', 'subject-create-dlg'],
    title: '과목 · 강좌 두 상자의 높이를 맞춤',
    current: '`.cl-ms-layout` 이 `align-items: start` 라 과목 목록과 강좌 표의 아래 끝이 다르다. 강좌가 0개인 과목을 고르면 오른쪽 상자만 짧게 뜬다',
    next: '넓은 화면에서 두 상자는 긴 쪽에 맞춰 같은 높이(분류 목록 L7과 같은 규칙). 한 열로 쌓이는 화면은 그대로',
    css: `@media (min-width: 901px) { .cl-ms-layout { align-items: stretch; } }`,
    markup: '`.cl-ms-layout` 의 `align-items: start` → `stretch`(한 열 구간 제외).',
    note: '과목에 마우스를 올리면 hover 바탕도 볼 수 있습니다(지금 코드 그대로).',
    targets: ['.cl-ms-subjects', '[data-courses]']
  },
  {
    id: 'M4', group: 3, status: '확정', kind: '마크업', screens: ['subjects', 'subject-create-dlg'],
    title: '계정으로 들어가기 확인 팝업: 버튼 크기 · 정렬만 공통으로',
    current: '"{이름} 선생님 계정으로 들어갈까요?" / "선생님 화면에서 강좌 · 수강생을 대신 관리합니다. 계정 메뉴의 [사이트 관리]로 돌아올 수 있습니다." / [취소] [들어가기]. 문구는 좋다',
    next: '문구 그대로. 공통 확인 대화상자(`cl-dialog--confirm`) 틀을 쓴다: 제목 · 설명 · 오른쪽 아래 [취소] [들어가기]. 선생님 목록 · 상세의 "계정으로 들어가기"도 같은 팝업 하나를 쓴다. 강좌 이름과 선생님 이름은 지금처럼 둘 다 이 팝업 → 그 선생님 계정의 강좌로 간다',
    markup: '세 화면(과목 목록, 선생님 목록, 선생님 상세)의 들어가기 확인을 같은 컴포넌트 하나로. 선생님이 여러 명인 강좌는 확인 팝업 안에서 들어갈 선생님을 고른다(정함 · 2026-10-21): 제목 "어느 선생님 계정으로 들어갈까요?", 담당 선생님 목록을 라디오로(첫 번째가 기본 선택), [취소][들어가기]. 선생님이 한 명이면 지금처럼 이름을 넣은 확인 팝업.',
    targets: ['[data-subject-manage] .cl-mt-id', '[data-subject-manage] .cl-ms-teacher']
  },
  {
    id: 'N1', group: 3, status: '확정', kind: '마크업', screens: ['course-list', 'categories', 'subjects', 'cms', 'board', 't-group', 'subject-create-dlg', 'notice-create-dlg', 't-group-create-dlg'],
    title: '행 메뉴(⋯): 삭제는 구분선 아래 빨간색으로 (강좌 · 분류 · 과목 목록)',
    current: '수강 관리 · 강좌 수정 · 선생님 화면에서 관리 · 삭제가 같은 모양으로 붙어 있다. 삭제에 `cl-menu__item--danger` 가 있지만 `.cl-row-menu__panel .cl-menu__item` 규칙이 더 강해서 검은 글자로 보인다. 분류 · 과목 목록 메뉴도 같다',
    next: '선생님 목록(C5)과 같은 규칙: 삭제 앞에 구분선, 삭제는 빨간 글자 · hover 연빨강 바탕. 강좌 목록은 [수강 관리][강좌 수정] ─ [선생님 화면에서 관리] ─ [삭제]. 항목 · 링크 · 동작은 지금 그대로',
    css: `.cl-menu__sep { height: 1px; margin: 4px 6px; background: var(--cl-grid-row); }
.cl-row-menu__panel .cl-menu__item--danger, .cl-row-menu__panel .cl-menu__item--danger .cl-icon { color: var(--cl-danger); }
.cl-row-menu__panel .cl-menu__item--danger:hover { background: var(--cl-danger-bg); }`,
    markup: '각 행 메뉴에서 `cl-menu__item--danger` 바로 앞에 `<div class="cl-menu__sep" role="separator"></div>`. 강좌 목록은 "선생님 화면에서 관리" 앞에도 하나. 위 CSS 는 공통 컴포넌트(components.css)에 한 번만 넣으면 모든 행 메뉴에 적용된다.',
    dom: `const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
doc.querySelectorAll('.cl-row-menu__panel').forEach(p=>{ if(p.closest('[data-teacher-manage]')) return; const del=p.querySelector('.cl-menu__item--danger'); if(del && !(del.previousElementSibling||{}).classList?.contains('cl-menu__sep') && del.previousElementSibling) del.before(sep());
  const imp=[...p.children].find(i=>i.textContent.includes('선생님 화면에서 관리')); if(imp) imp.before(sep()); });
doc.querySelectorAll('.cl-row-menu__trigger').forEach(b=>{ if(b.classList.contains('lab-live')) return; b.classList.add('lab-live'); b.addEventListener('click',()=>{const p=b.nextElementSibling; doc.querySelectorAll('.cl-row-menu__panel').forEach(x=>x!==p&&(x.hidden=true)); p.hidden=!p.hidden; const r=b.getBoundingClientRect(); p.style.top=(r.bottom+4)+'px'; p.style.left=(r.right-p.offsetWidth)+'px';}); });`,
    note: '⋯ 를 눌러 메뉴를 열어 보세요. 메뉴의 링크(강좌 수정 등)는 지금 연결 그대로입니다.',
    targets: ['.cl-row-menu__trigger']
  },
  {
    id: 'P1', group: 6, status: '확정', kind: '문구', screens: ['contents'],
    title: '콘텐츠 목록: 설명 두 문장으로',
    current: '설명이 세 문장, 두 줄 가까이 된다(제목 · 강좌 이름 누를 때 동작을 한 문장에 몰아 씀)',
    next: '"강좌에 등록된 강의 콘텐츠입니다. 원본은 [CMS 콘텐츠 관리]에서 다룹니다." — 누를 때 동작은 제목 · 강좌 이름의 툴팁(title)으로 옮긴다. 강좌 목록(L1 · M1)과 같은 길이',
    markup: '`.cl-page__meta` 두 문장으로. 콘텐츠 제목 버튼 `title="정보 창에서 재생"`, 강좌 링크 `title="대표 선생님 계정으로 강의 수정 · 순서 열기"`.',
    dom: `const m=doc.querySelector('[data-content-manage] .cl-page__meta'); if(m) m.textContent='강좌에 등록된 강의 콘텐츠입니다. 원본은 [CMS 콘텐츠 관리]에서 다룹니다.';
doc.querySelectorAll('[data-content-manage] .cl-ms-teacher').forEach(b=>b.title='대표 선생님 계정으로 강의 수정 · 순서 열기');`,
    targets: ['[data-content-manage] .cl-page__meta']
  },
  {
    id: 'P2', group: 3, status: '확정', kind: 'CSS', screens: ['contents'],
    title: '콘텐츠 제목 줄: 긴 제목은 한 줄로 자르고, 숫자 칸 정렬',
    current: '긴 제목(유튜브 제목 등)이 표 폭을 밀어 강좌 · 과목 칸이 오른쪽으로 밀린다. 순서 · 등록일 숫자 폭이 들쭉날쭉',
    next: '제목은 최대 480px 에서 말줄임(…), 마우스를 올리면 전체 제목 툴팁. 순서 · 등록일은 고정폭 숫자(`cl-num`)',
    css: `[data-content-manage] .cl-mco-title__btn { display: inline-block; max-width: min(480px, 100%); vertical-align: bottom; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-content-manage] td.cl-num, [data-content-manage] .cl-table__num { font-variant-numeric: tabular-nums; }
@media (max-width: 900px) { [data-content-manage] .cl-mco-title { display: flex; min-width: 0; max-width: 100%; } [data-content-manage] .cl-mco-title__btn { min-width: 0; max-width: 100%; } }`,
    markup: '제목 버튼에 `title="{전체 제목}"` 도 넣는다(잘렸을 때 확인용).',
    targets: ['[data-content-manage] .cl-mco-title__btn']
  },
  {
    id: 'Q1', group: 3, status: '확정', kind: '마크업', screens: ['cms'],
    title: 'CMS 행 메뉴 7개를 성격별로 묶음',
    current: '정보 · 수정 / 강좌 · 강의 조회 / 소유자 변경 / 공개설정 / 내려받기 / 공유 링크 복사 / 삭제 — 7개가 한 덩어리로 나열되어 찾기 어렵고, 삭제가 검은 글자로 붙어 있다',
    next: '[정보 · 수정][강좌 · 강의 조회] ─ [공개설정][소유자 변경] ─ [내려받기][공유 링크 복사] ─ [삭제(빨강)]. 보기 → 바꾸기 → 가져가기 → 지우기 순서. 항목 · 동작은 그대로, 공개설정과 소유자 변경만 자리를 바꾼다',
    markup: '메뉴 순서를 위처럼 바꾸고 묶음 사이에 `<div class="cl-menu__sep" role="separator"></div>` 세 개. 빨간 삭제는 N1 공통 CSS.',
    dom: `const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
doc.querySelectorAll('[data-cms-manage] .cl-row-menu__panel').forEach(p=>{ p.querySelectorAll('.cl-menu__sep').forEach(x=>x.remove()); const by=t=>[...p.children].find(i=>i.textContent.trim()===t);
  const order=['정보 · 수정','강좌 · 강의 조회',0,'공개설정','소유자 변경',0,'내려받기','공유 링크 복사',0,'삭제']; order.forEach(o=>p.append(o?by(o):sep())); });`,
    note: '⋯ 를 눌러 확인하세요.',
    targets: ['[data-cms-manage] .cl-row-menu__trigger']
  },
  {
    id: 'Q2', group: 6, status: '확정', kind: '문구', screens: ['cms', 'contents', 't-cms-page'],
    title: '콘텐츠 형식 이름이 화면마다 다름',
    current: 'CMS 콘텐츠 관리는 "동영상 · 녹화", 콘텐츠 목록은 "영상 · 녹화 · 소셜미디어". 같은 파일을 한쪽은 동영상, 한쪽은 영상이라 부른다',
    next: '한 가지로: 영상 / 녹화 / 소셜미디어. 형식 필터("모든 형식")의 선택지도 같은 이름',
    markup: '형식 이름을 한 곳(상수 · 번역 파일)에서 가져오게 하고 "동영상" → "영상".',
    dom: `doc.querySelectorAll('[data-cms-manage] .cl-cms-item__meta > span:first-child').forEach(s=>{ if(s.textContent==='동영상') s.textContent='영상'; });`,
    targets: ['.cl-cms-item__meta > span:first-child', 'td[data-label="형식"]']
  },
  {
    id: 'Q3', group: 3, status: '확정', kind: 'CSS', screens: ['cms'],
    title: 'CMS 콘텐츠 제목 줄: 콘텐츠 목록과 같은 모양',
    current: '썸네일 · 제목 · 아래 보조 줄(형식 · 날짜 · 시간 · 용량) 구조는 좋다. 다만 제목이 파일 이름(UUID 등)이라 길고, 보조 줄 숫자 폭이 들쭉날쭉',
    next: '제목은 콘텐츠 목록(P2)과 같이 480px 말줄임 + 툴팁, 보조 줄은 `cl-fs-caption` `cl-ink-muted` 고정폭 숫자. 썸네일 64×36 · 반경 6px 은 콘텐츠 목록과 같게',
    css: `[data-cms-manage] .cl-cms-item__title { max-width: 480px; }
[data-cms-manage] .cl-cms-item__meta .cl-num { font-variant-numeric: tabular-nums; }`,
    markup: '제목 버튼에 `title="{전체 제목}"`. 업로드할 때 파일 이름 대신 사람이 읽을 제목을 받는다 (정함 · 2026-10-22): 업로드 창에 "제목" 칸(기본값 = 파일 이름에서 확장자를 뺀 것), 지금 UUID 로 저장된 콘텐츠는 목록에서 그대로 두고 수정 화면에서 제목을 고칠 수 있게.',
    targets: ['[data-cms-manage] .cl-cms-item__title']
  },
  {
    id: 'Q4', group: 2, status: '확정', kind: '토큰', screens: ['cms', 'board', 'login-detail', 'notice-create-dlg', 't-cms-page'],
    title: '이름 옆 아이디: 한 단계 연한 회색 + 작은 글자',
    current: '소유자 "탁유원 ywtag001" 의 아이디가 `cl-muted`(`cl-ink-muted` #5E5E63, 14px). 이름(#1D1D1F)과 크기가 같고 색 차이도 작아 한 덩어리로 읽힌다',
    next: '새 토큰 `cl-ink-subtle` #6E6E73(흰 바탕 5.07:1, 행 hover 바탕 4.86:1 — WCAG AA 4.5:1 통과) + 13px(`cl-fs-caption`). 크기와 색 두 가지로 이름과 갈라진다. `cl-muted` 자체는 그대로 둔다',
    css: `:root { --cl-ink-subtle: #6E6E73; }
[data-cms-manage] td[data-label="소유자"] .cl-muted { color: var(--cl-ink-subtle); font-size: var(--cl-fs-caption); }`,
    markup: '`tokens.json` · `cl-tokens.css` 에 `cl-ink-subtle: #6E6E73` 추가. 이름 옆 아이디 span 에 `cl-id` 같은 전용 클래스를 달고 `color: var(--cl-ink-subtle); font-size: var(--cl-fs-caption)`. **`cl-muted` / `cl-ink-muted` 값은 바꾸지 않는다**(등록일 · 개수 · 메모 추가 등 60곳 이상이 같이 바뀜). 적용 위치: 확인된 곳은 CMS 콘텐츠 관리 소유자 칸 한 곳. 실험실에 없는 화면은 코드에서 `이름</span><span class="cl-muted"> 아이디` 패턴(사람 이름 바로 뒤 아이디)을 검색해 같은 클래스로 바꾼다.',
    note: '#6E6E73 보다 연하게(#76767B 이상) 하면 행 hover 바탕에서 4.5:1 아래로 떨어집니다.',
    targets: ['[data-cms-manage] td[data-label="소유자"] .cl-muted']
  },
  {
    id: 'R1', group: 4, status: '확정', kind: 'CSS', screens: ['board', 'notice-create-dlg'],
    title: '공지 줄: 보라 배지 + 보라 바탕 겹침 정리',
    current: '공지 줄은 연보라 바탕(#FBF8FF, 토큰 밖 값) 위에 연보라 "공지" 배지(`cl-badge--info`). 보라는 "누를 수 있음 · 고른 것"에 쓰기로 했는데 상태 표시에 쓰였고, 바탕과 배지가 같은 색이라 배지가 묻힌다',
    next: '줄 바탕은 회백색(`cl-parchment` 계열 #F7F7F8 → 토큰 `cl-row-hover` #FAFAFB), "공지" 배지는 진한 회색 칩(`cl-badge--neutral` + 600). 맨 위 고정이라는 건 위치와 배지로 충분하다',
    css: `.cl-mb-notice { background: var(--cl-row-hover, #FAFAFB); }
.cl-mb-notice .cl-badge--info { background: var(--cl-ink); color: var(--cl-canvas); font-weight: 600; }`,
    markup: '`cl-mb-notice` 바탕을 토큰으로(#FBF8FF 직접 값 제거). 공지 배지 클래스를 `cl-badge--info` → 진한 칩(예: `cl-badge--ink`, 바탕 `cl-ink` · 글자 `cl-on-ink`)으로.',
    targets: ['.cl-mb-notice .cl-badge']
  },
  {
    id: 'R2', group: 6, status: '확정', kind: '마크업', screens: ['board', 'notice-create-dlg'],
    title: '작성자 "관리자 (admin)" → 이름 + 연한 아이디',
    current: '작성자 칸이 "관리자 (admin)" 처럼 괄호로 아이디를 붙인 한 덩어리. CMS 소유자 칸은 괄호 없이 "탁유원 ywtag001"',
    next: '"관리자 admin" — 이름은 기본 글자, 아이디는 Q4 규칙(`cl-ink-subtle` #6E6E73 · 13px). 사람 이름 + 아이디는 어디서나 같은 모양',
    css: `[data-board-manage] td[data-label="작성자"] .cl-id { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }`,
    markup: '작성자 칸을 `{이름}<span class="cl-id"> {아이디}</span>` 로(괄호 제거). Q4와 같은 클래스.',
    dom: `doc.querySelectorAll('[data-board-manage] td[data-label="작성자"]').forEach(td=>{const m=td.textContent.match(/^(.*) \\((.*)\\)$/); if(m){td.textContent=m[1]; const s=doc.createElement('span'); s.className='cl-id'; s.textContent=' '+m[2]; td.append(s);}});`,
    targets: ['[data-board-manage] td[data-label="작성자"]']
  },
  {
    id: 'R3', group: 6, status: '확정', kind: '마크업', screens: ['board', 'notice-create-dlg'],
    title: '제목 뒤 댓글 수 "[1]" → "댓글 1"',
    current: '"수업 능률이 쑥쑥 향상 됩니다!! [1]" — 대괄호 숫자가 제목의 일부처럼 읽힌다',
    next: '제목 뒤에 작은 회색 "댓글 1"(13px `cl-ink-muted`). 댓글이 없으면 표시 안 함',
    css: `.cl-mb-cmt { margin-left: 6px; font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); font-weight: 400; }`,
    markup: '`[{n}]` → `<span class="cl-mb-cmt">댓글 {n}</span>`.',
    dom: `doc.querySelectorAll('.cl-mb-cmt').forEach(s=>{s.textContent=s.textContent.replace(/\\[(\\d+)\\]/,'댓글 $1');});`,
    targets: ['.cl-mb-cmt']
  },
  {
    id: 'S1', group: 1, status: '확정', kind: 'CSS', screens: ['alarm'],
    title: '알림 보내기: 두 상자 높이 맞춤',
    current: '왼쪽 알림 내용 상자가 오른쪽 받는 사람 상자보다 짧게 끝난다(`align-items: start`)',
    next: '넓은 화면에서 두 상자 같은 높이(L7 · M2 와 같은 규칙). [알림 보내기] 줄은 왼쪽 상자 맨 아래에 붙는다',
    css: `@media (min-width: 901px) { .cl-ma-layout { align-items: stretch; } .cl-ma-send { margin-top: auto; } }`,
    markup: '`.cl-ma-layout` `align-items: stretch`, `.cl-ma-send` `margin-top: auto`.',
    targets: ['.cl-ma-form', '.cl-ma-users']
  },
  {
    id: 'S2', group: 3, status: '확정', kind: '마크업', screens: ['alarm'],
    title: '받는 사람 표: 이름 먼저, 아이디는 연하게',
    current: '아이디(첫 칸, 기본 글자) → 이름 → 상태. 다른 목록은 이름이 첫 칸이고 아이디는 보조',
    next: '이름 칸 하나에 "송민성 songminseong"(Q4 규칙: 아이디 `cl-ink-subtle` 13px). 칸이 셋 → 둘(이름 · 상태)이라 받는 사람을 훑기 쉽다. 검색은 지금처럼 아이디 · 이름 둘 다',
    css: `[data-alarm-manage] .cl-id { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }`,
    markup: '아이디 칸을 빼고 이름 칸을 `{이름}<span class="cl-id"> {아이디}</span>` 로. 체크박스 `aria-label` 은 그대로 이름.',
    dom: `const t=doc.querySelector('[data-alarm-manage] .cl-mu-table'); if(t){ t.querySelectorAll('tr').forEach(tr=>{const c=tr.children; if(tr.parentElement.tagName==='THEAD'){c[1].remove(); return;} const id=c[1].textContent; c[1].remove(); const s=doc.createElement('span'); s.className='cl-id'; s.textContent=' '+id; tr.children[1].append(s); tr.children[1].setAttribute('data-primary','');}); }`,
    targets: ['[data-alarm-manage] .cl-mu-table td[data-label="이름"]']
  },
  {
    id: 'S3', group: 4, status: '확정', kind: '마크업', screens: ['alarm'],
    title: '상태 "대기 · 승인" 을 점 + 글자로',
    current: '상태가 맨 글자라 대기와 승인이 같은 모양',
    next: '상태 점 + 글자: 승인은 꽉 찬 점 `cl-success`, 대기는 속이 빈 고리 `cl-warning`. 두 색은 밝기가 거의 같아(흰 바탕 5.95:1 / 5.86:1) 색약이면 구분이 어렵다 — 글자와 점 모양으로도 구분되게 한다',
    css: `[data-alarm-manage] .cl-ma-state::before { content: ""; display: inline-block; width: 6px; height: 6px; margin-right: 6px; border-radius: 50%; background: currentColor; vertical-align: middle; }
[data-alarm-manage] .cl-ma-state--ok { color: var(--cl-success); } [data-alarm-manage] .cl-ma-state--wait { color: var(--cl-warning); }
[data-alarm-manage] .cl-ma-state--wait::before { background: transparent; box-shadow: inset 0 0 0 1.5px currentColor; width: 7px; height: 7px; }`,
    markup: '상태 글자를 `<span class="cl-ma-state cl-ma-state--ok|wait">` 로. 승인 대기 학생에게도 알림이 간다(확인됨) — 체크박스는 그대로.',
    dom: `doc.querySelectorAll('[data-alarm-manage] td[data-label="상태"]').forEach(td=>{const t=td.textContent.trim(); td.innerHTML='<span class="cl-ma-state '+(t==='승인'?'cl-ma-state--ok':'cl-ma-state--wait')+'">'+t+'</span>';});`,
    targets: ['[data-alarm-manage] td[data-label="상태"]']
  },
  {
    id: 'S4', group: 6, status: '확정', kind: '문구', screens: ['alarm'],
    title: '받는 사람이 0명일 때 안내',
    current: '"받는 사람 0명" 옆 [알림 보내기]가 늘 활성. 눌러야 무엇이 빠졌는지 안다',
    next: '0명이면 "오른쪽에서 받는 사람을 골라 주세요"(`cl-ink-muted`), 1명 이상이면 "받는 사람 3명"(600). 버튼은 활성 그대로 두고, 눌렀을 때 빠진 칸으로 이동 + 오류 표시',
    markup: '`[data-selected]` 문구를 인원에 따라 바꾼다. 버튼을 비활성으로 만들지 않는 이유: 비활성 버튼은 왜 못 누르는지 알려주지 못한다.',
    dom: `const s=doc.querySelector('[data-alarm-manage] [data-selected]'); const n=doc.querySelectorAll('[data-alarm-manage] tbody input:checked').length; if(s && !n) s.textContent='오른쪽에서 받는 사람을 골라 주세요';`,
    note: '실험실은 5명을 고른 상태라 이 문구는 체크를 모두 풀었을 때의 안내입니다(개발 반영 대상).',
    targets: ['[data-alarm-manage] [data-selected]']
  },
  {
    id: 'S5', group: 6, status: '확정', kind: '마크업', screens: ['alarm'],
    title: '빠진 칸 오류는 그 칸 아래에',
    current: '내용을 비우고 보내면 상자 맨 위 빨간 배너 "내용을 입력해주세요." 만 뜬다. 정작 내용 칸은 보라 포커스 테두리라 오류인지 알 수 없고, 배너와 칸이 떨어져 있다. "입력해주세요" 띄어쓰기도 다른 화면("주세요")과 다르다',
    next: '배너는 숨기고, 내용 칸 테두리 빨강 + 칸 아래 "내용을 입력해 주세요"(`cl-field__error`, 도움말 "40자까지" 자리를 대신). 보내기를 누르면 첫 번째 빠진 칸으로 포커스. 배너는 서버 오류(발송 실패 등)에만 쓴다',
    css: `[data-alarm-manage] .cl-input[aria-invalid="true"] { border-color: var(--cl-danger); }
[data-alarm-manage] .cl-input[aria-invalid="true"]:focus { outline-color: var(--cl-danger); }`,
    markup: '검증 실패 시 칸에 `aria-invalid="true"` + `aria-describedby="{id}-error"`, 도움말 자리에 `<p class="cl-field__error" id="{id}-error">내용을 입력해 주세요</p>`. `[data-error]` 배너는 서버 오류 전용.',
    dom: `const b=doc.querySelector('[data-alarm-manage] [data-error]'); if(b) b.hidden=true; b && (b.style.display='none');
const i=doc.getElementById('ma-content'); if(i){ i.setAttribute('aria-invalid','true'); const h=i.parentElement.querySelector('.cl-field__help'); if(h){h.className='cl-field__error'; h.id='ma-content-error'; h.textContent='내용을 입력해 주세요';} i.setAttribute('aria-describedby','ma-content-error'); }`,
    targets: ['#ma-content']
  },
  {
    id: 'S6', group: 6, status: '확정', kind: '마크업', screens: ['alarm'],
    title: '받는 사람 요약: 인원은 굵게, 이름은 연하게',
    current: '"받는 사람 5명 · 김대은, 케비, 김리원 외" 전체가 회색 한 줄이라 몇 명인지 눈에 안 들어온다',
    next: '"받는 사람 5명"(600 `cl-ink`) + 이름 목록(`cl-ink-muted` 13px, 한 줄 말줄임). 고른 줄의 연보라 바탕은 지금 그대로(고른 것 = 보라 규칙)',
    css: `[data-alarm-manage] [data-selected] { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-alarm-manage] [data-selected] b { font-weight: 600; color: var(--cl-ink); }`,
    markup: '`[data-selected]` 를 `<b>받는 사람 {n}명</b> · {이름들} 외` 구조로.',
    dom: `const s=doc.querySelector('[data-alarm-manage] [data-selected]'); if(s && /^받는 사람 \\d+명/.test(s.textContent)){ const m=s.textContent.match(/^(받는 사람 \\d+명)(.*)$/); s.innerHTML='<b>'+m[1]+'</b>'+m[2]; }`,
    targets: ['[data-alarm-manage] [data-selected]']
  },
  {
    id: 'U1', group: 3, status: '확정', kind: 'CSS', screens: ['login-stat', 'login-stat-t'],
    title: '로그인 현황: 날짜가 "로그인 상세로 가는 링크"로 보이게',
    current: '날짜(`cl-table__title`, 굵은 검정)를 누르면 그날의 로그인 상세가 열리는데, 다른 굵은 글자와 모양이 같아 눌러지는지 모른다',
    next: '날짜는 공통 링크 모양: hover 때 보라 글자 + 밑줄, 날짜 뒤 작은 →. 툴팁 "이 날 로그인 상세 보기". 연결은 지금 그대로(`/manager/stat/detail?date=`)',
    css: `[data-stat-login] tbody td[data-primary] a { text-underline-offset: 3px; }
[data-stat-login] tbody td[data-primary] a:hover { color: var(--cl-primary-pressed) !important; text-decoration: underline !important; }
[data-stat-login] tbody td[data-primary] a::after { content: " →"; font-weight: 400; color: var(--cl-ink-muted); }`,
    markup: '날짜 링크에 `title="이 날 로그인 상세 보기"`. 화살표는 CSS `::after` 로(분류 목록 L5 와 같은 규칙).',
    note: '실험실에서 날짜를 누르면 로그인 상세로 이동합니다.',
    targets: ['[data-stat-login] tbody td[data-primary] a']
  },
  {
    id: 'U2', group: 6, status: '확정', kind: '문구', screens: ['login-stat', 'login-stat-t', 'login-detail', 't-progress'],
    title: '통계 화면: 날짜 표기 · 버튼 이름 · 합계',
    current: '표 날짜가 "2026-10-20"(다른 화면은 "2026.10.20"). 오른쪽 위 버튼이 "엑셀"(학생 목록은 "엑셀 다운로드"). 표 아래 "2일"만 있어 로그인이 몇 회인지 안 보인다',
    next: '날짜 "2026.10.20", 시각 "2026.10.20 11:48:34". 버튼 "엑셀 다운로드". 현황 표 아래 "2일 · 로그인 3회". 날짜 입력 칸(input type=date)은 브라우저 형식 그대로',
    markup: '표의 날짜 · 시각 출력 형식을 `YYYY.MM.DD` 로. 엑셀 버튼 문구. `[data-summary]` 에 합계 추가.',
    dom: `doc.querySelectorAll('[data-stat-login] tbody td[data-primary] a, [data-stat-detail] tbody td[data-primary]').forEach(e=>{e.textContent=e.textContent.replace(/(\\d{4})-(\\d{2})-(\\d{2})/,'$1.$2.$3');});
doc.querySelectorAll('[data-excel]').forEach(b=>{b.lastChild.textContent='엑셀 다운로드';});
const s=doc.querySelector('[data-stat-login] [data-summary]'); if(s) s.textContent='2일 · 로그인 3회';`,
    targets: ['[data-excel]', '[data-summary]']
  },
  {
    id: 'U3', group: 3, status: '확정', kind: '마크업', screens: ['login-stat', 'login-stat-t'],
    title: '그래프: 표의 지금 쪽이 아니라 고른 기간 전체를, 기간에 맞는 단위로',
    current: '그래프가 표의 지금 쪽(10줄)만 그린다. 선생님 탭은 "291일" 중 최근 10일만 막대가 되고, 쪽을 넘기면 그래프도 바뀐다. 로그인 있는 날만 칸이 생겨 06-10 → 10-01(약 4개월 공백)이 다른 날과 같은 간격으로 붙어 보인다. 학생 탭도 10-16 → 10-20 사이 3일이 빠져 있다',
    next: '그래프는 기간 필터 전체를 그리고 표 쪽 넘김과 상관없다. 빈 날 · 빈 주 · 빈 달도 0 칸으로 둔다. 단위는 기간 길이로 기본값을 고른다: 31일 이하 → 일별, 32일~6개월 → 주별, 6개월 넘음 → 월별. 그래프 제목 오른쪽에 [일][주][월] 전환(`cl-segmented`)을 두어 바꿔 볼 수 있다(예: 3개월인데 일별로 몰린 날 확인). 기간을 바꾸면 기본값으로 되돌린다. 기간 선택(기간 전체 · 1주일 · 3개월 · 6개월 · 1년)과 단위 전환은 따로 둔다 — 기간은 "얼마나", 단위는 "어떻게 묶어 보나". 기본 단위: 1주일 → 일, 3개월 · 6개월 → 주, 1년 · 기간 전체 → 월. 막대가 2개 미만이 되는 단위는 끈다(예: 1주일에서 주 · 월 비활성, 툴팁 "기간이 짧아 볼 수 없습니다"). 날짜를 직접 넣으면 위 31일 · 6개월 기준을 쓴다. "기간 전체"는 첫 기록부터 오늘까지로 계산한다. 막대 툴팁 "2026.05 · 로그인 7회"',
    markup: '차트 데이터는 표 API 와 따로 기간 집계로 받는다(또는 프론트에서 전체를 받아 집계). 날짜 배열을 기간 단위로 채운 뒤(빈 칸 0) 그린다. 축 이름: 일별 "10-16", 주별 "10-13 주", 월별 "2026.05". 그래프 제목도 "날짜별 로그인" → "기간별 로그인".',
    dom: `const root=doc.querySelector('[data-stat-login]'); const p=root&&root.querySelector('.cl-chart__plot'), a=root&&root.querySelector('.cl-chart__axis'); if(p&&a){ let v, lab;
 if(root.hasAttribute('data-stat-teacher')){ v=[1,6,3,0,0,0,3]; lab=['2026.04','2026.05','2026.06','2026.07','2026.08','2026.09','2026.10']; const mx=root.querySelector('.cl-chart__max'); if(mx) mx.textContent='6회'; v=v.map(x=>x/6*100); }
 else { v=[50,0,0,0,100]; lab=['10-16','10-17','10-18','10-19','10-20']; }
 p.style.setProperty('--cl-chart-cols',v.length); a.style.setProperty('--cl-chart-cols',v.length);
 p.innerHTML=v.map(h=>'<div class="cl-chart__col"><span class="cl-chart__bar is-primary" style="height:'+h+'%"></span></div>').join(''); a.innerHTML=lab.map(d=>'<span><b>'+d+'</b></span>').join('');
 const t=root.querySelector('.cl-md-title'); if(t) t.textContent='기간별 로그인';
 const head=root.querySelector('.cl-md-chart__head'); if(head && !head.querySelector('[data-unit]')){ const cur=root.hasAttribute('data-stat-teacher')?'월':'일'; const g=doc.createElement('div'); g.className='cl-segmented'; g.setAttribute('role','group'); g.setAttribute('aria-label','그래프 단위'); g.dataset.unit=''; g.style.marginLeft='auto'; g.style.marginRight='12px';
  g.innerHTML=['일','주','월'].map(u=>'<button type="button" class="cl-segmented__item lab-live" style="width:auto;padding:0 10px;font-size:var(--cl-fs-caption)" aria-pressed="'+(u===cur)+'">'+u+'</button>').join('');
  g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b))));
  const lg=head.querySelector('.cl-md-legend'); head.style.display='flex'; head.style.alignItems='center'; head.insertBefore(g,lg); } }`,
    note: '학생 탭(5일 → 일별)과 선생님 탭(6개월 넘음 → 월별)을 오가며 비교해 보세요.',
    targets: ['[data-stat-login] .cl-chart__plot']
  },
  {
    id: 'U4', group: 3, status: '확정', kind: 'CSS', screens: ['login-stat', 'login-stat-t', 'login-detail'],
    title: '도구 줄: [검색] 버튼을 버튼처럼',
    current: '[검색] · [초기화] 가 둘 다 글자 버튼이라 같아 보인다. 날짜 · 이름을 바꾼 뒤 눌러야 하는 건 [검색] 인데 눈에 안 띈다',
    next: '[검색]은 연보라 버튼(`cl-btn--tint --sm`), [초기화]는 글자 버튼 그대로. [검색] 버튼은 남긴다 (정함 · 2026-10-22)',
    css: `[data-search-btn] { background: var(--cl-primary-tint); color: var(--cl-primary-pressed); }`,
    markup: '`[검색]` 버튼 클래스를 `cl-btn--tint` 로.',
    targets: ['[data-search-btn]']
  },
  {
    id: 'U5', group: 3, status: '확정', kind: '마크업', screens: ['login-detail'],
    title: '로그인 상세: 브라우저 정보는 요약해서',
    current: '"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 …" 원문이 그대로 나와 표의 절반을 차지한다. 사용자 칸은 "사혜인 (sahyein1)" 괄호 표기',
    next: '브라우저 칸은 "Chrome 155 · Windows" 요약(대부분의 기록이 100자 넘는 원문이라 요약이 기본), 원문은 툴팁 · 엑셀 다운로드에는 원문 그대로. 줄에 마우스를 올리면(키보드 포커스 포함) 요약 옆에 복사 아이콘 버튼(`aria-label="브라우저 원문 복사"`)이 나타나고, 누르면 원문을 클립보드에 넣고 "복사했습니다" 토스트. 사용자는 Q4 규칙 "사혜인 sahyein1"(아이디 연한 회색 13px). 날짜를 직접 넣으면 기간 칸이 "직접 입력"으로 바뀌고, 기간 칸에서 다른 값을 고르면 날짜 칸이 그 기간으로 채워진다 (정함 · 2026-10-22)',
    css: `[data-stat-detail] .cl-id { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }
[data-stat-detail] td[data-ua] { white-space: nowrap; }
.cl-ua-copy { display: inline-grid; width: 26px; height: 26px; margin-left: 6px; vertical-align: middle; opacity: 0; transition: opacity var(--cl-dur) var(--cl-ease); }
tr:hover .cl-ua-copy, .cl-ua-copy:focus-visible { opacity: 1; }
@media (hover: none) { .cl-ua-copy { opacity: 1; } }`,
    markup: 'User-Agent 를 브라우저 · OS 로 줄여 보이고 `title` 에 원문. 셀 안에 `<button class="cl-icon-btn cl-ua-copy" aria-label="브라우저 원문 복사">`(16px copy 아이콘) → `navigator.clipboard.writeText(원문)` 후 공통 토스트. 사용자 칸 `{이름}<span class="cl-id"> {아이디}</span>`.',
    dom: `doc.querySelectorAll('[data-stat-detail] td[data-ua]').forEach(td=>{const ua=td.textContent; const b=(ua.match(/(Edg|Chrome|Firefox|Version)\\/(\\d+)/)||[]); const os=/Windows/.test(ua)?'Windows':/Mac OS/.test(ua)?'macOS':/Android/.test(ua)?'Android':/iPhone|iPad/.test(ua)?'iOS':''; td.title=ua; td.textContent=(b[1]==='Version'?'Safari':b[1]==='Edg'?'Edge':b[1]||'')+' '+(b[2]||'')+' · '+os;; const btn=doc.createElement('button'); btn.type='button'; btn.className='cl-icon-btn cl-ua-copy lab-live'; btn.setAttribute('aria-label','브라우저 원문 복사'); btn.title='원문 복사'; btn.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'; btn.addEventListener('click',()=>{try{navigator.clipboard.writeText(ua);}catch(e){} let t=doc.getElementById('ua-toast'); if(!t){t=doc.createElement('div'); t.id='ua-toast'; t.style.cssText='position:fixed;left:50%;bottom:32px;transform:translateX(-50%);padding:10px 16px;border-radius:12px;background:var(--cl-ink);color:var(--cl-canvas);font-size:14px;z-index:99'; doc.body.append(t);} t.textContent='복사했습니다'; t.hidden=false; clearTimeout(t._h); t._h=setTimeout(()=>t.hidden=true,1600);}); td.append(btn);});
doc.querySelectorAll('[data-stat-detail] td[data-label="사용자"]').forEach(td=>{const m=td.textContent.match(/^(.*) \\((.*)\\)$/); if(m){td.textContent=m[1]; const s=doc.createElement('span'); s.className='cl-id'; s.textContent=' '+m[2]; td.append(s);}});`,
    targets: ['[data-stat-detail] td[data-ua]']
  },
  {
    id: 'V1', group: 4, status: '확정', kind: '마크업', screens: ['demand'],
    title: '사용량: 용량 · 트래픽 그래프를 위아래로 (같은 날짜 축)',
    current: '쌓인 양(콘텐츠 용량)과 그날 오간 양(트래픽)을 한 축 한 그래프에 그린다. 큰 쪽이 축을 잡아 작은 쪽이 눌리고, 용량 막대는 매일 꽉 차서 언제 늘고 줄었는지 안 보인다. 실제 학원은 용량이 올릴 때 크게 늘고 지울 때 조금 줄며, 트래픽(학생이 영상을 보며 내려받은 양)은 요일 · 시험 기간에 따라 크게 출렁인다',
    next: '숫자 띠 아래 그래프 카드 하나에 두 그래프를 위아래로 둔다(탭 · 전환 버튼 없음, 정함 · 2026-10-22). 둘은 같은 날짜 축을 쓰고, 한 그래프에 마우스를 올리면 두 그래프 모두 같은 날에 세로선 + 그날 값이 뜬다.\n· 위 용량: "그날 총 용량" 선 + 연한 면(축은 0 이 아니라 기간 최소~최대), 바로 아래 "전날보다 늘어남(보라) / 줄어듦(회색)" 막대. 요약 줄 "52.1GB → 69.6GB · 늘어남 +21.4GB · 줄어듦 −4.1GB".\n· 아래 트래픽: 일별 막대(0부터) + 최근 7일 평균 점선, 가장 많은 날은 진한 보라 + 값 표시. 요약 줄 "합계 · 하루 평균 · 가장 많은 날".\n· 두 그래프 사이 1px 구분선 + 각 제목(용량 / 트래픽). 그래프 높이 각 160px. Y축 눈금 3개, X축 날짜는 아래 그래프에만',
    markup: '`.cl-mst-chart` 안에 `<section class="cl-usage-pane" aria-labelledby>` 두 개(용량 · 트래픽)를 위아래로. 용량 = 선 그래프 + 증감 막대(전날 대비 차이를 계산), 트래픽 = 막대 + 7일 이동평균선. 고른 달의 모든 날을 칸으로(빈 날 0). 두 그래프의 X 범위 · 칸 폭을 같게 하고, 마우스 위치의 날짜 인덱스를 공유해 두 그래프에 세로선을 함께 그린다(키보드는 ← → 로 날짜 이동). 차트 라이브러리를 쓰면 같은 구성(동기화 툴팁). 요금제 한도선은 이번 범위에서 뺀다.',
    dom: `const root=doc.querySelector('[data-stat-demand]'); if(root && !root.querySelector('[data-usage-tabs]')){
const N=30, D=i=>'06-'+String(i+1).padStart(2,'0');
const st=[], tr=[]; let s=52.1;
const up={2:3.2,6:1.1,9:4.6,13:0.8,16:2.9,20:5.4,23:1.2,27:2.2}, dn={11:-1.4,18:-0.6,25:-2.1};
for(let i=0;i<N;i++){ s+= (up[i]||0)+(dn[i]||0); st.push(+s.toFixed(1)); const dow=(i+1)%7; let t=dow===6||dow===0?4+((i*7)%5):16+((i*13)%14); if(i>=15&&i<=19) t+=22; tr.push(+t.toFixed(1)); }
const chg=st.map((v,i)=>+(i?v-st[i-1]:0).toFixed(1));
const sum=a=>a.reduce((x,y)=>x+y,0), mxI=tr.indexOf(Math.max(...tr));
const k=doc.createElement('dl'); k.className='cl-kpi cl-md-kpi'; k.style.marginBottom='16px';
k.innerHTML=[['콘텐츠 용량',st[N-1],'GB','6월 동안 +'+(st[N-1]-52.1).toFixed(1)+'GB'],['6월 트래픽',sum(tr).toFixed(0),'GB','하루 평균 '+(sum(tr)/N).toFixed(1)+'GB'],['강좌','32','개',''],['콘텐츠','300','개','']].map(x=>'<div class="cl-kpi__item"><dt>'+x[0]+'</dt><dd class="cl-num">'+x[1]+'<small>'+x[2]+'</small></dd><span class="cl-md-kpi__sub">'+x[3]+'</span></div>').join('');
const old=root.querySelector('.cl-mst-chart'); old.before(k); root.querySelectorAll('.cl-selectbox__label').forEach(l=>{if(l.textContent==='10월') l.textContent='6월';});
const W=1000,H=160,pad=6, X=i=>pad+i*(W-2*pad)/(N-1);
const ax='<div class="cl-num" style="display:grid;grid-template-columns:repeat(30,1fr);margin-top:6px;font-size:12px;color:var(--cl-ink-muted)">'+st.map((_,i)=>'<span style="text-align:center;white-space:nowrap;overflow:visible">'+([0,6,13,20,27].includes(i)?D(i):'')+'</span>').join('')+'</div>';
// storage
const mn=Math.floor(Math.min(...st))-1, mx=Math.ceil(Math.max(...st))+1, Y=v=>H-(v-mn)/(mx-mn)*H;
const pts=st.map((v,i)=>X(i).toFixed(1)+','+Y(v).toFixed(1)).join(' ');
const grid=[0.25,0.5,0.75].map(g=>'<line x1="0" x2="'+W+'" y1="'+(H*g)+'" y2="'+(H*g)+'" stroke="var(--cl-grid-row)" vector-effect="non-scaling-stroke"/>').join('');
const stSvg='<div style="display:grid;grid-template-columns:44px 1fr;gap:8px"><div class="cl-num" style="display:flex;flex-direction:column;justify-content:space-between;font-size:12px;color:var(--cl-ink-muted);text-align:right;height:160px"><span>'+mx+'GB</span><span>'+((mx+mn)/2)+'</span><span>'+mn+'GB</span></div><div><svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" style="width:100%;height:160px;display:block;border-bottom:1px solid var(--cl-grid-head)">'+grid+'<polygon points="'+X(0)+','+H+' '+pts+' '+X(N-1)+','+H+'" fill="var(--cl-primary-tint)"/><polyline points="'+pts+'" fill="none" stroke="var(--cl-primary)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>'
 +'<div style="display:grid;grid-template-columns:repeat(30,1fr);gap:2px;height:56px;margin-top:10px;position:relative;border-top:1px dashed var(--cl-grid-row)">'+chg.map((c,i)=>'<span title="'+D(i)+' · '+(c>0?'+':'')+c+'GB" style="align-self:'+(c<0?'start':'end')+';height:'+Math.min(100,Math.abs(c)/5.5*50)+'%;background:'+(c<0?'var(--cl-ink-faint)':'var(--cl-primary)')+';border-radius:2px;'+(c<0?'margin-top:28px':'margin-bottom:28px')+'"></span>').join('')+'</div></div></div>';
const upT=sum(chg.filter(c=>c>0)).toFixed(1), dnT=sum(chg.filter(c=>c<0)).toFixed(1);
const stSum='<p class="cl-num" style="margin:0 0 12px;font-size:13px;color:var(--cl-ink-2)"><b style="color:var(--cl-ink)">52.1GB → '+st[N-1]+'GB</b> · 늘어남 <span style="color:var(--cl-primary-pressed)">+'+upT+'GB</span> · 줄어듦 '+dnT+'GB</p><p style="margin:0 0 8px;font-size:12px;color:var(--cl-ink-muted)">위: 그날 총 용량 · 아래: 전날보다 늘어남(보라) / 줄어듦(회색)</p>';
// traffic
const tmx=Math.ceil(Math.max(...tr)/10)*10; const avg=tr.map((_,i)=>{const a=tr.slice(Math.max(0,i-6),i+1);return sum(a)/a.length;});
const bars='<div style="position:relative"><div style="display:grid;grid-template-columns:repeat(30,1fr);gap:3px;align-items:end;height:160px;border-bottom:1px solid var(--cl-grid-head);background:linear-gradient(var(--cl-grid-row) 1px,transparent 1px) 0 0/100% 40px">'+tr.map((t,i)=>'<span title="'+D(i)+' · '+t+'GB" style="height:'+(t/tmx*100)+'%;background:'+(i===mxI?'var(--cl-primary-pressed)':'var(--cl-primary)')+';border-radius:3px 3px 0 0;opacity:'+(i===mxI?1:.85)+'"></span>').join('')+'</div>'
 +'<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:160px;pointer-events:none"><polyline points="'+avg.map((a,i)=>((i+.5)*W/N).toFixed(1)+','+(H-a/tmx*H).toFixed(1)).join(' ')+'" fill="none" stroke="var(--cl-ink)" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"/></svg>'
 +'<span class="cl-num" style="position:absolute;left:'+((mxI+.5)/N*100)+'%;top:'+(100-tr[mxI]/tmx*100)+'%;transform:translate(-50%,-140%);font-size:12px;font-weight:600;white-space:nowrap">'+tr[mxI]+'GB</span></div>';
const trSvg='<div style="display:grid;grid-template-columns:44px 1fr;gap:8px"><div class="cl-num" style="display:flex;flex-direction:column;justify-content:space-between;font-size:12px;color:var(--cl-ink-muted);text-align:right;height:160px"><span>'+tmx+'GB</span><span>'+(tmx/2)+'</span><span>0</span></div><div>'+bars+ax+'</div></div>';
const trSum='<p class="cl-num" style="margin:0 0 12px;font-size:13px;color:var(--cl-ink-2)"><b style="color:var(--cl-ink)">합계 '+sum(tr).toFixed(0)+'GB</b> · 하루 평균 '+(sum(tr)/N).toFixed(1)+'GB · 가장 많은 날 '+D(mxI)+' '+tr[mxI]+'GB</p><p style="margin:0 0 8px;font-size:12px;color:var(--cl-ink-muted)">막대: 그날 트래픽 · 점선: 최근 7일 평균</p>';
const card=doc.createElement('section'); card.className='cl-card cl-panel'; card.dataset.usageTabs=''; card.style.margin='0 0 16px';
card.innerHTML='<section data-p="st" class="cl-usage-pane"><h2 class="cl-md-title" style="margin:0 0 6px">용량</h2>'+stSum+stSvg+'</section><hr style="border:0;border-top:1px solid var(--cl-grid-row);margin:20px 0"><section data-p="tr" class="cl-usage-pane"><h2 class="cl-md-title" style="margin:0 0 6px">트래픽</h2>'+trSum+trSvg+'</section>';
card.querySelectorAll('[data-p] > div').forEach(g=>{const plot=g.lastElementChild; plot.style.position='relative'; const ln=doc.createElement('div'); ln.className='cl-xhair'; ln.style.cssText='position:absolute;top:0;bottom:22px;width:1px;background:var(--cl-ink);opacity:.5;pointer-events:none;display:none'; const tip=doc.createElement('div'); tip.className='cl-xtip cl-num'; tip.style.cssText='position:absolute;top:-4px;transform:translate(-50%,-100%);padding:2px 6px;border-radius:6px;background:var(--cl-ink);color:var(--cl-canvas);font-size:12px;white-space:nowrap;pointer-events:none;display:none'; plot.append(ln,tip);});
const panes=[...card.querySelectorAll('[data-p] > div > div:last-child')]; const show=i=>panes.forEach((p,k)=>{const ln=p.querySelector('.cl-xhair'), tp=p.querySelector('.cl-xtip'); if(i<0){ln.style.display=tp.style.display='none';return;} const x=((i+.5)/N*100)+'%'; ln.style.left=x; tp.style.left=x; ln.style.display=tp.style.display='block'; tp.textContent=D(i)+' · '+(k===0?st[i]+'GB ('+(chg[i]>0?'+':'')+chg[i]+')':tr[i]+'GB');});
panes.forEach(p=>{p.classList.add('lab-live'); p.addEventListener('mousemove',e=>{const r=p.getBoundingClientRect(); show(Math.max(0,Math.min(N-1,Math.floor((e.clientX-r.left)/r.width*N))));}); p.addEventListener('mouseleave',()=>show(-1));});
const lk=doc.createElement('style'); lk.textContent='[data-usage-tabs] .lab-live{pointer-events:auto}'; doc.head.append(lk);
old.replaceWith(card);
const tb=root.querySelector('tbody'); if(tb){ tb.innerHTML=st.map((v,i)=>i).reverse().slice(0,10).map(i=>'<tr><td class="cl-num" data-primary="">2026.06.'+String(i+1).padStart(2,'0')+'</td><td class="cl-table__num">'+st[i]+'GB</td><td class="cl-table__num">'+tr[i]+'GB</td><td class="cl-table__num">32</td><td class="cl-table__num">300</td></tr>').join(''); }

}
`,
    note: '실험실 그래프는 들쑥날쑥한 실제 학원을 가정한 예시 데이터(6월)입니다. 그래프 위에 마우스를 올려 두 그래프의 같은 날 세로선을 보세요.',
    targets: ['[data-usage-tabs]']
  },
  {
    id: 'V2', group: 6, status: '확정', kind: '문구', screens: ['demand', 'cms', 'dashboard', 't-cms-page'],
    title: '용량 단위 띄어쓰기 하나로',
    current: '그래프 "59.27GB", 표 "59.27 GB", 대시보드 숫자 띠 "GB" 작은 글자. 한 화면 안에서도 섞인다',
    next: '글자 규칙(숫자 뒤 단위는 붙여 쓴다: 14명 · 3건)에 맞춰 "59.27GB". 표 · 그래프 · 툴팁 · CMS 합계("57.33 GB") 모두',
    markup: '용량 포맷 함수를 하나로(`formatBytes` 등) 쓰고 공백 없이.',
    dom: `doc.querySelectorAll('[data-stat-demand] td, [data-cms-manage] .cl-cms-item__meta .cl-num, [data-cms-manage] [data-summary]').forEach(e=>{ if(/\\d (GB|MB)/.test(e.textContent)) e.textContent=e.textContent.replace(/(\\d) (GB|MB)/g,'$1$2'); });`,
    targets: ['[data-stat-demand] tbody td']
  },
  // ───────── 통계 › 다운로드 현황 ─────────
  {
    id: 'W1', group: 4, status: '확정', kind: '마크업', screens: ['download'],
    title: '다운로드 그래프: 기록이 있는데 "기록이 없습니다" · 단위 전환',
    current: '이 달 표에 2건(1.2MB × 2)이 있는데 그래프 칸은 "이 달에 다운로드 기록이 없습니다". 그래프가 GB 로 바꿔 그려서(`toGB`) 1.2MB 가 0.00GB 가 되고, 모든 값이 0 이면 빈 상태로 처리한다. 기록 있는 날만 칸을 만든다. 달 하나씩만 볼 수 있어 한 해 흐름(어느 달에 많이 받았나)은 12번 바꿔 봐야 한다',
    next: '고른 기간의 모든 칸을 그린다(빈 칸 0). 단위는 그 기간 가장 큰 값에 맞춰 MB · GB 자동(1,024MB 미만이면 MB). 빈 상태 문구는 기록이 정말 0건일 때만.\n· 월 선택에 "전체"를 추가해 한 해를 본다(이번 해면 이번 달까지).\n· 그래프 제목 오른쪽 [일][주][월] 전환. 기본은 정한 규칙대로: 달 하나(약 1개월) → 일, 한 해 → 월. 막대가 2개 미만이 되는 단위와 너무 많아지는 단위(90칸 넘음)는 끈다 — 달 하나에서 [월], 한 해에서 [일] 비활성(툴팁 "이 기간에서는 볼 수 없습니다"). 기간을 바꾸면 기본 단위로 돌아간다.\n· 막대 툴팁 "10.20 · 2건 · 2.4MB"(주 "10-19 주", 월 "2026.10"). 제목 "기간별 다운로드", 범례 "내려받은 용량". 표 아래 합계도 고른 기간 기준',
    markup: '`download.js` 의 `toGB(byDay.get(day))` 대신 바이트를 모아 `fileSize()` 로 단위를 고른다(최댓값 기준 한 단위). 칸 목록은 기록에서 뽑지 말고 기간 전체(달: 1일~말일, 이번 달이면 오늘까지 / 한 해: 1월~12월, 이번 해면 이번 달까지)로 만든 뒤 단위(일 · 주 · 월)로 묶는다. 월 선택 목록 맨 위에 `<option value="">전체</option>`. 단위 전환은 `cl-segmented`(로그인 현황 U3 와 같은 부품 · 같은 묶음 함수). 빈 상태는 `rows.length === 0` 일 때만.',
    dom: `const root=doc.querySelector('[data-stat-download]'); const box=root&&root.querySelector('[data-chart]'); if(!box) return;
const DAYS=31, dayV=Array(DAYS).fill(0), dayC=Array(DAYS).fill(0); dayV[19]=2.4; dayC[19]=2;
const p2=n=>String(n).padStart(2,'0');
const sets={
 month:{ def:'일', off:{'월':'이 기간에서는 볼 수 없습니다 (막대 1개)'},
  '일':()=>dayV.map((v,i)=>({v,c:dayC[i],t:'10.'+p2(i+1),a:[0,6,13,20,27].includes(i)?'10-'+p2(i+1):''})),
  '주':()=>{const s=[['09-28',0,3],['10-05',4,10],['10-12',11,17],['10-19',18,24],['10-26',25,30]]; return s.map(([l,a,b])=>({v:+dayV.slice(a,b+1).reduce((x,y)=>x+y,0).toFixed(1),c:dayC.slice(a,b+1).reduce((x,y)=>x+y,0),t:l+' 주',a:l+' 주'}));} },
 year:{ def:'월', off:{'일':'이 기간에서는 볼 수 없습니다 (막대가 너무 많음)'},
  '월':()=>Array.from({length:10},(_,i)=>({v:i===9?2.4:0,c:i===9?2:0,t:'2026.'+p2(i+1),a:'2026.'+p2(i+1)})),
  '주':()=>Array.from({length:43},(_,i)=>{const on=i===41; return {v:on?2.4:0,c:on?2:0,t:'2026 '+(i+1)+'번째 주',a:[0,9,18,27,36].includes(i)?['01-05','03-09','05-11','07-13','09-14'][[0,9,18,27,36].indexOf(i)]+' 주':''};}) } };
let per='month', unit='일';
const draw=()=>{ const d=sets[per][unit](); const mx=Math.max(...d.map(x=>x.v))||1; const n=d.length;
 box.innerHTML='<div class="cl-chart"><div class="cl-chart__max cl-num" aria-hidden="true">'+mx+'MB</div><div class="cl-chart__plot" style="--cl-chart-cols:'+n+'" aria-hidden="true">'+d.map(x=>'<div class="cl-chart__col"><span class="cl-chart__bar is-primary" style="height:'+(x.v/mx*100)+'%" title="'+x.t+' · '+x.c+'건 · '+x.v+'MB"></span></div>').join('')+'</div><div class="cl-chart__axis cl-num" style="--cl-chart-cols:'+n+'" aria-hidden="true">'+d.map(x=>'<span><b>'+x.a+'</b></span>').join('')+'</div></div>';
 g.querySelectorAll('button').forEach(b=>{const off=sets[per].off[b.textContent]; b.disabled=!!off; b.title=off||''; b.style.opacity=off?'.4':''; b.setAttribute('aria-pressed',b.textContent===unit);});
 const s=root.querySelector('[data-summary]'); if(s) s.textContent='2건 · 2.4MB'; };
const t=root.querySelector('.cl-md-title'); if(t) t.textContent='기간별 다운로드'; const lg=root.querySelector('.cl-md-legend'); if(lg) lg.innerHTML='<i></i>내려받은 용량';
const head=root.querySelector('.cl-md-chart__head'); head.style.display='flex'; head.style.alignItems='center'; head.style.gap='12px';
const g=doc.createElement('div'); g.className='cl-segmented'; g.setAttribute('role','group'); g.setAttribute('aria-label','그래프 단위'); g.style.marginLeft='auto';
g.innerHTML=['일','주','월'].map(u=>'<button type="button" class="cl-segmented__item lab-live" style="width:auto;padding:0 10px;font-size:var(--cl-fs-caption)">'+u+'</button>').join('');
g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ if(b.disabled) return; unit=b.textContent; draw(); }));
head.insertBefore(g,lg);
const mb=[...root.querySelectorAll('.cl-selectbox__button')].find(b=>b.getAttribute('aria-label')==='월');
if(mb){ mb.classList.add('lab-live'); mb.title='실험실: 눌러서 10월 ↔ 전체'; const lab=mb.querySelector('.cl-selectbox__label');
 mb.addEventListener('click',e=>{e.preventDefault(); per=per==='month'?'year':'month'; unit=sets[per].def; lab.textContent=per==='month'?'10월':'전체'; const m=root.querySelector('.cl-page__meta'); draw();}); }
draw();`,
    note: '월 선택 칸(10월)을 누르면 "전체"(한 해)로 바뀌고 그래프가 월 단위가 됩니다. [일][주][월]도 눌러 보세요. 10월 20일 2건만 있는 게 실제 데이터입니다.',
    targets: ['[data-stat-download] .cl-mst-chart', '[data-stat-download] [data-picker]']
  },
  {
    id: 'W2', work: '서버 필요', server: '다운로드 기록 API(`/api/stats/download`)가 아이디(`usr_uid`)와 함께 이름을 내려줘야 한다.', group: 9, status: '확정', kind: '마크업', screens: ['download'],
    title: '다운로드 표: 무엇을 · 누가 받았는지',
    current: '날짜 · 용량 · 형식 · 내려받은 사람(아이디만 "sahyein1") 4칸. 어떤 파일인지 알 수 없다. 오래된 것이 위(11:49 → 11:50). 용량 "1.2 MB" 띄어 씀. 합계 · 엑셀 다운로드가 없다',
    next: '칸: 날짜 · 파일 · 용량 · 내려받은 사람. 파일 칸은 파일 이름(`dwf_path` 끝부분) + 형식 회색 배지(PNG), 긴 이름은 말줄임 + 툴팁. 사람은 Q4 규칙 "사혜인 sahyein1". 최신이 위. 용량 붙여 쓰기 "1.2MB". 표 아래 "2건 · 2.4MB". 머리 오른쪽 [엑셀 다운로드](로그인 현황과 같은 자리)',
    css: `[data-stat-download] .cl-id { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }
[data-stat-download] .cl-dl-file { display: inline-flex; align-items: center; gap: 8px; max-width: 360px; }
[data-stat-download] .cl-dl-file span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`,
    markup: '`dwf_path` 에서 파일 이름을 잘라 보이고(경로 전체는 `title`), 형식은 `<span class="cl-badge cl-badge--neutral">PNG</span>`. 사람 칸은 `usr_uid` 로 이름을 같이 받아 `{이름}<span class="cl-id"> {아이디}</span>`(탈퇴 등으로 이름이 없으면 아이디만). 정렬 `dwf_created_at` 내림차순. `.cl-table-foot [data-summary]` 에 건수 · 합계 용량. 엑셀은 로그인 현황 `[data-excel]` 과 같은 버튼.',
    dom: `const root=doc.querySelector('[data-stat-download]'); if(!root) return; const tb=root.querySelector('tbody'), th=root.querySelector('thead tr'); if(!tb) return;
th.innerHTML='<th scope="col">날짜</th><th scope="col">파일</th><th scope="col" class="cl-table__num">용량</th><th scope="col">내려받은 사람</th>';
tb.innerHTML=[['2026.10.20 11:50','수업자료_10월_3주차.png'],['2026.10.20 11:49','수업자료_10월_3주차.png']].map(r=>'<tr><td class="cl-num" data-primary="">'+r[0]+'</td><td data-label="파일"><span class="cl-dl-file" title="/upload/'+r[1]+'"><span>'+r[1]+'</span><span class="cl-badge cl-badge--neutral">PNG</span></span></td><td class="cl-table__num" data-label="용량">1.2MB</td><td data-label="사람">사혜인<span class="cl-id"> sahyein1</span></td></tr>').join('');
const w=root.querySelector('[data-list]'); if(w&&!w.querySelector('.cl-table-foot')){const f=doc.createElement('div'); f.className='cl-table-foot'; f.innerHTML='<span data-summary>2건 · 2.4MB</span>'; w.append(f);}
const h=root.querySelector('.cl-page__head'); if(h&&!h.querySelector('[data-excel]')){ const meta=h.querySelector('.cl-page__meta'); const w2=doc.createElement('div'); h.classList.add('cl-page__head--row'); [...h.children].filter(e=>e!==meta).forEach(e=>w2.append(e)); h.prepend(w2); const sp=doc.createElement('span'); sp.className='cl-toolbar__spacer'; const b=doc.createElement('button'); b.type='button'; b.className='cl-btn cl-btn--ghost'; b.dataset.excel=''; b.innerHTML='<svg class="cl-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="m7 10 5 5 5-5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>엑셀 다운로드'; w2.after(sp,b); if(meta) h.after(meta); }`,
    note: '파일 이름은 예시 값입니다(실제는 저장 경로에서 잘라 씁니다).',
    targets: ['[data-stat-download] tbody', '[data-excel]', '[data-summary]']
  },
  {
    id: 'W3', group: 6, status: '확정', kind: '문구', screens: ['download'],
    title: '다운로드 현황 설명 문구',
    current: '"학원에서 파일을 내려받은 기록입니다(달마다)." — 괄호 덧붙임이 어색하고, 무엇을 고르는지 안 보인다',
    next: '"학원 파일을 내려받은 기록입니다. 달이나 한 해를 골라 봅니다."',
    markup: '`.cl-page__meta` 문구만 바꾼다.',
    dom: `const m=doc.querySelector('[data-stat-download] .cl-page__meta'); if(m) m.textContent='학원 파일을 내려받은 기록입니다. 달이나 한 해를 골라 봅니다.';`,
    targets: ['[data-stat-download] .cl-page__meta']
  },
  // ───────── 통계 › 그룹 통계 · 학생 통계 ─────────
  {
    id: 'X1', work: '서버 필요', server: '그룹 로그인 API가 기간(시작 · 끝)과 단위(일 · 주 · 월)를 받아 빈 칸 0 까지 채운 집계, 로그인한 학생 수, 학생별 마지막 로그인 날짜를 내려줘야 한다.', group: 4, status: '확정', kind: '마크업', screens: ['group-stat', 'group-stat-s'],
    title: '그룹 로그인 그래프: 기간을 고르고, 빈 날은 0 으로',
    current: '기간 선택이 없어 어느 기간인지 모른다. 기록이 없으면 그래프 자리에 회색 상자 "로그인 기록이 없습니다"만 있다(학생이 13명인데 0회인지, 불러오지 못한 건지 구분이 안 된다)',
    next: '그래프 머리에 기간 선택(1주일 · 3개월 · 6개월 · 1년 · 기간 전체, 기본 3개월)과 [일][주][월] 전환. 기본 단위는 정한 규칙대로(1주일→일, 3 · 6개월→주, 1년 · 전체→월). 기간의 모든 칸을 그리고 기록 없는 칸은 0(바닥선만).\n· 세로축은 횟수라 정수 눈금만(0 · 1 · 2회 — 0.5 같은 눈금 금지). 막대 툴팁 "10-19 주 · 로그인 2회 · 1명"(그룹은 인원이 적어 사람 수를 같이).\n· 그래프 아래 요약 줄: "3개월 동안 로그인 3회 · 13명 중 2명 로그인 · 마지막 2026.10.20" — 횟수보다 "몇 명이 들어왔나"가 중요(3회여도 11명은 한 번도 안 들어옴). 0회면 "3개월 동안 로그인 0회 · 13명 모두 기록 없음".\n· 왼쪽 소속 학생: 한 줄에 "이름 아이디 · 메모"(넘치면 메모부터 말줄임, 전체는 툴팁) + 오른쪽 끝에 오른쪽 정렬로 마지막 로그인 "10.20"(13px `cl-ink-muted`), 없으면 "—"(`cl-ink-faint`, 툴팁 · 화면 읽기 "3개월 동안 로그인 기록 없음" — Table 빈 값 규칙과 같음). 목록 위 [전체 13][로그인 안 함 11] 걸러 보기.\n· 셈 기준: 같은 날 여러 번 로그인하면 각각 센다(로그인 현황과 같음). 제목 "기간별 로그인 (그룹 전체)", 학생을 고르면 "사혜인 기간별 로그인"',
    css: `[data-stat-group] .cl-mc-pick { gap: 8px; }
[data-stat-group] .cl-mc-pick > span { flex: 0 1 auto; min-width: 0; flex-wrap: nowrap; overflow: hidden; }
[data-stat-group] .cl-mc-pick > span strong { flex: none; }
[data-stat-group] .cl-mc-pick > span .cl-muted { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-stat-group] .cl-last-login { flex: none; margin-left: auto; min-width: 3.2em; text-align: right; font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); white-space: nowrap; font-variant-numeric: tabular-nums; }
[data-stat-group] .cl-last-login.is-none { color: var(--cl-ink-faint); }
[data-stat-group] .cl-ms-list li[hidden] { display: none; }`,
    markup: '로그인 현황 U3 와 같은 집계 함수 · 단위 전환(`cl-segmented`). 기간 선택은 `cl-selectbox` 하나. 빈 상태(`cl-chart--empty`)는 그룹을 고르기 전에만. 학생 버튼 안 오른쪽에 `<span class="cl-last-login cl-num">MM.DD</span>`(없으면 `is-none` + "—", `aria-label="로그인 기록 없음"`), 목록 위 `cl-chips` 로 [전체][로그인 안 함]. 서버는 기간별 집계와 함께 "로그인한 학생 수", 학생별 "마지막 로그인 날짜"를 내려준다.',
    dom: `const root=doc.querySelector('[data-stat-group]'); if(!root) return; const sec=root.querySelector('#mst-group-login'); const card=sec&&sec.closest('section'); if(!card) return;
const W=['07-27','08-03','08-10','08-17','08-24','08-31','09-07','09-14','09-21','09-28','10-05','10-12','10-19']; const stu=root.hasAttribute('data-stat-group-student'); const V=stu?W.map((_,i)=>i===12?2:0):W.map((_,i)=>i===6?1:i===12?2:0), P=stu?W.map((_,i)=>i===12?1:0):W.map((_,i)=>i===6||i===12?1:0), MX=Math.max(1,...V);
if(!stu){ const L={'사혜인':'10.20','이호준':'09.08'}; const sw={'김정우':['사혜인','sahyein1'],'이홍주':['이호준','lhj992']};
 root.querySelectorAll('.cl-ms-list li').forEach(li=>{const b=li.querySelector('.cl-mc-pick'); const n=b.querySelector('strong'); const id=b.querySelector('.cl-muted'); if(sw[n.textContent]){const [nn,ii]=sw[n.textContent]; n.textContent=nn; id.textContent=ii;} li.dataset.login=L[n.textContent]?'1':'0'; b.title=n.textContent+' '+id.textContent; const d=doc.createElement('span'); d.className='cl-last-login cl-num'+(L[n.textContent]?'':' is-none'); d.textContent=L[n.textContent]||'—'; if(!L[n.textContent]) d.setAttribute('aria-label','로그인 기록 없음'); d.title=L[n.textContent]?'마지막 로그인 2026.'+L[n.textContent]:'3개월 동안 로그인 기록 없음'; b.append(d);});
 const lst=root.querySelector('[data-students]'); if(lst&&!root.querySelector('[data-login-filter]')){ const all=root.querySelectorAll('.cl-ms-list li').length, none=root.querySelectorAll('.cl-ms-list li[data-login="0"]').length; const c=doc.createElement('div'); c.className='cl-chips'; c.dataset.loginFilter=''; c.setAttribute('role','group'); c.setAttribute('aria-label','로그인 여부'); c.style.cssText='margin:0 8px 8px'; c.innerHTML='<button type="button" class="cl-chip lab-live" aria-pressed="true" data-f="all">전체<span class="cl-chip__count cl-num">'+all+'</span></button><button type="button" class="cl-chip lab-live" aria-pressed="false" data-f="none">로그인 안 함<span class="cl-chip__count cl-num">'+none+'</span></button>'; lst.before(c); c.querySelectorAll('button').forEach(x=>x.addEventListener('click',()=>{c.querySelectorAll('button').forEach(y=>y.setAttribute('aria-pressed',y===x)); root.querySelectorAll('.cl-ms-list li').forEach(li=>li.hidden=x.dataset.f==='none'&&li.dataset.login!=='0');})); } }
card.querySelector('[data-chart]').innerHTML='<div class="cl-chart"><div class="cl-chart__max cl-num" aria-hidden="true">'+MX+'회</div><div class="cl-chart__plot" style="--cl-chart-cols:13" aria-hidden="true">'+W.map((d,i)=>'<div class="cl-chart__col"><span class="cl-chart__bar is-primary" style="height:'+(V[i]/MX*100)+'%" title="'+d+' 주 · 로그인 '+V[i]+'회'+(V[i]?' · '+P[i]+'명':'')+'"></span></div>').join('')+'</div><div class="cl-chart__axis cl-num" style="--cl-chart-cols:13" aria-hidden="true">'+W.map((d,i)=>'<span><b>'+(i%3===0?d+' 주':'')+'</b></span>').join('')+'</div></div><p class="cl-num" style="margin:10px 0 0;font-size:13px;color:var(--cl-ink-2)">'+(stu?'3개월 동안 로그인 <b style="color:var(--cl-ink)">2회</b> · 마지막 2026.10.20':'3개월 동안 로그인 <b style="color:var(--cl-ink)">3회</b> · 13명 중 <b style="color:var(--cl-ink)">2명</b> 로그인 · 마지막 2026.10.20')+'</p>';
const t=card.querySelector('.cl-md-title'); t.textContent=stu?'사혜인 기간별 로그인':'기간별 로그인 (그룹 전체)';
const head=card.querySelector('.cl-md-chart__head'); head.style.display='flex'; head.style.alignItems='center'; head.style.gap='8px';
const per=doc.createElement('span'); per.className='cl-selectbox'; per.style.marginLeft='auto'; per.innerHTML='<button type="button" class="cl-select cl-selectbox__control cl-btn--sm"><span class="cl-selectbox__label">3개월</span></button>';
const g=doc.createElement('div'); g.className='cl-segmented'; g.setAttribute('role','group'); g.setAttribute('aria-label','그래프 단위');
g.innerHTML=['일','주','월'].map(u=>'<button type="button" class="cl-segmented__item lab-live" style="width:auto;padding:0 10px;font-size:var(--cl-fs-caption)" aria-pressed="'+(u==='주')+'">'+u+'</button>').join('');
g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>g.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b))));
const ax=card.querySelector('.cl-chart'); if(ax&&MX>1){ ax.style.position='relative'; const mid=doc.createElement('span'); mid.className='cl-num'; mid.textContent=Math.round(MX/2); mid.setAttribute('aria-hidden','true'); mid.style.cssText='position:absolute;left:0;top:calc(16px + 80px - 8px);font-size:11px;color:var(--cl-ink-muted)'; ax.append(mid);}
const lg=head.querySelector('.cl-md-legend'); head.insertBefore(per,lg); head.insertBefore(g,lg);`,
    note: '실험실 예시: 보충학습반에서 사혜인 2회(10.20) · 이호준 1회(09.08). 예시를 위해 목록의 두 학생(김정우 · 이홍주)을 이 두 사람으로 바꿔 두었습니다. [로그인 안 함]을 눌러 보세요.',
    targets: ['#mst-group-login']
  },
  {
    id: 'X2', group: 8, status: '확정', kind: '마크업', layer: '화면별', screens: ['group-stat', 'group-stat-s'],
    title: '소속 학생 목록: 이름 · 아이디 · 메모 · 최근 로그인을 자리마다 가른다 (Q4)',
    current: '이름 옆 회색 글자에 아이디와 다른 값이 " · " 하나로 이어 붙는다 — "kebi3477 · A반", "zkaqld · 213123", 한 줄은 휴대폰 번호 전체("kebi12345 · 010-…"). 뒤에 붙은 값이 아이디의 일부처럼 보이고, 무슨 값인지 표시가 없다. 여기에 마지막 로그인(X1)까지 오른쪽에 붙으면 "—" 가 메모인지 날짜인지 알 수 없다. 통계 화면에서 연락처가 그대로 보인다',
    next: '한 줄을 자리로 가르고 머리글을 단다. 왼쪽 "고기영 youngfishy"(Q4 규칙 · 아이디 `cl-ink-subtle` 13px), 가운데 오른쪽 정렬로 메모, 오른쪽 끝에 마지막 로그인("10.20", 없으면 "—"). 목록 머리에 같은 자리로 [메모][최근] 라벨. 메모가 길면 말줄임하고 전체는 툴팁. 학생을 고른 화면(마지막 로그인이 없는 화면)에서는 머리가 [메모] 하나',
    css: `[data-stat-group] .cl-ms-list__head,
[data-stat-group] .cl-mc-pick { display: grid; grid-template-columns: minmax(0, auto) minmax(0, 1fr); gap: 8px; align-items: baseline; }
[data-stat-group] .cl-ms-list__head { padding: 0 8px 4px; font-size: var(--cl-fs-micro); font-weight: 500; color: var(--cl-ink-muted); text-align: right; }
[data-stat-group] .cl-ms-list__head.has-last,
[data-stat-group] .cl-mc-pick:has(.cl-last-login) { grid-template-columns: minmax(0, auto) minmax(0, 1fr) 46px; }
[data-stat-group] .cl-mc-pick .cl-muted { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }
[data-stat-group] .cl-mc-pick > span:first-child { max-width: 100%; }
[data-stat-group] .cl-mc-memo { justify-self: end; max-width: 100%; min-width: 0; text-align: right; color: var(--cl-ink-muted); font-size: var(--cl-fs-caption); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
[data-stat-group] .cl-mc-pick[aria-pressed="true"] { background: var(--cl-primary-tint); color: var(--cl-primary-pressed); }
[data-stat-group] .cl-mc-pick[aria-pressed="true"]::after { content: "✓"; font-weight: 700; }`,
    markup: '학생 버튼은 `<span>` 하나에 이름 + 아이디만 두고, 메모는 형제 `<span class="cl-mc-memo" title="<전체 메모>">`, 마지막 로그인은 그 뒤 `<span class="cl-last-login">`(X1) 으로 따로 뺀다. 지금은 아이디와 메모가 한 `cl-muted` 안에 " · " 로 합쳐져 있어 서버 · 템플릿에서 두 값을 나눠 내려줘야 한다. 목록 위에는 `<div class="cl-ms-list__head"><span></span><span>메모</span><span>최근</span></div>` — 행과 같은 열 너비라 머리글이 값 위에 바로 선다.',
    dom: `const box=doc.querySelector('[data-students]'); if(!box) return;
box.querySelectorAll('.cl-mc-pick').forEach(b=>{
  if(b.dataset.labSplit) return; b.dataset.labSplit='1';
  const mu=b.querySelector('.cl-muted'); if(!mu) return;
  const parts=mu.textContent.split(' · ');
  mu.textContent=parts[0];
  const memo=parts.slice(1).join(' · ');   // 메모가 없어도 빈 칸을 둬야 아래 줄과 자리가 맞는다
  const s=doc.createElement('span'); s.className='cl-mc-memo'; s.textContent=memo; if(memo) s.title=memo;
  const last=b.querySelector('.cl-last-login');
  if(last) last.before(s); else mu.parentElement.after(s);
});
const list=box.querySelector('.cl-ms-list');
if(list && !box.querySelector('.cl-ms-list__head')){
  const hasLast=!!box.querySelector('.cl-last-login');
  const h=doc.createElement('div'); h.className='cl-ms-list__head'+(hasLast?' has-last':'');
  h.innerHTML='<span></span><span>메모</span>'+(hasLast?'<span>최근</span>':'');
  list.before(h);
}`,
    targets: ['[data-stat-group] .cl-ms-list', '.cl-mc-memo', '.cl-ms-list__head'],
    note: '"—" 는 마지막 로그인이 없다는 X1 의 표시다. 머리글 [최근] 이 생기면서 메모와 헷갈리지 않는다. 메모는 학생 목록에서 그 자리에 바로 적는 자유 입력 칸(H2)이라 값이 제각각인 것은 정상이다 — 개발에 확인할 것은 없다. 실험실의 휴대폰 번호는 가짜 값으로 바꿔 두었다.'
  },
  {
    id: 'X3', group: 1, status: '확정', kind: 'CSS', screens: ['group-stat', 'user-stat', 'group-stat-s'],
    title: '통계 2단 상자 높이 맞춤',
    current: '그룹 통계: 왼쪽 학생 목록과 오른쪽 그래프 · 표 묶음의 아래 끝이 다르다(`align-items: start`). 학생 통계: 오른쪽 "로그인 이력" 상자가 한 줄 높이라 왼쪽 강좌 표(14줄) 옆에 짧게 떠 있다',
    next: '정한 규칙대로 `align-items: stretch`. 학생 목록은 오른쪽 높이에 맞추고 넘치면 목록 안에서 스크롤. 로그인 이력 상자는 왼쪽과 같은 높이, 내용은 위에 붙인다',
    css: `.cl-mst-layout, .cl-mst-user { align-items: stretch; }
.cl-mst-layout > .cl-mst-students { max-height: none; display: flex; flex-direction: column; min-height: 0; }
.cl-mst-layout > .cl-mst-students [data-students] { flex: 1; min-height: 0; overflow-y: auto; }
.cl-mst-layout > .cl-stack { display: flex; flex-direction: column; gap: 16px; }
.cl-mst-layout > .cl-stack > :last-child { flex: 1; }
.cl-mst-user > .cl-card { display: flex; flex-direction: column; }
@media (max-width: 900px) { .cl-mst-layout > .cl-mst-students { max-height: 280px; } }`,
    targets: ['.cl-mst-layout', '.cl-mst-user']
  },
  {
    id: 'Y1', work: '서버 필요', server: '학생 로그인 이력 API가 기간을 받아 그 기간 기록과 합계를 내려줘야 한다.', group: 6, status: '확정', kind: '마크업', screens: ['user-stat'],
    title: '학생 통계: 고른 학생 · 로그인 이력 표기',
    current: '고른 학생 표시 "사혜인 (sahyein1)" 괄호 표기. 로그인 이력 날짜 "2026-10-20"(다른 화면은 "2026.10.20"). 이력에 기간이 없어 언제부터의 기록인지 모른다',
    next: '"사혜인 sahyein1"(Q4). 날짜 "2026.10.20". 로그인 이력 머리 오른쪽에 기간 선택(기본 3개월, 그룹 통계와 같은 목록), 표 아래 "1일 · 로그인 2회"',
    css: `[data-stat-user] .cl-mst-selected .cl-id { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); font-weight: 400; margin-left: 6px; }`,
    markup: '선택 칩: `<strong>{이름}</strong><span class="cl-id">{아이디}</span>`. 날짜 형식 `YYYY.MM.DD`. 로그인 이력 API 에 기간 인자를 넘기고 합계를 `.cl-table-foot [data-summary]` 에.',
    dom: `const root=doc.querySelector('[data-stat-user]'); if(!root) return;
const s=root.querySelector('[data-selected] strong'); if(s){const m=s.textContent.match(/^(.*) \\((.*)\\)$/); if(m){s.textContent=m[1]; const i=doc.createElement('span'); i.className='cl-id'; i.textContent=m[2]; s.after(i);}}
root.querySelectorAll('[data-logins] td[data-primary]').forEach(td=>td.textContent=td.textContent.replace(/(\\d{4})-(\\d{2})-(\\d{2})/,'$1.$2.$3'));
const h=root.querySelector('#mst-user-logins'); if(h){ const wrap=doc.createElement('div'); wrap.style.cssText='display:flex;align-items:center;gap:8px'; h.before(wrap); wrap.append(h); h.style.margin='0'; const p=doc.createElement('span'); p.className='cl-selectbox'; p.style.marginLeft='auto'; p.innerHTML='<button type="button" class="cl-select cl-selectbox__control"><span class="cl-selectbox__label">3개월</span></button>'; wrap.append(p); wrap.style.marginBottom='12px'; }
const L=root.querySelector('[data-logins]'); if(L&&!L.querySelector('.cl-table-foot')){const f=doc.createElement('div'); f.className='cl-table-foot'; f.innerHTML='<span data-summary>1일 · 로그인 2회</span>'; L.append(f);}`,
    targets: ['[data-selected]', '[data-logins]']
  },
  {
    id: 'Y2', group: 3, status: '확정', kind: '마크업', screens: ['user-stat', 'group-stat-s'],
    title: '진도율: 퍼센트와 완료 강의 수가 서로 안 맞아 보인다',
    current: '진도율 막대 툴팁이 "강의 2개 중 2개 완료"인데 49%, "강의 3개 중 0개 완료"인데 76%. 퍼센트는 시청 시간 기준, 툴팁은 완료 개수 기준이라 숫자가 엇갈린다. 강의가 0개인 강좌도 "0%" 막대가 그려진다',
    next: '막대 옆에 완료 수를 같이 보인다: "49% · 완료 2/2강". 툴팁은 "시청한 시간 기준 진도율"로 뜻을 밝힌다. 강의가 0개면 막대 없이 "강의 없음"(`cl-ink-faint`). 진도율 계산 기준은 지금(시청한 시간 기준) 그대로 둔다 (정함 · 2026-10-22)',
    css: `[data-stat-user] .cl-pd-done, [data-stat-group] .cl-pd-done { margin-left: 8px; color: var(--cl-ink-muted); font-size: var(--cl-fs-caption); white-space: nowrap; }
[data-stat-user] .cl-pd-none, [data-stat-group] .cl-pd-none { color: var(--cl-ink-faint); font-size: var(--cl-fs-caption); }`,
    markup: '그룹 통계에서 학생을 골랐을 때의 강좌 표도 같다(지금은 완료 수 툴팁조차 없다 — 학생 통계와 같은 값을 내려준다). 진도율 칸: `<span class="cl-pd-row__bar" title="시청한 시간 기준 진도율">…</span><span class="cl-pd-done">완료 {완료}/{전체}강</span>`. 전체 0 이면 `<span class="cl-pd-none">강의 없음</span>`.',
    dom: `const LM={'중2 수학 개념 완성':[0,0],'고3 국어 정시반':[2,2],'중등 영문법 마스터':[0,0],'고1 수학(상) 개념반':[11,4],'초등 독서 논술 기초반':[1,0],'고전 문학 읽기':[2,0],'중1 수학 개념 완성':[0,0],'고1 영어 독해 실력반':[16,0],'수능 국어 문법 완성':[4,0],'자기소개서 · 면접 대비':[1,0],'코딩 입문: 파이썬 기초':[5,0],'확률과 통계 기출 분석':[3,0],'통합사회 개념 정리':[14,0],'코딩 실전: 파이썬 프로젝트':[8,0]};
doc.querySelectorAll('[data-stat-user] [data-courses] .cl-pd-row__bar, [data-stat-group-student] [data-courses] .cl-pd-row__bar').forEach(b=>{ if(!b.title){const n=b.closest('tr').querySelector('[data-primary]').textContent.trim(); if(LM[n]) b.title='강의 '+LM[n][0]+'개 중 '+LM[n][1]+'개 완료';} const m=(b.title||'').match(/강의 (\\d+)개 중 (\\d+)개/); if(!m) return; const td=b.closest('td');
 if(m[1]==='0'){ td.innerHTML='<span class="cl-pd-none">강의 없음</span>'; return; }
 b.title='시청한 시간 기준 진도율'; const d=doc.createElement('span'); d.className='cl-pd-done cl-num'; d.textContent='완료 '+m[2]+'/'+m[1]+'강'; b.after(d);});`,
    note: '고3 국어 정시반(49% · 완료 2/2)과 확률과 통계(76% · 완료 0/3)를 비교해 보세요. 계산 기준은 지금 그대로(시청 시간 기준)입니다.',
    targets: ['[data-stat-user] [data-courses] tbody', '[data-stat-group-student] [data-courses] tbody']
  },
  // ───────── 환경설정 ─────────
  {
    id: 'Z1', group: 6, status: '확정', kind: '문구', screens: ['main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting'],
    title: '환경설정 설명 문구 1~2문장 · 단위 붙여 쓰기',
    current: '설명이 3~4문장인 곳이 많다(로고 4문장, 로고 표시 3문장, 슬라이드 3문장, 갤러리 3문장, 메뉴 설정 3문장, 허용 IP 2문장이지만 한 문장이 길다). "980×200px 입니다" 띄어 씀. 학원 설정에는 화면 설명이 없다',
    next: '설명은 1~2문장. 학원 설정 설명 "홈페이지에 보이는 학원 정보와 가입 · 재생 방식을 정합니다." 추가. 단위는 붙여 쓴다("980×200px입니다")',
    markup: '문구만 바꾼다(아래 바꾼 문장 그대로). 빠진 문장의 내용은 버튼 · 칸 이름이나 툴팁으로 이미 드러나는 것만 뺐다.',
    dom: `const R=[
['[data-main-page] .cl-field__help','권장 크기 2400×960px(5:2). 글자가 든 이미지는 가운데에 두세요. 추가 · 삭제 · 이미지 바꾸기는 바로 반영됩니다.','권장 크기 2400×960px(5:2)입니다. 추가 · 삭제는 저장 없이 바로 반영됩니다.'],
['[data-main-page] .cl-field__help','슬라이드가 없을 때 첫 화면 학원 이름 옆에 나옵니다. 학원 소개 › 갤러리의 대표 사진과 같은 사진이라, 여기서 바꾸면 학원소개 화면에도 반영됩니다.','슬라이드가 없을 때 첫 화면에 나옵니다. 학원 소개 › 갤러리의 대표 사진과 같은 사진입니다.'],
['[data-main-page] .cl-field__help','[사진 바꾸기]는 지금 대표 사진을 새 이미지로 바꿉니다. 갤러리의 다른 사진을 대표로 쓰려면 [갤러리에서 고르기]를 누르세요.','갤러리의 다른 사진을 대표로 쓰려면 [갤러리에서 고르기]를 누르세요.'],
['[data-system-setting] .cl-field__help','jpg · png · gif 5MB 이하. 올리면 로고 편집기에서 빈 여백 자르기 · 흰 배경 투명 처리를 한 뒤 PNG 로 저장합니다. 로고가 없으면 학원 이름으로 대신합니다. 바꾼 로고는 [저장]해야 반영됩니다.','jpg · png · gif 5MB 이하. 올리면 여백 자르기 · 배경 투명 처리를 할 수 있습니다.'],
['[data-system-setting] .cl-field__help','로고 안에 학원명이 들어 있으면 [로고만]을 고르세요. 학원 페이지 위쪽에 로고만 보이고, 학원명 글자는 숨겨집니다. 로고가 없으면 학원명을 그대로 보여줍니다.','로고 안에 학원명이 들어 있으면 [로고만]을 고르세요.'],
['[data-system-setting] .cl-field__help','고르는 즉시 적용되며 [저장]과는 따로이고, 데이터는 바뀌지 않습니다. 언제든 다시 바꿀 수 있습니다.','고르는 즉시 적용됩니다. 데이터는 바뀌지 않고 언제든 되돌릴 수 있습니다.'],
['[data-about-setting] .cl-field__help','학원소개 화면에 왼쪽 위부터 차례로 나옵니다. [대표]로 고른 사진이 맨 앞에 나옵니다. 화면 크기에 따라 사진 크기가 달라질 수 있습니다.','학원 소개 화면에 이 순서대로 나옵니다. [대표] 사진이 맨 앞입니다.'],
['[data-content-access] .cl-page__meta','학생의 콘텐츠 재생에만 적용됩니다. 사용 중인 규칙이 하나라도 있으면 등록된 IP · IP 대역에서만 재생되고, 없으면 지금처럼 제한 없이 재생됩니다.','등록한 IP에서만 학생이 콘텐츠를 재생할 수 있습니다. 하나도 없으면 어디서든 재생됩니다.'],
['[data-org-banner] .cl-page__meta','이서당(2.0) 학원 배너입니다. 추가한 순서대로 나오며, 권장 크기는 980×200px 입니다.','이서당(2.0)에 나오는 학원 배너입니다. 권장 크기는 980×200px입니다.'],
['[data-menu-setting] .cl-page__meta','학원 홈페이지 위쪽 메뉴의 이름을 바꾸거나 숨깁니다. 이름을 비우면 기본 이름을 씁니다. 수업커뮤니티 이름은 학생 내 강의실 메뉴에도 쓰입니다.','학원 홈페이지 위쪽 메뉴의 이름을 바꾸거나 숨깁니다. 이름을 비우면 기본 이름을 씁니다.']];
R.forEach(([sel,a,b])=>doc.querySelectorAll(sel).forEach(e=>{ if(e.textContent.trim()===a){ e.textContent=b; e.dataset.labZ1=''; } }));
const ss=doc.querySelector('[data-system-setting] .cl-page__head'); if(ss&&!ss.querySelector('.cl-page__meta')){const p=doc.createElement('p'); p.className='cl-page__meta'; p.dataset.labZ1=''; p.textContent='홈페이지에 보이는 학원 정보와 가입 · 재생 방식을 정합니다.'; ss.append(p);}
const mc=doc.querySelector('[data-menu-setting] tr[data-code="MAIN-04"] td[data-primary]'); if(mc&&!mc.querySelector('.cl-field__help')){const h=doc.createElement('p'); h.className='cl-field__help'; h.style.margin='2px 0 0'; h.textContent='학생 내 강의실 메뉴에도 쓰입니다'; mc.append(h);}`,
    targets: ['[data-lab-z1]']
  },
  {
    id: 'Z2', group: 3, status: '확정', kind: '마크업', screens: ['main-setting'],
    title: '메인페이지 설정: "홈페이지 보기" 두 번 · "아래에서 설정" 이동',
    current: '머리 오른쪽 [홈페이지 보기]와 바로 아래 "홈페이지에 나오는 것" 상자의 [홈페이지 보기]가 같은 일을 한다. 다른 유형 탭에서는 같은 자리가 [이 유형 미리보기]. "아래에서 설정"은 글자뿐이라 어디인지 찾아 내려가야 한다',
    next: '지금 쓰는 유형에서는 상자 안 버튼을 빼고(머리 버튼 하나), 다른 유형에서만 [이 유형 미리보기]. "아래에서 설정"은 글자는 그대로 두고 그 상자로 이동하는 링크로 — 보라 글자 + ↓, 툴팁 "슬라이드 상자로 이동"(부드럽게 스크롤, 이동한 상자 잠깐 강조)',
    css: `.cl-mm-parts em a { color: var(--cl-primary-pressed); font-style: normal; text-decoration: none; }
.cl-mm-parts em a:hover { text-decoration: underline; text-underline-offset: 3px; }
.cl-mm-block.is-flash { animation: cl-mm-flash 1.2s ease-out; }
@keyframes cl-mm-flash { from { box-shadow: 0 0 0 3px var(--cl-primary-tint); } to { box-shadow: none; } }
@media (prefers-reduced-motion: reduce) { .cl-mm-block.is-flash { animation: none; } }`,
    markup: '`data-current` 와 같은 패널의 `.cl-mm-block__head` 미리보기 버튼은 출력하지 않는다. `<em>아래에서 설정</em>` → `<em><a href="#mm-slides-0" title="슬라이드 상자로 이동">아래에서 설정 ↓</a></em>`(각 상자에 id). 이동 뒤 `.is-flash` 1.2초.',
    dom: `const pan=doc.querySelector('[data-type-panel="0"]'); if(!pan) return; const btn=pan.querySelector('.cl-mm-parts .cl-mm-block__head .cl-btn'); if(btn) btn.remove();
doc.querySelectorAll('[data-type-panel]').forEach(p=>{ const blocks=[...p.querySelectorAll('.cl-mm-block')]; const find=n=>blocks.find(b=>(b.querySelector('.cl-mm-sub')||{}).textContent===n);
 p.querySelectorAll('.cl-mm-parts li').forEach(li=>{const em=li.querySelector('em'); if(!em) return; const n=li.querySelector('strong').textContent.trim(); const map={'첫 화면':'슬라이드','추천 키워드':'추천 키워드','슬라이드':'슬라이드','학원 소개 타일':'대표 사진','배너':'배너'}; const tgt=find(map[n]); if(!tgt) return;
  const a=doc.createElement('a'); a.href='#'; a.className='lab-live'; a.textContent='아래에서 설정 ↓'; a.title=map[n]+' 상자로 이동'; a.addEventListener('click',e=>{e.preventDefault(); tgt.scrollIntoView({behavior:'smooth',block:'center'}); tgt.classList.remove('is-flash'); void tgt.offsetWidth; tgt.classList.add('is-flash');}); em.textContent=''; em.append(a);});});`,
    note: '"아래에서 설정 ↓"를 눌러 보세요. 실험실은 화면 전체가 보여서 이동 대신 강조만 보일 수 있습니다.',
    targets: ['.cl-mm-parts ul']
  },
  {
    id: 'Z3', group: 3, status: '확정', kind: '마크업', screens: ['main-setting'],
    title: '추천 키워드: 눌러도 지워지지 않게',
    current: '키워드 칩 전체가 지우기 버튼이다("키워드를 누르면 지웁니다"). 확인 없이 바로 지워지고, 칩은 보통 "고르기"로 읽혀 실수로 누르기 쉽다. "# 수능대비특강"처럼 # 뒤에 빈칸',
    next: '칩은 글자만(누를 수 없음), 오른쪽 × 아이콘 버튼만 지운다(`aria-label="수능대비특강 지우기"`, hover 때 빨강). 지운 뒤 5초 동안 토스트 "수능대비특강 지웠습니다 [되돌리기]". 표기 "#수능대비특강". 설명 "첫 화면 키워드 줄에 나옵니다. 4개"',
    css: `.cl-mm-kw { display: inline-flex; align-items: center; gap: 2px; height: 30px; padding: 0 4px 0 12px; border-radius: var(--cl-radius-pill); background: var(--cl-hover); color: var(--cl-ink); font-size: var(--cl-fs-ui); }
.cl-mm-kw__x { width: 24px; height: 24px; border: 0; border-radius: 999px; background: transparent; color: var(--cl-ink-muted); display: grid; place-items: center; cursor: pointer; }
.cl-mm-kw__x:hover { background: var(--cl-danger-bg); color: var(--cl-danger); }`,
    markup: '`<button class="cl-chip">` 를 `<span class="cl-mm-kw">#{키워드}<button class="cl-mm-kw__x" aria-label="{키워드} 지우기">×아이콘</button></span>` 로. 지우기는 공통 토스트의 되돌리기와 함께.',
    dom: `const box=doc.querySelector('[data-keywords]'); if(!box) return; const words=[...box.querySelectorAll('.cl-chip')].map(c=>c.textContent.replace('#','').trim());
const x='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
box.innerHTML=words.map(w=>'<span class="cl-mm-kw">#'+w+'<button type="button" class="cl-mm-kw__x lab-live" aria-label="'+w+' 지우기">'+x+'</button></span>').join('');
box.querySelectorAll('.cl-mm-kw__x').forEach(b=>b.addEventListener('click',()=>{const k=b.parentElement; k.hidden=true; let t=doc.getElementById('kw-toast'); if(!t){t=doc.createElement('div'); t.id='kw-toast'; t.style.cssText='position:fixed;left:50%;bottom:32px;transform:translateX(-50%);display:flex;gap:12px;align-items:center;padding:10px 16px;border-radius:12px;background:var(--cl-ink);color:var(--cl-canvas);font-size:14px;z-index:99'; doc.body.append(t);} t.innerHTML=k.textContent+' 지웠습니다 <button type="button" class="lab-live" style="border:0;background:none;color:#B78AF7;font:inherit;font-weight:600;cursor:pointer">되돌리기</button>'; t.hidden=false; t.querySelector('button').onclick=()=>{k.hidden=false; t.hidden=true;}; clearTimeout(t._h); t._h=setTimeout(()=>t.hidden=true,5000);}));
const help=box.parentElement.querySelector('.cl-field__help'); if(help) help.textContent='첫 화면 키워드 줄에 나옵니다. '+words.length+'개';`,
    note: '× 를 눌러 보세요. 토스트의 [되돌리기]로 다시 살아납니다.',
    targets: ['[data-keywords]']
  },
  {
    id: 'Z4', group: 6, status: '확정', kind: '마크업', screens: ['system-setting'],
    title: '학원 설정: 버튼 · 칸 이름 통일, 코드 새로 만들기는 확인',
    current: '"학원 번호", 로고 [이미지 변경](다른 화면은 "이미지 바꾸기"), [이미지 삭제]가 회색 글자. [코드 생성]은 누르는 즉시 이전 코드를 못 쓰게 되는데 확인이 없다',
    next: '"학원 전화번호". [이미지 바꾸기]. [이미지 삭제]는 빨간 글자(`cl-danger`). [새 코드 만들기](F2) → 확인 창 "새 코드를 만들까요? 지금 코드(A1b2…)로는 더 가입할 수 없습니다. [취소][새로 만들기]". [코드 복사] 뒤 토스트 "복사했습니다"',
    css: `[data-logo-delete] { color: var(--cl-danger); }
[data-logo-delete]:hover { background: var(--cl-danger-bg); }`,
    markup: '버튼 · 라벨 문구 변경. 코드 만들기 전 공통 확인 창(`cl-dialog--confirm`).',
    dom: `const r=doc.querySelector('[data-system-setting]'); if(!r) return; const lab=r.querySelector('label[for="mss-phone"]'); if(lab) lab.firstChild.textContent='학원 전화번호 ';
const ch=r.querySelector('[data-logo-change]'); if(ch) ch.lastChild.textContent='이미지 바꾸기';
const c=r.querySelector('[data-code-create]'); if(c){ c.textContent='새 코드 만들기'; c.classList.add('lab-live'); c.addEventListener('click',()=>{ let d=doc.getElementById('code-dlg'); if(!d){ d=doc.createElement('dialog'); d.id='code-dlg'; d.className='cl-dialog cl-dialog--confirm'; d.innerHTML='<h2 class="cl-dialog__title">새 코드를 만들까요?</h2><p class="cl-dialog__desc">지금 코드(A1b2C3d4E5)로는 더 가입할 수 없습니다.</p><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--ghost lab-live" data-x>취소</button><button type="button" class="cl-btn cl-btn--primary lab-live" data-x>새로 만들기</button></div>'; doc.body.append(d); d.querySelectorAll('[data-x]').forEach(b=>b.addEventListener('click',()=>d.close())); } d.showModal(); }); }`,
    note: '[새 코드 만들기]를 눌러 확인 창을 보세요(실험실이라 실제로 바뀌지 않습니다).',
    targets: ['label[for="mss-phone"]', '[data-logo-change]', '[data-logo-delete]', '[data-code-create]']
  },
  {
    id: 'Z5', group: 1, status: '확정', kind: '마크업', screens: ['system-setting'],
    title: '학원 설정: 바로 적용되는 칸을 저장 폼 밖으로 · 저장 바에 바꾼 개수',
    current: '"화면 디자인"은 고르는 즉시 적용되는데 [저장]해야 하는 다른 칸들 사이(폼 안)에 있다. 저장 바는 늘 "바꾼 뒤 [저장]을 눌러주세요."라 바꾼 게 있는지 알 수 없다',
    next: '"화면 디자인" 상자를 폼 맨 아래 밖으로 빼고 제목 옆에 "바로 적용" 회색 배지. 저장 바: 아무것도 안 바꿨으면 "바뀐 내용이 없습니다" + [저장] 비활성, 바꾸면 "바꾼 항목 2개 · 저장해야 반영됩니다" + [저장] 활성. 목차(이 페이지)에서는 "화면 디자인"을 맨 아래로',
    css: `.cl-mss-instant { grid-column: 2; margin-top: 16px; }
@media (max-width: 900px) { .cl-mss-instant { grid-column: auto; } }
.cl-mss-instant .cl-section-title { display: flex; align-items: center; gap: 8px; }`,
    markup: '`#mss-design` 을 `<form>` 밖(저장 바 다음)으로 옮기고 `.cl-mss-instant`. 저장 바는 폼의 처음 값과 비교해 바뀐 칸 수를 세고(`input` · `change`), 0 이면 `[data-submit]` `disabled`.',
    dom: `const r=doc.querySelector('[data-system-setting]'); if(!r) return; const d=r.querySelector('#mss-design'), f=r.querySelector('[data-form]'); if(!d||!f) return;
f.after(d); d.classList.add('cl-mss-instant'); const t=d.querySelector('.cl-section-title'); const b=doc.createElement('span'); b.className='cl-badge cl-badge--neutral'; b.textContent='바로 적용'; t.append(b);
const toc=r.querySelector('.cl-mss-toc a[href="#mss-design"]'); if(toc) toc.parentElement.append(toc);
const msg=r.querySelector('[data-savebar-msg]'), sub=r.querySelector('[data-submit]'); msg.textContent='바뀐 내용이 없습니다'; sub.disabled=true;
const init=new Map(); f.querySelectorAll('input,textarea').forEach(i=>init.set(i,i.type==='radio'?i.checked:i.value));
const sync=()=>{const names=new Set(); f.querySelectorAll('input,textarea').forEach(i=>{ if((i.type==='radio'?i.checked:i.value)!==init.get(i)) names.add(i.name||i.id); }); const n=names.size; msg.textContent=n?'바꾼 항목 '+n+'개 · 저장해야 반영됩니다':'바뀐 내용이 없습니다'; sub.disabled=!n;};
f.querySelectorAll('input,textarea').forEach(i=>{i.classList.add('lab-live'); i.addEventListener('input',sync); i.addEventListener('change',sync);});
f.querySelectorAll('label').forEach(l=>l.classList.add('lab-live'));
const st=doc.createElement('style'); st.textContent='input.lab-live,textarea.lab-live,label.lab-live{pointer-events:auto}'; doc.head.append(st);`,
    note: '라디오를 하나 바꿔 보세요. 저장 바 문구와 [저장] 버튼이 바뀝니다.',
    targets: ['.cl-mss-instant', '.cl-savebar']
  },
  {
    id: 'Z6', group: 6, status: '확정', kind: '마크업', screens: ['about-setting'],
    title: '학원 소개 설정: 탭 개수 · 편집기 모드 이름',
    current: '탭 "갤러리" · "SNS"에 몇 개가 있는지 안 보인다. 편집기 아래 모드 전환이 영어 "Markdown / WYSIWYG". 머리 버튼 "학원소개 보기"(메뉴 이름은 "학원 소개")',
    next: '탭 개수 배지(A5 규칙): 갤러리 4 · SNS 2. 편집기 모드는 "편집기 / 마크다운"(편집기가 기본, 왼쪽). 버튼 "학원 소개 보기"',
    markup: 'Toast UI `i18n` 에 ko-KR 문구를 넣거나 모드 버튼 글자를 덮어쓴다. 탭에 `<span class="cl-tab__count">`.',
    css: `.cl-tab__count { min-width: 20px; height: 20px; padding: 0 6px; margin-left: 6px; border-radius: var(--cl-radius-pill); background: var(--cl-hover); color: var(--cl-ink-2); font-size: var(--cl-fs-micro); font-weight: 600; display: inline-flex; align-items: center; justify-content: center; }`,
    dom: `const r=doc.querySelector('[data-about-setting]'); if(!r) return; [['gallery',4],['sns',2]].forEach(([k,n])=>{const t=r.querySelector('[data-tab="'+k+'"]'); if(t&&!t.querySelector('.cl-tab__count')){const c=doc.createElement('span'); c.className='cl-tab__count cl-num'; c.textContent=n; t.append(c);}});
const a=r.querySelector('.cl-page__head .cl-btn'); if(a) a.lastChild.textContent='학원 소개 보기';
const m=r.querySelector('[data-editor-mode]'); if(m){ const s=m.querySelectorAll('span'); s[0].textContent='편집기'; s[0].style.cssText=s[1].style.cssText; s[1].textContent='마크다운'; s[1].style.cssText='padding:2px 8px'; }`,
    targets: ['[data-about-setting] .cl-tabs', '[data-editor-mode]']
  },
  {
    id: 'Z7', group: 3, status: '확정', kind: 'CSS', screens: ['about-setting', 'banner-setting'],
    title: '지우기 아이콘 · 버튼 색 하나로',
    current: '갤러리 · SNS 의 휴지통 아이콘은 늘 빨간색이라 줄마다 빨간 점이 찍혀 보인다. 배너 카드의 [삭제]는 빨간 글자, 학원 설정 로고 [이미지 삭제]는 회색 — 화면마다 다르다',
    next: '휴지통 아이콘 버튼은 평소 회색(`cl-ink-muted`), 마우스 · 포커스 때 빨강 + 연한 빨강 바탕. 글자 버튼 [삭제]는 빨간 글자 그대로(행 메뉴 N1 규칙과 같은 색)',
    css: `.cl-icon-btn.cl-mms-delete { color: var(--cl-ink-muted); }
.cl-icon-btn.cl-mms-delete:hover, .cl-icon-btn.cl-mms-delete:focus-visible { color: var(--cl-danger); background: var(--cl-danger-bg); }`,
    targets: ['.cl-icon-btn.cl-mms-delete']
  },
  {
    id: 'Z8', work: '서버 필요', server: '허용 IP 화면을 그릴 때 서버가 지금 접속한 IP(`REMOTE_ADDR`, 프록시 뒤면 `X-Forwarded-For` 첫 값)를 내려줘야 한다.', group: 3, status: '확정', kind: '마크업', screens: ['ip-setting'],
    title: '허용 IP 등록 창: 내 IP 넣기 · 첫 규칙 경고',
    current: '등록 창은 종류(단일 IP) · IP 칸 · [사용] 체크뿐. 관리자가 자기 IP 를 모르면 넣기 어렵고, 첫 규칙을 켜는 순간 다른 곳의 학생은 모두 재생이 막히는데 그 안내가 없다. 체크 이름 "사용"이 무엇을 쓰는지 모호하다',
    next: 'IP 칸 아래 "지금 접속한 IP 203.0.113.24 [넣기]". 등록된 규칙이 0개일 때만 창 아래 주의 상자 "등록하면 이 IP 밖에서는 학생이 콘텐츠를 재생할 수 없습니다." 체크 이름 "바로 적용". 형식이 틀리면 칸 아래 오류(cl-field__error) "123.123.123.10 또는 123.123.123.0/24 형식으로 넣어 주세요"',
    css: `.cl-ip-mine { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); }
.cl-ip-warn { margin-top: 12px; padding: 10px 12px; border-radius: 8px; background: var(--cl-warning-bg); color: var(--cl-warning); font-size: var(--cl-fs-caption); }`,
    markup: '서버가 접속 IP 를 내려준다(`REMOTE_ADDR` · 프록시면 `X-Forwarded-For` 첫 값). 규칙 수가 0 일 때만 `.cl-ip-warn`. 체크 라벨 "바로 적용".',
    dom: `const r=doc.querySelector('[data-content-access]'); if(!r||r.querySelector('[data-lab-dlg]')) return;
const card=doc.createElement('section'); card.className='cl-card'; card.dataset.labDlg=''; card.style.cssText='max-width:440px;margin:24px auto 0;padding:0;box-shadow:var(--cl-shadow-float)';
card.innerHTML='<div class="cl-dialog__head"><h2 class="cl-dialog__title">허용 IP 등록 <span class="cl-muted" style="font-size:12px;font-weight:400">(창 미리보기)</span></h2></div><div class="cl-dialog__body"><div class="cl-field"><label class="cl-field__label">종류</label><span class="cl-selectbox"><button type="button" class="cl-select cl-selectbox__control"><span class="cl-selectbox__label">단일 IP</span></button></span></div><div class="cl-field" style="margin-top:12px"><label class="cl-field__label">IP · IP 대역</label><input class="cl-input" placeholder="예: 123.123.123.10 또는 123.123.123.0/24"><p class="cl-ip-mine cl-num">지금 접속한 IP 203.0.113.24 <button type="button" class="cl-btn cl-btn--tint cl-btn--sm lab-live" data-mine>넣기</button></p></div><label class="cl-check" style="margin-top:12px"><input type="checkbox" checked><span>바로 적용</span></label><p class="cl-ip-warn">등록하면 이 IP 밖에서는 학생이 콘텐츠를 재생할 수 없습니다.</p><div class="cl-dialog__actions"><button type="button" class="cl-btn cl-btn--ghost">취소</button><button type="button" class="cl-btn cl-btn--primary">등록</button></div></div>';
r.append(card); card.querySelector('[data-mine]').addEventListener('click',()=>{card.querySelector('.cl-input').value='203.0.113.24';});`,
    note: '실험실에서는 등록 창을 화면 아래에 펼쳐 두었습니다. IP 는 가짜 값입니다. [넣기]를 눌러 보세요.',
    targets: ['[data-lab-dlg]']
  },
  {
    id: 'Z9', group: 6, status: '확정', kind: '마크업', screens: ['banner-setting'],
    title: '이서당 배너: 카드 이름 · 사용 안 함 표시',
    current: '모든 카드 아래 "기본이미지"(뜻 없음, 띄어쓰기도 틀림). [사용 안 함]을 골라도 배너 카드가 그대로 보여 지금 나오는지 알 수 없다. 순서를 바꿀 방법이 없다',
    next: '카드 아래는 "1번 배너"처럼 순서만(이미지 정보는 툴팁 "980×200 · PNG"). [사용 안 함]이면 목록 위에 회색 안내 "지금은 배너가 나오지 않습니다" + 카드 흐리게(60%). 순서는 카드를 끌어 옮겨 바꾼다(끌기 손잡이 + 키보드는 [위로][아래로] 메뉴, 놓는 즉시 저장) (정함 · 2026-10-22)',
    css: `[data-org-banner].is-off .cl-mob-cards { opacity: .6; }
.cl-mob-off { margin: 0 0 12px; padding: 10px 12px; border-radius: 8px; background: var(--cl-sidebar); color: var(--cl-ink-2); font-size: var(--cl-fs-caption); }`,
    markup: '`.cl-mob-name` 에 "{n}번 배너". `isBanner=0` 이면 페이지 루트에 `.is-off` + 안내 줄.',
    dom: `const r=doc.querySelector('[data-org-banner]'); if(!r) return; r.querySelectorAll('.cl-mob-name').forEach((n,i)=>{n.textContent=(i+1)+'번 배너'; n.title='980×200 · PNG';});
const list=r.querySelector('[data-list]'); const off=doc.createElement('p'); off.className='cl-mob-off'; off.textContent='지금은 배너가 나오지 않습니다. 위에서 [사용]을 고르면 다시 나옵니다.'; off.hidden=true; list.before(off);
const set=v=>{r.classList.toggle('is-off',v==='0'); off.hidden=v!=='0';};
r.querySelectorAll('[name="isBanner"]').forEach(i=>{i.classList.add('lab-live'); i.closest('label').classList.add('lab-live'); i.addEventListener('change',()=>set(i.value));});
const st=doc.createElement('style'); st.textContent='input.lab-live,label.lab-live{pointer-events:auto}'; doc.head.append(st);`,
    note: '[사용 안 함]을 골라 보세요.',
    targets: ['.cl-mob-name']
  },
  {
    id: 'Z10', group: 9, status: '확정', kind: '마크업', screens: ['menu-setting'],
    title: '메뉴 설정: 보이기 칸 · 홈페이지 보기 위치',
    current: '"보이기" 열 머리와 체크 옆 글자가 모두 "보이기"라 같은 말이 두 번. 숨겨도 줄 모양이 같다. [홈페이지 보기]가 저장 바 안 [저장] 옆에 있다(다른 설정 화면은 머리 오른쪽)',
    next: '체크 옆 글자는 상태 "보임" / "숨김". 숨긴 줄은 이름 칸 · 입력 칸을 흐리게(`cl-ink-faint`). [홈페이지 보기]는 머리 오른쪽 고스트 버튼(메인페이지 설정 · 학원 소개 설정과 같은 자리), 저장 바에는 문구와 [저장]만',
    css: `[data-menu-setting] tr.is-hidden td[data-primary], [data-menu-setting] tr.is-hidden .cl-input { color: var(--cl-ink-faint); }
[data-menu-setting] tr.is-hidden .cl-input { background: var(--cl-parchment); }`,
    markup: '체크 라벨 글자를 상태에 따라 바꾸고 줄에 `.is-hidden`. 머리를 `cl-page__head--row` 로 바꿔 오른쪽에 `<a class="cl-btn cl-btn--ghost" target="_blank">홈페이지 보기</a>`.',
    dom: `const r=doc.querySelector('[data-menu-setting]'); if(!r) return; r.querySelectorAll('tbody tr').forEach(tr=>{const c=tr.querySelector('[data-visible-input]'), s=c.nextElementSibling; c.classList.add('lab-live'); c.closest('label').classList.add('lab-live'); const sync=()=>{s.textContent=c.checked?'보임':'숨김'; tr.classList.toggle('is-hidden',!c.checked);}; c.addEventListener('change',sync); sync();});
const sb=r.querySelector('.cl-savebar a'); const h=r.querySelector('.cl-page__head'); if(sb&&h){ const meta=h.querySelector('.cl-page__meta'); const w=doc.createElement('div'); [...h.children].filter(e=>e!==meta).forEach(e=>w.append(e)); h.prepend(w); h.classList.add('cl-page__head--row'); const sp=doc.createElement('span'); sp.className='cl-toolbar__spacer'; sb.className='cl-btn cl-btn--ghost'; sb.innerHTML='<svg class="cl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>홈페이지 보기'; w.after(sp,sb); if(meta) h.after(meta); }
const st=doc.createElement('style'); st.textContent='input.lab-live,label.lab-live{pointer-events:auto}'; doc.head.append(st);`,
    note: '체크를 꺼 보세요. 줄이 흐려지고 "숨김"으로 바뀝니다.',
    targets: ['[data-menu-setting] tbody', '[data-menu-setting] .cl-page__head .cl-btn']
  },
  {
    id: 'W4', group: 4, status: '확정', kind: '마크업', screens: ['download', 'demand'],
    title: '기록 없는 기간: 빈 상태 하나로 (다운로드 · 사용량)',
    current: '9월처럼 기록이 없는 달을 고르면 같은 문장이 두 번 나온다 — 그래프 자리의 회색 상자(`cl-chart--empty`, 아이콘 없음) "이 달에 다운로드 기록이 없습니다"와 표 자리의 빈 상태(`cl-empty`, 아이콘 있음) 같은 문장. 사용량 현황도 "이 달에 집계된 사용량이 없습니다"가 두 번. 모양이 서로 달라 어느 것이 기준인지 모른다. 사용량의 월 표기는 "09월"(다른 곳 "9월")',
    next: '기간 전체에 기록이 0건이면 그래프 카드와 표를 숨기고, 그 자리에 디자인 시스템 Empty(`cl-empty`) 하나만 카드 안에 둔다.\n· 아이콘: 사이드바 메뉴와 같은 아이콘(다운로드 현황 = 다운로드, 사용량 현황 = 원그래프), 48px 상자.\n· 제목: "{기간}에는 {무엇}이 없습니다" — "2026년 9월에는 다운로드 기록이 없습니다", "2026년 9월에는 집계된 사용량이 없습니다".\n· 설명 한 줄: 언제 생기는지 — "학원 파일을 내려받으면 날짜별로 여기에 쌓입니다." / "사용량은 매일 오전 9시에 전날 것까지 집계됩니다."\n· 버튼 하나: [이번 달 보기](이미 이번 달이면 버튼 없음). [엑셀 다운로드]는 비활성.\n· 기록이 1건이라도 있으면 빈 상태 없이 그래프(빈 날 0)와 표를 그린다. `cl-chart--empty` 는 더 쓰지 않는다. 월 표기 "9월"',
    css: `.cl-empty-card { margin: 0 0 16px; }
.cl-empty-card .cl-empty { padding: var(--cl-space-7) var(--cl-space-4); }`,
    markup: '응답 `rows.length === 0` 이면 `[data-chart]` 카드와 `[data-list]` 를 숨기고 `<section class="cl-card cl-empty-card"><div class="cl-empty"><span class="cl-empty__icon">{메뉴 아이콘 22px}</span><p class="cl-empty__title">…</p><p class="cl-empty__desc">…</p><button class="cl-btn cl-btn--ghost">이번 달 보기</button></div></section>` 하나를 둔다. 그래프 쪽 `emptyState` 호출(`cl-chart--empty`)은 지운다. 디자인 시스템 "클라우드러닝 작업공간" › Empty › "기간 화면" 규칙과 같다.',
    dom: `const R=doc.querySelector('[data-stat-download], [data-stat-demand]'); if(!R||R.querySelector('[data-lab-switch]')) return; const isDl=R.hasAttribute('data-stat-download');
const ico=isDl?'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>':'<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>';
const card=doc.createElement('section'); card.className='cl-card cl-empty-card'; card.hidden=true;
card.innerHTML='<div class="cl-empty"><span class="cl-empty__icon"><svg class="cl-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ico+'</svg></span><p class="cl-empty__title">2026년 9월에는 '+(isDl?'다운로드 기록이':'집계된 사용량이')+' 없습니다</p><p class="cl-empty__desc">'+(isDl?'학원 파일을 내려받으면 날짜별로 여기에 쌓입니다.':'사용량은 매일 오전 9시에 전날 것까지 집계됩니다.')+'</p><button type="button" class="cl-btn cl-btn--ghost lab-live" data-back>이번 달 보기</button></div>';
const tb=R.querySelector('[data-picker], .cl-toolbar'); tb.after(card);
const sw=doc.createElement('div'); sw.dataset.labSwitch=''; sw.style.cssText='display:flex;align-items:center;gap:8px;margin:0 0 12px;padding:8px 12px;border:1px dashed #D92D20;border-radius:8px;font-size:12px;color:#D92D20';
sw.innerHTML='실험실 미리보기 <div class="cl-segmented" role="group"><button type="button" class="cl-segmented__item lab-live" style="width:auto;padding:0 10px;font-size:12px" aria-pressed="true" data-m="10">기록 있는 달 (10월)</button><button type="button" class="cl-segmented__item lab-live" style="width:auto;padding:0 10px;font-size:12px" aria-pressed="false" data-m="9">기록 없는 달 (9월)</button></div>';
tb.before(sw);
const lab=[...R.querySelectorAll('.cl-selectbox__label')].find(l=>/월$|전체/.test(l.textContent)&&!/년/.test(l.textContent));
const keep=lab?lab.textContent:'';
const parts=()=>[...R.querySelectorAll('.cl-mst-chart, [data-usage-tabs], .cl-kpi, [data-list], .cl-table-wrap, .cl-table-foot')].filter(e=>!card.contains(e));
const set=m=>{ const empty=m==='9'; card.hidden=!empty; parts().forEach(e=>e.style.display=empty?'none':''); if(lab) lab.textContent=empty?'9월':keep;
 const x=doc.querySelector('[data-excel]'); if(x){x.disabled=empty; x.title=empty?'내려받을 기록이 없습니다':'';}
 sw.querySelectorAll('[data-m]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===m)); };
sw.querySelectorAll('[data-m]').forEach(b=>b.addEventListener('click',()=>set(b.dataset.m)));
card.querySelector('[data-back]').addEventListener('click',()=>set('10'));`,
    note: '빨간 점선 "실험실 미리보기"에서 [기록 없는 달 (9월)]을 눌러 보세요. 이 줄은 실험실에만 있습니다.',
    targets: ['.cl-empty-card']
  },
  {
    id: 'X4', group: 6, status: '확정', kind: '마크업', screens: ['group-stat-s'],
    title: '그룹 통계: 학생을 고른 상태가 안 보인다',
    current: '학생을 누르면 그룹 선택 칸이 비고("그룹을 선택하세요") 어느 그룹인지 사라진다. 옆에는 회색 글자 "사혜인"만 있어 학생만 보는 중인지, 어떻게 되돌리는지 모른다(목록에서 같은 학생을 다시 눌러야 함). 이 상태는 학생 통계 화면과 같은 내용인데 연결이 없다',
    next: '그룹 칸은 "lab241 (13명)" 그대로. 회색 글자 대신 선택 칩 "사혜인 sahyein1 ×"(학생 통계 Y1 과 같은 모양, × = 그룹 전체로). 칩 오른쪽에 링크 "학생 통계에서 보기 →"(로그인 이력 · 기간까지 보는 화면). 오른쪽 두 카드 제목은 "사혜인 기간별 로그인" · "사혜인 수강 강좌"',
    css: `[data-stat-group] .cl-mst-selected { display: inline-flex; align-items: center; gap: 4px; height: 32px; padding: 0 4px 0 12px; border-radius: var(--cl-radius-pill); background: var(--cl-primary-tint); color: var(--cl-primary-pressed); }
[data-stat-group] .cl-mst-selected .cl-id { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); margin-left: 4px; }
[data-stat-group] .cl-gs-link { margin-left: 8px; font-size: var(--cl-fs-caption); color: var(--cl-primary-pressed); text-decoration: none; }
[data-stat-group] .cl-gs-link:hover { text-decoration: underline; text-underline-offset: 3px; }`,
    markup: '학생을 골라도 그룹 콤보박스 값은 유지(지금은 지워짐 — 상태 갱신 때 입력값을 다시 그리지 않는 버그로 보임). `[data-scope]` 를 학생 통계의 `.cl-mst-selected` 칩으로: `<strong>{이름}</strong><span class="cl-id">{아이디}</span><button class="cl-icon-btn" aria-label="그룹 전체 보기">×</button>`. 옆에 `<a class="cl-gs-link" href="/manager/stat/user?usr={아이디}">학생 통계에서 보기 →</a>`.',
    dom: `const r=doc.querySelector('[data-stat-group-student]'); if(!r) return; const inp=r.querySelector('.cl-mst-group'); if(inp) inp.value='lab241 (13명)';
const sc=r.querySelector('[data-scope]'); if(sc){ const c=doc.createElement('span'); c.className='cl-mst-selected'; c.innerHTML='<strong>사혜인</strong><span class="cl-id">sahyein1</span><button type="button" class="cl-icon-btn lab-live" aria-label="그룹 전체 보기" title="그룹 전체 보기" data-lab-go="group-stat"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>'; const a=doc.createElement('a'); a.href='#'; a.className='cl-gs-link'; a.dataset.labGo='user-stat'; a.textContent='학생 통계에서 보기 →'; sc.replaceWith(c); c.after(a); }`,
    note: '× 는 그룹 전체(그룹 통계 화면)로, "학생 통계에서 보기"는 학생 통계로 이동합니다.',
    targets: ['[data-stat-group] .cl-mst-selected', '.cl-mst-group']
  },
  {
    id: 'X5', group: 9, status: '확정', kind: '마크업', work: '서버 필요', server: '그룹 소속 학생 API 가 같은 학생을 두 번 내려준다(lab241 의 이호준 lhj992). 소속 목록 조회에서 사용자 아이디로 중복을 없애고(`DISTINCT` 또는 GROUP BY), 소속 학생 수도 중복 없이 센다.', screens: ['group-stat-s'],
    title: '소속 학생 목록에 같은 학생이 두 번',
    current: 'lab241 그룹에 "이호준 lhj992"가 두 줄 나온다. 소속 학생 수 13 도 중복을 센 값일 수 있다',
    next: '같은 아이디는 한 줄. 소속 학생 수는 중복 없이 센 값(12)',
    markup: '프론트에서도 `usr_uid` 로 한 번 더 걸러 같은 사람이 두 줄 그려지지 않게 한다.',
    dom: `const r=doc.querySelector('[data-stat-group-student]'); if(!r) return; const seen=new Set(); let n=0; r.querySelectorAll('.cl-ms-list li').forEach(li=>{const id=(li.querySelector('.cl-muted')||{}).textContent; if(seen.has(id)){li.remove();} else {seen.add(id); n++;}}); const c=r.querySelector('[data-student-count]'); if(c) c.textContent=n;`,
    targets: ['[data-student-count]']
  },
  {
    id: 'X6', group: 3, status: '확정', kind: '마크업', screens: ['group-stat', 'group-stat-s', 'user-stat'],
    title: '강좌 이름 링크: 선생님 계정으로 넘어간다는 표시',
    current: '그룹 · 학생 통계의 강좌 이름을 누르면 확인창 "담당 선생님 계정으로 들어갈까요? / [중2 수학 개념 완성] 강좌 상세 관리를 엽니다…" 뒤 그 선생님 계정의 강좌로 간다(지금 동작). 표에서는 보통 링크와 모양이 같아 통계 상세로 가는 줄 안다. 확인창 제목에 선생님 이름이 없어 과목 목록 · 선생님 목록의 같은 창("{이름} 선생님 계정으로 들어갈까요?", M4)과 다르다',
    next: '링크와 동작은 그대로. 강좌 이름 뒤에 "들어가기" 아이콘(log-in 14px, `cl-ink-muted`, hover 때 보라) — 선생님 목록 C6 와 같은 아이콘. 툴팁 "선생님 계정으로 강좌 관리". 확인창은 M4 공통 하나로: 제목 "{선생님 이름} 선생님 계정으로 들어갈까요?", 설명 "[{강좌}] 강좌 관리를 엽니다. 계정 메뉴의 [사이트 관리]로 돌아올 수 있습니다.", [취소][들어가기]. 담당 선생님이 여러 명인 강좌는 M4 결정대로 팝업에서 선생님을 고른다',
    css: `.cl-enter-ico { display: inline-block; margin-left: 4px; vertical-align: -2px; color: var(--cl-ink-muted); transition: color var(--cl-dur) var(--cl-ease); }
.cl-ms-teacher:hover .cl-enter-ico { color: var(--cl-primary-pressed); }`,
    markup: '`.cl-ms-teacher` 안 강좌 이름 뒤에 `<svg class="cl-enter-ico" aria-hidden="true">`(log-in), 버튼 `aria-label="{강좌} — {선생님} 선생님 계정으로 강좌 관리"`. 확인창은 과목 목록과 같은 컴포넌트에 선생님 이름을 넘긴다(강좌 응답에 담당 선생님 이름 포함).',
    dom: `const ico='<svg class="cl-enter-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>';
doc.querySelectorAll('[data-courses] .cl-ms-teacher').forEach(b=>{ if(b.querySelector('.cl-enter-ico')) return; const n=b.textContent.trim(); b.dataset.course=n; b.title='선생님 계정으로 강좌 관리'; b.insertAdjacentHTML('beforeend',ico); b.onclick=()=>{const d=doc.getElementById('gs-imp'); if(!d) return; d.querySelector('.cl-dialog__title').textContent='임소연 선생님 계정으로 들어갈까요?'; d.querySelector('.cl-dialog__desc').textContent='['+n+'] 강좌 관리를 엽니다. 계정 메뉴의 [사이트 관리]로 돌아올 수 있습니다.'; d.showModal();}; });`,
    note: '강좌 이름을 눌러 확인창을 보세요. 선생님 이름 "임소연"은 예시 값입니다(실제는 그 강좌 담당 선생님).',
    targets: ['[data-courses] .cl-ms-teacher']
  },
  {
    id: 'Z11', group: 3, status: '확정', kind: 'CSS', screens: ['main-setting', 'system-setting', 'about-setting'],
    title: '입력 칸 옆 버튼 높이 · 여러 줄 입력 칸 글자',
    current: '입력 칸은 40px(`cl-h-control-lg`)인데 바로 옆 버튼이 더 낮다 — 추천 키워드 [추가] 32px, 학원가입 코드 [코드 생성][코드 복사] 28px, SNS 링크 [추가] 32px. 한 줄인데 위아래 끝이 어긋난다. 학원 설정 "푸터 문구" 칸은 글꼴을 물려받지 않아 13.3px 검정(브라우저 기본 글자)이다',
    next: '입력 칸과 한 줄에 놓인 버튼은 입력 칸과 같은 40px(`cl-h-control-lg`), 글자 크기는 버튼 기본(`cl-fs-ui` 14px 600). 여러 줄 입력 칸(textarea)도 `cl-input` 과 같은 글꼴 · 14px · `cl-ink`, 위아래 10px, 줄높이 1.6',
    css: `.cl-mms-keyword-form .cl-btn, .cl-inline-fields:has(> .cl-input) > .cl-btn, .cl-mab-sns-link .cl-btn { height: var(--cl-h-control-lg); padding: 0 14px; font-size: var(--cl-fs-ui); }
textarea.cl-input { font: inherit; font-size: var(--cl-fs-ui); line-height: 1.6; color: var(--cl-ink); padding: 10px 12px; }`,
    markup: 'CSS 만. 디자인 시스템 Field 규칙(입력 40px)과 Button 규칙을 함께 쓰는 자리라, "입력 칸 옆 버튼은 입력 높이에 맞춘다"를 Field 규칙에 더했다.',
    targets: ['.cl-mms-keyword-form .cl-btn', '.cl-inline-fields:has(> .cl-input) > .cl-btn', 'textarea.cl-input']
  },
  {
    id: 'Z12', group: 1, status: '확정', kind: 'CSS', screens: ['system-setting'],
    title: '학원 설정: 칸 사이 · 목차 현재 위치',
    current: '기본 정보 2단에서 "홈페이지 머리 · 바닥에 보입니다." 도움말 바로 아래(0px)에 다음 줄 "학원 주소" 이름표가 붙는다(행 간격 0). 왼쪽 목차 "이 페이지"는 지금 보고 있는 구역 표시가 없다',
    next: '2단 행 사이 20px(`cl-space-5` 24 보다 한 단계 작게 — 같은 카드 안 칸 사이). 목차는 지금 보이는 구역을 `cl-primary-tint` 바탕 + `cl-primary-pressed` 600 글자로(사이드바 현재 메뉴와 같은 색), 누르면 그 구역으로 부드럽게 이동',
    css: `.cl-mtf-row { row-gap: 20px; }
.cl-mss-toc a[aria-current="true"] { background: var(--cl-primary-tint); color: var(--cl-primary-pressed); font-weight: 600; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }`,
    markup: '목차 링크에 `aria-current="true"` 를 지금 화면에 보이는 구역에 붙인다(IntersectionObserver, 위쪽 30% 기준).',
    dom: `const a=doc.querySelector('.cl-mss-toc a'); if(a) a.setAttribute('aria-current','true');`,
    note: '실험실은 화면 전체가 한 번에 보여서 첫 구역(기본 정보)만 현재로 표시했습니다.',
    targets: ['.cl-mtf-row', '.cl-mss-toc']
  },
  {
    id: 'Z13', group: 1, status: '확정', kind: '마크업', screens: ['main-setting'],
    title: '메인페이지 설정: 머리에 상위 메뉴 "환경설정"',
    current: '같은 환경설정 묶음의 다른 화면(학원 설정 · 학원 소개 설정 · 메뉴 설정 …)은 제목 위에 "환경설정"이 있는데 이 화면만 없다',
    next: '디자인 시스템 PageHead 규칙대로 제목 위 `cl-page__parent` "환경설정"',
    markup: '`.cl-page__head` 제목 앞에 `<p class="cl-page__parent">환경설정</p>`.',
    dom: `const t=doc.querySelector('[data-main-page] .cl-page__title'); if(t&&!t.parentElement.querySelector('.cl-page__parent')){const p=doc.createElement('p'); p.className='cl-page__parent'; p.textContent='환경설정'; t.before(p);}`,
    targets: ['[data-main-page] .cl-page__parent']
  },
  {
    id: 'Z14', group: 3, status: '확정', kind: 'CSS', screens: ['about-setting'],
    title: '학원 소개 설정 3개 탭: 표시 정리 (CSS · 문구만)',
    current: '소개: 글자 수 "612 / 1,000자"가 편집기 아래 왼쪽에 따로 떠 있고, 버튼 이름 "소개 저장"(다른 설정 화면은 "저장"). 갤러리: 대표 사진을 보라 테두리 · "대표" 배지 · "대표 사진" 글자 세 번 표시. 다른 카드의 [대표로]는 굵은 검정 글자라 버튼인지 이름인지 모른다. [사진 추가] 칸이 사진 카드보다 낮다. SNS: 등록 목록에 제목이 없고, 주소가 밑줄 회색이라 본문처럼 보인다',
    next: '새 부품 없이 CSS · 문구만.\n· 소개: 글자 수를 편집기 바로 아래 오른쪽에 붙이고, 900자를 넘으면 주의 색(`cl-warning`). 버튼 "저장".\n· 갤러리: 대표 표시는 사진 위 "대표" 배지 하나 — 보라 테두리 · "대표 사진" 글자는 뺀다. [대표로]는 `cl-btn--text` 모양(`cl-ink-2` 500, hover `cl-hover` 바탕). [사진 추가] 칸은 사진 카드와 같은 높이.\n· SNS: 목록 위 "등록된 SNS 2"(`cl-section-title`). 주소는 밑줄 없이 `cl-ink-muted`, hover 때 밑줄',
    css: `[data-about-setting] .cl-editor-count { margin: 6px 0 0; text-align: right; font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); }
[data-about-setting] .cl-editor-count.is-near { color: var(--cl-warning); }
.cl-mab-gallery__item.is-main { box-shadow: none; }
.cl-mab-gallery__item.is-main .cl-mab-gallery__actions > .cl-muted { display: none; }
.cl-mab-gallery__actions .cl-btn--text { color: var(--cl-ink-2); font-weight: 500; }
.cl-mab-gallery__actions .cl-btn--text:hover { background: var(--cl-hover); color: var(--cl-ink); }
.cl-mab-gallery__add { min-height: 0; aspect-ratio: 11 / 10; height: auto; } /* 사진(4:3) + 아래 버튼 줄 높이와 맞춤 */
.cl-mab-sns__text a { text-decoration: none; }
.cl-mab-sns__text a:hover { text-decoration: underline; text-underline-offset: 3px; }
.cl-mab-sns-title { margin: 0 0 8px; }`,
    markup: '문구 두 곳만: 소개 탭 저장 버튼 "소개 저장" → "저장", SNS 목록 위에 `<h2 class="cl-section-title cl-mab-sns-title">등록된 SNS <span class="cl-muted cl-num">{개수}</span></h2>`. 글자 수 900자 넘으면 `.cl-editor-count` 에 `is-near`. 나머지는 CSS.',
    dom: `const r=doc.querySelector('[data-about-setting]'); if(!r) return; const s=r.querySelector('[data-desc-submit]'); if(s) s.textContent='저장';
const ec=r.querySelector('[data-editor]'); const cnt=r.querySelector('.cl-editor-count'); if(ec&&cnt) ec.after(cnt);
const sn=r.querySelector('[data-sns]'); if(sn&&!r.querySelector('.cl-mab-sns-title')){const h=doc.createElement('h2'); h.className='cl-section-title cl-mab-sns-title'; h.innerHTML='등록된 SNS <span class="cl-muted cl-num">'+sn.querySelectorAll('li').length+'</span>'; sn.before(h);}`,
    note: '세 탭을 모두 눌러 보세요.',
    targets: ['[data-about-setting] .cl-editor-count', '.cl-mab-gallery', '.cl-mab-sns-title']
  },
  {
    id: 'H5', layer: '공통 부품', group: 9, status: '확정', kind: 'CSS', screens: ['about-setting', 'banner-setting', 'teacher-read', 'system-setting', 'main-setting', 'menu-setting', 'ip-setting'],
    title: '입력 칸 · 선택 버튼 아래 도움말 띄우기',
    current: '도움말(`cl-field__help`)이 바로 위 입력 칸 · 버튼 줄에 0px 로 붙는 곳이 있다 — SNS 링크 칸 아래 "http:// 또는 https:// 로 시작하는 200자 이하 주소", 이서당 배너 [사용][사용 안 함] 아래 "고르면 바로 적용됩니다.", 선생님 상세 담당 강좌 목록 아래 안내. `cl-field` 안에서는 사이 6px 이 있지만 `cl-field` 밖에 놓인 도움말은 여백이 없다',
    next: '입력 칸 · 입력 줄 · 선택 버튼 줄 · 목록 바로 다음에 오는 도움말은 위 6px(`cl-field` 안 간격과 같은 값). 제목 바로 아래 설명(4px)은 그대로',
    css: `:is(.cl-input, .cl-inline-fields, .cl-tcf-radios, .cl-mms-keyword-form, .cl-mt-courses, .cl-chips, ul, ol) + .cl-field__help { margin-top: 6px; }`,
    markup: 'CSS 한 줄. 디자인 시스템 Field 규칙에 "도움말은 바로 위 컨트롤과 6px" 로 적었다.',
    targets: [':is(.cl-input, .cl-inline-fields, .cl-tcf-radios, .cl-mt-courses) + .cl-field__help']
  },
  {
    id: 'H6', layer: '공통 틀', group: 1, status: '확정', kind: 'CSS', screens: ['teacher-edit', 'group-edit', 'about-setting', 'system-setting', 'teacher-create', 'course-create', 'course-edit', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit'],
    title: '입력 · 설정 화면은 본문 폭에 한계 (넓은 모니터)',
    current: '입력 화면마다 틀이 다르다 — 관리자 만들기 · 수정 · 메뉴 설정 · 허용 IP 는 좁은 틀(`cl-page`, 최대 880px)인데 선생님 수정 · 그룹 편집 · 학원 소개 설정 · 학원 설정은 넓은 틀(`cl-page--wide`, 끝까지). 1920px 화면에서 학원 소개 부제목 칸 1,550px, 학원 설정 푸터 문구 1,366px, 선생님 수정 칸 1,006px 까지 늘어난다',
    next: '화면 종류로 틀을 고른다. 목록 · 표 · 통계 · 대시보드 = 넓은 틀(가로 100%). 입력 · 설정 = 좁은 틀(최대 880px, 지금 있는 `cl-page` 값 그대로). 왼쪽 목차가 있는 학원 설정은 목차 폭만큼 더해 1,064px. 그림 카드가 여러 개 놓이는 메인페이지 설정 · 배너 설정은 넓은 틀 유지. 1280 · 1440 · 1920 에서 같은 모양',
    css: `.cl-scope :is([data-teacher-form], [data-group-edit], [data-about-setting]).cl-page--wide { max-width: 880px; }
.cl-scope [data-system-setting].cl-page--wide { max-width: 1064px; } /* 880 + 목차 160 + 사이 24 */`,
    markup: '네 화면 루트에서 `cl-page--wide` 를 지운다(학원 설정만 `cl-page cl-page--toc` 같은 이름으로 1,064px). 새 값은 없다 — 880px 은 기존 `cl-page` 최대 폭. 디자인 시스템 PageHead "화면 폭" 규칙과 같다.',
    note: '상단 [1920]으로 바꿔 [현재]와 비교해 보세요.',
    targets: ['.cl-page']
  },
  {
    id: 'H7', layer: '공통 틀', group: 9, status: '확정', kind: 'CSS', screens: ['all'],
    title: '넓은 화면: 본문 최대 1,680px(왼쪽 정렬) · 표 행 hover 바탕',
    current: '넓은 틀(`cl-page--wide`)은 화면 끝까지 늘어난다. 2560px 모니터에서 목록 표가 2,300px 넘게 퍼져, 왼쪽 이름과 오른쪽 메뉴 · 숫자가 같은 줄인지 눈으로 따라가기 어렵다. 행 hover 바탕은 #FAFAFB(직접 값)라 흰 바탕과 거의 구분되지 않는다',
    next: '넓은 틀 본문 최대 1,680px(1920 모니터에서 사이드바 240 을 뺀 폭 — 1920 이하 화면은 지금과 같다), 가운데로 옮기지 않고 왼쪽 정렬(사이드바 바로 옆에서 시작). 새 토큰 `cl-w-page-max: 1680px`. 표 행 hover 바탕은 `cl-hover`(#F4F4F6)로 한 단계 진하게 — 마우스를 올린 줄을 끝까지 따라갈 수 있게. 키보드로 행 안 버튼에 갔을 때(`:focus-within`)도 같은 바탕',
    css: `.cl-scope { --cl-w-page-max: 1680px; }
.cl-scope .cl-page--wide { max-width: var(--cl-w-page-max); }
.cl-table tbody tr:not(.is-selected):is(:hover, :focus-within) { background: var(--cl-hover); }
@media (hover: none) { .cl-table tbody tr:hover { background: transparent; } }`,
    markup: 'CSS 만(토큰 하나 추가). 고른 행(`cl-primary-tint`)은 hover 보다 우선 — 지금 규칙 순서 그대로.',
    note: '상단 [2560]으로 바꿔 [현재]와 비교해 보세요. 표에 마우스를 올리면 줄 바탕이 보입니다.',
    targets: []
  },
  {
    id: 'C10', group: 3, status: '확정', kind: '마크업', screens: ['courses', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg'],
    title: '강좌 관리 행 메뉴(⋯): 성격별 묶음 · 구분선',
    current: '8개 항목이 구분 없이 한 줄로 이어진다 — 강좌 관리 열기 · 강좌 수정 · 강의 수정 · 순서 · 강의 올리기(CMS) · 화상 강의 만들기 · 수강 관리 · 진도율 보기 · 학생 화면에서 보기. "강좌 수정"과 "강의 수정"이 붙어 있어 헷갈리고, 강의를 다루는 세 가지가 흩어져 있다',
    next: 'N1 규칙대로 성격별 묶음 + 구분선. 항목 · 링크 · 아이콘은 그대로, 순서만 바꾼다.\n[강좌 관리 열기][학생 화면에서 보기] ─ [강의 올리기 (CMS)][화상 강의 만들기][강의 수정 · 순서] ─ [수강 관리][진도율 보기] ─ [강좌 정보 수정]. "강좌 수정"만 "강좌 정보 수정"으로(강의 수정과 구분)',
    css: `.cl-menu__sep { height: 1px; margin: 4px 6px; background: var(--cl-grid-row); }`,
    markup: '`.cl-row-menu__panel` 항목 순서를 위처럼 바꾸고 묶음 사이에 `<div class="cl-menu__sep" role="separator"></div>`. 링크 주소는 지금 그대로(`/user/teacher/course/read · edit · content · learn · progress`, `/user/course/courseview`).',
    dom: `doc.querySelectorAll('.cl-row-menu__panel').forEach(p=>{ const it=[...p.querySelectorAll(':scope > .cl-menu__item')]; const f=t=>it.find(i=>i.textContent.trim().startsWith(t)); const order=[['강좌 관리 열기','학생 화면에서 보기'],['강의 올리기','화상 강의 만들기','강의 수정'],['수강 관리','진도율 보기'],['강좌 수정']];
 const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
 order.forEach((g,gi)=>{ if(gi) p.append(sep()); g.forEach(t=>{const e=f(t); if(e) p.append(e);}); });
 const ed=f('강좌 수정'); if(ed){ [...ed.childNodes].forEach(n=>{ if(n.nodeType===3&&n.textContent.includes('강좌 수정')) n.textContent=n.textContent.replace('강좌 수정','강좌 정보 수정'); }); } });
doc.querySelectorAll('.cl-row-menu__trigger').forEach(b=>{ if(b.classList.contains('lab-live')) return; b.classList.add('lab-live'); b.addEventListener('click',()=>{const p=b.nextElementSibling; p.hidden=!p.hidden; const r=b.getBoundingClientRect(); p.style.position='fixed'; p.style.top=(r.bottom+4)+'px'; p.style.left=(r.right-p.offsetWidth)+'px';}); });`,
    note: '⋯ 를 눌러 메뉴를 열어 보세요.',
    targets: ['.cl-row-menu__trigger']
  },
  {
    id: 'TP1', group: 4, status: '확정', kind: '마크업', screens: ['t-learn', 't-progress', 't-learn-excel'],
    title: '선생님: 수강 상태 이름 · 표시 하나로',
    current: '같은 학생의 같은 상태가 수강 관리에서는 "수강중", 진도율 관리에서는 "승인"이다. 둘 다 초록 알약 배지(`cl-badge--success`)라 정한 상태 표시 규칙(점 + 글자)과도 다르다',
    next: '상태 이름은 수강 관리 기준으로 통일: 수강중 · 대기 · 제외됨. 표시는 점 + 글자 — 수강중 ●초록(`cl-success`), 대기 ○주황(`cl-warning`), 제외됨 ●회색(`cl-ink-faint`). 글자는 `cl-ink` 14px',
    css: `:is([data-learn-manage], [data-progress-manage]) td .cl-badge { height: auto; padding: 0; background: none; color: var(--cl-ink); font-size: var(--cl-fs-ui); font-weight: 400; display: inline-flex; align-items: center; gap: 6px; }
:is([data-learn-manage], [data-progress-manage]) td .cl-badge::before { content: "●"; font-size: 10px; color: var(--cl-success); }
:is([data-learn-manage], [data-progress-manage]) td .cl-badge--warning::before { content: "○"; color: var(--cl-warning); }
:is([data-learn-manage], [data-progress-manage]) td .cl-badge--neutral::before { color: var(--cl-ink-faint); }`,
    markup: '진도율 관리 상태 칸의 "승인" → "수강중"(수강 관리와 같은 값 · 같은 함수). 대기 `cl-badge--warning`, 제외됨 `cl-badge--neutral`. 모양은 위 CSS.',
    dom: `doc.querySelectorAll('[data-progress-manage] .cl-tp-state .cl-badge').forEach(b=>{ if(b.textContent.trim()==='승인') b.textContent='수강중'; });`,
    targets: ['td .cl-badge']
  },
  {
    id: 'TP2', group: 6, status: '확정', kind: 'CSS', screens: ['t-learn', 't-progress', 't-learn-excel'],
    title: '선생님: 이름 옆 아이디 (Q4 규칙)',
    current: '수강 관리는 아이디가 이름 아래 줄(`cl-table__sub`), 진도율 관리는 이름 옆 12px `cl-muted`. 관리자 화면의 "홍길동 hong1" 규칙(Q4)과 다르다',
    next: '두 화면 모두 이름 옆 한 줄 "사혜인 sahyein1" — 아이디 `cl-ink-subtle` #6E6E73, 13px, 괄호 없이',
    css: `[data-learn-manage] td[data-primary] { white-space: nowrap; }
[data-learn-manage] td[data-primary] .cl-table__sub, [data-progress-manage] .cl-tp-who .cl-muted { display: inline; margin-left: 6px; color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }
[data-learn-manage] td[data-primary] strong { font-weight: 600; }
[data-progress-manage] .cl-tp-who { display: flex; flex-direction: row; align-items: baseline; gap: 0; white-space: nowrap; }`,
    targets: ['[data-learn-manage] td[data-primary]', '[data-progress-manage] .cl-tp-who']
  },
  {
    id: 'TP3', group: 9, status: '확정', kind: 'CSS', screens: ['t-progress'],
    title: '진도율 표: 긴 강의 제목은 두 줄까지',
    current: '강의 제목이 길면(영상 제목 70자 넘음) 표 머리 한 칸이 여러 줄로 늘어나 머리 줄 높이가 들쭉날쭉하다',
    next: '머리 칸 강의 제목은 최대 두 줄, 넘치면 말줄임(…). 전체 제목은 지금처럼 툴팁(`title`)',
    css: `.cl-tp-lecture { min-width: 140px; vertical-align: bottom; }
.cl-tp-lecture span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; max-width: 180px; font-weight: 400; color: var(--cl-ink-muted); }`,
    note: '1강 제목은 실험실 예시 값입니다.',
    targets: ['.cl-tp-lecture']
  },
  {
    id: 'TP4', group: 6, status: '확정', kind: '마크업', screens: ['t-info', 't-qr-dlg'],
    title: '나의 정보: 머리 중복 · 표기 통일',
    current: '상위 메뉴 "나의 정보"와 제목 "나의 정보"가 같은 말을 두 번. 사진 옆 "ID : dkjang"(콜론 · 띄어쓰기)이 바로 아래 계정 상자의 아이디와 겹친다. 버튼 "사진 변경"(다른 화면은 "사진 바꾸기")',
    next: '제목과 같은 상위 메뉴는 빼고 제목만. [QR코드 보기][정보 수정]은 PageHead 규칙대로 제목 줄 오른쪽(지금은 제목 아래 왼쪽). 사진 옆은 Q4 규칙 "장현석 선생님 dkjang"(아이디 13px `cl-ink-subtle`). 버튼 "사진 바꾸기"',
    css: `[data-teacher-info] .cl-profile-head__text .cl-page__meta { color: var(--cl-ink-subtle, #6E6E73); font-size: var(--cl-fs-caption); }
[data-teacher-info] > .cl-page__head { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px; }
[data-teacher-info] > .cl-page__head > .cl-page__actions { margin-left: auto; display: flex; gap: 8px; }`,
    markup: '상위 메뉴가 제목과 같을 때는 `cl-page__parent` 를 출력하지 않는다. "ID : {아이디}" → "{아이디}". 버튼 문구.',
    dom: `const r=doc.querySelector('[data-teacher-info]'); if(!r) return; const p=r.querySelector('.cl-page__parent'), t=r.querySelector('.cl-page__title'); if(p&&t&&p.textContent.trim()===t.textContent.trim()) p.remove();
const m=r.querySelector('.cl-profile-head__text .cl-page__meta'); if(m) m.textContent=m.textContent.replace(/^ID\\s*:\\s*/,'');
const b=r.querySelector('[data-photo-change]'); if(b) b.lastChild.textContent='사진 바꾸기';`,
    targets: ['[data-teacher-info] .cl-page__head', '[data-photo-change]']
  },
  {
    id: 'TP5', group: 3, status: '확정', kind: '마크업', screens: ['t-password'],
    title: '비밀번호 변경: 현재 비밀번호에도 [보기]',
    current: '새 비밀번호 · 확인 칸에는 눈 모양 [보기]가 있는데 현재 비밀번호 칸에만 없다',
    next: '세 칸 모두 같은 [보기] 버튼(`cl-input-group__btn`, `aria-label="현재 비밀번호 보기"`). 비밀번호 규칙(4자 이상)은 그대로',
    markup: '현재 비밀번호 `.cl-input-group` 에 새 비밀번호와 같은 버튼을 넣는다(같은 `data-visible-toggle` 동작).',
    dom: `const g=doc.querySelector('#pw-old'); const src=doc.querySelector('[data-teacher-password] .cl-input-group__btn'); if(g&&src&&!g.nextElementSibling){const b=src.cloneNode(true); b.setAttribute('aria-label','현재 비밀번호 보기'); g.after(b);}`,
    targets: ['#pw-old']
  },
  {
    id: 'S7', group: 5, status: '확정', kind: 'CSS', screens: ['alarm'],
    title: '알림 보내기: 모바일에서 화면이 옆으로 밀림',
    current: '390px 화면에서도 "알림 내용" 칸(320px)과 받는 사람 칸이 2단 그대로라 화면 오른쪽 밖(약 500px)까지 나가고, 화면 전체가 옆으로 밀린다. 지금 사이트에도 있는 문제',
    next: '900px 이하에서는 1단(알림 내용 → 받는 사람 순서로 위아래). 받는 사람 전환은 한 줄 전체 폭을 세 칸으로 나누고, 검색 칸은 다음 줄로',
    css: `@media (max-width: 900px) { [data-alarm-manage] .cl-ma-layout { grid-template-columns: minmax(0, 1fr); } [data-alarm-manage] .cl-ma-users .cl-toolbar { flex-wrap: wrap; } [data-alarm-manage] .cl-segmented { display: flex; width: 100%; } [data-alarm-manage] .cl-segmented__item { flex: 1 1 0; min-width: 0; } }`,
    targets: ['[data-alarm-manage] .cl-segmented']
  },
  {
    id: 'C11', group: 3, status: '확정', kind: '마크업', screens: ['students'],
    title: '학생 행 메뉴(⋯): 성격별 묶음 · 이름 정리',
    current: '수강목록 · 가입 신청서 · 그룹 · 학생 통계 4개가 구분 없이 이어진다. "수강목록"만 붙여 쓰고, 보기(수강 · 통계)와 정보(신청서 · 그룹)가 섞여 있다',
    next: 'N1 · C10 규칙대로 성격별 묶음 + 구분선. 링크 · 동작 · 아이콘은 그대로, 순서와 이름만.\n[수강 목록][학생 통계] ─ [가입 신청서][소속 그룹]. "수강목록" → "수강 목록", "그룹" → "소속 그룹"(무엇의 그룹인지)',
    css: `.cl-menu__sep { height: 1px; margin: 4px 6px; background: var(--cl-grid-row); }`,
    markup: '학생 목록 `.cl-row-menu__panel` 항목 순서를 위처럼 바꾸고 묶음 사이에 `<div class="cl-menu__sep" role="separator"></div>`. 문구 두 곳. 삭제 · 탈퇴 같은 위험 동작이 생기면 맨 아래 구분선 뒤 빨간색(N1).',
    dom: `doc.querySelectorAll('[data-member-list] .cl-row-menu__panel, .cl-mu-table .cl-row-menu__panel').forEach(p=>{ if(p.querySelector('.cl-menu__sep')) return; const it=[...p.querySelectorAll(':scope > .cl-menu__item')]; const f=t=>it.find(i=>i.textContent.trim().replace(/\\s/g,'').startsWith(t)); const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
 const A=[f('수강목록'),f('학생통계')].filter(Boolean), B=[f('가입신청서'),f('그룹')].filter(Boolean); const rest=it.filter(i=>!A.includes(i)&&!B.includes(i));
 A.forEach(e=>p.append(e)); if(B.length){p.append(sep()); B.forEach(e=>p.append(e));} if(rest.length){p.append(sep()); rest.forEach(e=>p.append(e));}
 [[f('수강목록'),'수강목록','수강 목록'],[f('그룹'),'그룹','소속 그룹']].forEach(([e,a,b])=>{ if(e) [...e.childNodes].forEach(n=>{ if(n.nodeType===3&&n.textContent.trim()===a) n.textContent=b; }); }); });
doc.querySelectorAll('.cl-mu-table .cl-row-menu__trigger').forEach(b=>{ if(b.classList.contains('lab-live')) return; b.classList.add('lab-live'); b.addEventListener('click',()=>{const p=b.nextElementSibling; doc.querySelectorAll('.cl-row-menu__panel').forEach(x=>x!==p&&(x.hidden=true)); p.hidden=!p.hidden; const r=b.getBoundingClientRect(); p.style.position='fixed'; p.style.top=(r.bottom+4)+'px'; p.style.left=(r.right-p.offsetWidth)+'px';}); });`,
    note: '⋯ 를 눌러 메뉴를 열어 보세요.',
    targets: ['.cl-mu-table .cl-row-menu__trigger']
  },
  {
    id: 'TN1', group: 3, status: '확정', kind: '마크업', screens: ['courses','t-learn','t-progress','t-group','t-assign','t-info','t-password', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page'],
    title: '선생님 메뉴: "나의 시험" 묶음 추가',
    current: '왼쪽 메뉴에 나의 강좌 · 나의 정보 두 묶음만 있다',
    next: '나의 강좌 아래에 "나의 시험" 묶음을 같은 모양으로 추가.\n묶음 머리 아이콘 clipboard-check, 항목은 [시험 관리] · [시험지 보관함]. 접기 · 펼치기와 모양은 나의 강좌와 같게.\n\n⚠ 개발 전달: 시험 기능은 나중에 들어옵니다. 지금은 메뉴 자리만 잡아 두고, 두 항목 이름 뒤에 캡션 (준비중) 을 붙여 누를 수 없게 둡니다.\n· 캡션: `.cl-ws-nav__soon`, 캡션 크기(13px), `cl-ink-faint`. 이름과 같은 줄, 이름 뒤 6px.\n· 두 항목은 `<a href>` 가 아니라 `<span>` 으로 두거나, `aria-disabled="true"` + `tabindex="-1"` + 클릭 막기. 글자는 `cl-ink-muted`.\n· 기능이 열리면 캡션과 `aria-disabled` 를 지우고 실제 주소를 연결하면 끝입니다. 묶음 · 아이콘 · 순서는 그대로 쓰면 됩니다.\n· 묶음 머리(나의 시험)는 접기 · 펼치기 그대로 둡니다. 준비중은 항목에만 붙입니다.',
    markup: '나의 강좌 `.cl-ws-nav__group` 바로 뒤에 같은 구조의 묶음을 하나 더 둔다. 제목 "나의 시험", 항목 2개. 항목은 링크 대신 `aria-disabled="true"` 로 두고 이름 뒤에 `<span class="cl-ws-nav__soon">(준비중)</span>`.',
    css: `.cl-ws-nav__soon { margin-left: 6px; font-size: var(--cl-fs-caption); font-weight: 400; color: var(--cl-ink-faint); }
[data-lab-exam] .cl-ws-nav__item[aria-disabled="true"] { color: var(--cl-ink-muted); cursor: default; }
[data-lab-exam] .cl-ws-nav__item[aria-disabled="true"]:hover { background: transparent; }`,
    dom: `const g=[...doc.querySelectorAll('.cl-ws-nav__group')].find(x=>x.textContent.includes('강좌 관리')); if(g&&!doc.querySelector('[data-lab-exam]')){ const n=g.cloneNode(true); n.setAttribute('data-lab-exam',''); n.querySelectorAll('[id]').forEach(e=>e.id+='-exam'); n.querySelectorAll('[aria-controls]').forEach(e=>e.setAttribute('aria-controls',e.getAttribute('aria-controls')+'-exam'));
 const walk=(el,from,to)=>{ const w=doc.createTreeWalker(el,4); let t; while(t=w.nextNode()) if(t.textContent.includes(from)) { t.textContent=t.textContent.replace(from,to); return true; } };
 walk(n,'나의 강좌','나의 시험'); const hs=n.querySelector('svg'); if(hs) hs.innerHTML='<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>';
 const items=[...n.querySelectorAll('.cl-ws-nav__item')]; const it0=items[0]; items.slice(2).forEach(e=>e.remove()); items.slice(0,2).forEach((e,i)=>{ e.removeAttribute('aria-current'); const label=['시험 관리','시험지 보관함'][i]; const tn=[...e.childNodes].filter(c=>c.nodeType===3&&c.textContent.trim()).pop(); if(tn) tn.textContent=label; else e.textContent=label;
  e.setAttribute('aria-disabled','true'); e.setAttribute('tabindex','-1'); e.removeAttribute('href'); e.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();},true);
  const sp=doc.createElement('span'); sp.className='cl-ws-nav__soon'; sp.textContent='(준비중)'; e.append(sp); });
 g.after(n); }`,
    targets: ['[data-lab-exam]']
  },
  {
    id: 'TN2', group: 3, status: '확정', kind: '마크업', screens: ['courses','t-learn','t-progress','t-group','t-assign','t-info','t-password', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page'],
    title: '선생님 상단 드롭다운: [새로 만들기] · 프로필 메뉴 묶음 정리',
    current: '[새로 만들기] 6개, 프로필 6개가 구분 없이 이어진다. "강좌 생성"만 "만들기"가 아니고, 성격이 다른 줄이 한 덩어리로 이어져 어디까지가 한 묶음인지 보이지 않는다',
    next: 'N1 규칙대로 성격별 묶음 + 구분선. 링크 · 동작 · 아이콘은 그대로.\n[새로 만들기] 강좌 만들기 · 강의 올리기 (CMS) · 화상 강의 만들기 ─ 과제 만들기 · 시험 만들기 · 그룹 만들기 ─ 썸네일 만들기\n[프로필] 이름 · 아이디 ─ 홈페이지 · 사이트 관리 · 나의 QR코드 ─ 이용 매뉴얼 · 고객센터 ─ 로그아웃(맨 아래, 빨간색 아님)\n미리보기에서 두 버튼을 누르면 열린다',
    css: `/* 구분선은 공통 틀(base.css)의 .cl-menu__sep 를 그대로 쓴다 — G5 참고 */`,
    markup: '각 `.cl-popover__panel.cl-menu` 의 항목 순서를 위처럼 바꾸고 묶음 사이에 `<div class="cl-menu__sep" role="separator"></div>`. "강좌 생성" → "강좌 만들기". "시험 만들기"(아이콘 file-check)를 과제 만들기 다음에 추가. 시험 기능이 아직 없으므로 TN1 과 같이 캡션 (준비중) 을 붙여 누를 수 없게 둔다 — 기능이 열리면 캡션을 지우고 시험 만들기 화면으로 연결.',
    dom: `const sep=()=>{const d=doc.createElement('div');d.className='cl-menu__sep';d.setAttribute('role','separator');return d;};
 const order=(p,groups)=>{ if(p.dataset.labSorted) return; p.dataset.labSorted=1; const it=[...p.querySelectorAll(':scope > .cl-menu__item')]; const f=t=>it.find(i=>i.textContent.replace(/\\s/g,'').startsWith(t.replace(/\\s/g,''))); const used=[]; groups.forEach((g,gi)=>{ const els=g.map(f).filter(Boolean); if(!els.length) return; if(gi||p.querySelector('.cl-menu__head')) p.append(sep()); els.forEach(e=>{p.append(e);used.push(e);}); }); it.filter(i=>!used.includes(i)).forEach(e=>p.append(e)); };
 doc.querySelectorAll('.cl-ws-topbar .cl-popover__panel.cl-menu').forEach(p=>{
  if(p.querySelector('.cl-menu__head')) order(p,[['홈페이지','사이트 관리','나의 QR코드'],['이용 매뉴얼','고객센터'],['로그아웃']]);
  else { const as=[...p.querySelectorAll(':scope > .cl-menu__item')].find(i=>i.textContent.includes('과제 만들기')); if(as&&!p.querySelector('[data-lab-exam-new]')){ const c=as.cloneNode(true); c.setAttribute('data-lab-exam-new',''); const sv=c.querySelector('svg'); if(sv) sv.innerHTML='<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/>'; [...c.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).forEach(n=>n.textContent='시험 만들기'); c.setAttribute('aria-disabled','true'); c.setAttribute('tabindex','-1'); c.removeAttribute('href'); const sn=doc.createElement('span'); sn.className='cl-ws-nav__soon'; sn.textContent='(준비중)'; c.append(sn); as.after(c); } order(p,[[(p.textContent.includes('강좌 생성')?'강좌 생성':'강좌 만들기'),'강의 올리기','화상 강의'],['과제 만들기','시험 만들기','그룹 만들기'],['썸네일']]); p.querySelectorAll('.cl-menu__item').forEach(a=>{ for(const n of a.childNodes) if(n.nodeType===3&&n.textContent.includes('강좌 생성')) n.textContent=n.textContent.replace('강좌 생성','강좌 만들기'); }); }
 });
 doc.querySelectorAll('.cl-ws-topbar .cl-popover').forEach(pop=>{ const t=pop.querySelector('[data-popover-trigger]'), p=pop.querySelector('.cl-menu'); if(!t||!p) return; t.classList.add('lab-live'); t.addEventListener('click',e=>{ e.preventDefault(); e.stopPropagation(); const open=p.hidden; doc.querySelectorAll('.cl-ws-topbar .cl-menu').forEach(x=>x.hidden=true); p.hidden=!open; t.setAttribute('aria-expanded',String(open)); },true); });
 doc.addEventListener('click',e=>{ if(!e.target.closest('.cl-popover')) doc.querySelectorAll('.cl-ws-topbar .cl-menu').forEach(x=>x.hidden=true); });`,
    targets: ['.cl-ws-topbar [data-popover-trigger]']
  },
  {
    id: 'FM1', group: 3, status: '확정', kind: 'CSS', screens: ['teacher-create','teacher-edit','system-setting'],
    title: '두 칸 입력 줄: 위아래 칸 사이 간격 · 아이디 안내 한 줄로',
    current: '아이디 · 비밀번호 / 이름 · 휴대폰이 2칸 2줄인데 줄 사이 간격이 0이라, 아이디 안내 글자(두 줄)가 아래 "이름" 제목에 붙는다. 다른 칸 사이는 20px',
    next: '`.cl-mtf-row` 줄 사이 20px(섹션 안 다른 칸과 같은 값). 아이디 안내를 한 줄로 줄임: "영문 소문자로 시작, 5자 이상 (소문자 · 숫자 · - · _)". 규칙 자체는 그대로',
    css: `.cl-mtf-row { row-gap: 20px; }`,
    markup: '선생님 만들기 화면의 아이디 `.cl-field__help` 문구만 바꾼다.',
    dom: `const h=doc.querySelector('[data-mode="create"] #mtf-id ~ .cl-field__help'); if(h) h.textContent='영문 소문자로 시작, 5자 이상 (소문자 · 숫자 · - · _)';`,
    targets: ['.cl-mtf-row']
  },
  {
    id: 'FM2', group: 3, status: '확정', kind: 'CSS', screens: ['course-create','course-edit', 't-course-create', 't-course-edit', 't-assign-create'],
    title: '강좌 · 과제 만들기: 선택 칸(커리큘럼 · 분류 · 과목 · 강좌)을 칸 폭에 맞춤',
    current: '수강 설정 카드의 선택 칸 4개(커리큘럼 · 대분류 · 상세분류 · 과목)가 약 130px 로 좁아 "커리큘럼을 선택해..."처럼 안내 글자가 잘린다',
    next: '선택 칸을 카드 안 폭 전체로(위 라디오 묶음과 같은 왼쪽 · 오른쪽 끝). 안내 글자 그대로',
    css: `:is([data-course-form], [data-assign-form]) .cl-field > .cl-selectbox { display: block; width: 100%; } :is([data-course-form], [data-assign-form]) .cl-field > .cl-selectbox .cl-selectbox__control { width: 100%; max-width: none; }`,
    targets: ['[data-course-form] .cl-selectbox']
  },
  {
    id: 'FM3', group: 6, status: '확정', kind: '문구', screens: ['group-create-dlg','subject-create-dlg','notice-create-dlg', 't-group-create-dlg', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg'],
    title: '만들기 창 3개: 이름 · 필수 표시 · 오류 자리 통일',
    current: '그룹 생성 · 과목 추가 창의 제목과 버튼이 "생성" · "추가"로 제각각이다(목록 버튼은 이미 "만들기"). 꼭 넣어야 하는 이름 · 제목 칸에 * 표시가 없고, 공지사항 창은 오류 문구가 칸 아래가 아니라 폼 맨 아래 한 곳에 뜬다',
    next: '제목 · 버튼: "그룹 만들기" / "과목 만들기" (공지사항은 글을 올리는 것이라 "등록" 그대로). 그룹 이름 · 과목 이름 · 공지 제목 · 공지 내용 라벨에 빨간 *(`cl-req`). 공지사항 오류는 해당 칸 아래 `cl-field__error` 로(제목 비었음 → 제목 아래, 내용 비었음 → 글자 수 아래). 서버 오류만 창 위쪽 배너.\n아래 [취소][만들기] 줄은 창 바닥 전체 폭(구분선이 양끝까지), 입력 칸 · 선택 칸은 창 안 폭 전체(강의 올리기 · 화상 강의 만들기의 강좌 선택 포함)',
    markup: '각 창의 `.cl-dialog__title` 과 submit 버튼 글자, 필수 라벨에 `<span class="cl-req" aria-hidden="true">*</span>`. 공지사항 폼 끝의 `<p class="cl-field__error">` 를 지우고 칸마다 하나씩.',
    css: `.cl-dialog--modal .cl-dialog__body > form > .cl-dialog__actions { margin: 20px -20px -20px; } .cl-dialog .cl-field { max-width: none; } .cl-dialog .cl-field > .cl-selectbox { display: block; width: 100%; } .cl-dialog .cl-field > .cl-selectbox .cl-selectbox__control { width: 100%; max-width: none; }`,
    dom: `const t=doc.querySelector('.cl-dialog__title'), sb=doc.querySelector('.cl-dialog [type=submit]'); const map={'그룹 생성':'그룹 만들기','과목 추가':'과목 만들기'}; if(t&&map[t.textContent]){ t.textContent=map[t.textContent]; if(sb) sb.textContent='만들기'; }
 doc.querySelectorAll('.cl-dialog .cl-field__label').forEach(l=>{ if(!l.querySelector('.cl-req')&&/^(그룹 이름|과목 이름|제목|내용)$/.test(l.textContent.trim())&&/그룹|과목|공지/.test((doc.querySelector('.cl-dialog__title')||{}).textContent||'')){ const r=doc.createElement('span'); r.className='cl-req'; r.setAttribute('aria-hidden','true'); r.textContent='*'; l.append(' ',r); } });
 const loose=doc.querySelector('.cl-dialog form > .cl-field__error'); if(loose){ loose.remove(); const ti=doc.querySelector('#mb-title'); if(ti){ const e=doc.createElement('p'); e.className='cl-field__error'; e.hidden=true; e.textContent='제목을 입력해주세요.'; ti.after(e); } const c=doc.querySelector('.cl-dialog .cl-editor-count'); if(c){ const e=doc.createElement('p'); e.className='cl-field__error'; e.hidden=true; e.textContent='내용을 입력해주세요.'; c.after(e); } }`,
    targets: ['.cl-dialog__title', '.cl-dialog [type=submit]']
  },
  {
    id: 'TC1', group: 3, status: '확정', kind: '마크업', screens: ['t-cms-page'],
    title: '선생님 강의 올리기: 행 메뉴 묶음 · 삭제 빨강 · 소셜미디어 용량 "—"',
    current: '콘텐츠 행 ⋯ 메뉴 7개가 구분 없이 이어지고 맨 아래 "삭제"도 다른 항목과 같은 검정이다. 소셜미디어 영상은 파일이 없어 용량이 "0 B" 로 보인다',
    next: 'N1 규칙대로 성격별 묶음 + 구분선: [정보 · 수정][공개설정][폴더 옮기기] ─ [강좌 · 강의 조회][내려받기][공유 링크 복사] ─ [삭제(빨강)]. 항목 · 동작 · 아이콘은 그대로.\n용량이 없는 콘텐츠(소셜미디어)는 "0 B" 대신 "—"(값 없음 규칙)',
    markup: '`[data-teacher-cms] .cl-row-menu__panel` 항목 순서와 `<div class="cl-menu__sep" role="separator"></div>`, 삭제에 `cl-menu__item--danger`. 용량 칸은 소셜미디어일 때 "—".',
    css: `.cl-menu__sep { height: 1px; margin: 4px 6px; background: var(--cl-grid-row); } [data-teacher-cms] .cl-row-menu__panel .cl-menu__item--danger { color: var(--cl-danger); }`,
    dom: `doc.querySelectorAll('[data-teacher-cms] .cl-row-menu__panel').forEach(p=>{ if(p.querySelector('.cl-menu__sep')) return; const it=[...p.querySelectorAll(':scope > .cl-menu__item')]; const f=t=>it.find(i=>i.textContent.replace(/\\s/g,'').startsWith(t.replace(/\\s/g,''))); const sep=()=>{const d=doc.createElement('div');d.className='cl-menu__sep';d.setAttribute('role','separator');return d;}; [['정보 · 수정','공개설정','폴더 옮기기'],['강좌 · 강의 조회','내려받기','공유 링크 복사'],['삭제']].forEach((g,gi)=>{ if(gi) p.append(sep()); g.forEach(t=>{const e=f(t); if(e) p.append(e);}); }); const d=f('삭제'); if(d) d.classList.add('cl-menu__item--danger'); });
 doc.querySelectorAll('[data-teacher-cms] .cl-cms-item__meta').forEach(m=>{ const sp=[...m.querySelectorAll('span')]; if(sp[0]&&sp[0].textContent.trim()==='소셜미디어'){ const z=sp.find(s=>/^0\\s?B$/.test(s.textContent.trim())); if(z) z.textContent='—'; } });`,
    targets: ['[data-teacher-cms] .cl-cms-item__meta']
  },
  /* ───── 학생 · 내 강의실 (2026-10-22 학원 페이지 로그인 후 화면 · student.css) ───── */
  {
    id: 'SL1', group: 7, status: '확정', kind: '토큰', layer: '토큰', screens: ['s-learn'],
    title: '학생: student.css 직접 색 · 크기를 토큰으로 (화면 변화 거의 없음)',
    current: '`student.css` 에 색 5곳 직접 값(`#fff` 2 · `#C7C7CC` · `#E5E5EA`), 반경 16px, 선생님 카드 이름 15px. 나머지 23곳은 이미 `var(--cl-…)`',
    next: '`#fff` → `cl-on-ink`. 새 토큰 `cl-on-ink-2` #E5E5EA · `cl-on-ink-muted` #C7C7CC (진한 바탕 위 글자 3단계 — 본문 글자 `ink` · `ink-2` · `ink-muted` 와 같은 짜임). 반경 16px → `cl-radius-lg` 12px, 15px → `cl-fs-section-title` 16px',
    css: `.cl-scope {
  --cl-on-ink-2: #E5E5EA;       /* 진한 바탕 위 둘째 글자 — 이어보기 강의 이름 (#1D1D1F 위 15.1:1) */
  --cl-on-ink-muted: #C7C7CC;   /* 진한 바탕 위 보조 글자 — 이어보기 머리 줄 (#1D1D1F 위 11.4:1) */
}
.cl-hero { border-radius: var(--cl-radius-lg); color: var(--cl-on-ink); }
.cl-hero__eyebrow { color: var(--cl-on-ink-muted); }
.cl-hero__title { color: var(--cl-on-ink); }
.cl-hero__lecture { color: var(--cl-on-ink-2); }
.cl-teacher-card__name { font-size: var(--cl-fs-section-title); }`,
    targets: [],
    note: '관리자 · 선생님 CSS 에 한 T1 과 같은 정리다. 이 화면은 public.css 가 아니라 student.css 를 불러온다(직접 색 5곳). 이어보기 카드 반경만 16 → 12px 로 바뀐다. SL5 를 확정하면 `cl-on-ink-2` · `cl-on-ink-muted` 는 쓰는 곳이 없어지므로 그때 지운다.'
  },
  {
    id: 'SL2', group: 7, status: '확정', kind: 'CSS', layer: '토큰', screens: ['s-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '학생 다크모드: 올린 이미지 칸은 밝은 바탕으로 고정',
    current: '썸네일 칸 바탕이 `cl-hover` 라 다크에서 어두워진다. 학원이 올린 밝은 썸네일 · 로고가 어두운 칸 위에 떠 보인다',
    next: '새 토큰 `cl-media-bg` #F4F4F6 — 다크에서도 같은 값. 강좌 썸네일 · 카드 썸네일 · 학원 로고 · 선생님 사진 칸 바탕에 쓴다. 다크에서는 칸 둘레에 1px 선을 더해 밝은 판이 어두운 바탕과 붙어 보이게 한다',
    css: `.cl-scope { --cl-media-bg: #F4F4F6; }   /* 올린 이미지 칸 바탕. 다크에서도 뒤집지 않는다 */
.cl-row__thumb, .cl-card-item__thumb, .cl-ws-brand__logo, img.cl-teacher-card__photo { background: var(--cl-media-bg); }
html[data-theme="dark"] .cl-scope :is(.cl-row__thumb, .cl-card-item__thumb) { box-shadow: 0 0 0 1px var(--cl-hairline); }`,
    targets: ['.cl-row__thumb'],
    note: '적용 범위 장의 규칙(이미지 칸은 뒤집지 않는다)을 그대로 옮겼다. 실험실 썸네일은 회색 네모(예시)다.'
  },
  {
    id: 'SL3', group: 7, status: '제안', kind: '마크업', layer: '공통 부품', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '화면 테마 고르기: 기기 설정 · 라이트 · 다크 (계정 메뉴)',
    current: '테마를 고르는 곳이 없다. 다크 토큰은 `html[data-theme="dark"]` 일 때만 켜진다',
    next: '관리자 · 선생님 · 학생 모두 오른쪽 위 계정 메뉴의 이름 아래에 "화면 테마" 줄 — [기기 설정][라이트][다크] 보기 전환(`cl-segmented`). 처음은 기기 설정(`prefers-color-scheme`)을 따르고, 고르면 이 브라우저에 기억한다',
    css: `.cl-theme-pick { padding: 2px 10px 8px; display: flex; flex-direction: column; gap: 6px; }
.cl-theme-pick__label { font-size: var(--cl-fs-micro); font-weight: 500; color: var(--cl-ink-muted); }
.cl-theme-pick .cl-segmented { width: 100%; }
.cl-theme-pick .cl-segmented__item { flex: 1; width: auto; padding: 0 8px; font-size: var(--cl-fs-caption); font-weight: 600; white-space: nowrap; }`,
    markup: '계정 메뉴(`.cl-ws-account` 의 `.cl-menu`) `.cl-menu__head` 바로 아래에 `<div class="cl-theme-pick" role="group" aria-label="화면 테마"><span class="cl-theme-pick__label">화면 테마</span><div class="cl-segmented"><button class="cl-segmented__item" aria-pressed data-theme-pick="system">기기 설정</button>…light 라이트…dark 다크</div></div>` 를 넣는다. 고른 값은 localStorage `cl.theme`(system · light · dark). `<head>` 맨 앞 짧은 스크립트가 첫 화면을 그리기 전에 `<html data-theme>` 를 정한다: 저장값이 light · dark 면 그 값, 아니면 `matchMedia("(prefers-color-scheme: dark)")` 결과. system 일 때는 그 matchMedia 의 change 를 듣고 바로 바꾼다. `meta[name=theme-color]` 도 다크에서는 #1C1C1E 로 바꾼다. 로그인 없이 쓰는 화면(학원 메인 · 소개)은 지금 다크모드 대상이 아니므로 이 스크립트만 공통으로 두고 고르는 칸은 작업공간 계정 메뉴에만 둔다.',
    dom: `const menu=doc.querySelector('.cl-ws-account + .cl-menu'), head=menu&&menu.querySelector('.cl-menu__head'); if(!head) return;
const cur=doc.documentElement.getAttribute('data-theme')||'light';
const box=doc.createElement('div'); box.className='cl-theme-pick'; box.setAttribute('role','group'); box.setAttribute('aria-label','화면 테마');
box.innerHTML='<span class="cl-theme-pick__label">화면 테마</span><div class="cl-segmented">'+[['system','기기 설정'],['light','라이트'],['dark','다크']].map(([v,t])=>'<button type="button" class="cl-segmented__item lab-live" data-theme-pick="'+v+'" aria-pressed="'+(v===cur)+'">'+t+'</button>').join('')+'</div>';
head.after(box);
box.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); box.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
  const v=b.dataset.themePick==='system'?(doc.defaultView.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):b.dataset.themePick; doc.documentElement.setAttribute('data-theme',v);}));
const acc=doc.querySelector('.cl-ws-account'); acc.classList.add('lab-live');
if(!acc.dataset.labAcc){acc.dataset.labAcc='1';
  acc.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); menu.hidden=!menu.hidden; acc.setAttribute('aria-expanded',String(!menu.hidden));});}`,
    targets: ['.cl-ws-account'],
    note: '실험실에서는 오른쪽 위 계정 버튼을 누르면 메뉴가 열리고, 테마 칸을 누르면 이 미리보기 안에서만 바뀐다(위 라이트 · 다크 버튼과 따로 논다). 관리자 · 선생님 계정 메뉴도 머리(이름 · 아이디) + 홈페이지 · 이용 매뉴얼 · 고객센터 · 로그아웃 으로 학생과 같은 구조라, 세 역할 모두 같은 자리에 들어간다.'
  },
  {
    id: 'SL4', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-learn', 's-learn-many'],
    title: '학생 수강중인 강좌: 화면 머리를 목록 화면 틀에 맞추기',
    current: '상위 메뉴 없음. 제목 아래 "4개 강좌"가 설명 자리에 있다. 버튼 이름 "전체강좌 보기"',
    next: '상위 메뉴 "나의 강좌" → 제목 + [전체 강좌 보기] → 설명 한 줄 → 도구 줄: 과목 칩(왼쪽) · 보기 전환 · "강좌 4개"(오른쪽). 관리자 · 선생님 목록과 같은 순서',
    css: `@media (max-width: 900px) { .cl-toolbar > .cl-toolbar__count { display: none; } }   /* 모바일: 과목 칩 "전체 4" 가 같은 숫자를 보여 준다 */`,
    markup: '제목 위에 `<p class="cl-page__parent">나의 강좌</p>`. `[data-course-count]` 는 머리에서 빼서 도구 줄 보기 전환 다음에 `<span class="cl-muted cl-num cl-toolbar__count">강좌 4개</span>` 로 둔다(900px 이하에서는 숨긴다)(선생님 목록의 "선생님 25명"과 같은 자리 · 같은 말 순서). 머리 아래 `<p class="cl-page__meta">강좌를 누르면 강의 목록과 내 진도를 볼 수 있습니다.</p>`. 버튼 글자 "전체 강좌 보기"(띄어쓰기).',
    dom: `const h=doc.querySelector('.cl-page__head'), t=h&&h.querySelector('.cl-page__title'); if(!t) return;
const cnt=h.querySelector('[data-course-count]'); const n=(cnt&&cnt.textContent.match(/\\d+/)||['0'])[0];
const par=doc.createElement('p'); par.className='cl-page__parent'; par.textContent='나의 강좌'; t.before(par); if(cnt) cnt.remove();
const m=doc.createElement('p'); m.className='cl-page__meta'; m.textContent='강좌를 누르면 강의 목록과 내 진도를 볼 수 있습니다.'; h.after(m);
const tb=doc.querySelector('.cl-toolbar'); if(tb){const c=doc.createElement('span'); c.className='cl-muted cl-num cl-toolbar__count'; c.style.marginLeft='4px'; c.textContent='강좌 '+n+'개'; tb.append(c);}
const b=h.querySelector('.cl-page__actions .cl-btn'); if(b) b.lastChild.textContent='전체 강좌 보기';`,
    targets: ['.cl-page__parent', '.cl-page__head + .cl-page__meta', '.cl-toolbar__count'],
    note: '1장 "화면 머리 틀" 순서를 따른다. 설명 문구는 제안이다.'
  },
  {
    id: 'SL5', group: 3, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-learn', 's-learn-many'],
    title: '이어보기 카드: 검은 판 → 작업공간 카드 + 진도 막대',
    current: '먹색 바탕(`cl-surface-dark`) 흰 글자 큰 판, 반경 16px, 진도는 "진도 35% · 12강 중 4강 완료" 보라 글자. 관리자 · 선생님 화면에는 이런 판이 없고, 다크에서는 회색 판(#3A3A3D)이 된다',
    next: '흰 카드(`cl-canvas` · `cl-hairline` 1px · `cl-radius-md`), 머리 줄 `cl-ink-muted`, 강좌 이름 18px 700, 강의 줄 `cl-ink-2`, 진도는 막대(`cl-progress`) + "12강 중 4강 완료"(`cl-ink-muted`). 담는 내용 · 순서 · [이어보기] 동작은 그대로',
    css: `.cl-hero { margin-bottom: 0; padding: var(--cl-space-5); border-radius: var(--cl-radius-md); background: var(--cl-canvas); color: var(--cl-ink); box-shadow: 0 0 0 1px var(--cl-hairline); }
.cl-hero__eyebrow { color: var(--cl-ink-muted); }
.cl-hero__title { color: var(--cl-ink); font-size: 18px; }
.cl-hero__title:hover { color: var(--cl-primary-pressed); }
.cl-hero__lecture { color: var(--cl-ink-2); }
.cl-hero__progress { display: flex; align-items: center; gap: var(--cl-space-3); max-width: 420px; margin-top: 4px; font-size: inherit; font-weight: inherit; color: inherit; }
.cl-hero__progress .cl-progress { flex: 1; }
.cl-hero__count { font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); white-space: nowrap; }`,
    markup: '`renderHero` 의 `.cl-hero__progress` 글자("진도 35% · 12강 중 4강 완료")를 강좌 행과 같은 `cl-progress`(막대 + 값) 와 `<span class="cl-hero__count">12강 중 4강 완료</span>` 로 나눠 그린다.',
    dom: `const p=doc.querySelector('.cl-hero__progress'); if(!p) return; const t=p.textContent; const v=(t.match(/진도 (\\d+)%/)||[0,'0'])[1]; const rest=t.split(' · ').slice(1).join(' · ');
p.innerHTML='<span class="cl-progress"><span class="cl-progress__track" role="progressbar" aria-label="진도율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+v+'"><span class="cl-progress__bar" style="width:'+v+'%"></span></span><span class="cl-progress__value cl-num">'+v+'%</span></span>'+(rest?'<span class="cl-hero__count cl-num">'+rest+'</span>':'');`,
    targets: ['.cl-hero'],
    note: '이 카드는 학습 기록이 있을 때만 보인다. 실험실 화면(2026-10-22 캡처: 강좌 2개 · 둘 다 미시청)에서는 숨어 있어 바뀐 모습이 보이지 않는다. 18px 는 2장 [정할 것](17px 자리를 새 단계 18px `cl-fs-title-lg` 로)과 같은 값이다.'
  },
  {
    id: 'SL6', group: 6, status: '제안', kind: '문구', layer: '화면별', screens: ['s-learn', 's-learn-many'],
    title: '강좌 행 버튼: 시작 전 · 진도 없는 강좌에 [다시보기]가 뜨지 않게',
    current: '한 번도 안 본 강좌(2026년 수능 기출 · 강의 0개, 2027년 수능 · 강의 2개, 둘 다 0%)에 [다시보기]가 뜬다. 다음 볼 강의가 없으면 모두 [다시보기]로 그리기 때문이다. 정보 줄은 "마지막 강의 · 미시청 / 마지막 학습 · 미시청" 으로 미시청이 두 번',
    next: '구조 · 동작은 그대로. 버튼 이름만: 한 강의도 안 봤으면 [학습 시작](첫 강의로), 다 봤을 때만 [다시보기], 진도를 세는 강의가 없으면 [강좌 보기](강좌 화면으로). 미시청 두 칸 → "아직 시작하지 않았습니다" 한 줄. 진도 막대로 그리는 강좌(21강 이상)는 100% 에서 `cl-success`',
    markup: '`courses.js` `fillLectureProgress` 의 버튼 고르기를 `next ? (done === 0 ? "학습 시작" : "다음 강의") : (total > 0 && done === total ? "다시보기" : "강좌 보기")` 로 바꾼다. 아이콘은 학습 시작 · 다음 강의 play, 다시보기 arrow-uturn-left, 강좌 보기 arrow-right. `courseRow` 에서 `course.cnt_title` 과 `course.sth_created_at` 이 둘 다 없으면 마지막 강의 · 마지막 학습 두 칸 대신 `<span>아직 시작하지 않았습니다</span>` 하나. 진도 막대(`progressBar`)는 100 이면 `.cl-progress.is-done`.',
    dom: `const ic=p=>'<svg class="cl-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
const play=ic('<polygon points="6 3 20 12 6 21 6 3"/>'), arrow=ic('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>');
doc.querySelectorAll('.cl-row').forEach(r=>{const T=+r.dataset.total, D=+r.dataset.done, P=+r.dataset.pct; const b=r.querySelector('.cl-row__next .cl-btn');
  if(b){ const hasNext=/다음 강의/.test(b.textContent);
    if(hasNext && D===0) b.innerHTML=play+'학습 시작';
    else if(!hasNext && !(T>0 && D===T)) b.innerHTML=arrow+'강좌 보기'; }
  const meta=r.querySelector('.cl-row__meta'); if(meta && meta.children.length===3 && /미시청/.test(meta.children[1].textContent) && /미시청/.test(meta.children[2].textContent)){ meta.children[2].remove(); meta.children[1].textContent='아직 시작하지 않았습니다'; }
  if(P>=100){ const pr=r.querySelector('.cl-progress'); if(pr) pr.classList.add('is-done'); }});
doc.querySelectorAll('.cl-card-item__meta').forEach(m=>{ m.textContent=m.textContent.replace('마지막 학습 미시청','아직 시작하지 않았습니다'); });`,
    targets: ['.cl-row__next .cl-btn'],
    note: '목록 구조는 기존 화면 그대로다: 강좌 하나에 행(또는 카드) 하나, 한 쪽 10개 + 쪽 번호, 강의는 펼치지 않는다. 캡처의 두 강좌는 모두 [강좌 보기]가 된다. 카드 보기의 "마지막 학습 미시청" 도 같은 말로 바꾼다.'
  },
  {
    id: 'SL7', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-learn'],
    title: '다가오는 일: 채점 완료를 "최근 채점" 으로 나눠 보이기',
    current: '한 목록에 마감 전 과제(D-day) → 새 답변 → 채점 완료 순서로 최대 8개. 마감 전 과제가 없으면 지난 채점만 남아 "다가오는 일"이 지난 일처럼 보인다',
    next: '순서 · 8개 · 빈 상태는 그대로. 채점 완료 묶음 앞에만 구분선 + 작은 이름 "최근 채점"(`cl-fs-micro` 500). 마감 전 과제 · 새 답변이 하나도 없으면 맨 위에 "마감이 다가오는 과제가 없습니다"(`cl-ink-muted`). 채점 완료 머리 줄의 "채점 완료 ·" 는 뺀다',
    css: `.cl-upcoming__empty { margin: 4px 0 0; font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); }
.cl-upcoming__sub { margin: var(--cl-space-4) 0 var(--cl-space-3); padding-top: var(--cl-space-4); border-top: 1px solid var(--cl-grid-row); font-size: var(--cl-fs-micro); font-weight: 500; color: var(--cl-ink-muted); }
.cl-upcoming .cl-timeline + .cl-upcoming__sub { margin-top: 0; }`,
    markup: '`renderUpcoming` 에서 정렬 · 8개 자르기는 그대로 두고, 그리는 단계에서 `sort` 가 "1-" 로 시작하는 항목(채점 완료)을 두 번째 `<ol class="cl-timeline">` 로 나눈다. 그 앞에 `<h3 class="cl-upcoming__sub">최근 채점</h3>`. 첫 묶음이 비면 `<p class="cl-upcoming__empty">마감이 다가오는 과제가 없습니다</p>`. 둘 다 없으면 지금 빈 상태 그대로.',
    dom: `const box=doc.querySelector('[data-upcoming]'); if(!box) return; const ol=box.querySelector('.cl-timeline'); if(!ol) return;
const graded=[...ol.children].filter(li=>/^채점 완료/.test((li.querySelector('.cl-timeline__meta')||{}).textContent||'')); if(!graded.length) return;
const ol2=doc.createElement('ol'); ol2.className='cl-timeline'; graded.forEach(li=>{const m=li.querySelector('.cl-timeline__meta'); m.textContent=m.textContent.replace(/^채점 완료 · /,''); ol2.append(li);});
const h=doc.createElement('h3'); h.className='cl-upcoming__sub'; h.textContent='최근 채점';
if(!ol.children.length){ const e=doc.createElement('p'); e.className='cl-upcoming__empty'; e.textContent='마감이 다가오는 과제가 없습니다'; ol.replaceWith(e); box.append(h, ol2); } else { ol.after(h, ol2); }`,
    targets: ['.cl-upcoming__sub'],
    note: '캡처 화면은 마감 전 과제 · 새 답변 없이 채점 완료 4개뿐이라, 제목은 "다가오는 일"인데 지난 과제만 보인다. 수정안은 "마감이 다가오는 과제가 없습니다" 다음에 "최근 채점" 묶음.'
  },
  {
    id: 'SL8', group: 9, status: '확정', kind: 'CSS', layer: '공통 부품', screens: ['s-learn', 's-learn-many'],
    title: '학생 다크모드: 진도 0% 막대 · 칩 개수 대비',
    current: '다크에서 진도 막대 바탕(`cl-heat-0` #2A2A2D)이 카드 바탕(#1C1C1E)과 거의 같아 0% 막대가 안 보인다',
    next: '진도 막대 바탕은 `cl-track`(다크 #333336). 라이트는 #ECECEF 로 지금(#F4F4F6)보다 조금 진해져 흰 바탕 위에서도 막대 자리가 보인다',
    css: `.cl-progress__track { background: var(--cl-track); }`,
    targets: ['.cl-progress__track'],
    note: 'T1 에서 만든 `cl-track`(진도 · 점수 막대 바탕)을 공통 진도 막대에도 쓴다. 선생님 진도율 화면과 같은 값이 된다.'
  },
  /* ───── 학생 · 과제 목록 · 과제 상세 (2026-10-22 실제 화면 · list.js · read.js) ───── */
  {
    id: 'SA1', group: 9, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-assign-read-empty'],
    title: '과제 목록 표: 칸마다 질문 하나 — 제출 · 점수 · 진행 여부',
    current: '제출(배지) · 점수 · 상태(배지) · 마감(일시) 네 칸이 같은 것을 나눠 말한다. 제출 · 상태가 둘 다 회색 배지라 "미제출 + 채점완료", "제출 + 마감" 처럼 두 배지를 같이 읽어야 뜻이 되고, 마감 일시와 상태 "마감" 이 따로 있다',
    next: '과제(제목 + "강좌 · 선생님", 표 폭의 40% · 제목은 두 줄까지) | 제출 18% | 점수 16% | 진행 여부(나머지). 제출은 배지가 아닌 아이콘 + 글자: 제출 ✓ `cl-ink-2` · 미제출 `cl-ink-muted` · 진행 중인데 미제출이면 ! 미제출 `cl-danger` 600. 점수: 채점 후 "78 / 100" 600 · 제출했고 채점 전 "채점 대기" `cl-ink-muted` · 안 냈으면 "–". 진행 여부: 배지 진행 중(`info`) + 아래 "D-2 · 2026.10.24 18:00" / 배지 마감(`neutral`) + 아래 마감 일시. 배지는 진행 여부 칸에만 있어 다른 칸과 섞이지 않는다',
    css: `.cl-asg-table { table-layout: fixed; }
.cl-asg-table th:nth-child(1) { width: 40%; }   /* 과제: 남는 폭을 다 가져가지 않게 */
.cl-asg-table th:nth-child(2) { width: 18%; }
.cl-asg-table th:nth-child(3) { width: 16%; }
.cl-asg-table th:nth-child(4) { width: auto; padding-left: var(--cl-space-6); }
.cl-asg-table td:nth-child(4) { padding-left: var(--cl-space-6); }
.cl-asg-table .cl-table__title { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; }
.cl-asg-table .cl-table__sub { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cl-asg-submit { display: inline-flex; align-items: center; gap: 6px; color: var(--cl-ink-2); white-space: nowrap; }
.cl-asg-submit .cl-icon { flex: none; color: var(--cl-success); }
.cl-asg-submit.is-none { color: var(--cl-ink-muted); }
.cl-asg-submit.is-none .cl-icon { color: var(--cl-ink-faint); }
.cl-asg-submit.is-todo { color: var(--cl-danger); font-weight: 600; }
.cl-asg-submit.is-todo .cl-icon { color: var(--cl-danger); }
.cl-asg-score { font-weight: 600; }
.cl-asg-score.is-wait, .cl-asg-score.is-empty { font-weight: 400; color: var(--cl-ink-muted); }
.cl-asg-period { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
.cl-asg-period__when { font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); white-space: nowrap; }
@media (max-width: 900px) { .cl-asg-period { display: inline-flex; flex-direction: row; align-items: center; gap: var(--cl-space-2); vertical-align: middle; } }`,
    markup: '`list.js` 행 그리기. 과제 칸 아래 줄 `${cos_title} · ${tea_name} 선생님`(등록일 · 강좌 칸 없앰). 제출 칸 `<span class="cl-asg-submit [is-none|is-todo]">` + 아이콘(check-circle · minus-circle · exclamation-circle) + "제출|미제출" — is-todo 는 open && 미제출. 점수 칸 graded → `${asu_score} / ${asg_score}`, 제출 && !graded → "채점 대기"(is-wait), 그 밖 "–"(is-empty). 진행 여부 칸 `<span class="cl-asg-period">` 배지 "진행 중"(info) | "마감"(neutral) + `<span class="cl-asg-period__when">` open 이면 `${due.label} · ${fmt.dateTime}`, 아니면 `fmt.dateTime`. 상태 · 마감 칸 없앰, 표에 `cl-asg-table`. 상세(`read.js statusOf`) 제목 옆 배지도 진행 중 · 마감 둘만 쓰고, 채점 결과는 숫자 띠 "내 점수"가 말한다. 탭은 그대로.',
    dom: `const ic=p=>'<svg class="cl-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
const t=doc.querySelector('[data-assignment-list] .cl-table');
if(!t){ const b=doc.querySelector('[data-status] .cl-badge'); if(!b) return; const left=(doc.querySelector('.cl-stat__value')||{}).textContent||''; const open=/^D-/.test(left.trim());
  b.className='cl-badge cl-badge--'+(open?'info':'neutral'); b.textContent=open?'진행 중':'마감'; return; }
t.classList.add('cl-asg-table');
t.querySelector('thead tr').innerHTML='<th scope="col">과제</th><th scope="col">제출</th><th scope="col" class="cl-table__num">점수</th><th scope="col">진행 여부</th><th scope="col"><span class="cl-sr-only">보기</span></th>';
t.querySelectorAll('tbody tr').forEach(tr=>{const c=[...tr.cells]; const sub=c[0].querySelector('.cl-table__sub'); const tea=sub.textContent.split(' · ')[0];
  sub.textContent=c[1].textContent.trim()+' · '+tea;
  const submitted=c[2].textContent.trim()==='제출'; const st=c[4].textContent.trim(); const open=/진행/.test(st); const graded=/채점/.test(st);
  const sc=c[3].textContent.trim();
  c[2].innerHTML=submitted?'<span class="cl-asg-submit">'+ic('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>')+'제출</span>'
    : open?'<span class="cl-asg-submit is-todo">'+ic('<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>')+'미제출</span>'
    : '<span class="cl-asg-submit is-none">'+ic('<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>')+'미제출</span>';
  c[3].innerHTML=graded?'<span class="cl-asg-score">'+sc+'</span>':submitted?'<span class="cl-asg-score is-wait">채점 대기</span>':'<span class="cl-asg-score is-empty">–</span>';
  const due=c[5].childNodes[0].textContent.trim(), dd=(c[5].querySelector('.cl-table__sub')||{}).textContent;
  c[5].className=''; c[5].innerHTML='<span class="cl-asg-period">'+(open?'<span class="cl-badge cl-badge--info">진행 중</span>':'<span class="cl-badge cl-badge--neutral">마감</span>')+'<span class="cl-asg-period__when cl-num">'+(open&&dd?dd+' · ':'')+due+'</span></span>';
  c[5].setAttribute('data-label','진행 여부');
  c[1].remove(); c[4].remove();});`,
    targets: ['.cl-asg-table thead'],
    note: '실험실 목록은 실제 과제 8건 + 진행 중 예시 1건(3단원 연습문제 풀이, 2026.10.24 18:00 마감)이다. 예시 행을 누르면 새로 제출 화면이 열린다. 실제 데이터에 안 냈는데 점수가 있는 과제가 2건 있어, 제출 "미제출" · 점수 "78 / 100" 으로 그대로 보인다.'
  },
  {
    id: 'SA2', group: 9, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-assign'],
    title: '과제 목록: [보기] 칸 빼기',
    current: '행마다 [보기]. 과제 제목 링크와 같은 주소 · 같은 화면이다(`list.js` 가 같은 `href` 를 두 번 쓴다)',
    next: '[보기] 칸과 머리 빈 칸을 뺀다. 상세로는 과제 제목을 눌러 들어간다(키보드 · 화면 낭독기도 제목 링크로)',
    markup: '`list.js` 에서 마지막 `<td>`(보기 버튼)와 머리의 마지막 `<th>` 를 그리지 않는다.',
    dom: `const t=doc.querySelector('[data-assignment-list] .cl-table'); if(!t) return; t.querySelector('thead tr').lastElementChild.remove(); t.querySelectorAll('tbody tr').forEach(tr=>tr.lastElementChild.remove());`,
    targets: [],
    note: ''
  },
  {
    id: 'SA3', group: 6, status: '제안', kind: '문구', layer: '화면별', screens: ['s-assign', 's-assign-read', 's-assign-read-empty'],
    title: '띄어쓰기: "채점완료" → "채점 완료", "진행중" → "진행 중" (탭 · 배지)',
    current: '탭 · 배지는 "채점완료", 내 강의실 다가오는 일은 "채점 완료"',
    next: '모두 "채점 완료"(띄어 씀). 같은 상태를 한 가지로 쓴다',
    markup: '`list.js` STATUS · TABS, `read.js` statusOf 의 label "채점완료" → "채점 완료", "진행중" → "진행 중".',
    dom: `doc.querySelectorAll('.cl-badge, .cl-tab').forEach(e=>{ e.childNodes.forEach(n=>{ if(n.nodeType===3) n.textContent=n.textContent.replace('채점완료','채점 완료').replace('진행중','진행 중'); }); });`,
    targets: [],
    note: ''
  },
  {
    id: 'SA4', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-assign'],
    title: '과제 목록: 상위 메뉴 "나의 강좌"',
    current: '제목만 있다. 수강중인 강좌(SL4) · 관리자 · 선생님 목록은 제목 위에 상위 메뉴가 있다',
    next: '제목 위 `cl-page__parent` "나의 강좌". 탭 · 도구 줄 · 표 순서는 그대로',
    markup: '제목 위에 `<p class="cl-page__parent">나의 강좌</p>`.',
    dom: `const t=doc.querySelector('[data-assignment-list] .cl-page__title'); if(!t) return; const p=doc.createElement('p'); p.className='cl-page__parent'; p.textContent='나의 강좌'; t.before(p);`,
    targets: ['.cl-page__parent'],
    note: ''
  },
  {
    id: 'SR1', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-assign-read-empty'],
    title: '과제 상세: 같은 정보 세 번 → 한 번 (상태 · 마감 · 배점)',
    current: '상태는 제목 오른쪽 끝 배지 · 옆 칸 · 숫자 띠 "남은 기간: 마감" 세 곳, 배점 · 마감은 숫자 띠와 옆 칸 두 곳. 옆 칸 때문에 제출 영역이 좁다',
    next: '상태 배지는 제목 바로 옆. 아래 줄 "강좌(링크) · 선생님 · 등록일". 숫자 띠 3칸: 마감(아래 줄 "D-2" 또는 "마감됨") · 배점 · 내 점수(채점 전이면 "채점 전" `cl-ink-muted`). 옆 칸은 없애고 설명 · 제출을 한 단으로',
    css: `.cl-asg-head__title { display: flex; align-items: center; flex-wrap: wrap; gap: var(--cl-space-2) var(--cl-space-3); }
.cl-asg-head__title .cl-badge { flex: none; }
.cl-page__meta a { color: inherit; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--cl-control-border); }
.cl-page__meta a:hover { color: var(--cl-primary-pressed); }
.cl-stat__sub { font-size: var(--cl-fs-caption); color: var(--cl-ink-muted); }
.cl-stat__value.is-empty { color: var(--cl-ink-muted); font-weight: 600; }
[data-assignment-read] .cl-split--narrow { grid-template-columns: minmax(0, 1fr); }
[data-submit-blocked] { margin: 0 0 var(--cl-space-3); }   /* 안내 문구와 제출 기록 버튼 사이 */`,
    markup: '`read.js renderAssignment`: 상태 배지를 `[data-status]` 대신 제목과 같은 줄(`h1` 다음)에 그린다. 부제는 `강좌 링크 · 선생님 · 등록 ${fmt.date(asg_created_at)}`. 숫자 띠는 `stat("마감", 날짜, sub)` · `stat("배점")` · `stat("내 점수")` 3개(sub = due.days ≥ 0 ? due.label : "마감됨"). `[data-aside]` 는 그리지 않는다.',
    dom: `const page=doc.querySelector('[data-assignment-read]'); if(!page) return;
const h1=page.querySelector('[data-title]'), st=page.querySelector('[data-status]'), meta=page.querySelector('[data-subtitle]'), aside=page.querySelector('[data-aside]');
const wrap=doc.createElement('div'); wrap.className='cl-asg-head__title'; h1.before(wrap); wrap.append(h1, ...st.childNodes); st.remove();
const dd=[...aside.querySelectorAll('dd')]; const cos=dd[0].innerHTML, tea=dd[1].textContent, reg=dd[2].textContent.split(' ~ ')[0];
meta.innerHTML=cos+' · '+tea+' · 등록 '+reg;
const vals=[...page.querySelectorAll('.cl-stat__value')].map(v=>v.textContent); const left=vals[0], due=vals[1], score=vals[2], mine=vals[3];
const stat=(l,v,sub,empty)=>'<div class="cl-stat"><span class="cl-stat__label">'+l+'</span><span class="cl-stat__value'+(empty?' is-empty':'')+'">'+v+'</span>'+(sub?'<span class="cl-stat__sub">'+sub+'</span>':'')+'</div>';
page.querySelector('[data-stats]').innerHTML=stat('마감',due,left==='마감'?'마감됨':left)+stat('배점',score)+stat('내 점수',mine==='–'?'채점 전':mine,'',mine==='–');
aside.remove();`,
    targets: ['.cl-asg-head__title', '[data-stats]'],
    note: '새로 제출 · 확인 창 화면도 같은 머리다. 그 두 화면은 진행 중 과제가 없어 예시 데이터(마감 2026.10.24 18:00 · D-2)다.'
  },
  {
    id: 'SR2', group: 4, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-assign-read'],
    title: '과제 설명이 비었을 때 "설명이 없습니다"',
    current: '설명이 빈 과제(실제 2건)는 "과제 설명" 카드에 빈 칸만 남는다',
    next: '내용이 비면 "선생님이 남긴 설명이 없습니다." `cl-ink-muted` 한 줄',
    css: `.cl-asg-desc-empty { margin: 0; color: var(--cl-ink-muted); }`,
    markup: '`read.js` 에서 `asg_contents` 가 비었거나 글자 · 이미지가 없으면(`<p><br></p>`) 뷰어 대신 `<p class="cl-asg-desc-empty">선생님이 남긴 설명이 없습니다.</p>`.',
    dom: `const d=doc.querySelector('[data-desc]'); if(!d) return; if(d.textContent.trim()==='' && !d.querySelector('img')) d.innerHTML='<p class="cl-asg-desc-empty">선생님이 남긴 설명이 없습니다.</p>';`,
    targets: ['.cl-asg-desc-empty'],
    note: ''
  },
  {
    id: 'SR3', group: 6, status: '제안', kind: '문구', layer: '화면별', screens: ['s-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-assign-read-empty'],
    title: '제출 기록 버튼: 같은 날 여러 번 내면 구분이 안 됨 → 차수 붙이기',
    current: '같은 날 두 번 내면 버튼이 둘 다 "2024.06.17 (월)". 최종 제출은 작은 점 하나로만 구분',
    next: '"1차 · 2024.06.17 (월)", "2차 · 2024.06.17 (월)" — 낸 순서대로 번호. 최종 제출 점은 그대로',
    markup: '`read.js renderRequests` 에서 `state.requests` 를 낸 시각 오름차순으로 번호를 매겨 라벨 앞에 `${n}차 · ` 를 붙인다.',
    dom: `doc.querySelectorAll('[data-submissions] .cl-submission').forEach((b,i)=>{ const t=[...b.childNodes].find(n=>n.nodeType===3); if(t) t.textContent=(i+1)+'차 · '+t.textContent; });`,
    targets: ['[data-submissions]'],
    note: ''
  },
  {
    id: 'SR4', group: 7, status: '확정', kind: 'CSS', layer: '공통 부품', screens: ['s-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-assign-read-empty', 's-qna-read', 's-qna-delete-dlg', 's-qna-edit', 's-qna-detail', 's-qna-detail-dlg', 's-board-detail', 's-board-detail-dlg', 's-board-write'],
    title: '과제 본문 · 편집기: 디자인시스템 글꼴 · 색 + 다크모드',
    current: 'Toast UI 기본값 그대로: 본문 13px 다른 글꼴, 글자 #222 · 도구 줄 #F7F9FC · 테두리 #DADDE6 등 직접 색. 다크에서 본문 글자가 어두운 바탕에 묻히고 편집 칸은 흰 판으로 남는다',
    next: '본문 Pretendard `cl-fs-ui` 14px · 줄높이 1.7 · `cl-ink`. 편집기 도구 줄 `cl-sidebar`, 선 `cl-grid-head`, 편집 칸 `cl-canvas`, 반경 `cl-radius-sm`. 링크 `cl-primary-pressed`, 인용 · 취소선 `cl-ink-muted`. 다크에서는 도구 아이콘을 밝은 줄로 바꾼다',
    css: `.cl-scope .toastui-editor-contents { font-family: var(--cl-font); font-size: var(--cl-fs-ui); line-height: 1.7; color: var(--cl-ink); }
.cl-scope :is(.ProseMirror, .toastui-editor-contents p, .toastui-editor-contents ul, .toastui-editor-contents ol, .toastui-editor-contents table) { color: var(--cl-ink); }
.cl-scope .toastui-editor-contents :is(h1, h2) { border-bottom-color: var(--cl-grid-head); }
.cl-scope .toastui-editor-contents :is(del, blockquote, blockquote p) { color: var(--cl-ink-muted); }
.cl-scope .toastui-editor-contents blockquote { border-left-color: var(--cl-hairline); }
.cl-scope .toastui-editor-contents hr { border-top-color: var(--cl-grid-head); }
.cl-scope .toastui-editor-contents a { color: var(--cl-primary-pressed); }
.cl-scope .toastui-editor-contents pre { background: var(--cl-parchment); }
.cl-scope .toastui-editor-contents code { background: var(--cl-hover); color: var(--cl-ink-2); }
.cl-scope .toastui-editor-contents ul > li::before { background: var(--cl-ink-faint); }
.cl-scope .ProseMirror .placeholder { color: var(--cl-ink-faint); }
.cl-scope .cl-editor { border-color: var(--cl-control-border); border-radius: var(--cl-radius-sm); }
.cl-scope .toastui-editor-defaultUI-toolbar { background: var(--cl-sidebar); border-bottom-color: var(--cl-grid-head); }
.cl-scope .toastui-editor-defaultUI-toolbar button { border-color: transparent; }
.cl-scope .toastui-editor-defaultUI-toolbar button:not(:disabled):hover { background-color: var(--cl-canvas); border-color: var(--cl-hairline); }
.cl-scope .toastui-editor-toolbar-divider { background: var(--cl-hairline); }
.cl-scope :is(.toastui-editor-ww-container, .toastui-editor-md-container, .toastui-editor-mode-switch) { background: var(--cl-canvas); border-color: var(--cl-grid-head); }
.cl-scope .toastui-editor-mode-switch .tab-item { background: var(--cl-sidebar); color: var(--cl-ink-muted); border-color: var(--cl-grid-head); }
.cl-scope .toastui-editor-mode-switch .tab-item.active { background: var(--cl-canvas); color: var(--cl-ink); border-top-color: var(--cl-canvas); }
html[data-theme="dark"] .cl-scope .toastui-editor-toolbar-icons { background-position-y: -49px; }
html[data-theme="dark"] .cl-scope .toastui-editor-defaultUI :is(.toastui-editor-popup, .toastui-editor-context-menu) { background: var(--cl-canvas); border-color: var(--cl-hairline); color: var(--cl-ink); }`,
    targets: [],
    note: 'Toast UI 는 관리자 · 선생님 화면(공지 쓰기, 과제 만들기)에서도 쓰므로 공통 부품으로 둔다. 다크 아이콘 위치(-49px)는 Toast UI 의 다크 테마 파일과 같은 값이다.'
  },
  {
    id: 'SR5', group: 1, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-assign-submit', 's-assign-confirm-dlg'],
    title: '새로 제출: 편집기와 [파일 첨부 · 취소 · 제출하기] 줄 사이 띄우기',
    current: '편집기 바로 아래에 버튼 줄이 붙어 있고, 첨부 안내 · 파일 목록이 버튼 줄 아래로 흩어져 있다',
    next: '편집기 아래 `cl-space-3` 12px 띄우고 버튼 줄, 그 아래 안내 · 파일 목록. 파일 목록은 안내와 8px',
    css: `[data-submission-body] > .cl-editor + .cl-toolbar { margin-top: var(--cl-space-3); }
[data-submission-body] > .cl-toolbar + .cl-field__help { margin-top: var(--cl-space-1); }
[data-submission-body] > .cl-files { margin-top: var(--cl-space-2); }`,
    targets: ['[data-submission-body] > .cl-toolbar'],
    note: '편집기 · 확인 창 동작은 실제 `read.js openEditor` · `confirmDialog` 그대로다. 실험실의 새로 제출 화면은 진행 중 과제가 없어 예시 데이터다.'
  },
  {
    id: 'SE1', group: 7, status: '확정', kind: 'CSS', layer: '공통 부품', screens: ['s-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '빈 상태(Empty): 디자인시스템 값으로 · 아이콘 22px',
    current: '`components.css` 의 `.cl-empty` 가 48px · 16px · 8px · 12px 를 직접 적고, `emptyState()` 가 아이콘을 24px 로 그린다',
    next: '여백 `cl-space-7` · `cl-space-4`, 항목 사이 `cl-space-2`, 아이콘 상자 반경 `cl-radius-lg`, 아이콘 22px(디자인시스템 Empty). 제목 17px 600 · 설명 `cl-ink-muted` 360px 는 그대로',
    css: `.cl-empty { padding: var(--cl-space-7) var(--cl-space-4); gap: var(--cl-space-2); }
.cl-empty__icon { border-radius: var(--cl-radius-lg); margin-bottom: var(--cl-space-1); }
.cl-empty__icon .cl-icon { width: 22px; height: 22px; }
.cl-empty .cl-btn { margin-top: var(--cl-space-2); }`,
    markup: '`ui.js emptyState` 의 `icon(iconName, 24)` → 22.',
    targets: ['.cl-empty'],
    note: '모든 빈 상태에 같이 적용되는 공통 부품이다. 화면 모습은 아이콘이 2px 작아지는 것 말고 같다.'
  },
  {
    id: 'SE2', group: 6, status: '제안', kind: '문구', layer: '화면별', screens: ['s-complete'],
    title: '수강 완료 강좌 · 0개: 같은 문장 두 번 → 한 번, 버튼 이름',
    current: '제목 아래 "0개 강좌 · 진도율 100%가 되면 이곳으로 옮겨집니다" 와 빈 상태 설명 "진도율 100%가 되면 이곳으로 옮겨집니다." 가 같은 말. 강좌가 없는데 보기 전환(목록 · 카드)이 보인다. 버튼 이름 "수강중인 강좌"',
    next: '상위 메뉴 "나의 강좌" 를 두고 제목 아래 줄은 뺀다. 0개일 때 도구 줄(보기 전환)은 숨긴다. 빈 상태: "수강 완료한 강좌가 없습니다" / "강좌 진도율이 100%가 되면 여기에 모입니다." / [수강중인 강좌 보기]. 1개 이상이면 개수는 수강중인 강좌(SL4)처럼 도구 줄 오른쪽 "강좌 N개"',
    markup: '`complete.js`: `[data-course-count]` 문장을 빼고 제목 위 `<p class="cl-page__parent">나의 강좌</p>`. 목록이 0개면 `.cl-toolbar` 에 `hidden`. `emptyState({ icon: "check-circle", title: "수강 완료한 강좌가 없습니다", desc: "강좌 진도율이 100%가 되면 여기에 모입니다.", action: { label: "수강중인 강좌 보기", href: "/user/student/course/learn" } })`.',
    dom: `const pg=doc.querySelector('[data-course-complete]'); if(!pg) return;
const t=pg.querySelector('.cl-page__title'); const par=doc.createElement('p'); par.className='cl-page__parent'; par.textContent='나의 강좌'; t.before(par);
const m=pg.querySelector('[data-course-count]'); if(m) m.remove();
if(pg.querySelector('[data-course-list] .cl-empty')){ pg.querySelector('.cl-toolbar').hidden=true;
  pg.querySelector('.cl-empty__desc').textContent='강좌 진도율이 100%가 되면 여기에 모입니다.';
  const b=pg.querySelector('.cl-empty .cl-btn'); b.textContent='수강중인 강좌 보기'; }`,
    targets: ['.cl-page__parent', '.cl-empty__desc', '.cl-empty .cl-btn'],
    note: '실제 학생 계정(수강 완료 0개) 화면 그대로다.'
  },
  {
    id: 'SE3', group: 6, status: '제안', kind: '문구', layer: '화면별', screens: ['s-assign-read-empty'],
    title: '제출한 과제 0건: 같은 문장 두 번 → 한 번, 상황에 맞는 설명',
    current: '"채점이 끝난 과제는 다시 제출할 수 없습니다." 가 제목 아래 안내 줄과 빈 상태 설명에 두 번. 한 번도 안 냈는데 "다시" 라고 쓴다',
    next: '제출 0건이면 위 안내 줄은 숨기고 빈 상태 하나만. 설명은 상황별 — 채점 완료: "채점이 끝나 더 이상 제출할 수 없습니다." · 마감: "마감이 지나 더 이상 제출할 수 없습니다." · 진행 중: 제목 "아직 제출한 과제가 없습니다", 설명 "마감 전까지 [새로 제출]로 낼 수 있습니다." 버튼은 위 [새로 제출] 하나로 충분해 빈 상태에는 두지 않는다',
    markup: '`read.js renderRequests`: `state.requests.length === 0` 이면 `els.blocked.hidden = true` 로 두고 `els.body` 에 `emptyState({ icon: "clipboard-document-list", title, desc })`. title · desc 는 `statusOf(...).key` 로 고른다(graded · closed · open). 1건 이상이면 지금처럼 안내 줄을 보인다.',
    dom: `const b=doc.querySelector('[data-submit-blocked]'); const e=doc.querySelector('[data-submission-body] .cl-empty'); if(!e) return;
if(b) b.hidden=true;
e.querySelector('.cl-empty__desc').textContent='채점이 끝나 더 이상 제출할 수 없습니다.';`,
    targets: ['[data-submission-body] .cl-empty'],
    note: '실험실 화면은 과제 목록 두 번째 줄 "두번째 강의에 나오는 서적의 이름은?"(실제 asg0000024, 채점 완료 · 제출 0건)이다. 마감 · 진행 중 문구는 실제 데이터가 없어 설명으로만 전달한다.'
  },
  {
    id: 'SQ1', group: 9, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-qna'],
    title: 'Q&A 목록 표: 답글 수와 상태가 같은 말 → 한 칸으로',
    current: '질문 · 강좌 · 작성일 · 답글(숫자) · 상태(배지) 다섯 칸. 답글 1 이면 "답변 완료", 0 이면 "답변 대기" 라 숫자와 배지가 같은 것을 두 번 말한다',
    next: '질문 · 강좌 · 상태 · 작성일 네 칸. 강좌는 지금처럼 링크가 걸린 칸으로 둔다. 답글 칸을 없애고 상태 배지 하나로: 답변이 있으면 "답변 1"(`success`), 없으면 "답변 대기"(`warning`). 상태를 작성일 앞에 두어 제목 → 강좌 → 상태 순으로 읽히게 한다',
    css: `.cl-qna-table { table-layout: fixed; }
.cl-qna-table th:nth-child(1) { width: 46%; }
.cl-qna-table th:nth-child(2) { width: 22%; }
.cl-qna-table th:nth-child(3) { width: 14%; }
.cl-qna-table th:nth-child(4) { width: auto; }
.cl-qna-table .cl-table__title { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; }
.cl-qna-table td[data-label="강좌"] { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`,
    markup: '`posts.js` 행 그리기: 답글 칸을 없애고 상태 칸을 답글 수로 고른다 — `count > 0 ? badge("답변 " + count, "success") : badge("답변 대기", "warning")`. 상태 칸을 작성일 앞으로 옮긴다. 강좌 칸과 그 안의 강좌 링크는 그대로 둔다. 표에 `cl-qna-table`.',
    dom: `const t=doc.querySelector('[data-my-posts] .cl-table'); if(!t) return; t.classList.add('cl-qna-table');
t.querySelector('thead tr').innerHTML='<th scope="col">질문</th><th scope="col">강좌</th><th scope="col">상태</th><th scope="col">작성일</th>';
t.querySelectorAll('tbody tr').forEach(tr=>{const c=[...tr.cells];
  const n=parseInt(c[3].textContent.trim(),10)||0;
  c[4].innerHTML=n>0?'<span class="cl-badge cl-badge--success">답변 '+n+'</span>':'<span class="cl-badge cl-badge--warning">답변 대기</span>';
  c[3].remove(); tr.insertBefore(c[4], c[2]);});`,
    targets: ['.cl-qna-table thead'],
    note: '실험실 목록은 실제 질문 1건(답변 완료)에 답변 대기 1건을 더해 두 가지를 같이 본다. 강좌 링크는 실험실에서 눌러도 움직이지 않는다.'
  },
  {
    id: 'SQ2', group: 1, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-qna-read', 's-qna-delete-dlg'],
    title: 'Q&A 상세: 큰 제목 두 개 → 질문 제목 하나',
    current: '머리 띠에 "Q&A" 가 56px 로 크게 있고, 정작 질문 제목은 그 아래 32px. 화면에서 가장 큰 글자가 게시판 이름이라 무슨 질문인지보다 먼저 읽힌다',
    next: '머리 띠는 길 안내(홈 › Q&A › 질문)만 남기고 큰 "Q&A" 는 뺀다. 질문 제목이 화면의 첫 제목이 된다. 띠 위아래 여백도 64 → 24px 로 줄여 질문이 바로 보이게',
    css: `.cl-pub-band:has(+ .cl-thread) { padding: var(--cl-space-5) 0 var(--cl-space-3); border-bottom: 0; }
.cl-pub-band:has(+ .cl-thread) .cl-pub-band__title { display: none; }
.cl-pub-band:has(+ .cl-thread) .cl-pub-band__crumb { margin-bottom: 0; }`,
    markup: '`qna-read.js` 가 쓰는 머리 띠에서 `<h1 class="cl-pub-band__title">Q&A</h1>` 를 그리지 않는다. 질문 제목(`.cl-post__title`)을 `<h2>` 에서 `<h1>` 로 올린다(화면의 제목이 하나가 되도록).',
    targets: ['.cl-pub-band'],
    note: '자유게시판 상세도 같은 틀이면 함께 바꾼다.'
  },
  {
    id: 'SQ3', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-qna-read', 's-qna-delete-dlg', 's-qna-detail', 's-qna-detail-dlg'],
    title: 'Q&A 상세: 답변 쓰기 칸을 늘 펼쳐 두지 않기',
    current: '답변이 있든 없든 "답변 쓰기" 편집기(270px)와 파일 첨부가 늘 펼쳐져 있다. 답변을 보러 온 학생에게도 빈 편집기가 화면 절반을 차지한다',
    next: '평소에는 [답변 쓰기] 버튼 하나만. 누르면 그 자리에 편집기가 열린다(과제 상세의 [새로 제출]과 같은 동작). 편집기가 열리면 [취소]로 닫는다',
    css: `.cl-thread__write-open { display: flex; }`,
    markup: '`qna-read.js`: `[data-answer-write]` 안의 제목 아래에 `<button class="cl-btn cl-btn--primary">답변 쓰기</button>` 만 두고, 누르면 지금 폼을 그린다(편집기 · 첨부 · [등록] · [취소]). 답변 등록 · 취소 뒤에는 다시 버튼만 남긴다. 로그인하지 않은 사람에게는 지금처럼 "로그인하면 답변을 남길 수 있습니다".',
    dom: `const w=doc.querySelector('[data-answer-write]'), f=w&&w.querySelector('form'); if(!f) return;
f.hidden=true; const b=doc.createElement('button'); b.type='button'; b.className='cl-btn cl-btn--primary lab-live'; b.style.alignSelf='flex-start'; b.textContent='답변 쓰기';
b.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); f.hidden=false; b.hidden=true; try{parent.postMessage({labFit:1},'*')}catch(err){}});
f.before(b);`,
    targets: ['[data-answer-write]'],
    note: '실험실에서 [답변 쓰기]를 누르면 편집기가 열린다. 답변이 0건인 질문에서는 바로 펼쳐 두는 쪽이 나을 수 있다 — [정할 것].'
  },
  {
    id: 'SQ4', group: 4, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-qna-read', 's-qna-delete-dlg', 's-qna-detail', 's-qna-detail-dlg'],
    title: 'Q&A 답변: 답변마다 상자를 두지 않고 선으로만 나눈다',
    current: '답변마다 반경 14px 상자(테두리 + 안쪽 여백 18px)가 있고, 선생님 답변은 그 상자가 통째로 연보라(`cl-primary-tint`)다. 상세가 카드 안에 들어가면 카드 테두리 안에 또 상자가 생겨 테두리가 겹치고, 답변이 늘수록 상자가 줄줄이 쌓인다',
    next: '상자를 없앤다 — 테두리 · 바탕 · 반경 모두 빼고 글만 둔다. 답변이 둘 이상이면 답변 사이에만 1px `cl-grid-row` 선을 넣고, 마지막 답변 아래에는 선을 두지 않는다. 답변이 하나면 선도 없다. 누가 썼는지는 지금처럼 "A." 표시와 이름(선생님은 보라 굵은 글자)이 말해 준다',
    css: `.cl-thread__list { gap: var(--cl-space-5); }
.cl-thread__answer, .cl-thread__answer.is-teacher { padding: 0; border: 0; border-radius: 0; background: transparent; }
.cl-thread__answer:not(:last-child) { padding-bottom: var(--cl-space-5); border-bottom: 1px solid var(--cl-grid-row); }
@media (max-width: 900px) { .cl-thread__answer, .cl-thread__answer.is-teacher { padding: 0; } .cl-thread__answer:not(:last-child) { padding-bottom: var(--cl-space-4); } }`,
    targets: ['.cl-thread__answer'],
    note: '연보라 판은 글자 대비가 떨어지고 답변이 여러 개면 보라 덩어리가 된다. 왼쪽 색 띠도 같은 문제를 모양만 바꾼 것이라 함께 뺐다. 내 강의실 상세는 답변 2개(선생님 · 학생)로 두어 사이 선을 볼 수 있게 했다. 공개 상세는 실제대로 답변 1개라 선이 없다.'
  },
  {
    id: 'SQ5', group: 7, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-qna-read', 's-qna-delete-dlg', 's-qna-edit'],
    title: '[정할 것] Q&A 상세 · 질문 수정은 공개 화면이라 다크모드가 끊긴다',
    current: '목록(내 강의실)은 작업공간이라 다크로 바뀌지만, 제목을 누르면 열리는 상세 · 수정은 공개 화면(`public.css` · `cl-pub-body`)이라 밝은 채로 남는다. 밤에 쓰면 목록 → 상세에서 화면이 한 번 하얘진다',
    next: '세 가지 중 하나를 정한다. ① 로그인한 사람이 보는 Q&A · 자유게시판 상세까지 다크 범위에 넣는다(공개 화면 토큰은 이미 `var(--cl-…)` 라 머리 · 푸터 · 글 본문만 확인하면 된다). ② 상세를 작업공간 화면으로 새로 만든다(SQ6 — 그러면 로그인한 학생은 다크가 끊기지 않는다). ③ 지금처럼 둔다',
    markup: '적용 범위 장의 "다크모드 범위" 표에 이 줄을 더한다: 학원 페이지 — 로그인 후 보는 게시판 상세.',
    targets: [],
    note: '실험실에서 Q&A 상세를 다크로 보면 머리 · 푸터 · 본문은 토큰을 읽어 뒤집히지만, 실제 사이트는 `html[data-theme="dark"]` 자체가 없어 늘 밝다.'
  },
  {
    id: 'SQ6', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-qna', 's-qna-detail', 's-qna-detail-dlg'],
    title: 'Q&A 상세를 내 강의실 안에 새로 만든다 (새 화면)',
    current: '"나의 글 목록 › Q&A" 는 내 강의실(사이드바 있는 작업공간)인데, 제목을 누르면 학원 공개 Q&A 상세(`/user/qna/read/{uid}`)로 나간다. 사이드바가 사라지고 상단이 학원 메뉴로 바뀌어 학생은 내 강의실을 나온 줄 모른다. 삭제 뒤에도 공개 Q&A 목록으로 가서 돌아오지 못하고, 다크모드도 거기서 끊긴다',
    next: '내 강의실 안에 상세 화면을 새로 만든다(`/user/student/post/community/{uid}`). 공개 상세에 있는 것을 모두 담는다 — 강좌 링크 · 답변 수 배지 · 질문 제목 · 작성자 · 시간 · [수정] · [삭제] · 질문 본문 · 답변 목록 · 답변 쓰기 · 이 강좌의 다른 질문. 돌아가는 길은 위 "나의 글 목록" 과 아래 [목록으로] 두 곳. 삭제 뒤에도 이 목록으로 돌아온다. 공개 Q&A 상세는 비로그인도 보는 화면이라 그대로 둔다',
    markup: '작업공간 틀(`cl-page--wide`)에 과제 상세(`s-assign-read`)와 같은 머리를 쓴다: `cl-back` → 제목 + 상태 배지 + [수정] · [삭제] → `cl-page__meta`(강좌 링크 · 작성자 · 시간). 본문 · 답변 · 답변 쓰기 · 다른 질문은 각각 `cl-card cl-panel` 카드에 담는다. 카드 안의 \"이 강좌의 다른 질문\" 목록은 항목마다 위아래 여백 8px(`cl-space-2`) · 반경 `cl-radius-sm` 로 두고, 구분선 대신 4px 간격으로 나눈다 — hover 바탕(`cl-row-hover`)이 그 여백만큼만 칠해지게. 글 · 답변 부품(`cl-post__body` · `cl-thread__list` · `cl-thread__answer` · `cl-qna-item`)은 지금 `public.css` 에만 있는데 공개 화면과 작업공간 두 곳에서 쓰게 되므로 **공통층(`components.css`)으로 올린다**(적용 범위 장의 "두 번째로 쓰는 순간이 올리는 때" 규칙). 질문 제목은 공개 화면의 32px 대신 작업공간 `cl-fs-page-title` 24px 을 쓴다.',
    server: '목록 · 상세 · 삭제가 쓰는 API(`/api/boards/{uid}`, `/api/boards/{uid}/children`, `/api/boards/{uid}/other`)는 지금 것을 그대로 쓴다. 새 주소에서도 작성자 본인 확인(isOwner)이 되는지만 확인한다.',
    targets: ['.cl-back', '.cl-post-footer'],
    note: '실험실 "Q&A 상세 · 내 강의실" 이 이 새 화면이다. 지금 화면에 없는 것이라 [현재] 로 바꿔도 같은 모습이다. 강좌 이름은 링크 모양으로 두되 어디로 보낼지는 아직 정하지 않았다. 자유게시판(나의 글 목록 › 자유게시판)도 같은 구조라 함께 만든다. [수정]은 아직 공개 수정 화면으로 간다 — 상세를 옮긴 뒤 수정 화면도 같이 옮길지 [정할 것].'
  },
  {
    id: 'SB1', group: 9, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-board'],
    title: '자유게시판 목록: 댓글 · 조회 숫자 칸 정리',
    current: '제목 · 작성일 · 댓글 · 조회 네 칸. 댓글과 조회가 각각 숫자 칸이라 0 이 두 개 나란히 놓이고, 어느 쪽이 댓글인지 머리 글자를 봐야 안다',
    next: '제목 · 댓글 · 조회 · 작성일 순서로 두고, 댓글은 0 이면 `cl-ink-faint` 로 흐리게, 1 이상이면 `cl-primary-pressed` 600 으로. 조회는 항상 `cl-ink-muted`. 숫자만으로 "댓글이 달렸는지" 가 바로 보인다',
    css: `.cl-brd-table { table-layout: fixed; }
.cl-brd-table th:nth-child(1) { width: 56%; }
.cl-brd-table th:nth-child(2), .cl-brd-table th:nth-child(3) { width: 12%; }
.cl-brd-table th:nth-child(4) { width: auto; }
.cl-brd-table .cl-table__title { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; overflow-wrap: anywhere; }
.cl-brd-count { color: var(--cl-ink-faint); }
.cl-brd-count.is-on { color: var(--cl-primary-pressed); font-weight: 600; }
.cl-brd-views { color: var(--cl-ink-muted); }`,
    markup: '`posts.js` 의 자유게시판 행에서 칸 순서를 제목 · 댓글 · 조회 · 작성일 로 바꾼다. 댓글 수는 `<span class="cl-brd-count is-on">`(1 이상) 또는 `<span class="cl-brd-count">`(0), 조회는 `<span class="cl-brd-views">`. 표에 `cl-brd-table`.',
    dom: `const t=doc.querySelector('[data-post-type="free"] .cl-table'); if(!t) return; t.classList.add('cl-brd-table');
t.querySelector('thead tr').innerHTML='<th scope="col">제목</th><th scope="col" class="cl-table__num">댓글</th><th scope="col" class="cl-table__num">조회</th><th scope="col">작성일</th>';
t.querySelectorAll('tbody tr').forEach(tr=>{const c=[...tr.cells]; const n=parseInt(c[2].textContent.trim(),10)||0;
  c[2].innerHTML='<span class="cl-brd-count'+(n>0?' is-on':'')+'">'+n+'</span>';
  c[3].innerHTML='<span class="cl-brd-views">'+c[3].textContent.trim()+'</span>';
  tr.append(c[1]);});`,
    targets: ['.cl-brd-table thead'],
    note: '실험실 목록은 실제 글 2건이다. 댓글이 달린 모습을 보려고 첫 글의 댓글 수만 2 로 두었다.'
  },
  {
    id: 'SB2', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-board', 's-board-detail', 's-board-detail-dlg', 's-board-write'],
    title: '자유게시판 상세 · 글쓰기를 내 강의실 안에 새로 만든다 (새 화면)',
    current: '"나의 글 목록 › 자유게시판" 은 내 강의실인데, 제목을 누르면 학원 공개 게시글(`/user/board/read/{uid}`)로, [글쓰기]를 누르면 공개 글쓰기(`/user/board/write`)로 나간다. 사이드바가 사라지고 상단이 학원 메뉴로 바뀐다. 쓰거나 지운 뒤에도 공개 목록으로 가서 내 강의실로 돌아오지 못한다. Q&A 와 같은 문제다(SQ6)',
    next: '내 강의실 안에 상세(`/user/student/post/board/{uid}`)와 글쓰기(`/user/student/post/board/write`)를 만든다. 공개 화면에 있는 것을 모두 담는다 — 상세는 제목 · 작성자 · 날짜 · 조회 · [공유] · [인쇄] · [수정] · [삭제] · 본문 · 댓글(입력 칸 · 목록 · 삭제), 글쓰기는 제목 · 내용(1,000자) · 첨부파일 · [취소] · [등록]. 돌아가는 길은 위 "자유게시판" 과 아래 [목록으로] 두 곳. 쓰거나 지운 뒤에도 이 목록으로 돌아온다',
    markup: 'Q&A 상세(SQ6)와 같은 틀을 쓴다: `cl-back` → 제목 + 오른쪽 동작 버튼 → `cl-page__meta`(작성자 · 날짜 · 조회) → 본문 카드 → 댓글 카드 → 아래 [목록으로]. 글쓰기도 같은 틀에 폼을 카드 하나로 담고 [취소] · [등록]은 카드 밖 오른쪽. 공개 화면에서 `cl-btn--text` 였던 [공유] · [인쇄] · [수정] · [삭제]는 작업공간 기준에 맞춰 `cl-btn--ghost --sm` 으로 바꾼다(머리 줄에서 글자만 있는 버튼은 누를 곳이 좁다). 글 · 댓글 부품(`cl-post__body` · `cl-comment` 묶음)은 공개와 작업공간 두 곳에서 쓰게 되므로 공통층(`components.css`)으로 올린다 — Q&A 와 같은 묶음이라 한 번에 옮긴다. 카드로 감쌀 때 공개 화면의 구역 클래스(`cl-comments` · `cl-thread__others`)는 쓰지 않는다 — 그 클래스의 `padding-top` 과 `border-top` 이 카드 안쪽 여백과 카드 위 테두리를 덮어써 테두리가 한쪽만 사라진다. 카드에는 세로 배치 · 간격만 주고, 댓글 제목 · 입력 칸 · 목록은 지금 클래스를 그대로 쓴다.',
    server: '지금 API 를 그대로 쓴다(`/api/boards/{uid}`, `/api/board/comments`). 새 주소에서도 작성자 본인 확인(isOwner)이 되는지만 확인한다.',
    targets: ['.cl-back', '.cl-post-footer'],
    note: '실험실 "게시글 상세 · 내 강의실" 과 "글쓰기 · 내 강의실" 이 이 새 화면이다. 지금 화면에 없는 것이라 [현재] 로 바꿔도 같은 모습이다. [수정]은 실험실에서 글쓰기 화면으로 이어 두었다 — 실제로는 같은 폼에 내용이 채워진 수정 화면이다.'
  },
  {
    id: 'SB3', group: 4, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-board-detail', 's-board-detail-dlg'],
    title: '댓글: 마지막 댓글 아래 선 빼고 여백 고르게',
    current: '댓글마다 아래 1px 선이 있어 마지막 댓글 아래에도 선이 남는다. 카드 안에 들어가면 카드 테두리와 선이 겹쳐 두 줄로 보인다',
    next: '댓글 사이에만 선을 둔다. 첫 댓글 위, 마지막 댓글 아래 여백도 카드 여백에 맞춘다',
    css: `[data-board-read] .cl-comment:first-child { padding-top: 0; }
[data-board-read] .cl-comment:last-child { padding-bottom: 0; border-bottom: 0; }`,
    targets: ['.cl-comment'],
    note: 'Q&A 답변(SQ4)에서 상자를 빼고 선으로만 나눈 것과 같은 짜임이다.'
  },
  {
    id: 'LC1', group: 9, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-like-course'],
    title: '좋아요 강좌 카드: 강좌 이름이 두 번 · 머리 줄에 학원 이름',
    current: '썸네일 자리에 과목 + 강좌 이름이 글자로 들어가고(`cl-thumb-text`), 바로 아래 제목에 같은 강좌 이름이 또 나온다. 머리 줄은 "랩241 2023년 2학기 · 보충학습반" 으로, 지금 보고 있는 학원 이름이 맨 앞에 붙는다. 선생님 이름은 아래 줄에 수강생 · 좋아요 숫자와 섞여 있다',
    next: '수강중인 강좌 카드와 같은 짜임으로 맞춘다. 썸네일은 올린 이미지, 없으면 회색 판에 과목만(강좌 이름은 빼서 아래 제목과 겹치지 않게). 머리 줄은 "과목 · 선생님", 제목은 강좌 이름, 아래 줄은 "2023년 2학기 · 보충학습반 · 수강생 4명" — 학원 이름은 뺀다(지금 그 학원 안이다). 좋아요 수는 내가 고른 목록에서 쓸모가 적어 뺀다',
    css: `.cl-like-card .cl-thumb-text { background: var(--cl-media-bg, #F4F4F6); color: var(--cl-ink-muted); font-weight: 500; font-size: var(--cl-fs-caption); justify-content: flex-end; }
.cl-like-card .cl-thumb-text small { font-size: var(--cl-fs-caption); opacity: 1; text-decoration: none; }
.cl-like-card .cl-card-item__thumb { text-decoration: none; }`,
    markup: '`like/course.js` 카드 그리기: 썸네일은 `cos_image` 가 있으면 `<img>`, 없으면 `<span class="cl-thumb-text"><small>{과목}</small></span>`(강좌 이름은 넣지 않는다). 머리 줄 `${sub_name} · ${tea_name}`, 아래 줄 `${학기} · ${반} · 수강생 ${n}명`(학원 이름 · 좋아요 수 제외). 카드에 `cl-like-card`.',
    dom: `doc.querySelectorAll('[data-like-course] .cl-card-item').forEach(a=>{a.classList.add('cl-like-card');
  const tt=a.querySelector('.cl-thumb-text'); const sub=(tt&&tt.querySelector('small')||{}).textContent||'';
  if(tt) tt.innerHTML='<small>'+sub+'</small>';
  const eb=a.querySelector('.cl-card-item__eyebrow'), meta=a.querySelector('.cl-card-item__meta'), lock=eb.querySelector('.cl-lock');
  const term=eb.childNodes[0].textContent.trim().replace(/^랩241\s*/,'');
  const parts=meta.textContent.split(' · '); const tea=parts[0]; const st=(parts[1]||'').replace('수강생','').trim();
  eb.innerHTML=(sub?sub+' · ':'')+tea; if(lock) eb.append(lock);
  meta.textContent=term+(st?' · 수강생 '+st+'명':'');});`,
    targets: ['.cl-like-card .cl-card-item__eyebrow'],
    note: '실험실 데이터는 실제 좋아요 3건이다. 강좌 썸네일 이미지가 없는 강좌라 회색 판으로 보인다.'
  },
  {
    id: 'LC2', group: 4, status: '제안', kind: 'CSS', layer: '화면별', screens: ['s-like-course'],
    title: '좋아요 강좌: 그룹강좌 표시를 배지로',
    current: '"그룹강좌" 가 머리 줄 끝에 작은 자물쇠 + 회색 글자로 붙어 있어, 앞의 학기 · 반 글자와 구분되지 않는다',
    next: '중립 배지(`cl-badge--neutral`)로 바꿔 머리 줄에서 한 덩어리로 읽히게 한다. 자물쇠 아이콘은 그대로 둔다',
    css: `.cl-like-card .cl-lock { height: 20px; padding: 0 6px; border-radius: 6px; background: var(--cl-hover); color: var(--cl-ink-2); font-size: var(--cl-fs-micro); font-weight: 500; }`,
    targets: ['.cl-lock'],
    note: ''
  },
  {
    id: 'LC3', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-like-course', 's-like-teacher'],
    title: '좋아요 목록에서 바로 좋아요 떼기',
    current: '카드에 [강의 목록] · [프로필] 버튼만 있다. 좋아요를 떼려면 강좌 · 선생님 화면까지 들어가야 해서, 이 목록은 늘어나기만 한다',
    next: '카드 맨 아래 오른쪽에 채워진 하트 버튼을 둔다. 누르면 좋아요가 풀리고 카드가 목록에서 빠진다. 강좌 · 선생님 두 화면에 같은 모양으로',
    css: `.cl-like-off { color: var(--cl-primary); }
.cl-like-off:hover { background: var(--cl-primary-tint); }
.cl-teacher-card .cl-card-item__foot { width: 100%; margin-top: var(--cl-space-2); padding-top: 0; }`,
    markup: '`like/course.js` · `like/teacher.js` 의 `cl-card-item__foot` 에 [강의 목록] · [프로필] 다음 `cl-toolbar__spacer` 와 `<button class="cl-icon-btn cl-like-off" aria-label="좋아요 해제">`(채운 하트 18px)를 둔다. 누르면 강좌 · 선생님 화면이 쓰는 좋아요 해제 API 를 부르고, 성공하면 그 카드를 목록에서 빼고 머리의 개수를 줄인다. 마지막 하나를 떼면 빈 상태로 바꾼다.',
    server: '좋아요 해제 API 를 목록 화면에서도 부를 수 있는지 확인한다. 선생님 쪽도 같은 방식인지 본다.',
    targets: ['.cl-like-off'],
    note: '실수로 눌렀을 때를 위해 되돌리기를 둘지 [정할 것] — 토스트에 [되돌리기] 를 두는 방법과, 누르면 바로 빼지 않고 하트만 빈 모양으로 바꿨다가 화면을 떠날 때 반영하는 방법이 있다.'
  },
  {
    id: 'LC4', group: 1, status: '제안', kind: '마크업', layer: '공통 부품', screens: ['s-learn', 's-learn-many', 's-complete', 's-like-course'],
    title: '과목 칩: 걸러서 줄어들 때만 보인다',
    current: '수강중인 강좌는 강좌 2개 · 과목 1개(수학)인데도 칩이 "전체 2" · "수학 2" 두 개 보인다. 같은 숫자를 두 번 말하고, 눌러도 목록이 그대로다. 반대로 좋아요 강좌는 칩이 아예 없어, 강좌가 늘면 거를 방법이 없다',
    next: '두 조건을 **모두** 만족할 때만 칩 줄을 보인다 — ① 과목이 2개 이상, ② 강좌가 7개 이상. 하나라도 못 미치면 칩 줄을 숨긴다(보기 전환만 남은 도구 줄은 그대로 둔다). 수강중인 강좌 · 수강 완료 강좌 · 좋아요 강좌에 같은 규칙을 쓴다',
    markup: '`learn.js` · `complete.js` · `like/course.js` 의 `renderSubjects` 에서 `state.subjects.length < 2 || total < 7` 이면 칩을 그리지 않는다. 칩이 보일 때 "전체" 칩은 지금처럼 맨 앞에 둔다.',
    dom: `const box=doc.querySelector('[data-subjects]'); if(!box) return; const chips=box.querySelectorAll('.cl-chip');
const total=parseInt((box.querySelector('.cl-chip .cl-chip__count')||{}).textContent||'0',10);
if(chips.length<3 || total<7) box.hidden=true;`,
    targets: ['[data-subjects]'],
    note: '왜 7개인가: 과목 하나당 강좌가 2~3개씩만 있어도 과목 3개면 7개를 넘는다. 그 아래(강좌 6개 이하)는 칩을 눌러 거르나 그냥 보나 차이가 거의 없고, 칩 줄이 목록만큼 길어진다. 실험실 "수강중인 강좌 · 강좌 많을 때"(과목 4개 · 강좌 11개)는 칩이 보이고, 실제 계정 화면(과목 1개 · 강좌 2개)과 좋아요 강좌(과목 3개 · 강좌 3개)는 숨는다. 기준 숫자는 [정할 것].'
  },
  {
    id: 'LC5', group: 1, status: '제안', kind: '마크업', layer: '공통 부품', screens: ['s-learn-many'],
    title: '[정할 것] 과목이 많아지면 칩 대신 선택 칸',
    current: '칩은 과목 수만큼 늘어난다. 과목이 6~7개가 되면 칩 줄이 두 줄로 접히고, 1280px 이하에서는 보기 전환까지 밀린다. 같은 학생 화면인데 과제 목록은 강좌를 선택 칸(`cl-selectbox`)으로 고른다 — 거르는 방법이 화면마다 다르다',
    next: '과목이 5개를 넘으면 칩 대신 "과목 전체" 선택 칸으로 바꾼다(과제 목록과 같은 모양). 5개 이하면 칩 그대로. 또는 처음부터 모든 목록 화면을 선택 칸으로 통일한다',
    markup: '`renderSubjects` 에서 `state.subjects.length > 5` 이면 `chipGroup` 대신 과제 목록이 쓰는 선택 칸을 그린다. 고른 값과 개수 표시는 지금과 같다.',
    targets: ['[data-subjects]'],
    note: '실험실 예시는 과목 4개라 칩이 그대로 보인다. 과목이 더 많은 학생 화면을 받으면 선택 칸 모습도 그려 보겠다.'
  },
  {
    id: 'LT1', group: 9, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-like-teacher'],
    title: '좋아요 선생님 카드: 과목이 한 줄로 길게 늘어난다',
    current: '머리 줄에 선생님이 맡은 과목이 모두 들어간다 — "수학, 영어, 국어, 이서당, 클라우드러닝, 올댓에듀케이션" 여섯 개가 두 줄로 흐른다. 이름보다 과목 줄이 먼저 길게 읽힌다',
    next: '과목은 앞 두 개까지만 보이고 나머지는 "+4" 로 줄인다(전체는 `title` 로). 선생님 이름이 먼저 읽히도록 이름 · 과목 · 소개 순서로 둔다. 하트와 "좋아요 3" 이 두 줄로 나뉘던 것도 한 줄로 붙인다',
    css: `.cl-teacher-card__subjects { display: inline-flex; align-items: center; gap: var(--cl-space-1); min-width: 0; }
.cl-teacher-card__subjects b { font-weight: 400; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cl-teacher-card__more { flex: none; padding: 0 6px; border-radius: 6px; background: var(--cl-hover); color: var(--cl-ink-2); font-size: var(--cl-fs-micro); font-weight: 500; }
.cl-teacher-card .cl-card-item__meta { display: inline-flex; align-items: center; gap: var(--cl-space-1); }   /* 하트와 "좋아요 3" 이 두 줄로 나뉘던 것 */`,
    markup: '`like/teacher.js`: 카드 안 순서를 사진 → 이름 → 과목 → 소개 로 바꾸고, 과목은 `<span class="cl-teacher-card__subjects"><b>수학, 영어</b><span class="cl-teacher-card__more">+4</span></span>` 로 그린다. `title` 속성에 전체 과목을 넣는다.',
    dom: `const card=doc.querySelector('.cl-teacher-card'); if(!card) return;
const eb=card.querySelector('.cl-card-item__eyebrow'), name=card.querySelector('.cl-teacher-card__name');
const all=eb.textContent.trim(), parts=all.split(',').map(x=>x.trim());
eb.className='cl-card-item__eyebrow cl-teacher-card__subjects'; eb.title=all;
eb.innerHTML='<b>'+parts.slice(0,2).join(', ')+'</b>'+(parts.length>2?'<span class="cl-teacher-card__more">+'+(parts.length-2)+'</span>':'');
name.after(eb);`,
    targets: ['.cl-teacher-card__subjects'],
    note: '좋아요 수는 강좌 카드(LC1)와 같은 이유로 뺄지 [정할 것] — 선생님은 인기도가 고르는 데 도움이 될 수 있어 남겨 두었다.'
  },
  {
    id: 'SI1', group: 1, status: '확정', kind: '마크업', layer: '공통 틀', screens: ['s-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '나의 정보 · 비밀번호 변경: 지금 보는 메뉴 표시',
    current: '사이드바의 [나의 정보] [비밀번호 변경] 은 어느 쪽을 보고 있어도 표시가 없다. 접힌 레일(아이콘 줄)도 항상 [나의 강좌] 에 표시가 남아 있어서, 나의 정보로 들어오면 내가 어디 있는지 알 수 없다',
    next: '보고 있는 메뉴에 `aria-current="page"` 를 주고, 레일은 그 메뉴가 속한 묶음(나의 정보)에 표시를 옮긴다. 나의 글 목록 · 나의 좋아요도 같은 방식으로 레일 표시가 따라간다',
    markup: '서버가 그리는 사이드바에서 현재 경로와 메뉴 주소를 맞춰 `aria-current` 를 붙인다. 레일은 묶음 단위로 맞춘다: 수강중인 강좌 · 수강 완료 강좌 · 과제 목록 → 나의 강좌, Q&A · 자유게시판 → 나의 글 목록, 좋아요 강좌 · 좋아요 선생님 → 나의 좋아요, 나의 정보 · 비밀번호 변경 → 나의 정보.',
    targets: ['.cl-ws-nav__item', '.cl-ws-rail__item'],
    note: '색은 디자인시스템의 현재 메뉴 표시를 그대로 쓴다. 새로 만든 모양은 없다.'
  },
  {
    id: 'SI2', group: 1, status: '확정', kind: 'CSS', layer: '공통 부품', screens: ['s-info', 's-info-mail', 's-password'],
    title: '나의 정보 · 비밀번호 변경은 공통 부품만 쓴다',
    current: '두 화면은 `cl-profile-head` · `cl-info-row` · `cl-field` · `cl-savebar` · `cl-banner` · `cl-selectbox` · `cl-radio` 만 쓴다. 모두 공통 층(base.css · components.css)에 있고 화면별 층(student.css)에는 한 줄도 없다',
    next: '그대로 둔다. student.css 에 새 규칙을 더하지 않는다 — 공통 층이 이미 토큰으로 되어 있어서 다크모드도 함께 온다',
    css: '/* student.css 에 더할 것 없음 — 공통 층 그대로 */',
    targets: ['.cl-profile-head', '.cl-info-rows', '.cl-field', '.cl-savebar'],
    note: '선생님 쪽 같은 화면(t-info · t-password)도 같은 부품을 쓴다. "두 번째로 쓰는 순간이 올리는 때" 규칙에 따라 이미 올라가 있는 상태라 옮길 것이 없다.'
  },
  {
    id: 'SI3', group: 1, status: '제안', kind: '문구', layer: '화면별', screens: ['s-password'],
    title: '비밀번호 규칙 안내가 화면마다 다르다',
    current: '학생 화면은 "영문 소문자 · 숫자 · 특수문자(#?!@$%^&amp;*-)를 모두 포함해 8~16자", 선생님 화면은 "4자 이상" 이라고 적혀 있다. 같은 서비스에서 같은 일을 하는 화면인데 규칙이 달라 보인다',
    next: '서버가 실제로 검사하는 규칙 하나로 두 화면의 문구를 맞춘다. 특수문자는 괄호 안에 그대로 나열하고, 글자 수는 "8~16자" 로 끝에 둔다',
    server: '서버의 비밀번호 검사 규칙을 확인해서 문구를 맞춘다. 규칙이 역할마다 다르다면 그 자체를 통일하는 쪽이 먼저다.',
    targets: ['#pw-new-help'],
    note: '[정할 것] 선생님 화면의 4자 이상이 지금 서버 규칙인지, 옛 문구가 남은 것인지 확인이 필요하다.'
  },
  {
    id: 'SI4', group: 1, status: '제안', kind: '마크업', layer: '화면별', screens: ['s-password'],
    title: '현재 비밀번호에도 보기 토글',
    current: '새 비밀번호 · 새 비밀번호 확인에는 눈 모양 보기 단추가 있고, 현재 비밀번호에만 없다. 셋 다 같은 `cl-input-group` 인데 하나만 오른쪽이 비어 보인다',
    next: '세 칸 모두 같은 보기 토글을 둔다. 현재 비밀번호를 잘못 눌러 막히는 일이 가장 흔하다',
    markup: '`pw-old` 칸에도 `data-visible-toggle` 단추를 붙인다. 동작은 이미 있는 토글 스크립트가 `aria-controls` 로 찾아 쓴다.',
    targets: ['[data-field="old"] .cl-input-group'],
    note: '실험실 s-password 에는 세 칸 모두 토글이 붙어 있다.'
  },
  {
    id: 'SI5', group: 1, status: '확정', kind: '마크업', layer: '공통 부품', screens: ['s-info', 's-info-mail', 's-info-mail-dlg'],
    title: '이메일은 그 행에서 바로 고친다',
    current: '[변경] 을 누르면 이메일 행과 휴대폰 행 *사이에* 입력 폼이 끼어든다. 행 네 줄의 리듬이 중간에서 끊기고, 폼이 표의 한 칸인지 따로 떨어진 영역인지 헷갈린다',
    next: '이메일 행은 그 자리에 머물고, 값 자리(가운데 칸)가 입력 칸으로 바뀐다. 오른쪽 [변경] 자리에는 [인증 메일 보내기][취소] 가 들어간다. 안내 문구와 오류는 그 행 아래 한 줄로 깔린다 — 행 수는 그대로 네 줄',
    css: `/* 행 안에서 바로 고치기: 값 자리에 입력 칸이 들어오고, 안내 · 오류는 그 행 아래 한 줄로 */\n.cl-info-row--edit .cl-info-row__value > .cl-input { width: 100%; min-width: 0; }\n.cl-info-row--edit { border-bottom: 0; }\n.cl-info-row__actions { display: flex; align-items: center; gap: 8px; }\n/* 안내 · 오류는 행 안에 넣지 않는다 — 긴 문장이 단추 칸을 밀어낸다 */\n.cl-info-row__note { margin: 0; padding: 0 0 12px 132px; border-bottom: 1px solid var(--cl-grid-row); } /* 132px = 라벨 칸 120px + 사이 여백 12px */\n.cl-info-row__note:last-child { border-bottom: 0; }\n@media (max-width: 500px) {\n  .cl-info-row--edit { grid-template-columns: minmax(0, 1fr); }\n  .cl-info-row--edit .cl-info-row__actions { justify-content: flex-end; }\n  .cl-info-row__note { padding-left: 0; }\n}`,
    markup: '`[data-mail-form]` 을 따로 두지 않고 `[data-mail-row]` 에 `cl-info-row--edit` 를 붙여 안을 갈아 끼운다. 라벨은 `<label for="mail-new">` 가 되고, 단추 두 개는 `.cl-info-row__actions`, 안내 · 오류는 행 밖 형제로 빼서 `.cl-info-row__note` 로 감싼다. [취소] 를 누르면 원래 값 · [변경] 단추로 되돌린다.',
    targets: ['[data-mail-row]', '.cl-info-row--edit', '.cl-info-row__note'],
    note: '이 세 규칙은 공통 층(components.css)에 둔다 — 같은 모양이 선생님 나의 정보에도 바로 쓰인다.'
  },
  {
    id: 'SI6', group: 1, status: '확정', kind: '마크업', layer: '화면별', screens: ['s-info', 't-info'],
    title: '나의 정보는 그 화면에서 바로 고친다 (선생님도 같게)',
    current: '학생 나의 정보는 이름 · 생년월일 · 성별을 화면에서 바로 고치고 [프로필 수정] 으로 저장한다. 선생님 나의 정보는 읽기만 하고 [정보 수정] 단추로 `/user/teacher/info/edit` 에 간다. 같은 이름의 화면이 역할마다 다르게 움직인다',
    next: '학생 쪽으로 맞춘다. 선생님 나의 정보에서도 [정보 수정] 단추를 없애고 이름 · 휴대폰 번호 · 한마디 · 소개를 그 화면 안에서 고친다. 계정 카드에는 아이디 · 비밀번호만 남기고, 폼으로 옮긴 값은 카드에서 뺀다 — 같은 값이 두 번 보이지 않게',
    markup: 't-info 에 `정보 수정` 페이지의 폼(`cl-form` + `cl-savebar`)을 그대로 옮겨 붙이고, 계정 카드의 이름 · 휴대폰 번호 · 한마디 행을 지운다. `/user/teacher/info/edit` 주소는 당분간 살려 두고 나의 정보로 보낸다(북마크 · 옛 링크).',
    targets: ['[data-teacher-info]', '[data-form]'],
    note: '실험실 t-info 가 합친 모습이다. 비교할 수 있게 t-info-edit(지금의 별도 수정 페이지)은 남겨 두었다.'
  },
  {
    id: 'G5', group: 7, status: '제안', kind: '마크업', layer: '공통 틀', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '계정 메뉴: 성격이 다른 줄을 묶어서 가르기',
    current: '관리자 · 선생님 · 학생 모두 계정 메뉴가 한 덩어리로 평평하다. 학생은 홈페이지 · 이용 매뉴얼 · 고객센터 · 학원 탈퇴 · 로그아웃 다섯 줄, 선생님은 여기에 나의 QR코드 · 사이트 관리까지 일곱 줄이다. 되돌릴 수 없는 [학원 탈퇴] 가 [고객센터] 바로 아래 같은 모양으로 붙어 있어서 잘못 누르기 쉽다. 화면 테마 줄(SL3)까지 들어오면 더 길어진다',
    next: '얇은 선으로 네 묶음으로 가른다. ① 이름 · 아이디와 화면 테마(내 설정) — 둘은 한 덩어리라 사이에 선을 두지 않는다 ② 바로가기 — 홈페이지, 선생님은 나의 QR코드 · 사이트 관리 ③ 도움 — 이용 매뉴얼 · 고객센터 ④ 계정 — 학생은 학원 탈퇴, 그리고 로그아웃. 묶음 이름은 붙이지 않는다 — 줄이 일곱 개뿐이라 글자를 더하면 오히려 길어진다. [학원 탈퇴] 는 되돌릴 수 없으니 빨강(`--cl-danger`)으로 두어 로그아웃과 구별한다',
    css: `/* 계정 메뉴 묶음 가르기: 설정 · 바로가기 · 도움 · 계정 */\n.cl-menu__sep { height: 1px; margin: 4px 6px; background: var(--cl-grid-row); }\n.cl-menu__item--danger { color: var(--cl-danger); }\n.cl-menu__item--danger:hover { background: var(--cl-danger-bg); }`,
    markup: '`.cl-menu` 안에서 [이용 매뉴얼] 앞과 [학원 탈퇴](없으면 [로그아웃]) 앞에 `<div class="cl-menu__sep" role="separator"></div>` 를 넣는다. [학원 탈퇴] 에는 `cl-menu__item--danger` 를 붙인다. 역할마다 줄이 다르므로 자리를 숫자로 세지 말고 어떤 줄 앞인지로 정한다.',
    dom: `const menu=doc.querySelector('.cl-ws-account + .cl-menu'); if(!menu) return;
const items=[...menu.querySelectorAll('.cl-menu__item')];
const by=s=>items.find(i=>i.textContent.trim()===s);
const sep=()=>{const d=doc.createElement('div'); d.className='cl-menu__sep'; d.setAttribute('role','separator'); return d;};
const quit=by('학원 탈퇴'), out=by('로그아웃');
if(!menu.querySelector('.cl-menu__sep')){ if(items[0]) items[0].before(sep());
  const help=by('이용 매뉴얼'); if(help) help.before(sep()); const last=quit||out; if(last) last.before(sep()); }
if(quit) quit.classList.add('cl-menu__item--danger');
const acc=doc.querySelector('.cl-ws-account'); if(!acc) return; acc.classList.add('lab-live');
if(!acc.dataset.labAcc){acc.dataset.labAcc='1';
  acc.addEventListener('click',e=>{e.preventDefault(); e.stopPropagation(); menu.hidden=!menu.hidden; acc.setAttribute('aria-expanded',String(!menu.hidden));});}`,
    targets: ['.cl-menu__sep', '.cl-menu__item--danger'],
    note: '실험실에서는 오른쪽 위 계정 버튼을 누르면 메뉴가 열린다. 관리자는 줄이 네 개뿐이라 선이 하나만 생긴다. 선생님 메뉴는 TN2 가 이미 같은 묶음으로 갈라 놓아서, 선이 두 번 들어가지 않도록 건너뛴다.'
  },
  {
    id: 'G6', group: 7, status: '확정', kind: '마크업', layer: '공통 틀', screens: ['dashboard', 'teachers', 'students', 'subjects', 'courses', 'notfound', 'teacher-read', 'teacher-edit', 'admins', 'admin-create', 'admin-edit', 'admin-read', 'groups', 'group-edit', 'categories', 'course-list', 'contents', 'cms', 'board', 'alarm', 'payments', 'login-stat', 'login-stat-t', 'login-detail', 'demand', 'download', 'group-stat', 'user-stat', 'main-setting', 'system-setting', 'about-setting', 'ip-setting', 'banner-setting', 'menu-setting', 'group-stat-s', 't-learn', 't-progress', 't-group', 't-assign', 't-info', 't-password', 'teacher-create', 'course-create', 'course-edit', 'course-sequence', 'teacher-order', 'group-create-dlg', 'subject-create-dlg', 'notice-create-dlg', 't-course-create', 't-course-edit', 't-assign-create', 't-info-edit', 't-group-edit', 't-group-create-dlg', 't-course-read', 't-course-content', 't-learn-excel', 't-cms-dlg', 't-meeting-dlg', 't-thumb-dlg', 't-qr-dlg', 't-cms-page', 's-learn', 's-assign', 's-assign-read', 's-assign-submit', 's-assign-confirm-dlg', 's-complete', 's-assign-read-empty', 's-qna', 's-qna-detail', 's-qna-detail-dlg', 's-board', 's-board-detail', 's-board-detail-dlg', 's-board-write', 's-like-course', 's-like-teacher', 's-learn-many', 's-info', 's-info-mail', 's-info-photo-dlg', 's-info-mail-dlg', 's-password'],
    title: '메뉴 검색칸의 ⌘K 표시 빼기',
    current: '메뉴 검색칸 오른쪽에 항상 `⌘K` 가 붙어 있다. ⌘ 는 맥 기호라 윈도우에서 보면 무슨 뜻인지 알 수 없고 — 학원 · 선생님 · 학생 대부분이 윈도우를 쓴다 — 작은 상자 모양이라 누를 수 있는 단추처럼 보인다. 기기에 맞춰 Ctrl K 로 바꿔도 결국 아는 사람만 아는 표시다',
    next: '표시를 뺀다. 단축키는 그대로 둔다 — 쓰는 사람은 이미 알고 있고, 모르는 사람에게는 읽을 것만 하나 는다. 대신 검색칸과 레일의 검색 단추에 올려놓으면 "메뉴 검색 (Ctrl K)" 가 뜨게 해서 찾을 길은 남긴다',
    css: `/* 검색칸 오른쪽 단축키 표시는 두지 않는다 */\n.cl-ws-search kbd { display: none; }`,
    markup: '`.cl-ws-search` 안의 `<kbd>⌘K</kbd>` 를 지운다. 검색칸 `input` 과 레일의 `[data-finder-open]` 에 `title="메뉴 검색 (Ctrl K)"` 를 둔다 — 맥에서는 `⌘K`. 맥 판별은 `navigator.userAgentData?.platform` 이 있으면 그 값, 없으면 `navigator.platform`.',
    dom: `const k=doc.querySelector('.cl-ws-search kbd'); if(k) k.remove();
const mac=/Mac|iPhone|iPad/.test((doc.defaultView.navigator.userAgentData&&doc.defaultView.navigator.userAgentData.platform)||doc.defaultView.navigator.platform||doc.defaultView.navigator.userAgent);
const tip='메뉴 검색 ('+(mac?'⌘K':'Ctrl K')+')';
const inp=doc.querySelector('.cl-ws-search input'); if(inp) inp.title=tip;
const rail=doc.querySelector('[data-finder-open]'); if(rail) rail.title=tip;`,
    targets: ['.cl-ws-search'],
    note: '단축키 동작은 표시와 상관없이 그대로 먹는다. 안내가 필요하면 이용 매뉴얼에 한 줄 적는 쪽이 화면을 깨끗하게 둔다.'
  },
  {
    id: 'A1', group: 2, status: '확정', kind: 'CSS', layer: '공통 틀', screens: ['a-main'],
    title: '학원 상단 메뉴 — 글자 15 → 17px, 사이 28 → 40px',
    current: '상단 메뉴가 15px 600 이고 메뉴 사이가 28px 이다. 같은 줄의 로고 글자는 17px 이라 헤더 안에서 두 크기가 섞인다. 본문은 공개 화면 단계(섹션 설명 21 · 강좌 제목 19 · 본문 17)를 쓰는데 메뉴만 작업공간 단계인 15px 이 남아 있어, 본문 최소 단계보다도 2px 작다. 다섯 개가 28px 간격으로 붙어 있어 한 덩어리로 보인다',
    next: '글자를 17px(`--cl-fs-body-public`)로 올려 로고와 키를 맞추고 본문 단계에 잇는다. 메뉴 사이는 40px. 56px 도 재어 봤지만 글자를 키운 상태에서는 간격이 글자보다 커져 한 메뉴 줄로 안 읽히고, 오른쪽 블록까지 40px 밖에 안 남아 학원 이름이 길거나 메뉴를 하나 더 켠 학원에서 바로 넘친다. 40px 이면 96px 이 남는다. 1100px 이하는 18 → 24px',
    css: `/* 헤더를 공개 화면 글자 단계에 맞춘다 — 로고 17px 과 같은 키 */\n.cl-pub-nav__item { font-size: var(--cl-fs-body-public); }\n.cl-pub-nav { gap: 40px; }\n@media (max-width: 1100px) { .cl-pub-nav { gap: 24px; } }`,
    targets: ['.cl-pub-nav'],
    note: '실제 화면(guest.lab241.com/user/main, 선생님 로그인)에 잠깐 입혀 폭을 쟀다. 17px · 40px 에서 메뉴 끝 1216px, 오른쪽 블록 시작 1256px 로 넘치지 않는다. 15px 은 public.css 에서 32곳에 쓰이므로 글자 단계 정리(181곳)와 함께 한 번에 옮기는 것이 낫다.'
  }
];

/* 개발 확인 메모 — 화면 수정이 아니라 권한 · 데이터를 정해야 하는 것. 개발자 전달 탭과 요청서에 따로 나온다. */
window.LAB_NOTES = [
  {
    id: 'R-1', level: '위험', area: '권한', screens: '선생님 › 그룹 관리', sid: 't-group', target: '.cl-row-menu__trigger',
    title: '선생님이 학원 전체 그룹을 지우거나 이름을 바꿀 수 있음',
    what: '선생님 화면 그룹 관리(`/user/teacher/group`)에 보이는 그룹 5개(테스트그룹 · 보충학습반 · lab241 · B반 · A반)가 관리자 그룹 목록 · 그룹 통계의 그룹과 같다 — 선생님 개인 그룹이 아니라 학원 전체 그룹으로 보인다. 그런데 선생님 행 메뉴에 [복사][이름 변경][삭제]가 있다.',
    impact: '선생님 한 명이 지우거나 이름을 바꾸면 다른 선생님의 강좌(그룹강좌 · 수강 대상), 관리자 그룹 통계 · 강좌 목록의 그룹 표시가 함께 바뀌거나 사라질 수 있다. 되돌릴 방법이 없다.',
    check: '1) 이 그룹 데이터가 학원 공용인지 선생님별인지(테이블 · 소유자 칸). 2) 선생님 권한으로 삭제 · 이름 변경 API 가 실제로 통과하는지(서버 권한 검사 여부). 3) 그룹을 지우면 연결된 강좌 · 수강생에 무슨 일이 생기는지.',
    options: '정할 것(기획): ① 선생님에게는 [삭제][이름 변경]을 숨기고 서버에서도 막는다(보기 · 편집만) ② 선생님이 직접 만든 그룹만 지울 수 있게 한다 ③ 지금이 의도라면 유지하되 삭제 확인창에 "이 그룹을 쓰는 강좌 n개 · 학생 n명"을 보여 준다. 어느 쪽이든 화면만 숨기지 말고 서버 권한 검사를 같이 둔다.',
    note: '실험실에서는 메뉴 구성만 확인했고 실제 삭제 · 이름 변경은 누르지 않았다.'
  }
];
