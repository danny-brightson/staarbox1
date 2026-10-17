// /Form/: "Create Profile", the app's profile setup, with the delivery address
// typed in (8H's no-map path: the pincode first, the address search).
import { api, friendly, toSignIn } from './api.js';
import { getSession } from './session.js';
import { el, nameProblem, notice, safeNext, shopIsOpen } from './ui.js';
import { W } from './words.js';

const $ = (id) => document.getElementById(id);
const main = $('main');
const next = safeNext('/Menu/');
// The three questions this page draws itself; the server's others are drawn from /api/health-questions.
const FIXED = new Set(['non_veg', 'diabetes', 'pregnant']);
const mapSession = crypto.randomUUID();

let holder = true; // the account holder must be 18 or older
let questions = [];
let zones = null;
let spot = null; // {lat, lng} when the search or the location filled the address
let tried = false;

if (shopIsOpen(main)) {
  if (getSession()) void start();
  else toSignIn();
}

async function start() {
  const [account, hq] = await Promise.allSettled([
    api('/api/users/me/profiles', { auth: true }),
    api('/api/health-questions'),
  ]);
  if (account.status === 'fulfilled') {
    const a = account.value;
    const p = a.profiles?.find((x) => x.id === a.activeProfileId);
    if (p?.setupComplete) return location.assign(next);
    if (p) prefill(p);
  }
  if (hq.status === 'fulfilled') {
    questions = (hq.value.questions ?? []).filter((q) => !FIXED.has(q.id));
    drawQuestions();
  } else {
    $('healthQuestions').replaceChildren(
      el('p', { class: 'error' }, W.healthLoadFailed),
      el(
        'button',
        { type: 'button', class: 'small-btn', onclick: () => location.reload() },
        W.tryAgain,
      ),
    );
  }
  $('gender').addEventListener('change', showPregnant);
  showPregnant();
  $('pincode').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    spot = null;
    void checkZone();
  });
  $('search').addEventListener('input', searchSoon);
  $('useLocation').addEventListener('click', useLocation);
  $('detailsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    void save();
  });
  $('detailsForm').addEventListener('input', () => tried && validate());
  $('detailsForm').addEventListener('change', () => tried && validate());
}

function prefill(p) {
  holder = p.isAccountHolder !== false;
  if (p.name && !p.name.startsWith('+')) $('name').value = p.name;
  if (p.email) $('email').value = p.email;
  if (p.gender) $('gender').value = p.gender;
  if (p.dateOfBirth) $('dob').value = String(p.dateOfBirth).slice(0, 10);
  if (p.deliverySlot) $('slot').value = p.deliverySlot;
  if (p.deliveryNote) $('note').value = p.deliveryNote;
  const answers = p.health?.answers ?? {};
  if (answers.non_veg?.option) $('meal').value = answers.non_veg.option;
  for (const id of ['diabetes', 'pregnant']) {
    const option = answers[id]?.option;
    if (option) document.querySelector(`input[name="${id}"][value="${option}"]`)?.click();
  }
  const a = p.deliveryAddress;
  if (a) {
    $('pincode').value = a.pincode ?? '';
    $('line').value = a.line ?? '';
    $('landmark').value = a.landmark ?? '';
    $('city').value = a.city ?? '';
    $('state').value = a.state ?? 'Tamil Nadu';
    $('label').value = a.label ?? 'Home';
    if (a.lat != null && a.lng != null) spot = { lat: a.lat, lng: a.lng };
    void checkZone();
  }
}

/** The pregnancy question hides for a man, and is sent as "no" then (as the app). */
function showPregnant() {
  $('pregnantGroup').hidden = $('gender').value === 'male';
}

function drawQuestions() {
  const box = $('healthQuestions');
  box.replaceChildren();
  for (const q of questions) {
    const name = `hq_${q.id}`;
    const detail = el('div', { class: 'form-group', id: `${name}_detailRow`, hidden: true });
    const options = (q.options ?? []).map((o) =>
      el(
        'label',
        {},
        el('input', {
          type: 'radio',
          name,
          value: o.id,
          checked: o.id === q.defaultOptionId,
          onchange: () => showDetail(q, o, detail),
        }),
        ` ${o.label}`,
      ),
    );
    box.append(
      el(
        'div',
        { class: 'form-group' },
        el(
          'fieldset',
          {},
          el('legend', {}, q.required ? `${q.text} *` : q.text),
          el('div', { class: 'choice-row' }, options),
        ),
        el('div', { class: 'error', id: `${name}_error` }),
      ),
      detail,
    );
    const start = q.options?.find((o) => o.id === q.defaultOptionId);
    if (start) showDetail(q, start, detail);
  }
}

