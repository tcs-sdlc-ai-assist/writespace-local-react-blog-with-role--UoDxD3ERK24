import { getSession, setSession, clearSession } from '../utils/sessionManager.js';
import { getUsers, setUsers } from '../utils/storageUtils.js';

export function login(username, password) {
  try {
    if (!username || !password) {
      return { success: false, error: 'All fields required' };
    }

    // Hard-coded admin check
    if (username.toLowerCase() === 'admin' && password === 'adminpass') {
      const session = {
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
        loginAt: new Date().toISOString(),
      };
      setSession(session);
      return { success: true, session };
    }

    // Check localStorage users
    const users = getUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    const session = {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      loginAt: new Date().toISOString(),
    };
    setSession(session);
    return { success: true, session };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function register(displayName, username, password, confirmPassword) {
  try {
    if (!displayName || !username || !password || !confirmPassword) {
      return { success: false, error: 'All fields required' };
    }

    if (password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    if (username.toLowerCase() === 'admin') {
      return { success: false, error: 'Username already exists' };
    }

    const users = getUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'Username already exists' };
    }

    const user = {
      id: crypto.randomUUID(),
      displayName,
      username,
      password,
      role: 'viewer',
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    setUsers(users);

    const session = {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      loginAt: new Date().toISOString(),
    };
    setSession(session);
    return { success: true, session };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function logout() {
  clearSession();
}