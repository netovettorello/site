/* Neto Vettorello — movimento e interações.
   Tudo aqui é opcional: sem JavaScript, ou com "reduzir movimento" ligado no aparelho,
   o site aparece completo e parado. */
(function () {
  'use strict';
  window.__nv = true;

  var d = document;
  var root = d.documentElement;
  var body = d.body;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (n) { return n < 0 ? 0 : n > 1 ? 1 : n; };

  /* ---------- menu (celular) ---------- */
  var toggle = d.querySelector('.nav-toggle');
  var sheet = d.getElementById('sheet');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? toggle.dataset.close : toggle.dataset.open);
  }
  if (toggle && sheet) {
    toggle.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });
    matchMedia('(min-width: 881px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- aparecer ao rolar ---------- */
  var io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  }
  d.querySelectorAll('[data-reveal]').forEach(function (el) {
    if (io) io.observe(el); else el.classList.add('in');
  });
  /* Cartões das grades entram em sequência curta, por linha. */
  d.querySelectorAll('.grid-art, .grid-shots, .bento').forEach(function (grid) {
    if (!io) return;
    var cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length || 1;
    Array.prototype.forEach.call(grid.children, function (el, i) {
      el.setAttribute('data-reveal', '');
      el.style.setProperty('--d', i % cols);
      io.observe(el);
    });
  });

  /* ---------- abertura da home ---------- */
  var hero = d.querySelector('[data-hero]');
  var slides = hero ? hero.querySelectorAll('img.hero-media') : [];
  if (hero && slides.length > 1) {
    var cap = hero.querySelector('.hero-cap');
    var ctrl = hero.querySelector('.hero-ctrl');
    var dots = hero.querySelector('.hero-dots');
    var pauseBtn = hero.querySelector('.hero-pause');
    var DUR = 6000, current = 0, timer = null, playing = !reduce;
    hero.style.setProperty('--dur', DUR + 'ms');

    var buttons = Array.prototype.map.call(slides, function (img, i) {
      var b = d.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', img.dataset.cap || String(i + 1));
      b.appendChild(d.createElement('i'));
      b.addEventListener('click', function () { go(i); });
      dots.appendChild(b);
      return b;
    });

    function schedule() {
      clearTimeout(timer);
      hero.classList.remove('playing');
      if (!playing || d.hidden) return;
      void hero.offsetWidth; /* reinicia a barrinha de progresso */
      hero.classList.add('playing');
      timer = setTimeout(function () { go((current + 1) % slides.length); }, DUR);
    }
    function go(n) {
      if (n !== current) {
        slides[current].classList.remove('on');
        slides[n].classList.add('on');
        current = n;
        if (cap) {
          cap.classList.add('swap');
          setTimeout(function () { cap.textContent = slides[n].dataset.cap || ''; cap.classList.remove('swap'); }, 400);
        }
      }
      buttons.forEach(function (b, i) { b.setAttribute('aria-current', String(i === n)); });
      schedule();
    }
    function setPlaying(on) {
      playing = on;
      pauseBtn.setAttribute('aria-label', on ? pauseBtn.dataset.pause : pauseBtn.dataset.play);
      schedule();
    }
    pauseBtn.addEventListener('click', function () { setPlaying(!playing); });
    d.addEventListener('visibilitychange', schedule);
    ctrl.hidden = false;
    setPlaying(playing);
    go(0);
  }

  /* ---------- frase que acende conforme a rolagem ---------- */
  var words = [];
  var wordsEl = d.querySelector('[data-words]');
  var litCount = -1;
  if (wordsEl && !reduce) {
    var parts = wordsEl.textContent.trim().split(/\s+/);
    wordsEl.textContent = '';
    parts.forEach(function (w, i) {
      var s = d.createElement('span');
      s.className = 'w';
      s.textContent = w;
      wordsEl.appendChild(s);
      if (i < parts.length - 1) wordsEl.appendChild(d.createTextNode(' '));
      words.push(s);
    });
    wordsEl.classList.add('dim');
  }

  /* ---------- carrossel ---------- */
  d.querySelectorAll('[data-rail]').forEach(function (rail) {
    var track = rail.querySelector('.rail-track');
    var navEl = rail.querySelector('.rail-nav');
    if (!track || !navEl) return;
    var prev = navEl.querySelector('[data-dir="-1"]');
    var next = navEl.querySelector('[data-dir="1"]');
    function state() {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft >= max - 4;
    }
    function step(dir) {
      var item = track.firstElementChild;
      if (!item) return;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollBy({ left: dir * (item.getBoundingClientRect().width + gap), behavior: reduce ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', state, { passive: true });
    addEventListener('resize', state);
    navEl.hidden = false;
    state();
  });

  /* ---------- filtros (murais por país, obras disponíveis) ---------- */
  d.querySelectorAll('[data-filter-for]').forEach(function (group) {
    var target = d.querySelector(group.dataset.filterFor);
    if (!target) return;
    group.hidden = false;
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn || btn.getAttribute('aria-pressed') === 'true') return;
      var f = btn.dataset.filter;
      function apply() {
        group.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        target.querySelectorAll('[data-tags]').forEach(function (el) {
          el.hidden = f !== '*' && el.dataset.tags.split('|').indexOf(f) < 0;
          el.classList.add('in');
        });
      }
      if (d.startViewTransition && !reduce && e.isTrusted) d.startViewTransition(apply); else apply();
      /* O filtro fica no endereço, para o link poder ser compartilhado. */
      try {
        var url = new URL(location.href);
        if (f === '*') url.searchParams.delete('f'); else url.searchParams.set('f', f);
        history.replaceState(null, '', url);
      } catch (err) {}
    });
    var initial = new URLSearchParams(location.search).get('f');
    if (initial) {
      var pre = Array.prototype.find.call(group.querySelectorAll('[data-filter]'), function (b) { return b.dataset.filter === initial; });
      if (pre) pre.click();
    }
  });

  /* ---------- efeitos ligados à rolagem ---------- */
  var parallax = reduce ? [] : Array.prototype.slice.call(d.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;

    if (hero && !reduce && y < vh * 2) {
      hero.style.setProperty('--p', clamp(y / (vh * 0.5)).toFixed(4));
    }

    if (words.length) {
      var r = wordsEl.getBoundingClientRect();
      var start = vh * 0.88, end = vh * 0.42;
      var n = Math.round(clamp((start - r.top) / (start - end + r.height * 0.6)) * words.length);
      if (n !== litCount) {
        litCount = n;
        for (var i = 0; i < words.length; i++) words[i].classList.toggle('lit', i < n);
      }
    }

    for (var j = 0; j < parallax.length; j++) {
      var el = parallax[j], box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) continue;
      var off = (box.top + box.height / 2 - vh / 2) / vh; /* -0.5 a 0.5 perto do centro */
      el.style.setProperty('--py', (off * -box.height * 0.14).toFixed(1));
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  if (hero || words.length || parallax.length) {
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    frame();
  }
})();
