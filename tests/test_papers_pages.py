"""Contract checks for the paper project directory.

Run with: python tests/test_papers_pages.py [--site _site]
"""
from html.parser import HTMLParser
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
SITE = None
if "--site" in sys.argv:
    index = sys.argv.index("--site")
    SITE = ROOT / sys.argv[index + 1]
    del sys.argv[index:index + 2]


class PaperPagesTest(unittest.TestCase):
    def test_source_routes_and_assets_exist(self):
        expected = (
            ROOT / "papers/index.html",
            ROOT / "papers/srp-sft/index.html",
            ROOT / "papers/README.md",
            ROOT / "papers/assets/README.md",
            ROOT / "papers/srp-sft/README.md",
            ROOT / "papers/lp-sft/README.md",
            ROOT / "papers/assets/srp-sft-intro.png",
            ROOT / "papers/assets/srp-sft-method.png",
            ROOT / "papers/assets/srp-sft-paper.pdf",
        )
        for path in expected:
            with self.subTest(path=path):
                self.assertTrue(path.is_file(), f"Missing paper artifact: {path}")
                self.assertGreater(path.stat().st_size, 100)

    def test_paper_directory_docs_explain_each_level(self):
        docs = {
            ROOT / "papers/README.md": "papers/",
            ROOT / "papers/assets/README.md": "assets/",
            ROOT / "papers/srp-sft/README.md": "srp-sft/",
            ROOT / "papers/lp-sft/README.md": "lp-sft/",
        }
        for path, marker in docs.items():
            with self.subTest(path=path):
                self.assertIn(marker, path.read_text())

    def test_project_page_contains_evidence_and_visualization_contract(self):
        html = (ROOT / "papers/srp-sft/index.html").read_text()
        for value in (
            "permalink: /papers/srp-sft/",
            "Beyond Distribution Matching",
            "Yuxuan Wang",
            "Guangxiang Zhao",
            "Xinyu Tan",
            "role=\"img\"",
            "aria-labelledby",
            "54.56",
            "69.50",
            "45.11",
            "69.48",
            "srp-sft-intro.png",
            "srp-sft-method.png",
        ):
            self.assertIn(value, html)
        self.assertIn('viewBox="0 0 900 350"', html)

    def test_navigation_and_directory_link_to_paper_area(self):
        nav = (ROOT / "_data/navigation.yml").read_text()
        directory = (ROOT / "papers/index.html").read_text()
        self.assertIn('title: "Papers"', nav)
        self.assertIn('url: "/papers/"', nav)
        self.assertIn('/papers/srp-sft/', directory)

    @unittest.skipUnless(SITE, "Pass --site to validate the Jekyll build")
    def test_rendered_routes_exist(self):
        for path in (
            SITE / "papers/index.html",
            SITE / "papers/srp-sft/index.html",
            SITE / "papers/assets/srp-sft-intro.png",
            SITE / "papers/assets/srp-sft-method.png",
            SITE / "papers/assets/srp-sft-paper.pdf",
        ):
            with self.subTest(path=path):
                self.assertTrue(path.is_file(), f"Missing generated route or asset: {path}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
