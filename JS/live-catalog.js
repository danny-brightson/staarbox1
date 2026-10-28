// The new home page's live data. It talks to the same API as the old site
// (through api.js / catalog.js, so config.js still chooses the host):
//   GET /api/categories + /api/products  -> real prices for the plan slides
//   GET /api/delivery-zones              -> the "Find your delivery zone" pincode check
//
// The plan slides themselves (pictures, headlines, tiers, Veg / Non-Veg, "Explore Plan")
// are drawn by JS/index.js from its own tables. index.js already has hooks for live prices:
//   d.__apiPrice (rupees), d.__apiCycle ("26d"), d.__apiId, window.__SBX_CATALOG_READY,
//   and window.__SBX_RENDER_BOX / _SAND / _BOWL.
// This file only FEEDS those hooks, so nothing here fights index.js over the page.
// If the API is unreachable the slides keep working: index.js shows "Price unavailable".
// Load as: <script type="module" src="./JS/live-catalog.js"></script>
import { api } from './api.js';
import { loadMenu } from './catalog.js';
import { SITE } from './config.js';
import { el, rupees } from './ui.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// =================================================================== PLAN PRICES
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z]+/g, '');

/**
 * Which slide a product belongs to, from its name / category. Used only when the
 * product name is not exactly one of index.js's names (e.g. "Kids Veg Box").
 * Open the page with ?debug=1 to see how each product was classified.
 */
function classify(p) {
  const name = (p.name ?? '').toLowerCase();
  const text = `${name} ${(p.categoryName ?? '').toLowerCase()}`;
  let kind = 'box';
  if (/sandwich/.test(text)) kind = 'sand';
  else if (/bowl/.test(text)) kind = 'bowl';
  else if (/jar|oat/.test(text)) kind = 'jar';
  const tier = /kid/.test(name)
    ? 'kids'
    : /standard/.test(name)
      ? 'standard'
      : /premium/.test(name)
        ? 'premium'
        : /elite/.test(name)
          ? 'elite'
          : /essential|basic/.test(name)
            ? 'essential'
            : null;
  const veg = !/non[\s-]?veg|egg|chicken|fish/.test(name);
  return { kind, tier, veg };
}

function buildCatalog(menu) {
  const out = { box: [], sand: [], bowl: [], jar: [] };
  for (const shelf of menu) {
    for (const p of shelf.products) {
      const c = classify({ ...p, categoryName: p.categoryName ?? shelf.name });
      out[c.kind].push({ ...p, _c: c });
    }
  }
  if (new URLSearchParams(location.search).has('debug')) {
    console.table(Object.entries(out).flatMap(([k, list]) => list.map((p) => ({ slide: k, name: p.name, ...p._c, price: p.price / 100 }))));
  }
  return out;
}

/** Give one index.js variant (d) its live price, or take it away when there is no product. */
function feed(d, p) {
  if (!d) return;
  if (p) {
    d.__apiPrice = p.price / 100; // index.js formats rupees itself
    d.__apiCycle = p.billingCycle?.shortLabel ?? '26d';
    d.__apiId = p.id;
  } else {
    delete d.__apiPrice;
    delete d.__apiCycle;
    delete d.__apiId;
  }
}

function applyPrices(cat) {
  const exact = (list, d) => list.find((p) => d.name && norm(p.name) === norm(d.name));
  // Daily boxes + sandwiches: data[tier].veg / .nonveg
  for (const [kind, dataKey] of [
    ['box', '__SBX_BOX_DATA'],
    ['sand', '__SBX_SAND_DATA'],
  ]) {
    const data = window[dataKey];
    if (!data) continue;
    for (const [tier, pair] of Object.entries(data)) {
      for (const [key, d] of Object.entries(pair)) {
        const veg = key === 'veg';
        feed(d, exact(cat[kind], d) ?? cat[kind].find((p) => p._c.tier === tier && p._c.veg === veg));
      }
    }
  }
  // Bowls: data.essential / data.elite
  const bowls = window.__SBX_BOWL_DATA;
  if (bowls) for (const [tier, d] of Object.entries(bowls)) feed(d, cat.bowl.find((p) => p._c.tier === tier));

  // Slide 4 (overnight oats / jar) is plain HTML in index.html, not drawn by index.js.
  const jar = cat.jar[0];
  const slide = $('.slide[data-index="3"]');
  const priceBox = slide && $('.plan-price', slide);
  if (jar && priceBox) priceBox.replaceChildren(`${rupees(jar.price)} `, el('span', {}, `/${jar.billingCycle?.shortLabel ?? '26d'}`));
}

function redraw() {
  window.__SBX_CATALOG_READY = true; // from now on index.js prefers API prices
  window.__SBX_RENDER_BOX?.();
  window.__SBX_RENDER_SAND?.();
  const tier = $('.slide[data-index="2"] .toggle-btn.active')?.textContent?.trim().toLowerCase() === 'elite' ? 'elite' : 'essential';
  window.__SBX_RENDER_BOWL?.(tier);
}

