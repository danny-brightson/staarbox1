(function () {
  document.documentElement.classList.add('js-enabled');

  /* ---- Mobile nav (same behaviour as index) ---- */
  var toggle = document.querySelector('.nav-menu-toggle');
  var links = document.getElementById('primary-navigation');
  if (toggle && links) {
    var setMenuOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      links.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenuOpen(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('nav')) setMenuOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenuOpen(false); });
    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 960px)').matches) setMenuOpen(false);
    });
  }

  /* ---- Scroll reveal ---- */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i * 90) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;

  /* ---- Cursor spotlight over the page ---- */
  var page = document.getElementById('ctPage');
  var spot = document.getElementById('ctSpot');
  if (page && spot) {
    page.addEventListener('mousemove', function (e) {
      var r = page.getBoundingClientRect();
      spot.style.left = (e.clientX - r.left) + 'px';
      spot.style.top = (e.clientY - r.top) + 'px';
      page.classList.add('hot');
    });
    page.addEventListener('mouseleave', function () { page.classList.remove('hot'); });
  }

  /* ---- 3D tilt + glow on cards ---- */
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
      card.style.transform = 'perspective(800px) rotateX(' + ((0.5 - y) * 8) + 'deg) rotateY(' + ((x - 0.5) * 10) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ---- Magnetic buttons ---- */
  document.querySelectorAll('[data-magnet]').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) * 0.15;
      var dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      btn.style.transform = 'translate(' + dx + 'px,' + (dy - 3) + 'px)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
})();

/* ---- Button ripple (all devices) ---- */
document.querySelectorAll('.ct-btn').forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    var r = btn.getBoundingClientRect();
    var s = document.createElement('span');
    var size = Math.max(r.width, r.height);
    s.className = 'ripple';
    s.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - r.left - size / 2) + 'px;top:' + (e.clientY - r.top - size / 2) + 'px';
    btn.appendChild(s);
    setTimeout(function () { s.remove(); }, 600);
  });
});
