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

## 크기

높이는 기본 `cl-h-control`(32px), `--sm` 28px, `--xs` 26px, `--lg` `cl-touch`(44px). 좌우 여백 12px(`--sm` 10, `--xs` 8, `--lg` 20). 반경 `cl-radius-sm`(8px), `--xs` 만 6px. 글자 600, `--sm` · `--xs` 는 `cl-fs-caption` · `cl-fs-micro`, `--lg` 는 15px.

아이콘 버튼은 `cl-icon-btn` 32×32, 배경 없음, hover `cl-hover`. 터치 기기에서는 보이는 크기는 두고 누르는 영역만 44px로 넓힌다.

비활성: `--primary` 는 `cl-ink-faint` 배경, 나머지는 불투명도 .5.

## 지금 어긋난 곳

- 선생님 작업공간은 상단 바 [새로 만들기]와 본문 [강좌 생성]이 둘 다 `--primary` 다. 한 화면에 꽉 찬 보라가 둘이다 (점검 3).
- `--danger` hover 가 `#A8191A` 직접 값, `--tint` hover 가 `#E9DDFB` 직접 값이다.
- `--lg` 의 15px 는 글자 단계에 없다.
