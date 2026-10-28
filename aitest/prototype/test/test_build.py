"""build.py 검사: python3 -m unittest test/test_build.py (aitest/prototype 에서)"""
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent      # aitest/prototype
REPO = HERE.parent.parent                            # 저장소 루트


def copy_tree():
    tmp = Path(tempfile.mkdtemp())
    (tmp / 'lab').mkdir()
    shutil.copytree(REPO / 'lab' / 'css', tmp / 'lab' / 'css')
    shutil.copytree(REPO / 'lab' / 'fonts', tmp / 'lab' / 'fonts')
    dst = tmp / 'aitest' / 'prototype'
    shutil.copytree(HERE, dst, ignore=shutil.ignore_patterns('dist', 'real.json', 'node_modules'))
    return dst


def run(cwd, *args):
    return subprocess.run([sys.executable, 'build.py', *args], cwd=cwd, capture_output=True, text=True)


class BuildTest(unittest.TestCase):
    def test_sample_data_js(self):
        d = copy_tree()
        r = run(d)
        self.assertEqual(r.returncode, 0, r.stderr)
        text = (d / 'data' / 'data.js').read_text(encoding='utf-8')
        self.assertTrue(text.startswith('window.EXAM_DATA = '))
        data = json.loads(text[len('window.EXAM_DATA = '):].rstrip().rstrip(';'))
        self.assertEqual(data['demo'], 'sample')

    def test_real_requires_file(self):
        d = copy_tree()
        r = run(d, '--real')
        self.assertEqual(r.returncode, 1)
        self.assertIn('data/real.json 이 없습니다', r.stdout + r.stderr)

    def test_real_builds_dist(self):
        d = copy_tree()
        sample = json.loads((d / 'data' / 'sample.json').read_text(encoding='utf-8'))
        sample['demo'] = 'real'
        (d / 'data' / 'real.json').write_text(json.dumps(sample, ensure_ascii=False), encoding='utf-8')
        r = run(d, '--real')
        self.assertEqual(r.returncode, 0, r.stderr)
        html = (d / 'dist' / 'index.html').read_text(encoding='utf-8')
        self.assertNotIn('../../lab/css', html)
        self.assertTrue((d / 'dist' / 'css' / 'teacher.css').exists())
        # base.css 가 ../fonts/ 로 글꼴을 부른다.
        self.assertTrue((d / 'dist' / 'fonts' / 'PretendardVariable.woff2').exists())
        self.assertTrue((d / 'dist' / 'js' / 'views').is_dir())
        self.assertIn('"demo": "real"', (d / 'dist' / 'data' / 'data.js').read_text(encoding='utf-8').replace('"demo":"real"', '"demo": "real"'))
        # 아티팩트는 문서 틀(doctype · html · head · body)을 스스로 씌우므로 화면 파일에는 내용만 둔다.
        low = html.lower()
        for tag in ('<!doctype', '<html', '<head>', '<body', '</body>', '</html>'):
            self.assertNotIn(tag, low)
        self.assertIn('<title>시험 출제 프로토타입</title>', html)
        self.assertIn('class="cl-scope cl-ws-body"', html)
        # 아티팩트 화면에서는 인쇄가 막혀 있어 인쇄 버튼 대신 안내를 보인다.
        self.assertIn('window.PT_ARTIFACT = true', (d / 'dist' / 'data' / 'data.js').read_text(encoding='utf-8'))
        # 저장소 쪽 data.js 는 예시 그대로
        self.assertIn('"sample"', (d / 'data' / 'data.js').read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
