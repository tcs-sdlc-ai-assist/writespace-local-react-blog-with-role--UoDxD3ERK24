import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getRecentPosts } from '../services/blogManager.js';

export function LandingPage() {
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    try {
      const posts = getRecentPosts(3);
      setRecentPosts(posts);
    } catch {
      setRecentPosts([]);
    }
  }, []);

  const features = [
    {
      title: 'Write',
      description: 'Express your thoughts with a clean, distraction-free writing experience. Focus on what matters — your words.',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      title: 'Share',
      description: 'Publish your stories and ideas with the world. Connect with readers who appreciate great content.',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      ),
    },
    {
      title: 'Manage',
      description: 'Organize and manage your blog posts with ease. Edit, update, or remove content anytime you want.',
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            WriteSpace
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            A place to share your thoughts, stories, and ideas with the world. Start writing today and let your voice be heard.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-md text-sm font-semibold shadow-sm w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-md text-sm font-semibold w-full sm:w-auto"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to blog
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              WriteSpace gives you the tools to create, share, and manage your content effortlessly.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Check out what our community has been writing about.
            </p>
          </div>
          <div className="mt-12">
            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share your story!
                </p>
                <Link
                  to="/register"
                  className="mt-4 inline-block bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}