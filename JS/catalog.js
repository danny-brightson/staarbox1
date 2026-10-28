// The live menu from /api/categories + /api/products (public, no sign-in).
// The home page and /Menu/ both draw it; prices are the server's list prices.
import { api } from './api.js';
import { rupees } from './ui.js';

const byOrder = (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0);

let menuOnce = null;

/**
 * The categories that have products, in order, each with its products.
 * Asked once per page load: the home page's plan slides share one request.
 * A failed request is not remembered, so a retry asks again.
 */
export function loadMenu() {
  menuOnce ??= fetchMenu().catch((e) => {
    menuOnce = null;
    throw e;
  });
  return menuOnce;
}

async function fetchMenu() {
  const [{ categories = [] }, { products = [] }] = await Promise.all([
    api('/api/categories'),
    api('/api/products'),
  ]);
  const shelves = new Map(categories.map((c) => [c.id, []]));
  for (const p of [...products].sort(byOrder)) shelves.get(p.categoryId)?.push(p);
  return [...categories]
    .sort(byOrder)
    .map((c) => ({ ...c, products: shelves.get(c.id) ?? [] }))
    .filter((c) => c.products.length > 0);
}

/** "4 Fruits", or the value alone when the label is hidden (the app's cards). */
export const specText = (s) => (s.showLabel === false ? s.value : `${s.value} ${s.label}`);

/** "₹3,499/26d" */
export const planPrice = (p) => `${rupees(p.price)}/${p.billingCycle?.shortLabel ?? '26d'}`;
