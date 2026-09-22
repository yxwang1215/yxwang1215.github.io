#!/usr/bin/env python3
"""Real WebGL compositing + animation regression, with Canvas recovery checks.

Dev only: pip install playwright pillow; playwright install chromium
Run: python tests/research-3d-compositing.py
Optional CHROMIUM_EXECUTABLE and CHROMIUM_ARGS (shell-separated) select a browser.
For Linux SwiftShader that requires X11, start Xvfb and set DISPLAY first.
A missing WebGL context is explicitly skipped, never counted as GPU validation.
Fixtures are component-only. SwiftShader tests the real WebGL API/shaders but is
not a physical GPU or a full-site test. No network requests are needed.
"""
import io
import os
import re
import shlex
import unittest
from pathlib import Path
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'assets/js/research-3d.js').read_text()
CSS = (ROOT / 'assets/css/research-3d.css').read_text()
HTML = (ROOT / '_includes/research-3d.html').read_text()
CANVAS = '#research-3d canvas'
FRAGMENT = re.search(r'const fragmentSource = `([\s\S]*?)`;', JS)[1]


class Compositing(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        opts = {'headless': True, 'args': shlex.split(os.getenv(
            'CHROMIUM_ARGS', '--enable-unsafe-swiftshader'))}
        if os.getenv('CHROMIUM_EXECUTABLE'):
            opts['executable_path'] = os.environ['CHROMIUM_EXECUTABLE']
        cls.browser = cls.pw.chromium.launch(**opts)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 830, 'height': 900})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda e: self.errors.append(str(e)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def load(self, renderer='webgl', reduced=False, before=''):
        if renderer == 'webgl' and not self.page.evaluate(
                "!!document.createElement('canvas').getContext('webgl')"):
            self.skipTest('WebGL unavailable; Canvas checks are not shader validation')
        self.page.emulate_media(reduced_motion='reduce' if reduced else 'no-preference')
        self.page.set_content('<!doctype html><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width,initial-scale=1">'
            '<style>body{margin:15px;background:white;font-family:Arial;}'
            'main{max-width:800px;margin:auto;}' + CSS + '</style><main>' + HTML +
            '</main><div style="height:1800px"></div>')
        if renderer != 'webgl':
            self.page.evaluate("""kind => {
              const original = HTMLCanvasElement.prototype.getContext;
              HTMLCanvasElement.prototype.getContext = function(type, options) {
                if (type === 'webgl' || kind === 'none') return null;
                return original.call(this, type, options);
              };
            }""", renderer)
        if before:
            self.page.evaluate('() => {' + before + '}')
        self.page.add_script_tag(content=JS)
        self.page.wait_for_timeout(120)

    def pixels(self):
        return Image.open(io.BytesIO(self.page.locator(CANVAS).screenshot())).convert('RGB')

    def moving(self):
        a = self.pixels()
        self.page.wait_for_timeout(180)
        self.assertIsNotNone(ImageChops.difference(a, self.pixels()).getbbox())

    def test_webgl_three_shapes_animate_and_pause(self):
        self.load()
        self.assertEqual(self.page.locator('#research-3d').get_attribute('data-renderer'), 'webgl')
        self.assertEqual(self.page.locator('#research-3d').get_attribute('data-particles'), '3600')
        for mode in range(3):
            self.page.locator(f'[data-r3d-mode="{mode}"]').click()
            self.page.wait_for_timeout(400)
            self.moving()
        self.page.locator('[data-r3d-pause]').click()
        a = self.pixels()
        self.page.wait_for_timeout(180)
        self.assertIsNone(ImageChops.difference(a, self.pixels()).getbbox())
        self.page.locator('[data-r3d-pause]').click()
        self.moving()

    def test_real_fragment_and_browser_compositor_agree(self):
        self.load(reduced=True)
        # Use the component's actual context, blend state and fragment shader.
        # Only the vertex stage is a constant test swatch; no mocked graphics API.
        result = self.page.evaluate("""fragment => {
          const c = document.querySelector('#research-3d canvas');
          const gl = c.getContext('webgl');
          const vertex = `attribute vec2 p; varying mediump vec3 v_color;
            varying mediump float v_alpha; void main(){
            gl_Position=vec4(p,0.,1.);v_color=vec3(.25,.5,1.);v_alpha=.5;}`;
          const program = gl.createProgram();
          for (const [type, source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
            const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
            if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));
            gl.attachShader(program,s);gl.deleteShader(s);
          }
          gl.linkProgram(program);
          if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
          gl.useProgram(program);gl.uniform1f(gl.getUniformLocation(program,'u_lines'),1);
          const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
          gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
          const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);
          gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
          gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,3);
          const pixel=new Uint8Array(4);gl.readPixels(10,10,1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
          const result={pixel:Array.from(pixel),attrs:gl.getContextAttributes(),error:gl.getError(),
            src:gl.getParameter(gl.BLEND_SRC_RGB)};
          gl.deleteBuffer(b);gl.deleteProgram(program);return result;
        }""", FRAGMENT)
        self.assertTrue(result['attrs']['premultipliedAlpha'])
        self.assertEqual(result['src'], 1)  # ONE, not a second SRC_ALPHA multiplier
        self.assertEqual(result['error'], 0)
        for actual, expected in zip(result['pixel'], [32, 64, 128, 128]):
            self.assertLessEqual(abs(actual - expected), 2)
        # Page compositing over white must be pastel blue, not a dark/gray swatch.
        im = self.pixels()
        pixel = im.getpixel((im.width // 2, im.height // 2))
        for actual, expected in zip(pixel, [159, 191, 255]):
            self.assertLessEqual(abs(actual - expected), 3)

    def test_context_loss_keeps_canvas_animation_and_keyboard(self):
        self.load()
        self.page.locator(CANVAS).focus()
        self.page.locator(CANVAS).evaluate("""c => {
          const ext=c.getContext('webgl').getExtension('WEBGL_lose_context');
          if(!ext)throw Error('Context-loss extension unavailable');ext.loseContext();
        }""")
        self.page.wait_for_function("document.querySelector('#research-3d').dataset.renderer==='canvas-2d'")
        self.assertTrue(self.page.locator(CANVAS).evaluate('c=>c===document.activeElement'))
        self.page.keyboard.press('2')
        self.assertEqual(self.page.locator('#research-3d').get_attribute('data-mode'), '1')
        self.moving()

    def test_canvas_fallback_shapes_drag_and_pause(self):
        self.load(renderer='canvas')
        for mode in range(3):
            self.page.locator(f'[data-r3d-mode="{mode}"]').click()
            self.moving()
        self.page.locator('[data-r3d-pause]').click()
        a = self.pixels()
        self.page.locator(CANVAS).focus()
        self.page.keyboard.press('ArrowRight')
        self.assertIsNotNone(ImageChops.difference(a, self.pixels()).getbbox())
        a = self.pixels()
        box = self.page.locator(CANVAS).bounding_box()
        x, y = box['x'] + box['width']/2, box['y'] + box['height']/2
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.move(x+65, y+15, steps=5)
        self.page.mouse.up()
        self.assertIsNotNone(ImageChops.difference(a, self.pixels()).getbbox())
        self.page.locator('[data-r3d-reset]').click()
        self.page.locator('[data-r3d-pause]').click()
        self.moving()

    def test_reduced_motion_requires_play(self):
        self.load(reduced=True)
        a = self.pixels()
        self.page.wait_for_timeout(180)
        self.assertIsNone(ImageChops.difference(a, self.pixels()).getbbox())
        self.assertIn('Reduced motion', self.page.locator('#research-3d-help').inner_text())
        self.page.locator('[data-r3d-pause]').click()
        self.moving()

    def test_low_power_and_responsive_layout(self):
        self.load(before="Object.defineProperty(navigator,'deviceMemory',{value:2})")
        self.assertEqual(self.page.locator('#research-3d').get_attribute('data-particles'), '1800')
        for width in [320, 375, 768, 1280]:
            self.page.set_viewport_size({'width':width,'height':1000})
            self.page.wait_for_timeout(80)
            self.assertTrue(self.page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
            self.assertTrue(self.page.locator('[data-r3d-pause]').is_visible())
            self.moving()

    def test_pagehide_stops_pageshow_resumes(self):
        self.load()
        self.page.evaluate("dispatchEvent(new Event('pagehide'))")
        a = self.pixels()
        self.page.wait_for_timeout(180)
        self.assertIsNone(ImageChops.difference(a, self.pixels()).getbbox())
        self.page.evaluate("dispatchEvent(new Event('pageshow'))")
        self.moving()

    def test_no_graphics_context_retains_svg(self):
        self.load(renderer='none')
        self.assertTrue(self.page.locator('.research-3d__fallback').is_visible())
        self.assertFalse(self.page.locator('.research-3d__controls').is_visible())


if __name__ == '__main__':
    unittest.main(verbosity=2)
