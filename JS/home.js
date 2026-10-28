// The new home page (index.html): everything that is only page behaviour.
// The live menu / prices / delivery-zone API calls are in live-catalog.js.
// Load as: <script type="module" src="./JS/home.js"></script>
import { signOut } from './site.js';
import { getSession } from './session.js';
import { el } from './ui.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------- reveal on scroll
// The CSS hides .reveal-io only when <html> has .js-enabled, so the page is
// never blank if this file fails to load.
document.documentElement.classList.add('js-enabled');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('visible');
        // "How it works": fill the line after a step once the step shows.
        if (e.target.classList.contains('step')) {
          const next = e.target.nextElementSibling;
          if (next?.classList.contains('connector')) next.classList.add('filled');
        }
        io.unobserve(e.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
  );
  $$('.reveal-io').forEach((n) => io.observe(n));
} else {
  $$('.reveal-io').forEach((n) => n.classList.add('visible'));
  $$('.connector').forEach((n) => n.classList.add('filled'));
}

// ---------------------------------------------------------------- stat counters
function countUp(node) {
  const end = Number(node.dataset.count);
  const suffix = node.dataset.suffix ?? '';
  if (!Number.isFinite(end) || reduceMotion) return;
  const t0 = performance.now();
  const ms = 1200;
  const tick = (now) => {
    const p = Math.min((now - t0) / ms, 1);
    node.textContent = `${Math.round(end * (1 - Math.pow(1 - p, 3)))}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
if ('IntersectionObserver' in window) {
  const cio = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        countUp(e.target);
        cio.unobserve(e.target);
      }
    },
    { threshold: 0.6 },
  );
  $$('.stat-num[data-count]').forEach((n) => cio.observe(n));
}

// ---------------------------------------------------------------- header: Login / Sign out
// Signed out: the Login link (./login/) stays. Signed in: a Sign out button
// that asks first, then ends the session on the server too (site.js).
const profile = $('#nav-profile-section');
const modal = $('#logoutConfirmModal');
let backdrop = null;

function openModal() {
  if (!modal) return void signOut();
  backdrop = el('div', { class: 'modal-backdrop fade' });
  document.body.append(backdrop);
  document.body.classList.add('modal-open');
  modal.style.display = 'block';
  modal.removeAttribute('aria-hidden');
  void modal.offsetWidth; // let the fade start
  modal.classList.add('show');
  backdrop.classList.add('show');
  $('#logoutCancelBtn')?.focus();
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('show');
  backdrop?.classList.remove('show');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    backdrop?.remove();
    backdrop = null;
    document.body.classList.remove('modal-open');
  }, 220);
}

if (profile && getSession()) {
  const link = $('a', profile);
  if (link) {
    link.lastChild.textContent = 'Sign out';
    link.setAttribute('href', '#');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }
  const title = $('#logoutConfirmLabel');
  if (title) title.textContent = 'Confirm Sign out';
  const body = $('#confirmModalBody');
  if (body) body.textContent = 'Do you want to sign out?';
  const yes = $('#logoutConfirmBtn');
  if (yes) yes.textContent = 'Yes, sign out';
}
$('#logoutConfirmBtn')?.addEventListener('click', () => void signOut());
$('#logoutCancelBtn')?.addEventListener('click', closeModal);
$('#confirmModalCloseBtn')?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal?.classList.contains('show')) closeModal();
});

// ---------------------------------------------------------------- plans stage (slides)
const STAGE_BG = [
  ['#1F3D2E', '#3E6B4F', '#8BC53F'],
  ['#6b3410', '#b5651d', '#F5C94E'],
  ['#0f4c5c', '#2a8c82', '#8BC53F'],
  ['#5a2a4a', '#8E3B78', '#F2994A'],
];
const slides = $$('.stage .slide');
let current = 0;

function paintStage(i) {
  const stage = $('#stage');
  const c = STAGE_BG[i % STAGE_BG.length];
  if (stage) stage.style.background = `linear-gradient(135deg, ${c[0]}, ${c[1]})`;
  const layer = $('#blobLayer');
  if (layer) {
    layer.replaceChildren(
      el('div', {
        class: 'stage-blob',
        style: `width:320px;height:320px;top:-80px;right:-60px;background:${c[2]};opacity:.35`,
      }),
      el('div', {
        class: 'stage-blob',
        style: `width:260px;height:260px;bottom:-90px;left:-50px;background:${c[2]};opacity:.22`,
      }),
    );
  }
}

// If the page's own classic script (JS/index.js) already defines the slider,
// it stays in charge and nothing here touches the stage.
if (typeof window.goToSlide !== 'function') {
function goToSlide(i) {
  if (!slides.length) return;
  current = (i + slides.length) % slides.length;
  slides.forEach((s, j) => s.classList.toggle('active', j === current));
  $$('#planTabs .plan-tab').forEach((t, j) => t.classList.toggle('active', j === current));
  paintStage(current);
}
const changeSlide = (d) => goToSlide(current + d);
// The HTML calls these from onclick="…".
window.goToSlide = goToSlide;
window.changeSlide = changeSlide;
paintStage(0);
}

// ---------------------------------------------------------------- the app phone
const panes = $$('.pane');
const tabIcons = $$('.tab-icon');
const features = $$('.app-feature');
const ORDER = ['menu', 'wallet', 'calendar'];
let auto = null;

function showPane(name) {
  panes.forEach((p) => p.classList.toggle('active', p.dataset.pane === name));
  tabIcons.forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
  features.forEach((f) => f.classList.toggle('active', f.dataset.feature === name));
}
function stopAuto() {
  clearInterval(auto);
  auto = null;
}
tabIcons.forEach((t) =>
  t.addEventListener('click', () => {
    stopAuto();
    showPane(t.dataset.tab);
  }),
);
features.forEach((f) =>
  f.addEventListener('click', () => {
    stopAuto();
    showPane(f.dataset.feature);
  }),
);
if (panes.length && !reduceMotion) {
  let i = 0;
  auto = setInterval(() => {
    i = (i + 1) % ORDER.length;
    showPane(ORDER[i]);
  }, 5000);
}

// The little calendar: this month, today marked, two upcoming days "skipped".
const calGrid = $('#calGrid');
if (calGrid) {
  const now = new Date();
  const label = $('.pane[data-pane="calendar"] > div:first-child');
  if (label) label.textContent = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let b = 0; b < first; b++) cells.push(el('div', { class: 'cal-day', style: 'visibility:hidden' }));
  for (let d = 1; d <= days; d++) {
    const cls = d === now.getDate() ? ' today' : d === now.getDate() + 3 || d === now.getDate() + 4 ? ' skip' : '';
    cells.push(el('div', { class: `cal-day${cls}` }, d));
  }
  calGrid.replaceChildren(...cells);
}

// ---------------------------------------------------------------- FAQ
const faqItems = $$('.faqx-item');
faqItems.forEach((item) => {
  const q = $('.faqx-question', item);
  q?.addEventListener('click', () => {
    const open = !item.classList.contains('open');
    faqItems.forEach((o) => {
      o.classList.remove('open');
      $('.faqx-question', o)?.setAttribute('aria-expanded', 'false');
    });
    if (open) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', 'true');
    }
  });
});
$$('.faqx-filter').forEach((btn) =>
  btn.addEventListener('click', () => {
    const cat = btn.dataset.faqxCategory;
    $$('.faqx-filter').forEach((b) => b.classList.toggle('active', b === btn));
    faqItems.forEach((item) => {
      item.hidden = cat !== 'all' && item.dataset.faqxCategory !== cat;
    });
  }),
);

// ---------------------------------------------------------------- reviews: endless scroll
// The CSS slides the track by -50%, so the cards must be there twice.
const track = $('#rv-track');
if (track && !track.dataset.cloned) {
  track.dataset.cloned = '1';
  [...track.children].forEach((card) => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    track.append(copy);
  });
}

// ---------------------------------------------------------------- mobile sticky button
$('#stickyCtaBtn')?.addEventListener('click', () => {
  document.getElementById('plans')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
});
