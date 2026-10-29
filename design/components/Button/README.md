# Button

화면에서 누르는 동작은 모두 `cl-btn` 하나에 종류와 크기를 붙여 만든다.

## 종류

| 클래스 | 모양 | 쓰는 곳 |
| --- | --- | --- |
| `cl-btn--primary` | `cl-primary` 배경, 흰 글자. hover `cl-primary-pressed` | 화면의 주 동작 (선생님 생성, 강좌 생성, 과목 추가) |
| `cl-btn--tint` | `cl-primary-tint` 배경, `cl-primary-pressed` 글자 | 주 동작 다음으로 중요한 것 |
| `cl-btn--ghost` | `cl-canvas` 배경 + `cl-ring` 1px 링, `cl-ink` 글자 | 보조 동작 (노출 순서, 엑셀, 새로고침) |
| `cl-btn--text` | 배경 없음 | 초기화, 취소 |
| `cl-btn--danger` | `cl-danger` 배경, 흰 글자 | 삭제 확인 대화상자 안에서만 |
| `cl-btn--soft` | `cl-parchment` 배경, `cl-ink` 글자. hover `cl-hover`. 회색 판(`.is-alt`) 위에서는 흰 바탕 | 공개 화면 보조 동작 — 공유 · 좋아요 · 새 창 · 학원 SNS · 메인 보조 버튼 · 선생님 소개 전체 보기 |
| `cl-btn--dark` | `cl-ink` 배경, 흰 글자. hover `cl-surface-dark-hover` | 공개 화면 머리의 주 동작(로그인) |
| `cl-btn--line` | 흰 바탕 + `cl-primary-line` 1px 링, `cl-primary-pressed` 글자 500. hover 링 `cl-primary` | 연보라 판 위의 작은 동작(이 강의 질문하기) |
| `cl-btn--float` | 흰 바탕 + `cl-shadow-float`, hover `cl-hover` | 회색 판 위 목록 끝 하나(분류 더보기) |
| `cl-btn--on-dark` | 투명 + 흰 1px 링 + 흰 글자 | 진한 판(메인 아래 CTA) 위 보조 버튼 |
| `cl-btn--undo` | `cl-canvas` 배경 + `cl-control-border` 1px 링, `cl-ink-2` 글자 500, 회색 아이콘. 올리면 같은 자리에서 `cl-danger` 글자 · 테두리로 되돌리는 동작 | 이미 된 상태를 되돌리는 버튼 (✓ 수강중 → 수강 취소). 안에 `cl-btn__now` · `cl-btn__undo` 두 글자를 겹쳐 둔다. 누르면 `cl-dialog--confirm` |

모양 덧붙이기: `cl-btn--pill` 은 모서리만 `cl-radius-pill` 로 둥글게 한다. 공개 화면의 작은 동작(수강신청 = `cl-btn--tint cl-btn--pill`, 수강중 = `cl-btn--undo cl-btn--pill`)에 쓴다.

## 크기

높이는 기본 `cl-h-control`(32px), `--sm` 28px, `--xs` 26px, `--md` 36px(글자 `cl-fs-ui` 500 — 공개 화면 알약), `--lg` `cl-touch`(44px), `--xl` 48px(글자 `cl-fs-body-public` — 메인 첫 칸 · CTA). `--block` 은 칸 폭 가득. 좌우 여백 12px(`--sm` 10, `--xs` 8, `--lg` 20). 반경 `cl-radius-control`(4px) — 모든 크기 같다. 아이콘 버튼(`cl-icon-btn`)도 4px, `--round` · `--pill` 만 동그랗게. 글자 600, `--sm` · `--xs` 는 `cl-fs-caption` · `cl-fs-micro`, `--lg` 는 15px.

버튼 끝 화살표 `cl-btn__arrow` 는 올리면 4px 앞으로 간다(움직임 줄이기 설정이면 멈춤).

