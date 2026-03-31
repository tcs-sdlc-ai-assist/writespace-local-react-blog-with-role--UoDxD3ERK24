import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { getAllPosts, getRecentPosts, deletePost } from '../services/blogManager.js';
import { getAllUsers } from '../services/userManager.js';
import { getAvatar } from '../utils/getAvatar.jsx';

export function AdminDashboard() {
  const { session, isAdmin } = useSession();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    adminCount: 0,
    viewerCount: 0,
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/blogs', { replace: true });
      return;
    }

    loadDashboardData();
  }, [isAdmin, navigate]);

  function loadDashboardData() {
    try {
      const posts = getAllPosts();
      const users = getAllUsers();
      const recent = getRecentPosts(5);

      const adminCount = users.filter((u) => u.role === 'admin').length;
      const viewerCount = users.filter((u) => u.role === 'viewer').length;

      setStats({
        totalPosts: posts.length,
        totalUsers: users.length,
        adminCount,
        viewerCount,
      });
      setRecentPosts(recent);
    } catch {
      setStats({ totalPosts: 0, totalUsers: 0, adminCount: 0, viewerCount: 0 });
      setRecentPosts([]);
    }
  }

  function handleDelete(id) {
    setDeleteTargetId(id);
    setShowConfirm(true);
  }

  function confirmDelete() {
    const result = deletePost(deleteTargetId);

    if (result.success) {
      setShowConfirm(false);
      setDeleteTargetId(null);
      setError('');
      loadDashboardData();
    } else {
      setError(result.error);
      setShowConfirm(false);
      setDeleteTargetId(null);
    }
  }

  function cancelDelete() {
    setShowConfirm(false);
    setDeleteTargetId(null);
  }

  const statCards = [
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      bg: 'bg-indigo-50',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bg: 'bg-green-50',
    },
    {
      label: 'Admins',
      value: stats.adminCount,
      icon: (
        <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: 'bg-violet-50',
    },
    {
      label: 'Viewers',
      value: stats.viewerCount,
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        {/* Gradient Banner */}
        <section className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session ? session.displayName : 'Admin'}!
            </h1>
            <p className="mt-2 text-lg text-indigo-100">
              Here's an overview of your WriteSpace platform.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`${card.bg} rounded-lg p-3`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/blogs/new"
                className="inline-flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Write Post
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 hover:text-indigo-600 hover:border-indigo-300 px-6 py-3 rounded-md text-sm font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Posts</h2>
            {recentPosts.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {recentPosts.map((post) => {
                    const authorRole = post.authorId === 'admin' ? 'admin' : 'viewer';
                    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div key={post.id} className="p-5 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/blog/${post.id}`}
                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 truncate block"
                          >
                            {post.title}
                          </Link>
                          <div className="mt-1 flex items-center space-x-2">
                            {getAvatar(authorRole)}
                            <span className="text-xs text-gray-500">{post.authorName}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-400">{formattedDate}</span>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2 flex-shrink-0">
                          <Link
                            to={`/blogs/${post.id}/edit`}
                            className="text-gray-400 hover:text-indigo-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share your story!
                </p>
                <Link
                  to="/blogs/new"
                  className="mt-4 inline-block bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Post
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="mt-4 flex items-center justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-indigo-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}