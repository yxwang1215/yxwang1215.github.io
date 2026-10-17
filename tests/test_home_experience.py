"""Regression checks for the unified experience section and paper-original covers."""
import json
import re
from pathlib import Path
import unittest
from html.parser import HTMLParser
ROOT = Path(__file__).resolve().parents[1]

class Elements(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
    def handle_starttag(self, tag, attrs):
        self.items.append((tag, dict(attrs)))

class ExperienceTest(unittest.TestCase):
    def test_section_order_and_preservation(self):
        text = (ROOT / '_pages/about.md').read_text()
        self.assertIn('# Experience', text)
        self.assertNotIn('# Education\n', text)
        self.assertNotIn('# Internships\n', text)
        self.assertLess(text.index('# Experience'), text.index('{% include home-works.html %}'))
        self.assertLess(text.index('{% include home-works.html %}'), text.index('# Service'))
        awards = re.search(r'^# (?:Selected )?Awards$', text, re.MULTILINE)
        self.assertIsNotNone(awards, 'Awards section must be preserved')
        self.assertLess(text.index('# Service'), awards.start())
        parser = Elements()
        parser.feed(text)
        self.assertEqual(sum('experience-card' in attrs.get('class', '').split() for _, attrs in parser.items), 7)
        for value in ['Tong Yang', '2027–Future', '4.0/4.0', 'Numerical Analysis', 'Innovation Class', 'ZhiNao Division', 'EPIC Lab', 'LEAP Lab', 'ICLR 2027']:
            self.assertIn(value, text)
        for old in ['educations', 'internships']:
            self.assertIn('id="' + old + '"', text)

    def test_navigation_uses_one_experience_entry(self):
        nav = (ROOT / '_data/navigation.yml').read_text()
        self.assertIn('title: "Experience"', nav)
        self.assertIn('/#experience', nav)
        self.assertNotIn('title: "Education"', nav)
        self.assertNotIn('title: "Internships"', nav)

    def test_exact_original_paper_images(self):
        entries = {x['name']: x for x in json.loads((ROOT / 'scripts/work-media-sources.json').read_text())}
        expected = {
            'audiomarathon': 'https://arxiv.org/html/2510.07293v1/QA_exp.png',
            'audiokv': 'https://arxiv.org/html/2604.06694v2/AudioKV_comparison_fig2_cropped.png'
        }
        works = {x['id']: x for x in json.loads((ROOT / '_data/works.json').read_text())['items']}
        for key, url in expected.items():
            self.assertEqual(entries[key]['source'], url)
            self.assertEqual(works[key]['image'], '/' + entries[key]['output'])
            self.assertIn('figure-', works[key]['image'])
            self.assertTrue((ROOT / entries[key]['output']).is_file())

    def test_readable_logos_and_responsive_media(self):
        css = ROOT / 'assets/css/home-experience.css'
        self.assertTrue(css.is_file(), 'Experience responsive styles missing')
        text = css.read_text()
        for token in ['76px', '64px', '280px', 'object-fit: contain', '@media', 'home-experience-grid']:
            self.assertIn(token, text)

if __name__ == '__main__':
    unittest.main(verbosity=2)
