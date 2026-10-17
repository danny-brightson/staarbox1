// /Menu/: the live menu; a box's buttons go to /Payment/ (sign-in happens there).
import { api } from './api.js';
import { loadMenu, planPrice, specText } from './catalog.js';
import { getSession } from './session.js';
import { appPanel, el, rupees, shopIsOpen } from './ui.js';
import { W } from './words.js';

const main = document.getElementById('main');
if (shopIsOpen(main)) void start();

async function start() {
  const tabs = document.getElementById('tabs');
  const grid = document.getElementById('grid');
  let menu;
  try {
    menu = await loadMenu();
  } catch {
    grid.replaceChildren(appPanel(`${W.menuFailed} ${W.menuFallback}`));
    return;
  }
  if (!menu.length) return grid.replaceChildren(el('p', { class: 'text-center' }, W.menuEmpty));
  const show = (shelf) => {
    for (const b of tabs.children) b.classList.toggle('active', b.dataset.id === shelf.id);
    for (const b of tabs.children)
      b.setAttribute('aria-pressed', String(b.dataset.id === shelf.id));
    grid.replaceChildren(
      ...[
        shelf.description ? el('p', { class: 'shelf-intro' }, shelf.description) : null,
        ...shelf.products.map(card),
      ].filter(Boolean),
    );
  };
  tabs.replaceChildren(
    ...menu.map((shelf) =>
      el(
        'button',
        { type: 'button', class: 'customer-pill', 'data-id': shelf.id, onclick: () => show(shelf) },
        shelf.shortName ?? shelf.name,
      ),
    ),
  );
  show(menu[0]);
  void planBanner();
}

function card(p) {
  const off = p.isAvailable === false;
  const go = (sample) =>
    `/Payment/?product=${encodeURIComponent(p.id)}${sample ? '&sample=1' : ''}`;
  return el(
    'div',
    { class: `category-card${off ? ' off' : ''}` },
    p.imageUrl ? el('img', { src: p.imageUrl, alt: p.name, loading: 'lazy' }) : null,
    el('span', { class: 'card-badge' }, p.badge ?? p.categoryName ?? ''),
    el('h2', { class: 'card-name' }, p.name),
    el(
      'ul',
      { class: 'card-specs' },
      (p.specifications ?? []).slice(0, 2).map((s) => el('li', {}, specText(s))),
    ),
    el('span', { class: 'menu-price' }, planPrice(p)),
    off
      ? el('p', { class: 'card-off' }, W.unavailable)
      : el(
          'div',
          { class: 'card-actions' },
          el(
            'a',
            { class: 'btn-buy', href: go(false), 'aria-label': `${W.subscribe}: ${p.name}` },
            W.subscribe,
          ),
          p.sample
            ? el('a', { class: 'btn-sample', href: go(true) }, W.trySample(rupees(p.sample.price)))
            : null,
        ),
  );
}

/** Signed in with a plan already: manage it in the app. */
async function planBanner() {
  if (!getSession()) return;
  try {
    const plan = await api('/api/users/me/subscription', { auth: true, redirect: false });
    if (plan?.id) document.getElementById('banner').replaceChildren(appPanel(W.haveAPlan));
  } catch {
    // The menu works without it.
  }
}
