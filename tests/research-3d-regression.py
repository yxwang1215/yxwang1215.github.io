#!/usr/bin/env python3
"""Homepage animation regression tests; no production dependencies.

Setup: python -m pip install playwright && python -m playwright install chromium
Run: python tests/research-3d-regression.py
Optional: CHROMIUM_EXECUTABLE=/usr/bin/chromium python tests/research-3d-regression.py
Uses the real include/CSS/JS in an isolated fixture, NOT a full Jekyll build.
Injected WebGL failures test recovery, not GPU shader rendering. A separate
native-WebGL test skips explicitly when the browser has no WebGL context.
"""
import os
import re
import unittest
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'assets/js/research-3d.js').read_text()
CSS = (ROOT / 'assets/css/research-3d.css').read_text()
INCLUDE = (ROOT / '_includes/research-3d.html').read_text()
CANVAS = '#research-3d canvas'

# Lock each fake-WebGL canvas to that context, exactly as getContext does.
# A same-node getContext('2d') must fail, so recovery must use a fresh node.
INJECT = r"""
(() => {
  const kind = KIND;
  const original = HTMLCanvasElement.prototype.getContext;
  const locked = new WeakSet();
  window.__draws = 0; window.__gpuDraws = 0;
  const clear = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function(...args) {
    window.__draws++; return clear.apply(this, args);
  };
  const fake = {
    VERTEX_SHADER: 35633, FRAGMENT_SHADER: 35632, COMPILE_STATUS: 35713, LINK_STATUS: 35714,
    createShader: (type) => ({type}), shaderSource: (s, source) => { s.source = source; },
    getShaderParameter: () => kind !== 'compile-failure',
    getShaderInfoLog: () => 'injected compile failure',
    createProgram: () => ({}), getProgramParameter: () => kind !== 'link-failure',
    getProgramInfoLog: () => 'injected link failure',
    getUniformLocation: (_, name) => name, getAttribLocation: () => 0,
    createBuffer: () => ({}), drawArrays: () => { window.__gpuDraws++; }
  };
  const gl = new Proxy(fake, {get: (obj, key) => key in obj ? obj[key] : () => {}});
  HTMLCanvasElement.prototype.getContext = function(type, options) {
    if (type === 'webgl') {
      if (kind === 'native') return original.call(this, type, options);
      if (kind === 'throw') throw new Error('injected getContext failure');
      if (kind === 'no-webgl' || kind === 'none') return null;
      locked.add(this); return gl;
    }
    if (type === '2d' && (locked.has(this) || kind === 'none')) return null;
    return original.call(this, type, options);
  };
})();
"""


