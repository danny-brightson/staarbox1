// The sign-in session. It lives in sessionStorage only, so it goes when the tab
// closes. It is never put in localStorage or in a URL (8L §4).
const KEY = 'staarbox.session';

export function getSession() {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    return s && typeof s.accessToken === 'string' ? s : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  sessionStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Storage is blocked: there is nothing to clear.
  }
}
