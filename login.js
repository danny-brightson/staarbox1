// /login/: sign in or register with a phone number and an OTP, the app's way.
// Live signs in with Firebase (reCAPTCHA); staging and the tests use the
// server's dev code. Then the consent step, if newer Terms are due.
import { api, ApiError, friendly } from './api.js';
import { FIREBASE_WEB, LEGAL, SITE } from './config.js';
import { setSession } from './session.js';
import { el, nameProblem, notice, safeNext, shopIsOpen } from './ui.js';
import { W } from './words.js';

const $ = (id) => document.getElementById(id);
const main = $('main');
const next = safeNext('/Menu/');
const safeTarget = next.startsWith('/login') ? '/Menu/' : next;
const withNext = (path) => `${path}?next=${encodeURIComponent(safeTarget)}`;

let purpose = 'login'; // or 'register': the API's URL segment
let phone = '';
let confirmation = null; // Firebase's, after the SMS is sent
let countdown = null;

if (shopIsOpen(main)) start();

function start() {
  for (const [id, href] of [
    ['termsLink', LEGAL.terms],
    ['privacyLink', LEGAL.privacy],
  ]) {
    const a = $(id);
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
  }
  $('switchMode').addEventListener('click', () =>
    setPurpose(purpose === 'login' ? 'register' : 'login'),
  );
  $('phoneForm').addEventListener('submit', (e) => {
    e.preventDefault();
    void sendOtp();
  });
  $('otpForm').addEventListener('submit', (e) => {
    e.preventDefault();
    void verifyOtp();
  });
  $('otpInput').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    if (e.target.value.length === 6) void verifyOtp(); // the app submits on the 6th digit
  });
  $('localPhone').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
  });
  $('referral').addEventListener('input', (e) => {
    e.target.value = e.target.value
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, 9);
  });
  $('resendOtp').addEventListener('click', () => void resend());
  $('editPhone').addEventListener('click', backToPhone);
}

function setPurpose(p, keepPhone = true) {
  purpose = p;
  const reg = p === 'register';
  $('loginTitle').textContent = reg ? W.letsStart : W.welcomeBack;
  $('nameRow').hidden = !reg;
  $('referralRow').hidden = !reg;
  $('switchText').textContent = reg ? W.haveAccount : W.newHere;
  $('switchMode').textContent = reg ? W.login : W.registerNow;
  if (!keepPhone) $('localPhone').value = '';
  status('');
  for (const id of ['nameError', 'phoneError', 'referralError']) $(id).textContent = '';
}

function status(text, action) {
  const box = $('status');
  box.replaceChildren();
  if (!text) return;
  box.append(el('span', {}, text));
  if (action)
    box.append(
      ' ',
      el('button', { type: 'button', class: 'link-btn', onclick: action.run }, action.label),
    );
}

function body() {
  const b = { phone };
  if (purpose === 'register') {
    b.name = $('userName').value.trim().replace(/\s+/g, ' ');
    const code = $('referral').value.trim();
    if (code) b.referralCode = code;
  }
  return b;
}

function busy(button, label, on) {
  button.disabled = on;
  if (label) button.textContent = label;
}

async function sendOtp() {
  const p = $('localPhone').value.replace(/\D/g, '');
  $('phoneError').textContent = !p ? W.needPhone : /^[6-9]\d{9}$/.test(p) ? '' : W.badPhone;
  $('nameError').textContent = purpose === 'register' ? nameProblem($('userName').value) : '';
  $('referralError').textContent = '';
  if ($('phoneError').textContent || $('nameError').textContent) return;
  phone = p;
  const btn = $('sendOtpBtn');
  busy(btn, W.sendingOtp, true);
  status('');
  try {
    if (SITE.signIn === 'firebase') {
      await api(`/api/auth/${purpose}/check`, { method: 'POST', body: body() });
      confirmation = await firebaseSend();
      showOtp(30);
    } else {
      const r = await api(`/api/auth/${purpose}/send-otp`, { method: 'POST', body: body() });
      showOtp(r.resendAfterSeconds ?? 30);
    }
  } catch (e) {
    sendFailed(e);
  } finally {
    busy(btn, W.getOtp, false);
  }
}

function sendFailed(e) {
  if (e.code === 'ACCOUNT_NOT_FOUND') {
    return status(W.accountNotFound, { label: W.register, run: () => setPurpose('register') });
  }
  if (e.code === 'ACCOUNT_EXISTS')
    return status(W.accountExists, { label: W.login, run: () => setPurpose('login') });
  if (e.code === 'ACCOUNT_BLOCKED') return status(W.accountBlocked);
  if (e.code === 'INVALID_REFERRAL_CODE') {
    $('referralError').textContent = W.badReferral;
    return;
  }
  if (e.code === 'INVALID_PHONE') return status(e.message || W.badPhone);
  status(firebaseWords(e) ?? friendly(e));
}

