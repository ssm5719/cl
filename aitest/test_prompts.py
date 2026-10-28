"""prompts.py 검사: cd aitest && python3 -m unittest test_prompts"""
import re
import unittest
from pathlib import Path

import prompts as P

CONSTANTS = Path(__file__).resolve().parent / 'prototype' / 'js' / 'constants.js'


def group_keys():
    """프로토타입 constants.js 의 GROUPS 에서 과목별 묶음 키를 읽는다."""
    text = CONSTANTS.read_text(encoding='utf-8')
    out = {}
    for subject in ('영어', '국어'):
        block = re.search(subject + r': \[(.*?)\n  \]', text, re.S).group(1)
        out[subject] = re.findall(r"key: '(\w+)'", block)
    return out


class PromptsTest(unittest.TestCase):
    def test_group_presets_match_prototype_groups(self):
        keys = group_keys()
        self.assertEqual(len(keys['영어']), 7)
        self.assertEqual(len(keys['국어']), 6)
        for subject, ks in keys.items():
            self.assertEqual(sorted(P.GROUP_PRESETS[subject]), sorted(ks), subject)

    def test_writing_preset_asks_for_model_answer_and_rubric(self):
        for subject in ('영어', '국어'):
            text = P.GROUP_PRESETS[subject]['writing']
            self.assertIn('answer_text', text)
            self.assertIn('rubric', text)

    def test_gen_schema_has_subtype_form_rubric(self):
        item = P.GEN_SCHEMA['properties']['items']['items']
        for key in ('subtype', 'form', 'rubric'):
            self.assertIn(key, item['required'])
        self.assertEqual(item['properties']['form']['enum'], ['5지', '4지', 'OX', '서답'])


if __name__ == '__main__':
    unittest.main()