아이콘 버튼은 `cl-icon-btn` 32×32, 배경 없음, hover `cl-hover`. 크기 `--xs` 26 · `--md` 36 · `--lg` 44, 모양 `--round`(원), 바탕 `--soft`(회색 원, hover 연보라 — 더보기 원 · 가로 목록 ‹ ›), `--on-dark`(진한 판 위 흰 12%). 터치 기기에서는 보이는 크기는 두고 누르는 영역만 44px로 넓힌다.

비활성: `--primary` 는 `cl-ink-faint` 배경, 나머지는 불투명도 .5.

## 상태를 보여 주면서 되돌리는 버튼 (2026.10.28)

`cl-btn--undo` 를 쓴다. 평소에는 조용한 회색 테두리 버튼으로 상태만 보이고, 마우스를 올리거나 키보드로 고르면 **같은 자리 같은 크기**(최소 88px)에서 위험 색 글자로 바뀌어 할 일을 미리 보여 준다. 누르면 확인 창(`cl-dialog--confirm`). 터치 화면(`hover: none`)은 바뀌지 않고 바로 확인 창.

```html
<button class="cl-btn cl-btn--undo cl-btn--pill"><span class="cl-btn__now"><svg class="cl-icon">…check…</svg>수강중</span><span class="cl-btn__undo">수강 취소</span></button>
<button class="cl-btn cl-btn--tint cl-btn--pill"><svg class="cl-icon">…plus…</svg>수강신청</button>
```

## 화면 전용 버튼을 공통 Button 으로 (NX1 · 2026.10.28)

공개 화면에 따로 만들어져 있던 버튼 클래스는 아래처럼 바꾼다. 새 화면에서 이 클래스들을 다시 만들지 않는다.

| 옛 class | 공통 class |
| --- | --- |
| `.cl-cd-pill` | `cl-btn cl-btn--soft cl-btn--md cl-btn--pill` |
| `.cl-home-pill` (학원 SNS) | `cl-btn cl-btn--soft cl-btn--md cl-btn--pill` (메인 40 → 36) |
| `.cl-home-btn` | `cl-btn cl-btn--primary cl-btn--xl cl-btn--pill` |
| `.cl-home-btn--soft` | `cl-btn cl-btn--soft cl-btn--xl cl-btn--pill` · 진한 CTA 안은 `cl-btn--on-dark` |
| `.cl-home-more-btn` | `cl-btn cl-btn--float cl-btn--pill` + `cl-btn__arrow` |
| `.cl-ask-btn` | `cl-btn cl-btn--line cl-btn--pill` |
| `.cl-tpop__all` | `cl-btn cl-btn--soft cl-btn--md cl-btn--block` |
| `.cl-home-slider__ctl` | `cl-icon-btn cl-icon-btn--round cl-icon-btn--soft cl-icon-btn--lg` |
| `.cl-home-tile__more` | `cl-icon-btn cl-icon-btn--round cl-icon-btn--soft` · 검은 선생님 칸은 `--on-dark` |
| `.cl-home-more` · `.cl-cs-more` | `cl-more-link` (Link 참고) |
| `.cl-ua-copy` | `cl-icon-btn cl-icon-btn--xs cl-reveal` |
| `.cl-mt-enter` | `cl-btn cl-btn--ghost cl-btn--xs cl-reveal` |

머리 바의 `.cl-pub-btn-pill` · `.cl-pub-icon-btn` 은 공개 머리 바(Topbar) 부품이라 그대로 둔다.

## 지금 어긋난 곳

- 선생님 작업공간은 상단 바 [새로 만들기]와 본문 [강좌 생성]이 둘 다 `--primary` 다 (점검 3). 2026.10.29 결정: 상단 [새로 만들기]는 꽉 찬 보라 그대로 둔다(연보라로 바꾸는 C1 은 보류).
- (해결 2026.10.28) hover 직접 값 · `--lg` 15px 는 토큰(`cl-danger-pressed` · `cl-primary-tint-hover` · `cl-fs-15`)으로 바꿨다.
