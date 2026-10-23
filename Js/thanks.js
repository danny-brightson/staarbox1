// /Thankyou/: the plan just booked, read from the API. If the webhook has not
// settled the payment yet, it says so and reads again a few times, then
// points to the app (8L §2).
import { api } from './api.js';
import { getSession } from './session.js';
import { day, el, rupees } from './ui.js';
import { W } from './words.js';

const $ = (id) => document.getElementById(id);
const TRIES = 6;
const EVERY_MS = 5_000;

let paid = null;
try {
  paid = JSON.parse(sessionStorage.getItem('staarbox.paid') ?? 'null');
} catch {
  paid = null;
}
if (paid && getSession()) void watch();

async function watch() {
  for (let i = 0; i < TRIES; i++) {
    const plan = await find().catch(() => null);
    if (plan) return show(plan);
    if (i === 0) {
      $('check').classList.add('wait');
      $('check').textContent = '…';
      $('subtitle').textContent = W.received;
    }
    await new Promise((r) => setTimeout(r, EVERY_MS));
  }
  $('subtitle').textContent = `${W.receivedLate} ${W.appPitch}`;
}

/** The plan this payment booked: by its id, or the new one for this box. */
async function find() {
  const { subscriptions = [] } = await api('/api/subscriptions', { auth: true, redirect: false });
  return paid.subscriptionId
    ? subscriptions.find((s) => s.id === paid.subscriptionId)
    : subscriptions.find((s) => s.productId === paid.productId && !paid.knownIds?.includes(s.id));
}

const row = (label, value) => el('div', {}, el('span', {}, label), el('strong', {}, value));

function show(s) {
  sessionStorage.removeItem('staarbox.paid');
  $('check').classList.remove('wait');
  $('check').textContent = '✓';
  const booked = s.status === 'scheduled';
  $('title').textContent = booked ? W.booked : W.activated;
  $('subtitle').textContent = `${booked ? W.bookedMore : W.activatedMore} ${W.appPitch}`;
  $('plan').replaceChildren(
    el(
      'div',
      { class: 'plan-rows' },
      row(W.plan, s.productName),
      row(W.amount, `${rupees(s.price)} / ${s.billingCycle?.label ?? ''}`),
      row(W.status, s.statusLabel ?? s.status),
      s.startDate ? row(W.started, day(s.startDate)) : null,
      s.renewalDate ? row(W.renewsOn, day(s.renewalDate)) : null,
    ),
  );
}
