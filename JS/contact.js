// The Contact page's effects (classic script, no inline code, so the page's strict CSP stays):
// mobile menu, reveal on scroll, cursor spotlight, card tilt, button magnet + ripple, copy-to-clipboard.
// The Login / name button and its popup live in home.js (loaded as a module on the page).
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // ---- mobile menu
  var toggle = document.querySelector('.nav-menu-toggle');
  var links = document.getElementById('primary-navigation');
  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      links.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) { if (!e.target.closest('nav')) setOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    window.addEventListener('resize', function () { if (window.matchMedia('(min-width: 960px)').matches) setOpen(false); });
  }

  // ---- reveal on scroll (content stays visible if this cannot run)
  var items = $$('.rv');
  if ('IntersectionObserver' in window && items.length) {
    document.documentElement.classList.add('js-enabled');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (n) { io.observe(n); });
  }

  // ---- cursor spotlight behind the page
  var page = document.getElementById('ctPage');
  var spot = document.getElementById('ctSpot');
  if (page && spot && fine && !reduce) {
    page.addEventListener('pointermove', function (e) {
      var r = page.getBoundingClientRect();
      spot.style.left = e.clientX - r.left + 'px';
      spot.style.top = e.clientY - r.top + 'px';
      page.classList.add('hot');
    });
    page.addEventListener('pointerleave', function () { page.classList.remove('hot'); });
  }

  // ---- card tilt + light that follows the cursor
  $$('[data-tilt]').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
      if (fine && !reduce) {
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 6).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 6).toFixed(2) + 'deg) translateY(-4px)';
      }
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });

  // ---- buttons: magnet + ripple
  $$('[data-magnet]').forEach(function (btn) {
    if (fine && !reduce) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    }
    btn.addEventListener('click', function (e) {
      var r = btn.getBoundingClientRect();
      var d = Math.max(r.width, r.height);
      var s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = e.clientX - r.left - d / 2 + 'px';
      s.style.top = e.clientY - r.top - d / 2 + 'px';
      btn.appendChild(s);
      setTimeout(function () { s.remove(); }, 650);
    });
  });

  // ---- copy to clipboard
  var toast = document.getElementById('ctToast');
  var timer;
  function say(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = b.getAttribute('data-done') || 'Copied';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { say(done); }, function () { say('Press Ctrl+C to copy: ' + text); });
      } else {
        var t = document.createElement('textarea');
        t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); say(done); } catch (e) { say('Press Ctrl+C to copy: ' + text); }
        t.remove();
      }
    });
  });
})();
