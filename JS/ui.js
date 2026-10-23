// Small DOM helpers. Text always goes in with textContent, never innerHTML,
// so a name with markup in it shows as plain text (8L §4).
import { SHOP_OPEN, SITE, STORES } from './config.js';
import { W } from './words.js';

/** el('p', {class: 'x'}, 'text', child, …): an element with text children. */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v === null || v === undefined) continue;
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

/** ₹3,499 (Indian grouping); paise only when not whole rupees, as the app. */
export function rupees(paise) {
  const r = paise / 100;
  return (
    '₹' +
    r.toLocaleString('en-IN', {
      minimumFractionDigits: paise % 100 ? 2 : 0,
      maximumFractionDigits: 2,
    })
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-09-05" → "05 Sep 2026" (the app's plan dates). */
export function day(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : '';
}

/** The two store buttons. */
export function storeButtons() {
  return el(
    'div',
    { class: 'store-buttons' },
    el(
      'a',
      { class: 'store-btn', href: STORES.play, target: '_blank', rel: 'noopener' },
      el('i', { class: 'fab fa-google-play', 'aria-hidden': 'true' }),
      ' ',
      W.googlePlay,
    ),
    el(
      'a',
      { class: 'store-btn', href: STORES.apple, target: '_blank', rel: 'noopener' },
      el('i', { class: 'fab fa-apple', 'aria-hidden': 'true' }),
      ' ',
      W.appStore,
    ),
  );
}

/** A calm one-line message with the store buttons under it. */
export function appPanel(text) {
  return el('div', { class: 'shop-panel', role: 'status' }, el('p', {}, text), storeButtons());
}

/**
 * The shop pages' gate: with the switch off, or on a host config.js doesn't
 * know, the page shows the closed message and stops.
 */
export function shopIsOpen(main) {
  if (SHOP_OPEN && SITE) return true;
  main.replaceChildren(appPanel(W.closed));
  return false;
}

/** A message in a page's notice area (role=alert for errors). */
export function notice(box, text, kind = 'error', more = '') {
  box.replaceChildren();
  if (!text) return;
  box.append(
    el(
      'div',
      { class: `shop-notice ${kind}`, role: kind === 'error' ? 'alert' : 'status' },
      el('strong', {}, text),
      more ? el('p', {}, more) : null,
    ),
  );
}

/** A tiny check, run on load: `?next=` must be one of our own paths. */
export function safeNext(fallback) {
  const next = new URLSearchParams(location.search).get('next') ?? '';
  return /^\/(?!\/)[A-Za-z0-9/_?&=.%-]*$/.test(next) ? next : fallback;
}

/** The app's name rule: letters, marks, spaces and . ' - only; 2 to 50. */
export function nameProblem(raw) {
  const name = raw.trim().replace(/\s+/g, ' ');
  if (!name) return W.needName;
  if (!/^[\p{L}\p{M} .'-]+$/u.test(name)) return W.nameLetters;
  if (name.replace(/[^\p{L}]/gu, '').length < 2) return W.nameShort;
  if (name.length > 50) return W.nameLong;
  return '';
}


import { STORES } from './config.js';
export const rupees = (n) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(Number(n) || 0);
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null) continue;
    if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else node.setAttribute(key, String(value));
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}
export function appPanel(message) {
  const box = el('div', { class: 'sbx-api-fallback', role: 'status' });
  box.append(el('p', {}, message));
  box.append(el('a', { href: STORES.play, target: '_blank', rel: 'noopener noreferrer' }, 'Get it on Google Play'));
  box.append(el('a', { href: STORES.apple, target: '_blank', rel: 'noopener noreferrer' }, 'Download on the App Store'));
  return box;
}
