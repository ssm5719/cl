# Avatar

사람을 나타내는 원형 사진 자리. 사진이 없으면 이름 첫 글자를 넣는다.

- 28×28, 반경 `cl-radius-pill`, 기본 바탕 `cl-ink` + 흰 글자 12px 700.
- `--tint`: `cl-primary-tint` 바탕 + `cl-primary-pressed` 글자. 사이드바 내 정보 칸에 쓴다.
- 표 안 사진 `cl-mt-avatar` 도 28×28, 사진이 늦게 올 때 바탕 `cl-hover`.
- 미리보기는 사진 대신 첫 글자로 그렸다.

## 학원 공개 화면 — 사진 없는 선생님 (2026.10.28)

사진이 없으면 `cl-avatar cl-avatar--ph`(2026.10.28 `cl-avatar-ph` 에서 바꿈): `--cl-primary-wash` 원 가운데에 메인(AM10) 선 사람 아이콘 60%. 세로 사진용 회색 그림(`default-person.svg`)은 원 안에서 머리가 잘려 쓰지 않는다. 크기 변형: 기본 28 · `--md` 32(머리 계정) · `--lg` 44(작은 창 사람 카드) · `--fill`(칸 가득). **머리 계정 버튼(`.cl-ws-account`) 안에서만** 바탕 `cl-primary` + 흰 아이콘(`cl-on-ink`) — 연보라 위 연보라 아이콘은 작은 32 원에서 잘 안 보여서(2026.10.29). 자세히는 [`../AcademyPublic/README.md`](../AcademyPublic/README.md).
