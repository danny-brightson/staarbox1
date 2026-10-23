// /Payment/: the app's Review page. What's inside, can-buy's rule, the price
// from OUR server, then create-payment → checkout → verify-payment. The
// website never sends an amount: the server's order carries it (8L §2).
import { api, friendly, toSignIn } from './api.js';
import { specText } from './catalog.js';
import { getSession } from './session.js';
import { appPanel, day, el, notice, rupees, shopIsOpen } from './ui.js';
import { W } from './words.js';

const $ = (id) => document.getElementById(id);
const main = $('main');
const params = new URLSearchParams(location.search);
const productId = params.get('product') ?? '';

let sample = params.get('sample') === '1';
let coins = 0;
let account = null;
let product = null;
let canBuy = null;
let price = null;
let knownIds = [];
let pending = null; // a payment checkout reported, not yet confirmed: re-verify it, never re-order
let busy = false;

if (shopIsOpen(main)) {
  if (!/^[0-9a-f-]{36}$/i.test(productId)) location.replace('/Menu/');
  else if (!getSession()) toSignIn();
  else void start();
}

async function start() {
  try {
    [account, product] = await Promise.all([
      api('/api/users/me/profiles', { auth: true }),
      api(`/api/products/${productId}`).then((r) => r.product),
    ]);
  } catch (e) {
    return say(e.status === 404 ? W.productGone : e.status ? W.productFailed : friendly(e));
  }
  if (!product.sample) sample = false;
  drawProduct();
  drawWhoFor();
  drawMode();
  drawInside();
  $('payBtn').addEventListener('click', () => void pay());
  await refresh();
}

const active = () => account?.profiles?.find((p) => p.id === account.activeProfileId);

function say(text, kind = 'error', more = '') {
  notice($('payNotice'), text, kind, more);
}

function setPay(label, disabled) {
  $('payBtn').textContent = label;
  $('payBtn').disabled = disabled;
}

// ---- What is being bought ----

function drawProduct() {
  $('product').replaceChildren(
    el(
      'div',
      { class: 'product-head' },
      product.imageUrl ? el('img', { src: product.imageUrl, alt: product.name }) : null,
      el(
        'div',
        {},
        el('div', { class: 'badge-line' }, product.badge ?? product.categoryName ?? ''),
        el('p', { class: 'name' }, product.name),
        el('div', { class: 'muted' }, product.shortDescription ?? ''),
      ),
    ),
  );
}

/** More than one profile: whose box is it? Buying acts on the session's active profile. */
function drawWhoFor() {
  const profiles = account.profiles ?? [];
  if (profiles.length < 2) return $('whoFor').replaceChildren();
  $('whoFor').replaceChildren(
    el('h3', {}, W.whoFor),
    el(
      'div',
      { class: 'choice', role: 'radiogroup', 'aria-label': W.whoFor },
      profiles.map((p) =>
        el(
          'label',
          {},
          el('input', {
            type: 'radio',
            name: 'whoFor',
            value: p.id,
            checked: p.id === account.activeProfileId,
            onchange: () => void switchTo(p.id),
          }),
          p.name,
        ),
      ),
    ),
    el('p', { class: 'muted' }, W.addProfileInApp),
  );
}

async function switchTo(id) {
  try {
    account = await api(`/api/users/me/profiles/${encodeURIComponent(id)}/activate`, {
      method: 'POST',
      auth: true,
      body: {},
    });
    coins = 0;
    await refresh();
  } catch (e) {
    say(friendly(e));
  }
}

/** The 26-day plan or the 7-day sample, when the box has one. */
function drawMode() {
  if (!product.sample) return $('mode').replaceChildren();
  const option = (isSample, text) =>
    el(
      'label',
      {},
      el('input', {
        type: 'radio',
        name: 'mode',
        checked: sample === isSample,
        onchange: () => {
          sample = isSample;
          coins = 0;
          history.replaceState(
            null,
            '',
            `?product=${encodeURIComponent(productId)}${sample ? '&sample=1' : ''}`,
          );
          void refresh();
        },
      }),
      text,
    );
  $('mode').replaceChildren(
    el(
      'div',
      { class: 'choice' },
      option(false, W.switchToPlan(rupees(product.price))),
      option(true, W.switchToSample(rupees(product.sample.price))),
    ),
  );
}

