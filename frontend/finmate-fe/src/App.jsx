import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Component Imports
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import SharedGroups from './components/SharedGroups';
import BudgetsGoals from './components/BudgetsGoals';
import Recurring from './components/Recurring';
import Reports from './components/Reports';
import Profile from './components/Profile';
import Auth from './components/Auth';

// Protected route wrapper
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Navbar onLogout={logout} />
      <main className="flex-1 ml-64 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets-goals" element={<BudgetsGoals />} />
          <Route path="/shared" element={<SharedGroups />} />
          <Route path="/recurring" element={<Recurring />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;