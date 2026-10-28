# Link

글자로 된 동작 링크 두 가지. 버튼 모양이 과한 자리(표 안 · 도움말 안 · 섹션 머리 끝)에 쓴다. 2026.10.28 공통으로 올림.

| 클래스 | 모양 | 쓰는 곳 |
| --- | --- | --- |
| `cl-link` | `cl-primary-pressed` 600, 평소 밑줄 없음 · 올리면 밑줄(3px 띄움) | 표 옆 [학생 통계에서 보기] |
| `cl-link--muted` | `cl-ink-2`, 올리면 `cl-primary-pressed` | 선생님 상세 강좌 줄 [선생님 계정으로 열기] |
| `cl-link--danger` | `cl-danger` + 늘 밑줄, 올리면 `cl-danger-pressed` | 도움말 안 [비밀번호 초기화] |
| `cl-more-link` | `cl-primary-pressed` 600 + 꺾쇠 › , 올리면 밑줄. 글자 크기는 놓인 자리를 따른다 | 섹션 머리 [전체 보기 ›] · [학원소개 보기 ›] |

- `button` 에도 `a` 에도 쓴다(`cl-link` 는 버튼 기본 모양을 지운다).
- 크기 · 간격은 놓인 자리 규칙에서 정한다(예: 메인 `.cl-home .cl-more-link` 는 17 · 누르는 높이 44).
- 옛 클래스: `.cl-gs-link` · `.cl-mt-course__open` · `.cl-pw-reset` · `.cl-home-more` · `.cl-cs-more` → 위로.
