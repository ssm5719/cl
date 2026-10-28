"""데이터를 화면에 끼워 넣는다.

    python3 build.py          data/sample.json → data/data.js (저장소에 올리는 예시)
    python3 build.py --real   data/real.json 으로 아티팩트용 묶음을 dist/ 에 만든다 (저장소에 올리지 않음)
"""
import json
import re
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LAB_CSS = HERE.parent.parent / 'lab' / 'css'
LAB_FONTS = HERE.parent.parent / 'lab' / 'fonts'      # base.css 가 ../fonts/ 로 부른다
CSS_FILES = ['cl-tokens.css', 'base.css', 'components.css', 'teacher.css']
COPY = ['index.html', 'app.css', 'print.css', 'js']


def data_js(src: Path, artifact: bool = False) -> str:
    data = json.loads(src.read_text(encoding='utf-8'))
    flag = 'window.PT_ARTIFACT = true;\n' if artifact else ''
    return 'window.EXAM_DATA = ' + json.dumps(data, ensure_ascii=False) + ';\n' + flag


def artifact_html(html: str) -> str:
    """아티팩트는 doctype · html · head · body 틀을 스스로 씌운다. 그 태그만 걷어 내고 내용은 그대로 둔다."""
    html = html.replace('../../lab/css/', 'css/')
    html = re.sub(r'<!doctype[^>]*>|</?html[^>]*>|</?head>|</?body[^>]*>', '', html, flags=re.I)
    html = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', '', html)
    # 아티팩트 틀에도 charset 이 있지만, dist 를 로컬에서 바로 열어 볼 때 한글이 깨지지 않게 맨 앞에 둔다.
    return '<meta charset="utf-8">\n' + html.strip() + '\n'


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
    shutil.copytree(LAB_FONTS, dist / 'fonts')
    (dist / 'index.html').write_text(artifact_html((dist / 'index.html').read_text(encoding='utf-8')), encoding='utf-8')
    (dist / 'data').mkdir()
    (dist / 'data' / 'data.js').write_text(data_js(src, artifact=True), encoding='utf-8')
    print(f'dist/ ← data/real.json ({len(list(dist.rglob("*")))} 항목)')


if __name__ == '__main__':
    build_real() if '--real' in sys.argv else build_sample()
