/**
 * Aurora Background — Ateljé Sällström
 *
 * Cinematic flowing-gradient background: large elliptical color fields
 * in the brand palette drift, rotate and breathe on slow layered sine
 * waves over a white canvas. Fields are composited with `multiply`, so
 * where colors overlap they deepen and merge into each other like ink.
 * The whole composition leans subtly with the cursor (heavily eased).
 * A fine animated film-grain overlay sits on top for a filmic finish.
 *
 * Rendered to a small internal canvas that the browser upscales to the
 * viewport — the upscaling acts as a free, perfectly smooth blur.
 *
 * Respects prefers-reduced-motion (static frame, static grain).
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     Configuration
  ───────────────────────────────────────────── */

  var RENDER_W = 320;        // internal render width (px)
  var CURSOR_EASE = 0.035;   // cursor smoothing — lower = silkier

  // Saturated companions to the brand palette (multiply over white
  // reproduces them exactly; overlaps blend darker and richer).
  var C = {
    cyan:   { r: 125, g: 212, b: 220 },
    teal:   { r:  30, g: 158, b: 178 },
    pink:   { r: 240, g: 118, b: 178 },
    purple: { r: 196, g:  96, b: 210 }
  };

  /**
   * Elliptical color fields.
   *  x/y      anchor (fraction of canvas)
   *  rx       radius along the ellipse's major axis (fraction of width)
   *  squash   ry/rx ratio (0.5 = wide oval)
   *  rot      base rotation (rad), rotSpd (rad/s, slow)
   *  drift    wander distance (fraction of width); f1/f2 sine freqs
   *  alpha    core opacity — bold, this is meant to be seen
   *  parallax cursor influence (negative = drifts away → depth)
   */
  var FIELDS = [
    // Teal mass — sweeps across the whole upper half
    { c: C.teal,   x: 0.75, y: 0.15, rx: 0.42, squash: 0.72, rot: -0.5, rotSpd: 0.055, drift: 0.32, f1: 0.140, f2: 0.090, alpha: 0.62, parallax:  0.055 },
    // Cyan companion — travels widest, weaving through the others
    { c: C.cyan,   x: 0.55, y: 0.35, rx: 0.36, squash: 0.60, rot:  0.7, rotSpd: -0.075, drift: 0.40, f1: 0.110, f2: 0.170, alpha: 0.45, parallax: -0.040 },
    // Pink field — arcs between center-left and mid-screen
    { c: C.pink,   x: 0.30, y: 0.55, rx: 0.40, squash: 0.62, rot:  0.4, rotSpd: 0.065, drift: 0.34, f1: 0.125, f2: 0.080, alpha: 0.55, parallax:  0.070 },
    // Purple — long, slow diagonal strokes through the lower half
    { c: C.purple, x: 0.18, y: 0.85, rx: 0.32, squash: 0.75, rot: -0.8, rotSpd: -0.090, drift: 0.30, f1: 0.095, f2: 0.150, alpha: 0.45, parallax: -0.050 },
    // Soft pink glow — counterweight, drifting bottom-right to center
    { c: C.pink,   x: 0.80, y: 0.85, rx: 0.30, squash: 0.80, rot:  0.2, rotSpd: 0.070, drift: 0.36, f1: 0.160, f2: 0.105, alpha: 0.38, parallax:  0.085 }
  ];

  /* ─────────────────────────────────────────────
     State
  ───────────────────────────────────────────── */
  var canvas, ctx;
  var W = RENDER_W, H = 200;
  var animId = null;
  var startTime = performance.now();

  var mouseTarget = { x: 0, y: 0 };
  var mouseEased  = { x: 0, y: 0 };

  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────
     Setup
  ───────────────────────────────────────────── */
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'aurora-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
      'pointer-events:none;z-index:0;';
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
    return !!ctx;
  }

  // Film grain — fixed overlay div with an SVG turbulence texture.
  // Styling and the jitter animation live in style.css (.grain-overlay).
  function createGrain() {
    var g = document.createElement('div');
    g.className = 'grain-overlay';
    g.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(g, canvas.nextSibling);
  }

  function resize() {
    var vw = window.innerWidth || 1;
    var vh = window.innerHeight || 1;
    W = RENDER_W;
    H = Math.max(100, Math.round(RENDER_W * (vh / vw)));
    canvas.width = W;
    canvas.height = H;
  }

  /* ─────────────────────────────────────────────
     Drawing
  ───────────────────────────────────────────── */
  function drawFrame(t) {
    // White base — multiply needs an opaque light ground to bite into
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#FAF9F7';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'multiply';

    for (var i = 0; i < FIELDS.length; i++) {
      var f = FIELDS[i];

      // Slow Lissajous wander — never visibly repeats
      var dx = Math.sin(t * f.f1 + i * 1.7) * f.drift
             + Math.sin(t * f.f2 * 0.7 + i * 3.1) * f.drift * 0.5;
      var dy = Math.cos(t * f.f2 + i * 2.3) * f.drift
             + Math.cos(t * f.f1 * 0.6 + i * 0.9) * f.drift * 0.5;

      var x = (f.x + dx + mouseEased.x * f.parallax) * W;
      var y = (f.y + dy + mouseEased.y * f.parallax) * H;

      // Breathe: radius, squash and opacity cycle noticeably
      var rx = f.rx * W * (1 + 0.22 * Math.sin(t * 0.13 + i * 2.1));
      var squash = f.squash * (1 + 0.18 * Math.sin(t * 0.10 + i * 1.1));
      var rot = f.rot + t * f.rotSpd;
      var a = f.alpha * (1 + 0.25 * Math.sin(t * 0.11 + i * 1.3));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, squash);

      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      g.addColorStop(0,    'rgba(' + f.c.r + ',' + f.c.g + ',' + f.c.b + ',' + a.toFixed(3) + ')');
      g.addColorStop(0.55, 'rgba(' + f.c.r + ',' + f.c.g + ',' + f.c.b + ',' + (a * 0.55).toFixed(3) + ')');
      g.addColorStop(1,    'rgba(' + f.c.r + ',' + f.c.g + ',' + f.c.b + ',0)');

      ctx.fillStyle = g;
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  function loop(now) {
    mouseEased.x += (mouseTarget.x - mouseEased.x) * CURSOR_EASE;
    mouseEased.y += (mouseTarget.y - mouseEased.y) * CURSOR_EASE;
    drawFrame((now - startTime) / 1000);
    animId = requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────
     Events
  ───────────────────────────────────────────── */
  function onMouseMove(e) {
    mouseTarget.x = e.clientX / window.innerWidth - 0.5;
    mouseTarget.y = e.clientY / window.innerHeight - 0.5;
  }

  function onMouseLeave() {
    mouseTarget.x = 0;
    mouseTarget.y = 0;
  }

  function onVisibility() {
    if (document.hidden) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else if (!animId && !reduced) {
      animId = requestAnimationFrame(loop);
    }
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (reduced) drawFrame(0);
    }, 150);
  }

  /* ─────────────────────────────────────────────
     Init
  ───────────────────────────────────────────── */
  function init() {
    if (!createCanvas()) return;
    createGrain();
    resize();

    if (reduced) {
      drawFrame(0);
      window.addEventListener('resize', onResize, { passive: true });
      return;
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    animId = requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
