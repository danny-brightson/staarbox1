import { SITE } from './config.js';
import { clearSession, getSession, setSession } from './session.js';
import { W } from './words.js';

const TIMEOUT_MS = 20_000;

export class ApiError extends Error {
  constructor(message, status = 0, payload = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
    this.code = payload && typeof payload === 'object' ? payload.code ?? '' : '';
    this.fields = payload && typeof payload === 'object' ? payload.fields ?? [] : [];
  }
}

/** One id per browser tab: the API keeps one sign-in session per device id. */
export function deviceId() {
  const key = 'staarbox.device-id';
  try {
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = globalThis.crypto?.randomUUID?.()
        ?? `web-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `web-${Date.now()}`;
  }
}

/** The words to show for an error, the app's way. */
export function friendly(error) {
  if (error instanceof ApiError) {
    if (error.code === 'OFFLINE') return W.offline;
    if (error.code === 'TIMEOUT' || error.name === 'AbortError') return W.timeout;
    if (error.status === 429) return error.message || W.tooMany;
    if (error.status >= 500) return W.serverError;
    if (error.status === 401) return W.sessionExpired;
    return error.message || W.wrong;
  }
  if (!navigator.onLine) return W.offline;
  if (error?.name === 'AbortError') return W.timeout;
  return W.wrong;
}

/** Back to sign-in, then back here. Only the page's path goes in the address. */
export function toSignIn() {
  const next = location.pathname + location.search;
  location.assign(`/login/?next=${encodeURIComponent(next)}`);
}

async function send(
  path,
  { method = 'GET', body, auth = true, device = true, token, signal } = {},
) {
  if (!SITE) throw new ApiError(W.wrong, 0);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const headers = { Accept: 'application/json', 'X-Platform': 'web' };
  if (device) headers['X-Device-Id'] = deviceId();
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const session = getSession();
  const authToken = token || session?.accessToken;
  if (auth && authToken) headers.Authorization = `Bearer ${authToken}`;

  try {
    const response = await fetch(`${SITE.api}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    if (!response.ok) {
      const message = typeof data === 'object' && data
        ? (data.message || data.error || W.wrong)
        : (typeof data === 'string' ? data : W.wrong);
      throw new ApiError(message, response.status, data);
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      controller.signal.aborted ? W.timeout : friendly(error),
      0,
      { code: controller.signal.aborted ? 'TIMEOUT' : 'OFFLINE', cause: error },
    );
  } finally {
    clearTimeout(timeout);
  }
}

let refreshing = null;

function expiresSoon(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(part)).exp * 1000 - Date.now() < 60_000;
  } catch {
    return false;
  }
}

async function refreshSession(session) {
  const result = await send('/api/auth/refresh', {
    method: 'POST',
    auth: false,
    device: false,
    body: { refreshToken: session.refreshToken },
  });
  const next = {
    ...session,
    ...result,
    accessToken: result.token || result.accessToken || session.accessToken,
  };
  setSession(next);
  return next.accessToken || null;
}

async function freshToken(redirect, forceRefresh = false) {
  const session = getSession();
  if (!session?.accessToken) return null;
  if (!session.refreshToken) return forceRefresh ? null : session.accessToken;
  if (!forceRefresh && !expiresSoon(session.accessToken)) return session.accessToken;

  refreshing ??= refreshSession(session).finally(() => {
    refreshing = null;
  });

  try {
    return await refreshing;
  } catch (error) {
    if (error.status === 400 || error.status === 401) {
      clearSession();
      if (redirect) toSignIn();
    }
    throw error;
  }
}

/**
 * `auth: true` sends the saved token and refreshes it when needed or after a 401.
 * Defaults retain the shared client's existing behavior; callers can opt out
 * of device headers or redirects for public API requests.
 */
export async function api(
  path,
  { method = 'GET', body, auth = false, device = true, redirect = false } = {},
) {
  const token = auth ? await freshToken(redirect) : null;
  if (auth && !token) {
    if (redirect) toSignIn();
    throw new ApiError(W.sessionExpired, 401, { code: 'UNAUTHORIZED' });
  }

  try {
    return await send(path, { method, body, auth, device, token });
  } catch (error) {
    if (!auth || error.status !== 401) throw error;

    const refreshedToken = await freshToken(redirect, true);
    if (!refreshedToken) {
      clearSession();
      if (redirect) toSignIn();
      throw error;
    }

    try {
      return await send(path, { method, body, auth, device, token: refreshedToken });
    } catch (retryError) {
      if (retryError.status === 401) {
        clearSession();
        if (redirect) toSignIn();
      }
      throw retryError;
    }
  }
}
