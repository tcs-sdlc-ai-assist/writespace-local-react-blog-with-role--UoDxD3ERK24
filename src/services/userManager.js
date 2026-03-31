import { getUsers, setUsers } from '../utils/storageUtils.js';

export function getAllUsers() {
  try {
    return getUsers();
  } catch {
    return [];
  }
}

export function getUserById(id) {
  try {
    if (!id) return null;
    const users = getUsers();
    return users.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
}

export function createUser(displayName, username, password, role) {
  try {
    if (!displayName || !username || !password || !role) {
      return { success: false, error: 'All fields required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password too short' };
    }

    if (!isUsernameUnique(username)) {
      return { success: false, error: 'Username already exists' };
    }

    const user = {
      id: crypto.randomUUID(),
      displayName,
      username,
      password,
      role,
      createdAt: new Date().toISOString(),
    };

    const users = getUsers();
    users.push(user);
    setUsers(users);

    return { success: true, user };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function deleteUser(id, requesterId) {
  try {
    if (!id) {
      return { success: false, error: 'User ID required' };
    }

    if (id === requesterId) {
      return { success: false, error: 'Cannot delete yourself' };
    }

    const users = getUsers();
    const user = users.find((u) => u.id === id);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (user.username.toLowerCase() === 'admin') {
      return { success: false, error: 'Cannot delete admin user' };
    }

    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function isUsernameUnique(username) {
  try {
    if (!username) return false;

    if (username.toLowerCase() === 'admin') {
      return false;
    }

    const users = getUsers();
    return !users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  } catch {
    return false;
  }
}