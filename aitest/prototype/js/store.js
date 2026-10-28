// 데모 저장소: 보는 사람의 브라우저(localStorage)에만 둔다. 막혀 있으면 메모리로만 동작한다.
const KEY = { exams: 'cl-exam-proto:exams', pasted: 'cl-exam-proto:pasted' };

export function createStore(storage = globalThis.localStorage) {
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
    getExam: (id) => mem.exams.find((e) => e.id === id) || null,
    saveExam(exam) {
      const now = new Date().toISOString();
      const next = { createdAt: now, ...exam, updatedAt: now };
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
    reset() { mem.exams = []; mem.pasted = []; write('exams'); write('pasted'); },
  };
}
