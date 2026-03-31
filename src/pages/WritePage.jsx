import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { getPostById, createPost, updatePost } from '../services/blogManager.js';

export function WritePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, isAdmin } = useSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditMode);

  const MAX_CONTENT_LENGTH = 5000;

  useEffect(() => {
    if (!isEditMode) return;

    try {
      const post = getPostById(id);

      if (!post) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      // Ownership check: viewers can only edit own posts; admin can edit any
      if (!isAdmin && session.username !== post.authorId) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    } catch {
      setError('Failed to load post');
      setLoading(false);
    }
  }, [id, isEditMode, isAdmin, session, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (content.length > MAX_CONTENT_LENGTH) {
      setError('Content exceeds max length');
      return;
    }

    if (isEditMode) {
      const result = updatePost(id, title.trim(), content.trim());

      if (result.success) {
        navigate(`/blog/${id}`, { replace: true });
      } else {
        setError(result.error);
      }
    } else {
      const result = createPost(title.trim(), content.trim(), session);

      if (result.success) {
        navigate(`/blog/${result.post.id}`, { replace: true });
      } else {
        setError(result.error);
      }
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Post' : 'Write a New Post'}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {isEditMode
                ? 'Update your post below.'
                : 'Share your thoughts, stories, and ideas with the world.'}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading post...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              {error && (
                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter your post title"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                    placeholder="Write your content here..."
                  />
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-xs ${
                        content.length > MAX_CONTENT_LENGTH
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {content.length} / {MAX_CONTENT_LENGTH}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:border-indigo-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isEditMode ? 'Update Post' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}