function drawInside() {
  const specs = product.specifications ?? [];
  const items = product.ingredients ?? [];
  // A box may have neither list: the DOM would print each null as "null".
  $('inside').replaceChildren(
    ...[
      specs.length
        ? el(
            'details',
            { class: 'inside', open: true },
            el('summary', {}, product.specificationsTitle || W.itemsIncluded),
            el(
              'ul',
              {},
              specs.map((s) =>
                el('li', {}, specText(s), s.detail ? el('small', {}, s.detail) : null),
              ),
            ),
          )
        : null,
      items.length
        ? el(
            'details',
            { class: 'inside' },
            el('summary', {}, product.ingredientsTitle || W.ingredients),
            el(
              'ul',
              {},
              items.map((i) => el('li', {}, i.name)),
            ),
          )
        : null,
    ].filter(Boolean),
  );
}

// ---- The rules and the price, for the active profile ----

async function refresh() {
  say('');
  setPay(W.pay, true);
  const who = active();
  if (who && !who.setupComplete) {
    const back = encodeURIComponent(location.pathname + location.search);
    $('note').replaceChildren(
      el('p', {}, W.finishProfile, ' ', el('a', { href: `/Form/?next=${back}` }, W.continue)),
    );
    return;
  }
  try {
    [canBuy, price] = await Promise.all([
      api(`/api/subscriptions/can-buy?productId=${encodeURIComponent(productId)}`, {
        auth: true,
      }).catch(() => null),
      loadPrice(),
    ]);
  } catch (e) {
    $('price').replaceChildren();
    return say(
      e.status === 404 ? W.productGone : e.status ? e.message || W.priceFailed : friendly(e),
    );
  }
  drawPrice();
  const rule = sample ? canBuy?.sample : canBuy?.plan;
  const state = rule?.state ?? 'now'; // an unknown state reads as "now", as the app
  const notes = [];
  if (state === 'next')
    notes.push(el('p', {}, rule.after ? W.startsAfter(day(rule.after)) : W.nextBooked));
  if (state === 'notYet')
    notes.push(
      appPanel(
        `${rule.from ? W.bookFrom(day(rule.from)) : rule.message || W.cantBuyNow} ${W.haveAPlan}`,
      ),
    );
  if (who?.zoneStatus === 'waitlist')
    notes.push(el('p', { class: 'shop-notice error' }, W.waitlist));
  $('note').replaceChildren(...notes);
  const blocked = state === 'notYet' || who?.zoneStatus === 'waitlist';
  setPay(pending ? W.tryAgain : W.pay, blocked && !pending);
}

function loadPrice() {
  const q = new URLSearchParams({ productId, sample: String(sample) });
  if (!sample) q.set('coins', String(coins));
  return api(`/api/subscriptions/price-details?${q}`, { auth: true });
}

function row(label, value, cls = '') {
  return el(
    'div',
    { class: `summary-item ${cls}` },
    el('span', {}, label),
    el('span', { class: cls === 'minus' ? 'minus' : '' }, value),
  );
}

function drawPrice() {
  const p = price;
  const cycle = sample ? product.sample?.billingCycle?.label : product.billingCycle?.label;
  const lines = [
    el('h3', {}, W.priceDetails),
    row(W.subscription(cycle ?? (sample ? '7 days' : '26 days')), rupees(p.subscriptionPrice)),
    row(W.deliveryFee, rupees(p.deliveryFee)),
    row(W.taxes, rupees(p.taxes)),
    ...(p.discounts ?? []).map((d) =>
      row(d.kind === 'offer' ? W.discount(d.label) : d.label, `-${rupees(d.amount)}`, 'minus'),
    ),
    row(W.total, rupees(p.total), 'total'),
  ];
  // coinsRow() is null for a sample: the DOM would print it as "null".
  $('price').replaceChildren(...[...lines, coinsRow()].filter(Boolean));
}

/** Coins, when the API offers them (promo codes are off: no code field). */
function coinsRow() {
  const p = price;
  if (sample || p.rewardsAllowed === false)
    return p.rewardsAllowed === false ? el('p', { class: 'coins muted' }, W.noCoinsSample) : null;
  const c = p.coins;
  if (!c) return null;
  if (!c.available) return el('p', { class: 'coins muted' }, W.coinsNone);
  if (!c.usable) return el('p', { class: 'coins muted' }, W.coinsUnusable(c.available));
  const box = el('input', {
    type: 'checkbox',
    checked: coins > 0,
    onchange: (e) => {
      coins = e.target.checked ? c.usable : 0;
      void refresh();
    },
  });
  return el(
    'div',
    { class: 'coins' },
    el('label', {}, box, W.coinsUse(c.available, c.usable, c.usable * c.percentEach)),
    coins > 0 ? el('p', { class: 'muted' }, W.coinsUsing(c.used, c.used * c.percentEach)) : null,
    p.capped ? el('p', { class: 'muted' }, W.capped(p.maxDiscountPercent)) : null,
  );
}

