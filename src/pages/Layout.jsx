import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, loading, logout } = useAuth();

  // While checking auth state, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  // If not loading and no user, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If a user is logged in, show the main layout
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-gray-800">MenoWellness</span>
            </div>
            <div className="flex items-center">
              <p className="text-gray-600 mr-4">
                Welcome, {user.displayName || 'User'}!
              </p>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* The Outlet component renders the current route's page (e.g., HomePage) */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