function showDetail(q, option, row) {
  const f = option.followUp;
  row.hidden = !f;
  if (!f) return row.replaceChildren();
  const id = `hq_${q.id}_detail`;
  if ($(id)) return;
  row.replaceChildren(
    el('label', { for: id }, f.label ?? W.allergyDetail),
    el('input', { id, type: 'text', maxlength: 200, placeholder: f.hint ?? '' }),
    el('div', { class: 'error', id: `${id}Error` }),
  );
}

// ---- The delivery zone: the pincode first ----

async function checkZone() {
  const pin = $('pincode').value;
  const box = $('zone');
  if (pin.length !== 6) return box.replaceChildren();
  try {
    zones ??= new Set((await api('/api/delivery-zones')).pincodes ?? []);
  } catch {
    zones = null;
    return box.replaceChildren(el('div', { class: 'zone-no' }, W.zonesFailed));
  }
  if ($('pincode').value !== pin) return;
  box.replaceChildren(
    zones.has(pin)
      ? el('div', { class: 'zone-ok' }, W.weDeliver)
      : el('div', { class: 'zone-no' }, el('strong', {}, W.notHereYet), el('br'), W.notHereYetMore),
  );
}

// ---- The address search and "Use my location", through OUR /api/maps ----

let searchTimer = null;

function searchSoon() {
  clearTimeout(searchTimer);
  const query = $('search').value.trim();
  if (query.length < 3) return $('suggestions').replaceChildren();
  searchTimer = setTimeout(() => void search(query), 350);
}

async function search(query) {
  const list = $('suggestions');
  $('finderError').textContent = '';
  try {
    const r = await api('/api/maps/suggest', {
      method: 'POST',
      auth: true,
      body: { query, session: mapSession },
    });
    if ($('search').value.trim() !== query) return;
    const items = r.suggestions ?? [];
    list.hidden = false;
    list.replaceChildren(
      ...(items.length
        ? items.map((s) =>
            el(
              'li',
              {},
              el(
                'button',
                { type: 'button', onclick: () => void pick(s) },
                s.primaryText,
                s.secondaryText ? el('small', {}, s.secondaryText) : null,
              ),
            ),
          )
        : [el('li', { class: 'muted p-2' }, W.noMatches)]),
    );
  } catch (e) {
    mapsFailed(e, W.searchFailed);
  }
}

async function pick(s) {
  $('suggestions').replaceChildren();
  $('suggestions').hidden = true;
  $('search').value = s.primaryText;
  try {
    const place = await api(
      `/api/maps/places/${encodeURIComponent(s.placeId)}?session=${mapSession}`,
      { auth: true },
    );
    await fillFrom(place.latitude, place.longitude);
  } catch (e) {
    mapsFailed(e, W.geocodeFailed);
  }
}

function useLocation() {
  $('finderError').textContent = W.findingLocation;
  if (!navigator.geolocation) return ($('finderError').textContent = W.noFix);
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      void fillFrom(pos.coords.latitude, pos.coords.longitude).catch((e) =>
        mapsFailed(e, W.geocodeFailed),
      ),
    (err) => ($('finderError').textContent = err.code === 1 ? W.locationDenied : W.noFix),
    { enableHighAccuracy: true, timeout: 15_000 },
  );
}

/** The address at a point, split the app's way (address_components.dart). */
async function fillFrom(lat, lng) {
  const r = await api(`/api/maps/reverse?latitude=${lat}&longitude=${lng}`, { auth: true });
  const part = (...types) =>
    r.components?.find((c) => c.types?.some((t) => types.includes(t)))?.text ?? '';
  const house = part('street_number', 'premise', 'subpremise');
  const street = part('route');
  const area = part('sublocality_level_1', 'sublocality', 'neighborhood', 'sublocality_level_2');
  const city = part(
    'locality',
    'postal_town',
    'administrative_area_level_3',
    'administrative_area_level_2',
  );
  const state = part('administrative_area_level_1');
  const pin = (part('postal_code') || r.pincode || '').replace(/\D/g, '');
  $('line').value = [house, street, area].filter(Boolean).join(', ');
  if (city) $('city').value = city;
  if (state) $('state').value = state;
  $('pincode').value = pin.slice(0, 6);
  spot = { lat, lng };
  $('finderError').textContent = '';
  $('addressHint').textContent = W.addDoor;
  $('line').focus();
  void checkZone();
}

