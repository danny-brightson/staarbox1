// The new home page's live data. It talks to the same API as the old site
// (through api.js / catalog.js, so config.js still chooses the host):
//   GET /api/categories + /api/products  -> the plan slides (prices, specs, buy buttons)
//   GET /api/delivery-zones              -> the "Find your delivery zone" pincode check
// Nothing here is required for the page to look right: if the API is down or the
// host is unknown, the page keeps the text written in index.html, and the buttons
// go to ./Menu/ instead of straight to a product.
// Load as: <script type="module" src="./JS/live-catalog.js"></script>
import { api } from './api.js';
import { loadMenu, specText } from './catalog.js';
import { SITE } from './config.js';
import { getSession } from './session.js';
import { el, rupees } from './ui.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// =================================================================== PLANS
// Slide numbers in index.html.
const SLIDE = { box: 0, sand: 1, bowl: 2, jar: 3 };
const TIER_NAME = { kids: 'Kids', standard: 'Standard', premium: 'Premium', essential: 'Essential', elite: 'Elite' };
const WHAT = { box: 'Box', sand: 'Sandwich', bowl: 'Bowl', jar: 'Overnight Oat Meal' };

const sel = {
  box: { tier: 'kids', veg: true },
  sand: { tier: 'kids', veg: true },
  bowl: { tier: 'essential' },
};
let catalog = null; // { box: [], sand: [], bowl: [], jar: [] } once the API answers

/**
 * Work out which slide a product belongs to from its name / category.
 * ADJUST THESE WORDS if your product names in the admin differ
 * (open the page with ?debug=1 to see how each product was classified).
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

function pick(kind) {
  if (!catalog) return null;
  const s = sel[kind];
  if (kind === 'jar') return catalog.jar[0] ?? null;
  return (
    catalog[kind].find((p) => p._c.tier === s.tier && (kind === 'bowl' || p._c.veg === s.veg)) ?? null
  );
}

const cycleText = (p) => {
  const m = /^(\d+)\s*d/i.exec(p.billingCycle?.shortLabel ?? '');
  return m ? `${m[1]} days` : (p.billingCycle?.shortLabel ?? 'month');
};
const perDay = (p) => {
  const m = /^(\d+)\s*d/i.exec(p.billingCycle?.shortLabel ?? '');
  return m ? `${rupees(Math.round(p.price / Number(m[1]) / 100) * 100)} / day` : '';
};

/**
 * What every "Choose …" button does:
 *   not signed in -> the login page, which brings the person back to /Menu/ after sign-in
 *                    (login.js reads ?next=; a brand-new user fills /Form/ first, then /Menu/)
 *   signed in     -> the menu page, where "Subscribe" on a product goes on to /Payment/
 */
const go = () => {
  if (getSession()) location.assign('/Menu/');
  else location.assign(`/login/?next=${encodeURIComponent('/Menu/')}`);
};

function setText(slide, field, text) {
  const n = $(`[data-field="${field}"]`, slide);
  if (n) n.textContent = text;
}

function render(kind) {
  const slide = $(`.slide[data-index="${SLIDE[kind]}"]`);
  if (!slide) return;
  const btn = $('[data-field="btn"]', slide) ?? $('.btn-plan-primary', slide);
  const s = sel[kind];
  const label =
    kind === 'bowl'
      ? `Choose ${TIER_NAME[s.tier]} Bowl`
      : kind === 'jar'
        ? 'Choose Overnight Oat Meal'
        : `Choose ${TIER_NAME[s.tier]} ${s.veg ? 'Veg' : 'Non-Veg'} ${WHAT[kind]}`;

  if (!catalog) {
    // The API has not answered (or is not reachable): keep the page's own text.
    if (btn) {
      btn.textContent = label;
      btn.onclick = go;
    }
    return;
  }
  const p = pick(kind);
  const priceBox = $('[data-field="price"]', slide) ?? $('.plan-price', slide);
  const dayBox = $('[data-field="day"]', slide) ?? $('.plan-day', slide);

  if (!p) {
    if (priceBox) priceBox.replaceChildren('Not available');
    if (dayBox) dayBox.style.display = 'none';
    if (btn) {
      btn.textContent = 'Not available';
      btn.disabled = true;
      btn.onclick = null;
    }
    return;
  }
  if (priceBox) priceBox.replaceChildren(`${rupees(p.price)} `, el('span', {}, `/${cycleText(p)}`));
  if (dayBox) {
    const d = perDay(p);
    dayBox.textContent = d;
    dayBox.style.display = d ? '' : 'none';
  }
  const off = p.isAvailable === false;
  if (btn) {
    btn.textContent = off ? 'Currently unavailable' : label;
    btn.disabled = off;
    btn.onclick = off ? null : go;
  }
  // Picture, chips and short text from the product (only when it has them).
  if (p.imageUrl) {
    const img = $('.visual-core img', slide);
    if (img) {
      img.src = p.imageUrl;
      img.alt = p.name;
    }
  }
  const specs = p.specifications ?? [];
  const chips = $('[data-field="highlights"]', slide);
  if (chips && specs.length) {
    chips.replaceChildren(...specs.slice(0, 4).map((x) => el('span', { class: 'highlight-chip' }, specText(x))));
  }
  const protein = specs.find((x) => /protein/i.test(x.label ?? ''));
  if (protein) setText(slide, 'protein', specText(protein));
  const weight = specs.find((x) => /weight|gram|quantity/i.test(x.label ?? ''));
  if (weight) setText(slide, 'weight', specText(weight));
  if (p.shortDescription) setText(slide, 'desc', p.shortDescription);
}

/** Make the clicked pill active inside its own group. */
function activate(btn) {
  $$('.toggle-btn', btn.parentElement).forEach((b) => b.classList.toggle('active', b === btn));
}
function setter(kind, key) {
  return (value, btn) => {
    if (btn) activate(btn);
    sel[kind][key] = value;
    render(kind);
  };
}
// The HTML calls these from onclick="…". "veg" buttons pass true for NON-veg.
// If JS/index.js already defines one, ITS version still runs first and ours then
// layers the live API data on top; the explore* ones are left to index.js.
const chain = (name, fn) => {
  const prev = window[name];
  window[name] = (...args) => {
    if (typeof prev === 'function') prev(...args);
    fn(...args);
  };
};
chain('setBoxTier', setter('box', 'tier'));
chain('setBoxVeg', (nonVeg, btn) => setter('box', 'veg')(!nonVeg, btn));
chain('setSandTier', setter('sand', 'tier'));
chain('setSandVeg', (nonVeg, btn) => setter('sand', 'veg')(!nonVeg, btn));
chain('setBowlTier', setter('bowl', 'tier'));
window.exploreBoxPlan ??= () => (location.href = './Menu/');
window.exploreSandwichPlan ??= () => (location.href = './Menu/');
window.exploreBowlPlan ??= () => (location.href = './Menu/');

async function startPlans() {
  // First paint: the buttons work even before / without the API.
  Object.keys(SLIDE).forEach(render);
  if (!SITE) return; // unknown host: the shop stays closed, the page stays as written
  try {
    catalog = buildCatalog(await loadMenu());
  } catch {
    catalog = null; // page keeps its own text; buttons keep going to ./Menu/
    return;
  }
  // The page starts on Kids / Veg; if the shop has no veg product for a tier, say so.
  Object.keys(SLIDE).forEach(render);
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
