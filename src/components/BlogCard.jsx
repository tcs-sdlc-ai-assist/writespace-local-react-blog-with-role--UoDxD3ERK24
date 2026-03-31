import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';
import { getAvatar } from '../utils/getAvatar.jsx';

export function BlogCard({ post }) {
  const { session, isAdmin } = useSession();

  const canEdit =
    session && (isAdmin || session.username === post.authorId);

  const excerpt =
    post.content.length > 150
      ? post.content.slice(0, 150) + '...'
      : post.content;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const authorRole = post.authorId === 'admin' ? 'admin' : 'viewer';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <Link to={`/blog/${post.id}`} className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2">
              {post.title}
            </h2>
          </Link>
          {canEdit && (
            <Link
              to={`/blogs/${post.id}/edit`}
              className="ml-2 text-gray-400 hover:text-indigo-600 flex-shrink-0"
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
          )}
        </div>

        <Link to={`/blog/${post.id}`} className="mt-2 flex-1">
          <p className="text-sm text-gray-600 line-clamp-3">{excerpt}</p>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getAvatar(authorRole)}
            <span className="text-sm font-medium text-gray-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}