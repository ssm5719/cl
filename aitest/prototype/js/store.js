// 데모 저장소: 보는 사람의 브라우저(localStorage)에만 둔다. 막혀 있으면 메모리로만 동작한다.
const KEY = { exams: 'cl-exam-proto:exams', pasted: 'cl-exam-proto:pasted', rights: 'cl-exam-proto:rights' };

export function createStore(storage) {
  // 막힌 iframe 에서는 localStorage 를 읽기만 해도 예외가 난다.
  if (storage === undefined) { try { storage = globalThis.localStorage; } catch (e) { storage = null; } }
  const mem = { exams: [], pasted: [] };
  let persistent = true;
  const read = (name) => {
    try {
      const v = storage?.getItem(KEY[name]);
      mem[name] = v ? JSON.parse(v) : [];
    } catch (e) {
      persistent = false;
    }
    return mem[name];
  };
  const write = (name) => {
    try { storage?.setItem(KEY[name], JSON.stringify(mem[name])); } catch (e) { persistent = false; }
  };
  read('exams');
  read('pasted');
  if (!storage) persistent = false;

  return {
    get persistent() { return persistent; },
    listExams: () => [...mem.exams].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))),
    // 화면이 고치는 객체와 저장된 객체가 섞이지 않게 넣고 꺼낼 때 복사한다.
    getExam: (id) => { const e = mem.exams.find((x) => x.id === id); return e ? structuredClone(e) : null; },
    saveExam(exam) {
      const now = new Date().toISOString();
      const next = { createdAt: now, ...structuredClone(exam), updatedAt: now };
      mem.exams = [...mem.exams.filter((e) => e.id !== exam.id), next];
      write('exams');
      return next;
    },
    deleteExam(id) { mem.exams = mem.exams.filter((e) => e.id !== id); write('exams'); },
    copyExam(id) {
      const src = mem.exams.find((e) => e.id === id);
      if (!src) return null;
      const { createdAt, updatedAt, ...rest } = structuredClone(src);
      return this.saveExam({ ...rest, id: `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, title: `${src.title} (복사)`, status: 'draft' });
    },
    listPasted: () => [...mem.pasted],
    savePasted(paper) { mem.pasted = [...mem.pasted.filter((p) => p.id !== paper.id), paper]; write('pasted'); },
    rightsAgreed() {
      if (mem.rights) return true;
      try { mem.rights = storage?.getItem(KEY.rights) === '1'; } catch (e) { persistent = false; }
      return !!mem.rights;
    },
    agreeRights() { mem.rights = true; try { storage?.setItem(KEY.rights, '1'); } catch (e) { persistent = false; } },
    reset() { mem.exams = []; mem.pasted = []; write('exams'); write('pasted'); },
  };
}
