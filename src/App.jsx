import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AcceptInvitePage from './pages/AcceptInvitePage'; // Import new page
import PartnerDashboardPage from './pages/PartnerDashboardPage'; // Import new page
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* The Layout is the parent for all protected pages */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        
        {/* Add the new protected routes for the partner flow */}
        <Route path="accept-invite" element={<AcceptInvitePage />} />
        <Route path="partner-dashboard" element={<PartnerDashboardPage />} />
      </Route>

      {/* The login page remains a separate, public route */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
