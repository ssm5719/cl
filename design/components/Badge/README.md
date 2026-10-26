# Badge

행이나 카드의 상태를 한 단어로 보여 주는 표시다.

- 높이 22px, 좌우 8px, 반경 6px(토큰 없음), `cl-fs-micro` 500.
- 색은 글자 + 연한 배경 한 쌍으로만 쓴다: `--success`(`cl-success` / `cl-success-bg`), `--warning`, `--danger`, `--info`(`cl-primary-pressed` / `cl-primary-tint`), `--neutral`(`cl-ink-2` / `cl-hover`).
- 배지 안 글자는 상태 이름 하나. 문장을 넣지 않는다.
- 학생 목록 승인상태(승인 · 대기 · 탈퇴), 강좌 공개 여부에 쓴다.

## 지금 어긋난 곳

- 반경 6px 이 토큰 밖 값이다. 메뉴 항목 · 보기 전환 칸도 6px 을 직접 쓴다.
