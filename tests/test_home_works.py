"""Run with Python's standard library: python tests/test_home_works.py [--site _site]."""
import json
from pathlib import Path
import sys
import unittest
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
SITE = None
if '--site' in sys.argv:
    index = sys.argv.index('--site')
    SITE = ROOT / sys.argv[index + 1]
    del sys.argv[index:index + 2]

class Tags(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

class HomeWorksTest(unittest.TestCase):
    def data(self):
        path = ROOT / '_data/works.json'
        self.assertTrue(path.exists(), 'Unified, topic-based works catalogue is missing')
        return json.loads(path.read_text())

    def test_all_original_work_is_retained(self):
        items = self.data()['items']
        self.assertEqual({x['id'] for x in items}, {'audiokv','slowfast','ultrahit','va-adapter','ice','ssd','audiomarathon','os-review'})
        self.assertEqual(len(items), 8)

    def test_topics_are_subjects_not_publication_status(self):
        data = self.data()
        self.assertEqual({x['id'] for x in data['topics']}, {'diffusion','audio','robotics','systems'})
        counts = {x['id']: sum(w['topic'] == x['id'] for w in data['items']) for x in data['topics']}
        self.assertEqual(counts, {'diffusion':3,'audio':2,'robotics':2,'systems':1})

    def test_each_work_has_local_image_and_real_links(self):
        for work in self.data()['items']:
            with self.subTest(work=work['id']):
                self.assertTrue(work['image'].startswith('/images/'))
                path = ROOT / work['image'].lstrip('/')
                self.assertTrue(path.is_file(), f'Missing illustration: {path}')
                self.assertGreater(path.stat().st_size, 100)
                self.assertGreater(len(work['alt']), 20)
                self.assertTrue(work['links'])
                for link in work['links']:
                    self.assertTrue(link['url'].startswith('https://'))
                    self.assertNotIn('javascript:', link['url'])

    def test_service_and_personal_updates_are_preserved(self):
        text = (ROOT / '_pages/about.md').read_text()
        for value in ('ICLR 2027', 'Reviewer', 'Wenhao Zhang', 'I am a senior', 'Tong Yang', '2027–Future'):
            self.assertIn(value, text)
        self.assertIn('{% include home-works.html %}', text)
        self.assertNotIn('# Publications', text)
        self.assertNotIn('# Projects', text)

    def test_source_accessibility_and_navigation(self):
        html = (ROOT / '_includes/home-works.html').read_text()
        for value in ('id="publications"','id="projects"','id="works"','aria-pressed','aria-live','loading="lazy"','<dialog'):
            self.assertIn(value, html)
        nav = (ROOT / '_data/navigation.yml').read_text()
        self.assertIn('/#works', nav)
        self.assertIn('/#service', nav)
        self.assertNotIn('title: "Projects"', nav)

    @unittest.skipUnless(SITE, 'Pass --site to validate the Jekyll build')
    def test_rendered_homepage(self):
        source = (SITE / 'index.html').read_text()
        parser = Tags(); parser.feed(source)
        cards = [(t,a) for t,a in parser.tags if 'data-work-topic' in a]
        self.assertEqual(len(cards), 8)
        ids = [a['id'] for _,a in parser.tags if 'id' in a]
        for anchor in ('works','publications','projects','about-me','service','activities','friends'):
            self.assertEqual(ids.count(anchor), 1, f'Duplicate or missing anchor: {anchor}')
        self.assertNotIn('{{ work.', source)
        for work in self.data()['items']:
            self.assertIn(work['title'].replace('&','&amp;'), source)
            self.assertTrue((SITE / work['image'].lstrip('/')).is_file())

if __name__ == '__main__':
    unittest.main(verbosity=2)
