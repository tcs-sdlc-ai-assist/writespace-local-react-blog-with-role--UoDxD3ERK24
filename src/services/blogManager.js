import { getPosts, setPosts } from '../utils/storageUtils.js';

export function getAllPosts() {
  try {
    const posts = getPosts();
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch {
    return [];
  }
}

export function getPostById(id) {
  try {
    if (!id) return null;
    const posts = getPosts();
    return posts.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
}

export function createPost(title, content, session) {
  try {
    if (!title || !content) {
      return { success: false, error: 'Title and content required' };
    }

    if (content.length > 5000) {
      return { success: false, error: 'Content exceeds max length' };
    }

    if (!session || !session.username) {
      return { success: false, error: 'You must be logged in to create a post' };
    }

    const post = {
      id: crypto.randomUUID(),
      title,
      content,
      authorId: session.username,
      authorName: session.displayName || session.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const posts = getPosts();
    posts.push(post);
    setPosts(posts);

    return { success: true, post };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function updatePost(id, title, content) {
  try {
    if (!id || !title || !content) {
      return { success: false, error: 'Title and content required' };
    }

    if (content.length > 5000) {
      return { success: false, error: 'Content exceeds max length' };
    }

    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return { success: false, error: 'Post not found' };
    }

    posts[index] = {
      ...posts[index],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };

    setPosts(posts);
    return { success: true, post: posts[index] };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function deletePost(id) {
  try {
    if (!id) {
      return { success: false, error: 'Post ID required' };
    }

    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return { success: false, error: 'Post not found' };
    }

    const updated = posts.filter((p) => p.id !== id);
    setPosts(updated);

    return { success: true };
  } catch {
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function getRecentPosts(count) {
  try {
    const posts = getAllPosts();
    return posts.slice(0, count);
  } catch {
    return [];
  }
}