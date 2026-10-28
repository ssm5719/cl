// 화면과 계산이 함께 쓰는 정해진 값. 묶음 · 세부 유형은 설계 문서 4장 표 그대로.

export const SUBJECTS = ['영어', '국어'];
export const KINDS = ['수능', '모의평가', '학력평가', '내신', '직접 추가'];
export const GRADES = ['고1', '고2', '고3'];
export const FORMS = ['5지', '4지', 'OX'];
export const LEVELS = ['원래', '쉽게', '어렵게', '섞어서'];
export const LEVEL_LABEL = { 원래: '원래 수준', 쉽게: '쉽게', 어렵게: '어렵게', 섞어서: '섞어서' };

const NOT_FOR_NOTICE = ['안내문', '도표'];
const all = () => true;
const notNotice = (u) => !NOT_FOR_NOTICE.includes(u.type_label);

export const GROUPS = {
  영어: [
    { key: 'main', label: '대의 파악', subtypes: ['주제', '제목', '요지', '주장', '목적'], fits: all },
    { key: 'detail', label: '세부 내용', subtypes: ['내용 일치', '내용 불일치', '답할 수 없는 질문'], fits: all },
    { key: 'blank', label: '빈칸', subtypes: ['한 단어', '구/절'], fits: notNotice },
    { key: 'flow', label: '글의 흐름', subtypes: ['순서', '순서(처음 · 끝 고정)', '문장 삽입', '무관한 문장'], fits: notNotice },
    { key: 'summary', label: '요약문', subtypes: ['(A)(B) 요약문'], fits: notNotice },
    { key: 'grammar', label: '어법 · 어휘', subtypes: ['어법 밑줄', '어법 개수', '어휘 밑줄', '어휘 개수', '의미가 같은 것', '고난도 내신형'], fits: all },
    { key: 'writing', label: '서술형', subtypes: ['요약문 빈칸 쓰기', '어법 틀린 곳 고치기', '조건 영작', '주제문 쓰기'], fits: all },
  ],
  국어: [
    { key: 'fact', label: '사실적 읽기', subtypes: ['내용 일치', '세부 정보 확인'], fits: all },
    { key: 'infer', label: '추론적 읽기', subtypes: ['내용 추론', '견해 비교', '전제 · 이유'], fits: all },
    { key: 'apply', label: '<보기> 적용 · 비판', subtypes: ['구체적 사례 적용', '외적 준거 감상'], fits: all },
    { key: 'vocab', label: '어휘', subtypes: ['문맥상 의미', '바꿔 쓰기'], fits: all },
    { key: 'lit', label: '표현 · 감상', subtypes: ['표현상 특징', '시어 · 시구 의미', '인물 태도'], fits: (u) => u.genre === '문학' },
    { key: 'writing', label: '서술형', subtypes: ['요약 쓰기', '근거 찾아 쓰기'], fits: all },
  ],
};

export const ORIGINAL = { key: 'original', label: '원래 유형 그대로', subtypes: [], fits: all };

export function groupOf(subject, key) {
  if (key === ORIGINAL.key) return ORIGINAL;
  return GROUPS[subject].find((g) => g.key === key);
}

export const FLAGS = {
  solve_mismatch: '다시 풀었더니 답이 다름',
  no_evidence: '근거 문장이 지문에 없음',
  answer_leak: '원래 정답 노출 의심',
  type_changed: '유형 바꿈',
};

export const RULES = ['원래 문항의 정답이 새 문항에 드러나지 않게', '정답 번호 고르게', '고른 지문 안에서만 출제'];

export const TEXT = {
  figureBlocked: '그림이 있어 자동 출제에서 빠져요',
  demoSubstitute: '데모: 미리 만든 문항으로 대신 보여 줘요',
  noDemoItems: (numbers) => `${numbers}번은 데모 문항이 없어요`,
  demoHas: '데모 문항 있음',
  demoNone: '데모 문항 없음',
  demoPaste: '데모에서는 붙여 넣은 지문으로 문항이 나오지 않아요. 실제 서비스에서는 AI가 바로 만들어요.',
  demoNoneSelected: '고른 지문에 데모 문항이 없어요. 보관함에서 데모 문항 있는 지문을 함께 골라 주세요',
};

export const CIRCLED = ['①', '②', '③', '④', '⑤'];
