import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { user, signInWithGoogle, loading } = useAuth();

  // If we are still checking for a user, show a loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  // If the user is already logged in, redirect them to the home page
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">MenoWellness Demo</h1>
        <p className="text-gray-600 mb-8">Welcome! Please sign in to continue.</p>
        
        {/* Simplified and Improved Google Sign-In Button */}
        <button
          onClick={signInWithGoogle}
          className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center w-full"
        >
          {/* A cleaner, simpler SVG for the Google 'G' */}
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.659-0.297-5.221-0.857-7.617L43.611 20.083z"></path>
            <path fill="#34A853" d="M24 48c5.268 0 10.046-2.053 13.599-5.401l-5.657-5.657c-1.856 1.406-4.286 2.231-6.942 2.231-4.482 0-8.324-2.736-9.824-6.571l-5.657 5.657C6.075 41.264 14.28 48 24 48z"></path>
            <path fill="#FBBC05" d="M4.555 29.282l5.657-5.657C9.524 19.926 9 17.025 9 14s0.524-5.926 1.212-8.625l-5.657-5.657C2.146 6.049 1 10.877 1 14s1.146 7.951 2.555 11.282z"></path>
            <path fill="#EA4335" d="M24 9c3.787 0 7.025 1.666 9.143 3.788l4.286-4.286C33.025 2.522 28.79 1 24 1 14.28 1 6.075 6.736 2.555 14l5.657 5.657C9.676 11.736 14.518 9 24 9z"></path>
          </svg>
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
