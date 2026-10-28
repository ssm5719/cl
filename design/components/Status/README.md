# Status

작은 상태 표시 묶음 — 숫자 알약 · 점 + 글자 상태 · 지울 수 있는 칩 · 올리면 보이는 동작. 2026.10.28 화면 전용 클래스에서 공통으로 올림.

## 숫자 알약 `cl-count`

탭 · 작은 제목 옆 개수. 높이 20 · 최소 20 · 좌우 6, `cl-radius-pill`, 바탕 `cl-hover`, 글자 `cl-fs-micro` 500 `cl-ink-muted`. 고른 탭 안(`[aria-selected="true"] > .cl-count`)이나 `--active` 는 `cl-primary-tint` · `cl-primary-pressed`.

## 점 + 글자 `cl-status`

표 안 상태처럼 배지보다 조용해야 할 때. 6px 점 + 글자, 사이 6.

| 클래스 | 색 | 예 |
| --- | --- | --- |
| `cl-status--ok` | `cl-success` · 꽉 찬 점 | 승인 |
| `cl-status--wait` | `cl-warning` · 빈 점(1.5px 테두리) | 대기 |
| `cl-status--off` | `cl-ink-muted` | 꺼짐 |

## 지울 수 있는 칩 `cl-tag`

높이 30, 알약, 바탕 `cl-hover`, 글자 `cl-fs-ui`. 끝에 ✕ `cl-tag__x`(24 원, 올리면 `cl-danger-bg` · `cl-danger`). 칩을 눌러도 지워지지 않고 ✕ 만 지운다. 지우면 공통 토스트로 되돌리기.

## 올리면 보이는 동작 `cl-reveal`

표 · 목록 줄(tr · li · `.cl-row`)에 올리거나 키보드로 들어가면 나타나는 작은 버튼(복사 · 들어가기). 평소 투명 · 자리는 그대로, 터치 화면은 늘 보인다. `display:none` 이 아니라 투명도라 키보드 · 화면 읽기에서도 닿는다.

```html
<button class="cl-icon-btn cl-icon-btn--xs cl-reveal" aria-label="원문 복사">…</button>
<button class="cl-btn cl-btn--ghost cl-btn--xs cl-reveal">들어가기</button>
```

옛 클래스: `.cl-ptab .cl-num` · `.cl-tpop__label .cl-num` → `cl-count`, `.cl-ma-state` → `cl-status`, `.cl-mm-kw` → `cl-tag`, `.cl-ua-copy` · `.cl-mt-enter` → `cl-reveal`.
