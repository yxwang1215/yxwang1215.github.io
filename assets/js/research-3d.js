/* Research in Motion — dependency-free WebGL, loaded only on the homepage. */
(() => {
  'use strict';
  const root = document.getElementById('research-3d');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const $ = (selector) => root.querySelector(selector);
  const canvas = $('.research-3d__canvas');
  const stage = $('.research-3d__stage');
  const controls = $('.research-3d__controls');
  const fallback = $('.research-3d__fallback');
  const pauseButton = $('[data-r3d-pause]');
  const modes = Array.from(root.querySelectorAll('[data-r3d-mode]'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  const connection = navigator.connection;
  const lowPower = coarse.matches || (navigator.deviceMemory && navigator.deviceMemory <= 4) || Boolean(connection && connection.saveData);
  const count = lowPower ? 2600 : 5600;
  const names = ['Neural constellation', 'Acoustic landscape', 'KV-cache orbit'];
  const labels = ['Interactive 3D neural sphere', 'Interactive 3D audio wave landscape', 'Interactive 3D KV-cache-inspired orbit'];
  const storageKey = 'yxw-research-3d-paused';
  let savedPaused = false;
  try { savedPaused = localStorage.getItem(storageKey) === 'true'; } catch (_) { /* Storage is optional. */ }
  let paused = motion.matches || savedPaused || Boolean(connection && connection.saveData);
  let visible = true;
  let pageActive = true;
  let lost = false;
  let gl = null;
  let ctx = null;
  let gpu = null;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let burst = 0;
  let mode = 0;
  let drag = null;
  let yaw = .38;
  let pitch = -.18;
  let targetYaw = yaw;
  let targetPitch = pitch;
  let hover = 0;
  let hoverTarget = 0;
  let cursor = [0, 0];
  let weights = [1, 0, 0];
  const targetWeights = [1, 0, 0];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  // A shared parameterization lets every particle continuously morph between shapes.
  const vertexSource = `
    precision highp float;
    attribute vec4 a_seed;
    uniform vec3 u_weights;
    uniform vec2 u_rotation;
    uniform vec2 u_cursor;
    uniform float u_time, u_aspect, u_dpr, u_burst, u_hover, u_lines, u_halo;
    varying mediump vec3 v_color;
    varying mediump float v_alpha;
    const float TAU = 6.28318530718;
    void main() {
      float u = a_seed.x;
      float v = a_seed.y;
      float angle = TAU * u;
      float ring = a_seed.w;
      float sy = 2.0 * v - 1.0;
      float sr = sqrt(max(0.0, 1.0 - sy * sy));
      vec3 sphere = vec3(sr * cos(angle), sy, sr * sin(angle));
      sphere *= 1.03 + .018 * sin(u_time * .7 + angle * 3.0);
      if (ring > .5) {
        float a = angle + u_time * .13 * (ring < 1.5 ? 1.0 : -1.0);
        sphere = vec3(1.36 * cos(a), .43 * sin(a), 1.16 * sin(a));
        if (ring > 1.5) sphere = vec3(sphere.z, -sphere.y, sphere.x);
      }
      float wx = (u - .5) * 2.65;
      float wz = (v - .5) * 2.1;
      if (ring > .5) wz = ring < 1.5 ? -1.05 : 1.05;
      float wy = .24 * sin(wx * 3.2 - u_time * .8)
               + .16 * cos(wz * 4.0 + u_time * .55)
               + .10 * sin((wx + wz) * 2.4 + u_time * .45);
      vec3 wave = vec3(wx, wy, wz);
      // An artistic trefoil orbit, not a quantitative model of cache contents.
      float t = angle + u_time * .06;
      float radius = .78 + .24 * cos(3.0 * t);
      vec3 orbit = vec3(radius * cos(2.0 * t), .35 * sin(3.0 * t), radius * sin(2.0 * t));
      float tube = TAU * v;
      orbit += .105 * vec3(cos(tube) * cos(2.0 * t), sin(tube), cos(tube) * sin(2.0 * t));
      if (ring > .5) orbit *= 1.15;
      orbit = vec3(orbit.x, .7 * orbit.y - .714 * orbit.z, .714 * orbit.y + .7 * orbit.z) * 1.18;
      vec3 p = sphere * u_weights.x + wave * u_weights.y + orbit * u_weights.z;
      p *= 1.0 + u_burst * (.3 + a_seed.z * .48);
      float ry = u_rotation.x + u_time * .075;
      float rx = u_rotation.y - .38 * u_weights.y;
      vec3 q = vec3(cos(ry) * p.x + sin(ry) * p.z, p.y, -sin(ry) * p.x + cos(ry) * p.z);
      q = vec3(q.x, cos(rx) * q.y - sin(rx) * q.z, sin(rx) * q.y + cos(rx) * q.z);
      vec2 delta = q.xy - u_cursor;
      q.xy += delta * exp(-dot(delta, delta) * 4.0) * u_hover * .17;
      float depth = 4.1 - q.z;
      gl_Position = vec4(q.x * 2.65 / u_aspect, q.y * 2.65, 0.0, depth);
      float sparkle = step(.965, a_seed.z);
      gl_PointSize = clamp(u_dpr * (1.9 + 2.2 * sparkle) * (4.1 / depth) * (1.0 + 1.5 * u_halo), 1.0, 22.0);
      float hue = .5 + .5 * sin(angle + v * 2.5 + .3);
      v_color = mix(vec3(.12, .32, .65), vec3(.57, .23, .70), hue);
      v_color = mix(v_color, vec3(.18, .49, .72), u_weights.y * v * .7);
      float front = smoothstep(-1.4, 1.3, q.z);
      v_alpha = mix(.30, .82, front);
      if (ring > .5) v_alpha *= .80;
      if (u_lines > .5) v_alpha = mix(.07, .23, front);
      if (u_halo > .5) v_alpha *= .12;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform float u_lines;
    varying mediump vec3 v_color;
    varying mediump float v_alpha;
    void main() {
      float alpha = v_alpha;
      if (u_lines < .5) {
        float d = length(gl_PointCoord - vec2(.5)) * 2.0;
        if (d > 1.0) discard;
        alpha *= 1.0 - smoothstep(.12, 1.0, d);
      }
      gl_FragColor = vec4(v_color, alpha);
    }
  `;

  function buildSeeds() {
    const points = new Float32Array(count * 4);
    const core = Math.floor(count * .88);
    for (let i = 0; i < count; i++) {
      const offset = i * 4;
      const orbital = i >= core;
      points[offset] = (i * .61803398875) % 1;
      points[offset + 1] = orbital ? .5 : (i + .5) / core;
      points[offset + 2] = (i * .75487766624) % 1;
      points[offset + 3] = orbital ? 1 + (i % 2) : 0;
    }
    const lines = [];
    const add = (u, v, ring = 0) => lines.push(u, v, .5, ring);
    const segments = lowPower ? 64 : 100;
    for (let k = 0; k < 12; k++) {
      for (let s = 0; s < segments; s++) {
        add(k / 12, s / segments);
        add(k / 12, (s + 1) / segments);
      }
    }
    for (let k = 1; k < 10; k++) {
      const v = .5 - .5 * Math.cos(k * Math.PI / 10);
      for (let s = 0; s < segments; s++) {
        add(s / segments, v);
        add((s + 1) / segments, v);
      }
    }
    for (let ring = 1; ring <= 2; ring++) {
      for (let s = 0; s < segments * 2; s++) {
        add(s / (segments * 2), .5, ring);
        add((s + 1) / (segments * 2), .5, ring);
      }
    }
    return { points, lines: new Float32Array(lines) };
  }
  const seeds = buildSeeds();

  function showFallback(message) {
    canvas.hidden = true;
    fallback.removeAttribute('hidden');
    controls.hidden = true;
    root.dataset.renderer = 'fallback';
    $('[data-r3d-state]').textContent = 'STATIC STUDY';
    $('#research-3d-help').textContent = message || 'A generative study, not a data plot.';
  }
  function initGPU() {
    let program;
    const shaders = [];
    const buffers = [];
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' });
      if (!gl) return initCanvas();
      for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
        const shader = gl.createShader(type);
        if (!shader) throw new Error('Shader allocation failed');
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
      }
      program = gl.createProgram();
      if (!program) throw new Error('Program allocation failed');
      shaders.forEach((shader) => gl.attachShader(program, shader));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed');
      shaders.forEach((shader) => gl.deleteShader(shader));
      const uniform = {};
      ['weights', 'rotation', 'cursor', 'time', 'aspect', 'dpr', 'burst', 'hover', 'lines', 'halo'].forEach((name) => {
        uniform[name] = gl.getUniformLocation(program, 'u_' + name);
      });
      const upload = (data) => {
        const buffer = gl.createBuffer();
        if (!buffer) throw new Error('Buffer allocation failed');
        buffers.push(buffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
      };
      gpu = { program, uniform, attribute: gl.getAttribLocation(program, 'a_seed'), points: upload(seeds.points), lines: upload(seeds.lines) };
      gl.useProgram(program);
      gl.enableVertexAttribArray(gpu.attribute);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
      canvas.hidden = false;
      fallback.setAttribute('hidden', '');
      controls.hidden = false;
      root.dataset.renderer = 'webgl';
      root.dataset.particles = String(count);
      $('#research-3d-help').textContent = 'Drag / arrow keys · click to pulse';
      updatePauseUI();
      resize();
      return true;
    } catch (error) {
      shaders.forEach((shader) => gl && gl.deleteShader(shader));
      buffers.forEach((buffer) => gl && gl.deleteBuffer(buffer));
      if (gl && program) gl.deleteProgram(program);
      gpu = null;
      showFallback();
      console.warn('[Research 3D] Using static fallback:', error.message);
      return false;
    }
  }


  // A real 3D perspective projection for devices without a WebGL context.
  // Lower point density and a 30 fps cap keep the fallback lightweight.
  function initCanvas() {
    try { ctx = canvas.getContext('2d', { alpha: true }); } catch (_) { ctx = null; }
    if (!ctx) { showFallback(); return false; }
    canvas.hidden = false;
    fallback.setAttribute('hidden', '');
    controls.hidden = false;
    root.dataset.renderer = 'canvas-2d';
    root.dataset.particles = String(Math.ceil(count / 4));
    $('#research-3d-help').textContent = 'Drag / arrow keys · click to pulse';
    updatePauseUI();
    resize();
    return true;
  }
  function renderCanvas() {
    const width = canvas.width, height = canvas.height;
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    const rotation = yaw + elapsed * .075;
    const rx = pitch - .38 * weights[1];
    const cy = Math.cos(rotation), sy = Math.sin(rotation);
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const tau = Math.PI * 2;
    const project = (seeds, offset) => {
      const u = seeds[offset], v = seeds[offset + 1], noise = seeds[offset + 2], ring = seeds[offset + 3];
      const angle = tau * u;
      let x = 0, y = 0, z = 0;
      if (weights[0] > .001) {
        const yy = 2 * v - 1, rr = Math.sqrt(Math.max(0, 1 - yy * yy));
        const radius = 1.03 + .018 * Math.sin(elapsed * .7 + angle * 3);
        let xx = rr * Math.cos(angle) * radius, vy = yy * radius, zz = rr * Math.sin(angle) * radius;
        if (ring > .5) {
          const a = angle + elapsed * .13 * (ring < 1.5 ? 1 : -1);
          xx = 1.36 * Math.cos(a); vy = .43 * Math.sin(a); zz = 1.16 * Math.sin(a);
          if (ring > 1.5) { const swap = xx; xx = zz; zz = swap; vy = -vy; }
        }
        x += xx * weights[0]; y += vy * weights[0]; z += zz * weights[0];
      }
      if (weights[1] > .001) {
        const wx = (u - .5) * 2.65;
        const wz = ring > .5 ? (ring < 1.5 ? -1.05 : 1.05) : (v - .5) * 2.1;
        const wy = .24 * Math.sin(wx * 3.2 - elapsed * .8) + .16 * Math.cos(wz * 4 + elapsed * .55) + .1 * Math.sin((wx + wz) * 2.4 + elapsed * .45);
        x += wx * weights[1]; y += wy * weights[1]; z += wz * weights[1];
      }
      if (weights[2] > .001) {
        const t = angle + elapsed * .06, radius = .78 + .24 * Math.cos(3 * t), tube = tau * v;
        const mult = ring > .5 ? 1.15 : 1;
        const ox = (radius + .105 * Math.cos(tube)) * Math.cos(2 * t);
        const oy = .35 * Math.sin(3 * t) + .105 * Math.sin(tube);
        const oz = (radius + .105 * Math.cos(tube)) * Math.sin(2 * t);
        x += ox * mult * weights[2] * 1.18;
        y += (.7 * oy - .714 * oz) * mult * weights[2] * 1.18;
        z += (.714 * oy + .7 * oz) * mult * weights[2] * 1.18;
      }
      const expansion = 1 + burst * (.3 + noise * .48);
      x *= expansion; y *= expansion; z *= expansion;
      let qx = cy * x + sy * z;
      const zz = -sy * x + cy * z;
      let qy = cx * y - sx * zz;
      const qz = sx * y + cx * zz;
      const dx = qx - cursor[0], dy = qy - cursor[1];
      const repulsion = Math.exp(-(dx * dx + dy * dy) * 4) * hover * .17;
      qx += dx * repulsion; qy += dy * repulsion;
      const perspective = 4.1 - qz;
      return [width * .5 + qx * height * 1.325 / perspective, height * .5 - qy * height * 1.325 / perspective, qz, noise, perspective];
    };
    ctx.clearRect(0, 0, width, height);
    const ink = ctx.createLinearGradient(width * .25, height * .2, width * .8, height * .85);
    ink.addColorStop(0, '#285da8'); ink.addColorStop(.55, '#595ab8'); ink.addColorStop(1, '#a04ab4');
    ctx.strokeStyle = ink; ctx.lineWidth = .65 * dpr; ctx.globalAlpha = .28;
    ctx.beginPath();
    for (let i = 0; i < seeds.lines.length; i += 8) {
      const a = project(seeds.lines, i), b = project(seeds.lines, i + 4);
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
    const bins = [[], [], []];
    for (let i = 0; i < seeds.points.length; i += 16) {
      const point = project(seeds.points, i);
      bins[point[2] < -.35 ? 0 : point[2] > .35 ? 2 : 1].push(point);
    }
    ctx.fillStyle = ink;
    bins.forEach((points, index) => {
      ctx.globalAlpha = [.3, .55, .9][index];
      ctx.beginPath();
      points.forEach((point) => {
        const radius = dpr * (point[3] > .965 ? 2.2 : .95) * 4.1 / point[4];
        ctx.moveTo(point[0] + radius, point[1]); ctx.arc(point[0], point[1], radius, 0, tau);
      });
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function render() {
    if ((!gpu && !ctx) || lost || !visible || !pageActive || document.hidden) return;
    if (ctx) { renderCanvas(); return; }
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    const u = gpu.uniform;
    gl.useProgram(gpu.program);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform3fv(u.weights, weights);
    gl.uniform2f(u.rotation, yaw, pitch);
    gl.uniform2fv(u.cursor, cursor);
    gl.uniform1f(u.time, elapsed);
    gl.uniform1f(u.aspect, canvas.width / Math.max(1, canvas.height));
    gl.uniform1f(u.dpr, dpr);
    gl.uniform1f(u.burst, burst);
    gl.uniform1f(u.hover, hover);
    const bind = (buffer) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(gpu.attribute, 4, gl.FLOAT, false, 0, 0);
    };
    bind(gpu.lines);
    gl.uniform1f(u.lines, 1);
    gl.uniform1f(u.halo, 0);
    gl.drawArrays(gl.LINES, 0, seeds.lines.length / 4);
    bind(gpu.points);
    gl.uniform1f(u.lines, 0);
    if (!lowPower) {
      gl.uniform1f(u.halo, 1);
      gl.drawArrays(gl.POINTS, 0, count);
    }
    gl.uniform1f(u.halo, 0);
    gl.drawArrays(gl.POINTS, 0, count);
  }
  function resize() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    render();
  }
  function canAnimate() { return (gpu || ctx) && !paused && visible && pageActive && !document.hidden && !lost; }
  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }
  function tick(now) {
    frame = 0;
    if (!canAnimate()) return;
    const interval = (lowPower || ctx) ? 1000 / 30 : 1000 / 60;
    const gap = lastTime ? now - lastTime : interval;
    if (gap < interval - .6) {
      frame = requestAnimationFrame(tick);
      return;
    }
    const dt = Math.min(gap / 1000, .05);
    lastTime = now;
    elapsed += dt;
    const smooth = 1 - Math.exp(-dt * 4.8);
    weights = weights.map((weight, i) => weight + (targetWeights[i] - weight) * smooth);
    yaw += (targetYaw - yaw) * smooth;
    pitch += (targetPitch - pitch) * smooth;
    hover += (hoverTarget - hover) * smooth;
    burst *= Math.exp(-dt * 3.8);
    render();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    stop();
    if (canAnimate()) frame = requestAnimationFrame(tick);
    else render();
  }
  function updatePauseUI() {
    root.dataset.paused = String(paused);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    pauseButton.title = paused ? 'Play animation' : 'Pause animation';
    pauseButton.textContent = paused ? '▷' : 'Ⅱ';
    $('[data-r3d-state]').textContent = paused ? 'PAUSED' : (ctx ? 'LIVE / CANVAS' : 'LIVE / WEBGL');
  }
  function setPaused(value, persist) {
    paused = value;
    if (paused) {
      weights = targetWeights.slice(); yaw = targetYaw; pitch = targetPitch; burst = 0; hover = 0;
    }
    if (persist) {
      try { localStorage.setItem(storageKey, String(paused)); } catch (_) { /* Optional. */ }
    }
    updatePauseUI();
    sync();
  }
  function selectMode(index) {
    mode = index;
    targetWeights.forEach((_, i) => { targetWeights[i] = i === mode ? 1 : 0; });
    if (paused) weights = targetWeights.slice();
    modes.forEach((button, i) => button.setAttribute('aria-pressed', String(i === mode)));
    $('[data-r3d-index]').textContent = '0' + (mode + 1);
    $('[data-r3d-name]').textContent = names[mode];
    $('[data-r3d-announcement]').textContent = names[mode] + ' selected.';
    canvas.setAttribute('aria-label', labels[mode]);
    root.dataset.mode = String(mode);
    render();
  }
  function resetView() {
    targetYaw = .38 - elapsed * .075;
    targetPitch = -.18;
    cursor = [0, 0]; hoverTarget = 0; burst = 0;
    if (paused) { yaw = targetYaw; pitch = targetPitch; hover = 0; }
    render();
  }
  modes.forEach((button, i) => button.addEventListener('click', () => selectMode(i)));
  pauseButton.addEventListener('click', () => setPaused(!paused, true));
  $('[data-r3d-reset]').addEventListener('click', resetView);
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, yaw: targetYaw, pitch: targetPitch, moved: 0, id: event.pointerId };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (drag && event.pointerId === drag.id) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(dy));
      targetYaw = drag.yaw + dx * .008;
      targetPitch = clamp(drag.pitch + dy * .006, -1.15, 1.15);
      if (paused) { yaw = targetYaw; pitch = targetPitch; }
      render();
    } else if (event.pointerType !== 'touch' && !paused) {
      const rect = canvas.getBoundingClientRect();
      cursor = [((event.clientX - rect.left) / rect.width - .5) * 3.1 * rect.width / rect.height, (.5 - (event.clientY - rect.top) / rect.height) * 3.1];
      hoverTarget = 1;
    }
  });
  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    if (event.type === 'pointerup' && drag.moved < 6 && !paused) burst = 1;
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    drag = null;
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('lostpointercapture', () => { drag = null; });
  canvas.addEventListener('pointerleave', () => { hoverTarget = 0; });
  canvas.addEventListener('keydown', (event) => {
    const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', ' ', '1', '2', '3'].includes(key)) return;
    event.preventDefault();
    if (/^[123]$/.test(key)) selectMode(Number(key) - 1);
    if (key === ' ') setPaused(!paused, true);
    if (key === 'Home') resetView();
    if (key === 'ArrowLeft') targetYaw -= .14;
    if (key === 'ArrowRight') targetYaw += .14;
    if (key === 'ArrowUp') targetPitch = clamp(targetPitch - .14, -1.15, 1.15);
    if (key === 'ArrowDown') targetPitch = clamp(targetPitch + .14, -1.15, 1.15);
    if (paused) { yaw = targetYaw; pitch = targetPitch; }
    render();
  });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault(); lost = true; stop(); showFallback('Static view — graphics temporarily unavailable.');
  });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; if (initGPU()) sync(); });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { pageActive = false; stop(); });
  window.addEventListener('pageshow', () => { pageActive = true; sync(); });
  const motionChange = () => { if (motion.matches) setPaused(true, false); };
  if (motion.addEventListener) motion.addEventListener('change', motionChange);
  else motion.addListener(motionChange);
  if (!initGPU()) return;
  root.dataset.mode = '0';
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      sync();
    }, { threshold: 0 }).observe(stage);
  }
  sync();
})();
