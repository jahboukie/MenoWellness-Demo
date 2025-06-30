import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, loading, logout } = useAuth();

  // ✨ Use the new gradient for the loading screen for a seamless experience
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
        <p className="text-xl font-semibold text-white">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    // ✨ Set the main app background to our new gradient
    <div className="min-h-screen w-full bg-gradient-to-br from-teal-400 to-blue-500">
      {/* ✨ Modern, semi-transparent "glassmorphism" navbar */}
      <nav className="bg-white/30 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>
                Metiscore Health
              </span>
            </div>
            <div className="flex items-center">
              <p className="text-white/90 mr-4 hidden sm:block">
                Welcome, {user.displayName || 'User'}!
              </p>
              {/* ✨ Styled the logout button to be more subtle and fit the theme */}
              <button
                onClick={logout}
                className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* The max-width container is kept to constrain the content nicely */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