function mapsFailed(e, words) {
  if (e.code === 'MAPS_NOT_SET_UP' || e.code === 'MAPS_UNAVAILABLE') {
    // No search on this server (staging has no Maps key): the typed form only.
    $('finder').hidden = true;
    $('addressHint').textContent = W.mapsOff;
    return;
  }
  $('finderError').textContent =
    e.code === 'NO_ADDRESS' ? W.noAddressHere : e.status ? words : friendly(e);
}

// ---- Checking and saving ----

/** 18 or older by India's date. */
function adult(dob) {
  const ist = new Date(Date.now() + 5.5 * 3600_000);
  const [y, m, d] = dob.split('-').map(Number);
  const age =
    ist.getUTCFullYear() -
    y -
    (ist.getUTCMonth() + 1 < m || (ist.getUTCMonth() + 1 === m && ist.getUTCDate() < d) ? 1 : 0);
  return age >= 18;
}

function radio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value ?? '';
}

function validate() {
  const set = (id, text) => {
    $(id).textContent = text;
    return !text;
  };
  const email = $('email').value.trim();
  const dob = $('dob').value;
  const checks = [
    set('nameError', nameProblem($('name').value)),
    set(
      'emailError',
      !email ? W.needEmail : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : W.badEmail,
    ),
    set('genderError', $('gender').value ? '' : W.needGender),
    set('dobError', !dob ? W.needDob : holder && !adult(dob) ? W.under18 : ''),
    set('slotError', $('slot').value ? '' : W.needSlot),
    set('mealError', $('meal').value ? '' : W.needMeal),
    set('pincodeError', /^\d{6}$/.test($('pincode').value) ? '' : W.needPincode),
    set('lineError', $('line').value.trim() ? '' : W.needField),
    set('cityError', $('city').value.trim() ? '' : W.needField),
    set('stateError', $('state').value.trim() ? '' : W.needField),
  ];
  for (const q of questions) {
    const chosen = radio(`hq_${q.id}`);
    checks.push(set(`hq_${q.id}_error`, q.required && !chosen ? W.needAnswer : ''));
    const detail = $(`hq_${q.id}_detail`);
    const option = q.options?.find((o) => o.id === chosen);
    if (detail && option?.followUp?.required)
      checks.push(set(`hq_${q.id}_detailError`, detail.value.trim() ? '' : W.needDetail));
  }
  return checks.every(Boolean);
}

function payload() {
  const answers = {
    non_veg: { option: $('meal').value },
    diabetes: { option: radio('diabetes') || 'no' },
    pregnant: { option: $('gender').value === 'male' ? 'no' : radio('pregnant') || 'no' },
  };
  for (const q of questions) {
    const option = radio(`hq_${q.id}`);
    if (!option) continue;
    const detail = $(`hq_${q.id}_detail`)?.value.trim();
    answers[q.id] = detail ? { option, detail } : { option };
  }
  const address = {
    label: $('label').value.trim() || 'Home',
    line: $('line').value.trim(),
    city: $('city').value.trim(),
    state: $('state').value.trim(),
    pincode: $('pincode').value,
  };
  if ($('landmark').value.trim()) address.landmark = $('landmark').value.trim();
  if (spot) Object.assign(address, spot);
  const body = {
    name: $('name').value.trim().replace(/\s+/g, ' '),
    email: $('email').value.trim(),
    gender: $('gender').value,
    dateOfBirth: $('dob').value,
    deliverySlot: $('slot').value,
    deliveryAddress: address,
    health: { answers },
  };
  if ($('note').value.trim()) body.deliveryNote = $('note').value.trim();
  return body;
}

const FIELD_ERRORS = {
  name: 'nameError',
  email: 'emailError',
  gender: 'genderError',
  dateOfBirth: 'dobError',
  deliverySlot: 'slotError',
};

async function save() {
  tried = true;
  const box = $('formNotice');
  if (!validate()) {
    notice(box, W.fixFields);
    return box.scrollIntoView({ block: 'center' });
  }
  notice(box, '');
  const btn = $('saveBtn');
  btn.disabled = true;
  btn.textContent = W.saving;
  try {
    await api('/api/users/me/profiles/active/setup', {
      method: 'PUT',
      auth: true,
      body: payload(),
    });
    location.assign(next);
  } catch (e) {
    for (const f of e.fields ?? []) {
      const id = FIELD_ERRORS[String(f.path).split('.')[0]];
      if (id) $(id).textContent = f.message;
    }
    notice(
      box,
      e.status === 400 || e.status === 422
        ? e.message || W.saveFailed
        : e.status
          ? W.saveFailed
          : friendly(e),
    );
    box.scrollIntoView({ block: 'center' });
    btn.disabled = false;
    btn.textContent = W.continue;
  }
}
