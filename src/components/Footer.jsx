import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-white hover:text-indigo-400">
              WriteSpace
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              A place to share your thoughts, stories, and ideas with the world.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Navigation</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-400 hover:text-indigo-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-sm text-gray-400 hover:text-indigo-400">
                  All Blogs
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-400 hover:text-indigo-400">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-400 hover:text-indigo-400">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">About</h3>
            <p className="mt-3 text-sm text-gray-400">
              WriteSpace is a simple blogging platform built for writers who want to focus on what matters — writing.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}