// ---- Paying ----

async function pay() {
  if (busy) return;
  if (pending) return confirm(pending);
  busy = true;
  setPay(W.preparing, true);
  say('');
  let order;
  try {
    knownIds = ((await api('/api/subscriptions', { auth: true })).subscriptions ?? []).map(
      (s) => s.id,
    );
    const body = { productId };
    if (sample) body.sample = true;
    else if (coins > 0) body.coins = coins;
    order = await api('/api/subscriptions/create-payment', { method: 'POST', auth: true, body });
  } catch (e) {
    busy = false;
    setPay(W.pay, false);
    if (e.status === 0) return say(W.offline);
    if (e.status === 401) return say(W.sessionExpiredPay);
    return say(e.status >= 400 && e.status < 500 ? e.message || W.startFailed : W.startFailed);
  }
  setPay(W.completing, true);
  let result;
  try {
    result = order.key?.startsWith('rzp_dev_') ? await devCheckout(order) : await razorpay(order);
  } catch {
    result = { noOpen: true };
  }
  if (result.paid) {
    pending = {
      orderId: result.paid.razorpay_order_id,
      paymentId: result.paid.razorpay_payment_id,
      signature: result.paid.razorpay_signature,
      reference: order.reference,
    };
    return confirm(pending);
  }
  busy = false;
  setPay(W.tryAgain, false);
  if (result.noOpen) say(W.rzpNoOpen);
  else if (result.failed) say(W.notCompleted, 'error', W.notCompletedMore);
  else say(W.cancelled, 'info', W.cancelledMore);
}

async function confirm(p) {
  busy = true;
  setPay(W.confirming, true);
  try {
    const r = await api('/api/subscriptions/verify-payment', {
      method: 'POST',
      auth: true,
      body: p,
    });
    if (r.verified) return paid({ subscriptionId: r.subscription?.id });
    pending = null;
    busy = false;
    setPay(W.tryAgain, false);
    say(W.notCompleted, 'error', W.notCompletedMore);
  } catch (e) {
    // Paid at Razorpay, not captured yet: the webhook settles it, and Thank you reads it.
    if (e.code === 'PAYMENT_PENDING') return paid({});
    busy = false;
    if (e.status === 409) {
      pending = null;
      setPay(W.pay, true);
      return say(e.message || W.wrong);
    }
    setPay(W.tryAgain, false); // the same payment is kept: Try Again checks it again
    say(W.notConfirmed, 'error', W.notConfirmedMore);
  }
}

function paid(extra) {
  sessionStorage.setItem('staarbox.paid', JSON.stringify({ productId, knownIds, ...extra }));
  location.assign('/Thankyou/');
}

/** A server with the dev gateway (the tests, staging without Razorpay): a test panel, no money. */
function devCheckout(order) {
  return new Promise((resolve) => {
    const go = async (outcome) => {
      panel.remove();
      try {
        const r = await api(`/api/dev/checkout/${encodeURIComponent(order.orderId)}`, {
          method: 'POST',
          auth: true,
          body: { outcome },
        });
        resolve(r.error ? { failed: true } : { paid: r });
      } catch {
        resolve({ failed: true });
      }
    };
    const panel = el(
      'div',
      { class: 'test-pay', role: 'group', 'aria-label': W.testPayTitle },
      el('p', {}, W.testPayTitle),
      el(
        'button',
        { type: 'button', class: 'btn btn-success', onclick: () => void go('paid') },
        W.testPay,
      ),
      el(
        'button',
        { type: 'button', class: 'btn btn-outline-danger', onclick: () => void go('failed') },
        W.testFail,
      ),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-outline-secondary',
          onclick: () => (panel.remove(), resolve({ cancelled: true })),
        },
        W.testCancel,
      ),
    );
    $('payArea').append(panel);
  });
}

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'; // not versioned, so no SRI (Razorpay's advice)
    s.onload = resolve;
    s.onerror = reject;
    document.head.append(s);
  });
}

/** Razorpay Checkout with the server's order: the key, the amount and the order id are OUR server's. */
async function razorpay(order) {
  await loadCheckout();
  return new Promise((resolve) => {
    let failed = false;
    const rzp = new window.Razorpay({
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: order.name,
      description: order.description,
      prefill: order.prefill,
      notes: order.notes,
      theme: { color: order.themeColor },
      timeout: order.timeout,
      handler: (r) => resolve({ paid: r }),
      modal: { ondismiss: () => resolve(failed ? { failed: true } : { cancelled: true }) },
    });
    rzp.on('payment.failed', () => {
      failed = true;
    });
    rzp.open();
  });
}
