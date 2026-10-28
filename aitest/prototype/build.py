"""데이터를 화면에 끼워 넣는다.

    python3 build.py          data/sample.json → data/data.js (저장소에 올리는 예시)
    python3 build.py --real   data/real.json 으로 아티팩트용 묶음을 dist/ 에 만든다 (저장소에 올리지 않음)
"""
import json
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LAB_CSS = HERE.parent.parent / 'lab' / 'css'
CSS_FILES = ['cl-tokens.css', 'base.css', 'components.css', 'teacher.css']
COPY = ['index.html', 'app.css', 'print.css', 'js']


def data_js(src: Path) -> str:
    data = json.loads(src.read_text(encoding='utf-8'))
    return 'window.EXAM_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n'


def build_sample():
    (HERE / 'data' / 'data.js').write_text(data_js(HERE / 'data' / 'sample.json'), encoding='utf-8')
    print('data/data.js ← data/sample.json')


def build_real():
    src = HERE / 'data' / 'real.json'
    if not src.exists():
        print('data/real.json 이 없습니다. aitest/prototype/tools/to_real.py 로 먼저 만드세요.')
        sys.exit(1)
    dist = HERE / 'dist'
    shutil.rmtree(dist, ignore_errors=True)
    dist.mkdir()
    for name in COPY:
        p = HERE / name
        if p.is_dir():
            shutil.copytree(p, dist / name)
        else:
            shutil.copy2(p, dist / name)
    (dist / 'css').mkdir()
    for name in CSS_FILES:
        shutil.copy2(LAB_CSS / name, dist / 'css' / name)
    html = (dist / 'index.html').read_text(encoding='utf-8').replace('../../lab/css/', 'css/')
    (dist / 'index.html').write_text(html, encoding='utf-8')
    (dist / 'data').mkdir()
    (dist / 'data' / 'data.js').write_text(data_js(src), encoding='utf-8')
    print(f'dist/ ← data/real.json ({len(list(dist.rglob("*")))} 항목)')


if __name__ == '__main__':
    build_real() if '--real' in sys.argv else build_sample()
