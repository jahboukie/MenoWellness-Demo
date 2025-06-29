import React from 'react';
import { Outlet, Navigate } from 'react-router-dom'; // THIS IS THE FIX
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><p className="text-xl font-semibold text-white">Loading...</p></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <nav className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white">Metiscore Health</span>
            </div>
            <div className="flex items-center">
              <p className="text-gray-300 mr-4 hidden sm:block">
                Welcome, {user.displayName || 'User'}!
              </p>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* The Outlet component now works because it has been imported */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
