const SESSION_KEY = 'ws_session';

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || typeof session !== 'object' || !session.username || !session.role) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function setSession(sessionObj) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));
  } catch {
    console.error('Failed to save session to localStorage');
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    console.error('Failed to clear session from localStorage');
  }
}

export function isAuthenticated() {
  return getSession() !== null;
}

export function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'admin';
}