'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '', userId: null });
  const [users, setUsers] = useState([]);

  // Fetch existing users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '', userId: null });

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: `User "${data.user.username}" created successfully!`,
          userId: data.user.id
        });
        setFormData({ username: '', email: '' });
        fetchUsers(); // Refresh user list
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create user', userId: null });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred', userId: null });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <Image
            className="dark:invert mx-auto mb-4"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            IdeaGenine User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create and manage users for the market research platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Creation Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New User
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter email address"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.username.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </button>
            </form>

            {/* Message Display */}
            {message.text && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                <div className="font-medium">{message.text}</div>
                {message.userId && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-300 rounded text-sm">
                    <strong>User ID:</strong> 
                    <code className="ml-2 bg-white px-2 py-1 rounded border text-green-800 font-mono">
                      {message.userId}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(message.userId)}
                      className="ml-2 text-green-600 hover:text-green-800 underline text-xs"
                      title="Copy to clipboard"
                    >
                      Copy ID
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Users List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Users ({users.length})
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No users found. Create your first user!
                </p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {user.username}
                        </h3>
                        {user.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Joined: {new Date(user.joinedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">ID:</span>
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200">
                            {user.id}
                          </code>
                          <button
                            onClick={() => navigator.clipboard.writeText(user.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                            title="Copy user ID"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <a
              href="/api/users"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-solid border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center font-medium text-sm h-10 px-4"
            >
              View Users API
            </a>
            <a
              href="/api/start-pipeline"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-solid border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center font-medium text-sm h-10 px-4"
            >
              Pipeline API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
