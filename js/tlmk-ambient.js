/* =====================================================================
   TLMK Studio — Ambient cinematic background
   Drop-in: add  <script src="js/tlmk-ambient.js"></script>  before </body>
   No markup or CSS changes needed. Respects prefers-reduced-motion.

   Layers it injects:
     • Volumetric light haze  — slow-drifting soft glows (CSS, z-index -1)
     • Floating dust motes    — faint canvas particles      (z-index -1)
     • Film grain             — cinematic noise over the page (z-index 40)

   Tune the look with the CONFIG block below.
   ===================================================================== */
(function () {
  "use strict";

  var CONFIG = {
    intensity: 0.22,   // 0 = barely there, 1 = bold. Master dial for grain + dust.
    grain: true,
    dust: true,
    haze: true
  };

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var I = CONFIG.intensity;

  /* ---- keyframes (haze drift + nothing else relies on CSS anim) ---- */
  var style = document.createElement("style");
  style.textContent =
    "@keyframes tlmkHazeA{0%{transform:translate(-6%,-4%) scale(1.05)}50%{transform:translate(8%,6%) scale(1.25)}100%{transform:translate(-6%,-4%) scale(1.05)}}" +
    "@keyframes tlmkHazeB{0%{transform:translate(6%,8%) scale(1.15)}50%{transform:translate(-8%,-6%) scale(1)}100%{transform:translate(6%,8%) scale(1.15)}}" +
    "@media (prefers-reduced-motion: reduce){.tlmk-haze{animation:none!important}}";
  document.head.appendChild(style);

  function el(css) { var d = document.createElement("div"); d.style.cssText = css; d.setAttribute("aria-hidden", "true"); return d; }

  /* ---- light haze ---- */
  if (CONFIG.haze) {
    var hazeWrap = el("position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden;");
    var a = el("position:absolute;top:-10%;left:-5%;width:70vw;height:70vw;border-radius:50%;background:radial-gradient(circle,rgba(120,140,170,0.10),rgba(120,140,170,0) 62%);filter:blur(20px);");
    var b = el("position:absolute;bottom:-20%;right:-10%;width:80vw;height:80vw;border-radius:50%;background:radial-gradient(circle,rgba(180,150,120,0.09),rgba(180,150,120,0) 60%);filter:blur(24px);");
    var c = el("position:absolute;top:35%;left:40%;width:55vw;height:55vw;border-radius:50%;background:radial-gradient(circle,rgba(150,160,200,0.06),rgba(150,160,200,0) 60%);filter:blur(30px);");
    a.className = b.className = c.className = "tlmk-haze";
    if (!reduced) {
      a.style.animation = "tlmkHazeA 26s ease-in-out infinite";
      b.style.animation = "tlmkHazeB 34s ease-in-out infinite";
      c.style.animation = "tlmkHazeA 44s ease-in-out infinite reverse";
    }
    hazeWrap.appendChild(a); hazeWrap.appendChild(b); hazeWrap.appendChild(c);
    document.body.appendChild(hazeWrap);
  }

  /* ---- canvases ---- */
  var dust, dctx, grain, gctx, tile, tctx, motes = [], W, H, dpr, frame = 0, raf;

  if (CONFIG.dust) {
    dust = document.createElement("canvas");
    dust.style.cssText = "position:fixed;inset:0;z-index:-1;width:100%;height:100%;pointer-events:none;";
    dust.setAttribute("aria-hidden", "true");
    document.body.appendChild(dust);
    dctx = dust.getContext("2d");
  }
  if (CONFIG.grain) {
    grain = document.createElement("canvas");
    grain.style.cssText = "position:fixed;inset:0;z-index:40;width:100%;height:100%;pointer-events:none;mix-blend-mode:overlay;opacity:0.5;";
    grain.setAttribute("aria-hidden", "true");
    document.body.appendChild(grain);
    gctx = grain.getContext("2d");
    tile = document.createElement("canvas");
    tile.width = tile.height = 140;
    tctx = tile.getContext("2d");
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    [dust, grain].forEach(function (cv) { if (cv) { cv.width = W * dpr; cv.height = H * dpr; } });
    if (dctx) dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initDust() {
    var count = Math.round((W / 1440) * (24 + I * 60));
    motes = [];
    for (var i = 0; i < count; i++) {
      motes.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.4 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.18,
        a: 0.05 + Math.random() * 0.35,
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  function drawMote(m) {
    var flick = 0.6 + 0.4 * Math.sin(m.tw);
    dctx.beginPath();
    dctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
    dctx.fillStyle = "rgba(220,225,235," + (m.a * flick * (0.5 + I)) + ")";
    dctx.fill();
  }

  function updateDust() {
    dctx.clearRect(0, 0, W, H);
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i];
      m.x += m.vx; m.y += m.vy; m.tw += 0.03;
      if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
      if (m.x < -10) m.x = W + 10;
      if (m.x > W + 10) m.x = -10;
      drawMote(m);
    }
  }

  function drawGrain() {
    var img = tctx.createImageData(tile.width, tile.height), d = img.data;
    var alpha = Math.floor(255 * (0.10 + I * 0.22));
    for (var i = 0; i < d.length; i += 4) {
      var v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = Math.random() < 0.5 ? alpha : 0;
    }
    tctx.putImageData(img, 0, 0);
    gctx.clearRect(0, 0, grain.width, grain.height);
    var ox = (Math.random() * tile.width) | 0, oy = (Math.random() * tile.height) | 0;
    for (var x = -ox; x < grain.width; x += tile.width)
      for (var y = -oy; y < grain.height; y += tile.height)
        gctx.drawImage(tile, x, y);
  }

  resize();
  if (CONFIG.dust) initDust();
  window.addEventListener("resize", function () { resize(); if (CONFIG.dust) initDust(); });

  if (reduced) {
    if (CONFIG.grain) drawGrain();
    if (CONFIG.dust) { dctx.clearRect(0, 0, W, H); motes.forEach(drawMote); }
  } else {
    function loop() {
      frame++;
      if (CONFIG.grain && frame % 2 === 0) drawGrain();   // ~30fps grain
      if (CONFIG.dust) updateDust();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    /* Pause the render loop while the tab is hidden — no visible change
       (nothing is on screen), but it stops the grain/dust work and saves
       CPU and battery. Resumes seamlessly when the tab is shown again. */
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    });
  }
})();
