import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { getPostById, deletePost } from '../services/blogManager.js';
import { getAvatar } from '../utils/getAvatar.jsx';

export function ReadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, isAdmin } = useSession();

  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      if (!id) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      const found = getPostById(id);

      if (!found) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      setPost(found);
      setLoading(false);
    } catch {
      setError('Failed to load post');
      setLoading(false);
    }
  }, [id]);

  const canEditOrDelete =
    session && post && (isAdmin || session.username === post.authorId);

  const authorRole = post && post.authorId === 'admin' ? 'admin' : 'viewer';

  const formattedDate = post
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  const updatedDate =
    post && post.updatedAt && post.updatedAt !== post.createdAt
      ? new Date(post.updatedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '';

  function handleDelete() {
    setShowConfirm(true);
  }

  function confirmDelete() {
    const result = deletePost(id);

    if (result.success) {
      navigate('/blogs', { replace: true });
    } else {
      setError(result.error);
      setShowConfirm(false);
    }
  }

  function cancelDelete() {
    setShowConfirm(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading post...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 inline-block">
                <p className="text-sm text-red-600">{error}</p>
              </div>
              <div className="mt-4">
                <Link
                  to="/blogs"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  &larr; Back to All Blogs
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {/* Title and Actions */}
              <div className="flex items-start justify-between">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">
                  {post.title}
                </h1>
                {canEditOrDelete && (
                  <div className="ml-4 flex items-center space-x-2 flex-shrink-0">
                    <Link
                      to={`/blogs/${post.id}/edit`}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Author and Date */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getAvatar(authorRole)}
                  <span className="text-sm font-medium text-gray-700">
                    {post.authorName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">{formattedDate}</span>
                  {updatedDate && (
                    <span className="text-xs text-gray-400 ml-2">
                      (Updated {updatedDate})
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="my-6 border-gray-200" />

              {/* Content */}
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {post.content}
              </div>

              {/* Back Link */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  to="/blogs"
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  &larr; Back to All Blogs
                </Link>
              </div>
            </div>
          )}
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