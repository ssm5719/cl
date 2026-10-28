# Tabs

한 목록을 상태별로 나눠 볼 때 쓴다(학생 목록: 전체 · 승인 · 대기 · 탈퇴, 강좌 관리: 과목별).

- 탭 높이 40px, 좌우 12px, 글자 600 `cl-ink-muted`. 고른 탭은 `cl-ink` + 아래 2px `cl-ink` 선.
- 탭 줄 아래 1px `cl-grid-head`. 넘치면 가로로 스크롤한다.
- 개수는 `cl-tab__count`(`cl-fs-micro` 500 `cl-ink-muted`).
- 탭은 화면 머리(설명) 아래, 도구 줄 위에 둔다.

## 학원 공개 화면의 좁은 칸 탭 (2026.10.28)

줄 탭 `cl-tabs cl-tabs--line`(안의 탭은 그대로 `cl-tab`): 글자 `cl-fs-body-sm-pub`(15) 500, 고른 탭 600 + 아래 2px `cl-primary` 선, 탭 사이 24, 줄 아래 1px `cl-hairline`. 개수는 숫자 알약 `cl-count`(20 높이 · 알약 · `cl-hover`, 고른 탭 안에서는 연보라). 강의 보기 오른쪽 칸 [강의 목록 | 관련 질문] 에 쓴다. 2026.10.28 에 `cl-ptabs` · `cl-ptab` 에서 바꿨다.

```html
<div class="cl-tabs cl-tabs--line" role="tablist"><button class="cl-tab" role="tab" aria-selected="true">강의 목록 <span class="cl-count">20</span></button><button class="cl-tab" role="tab" aria-selected="false">관련 질문 <span class="cl-count">3</span></button></div>
```

## 지금 어긋난 곳

- 강좌 관리(선생님)는 설명 줄 없이 제목 바로 아래에 탭이 온다.