function showOtp(seconds) {
  $('phoneForm').hidden = true;
  $('otpForm').hidden = false;
  $('maskedPhone').textContent = `+91 ******${phone.slice(-4)}`;
  $('otpInput').value = '';
  $('otpInput').focus();
  startCountdown(seconds);
}

function backToPhone() {
  clearInterval(countdown);
  confirmation = null;
  $('otpForm').hidden = true;
  $('phoneForm').hidden = false;
  status('');
}

function startCountdown(seconds) {
  const btn = $('resendOtp');
  let left = seconds;
  clearInterval(countdown);
  const tick = () => {
    btn.disabled = left > 0;
    btn.textContent = left > 0 ? W.resendIn(left) : W.resend;
    if (left-- <= 0) clearInterval(countdown);
  };
  tick();
  countdown = setInterval(tick, 1000);
}

async function resend() {
  const btn = $('resendOtp');
  busy(btn, W.resending, true);
  try {
    if (SITE.signIn === 'firebase') {
      confirmation = await firebaseSend();
      startCountdown(30);
    } else {
      const r = await api(`/api/auth/${purpose}/resend-otp`, { method: 'POST', body: { phone } });
      startCountdown(r.resendAfterSeconds ?? 30);
    }
    status(W.newOtpSent);
  } catch (e) {
    status(firebaseWords(e) ?? friendly(e));
    btn.disabled = false;
    btn.textContent = W.resend;
  }
}

let verifying = false;

async function verifyOtp() {
  const otp = $('otpInput').value;
  if (!/^\d{6}$/.test(otp)) return status(W.needOtp);
  if (verifying) return;
  verifying = true;
  const btn = $('verifyOtpBtn');
  busy(btn, W.verifying, true);
  status('');
  try {
    let r;
    if (SITE.signIn === 'firebase') {
      const cred = await confirmation.confirm(otp);
      const idToken = await cred.user.getIdToken();
      const { phone: _p, ...rest } = body();
      r = await api(`/api/auth/${purpose}/firebase`, {
        method: 'POST',
        body: { idToken, ...rest },
        device: true,
      });
      await window.firebase.auth().signOut(); // the website keeps only our own tokens
    } else {
      const b = { phone, otp };
      if (purpose === 'register' && body().referralCode) b.referralCode = body().referralCode;
      r = await api(`/api/auth/${purpose}/verify-otp`, { method: 'POST', body: b, device: true });
    }
    if (!r.token || !r.user?.id || (purpose === 'login' && r.isNewUser))
      throw new ApiError(500, '', '');
    clearInterval(countdown);
    setSession({ accessToken: r.token, refreshToken: r.refreshToken, userId: r.user.id });
    await afterSignIn();
  } catch (e) {
    $('otpInput').value = '';
    if (e.code === 'INVALID_OTP') status(W.invalidOtp);
    else if (e.code === 'OTP_EXPIRED') status(W.otpExpired);
    else status(firebaseWords(e) ?? friendly(e));
  } finally {
    verifying = false;
    busy(btn, W.verify, false);
  }
}

/** Where a new session goes next, as the app's landing logic. */
async function afterSignIn() {
  if (purpose === 'register') return location.assign(withNext('/Form/'));
  let account;
  try {
    account = await api('/api/users/me/profiles', { auth: true });
  } catch {
    return location.assign(safeTarget);
  }
  if (account.legalToAccept?.length) return showConsent(account.legalReason);
  const active = account.profiles?.find((p) => p.id === account.activeProfileId);
  location.assign(active && !active.setupComplete ? withNext('/Form/') : safeTarget);
}

// ---- The consent step ("Before you continue") ----

const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function longDay(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${Number(m[3])} ${FULL_MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
}

/** A section's text: "- " lines become a list, other lines paragraphs. */
function sectionBody(text) {
  const out = [];
  let list = null;
  for (const line of String(text ?? '').split('\n')) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('- ')) {
      list ??= el('ul');
      list.append(el('li', {}, t.slice(2)));
      if (!out.includes(list)) out.push(list);
    } else {
      list = null;
      out.push(el('p', {}, t));
    }
  }
  return out;
}

function documentBlock(title, doc) {
  return el(
    'div',
    { class: 'legal-doc' },
    el('h2', { class: 'h5' }, title),
    el('p', { class: 'small-muted' }, W.effective(longDay(doc.effectiveDate))),
    doc.notice ? el('p', { class: 'legal-notice' }, doc.notice) : null,
    (doc.sections ?? []).map((s, i) =>
      el(
        'details',
        {},
        el('summary', {}, `${s.number ?? i + 1}. ${s.title}`),
        sectionBody(s.content),
      ),
    ),
  );
}

