import { SITE } from './config.js';
import { loadMenu } from './catalog.js';
import { rupees } from './ui.js';

const norm = (value) => String(value ?? '')
  .toLowerCase()
  .replace(/&/g, 'and')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

function priceText(product) {
  const price = Number(product?.price);
  return Number.isFinite(price) && price >= 0 ? rupees(price) : null;
}
function findProduct(products, name) {
  const target = norm(name);
  return products.find((p) => norm(p.name) === target)
    || products.find((p) => norm(p.name).includes(target) || target.includes(norm(p.name)));
}
function setPriceBlock(slide, product) {
  const price = priceText(product);
  const priceNode = slide.querySelector('[data-field="price"]');
  const dayNode = slide.querySelector('[data-field="day"]');
  const button = slide.querySelector('[data-field="btn"]');
  const available = product?.isAvailable !== false;
  if (priceNode) {
    priceNode.replaceChildren(document.createTextNode(price ?? 'Price unavailable'));
    if (price) {
      const cycle = document.createElement('span');
      cycle.textContent = `/${product.billingCycle?.shortLabel ?? '26d'}`;
      priceNode.append(' ', cycle);
    }
    priceNode.dataset.apiPriceLoaded = 'true';
  }
  if (dayNode) {
    dayNode.textContent = price ? `${rupees(Number(product.price) / 26)} / day` : 'See app for pricing';
  }
  if (button) {
    button.dataset.apiProductId = product?.id ?? '';
    button.dataset.apiAvailable = String(available && !!price);
    button.title = !available ? 'This product is currently unavailable' : (!price ? 'Price is not available from the catalog API' : '');
    button.classList.toggle('api-product-unavailable', !available || !price);
  }
}
function setUnavailable(slide) {
  const priceNode = slide.querySelector('[data-field="price"]');
  const dayNode = slide.querySelector('[data-field="day"]');
  if (priceNode) {
    priceNode.replaceChildren(document.createTextNode('Price unavailable'));
    priceNode.dataset.apiPriceLoaded = 'true';
  }
  if (dayNode) dayNode.textContent = 'See app for pricing';
  const button = slide.querySelector('[data-field="btn"]');
  if (button) {
    button.dataset.apiProductId = '';
    button.dataset.apiAvailable = 'false';
    button.title = 'No matching available product was returned by the catalog API';
    button.classList.add('api-product-unavailable');
  }
}
async function syncLivePrices() {
  const slides = [...document.querySelectorAll('.plans-section .slide')];
  // Do not show hard-coded prices as if they were live prices while loading or after an API failure.
  slides.forEach((slide) => {
    const price = slide.querySelector('[data-field="price"]');
    const day = slide.querySelector('[data-field="day"]');
    if (price) price.replaceChildren(document.createTextNode('Loading price…'));
    if (day) day.textContent = '';
  });
  if (!SITE) {
    slides.forEach(setUnavailable);
    return;
  }
  try {
    const menu = await loadMenu();
    window.__SBX_CATALOG_READY = true;
    const products = menu.flatMap((category) => category.products);
    window.__SBX_PRODUCTS = products;

    // Product names are matched against the plan names already used by the preserved UI.
    const maps = [
      { data: window.__SBX_BOX_DATA, slideIndex: 0, tiers: ['kids', 'standard', 'premium'], variants: ['veg', 'nonveg'] },
      { data: window.__SBX_SAND_DATA, slideIndex: 1, tiers: ['kids', 'standard', 'premium'], variants: ['veg', 'nonveg'] },
      { data: window.__SBX_BOWL_DATA, slideIndex: 2, tiers: ['essential', 'elite'], variants: [null] },
    ];
    for (const map of maps) {
      const slide = document.querySelector(`.plans-section .slide[data-index="${map.slideIndex}"]`);
      if (!slide || !map.data) continue;
      const current = map.slideIndex === 0
        ? map.data.kids.veg.name
        : map.slideIndex === 1
          ? map.data.kids.veg.name
          : 'Essential Bowl';
      const currentProduct = findProduct(products, current);
      if (currentProduct) setPriceBlock(slide, currentProduct);
      else setUnavailable(slide);

      // Attach API-backed prices to every tier/variant so the existing toggles stay functional.
      for (const tier of map.tiers) {
        for (const variant of map.variants) {
          const item = variant ? map.data[tier]?.[variant] : map.data[tier];
          if (!item) continue;
          const product = findProduct(products, item.name || (tier === 'essential' ? 'Essential Bowl' : 'Elite Bowl'));
          item.__apiPrice = product?.isAvailable === false ? null : (priceText(product) ? Number(product.price) : null);
          item.__apiCycle = product?.billingCycle?.shortLabel ?? '26d';
          item.__apiAvailable = product?.isAvailable !== false && !!priceText(product);
          item.__apiProductId = product?.id ?? null;
        }
      }
    }

    // Render once after API data is attached; wrapped renderers apply live values on each toggle.
    for (const [key, fn] of [
      ['__SBX_RENDER_BOX', window.__SBX_RENDER_BOX],
      ['__SBX_RENDER_SAND', window.__SBX_RENDER_SAND],
    ]) {
      if (typeof fn === 'function') {
        window[key] = fn;
      }
    }
    // Keep the active visible slide's displayed price in sync after the initial API load.
    const activeSlide = document.querySelector('.plans-section .slide.active');
    if (activeSlide) {
      const index = Number(activeSlide.dataset.index);
      const item = index === 0 ? window.__SBX_BOX_DATA?.kids?.veg
        : index === 1 ? window.__SBX_SAND_DATA?.kids?.veg
        : window.__SBX_BOWL_DATA?.essential;
      if (item?.__apiPrice != null) setPriceBlock(activeSlide, { price: item.__apiPrice, id: item.__apiProductId, isAvailable: item.__apiAvailable });
      else if (item) setUnavailable(activeSlide);
    }
  } catch (error) {
    window.__SBX_CATALOG_READY = true;
    console.error('[Staarbox] Live catalog could not be loaded:', error);
    slides.forEach(setUnavailable);
  }
}
syncLivePrices();
