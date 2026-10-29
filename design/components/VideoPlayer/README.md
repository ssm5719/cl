# VideoPlayer

강의 영상을 보는 플레이어의 조작 줄 — 영상 위 그라데이션에 진행 막대 · 버튼 줄을 얹고, 보는 동안에는 저절로 숨는다. 2026.10.29 (실험실 NL1).

실제 플레이어는 학원 사이트와 따로 도는 서비스(LABY 플레이어 v2.0 · cms.atedu.co.kr, video.js 7 위 직접 만든 조작 줄)다. 그쪽은 이 CSS 를 불러오지 않으므로 플레이어 담당이 아래 값과 `cl-vplayer` 규칙을 옮겨 쓴다. 전달 문서: `handoff/08-동영상플레이어.md`.

## 구성

| 부분 | 클래스 | LABY 플레이어 | 값 |
| --- | --- | --- | --- |
| 틀 | `cl-vplayer` (`data-state="playing · paused"`, 숨김 `is-idle`) | `#player-wrap` | 16:9, 바탕 `cl-player-bg` |
| 가운데 재생 | `cl-vplayer__center` | `.btn-center-play` | 72 원, `cl-player-center`, 아이콘 32. 멈췄을 때만 |
| 조작 줄 | `cl-vplayer__bar` | `#player-footer` | 위 32 · 좌우 12 · 아래 8, 투명 → `cl-player-scrim` 그라데이션 |
| 진행 막대 | `cl-vplayer__seek` + `__track · __buffer · __played · __thumb · __tip` | `.progress-gage-wrap` | 누르는 높이 16, 막대 4(올리면 6). 본 부분 `cl-primary`, 받은 부분 `cl-player-buffer`, 바탕 `cl-player-line`. 손잡이 14 흰 원은 올렸을 때만, 시간 말풍선 `cl-player-tip` |
| 버튼 줄 | `cl-vplayer__controls` · `__btn` (`--jump`) · `__spacer` | `.player-controller-box` | 높이 44, 버튼 40 원 · 아이콘 22, 올리면 `cl-player-hover` 원 |
| 음량 | `cl-vplayer__volume` · `__vol-range` · `__vol-level` | `.btn-mute` + `.volume-wrap` | 막대는 올리거나 키보드로 들어갈 때 72로 펼침, 바탕 `cl-player-vol-track` |
| 시간 | `cl-vplayer__time` | `.playtime-wrap` | `cl-fs-13` 고정폭 숫자, 전체 시간 `cl-player-text-2` |
| 배속 | `cl-vplayer__speed` · `__speed-btn` · `__menu` | `.btn-setting` | 글자 알약 32(`1.0x`), 바탕 `cl-player-hover`. 목록은 위로, 바탕 `cl-player-panel`, 고른 값 `cl-primary-on-dark` |

순서(왼쪽부터): 재생/일시정지 · 10초 뒤로 · 10초 앞으로 · 음량 · 시간 ··· 배속 · 전체 화면. 정지 버튼은 두지 않는다(일시정지와 같은 일).

## 동작

- **숨김**: 재생 중 마우스를 3초 가만히 두면 `is-idle` — 조작 줄이 250ms 동안 사라지고 커서도 숨는다. 영상 밖으로 나가면 기다리지 않고 바로 사라진다. 움직이면 바로 다시 보인다.
- **숨기지 않을 때**: 멈춤 상태, 키보드 포커스가 조작 줄 안에 있을 때, 배속 목록이 열려 있을 때.
- **음소거**: 스피커를 누르면 X 스피커(`player-mute`)로 바뀌고 막대는 0, 다시 누르면 이전 음량. `aria-pressed` 로 상태를 알린다.
- **배속**: 0.5 · 1.0 · 1.2 · 1.5 · 2.0. 고르면 목록이 닫히고 버튼 글자가 바뀐다.
- **좁을 때(플레이어 폭 520 이하 — 휴대폰 · 좁은 칸)**: 10초 뒤로 · 앞으로와 음량 막대를 숨기고 버튼 36. 화면 폭이 아니라 플레이어 폭으로 정한다(`container-type: inline-size`).
- **움직임 줄이기 설정**: 사라짐 · 막대 굵어짐 애니메이션을 끈다(숨김 자체는 그대로).

## 아이콘

Icons 묶음의 `player-play` · `player-pause` · `player-back-10` · `player-forward-10` · `player-volume` · `player-mute` · `player-fullscreen` · `player-fullscreen-exit`. 24 격자, 선 굵기 2(영상 위에서 22px 로 보이므로 작업공간 1.75 보다 굵다), 재생 · 일시정지는 채운 모양. 색은 `currentColor`(흰색).

## 쓰지 않는 것

- 영상 위 색은 테마(라이트 · 다크)와 상관없이 `cl-player-*` 토큰만 쓴다. `cl-canvas` · `cl-ink` 처럼 테마에 따라 뒤집히는 토큰을 쓰지 않는다.
- 모서리: 틀만 `cl-radius-sm`. 버튼은 원(`cl-radius-pill`) — 영상 위 아이콘 버튼이라 작업공간 버튼(4px)과 다르다.
