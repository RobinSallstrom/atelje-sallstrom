/**
 * Firefly Particle Animation — Ateljé Sällström
 * 
 * Atmospheric canvas-based particle system using brand colors.
 * Particles flicker, fade, respawn, glow, and repel from the cursor.
 * Renders behind all page content via a fixed, full-viewport canvas.
 */
(function () {
  'use strict';

  /* ── Configuration ─────────────────────────────────────── */
  const CONFIG = {
    /** Number of particles (scales with viewport area) */
    particleCount: function () {
      const area = window.innerWidth * window.innerHeight;
      // ~1 particle per 12 000 px², clamped 30–120
      return Math.max(30, Math.min(120, Math.round(area / 12000)));
    },
    /** Brand palette — each particle picks one at random */
    colors: [
      { r: 155, g: 225, b: 229 }, // #9BE1E5 cyan
      { r: 42,  g: 173, b: 193 }, // #2AADC1 deep teal
      { r: 244, g: 145, b: 197 }, // #F491C5 hot pink
      { r: 210, g: 105, b: 218 }, // #D269DA vivid purple
    ],
    /** Size range (radius in px) */
    sizeMin: 1.5,
    sizeMax: 4.5,
    /** Drift speed range (px / frame at 60 fps) */
    speedMin: 0.08,
    speedMax: 0.35,
    /** Opacity flicker */
    opacityMin: 0.05,
    opacityMax: 0.55,
    flickerSpeed: 0.003,   // base rate of opacity oscillation
    /** Glow blur radius multiplier (× particle size) */
    glowMultiplier: 8,
    /** Mouse repulsion */
    repelRadius: 130,       // px — detection distance
    repelStrength: 2.8,     // push force multiplier
    /** Fade-out / respawn */
    fadeChance: 0.001,      // per-frame probability a particle starts fading
    fadeSpeed: 0.012,       // opacity decrease per frame while fading
    respawnDelay: [40, 120] // frames to wait before respawning (min, max)
  };

  /* ── State ─────────────────────────────────────────────── */
  let canvas, ctx;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };
  let animId = null;
  let dpr = 1;

  /* ── Helpers ───────────────────────────────────────────── */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* ── Particle class ────────────────────────────────────── */
  function Particle(forcePos) {
    this.reset(forcePos);
  }

  Particle.prototype.reset = function (forcePos) {
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;

    if (forcePos) {
      this.x = rand(0, w);
      this.y = rand(0, h);
    } else {
      // Respawn at a random edge or random position
      this.x = rand(0, w);
      this.y = rand(0, h);
    }

    var color = pick(CONFIG.colors);
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;

    this.size = rand(CONFIG.sizeMin, CONFIG.sizeMax);
    this.baseSpeed = rand(CONFIG.speedMin, CONFIG.speedMax);

    // Gentle random drift direction
    var angle = rand(0, Math.PI * 2);
    this.vx = Math.cos(angle) * this.baseSpeed;
    this.vy = Math.sin(angle) * this.baseSpeed;

    // Flicker state
    this.opacity = rand(CONFIG.opacityMin, CONFIG.opacityMax);
    this.flickerPhase = rand(0, Math.PI * 2);
    this.flickerRate = rand(CONFIG.flickerSpeed * 0.5, CONFIG.flickerSpeed * 2);

    // Life state
    this.alive = true;
    this.fading = false;
    this.respawnTimer = 0;
  };

  Particle.prototype.update = function () {
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;

    // If waiting to respawn
    if (!this.alive) {
      this.respawnTimer--;
      if (this.respawnTimer <= 0) {
        this.reset(false);
        this.alive = true;
        this.fading = false;
        this.opacity = 0; // will fade in via flicker
      }
      return;
    }

    // Random chance to start fading
    if (!this.fading && Math.random() < CONFIG.fadeChance) {
      this.fading = true;
    }

    // Fading out
    if (this.fading) {
      this.opacity -= CONFIG.fadeSpeed;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.alive = false;
        this.respawnTimer = randInt(CONFIG.respawnDelay[0], CONFIG.respawnDelay[1]);
        return;
      }
    } else {
      // Normal flicker
      this.flickerPhase += this.flickerRate;
      var flicker = (Math.sin(this.flickerPhase) + 1) / 2; // 0–1
      this.opacity = CONFIG.opacityMin + flicker * (CONFIG.opacityMax - CONFIG.opacityMin);
    }

    // Mouse repulsion
    var dx = this.x - mouse.x;
    var dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.repelRadius && dist > 0) {
      var force = (1 - dist / CONFIG.repelRadius) * CONFIG.repelStrength;
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    // Drift with gentle friction to bleed off repulsion energy
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Re-inject a tiny base drift so particles never fully stop
    var angle = Math.atan2(this.vy, this.vx);
    var currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed < this.baseSpeed * 0.5) {
      this.vx += Math.cos(angle || rand(0, Math.PI * 2)) * 0.01;
      this.vy += Math.sin(angle || rand(0, Math.PI * 2)) * 0.01;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges with padding
    var pad = 20;
    if (this.x < -pad) this.x = w + pad;
    if (this.x > w + pad) this.x = -pad;
    if (this.y < -pad) this.y = h + pad;
    if (this.y > h + pad) this.y = -pad;
  };

  Particle.prototype.draw = function () {
    if (!this.alive || this.opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.shadowColor = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',0.8)';
    ctx.shadowBlur = this.size * CONFIG.glowMultiplier;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',1)';
    ctx.fill();
    ctx.restore();
  };

  /* ── Canvas setup ──────────────────────────────────────── */
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'firefly-canvas';
    canvas.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100vw',
      'height:100vh',
      'pointer-events:none',
      'z-index:0',
      'opacity:1'
    ].join(';');
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    var count = CONFIG.particleCount();
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle(true));
    }
  }

  /* ── Animation loop ────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animId = requestAnimationFrame(loop);
  }

  /* ── Event listeners ───────────────────────────────────── */
  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }

  function onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }

  function onTouchEnd() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  /* ── Visibility: pause when tab is hidden ──────────────── */
  function onVisibility() {
    if (document.hidden) {
      if (animId) { cancelAnimationFrame(animId); animId = null; }
    } else {
      if (!animId) { animId = requestAnimationFrame(loop); }
    }
  }

  /* ── Debounced resize ──────────────────────────────────── */
  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      initParticles();
    }, 200);
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    createCanvas();
    resize();
    initParticles();

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    animId = requestAnimationFrame(loop);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
