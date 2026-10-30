# Footer

관리자 · 선생님 · 학생 작업공간 맨 아래 얇은 한 줄. 세로로 긴 화면이 마지막 줄에서 잘린 듯 끝나지 않게 하고, 짧은 화면에서는 창 맨 아래에 붙는다. 2026.10.30 (실험실 NW1).

- 자리: 공통 틀 `<main class="cl-ws-main">` 맨 끝(`.cl-page` 다음). 푸터가 있으면 `cl-ws-main` 이 세로 흐름이 되고 푸터는 `margin-top: auto` 로 아래에 붙는다.
- `cl-ws-footer`: 본문과 사이 `cl-space-7`(48), 좌우 `--cl-ws-gutter`(본문과 같은 여백).
- `cl-ws-footer__inner`: 위 1px `cl-hairline` 선, 안쪽 위 `cl-space-4` · 아래 `cl-space-5`. 글자 `cl-fs-micro` 500 `cl-ink-muted`. 양 끝 정렬, 좁으면 두 줄로 내려간다.
- 왼쪽 "© 2022–{올해} Lab241 Co., Ltd. All rights reserved." — 끝 연도는 서버에서 올해로.
- 오른쪽 `cl-ws-footer__links`: [클라우드러닝 포털] [Powered by Lab241 · 올댓에듀케이션 소개], 사이 `cl-space-4`. 링크도 `cl-ink-muted`, 올리면 `cl-ink`. 밑줄 없음.
- 학원 공개 화면은 큰 푸터(`cl-pub-footer`)가 있고, 그 맨 아래 줄(`cl-pub-footer__bottom`)과 같은 모양이다.

```html
<footer class="cl-ws-footer"><div class="cl-ws-footer__inner">
  <span>© 2022–2026 Lab241 Co., Ltd. All rights reserved.</span>
  <span class="cl-ws-footer__links"><a href="…">클라우드러닝 포털</a><a href="…">Powered by Lab241 · 올댓에듀케이션 소개</a></span>
</div></footer>
```
