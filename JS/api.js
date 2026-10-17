// Calls to OUR API (config.js chooses which). The tokens come from session.js;
// any 401 clears them and goes back to sign-in (8L §4).
import { SITE } from './config.js';
import { clearSession, getSession, setSession } from './session.js';
import { W } from './words.js';

const TIMEOUT_MS = 20_000; // the app's timeout

export class ApiError extends Error {
  constructor(status, code, message, fields = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

/** One id per browser tab: the API keeps one sign-in session per device id. */
export function deviceId() {
  let id = sessionStorage.getItem('staarbox.device');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('staarbox.device', id);
  }
  return id;
}

/** The words to show for an error, the app's way. */
export function friendly(error) {
  if (!(error instanceof ApiError)) return W.wrong;
  if (error.code === 'OFFLINE') return W.offline;
  if (error.code === 'TIMEOUT') return W.timeout;
  if (error.status === 429) return error.message || W.tooMany;
  if (error.status >= 500) return W.serverError;
  if (error.status === 401) return W.sessionExpired;
  return error.message || W.wrong;
}

/** Back to sign-in, then back here. Only the page's path goes in the address. */
export function toSignIn() {
  const next = location.pathname + location.search;
  location.assign(`/login/?next=${encodeURIComponent(next)}`);
}

async function send(path, { method = 'GET', body, token, device = false } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  if (token || device) headers['X-Platform'] = 'web';
  if (device) headers['X-Device-Id'] = deviceId();
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(SITE.api + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: abort.signal,
      credentials: 'omit',
      cache: 'no-store',
    });
  } catch {
    throw abort.signal.aborted
      ? new ApiError(0, 'TIMEOUT', W.timeout)
      : new ApiError(0, 'OFFLINE', W.offline);
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok)
    throw new ApiError(res.status, data.code ?? '', data.message ?? '', data.fields ?? []);
  return data;
}

// The access token lives 15 minutes. It is renewed shortly before it ends,
// by one refresh at a time: reusing a refresh token ends the session.
let refreshing = null;

function expiresSoon(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(part)).exp * 1000 - Date.now() < 60_000;
  } catch {
    return false;
  }
}

async function freshToken(redirect) {
  const s = getSession();
  if (!s) return null;
  if (!expiresSoon(s.accessToken)) return s.accessToken;
  refreshing ??= send('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken: s.refreshToken },
  })
    .then((r) => {
      setSession({ ...s, accessToken: r.token, refreshToken: r.refreshToken });
      return r.token;
    })
    .finally(() => {
      refreshing = null;
    });
  try {
    return await refreshing;
  } catch (e) {
    if (e.status === 400 || e.status === 401) {
      clearSession();
      if (redirect) toSignIn();
    }
    throw e;
  }
}

/**
 * A call to the API. `auth: true` sends the session's token; a 401 then
 * clears the session and goes to sign-in (`redirect: false`: it only clears
 * it, for a page that works signed out too). `device: true` sends X-Device-Id.
 */
export async function api(
  path,
  { method, body, auth = false, device = false, redirect = true } = {},
) {
  const token = auth ? await freshToken(redirect) : null;
  if (auth && !token) {
    if (redirect) toSignIn();
    throw new ApiError(401, 'UNAUTHORIZED', W.sessionExpired);
  }
  try {
    return await send(path, { method, body, token, device });
  } catch (e) {
    if (auth && e.status === 401) {
      clearSession();
      if (redirect) toSignIn();
    }
    throw e;
  }
}
