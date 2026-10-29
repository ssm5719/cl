# Composer

짧은 입력 — 질문 · 댓글을 그 자리에서 빠르게 쓴다. 긴 글 · 첨부는 [자세히 쓰기 ↗] 로 원래 쓰기 화면에 넘긴다. 2026.10.28 (강의 보기 '이 강의 질문하기').

- 입력칸 `cl-composer__input`: 3줄(88)에서 시작해 글에 맞춰 180까지 늘어남(`field-sizing: content`), 안쪽 12 · 14, 테두리 `cl-control-border`, 모서리 `cl-radius-control`(4px), 글자 `cl-fs-ui` 1.6. 포커스는 테두리 `cl-primary` + 3px `cl-primary-tint` 번짐.
- 아래 한 줄 `cl-composer__row`: [보조 링크 `cl-composer__more`(13 회색)] … [취소 ghost][등록 primary] 32.
- Enter 등록 · Shift+Enter 줄바꿈. 안내는 입력칸 안 흐린 글자로(따로 줄을 두지 않는다).
- 등록 뒤 `cl-composer__done`(13 `cl-success`) 한 줄을 3초 보이고 닫는다.
- 열기 전에는 버튼 하나(`cl-btn cl-btn--line cl-btn--pill`)로 접어 둔다.

```html
<form class="cl-composer"><textarea class="cl-composer__input" rows="3" placeholder="…"></textarea>
<div class="cl-composer__row"><a class="cl-composer__more" href="…" target="_blank">파일 첨부 · 자세히 쓰기 ↗</a><button class="cl-btn cl-btn--ghost" type="button">취소</button><button class="cl-btn cl-btn--primary">등록</button></div></form>
```
옛 클래스 `.cl-ask` · `.cl-ask__row` · `.cl-ask__more` · `.cl-ask__done` → 위로.
