// The home page (index.html): what JS/index.js does NOT do.
// index.js (classic script) draws the plan slides and the app phone, and runs the reveal
// animations and counters. This file adds, with the NEW sign-in session (session.js):
//   - the header Login / Sign out button and its confirm box
//   - every "Choose ..." / "Get My First Box" / "Start Subscription" button
//   - the FAQ accordion and the endless reviews row
// Load as: <script type="module" src="./JS/home.js"></script>
import { api } from './api.js';
import { SITE } from './config.js';
import { getSession } from './session.js';
import { signOut } from './site.js';
import { el } from './ui.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------------------------------------------------------------- "Choose ..." buttons
//   not signed in -> /login/, which brings the person back to /Menu/ after sign-in
//                    (a brand-new user fills /Form/ first, then lands on /Menu/)
//   signed in     -> /Menu/, where "Subscribe" on a product goes on to /Payment/
function choose(event) {
  event?.preventDefault();
  if (getSession()) location.assign('/Menu/');
  else location.assign(`/login/?next=${encodeURIComponent('/Menu/')}`);
}
$$('.btn-plan-primary, #stickyCtaBtn, .sb-footer-button.primary').forEach((b) => b.addEventListener('click', choose));

// ---------------------------------------------------------------- header: Login (name) / Sign out
const navLink = $('#nav-profile-section a');
const modal = $('#logoutConfirmModal');
let backdrop = null;
let onYes = null;
let lastFocus = null;

function closeModal() {
  if (!modal?.classList.contains('show')) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  backdrop?.classList.remove('show');
  document.body.classList.remove('modal-open');
  onYes = null;
  lastFocus?.focus();
  setTimeout(() => {
    if (!modal.classList.contains('show')) {
      modal.style.display = 'none';
      backdrop?.remove();
      backdrop = null;
    }
  }, 220);
}
function openModal({ title, message, confirmText, action }) {
  if (!modal) return action();
  $('#logoutConfirmLabel').textContent = title;
  $('#confirmModalBody').textContent = message;
  $('#logoutConfirmBtn').textContent = confirmText;
  onYes = action;
  lastFocus = document.activeElement;
  backdrop?.remove();
  backdrop = el('div', { class: 'modal-backdrop fade' });
  backdrop.addEventListener('click', closeModal);
  document.body.append(backdrop);
  document.body.classList.add('modal-open');
  modal.style.display = 'block';
  modal.removeAttribute('aria-hidden');
  void modal.offsetWidth; // let the fade start
  modal.classList.add('show');
  backdrop.classList.add('show');
  $('#logoutConfirmBtn')?.focus();
}

// The button shows the person's first name once signed in (from the active profile),
// "Login" when signed out. The name is kept only in this tab, with the user id it belongs to.
const NAME_KEY = 'staarbox.name';
function cachedName() {
  const s = getSession();
  try {
    const c = JSON.parse(sessionStorage.getItem(NAME_KEY) ?? 'null');
    return s && c && c.u === s.userId ? c.n : '';
  } catch {
    return '';
  }
}
async function loadName() {
  const s = getSession();
  if (!s || !SITE || cachedName()) return paint();
  try {
    // redirect:false -> an expired session only clears itself; a visitor is never thrown to /login/
    const a = await api('/api/users/me/profiles', { auth: true, redirect: false });
    const p = a.profiles?.find((x) => x.id === a.activeProfileId) ?? a.profiles?.[0];
    const n = p?.name && !p.name.startsWith('+') ? p.name.trim().split(/\s+/)[0] : '';
    sessionStorage.setItem(NAME_KEY, JSON.stringify({ u: s.userId, n }));
  } catch {
    // keep the generic label
  }
  paint();
}
function paint() {
  if (!navLink) return;
  const signedIn = !!getSession();
  const label = signedIn ? cachedName() || 'Account' : 'Login';
  if (navLink.lastChild?.nodeType === Node.TEXT_NODE) navLink.lastChild.textContent = label;
  else navLink.append(label);
  navLink.setAttribute('aria-label', signedIn ? `${label}: sign out` : 'Login');
  navLink.title = signedIn ? 'Sign out' : 'Login';
}

if (navLink) {
  paint();
  void loadName();
  navLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (getSession()) {
      openModal({ title: 'Confirm Sign out', message: 'Do you want to sign out?', confirmText: 'Yes, sign out', action: () => void signOut() });
    } else {
      openModal({ title: 'Confirm Login', message: 'Do you want to log in?', confirmText: 'Yes, log in', action: () => location.assign('/login/') });
    }
  });
}
// Coming back with the browser's Back button restores the page from memory:
// look at the session again so the button is right.
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    paint();
    void loadName();
  }
});
$('#logoutConfirmBtn')?.addEventListener('click', () => {
  const run = onYes;
  closeModal();
  run?.();
});
$('#logoutCancelBtn')?.addEventListener('click', closeModal);
$('#confirmModalCloseBtn')?.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

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