async function showConsent(reason) {
  $('phoneForm').hidden = true;
  $('otpForm').hidden = true;
  $('agree').hidden = true;
  const box = $('consent');
  box.hidden = false;
  $('loginTitle').textContent = W.consentTitle;
  $('tagline').textContent = reason === 'moved' ? W.consentMoved : W.consentUpdated;
  box.replaceChildren(el('p', { class: 'small-muted' }, '…'));
  let terms, privacy;
  try {
    [terms, privacy] = await Promise.all([api('/api/legal/terms'), api('/api/legal/privacy')]);
  } catch {
    box.replaceChildren(
      el('p', {}, W.legalLoadFailed),
      el(
        'button',
        { type: 'button', class: 'btn btn-warning', onclick: () => showConsent(reason) },
        W.tryAgain,
      ),
    );
    return;
  }
  const agree = el(
    'button',
    { type: 'button', class: 'btn btn-success mt-3', id: 'agreeBtn' },
    W.iAgree,
  );
  box.replaceChildren(documentBlock(W.terms, terms), documentBlock(W.privacy, privacy), agree);
  agree.addEventListener('click', async () => {
    agree.disabled = true;
    try {
      await api('/api/users/me/consents', {
        method: 'POST',
        auth: true,
        device: true,
        body: {
          accepted: [
            { document: 'terms', version: terms.version },
            { document: 'privacy', version: privacy.version },
          ],
        },
      });
      const account = await api('/api/users/me/profiles', { auth: true });
      if (account.legalToAccept?.length) throw new ApiError(409, 'LEGAL_UPDATED', '');
      const active = account.profiles?.find((p) => p.id === account.activeProfileId);
      location.assign(active && !active.setupComplete ? withNext('/Form/') : safeTarget);
    } catch (e) {
      if (e.code === 'LEGAL_UPDATED') {
        await showConsent(reason);
        notice($('status'), W.consentNewer, 'info');
      } else {
        agree.disabled = false;
        status(friendly(e));
      }
    }
  });
}

// ---- Firebase phone sign-in (live only) ----

const FIREBASE_SDK = [
  [
    'https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js',
    'sha384-zWhcPR2cYijrT44UVIJvXJC8WXOnWFVbh+1RkWpwzacFruBNSHI1tS4fyijXM0Lh',
  ],
  [
    'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth-compat.js',
    'sha384-WrC81PmpvWR3neznqoHZdQZMdoUhwbpL/Bgp5wV/Im5/vnULmNw9NBrS0nx+/MyO',
  ],
];
let verifier = null;

function script(src, integrity) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.integrity = integrity;
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = () => reject(new ApiError(0, 'OFFLINE', W.offline));
    document.head.append(s);
  });
}

async function firebaseAuth() {
  if (!window.firebase?.auth) {
    for (const [src, sri] of FIREBASE_SDK) await script(src, sri);
    window.firebase.initializeApp(FIREBASE_WEB);
    // Nothing of Firebase's stays on the device: we keep only our own tokens.
    await window.firebase.auth().setPersistence(window.firebase.auth.Auth.Persistence.NONE);
    if (SITE.firebaseTesting)
      window.firebase.auth().settings.appVerificationDisabledForTesting = true;
  }
  return window.firebase.auth();
}

/** The reCAPTCHA checkbox (the old site's way), then the SMS. */
async function firebaseSend() {
  const auth = await firebaseAuth();
  verifier?.clear();
  $('recaptcha-container').replaceChildren(); // a fresh box for each send
  const wrapper = $('recaptcha-wrapper');
  wrapper.classList.add('show');
  verifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'normal' });
  try {
    return await auth.signInWithPhoneNumber(`+91${phone}`, verifier);
  } finally {
    wrapper.classList.remove('show');
  }
}

/** Firebase's errors in the app's words, or null for our own errors. */
function firebaseWords(e) {
  const code = typeof e?.code === 'string' && e.code.startsWith('auth/') ? e.code : '';
  if (!code) return null;
  if (code === 'auth/invalid-verification-code') return W.invalidOtp;
  if (code === 'auth/code-expired') return W.otpExpired;
  if (code === 'auth/too-many-requests' || code === 'auth/quota-exceeded') return W.tooMany;
  if (code === 'auth/network-request-failed') return W.offline;
  if (code === 'auth/invalid-phone-number') return W.badPhone;
  return W.wrong;
}