class ResearchMotion(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        options = {'headless': True, 'args': ['--enable-unsafe-swiftshader']}
        if os.getenv('CHROMIUM_EXECUTABLE'):
            options['executable_path'] = os.environ['CHROMIUM_EXECUTABLE']
        cls.browser = cls.pw.chromium.launch(**options)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1100, 'height': 850})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda e: self.errors.append(str(e)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def load(self, kind='no-webgl', before='', javascript=True):
        fixture = ('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">'
                   '<style>body{margin:24px;font-family:Arial,sans-serif;}main{max-width:880px;margin:auto;}'
                   + CSS + '</style><main>' + INCLUDE + '</main><div style="height:1800px"></div>')
        # set_content keeps the harness entirely local, with no network access.
        self.page.set_content(fixture)
        self.page.evaluate("""() => {
          // about:blank has an opaque origin. Mock only storage for these tests.
          const values = new Map();
          Storage.prototype.getItem = key => values.has(key) ? values.get(key) : null;
          Storage.prototype.setItem = (key, value) => values.set(key, String(value));
          Object.defineProperty(window, 'localStorage', {
            configurable: true, value: Object.create(Storage.prototype)
          });
        }""")
        if javascript:
            self.page.evaluate(INJECT.replace('KIND', repr(kind)))
            if before:
                self.page.evaluate("() => {" + before + "}")
            self.page.add_script_tag(content=JS)
            self.page.wait_for_timeout(160)

    def state(self):
        return self.page.locator('#research-3d').evaluate('(el) => ({...el.dataset})')

    def pixels(self):
        return self.page.locator(CANVAS).evaluate('(el) => el.toDataURL()')

    def assert_moving(self):
        a = self.pixels()
        self.page.wait_for_timeout(220)
        self.assertNotEqual(a, self.pixels())

    def test_shared_uniform_precision(self):
        shaders = re.findall(r'const (?:vertex|fragment)Source = `([\s\S]*?)`;', JS)
        self.assertEqual(len(shaders), 2)
        for shader in shaders:
            self.assertRegex(shader, r'uniform\s+mediump\s+float\s+u_lines\s*;')
        self.assertIn('gl.COMPILE_STATUS', JS)

    def test_no_webgl_all_three_shapes_move(self):
        self.load()
        self.assertEqual(self.state()['renderer'], 'canvas-2d')
        for i in range(3):
            self.page.locator(f'[data-r3d-mode="{i}"]').click()
            self.page.wait_for_timeout(200)
            self.assertEqual(self.state()['mode'], str(i))
            self.assert_moving()

    def test_get_context_exception_recovers(self):
        self.load('throw')
        self.assertEqual(self.state()['renderer'], 'canvas-2d')
        self.assert_moving()

    def test_compile_failure_recovers_on_new_canvas(self):
        self.load('compile-failure')
        self.assertEqual(self.state()['renderer'], 'canvas-2d')
        self.assert_moving()

    def test_link_failure_recovers_with_working_controls(self):
        self.load('link-failure')
        self.assertEqual(self.state()['renderer'], 'canvas-2d')
        self.assert_moving()
        self.page.locator('[data-r3d-pause]').click()
        self.assertEqual(self.state()['paused'], 'true')
        a = self.pixels()
        self.page.wait_for_timeout(220)
        self.assertEqual(a, self.pixels())
        self.page.locator(CANVAS).focus()
        self.page.keyboard.press('ArrowRight')
        self.assertNotEqual(a, self.pixels())
        a = self.pixels()
        box = self.page.locator(CANVAS).bounding_box()
        x, y = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.move(x + 65, y + 20, steps=6)
        self.page.mouse.up()
        self.assertNotEqual(a, self.pixels())
        self.page.locator('[data-r3d-reset]').click()
        self.page.locator('[data-r3d-pause]').click()
        self.assert_moving()

    def test_context_loss_switches_to_animated_canvas_and_keeps_focus(self):
        self.load('fake-success')
        self.assertEqual(self.state()['renderer'], 'webgl')
        self.assertGreater(self.page.evaluate('window.__gpuDraws'), 0)
        self.page.locator(CANVAS).focus()
        self.page.locator(CANVAS).evaluate("el => el.dispatchEvent(new Event('webglcontextlost', {cancelable:true}))")
        self.assertEqual(self.state()['renderer'], 'canvas-2d')
        self.assertTrue(self.page.locator(CANVAS).evaluate('el => el === document.activeElement'))
        self.assert_moving()
        self.page.keyboard.press('2')
        self.assertEqual(self.state()['mode'], '1')

    def test_reduced_motion_opt_in(self):
        self.page.emulate_media(reduced_motion='reduce')
        self.load()
        self.assertEqual(self.state()['paused'], 'true')
        self.assertIn('Reduced motion', self.page.locator('#research-3d-help').inner_text())
        a = self.pixels()
        self.page.wait_for_timeout(220)
        self.assertEqual(a, self.pixels())
        self.page.locator('[data-r3d-pause]').click()
        self.assert_moving()

    def test_saved_pause_is_visible_and_resumable(self):
        self.load(before="localStorage.setItem('yxw-research-3d-paused','true')")
        self.assertEqual(self.state()['paused'], 'true')
        self.assertIn('Saved pause', self.page.locator('#research-3d-help').inner_text())
        self.assertIn('Play', self.page.locator('[data-r3d-pause]').inner_text())
        self.page.locator('[data-r3d-pause]').click()
        self.assertEqual(self.page.evaluate("localStorage.getItem('yxw-research-3d-paused')"), 'false')
        self.assert_moving()

    def test_storage_unavailable_still_plays(self):
        self.load(before="Storage.prototype.getItem = () => { throw Error('blocked'); }; Storage.prototype.setItem = () => { throw Error('blocked'); };")
        self.assert_moving()
        self.page.locator('[data-r3d-pause]').click()
        self.page.locator('[data-r3d-pause]').click()
        self.assert_moving()

    def test_data_saver_opt_in(self):
        self.load(before="Object.defineProperty(navigator,'connection',{value:{saveData:true},configurable:true})")
        self.assertEqual(self.state()['paused'], 'true')
        self.assertIn('Data saver', self.page.locator('#research-3d-help').inner_text())
        self.page.locator('[data-r3d-pause]').click()
        self.assert_moving()

    def test_offscreen_stops_and_reentry_resumes(self):
        self.load()
        self.page.evaluate('scrollTo(0, 1600)')
        self.page.wait_for_timeout(180)
        draws = self.page.evaluate('window.__draws')
        self.page.wait_for_timeout(220)
        self.assertEqual(draws, self.page.evaluate('window.__draws'))
        self.page.evaluate('scrollTo(0,0)')
        self.page.wait_for_timeout(180)
        self.assert_moving()

    def test_pagehide_pageshow(self):
        self.load()
        self.page.evaluate("window.dispatchEvent(new Event('pagehide'))")
        a = self.pixels()
        self.page.wait_for_timeout(220)
        self.assertEqual(a, self.pixels())
        self.page.evaluate("window.dispatchEvent(new Event('pageshow'))")
        self.assert_moving()

    def test_no_horizontal_overflow(self):
        self.load()
        for width in [320, 375, 768, 1280]:
            self.page.set_viewport_size({'width': width, 'height': 1000})
            self.page.wait_for_timeout(80)
            self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width)
            self.assertTrue(self.page.locator('[data-r3d-pause]').is_visible())
        self.page.locator('main').evaluate("el => el.style.width = '300px'")
        self.assertTrue(self.page.locator('#research-3d').evaluate('el => el.scrollWidth <= el.clientWidth + 1'))

    def test_no_javascript_static_fallback(self):
        self.load(javascript=False)
        self.assertTrue(self.page.locator('.research-3d__fallback').is_visible())
        self.assertFalse(self.page.locator('.research-3d__controls').is_visible())

    def test_no_context_static_fallback(self):
        self.load('none')
        self.assertEqual(self.state()['renderer'], 'fallback')
        self.assertTrue(self.page.locator('.research-3d__fallback').is_visible())
        self.assertFalse(self.page.locator('.research-3d__controls').is_visible())

    def test_native_webgl(self):
        available = self.page.evaluate("!!document.createElement('canvas').getContext('webgl')")
        if not available:
            self.skipTest('Native WebGL unavailable; injected recovery tests are NOT GPU validation')
        self.load('native')
        self.assertEqual(self.state()['renderer'], 'webgl')
        # Read pixels inside RAF, before the browser discards the backbuffer.
        read = """() => new Promise(resolve => requestAnimationFrame(() => {
          const c = document.querySelector('#research-3d canvas'), gl = c.getContext('webgl');
          const pixels = new Uint8Array(c.width*c.height*4);
          gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
          resolve({error:gl.getError(), pixels:Array.from(pixels)});
        }))"""
        a = self.page.evaluate(read)
        self.assertEqual(a['error'], 0)
        self.assertTrue(any(a['pixels']))
        self.page.wait_for_timeout(220)
        b = self.page.evaluate(read)
        self.assertNotEqual(a['pixels'], b['pixels'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
