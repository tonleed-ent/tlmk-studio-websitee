/* =====================================================================
   TLMK Studio — main.js
   Vanilla JS. No libraries.
   1. Mobile hamburger nav toggle
   2. Portfolio lightbox (click to open, ESC / close button to dismiss)
   ===================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------------
     1. Mobile nav toggle
     ------------------------------------------------------------------- */
  var nav = document.querySelector('.nav');
  var toggle = document.querySelector('.nav__toggle');

  if (nav && toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the menu after tapping a link
    nav.querySelectorAll('.nav__links a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------------------------
     2. Team details
     ------------------------------------------------------------------- */
  document.querySelectorAll('.team__member[data-role]').forEach(function (member) {
    var role = member.querySelector('.team__role');
    if (role) role.textContent = member.getAttribute('data-role');

    ['experience', 'focus'].forEach(function (field) {
      var value = member.getAttribute('data-' + field);
      var target = member.querySelector('[data-team-field="' + field + '"]');
      if (value && target) target.textContent = value;
    });
  });

  /* -------------------------------------------------------------------
     3. Portfolio lightbox
     ------------------------------------------------------------------- */
  var items = document.querySelectorAll('.gallery__item');
  if (!items.length) return;

  // Build the lightbox once and reuse it.
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML =
    '<button class="lightbox__close" aria-label="Close">&times;</button>' +
    '<div class="lightbox__stage">' +
      '<div class="lightbox__media"></div>' +
      '<span class="lightbox__num"></span>' +
    '</div>';
  document.body.appendChild(lightbox);

  var closeBtn = lightbox.querySelector('.lightbox__close');
  var media = lightbox.querySelector('.lightbox__media');
  var num = lightbox.querySelector('.lightbox__num');

  function openLightbox(item) {
    var img = item.querySelector('img');
    var ph = item.querySelector('.ph');
    var label = item.querySelector('.gallery__num');

    media.innerHTML = '';
    if (img) {
      // Real photo: clone it at full size.
      var full = document.createElement('img');
      full.src = img.currentSrc || img.src;
      full.alt = img.alt || '';
      media.appendChild(full);
    } else if (ph) {
      // Placeholder: show a placeholder block.
      var block = document.createElement('div');
      block.className = 'ph';
      media.appendChild(block);
    }

    num.textContent = label ? label.textContent : '';
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      openLightbox(item);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Click the backdrop (but not the image/number) to close.
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) {
      closeLightbox();
    }
  });

  // ESC to close.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });

  /* -------------------------------------------------------------------
     3. The Loupe — a soft pool of light follows the cursor and brings
        whichever photo it's over to full life, like inspecting prints.
        Desktop: per-image distance from the eased cursor → brightness.
        Touch:   the photo nearest the viewport's vertical centre lights
                 as you scroll.
        Reduced motion: bail out, leave every photo at full brightness.
     ------------------------------------------------------------------- */
  var gallery = document.querySelector('.gallery');
  var grid = document.querySelector('.gallery__grid');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (gallery && grid && !reducedMotion) {
    var DIM = 0.4, R_IN = 130, R_OUT = 390;

    // Map a brightness back to its eased 0..1 amount for the saturation pair.
    function setLit(item, b) {
      var t = (b - DIM) / (1 - DIM);
      item.style.filter = 'brightness(' + b + ') saturate(' + (0.85 + 0.2 * t) + ')';
    }

    var fine = window.matchMedia('(pointer: fine)').matches;

    if (fine) {
      grid.classList.add('gallery__grid--loupe');
      items.forEach(function (it) { setLit(it, DIM); });

      var tx = -9999, ty = -9999, cx = tx, cy = ty, raf = null;

      function loop() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        var settled = true;
        for (var i = 0; i < items.length; i++) {
          var it = items[i], r = it.getBoundingClientRect();
          var dx = cx - (r.left + r.width / 2);
          var dy = cy - (r.top + r.height / 2);
          var d = Math.hypot(dx, dy);
          var t = Math.min(1, Math.max(0, (R_OUT - d) / (R_OUT - R_IN)));
          var b = DIM + (1 - DIM) * (t * t * (3 - 2 * t)); // smoothstep
          setLit(it, b);
          if (b > DIM + 0.004) settled = false;
        }
        // Cursor parked off-grid and everything is dim again → idle.
        if (tx === -9999 && settled) { raf = null; return; }
        raf = requestAnimationFrame(loop);
      }
      function start() { if (!raf) raf = requestAnimationFrame(loop); }

      gallery.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        tx = e.clientX; ty = e.clientY; start();
      });
      gallery.addEventListener('pointerleave', function () {
        tx = -9999; ty = -9999; start(); // ease back to fully dim
      });
    } else {
      // Touch / coarse pointer: light the photo nearest the screen centre.
      grid.classList.add('gallery__grid--loupe', 'gallery__grid--loupe-touch');
      var sRaf = null;
      function lightCentre() {
        var mid = window.innerHeight / 2, best = null, bestD = Infinity;
        items.forEach(function (it) {
          var r = it.getBoundingClientRect();
          var d = Math.abs((r.top + r.height / 2) - mid);
          if (d < bestD) { bestD = d; best = it; }
        });
        items.forEach(function (it) { setLit(it, it === best ? 1 : DIM); });
        sRaf = null;
      }
      function onScroll() { if (!sRaf) sRaf = requestAnimationFrame(lightCentre); }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      lightCentre();
    }
  }
})();