async function startPlans() {
  if (!SITE) return; // unknown host (a preview): the page keeps index.js's design prices
  try {
    applyPrices(buildCatalog(await loadMenu()));
  } catch {
    // API down: no prices fed, index.js shows "Price unavailable / See app for pricing".
  }
  redraw();
}

// =================================================================== DELIVERY ZONES
// Zone pictures are ./Image/zone-N.png. The server only publishes a list of
// PINCODES we deliver to (/api/delivery-zones), so the area names below are
// content YOU maintain: fill `areas` (searchable names) and, if you like,
// `pincodes` (so a pincode search can jump to the right zone's picture).
const ZONES = [
  { n: 1, name: 'Central City', desc: 'Our core delivery zone. Boxes reach you between 6:30 and 9:30 AM.', areas: [], pincodes: [] },
  { n: 2, name: 'East Zone', desc: 'Our east delivery zone. Boxes reach you between 6:30 and 9:30 AM.', areas: [], pincodes: [] },
  { n: 3, name: 'Central City', desc: 'Boxes reach you between 6:30 and 9:30 AM.', areas: [], pincodes: [] }, // old page said "Central City" here too: rename if that was a typo
  { n: 4, name: 'Central City', desc: 'Boxes reach you between 6:30 and 9:30 AM.', areas: [], pincodes: [] }, // same
];

let pins = null; // Set of served pincodes, loaded once
let zoneNow = 0;

function showZone(i) {
  zoneNow = i;
  const z = ZONES[i];
  $$('#zf-tabs .zf-tab').forEach((t, j) => {
    t.classList.toggle('active', j === i);
    t.setAttribute('aria-selected', String(j === i));
  });
  $('#zf-zone-tag').textContent = `Zone ${z.n}`;
  $('#zf-zone-name').textContent = z.name;
  $('#zf-zone-desc').textContent = z.desc;
  $('#zf-fallback-zone').textContent = String(z.n);
  $('#zf-chips').replaceChildren(...z.areas.map((a) => el('span', { class: 'zf-chip' }, a)));
  const img = $('#zf-map-img');
  img.style.display = 'none';
  $('#zf-mapvisual').classList.remove('has-image'); // inline onload sets it again
  img.alt = `Delivery zone ${z.n}: ${z.name}`;
  img.src = `./Image/zone-${z.n}.png`;
}

function startZones() {
  const tabs = $('#zf-tabs');
  const input = $('#zf-input');
  const box = $('#zf-results');
  if (!tabs || !input || !box) return;

  tabs.replaceChildren(
    ...ZONES.map((z, i) =>
      el('button', { type: 'button', class: 'zf-tab', role: 'tab', onclick: () => showZone(i) }, `Zone ${z.n}`),
    ),
  );
  showZone(0);

  const close = () => box.classList.remove('show');
  const message = (text) => {
    box.replaceChildren(el('div', { class: 'zf-empty' }, text));
    box.classList.add('show');
  };
  const row = (title, sub, badge, onPick) =>
    el(
      'button',
      { type: 'button', class: 'zf-result', onclick: onPick },
      el('div', {}, el('strong', {}, title), el('small', {}, sub)),
      badge ? el('span', {}, badge) : null,
    );
  const choose = (i) => () => {
    showZone(i);
    close();
  };

  let seq = 0;
  async function search() {
    const q = input.value.trim().toLowerCase();
    const mine = ++seq;
    if (q.length < 2) return close();

    if (/^\d{6}$/.test(q)) {
      if (!SITE) return message('We can’t check right now. Please message us.');
      message('Checking…');
      try {
        pins ??= new Set((await api('/api/delivery-zones')).pincodes ?? []);
      } catch {
        pins = null;
        if (mine === seq) message('We couldn’t check our delivery area right now. Please try again.');
        return;
      }
      if (mine !== seq) return;
      if (!pins.has(q)) return message(`Not in our delivery area yet (${q}). We add new streets every month.`);
      const zi = ZONES.findIndex((z) => z.pincodes.includes(q));
      box.replaceChildren(
        row(`Yes, we deliver to ${q}`, '6:30 – 9:30 AM, 6 days a week', zi >= 0 ? `Zone ${ZONES[zi].n}` : '', zi >= 0 ? choose(zi) : close),
      );
      box.classList.add('show');
      return;
    }

    const hits = [];
    ZONES.forEach((z, i) =>
      z.areas.forEach((a) => {
        if (a.toLowerCase().includes(q)) hits.push({ a, z, i });
      }),
    );
    if (!hits.length) {
      return message(
        ZONES.some((z) => z.areas.length)
          ? 'No area matched. Try your 6-digit pincode, or message us.'
          : 'Enter your 6-digit pincode to check delivery.',
      );
    }
    box.replaceChildren(...hits.slice(0, 8).map((h) => row(h.a, h.z.name, `Zone ${h.z.n}`, choose(h.i))));
    box.classList.add('show');
  }

  input.addEventListener('input', () => void search());
  input.addEventListener('focus', () => input.value.trim().length >= 2 && void search());
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.zf-search')) close();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
}

// =================================================================== go
startZones();
void startPlans();
