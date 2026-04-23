/* ==========================================================================
   hero-shader — WebGL2/1 fragment-shader hero for Solwit WMS
   6 orbs + central sun, additive lights, cursor warp, filmic tone-map.
   No libraries. Pure WebGL.
   ========================================================================== */
(() => {
  "use strict";

  const canvas = document.getElementById("shader-canvas");
  if (!canvas) return;

  // ---------- GL context (WebGL2, fallback to WebGL1) ----------
  const glOpts = { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" };
  let gl = canvas.getContext("webgl2", glOpts);
  let isWebGL2 = !!gl;
  if (!gl) gl = canvas.getContext("webgl", glOpts) || canvas.getContext("experimental-webgl", glOpts);
  if (!gl) {
    // No WebGL — leave canvas blank on brand bg; overlay copy is still fully legible.
    canvas.style.display = "none";
    return;
  }

  // ---------- Shader sources ----------
  const VS_300 = `#version 300 es
    in vec2 aPos;
    out vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  const VS_100 = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  // Fragment shader body (shared, with precision+version shims).
  // 6 orbs + sun. Analytic radial light fields, additive composition,
  // filmic tone-map, subtle grain, vignette.
  const FS_BODY = `
    #define PI 3.14159265359

    uniform vec2  uResolution;
    uniform float uTime;
    uniform vec2  uMouse;     // in pixels, canvas space (origin top-left, y flipped below)
    uniform float uAppear;    // 0..1 load ease
    uniform float uReduced;   // 1.0 if prefers-reduced-motion

    // Brand palette (sRGB-ish linearized by the tone-map at the end).
    const vec3 C_PURPLE_DARK  = vec3(0.384, 0.208, 0.561);
    const vec3 C_PURPLE_MID   = vec3(0.616, 0.318, 0.914);
    const vec3 C_PURPLE_LIGHT = vec3(0.878, 0.510, 0.996);
    const vec3 C_PINK_BRIGHT  = vec3(0.949, 0.184, 0.690);
    const vec3 C_PINK_SOFT    = vec3(0.996, 0.643, 0.855);
    const vec3 C_PLUM         = vec3(0.231, 0.173, 0.290);
    const vec3 C_BG           = vec3(0.933);

    float hash21(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    // exp falloff light — no 1/d^2 singularity, volumetric feel.
    // 'p' and 'c' are in canvas pixels; 'r' in canvas pixels.
    vec3 orbLight(vec2 p, vec2 c, float r, vec3 col, float intensity) {
      float d = length(p - c);
      float x = d / max(r, 1.0);
      float f = exp(-x * x * 1.15);          // soft gaussian-ish core
      float halo = exp(-x * 0.9) * 0.28;     // long, gentle halo
      return col * (f + halo) * intensity;
    }

    // Sun: 2-color directional gradient rotated by 'angle', with radial falloff.
    vec3 sunLight(vec2 p, vec2 c, float r, float angle, float pulse) {
      vec2 d = p - c;
      float dist = length(d);
      float x = dist / max(r, 1.0);

      // Falloff: bright core + wider halo.
      float core = exp(-x * x * 0.95);
      float halo = exp(-x * 0.7) * 0.45;
      float amp = (core + halo) * pulse;

      // Directional gradient aligned to 'angle' (cursor direction).
      vec2 dir = vec2(cos(angle), sin(angle));
      float t = dot(normalize(d + 1e-4), dir) * 0.5 + 0.5; // 0..1
      t = smoothstep(0.05, 0.95, t);
      vec3 col = mix(C_PURPLE_DARK, C_PINK_BRIGHT, t);

      return col * amp;
    }

    // A single orb's drifted & mouse-warped position + intensity boost.
    // Returns vec4(x, y, r_actual, intensity_mul)
    vec4 orbPlace(vec2 base, float r, vec2 mouse, float drift) {
      // Subtle idle drift (time).
      float t = uTime * (1.0 - uReduced);
      vec2 off = vec2(
        sin(t * 0.55 + drift) * 8.0,
        cos(t * 0.45 + drift * 1.3) * 8.0
      );
      vec2 pos = base + off;

      // Cursor warp — orbs are pulled toward mouse scaled by proximity.
      float dm = length(pos - mouse);
      // Distance metric normalized vs viewport smaller edge (so zoomed screens behave).
      float norm = min(uResolution.x, uResolution.y);
      float prox = smoothstep(0.6, 0.0, dm / max(norm, 1.0));
      vec2 toward = (mouse - pos) * (0.12 * prox);
      pos += toward;

      // Load-in: orbs emerge from slightly compressed radii.
      float rMul = mix(0.55, 1.0, uAppear);
      float iMul = mix(0.2, 1.0, uAppear) * (1.0 + 0.6 * prox);

      return vec4(pos, r * rMul, iMul);
    }

    void main() {
      vec2 fragXY = gl_FragCoord.xy;             // canvas pixels, origin bottom-left
      // Convert to top-left origin to match JS-supplied uMouse.
      vec2 p = vec2(fragXY.x, uResolution.y - fragXY.y);

      // Base radius scalar — brief says divide brief-radius by 800 of min(res).
      float rs = min(uResolution.x, uResolution.y) / 800.0;

      vec2 center = uResolution * 0.5;
      vec2 mouse = uMouse;

      // ---- Orb base positions: 3 rings × 2 orbs, centered. ----
      // Ring radii (brief): 170 (ERP, Razosana), 240 (Alga, Personals), 305 (Dokumenti, REST API)
      // In pixels: briefValue * rs.
      float t = uTime * (1.0 - uReduced);

      // Rings slow-rotate in alternating directions for a touch of life.
      float a0 = 0.00 + t * 0.05;
      float a1 = PI   + t * 0.05;
      float a2 = PI * 0.5  - t * 0.04;
      float a3 = PI * 1.5  - t * 0.04;
      float a4 = PI * 0.25 + t * 0.03;
      float a5 = PI * 1.25 + t * 0.03;

      vec2 posERP   = center + vec2(cos(a0), sin(a0)) * 170.0 * rs;
      vec2 posRaz   = center + vec2(cos(a1), sin(a1)) * 170.0 * rs;
      vec2 posAlga  = center + vec2(cos(a2), sin(a2)) * 240.0 * rs;
      vec2 posPers  = center + vec2(cos(a3), sin(a3)) * 240.0 * rs;
      vec2 posDok   = center + vec2(cos(a4), sin(a4)) * 305.0 * rs;
      vec2 posRest  = center + vec2(cos(a5), sin(a5)) * 305.0 * rs;

      // ---- Per-orb radii (visual size, not ring-radius) ----
      // Tuned for volumetric overlap.
      float rERP  = 220.0 * rs;
      float rRaz  = 220.0 * rs;
      float rAlga = 260.0 * rs;
      float rPers = 260.0 * rs;
      float rDok  = 300.0 * rs;
      float rRest = 300.0 * rs;

      // ---- Warp + load-in for every orb ----
      vec4 oERP  = orbPlace(posERP,  rERP,  mouse, 0.3);
      vec4 oRaz  = orbPlace(posRaz,  rRaz,  mouse, 1.1);
      vec4 oAlga = orbPlace(posAlga, rAlga, mouse, 2.0);
      vec4 oPers = orbPlace(posPers, rPers, mouse, 2.8);
      vec4 oDok  = orbPlace(posDok,  rDok,  mouse, 3.5);
      vec4 oRest = orbPlace(posRest, rRest, mouse, 4.2);

      // ---- Composite lights on the base ----
      vec3 col = C_BG;

      // Base intensities hand-tuned so the palette reads cleanly on #EEEEEE.
      col += orbLight(p, oERP.xy,  oERP.z,  C_PURPLE_LIGHT, 0.62 * oERP.w);
      col += orbLight(p, oRaz.xy,  oRaz.z,  C_PINK_BRIGHT,  0.58 * oRaz.w);
      col += orbLight(p, oAlga.xy, oAlga.z, C_PURPLE_MID,   0.58 * oAlga.w);
      col += orbLight(p, oPers.xy, oPers.z, C_PURPLE_DARK,  0.55 * oPers.w);
      col += orbLight(p, oDok.xy,  oDok.z,  C_PLUM,         0.42 * oDok.w);
      col += orbLight(p, oRest.xy, oRest.z, C_PINK_SOFT,    0.62 * oRest.w);

      // ---- Sun at center ----
      vec2 sunPos = center;
      float sunR  = 360.0 * rs;

      // Sun "looks at" cursor: gradient angle = angle(mouse - sunPos)
      vec2 md = mouse - sunPos;
      float sunAngle = atan(md.y, md.x);

      // Subtle pulse (sine, ±4%) + load-in.
      float pulse = (1.0 + 0.04 * sin(t * 1.2)) * mix(0.25, 1.0, uAppear);

      col += sunLight(p, sunPos, sunR, sunAngle, 0.95 * pulse);

      // ---- Background grain ----
      float g = hash21(fragXY + floor(t * 30.0));
      col += (g - 0.5) * 0.012;

      // ---- Tone-map (filmic Reinhard) + mild gamma ----
      col = col / (1.0 + col);
      col = pow(col, vec3(0.95));

      // ---- Vignette ----
      vec2 nuv = (fragXY / uResolution) - 0.5;
      float vig = smoothstep(0.95, 0.35, length(nuv));
      col *= mix(0.88, 1.0, vig);

      // ---- Load fade (final safety on top of uAppear scaling) ----
      col = mix(C_BG, col, clamp(uAppear, 0.0, 1.0));

      outColor(col);
    }
  `;

  const FS_300 = `#version 300 es
    precision highp float;
    out vec4 fragColor;
    #define outColor(c) fragColor = vec4((c), 1.0)
  ` + FS_BODY;

  const FS_100 = `
    precision highp float;
    #define outColor(c) gl_FragColor = vec4((c), 1.0)
  ` + FS_BODY;

  // ---------- Compile / link ----------
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(s), "\n" + src);
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vsSrc = isWebGL2 ? VS_300 : VS_100;
  const fsSrc = isWebGL2 ? FS_300 : FS_100;
  const vs = compile(gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) {
    canvas.style.display = "none";
    return;
  }

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, "aPos");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    canvas.style.display = "none";
    return;
  }
  gl.useProgram(prog);

  // ---------- Fullscreen triangle (covers viewport, one tri) ----------
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
       3, -1,
      -1,  3,
    ]),
    gl.STATIC_DRAW,
  );

  let vao = null;
  if (isWebGL2) {
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
  }
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // ---------- Uniform locations ----------
  const uResolution = gl.getUniformLocation(prog, "uResolution");
  const uTime       = gl.getUniformLocation(prog, "uTime");
  const uMouse      = gl.getUniformLocation(prog, "uMouse");
  const uAppear     = gl.getUniformLocation(prog, "uAppear");
  const uReduced    = gl.getUniformLocation(prog, "uReduced");

  // ---------- State ----------
  const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = prefersReducedMotion.matches;
  prefersReducedMotion.addEventListener?.("change", (e) => { reducedMotion = e.matches; });

  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  // Mouse in CSS pixels (top-left origin). We send CANVAS pixels to GL.
  const target = { x: 0, y: 0 }; // target mouse in CSS px
  const smooth = { x: 0, y: 0 }; // smoothed mouse in CSS px
  let userMoved = false;
  let lastUserMoveAt = 0;

  function setCanvasSize() {
    const w = Math.max(1, Math.floor(window.innerWidth));
    const h = Math.max(1, Math.floor(window.innerHeight));
    const r = dpr();
    const pw = Math.floor(w * r);
    const ph = Math.floor(h * r);
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    gl.viewport(0, 0, pw, ph);

    // Default target to center until user moves.
    if (!userMoved) {
      target.x = w * 0.5;
      target.y = h * 0.5;
      smooth.x = target.x;
      smooth.y = target.y;
    }
  }

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    target.x = e.clientX - rect.left;
    target.y = e.clientY - rect.top;
    userMoved = true;
    lastUserMoveAt = performance.now();
  }

  // Touch: use first touch as cursor proxy.
  function onTouch(e) {
    if (!e.touches || e.touches.length === 0) return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    target.x = t.clientX - rect.left;
    target.y = t.clientY - rect.top;
    userMoved = true;
    lastUserMoveAt = performance.now();
  }

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("touchmove",  onTouch, { passive: true });
  window.addEventListener("resize", setCanvasSize);
  window.addEventListener("orientationchange", setCanvasSize);

  setCanvasSize();

  // ---------- Appear + loop ----------
  const appearDurationMs = 1500;
  const startTime = performance.now();

  function smoothstep01(x) {
    x = Math.max(0, Math.min(1, x));
    return x * x * (3 - 2 * x);
  }

  let rafId = 0;
  let running = true;

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (!running) return;

    const elapsed = (now - startTime) / 1000; // s
    const appear = smoothstep01((now - startTime) / appearDurationMs);

    // --- Cursor source: real user, or autonomous orbit fallback. ---
    const cssW = window.innerWidth;
    const cssH = window.innerHeight;

    const msSinceMove = now - (lastUserMoveAt || 0);
    const idleFallback = !userMoved && (now - startTime) > 2000;

    if (idleFallback) {
      // Slow circular orbit around center — "cursor proxy".
      const cx = cssW * 0.5;
      const cy = cssH * 0.5;
      const rad = Math.min(cssW, cssH) * 0.22;
      const a = elapsed * 0.35;
      target.x = cx + Math.cos(a) * rad;
      target.y = cy + Math.sin(a * 0.9) * rad * 0.75;
    }

    // Smooth toward target (LERP factor 0.08).
    smooth.x += (target.x - smooth.x) * 0.08;
    smooth.y += (target.y - smooth.y) * 0.08;

    // Convert smooth mouse (CSS px, top-left origin) → canvas pixels (same origin).
    const r = dpr();
    const mx = smooth.x * r;
    const my = smooth.y * r;

    // Uniforms
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uTime, reducedMotion ? 0.0 : elapsed);
    gl.uniform2f(uMouse, mx, my);
    gl.uniform1f(uAppear, appear);
    gl.uniform1f(uReduced, reducedMotion ? 1.0 : 0.0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  rafId = requestAnimationFrame(frame);

  // ---------- Pause on tab hide ----------
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      running = false;
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    } else if (!running) {
      running = true;
      // Resync start-time so appear is already done (don't replay load-in).
      rafId = requestAnimationFrame(frame);
    }
  });
})();
