// On every page: delete the old site's leftovers, the mobile menu button, and
// the header's Sign in / Sign out.
import { api } from './api.js';
import { SITE } from './config.js';
import { clearSession, getSession } from './session.js';

// Every key any version of the old site wrote (or read) in localStorage. The
// new site writes nothing there.
const OLD_KEYS = [
  'Amount',
  'CustomerEmail',
  'CustomerId',
  'CustomerName',
  'CustomerPhone',
  'accessToken',
  'customerIds',
  'newCustomerEnrolled',
  'refreshToken',
  'staarbox_customers',
  'staarbox_isEggAllowed',
  'staarbox_selected_packages',
  'staarbox_selected_plan',
  'staarbox_user_name',
  'staarbox_user_phone',
];
try {
  for (const key of OLD_KEYS) localStorage.removeItem(key);
} catch {
  // Storage is blocked: there is nothing to clean.
}

const toggle = document.getElementById('menuToggle');
const links = document.getElementById('navLinks');
toggle?.addEventListener('click', () => links?.classList.toggle('active'));

// The home page's header link: "Sign In", or "Sign Out" with the old confirm box.
const sign = document.getElementById('signbtn');
if (sign) {
  const label = sign.querySelector('span');
  const signedIn = getSession() !== null;
  if (label) label.textContent = signedIn ? 'Sign Out' : 'Sign In';
  const modalEl = document.getElementById('logoutConfirmModal');
  sign.addEventListener('click', (e) => {
    if (!getSession()) return; // the link goes to ./login/
    e.preventDefault();
    if (modalEl && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
    else void signOut();
  });
  document.getElementById('logoutConfirmBtn')?.addEventListener('click', () => void signOut());
}

// The session ends on the server too, as the app's sign-out (at most 5 s).
async function signOut() {
  if (SITE) {
    await Promise.race([
      api('/api/auth/logout', { method: 'POST', auth: true, body: {}, redirect: false }).catch(
        () => {},
      ),
      new Promise((done) => setTimeout(done, 5_000)),
    ]);
  }
  clearSession();
  window.location.href = './';
}
