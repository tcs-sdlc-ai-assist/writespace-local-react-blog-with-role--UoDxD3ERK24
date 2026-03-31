import { useState, useEffect } from 'react';
import { useSession } from '../context/SessionContext.jsx';
import { Navbar } from '../components/Navbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { getAllUsers, createUser, deleteUser } from '../services/userManager.js';
import { getAvatar } from '../utils/getAvatar.jsx';

export function UserManagementPage() {
  const { session } = useSession();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    try {
      const allUsers = getAllUsers();
      setUsers(allUsers);
    } catch {
      setUsers([]);
    }
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');

    if (!displayName.trim() || !username.trim() || !password || !confirmPassword) {
      setFormError('All fields required');
      return;
    }

    if (password.length < 6) {
      setFormError('Password too short');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    const result = createUser(displayName.trim(), username.trim(), password, role);

    if (result.success) {
      setDisplayName('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('viewer');
      setFormError('');
      loadUsers();
    } else {
      setFormError(result.error);
    }
  }

  function handleDelete(id) {
    setDeleteTargetId(id);
    setShowConfirm(true);
  }

  function confirmDeleteUser() {
    const result = deleteUser(deleteTargetId, session ? session.username : null);

    if (result.success) {
      setShowConfirm(false);
      setDeleteTargetId(null);
      setError('');
      loadUsers();
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

  function isHardcodedAdmin(user) {
    return user.username.toLowerCase() === 'admin';
  }

  function isSelf(user) {
    return session && session.username.toLowerCase() === user.username.toLowerCase();
  }

  function getDeleteTooltip(user) {
    if (isHardcodedAdmin(user)) {
      return 'Cannot delete admin user';
    }
    if (isSelf(user)) {
      return 'Cannot delete yourself';
    }
    return 'Delete user';
  }

  // Build combined user list including hard-coded admin
  const allDisplayUsers = [
    {
      id: 'admin-hardcoded',
      displayName: 'Admin',
      username: 'admin',
      role: 'admin',
      createdAt: null,
    },
    ...users,
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Manage all users on the WriteSpace platform.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>

            {formError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Enter display name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Choose a username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>

          {/* Users Table (Desktop) */}
          <div className="hidden md:block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allDisplayUsers.map((user) => {
                    const formattedDate = user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '—';

                    const deleteDisabled = isHardcodedAdmin(user) || isSelf(user);

                    return (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {getAvatar(user.role)}
                            <span className="text-sm font-medium text-gray-900">
                              {user.displayName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{user.username}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-violet-100 text-violet-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs text-gray-400">{formattedDate}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="relative group inline-block">
                            <button
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteDisabled}
                              className={`${
                                deleteDisabled
                                  ? 'text-gray-300 cursor-not-allowed'
                                  : 'text-gray-400 hover:text-red-600'
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
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
                            {deleteDisabled && (
                              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                                <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                  {getDeleteTooltip(user)}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Users Cards (Mobile) */}
          <div className="md:hidden space-y-4">
            {allDisplayUsers.map((user) => {
              const formattedDate = user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '—';

              const deleteDisabled = isHardcodedAdmin(user) || isSelf(user);

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getAvatar(user.role)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                    <div className="relative group">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteDisabled}
                        className={`${
                          deleteDisabled
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
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
                      {deleteDisabled && (
                        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                          <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            {getDeleteTooltip(user)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-violet-100 text-violet-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">{formattedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {allDisplayUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No users found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete User
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be
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
                onClick={confirmDeleteUser}
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