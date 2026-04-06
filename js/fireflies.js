/**
 * Firefly Particle Animation — Ateljé Sällström
 *
 * Canvas-based atmospheric particle system using brand colors.
 * Each particle is rendered as a soft radial-gradient glow blob —
 * full color at the center, smoothly fading to transparent at the edge.
 * Particles flicker, fade, respawn, and repel from the cursor.
 * Renders behind all page content via a fixed, full-viewport canvas.
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     Configuration
  ───────────────────────────────────────────────────────── */
  var CONFIG = {

    /** Responsive particle count: ~1 per 10 000 px², clamped 35–130 */
    particleCount: function () {
      var area = window.innerWidth * window.innerHeight;
      return Math.max(35, Math.min(130, Math.round(area / 10000)));
    },

    /** Brand palette */
    colors: [
      { r: 155, g: 225, b: 229 }, // #9BE1E5  cyan
      { r:  42, g: 173, b: 193 }, // #2AADC1  deep teal
      { r: 244, g: 145, b: 197 }, // #F491C5  hot pink
      { r: 210, g: 105, b: 218 }, // #D269DA  vivid purple
    ],

    /**
     * Size tiers — each particle is assigned one tier at birth.
     * `radius` is the full gradient radius (px); the color-core is
     * concentrated in the inner ~30 % of that radius.
     * Weights control how often each tier is chosen.
     */
    sizeTiers: [
      { radius: 6,   weight: 3 }, // small  — firefly-scale
      { radius: 13,  weight: 4 }, // medium
      { radius: 24,  weight: 2 }, // large
      { radius: 40,  weight: 1 }, // extra-large (rare)
    ],

    /** Peak opacity at the gradient centre, per tier */
    peakOpacity: {
      small:       0.75,
      medium:      0.60,
      large:       0.45,
      extraLarge:  0.30,
    },

    /** Drift speed range (px / frame at 60 fps) */
    speedMin: 0.06,
    speedMax: 0.30,

    /** Flicker — opacity oscillates around its peak value */
    flickerDepth:    0.28,   // ± fraction of peakOpacity
    flickerRateMin:  0.004,  // slow, languid particles
    flickerRateMax:  0.022,  // fast, nervous particles

    /** Fade-out / respawn */
    fadeChanceMin:   0.0003, // slow particles rarely start fading
    fadeChanceMax:   0.0012, // fast particles fade more readily
    // Fade-out: slow breath — takes ~4–10 s to fully disappear at 60 fps
    fadeSpeedMin:    0.0015,
    fadeSpeedMax:    0.0045,
    // Fade-in: particles ease in from opacity 0 over ~3–7 s
    fadeInSpeedMin:  0.0018,
    fadeInSpeedMax:  0.0050,
    respawnMin:      20,     // frames before respawn
    respawnMax:      100,

    /** Cursor repulsion */
    repelRadius:   140,
    repelStrength:   3.0,
  };

  /* ─────────────────────────────────────────────────────────
     Helpers
  ───────────────────────────────────────────────────────── */
  function rand(lo, hi)  { return Math.random() * (hi - lo) + lo; }
  function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }

  /** Weighted random pick from sizeTiers */
  function pickTier() {
    var tiers = CONFIG.sizeTiers;
    var total = 0;
    for (var i = 0; i < tiers.length; i++) total += tiers[i].weight;
    var r = Math.random() * total;
    var acc = 0;
    for (var j = 0; j < tiers.length; j++) {
      acc += tiers[j].weight;
      if (r < acc) return j; // 0=small, 1=medium, 2=large, 3=extra-large
    }
    return 1;
  }

  function pickColor() {
    return CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
  }

  /* ─────────────────────────────────────────────────────────
     Particle
  ───────────────────────────────────────────────────────── */
  function Particle() {
    this.alive = false;
    this.respawnTimer = 0;
    this.reset(true);
  }

  Particle.prototype.reset = function (initial) {
    var w = canvas.width  / dpr;
    var h = canvas.height / dpr;

    this.x = rand(0, w);
    this.y = rand(0, h);

    // Color
    var c = pickColor();
    this.r = c.r; this.g = c.g; this.b = c.b;

    // Size tier
    var ti = pickTier();
    this.radius = CONFIG.sizeTiers[ti].radius;
    var peakKeys = ['small', 'medium', 'large', 'extraLarge'];
    this.peakOpacity = CONFIG.peakOpacity[peakKeys[ti]];

    // Drift
    var angle = rand(0, Math.PI * 2);
    var speed = rand(CONFIG.speedMin, CONFIG.speedMax);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.baseSpeed = speed;

    // Flicker — each particle gets its own rate and phase
    this.flickerPhase = rand(0, Math.PI * 2);
    this.flickerRate  = rand(CONFIG.flickerRateMin, CONFIG.flickerRateMax);

    // Fade — faster flickerers also fade more readily and quickly
    var t = (this.flickerRate - CONFIG.flickerRateMin) /
            (CONFIG.flickerRateMax - CONFIG.flickerRateMin); // 0–1
    this.fadeChance = CONFIG.fadeChanceMin + t * (CONFIG.fadeChanceMax - CONFIG.fadeChanceMin);
    this.fadeSpeed  = CONFIG.fadeSpeedMin  + t * (CONFIG.fadeSpeedMax  - CONFIG.fadeSpeedMin);

    // Fade-in speed — each particle eases in at its own pace
    var t2 = (this.flickerRate - CONFIG.flickerRateMin) /
             (CONFIG.flickerRateMax - CONFIG.flickerRateMin);
    this.fadeInSpeed = CONFIG.fadeInSpeedMin + t2 * (CONFIG.fadeInSpeedMax - CONFIG.fadeInSpeedMin);

    // Lifecycle state: 'in' (fading in), 'live' (flickering), 'out' (fading out)
    // Initial particles start at a random point in their live phase
    this.phase   = initial ? 'live' : 'in';
    this.opacity = initial ? rand(0, this.peakOpacity) : 0;

    this.alive  = true;
    this.fading = false; // kept for legacy compat, phase drives behaviour
  };

  Particle.prototype.update = function () {
    if (!this.alive) {
      this.respawnTimer--;
      if (this.respawnTimer <= 0) this.reset(false);
      return;
    }

    if (this.phase === 'in') {
      // Ease in: gradually increase opacity toward peakOpacity
      this.opacity += this.fadeInSpeed;
      if (this.opacity >= this.peakOpacity) {
        this.opacity = this.peakOpacity;
        this.phase = 'live';
        // Sync flicker phase so it starts at the right level
        this.flickerPhase = Math.PI / 2; // sin(π/2) = 1 → starts at peak
      }
    } else if (this.phase === 'live') {
      // Flicker: sine wave around peakOpacity
      this.flickerPhase += this.flickerRate;
      var wave = Math.sin(this.flickerPhase); // −1 … +1
      this.opacity = this.peakOpacity + wave * this.peakOpacity * CONFIG.flickerDepth;
      if (this.opacity < 0) this.opacity = 0;
      if (this.opacity > 1) this.opacity = 1;

      // Random trigger to begin fading out
      if (Math.random() < this.fadeChance) this.phase = 'out';

    } else if (this.phase === 'out') {
      // Ease out: gradually decrease opacity to zero
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.alive = false;
        this.respawnTimer = randInt(CONFIG.respawnMin, CONFIG.respawnMax);
        return;
      }
    }

    // Cursor repulsion
    var dx   = this.x - mouse.x;
    var dy   = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.repelRadius && dist > 0) {
      var force = (1 - dist / CONFIG.repelRadius) * CONFIG.repelStrength;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // Friction to bleed off repulsion energy
    this.vx *= 0.978;
    this.vy *= 0.978;

    // Re-inject base drift if nearly stopped
    var spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (spd < this.baseSpeed * 0.4) {
      var a = Math.atan2(this.vy, this.vx) || rand(0, Math.PI * 2);
      this.vx += Math.cos(a) * 0.012;
      this.vy += Math.sin(a) * 0.012;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    var w = canvas.width  / dpr;
    var h = canvas.height / dpr;
    var pad = this.radius + 10;
    if (this.x < -pad)    this.x = w + pad;
    if (this.x > w + pad) this.x = -pad;
    if (this.y < -pad)    this.y = h + pad;
    if (this.y > h + pad) this.y = -pad;
  };

  Particle.prototype.draw = function () {
    if (!this.alive || this.opacity <= 0.005) return;

    var x = this.x, y = this.y, rad = this.radius;
    var op = this.opacity;

    // Radial gradient: full color+opacity at centre → fully transparent at edge
    var grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0,    'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + op.toFixed(3) + ')');
    grad.addColorStop(0.35, 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (op * 0.55).toFixed(3) + ')');
    grad.addColorStop(0.70, 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (op * 0.15).toFixed(3) + ')');
    grad.addColorStop(1,    'rgba(' + this.r + ',' + this.g + ',' + this.b + ',0)');

    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  };

  /* ─────────────────────────────────────────────────────────
     Canvas setup
  ───────────────────────────────────────────────────────── */
  var canvas, ctx, dpr = 1;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };
  var animId = null;

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'firefly-canvas';
    canvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;' +
      'pointer-events:none;z-index:0;';
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    var count = CONFIG.particleCount();
    particles = [];
    for (var i = 0; i < count; i++) particles.push(new Particle());
  }

  /* ─────────────────────────────────────────────────────────
     Animation loop
  ───────────────────────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animId = requestAnimationFrame(loop);
  }

  /* ─────────────────────────────────────────────────────────
     Event listeners
  ───────────────────────────────────────────────────────── */
  function onMouseMove(e)  { mouse.x = e.clientX; mouse.y = e.clientY; }
  function onMouseLeave()  { mouse.x = -9999; mouse.y = -9999; }
  function onTouchMove(e)  {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }
  function onTouchEnd()    { mouse.x = -9999; mouse.y = -9999; }

  function onVisibility() {
    if (document.hidden) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else {
      if (!animId) animId = requestAnimationFrame(loop);
    }
  }

  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); initParticles(); }, 200);
  }

  /* ─────────────────────────────────────────────────────────
     Init
  ───────────────────────────────────────────────────────── */
  function init() {
    createCanvas();
    resize();
    initParticles();

    window.addEventListener('mousemove',       onMouseMove,  { passive: true });
    document.addEventListener('mouseleave',    onMouseLeave);
    window.addEventListener('touchmove',       onTouchMove,  { passive: true });
    window.addEventListener('touchend',        onTouchEnd,   { passive: true });
    window.addEventListener('resize',          onResize,     { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    animId = requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
