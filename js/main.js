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

    // Escape closes the menu and returns focus to the toggle button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
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

  // Build the lightbox once and reuse it. Acts as a modal dialog.
  var itemsArr = Array.prototype.slice.call(items);
  var currentIndex = -1;
  var opener = null;

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image viewer');
  lightbox.innerHTML =
    '<button class="lightbox__close" type="button" aria-label="Close image viewer">&times;</button>' +
    '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous image">&#8249;</button>' +
    '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next image">&#8250;</button>' +
    '<div class="lightbox__stage">' +
      '<div class="lightbox__media"></div>' +
      '<span class="lightbox__num"></span>' +
    '</div>';
  document.body.appendChild(lightbox);

  var closeBtn = lightbox.querySelector('.lightbox__close');
  var prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  var nextBtn = lightbox.querySelector('.lightbox__nav--next');
  var media = lightbox.querySelector('.lightbox__media');
  var num = lightbox.querySelector('.lightbox__num');
  var focusable = [prevBtn, nextBtn, closeBtn];

  function render(item) {
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
  }

  function openLightbox(index) {
    currentIndex = index;
    opener = itemsArr[index];
    render(itemsArr[index]);
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Return focus to the gallery item that opened the lightbox.
    if (opener && typeof opener.focus === 'function') opener.focus();
    opener = null;
  }

  function step(dir) {
    if (currentIndex < 0) return;
    currentIndex = (currentIndex + dir + itemsArr.length) % itemsArr.length;
    render(itemsArr[currentIndex]);
  }

  // Make each gallery item keyboard-operable without changing the layout.
  itemsArr.forEach(function (item, index) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    var img = item.querySelector('img');
    var label = item.querySelector('.gallery__num');
    var name = (label ? label.textContent.trim() + ' — ' : '') +
               (img && img.alt ? img.alt : 'photograph');
    item.setAttribute('aria-label', 'View ' + name);

    item.addEventListener('click', function () { openLightbox(index); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });

  // Click the backdrop (but not the controls/image/number) to close.
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage')) {
      closeLightbox();
    }
  });

  // Keyboard while open: Esc closes, arrows navigate, Tab is trapped inside.
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      step(-1);
    } else if (e.key === 'ArrowRight') {
      step(1);
    } else if (e.key === 'Tab') {
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      } else if (focusable.indexOf(document.activeElement) === -1) {
        e.preventDefault(); first.focus();
      }
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
