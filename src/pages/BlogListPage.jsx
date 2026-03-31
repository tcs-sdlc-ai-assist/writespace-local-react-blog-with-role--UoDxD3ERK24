import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getAllPosts } from '../services/blogManager.js';

export function BlogListPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      const allPosts = getAllPosts();
      setPosts(allPosts);
    } catch {
      setPosts([]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore all the stories and ideas shared by our community.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
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

      <Footer />
    </div>
  );
}