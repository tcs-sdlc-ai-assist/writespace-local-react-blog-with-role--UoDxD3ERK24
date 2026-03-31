const USERS_KEY = 'ws_users';
const POSTS_KEY = 'ws_posts';

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const users = JSON.parse(raw);
    if (!Array.isArray(users)) return [];
    return users;
  } catch {
    return [];
  }
}

export function setUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    console.error('Failed to save users to localStorage');
  }
}

export function getPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return [];
    const posts = JSON.parse(raw);
    if (!Array.isArray(posts)) return [];
    return posts;
  } catch {
    return [];
  }
}

export function setPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    console.error('Failed to save posts to localStorage');
  }
}