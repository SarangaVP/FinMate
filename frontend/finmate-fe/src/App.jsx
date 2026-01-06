import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

function App() {
  // Set this to 'true' to bypass login during development/screenshots
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple function to simulate logging in
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  // If user is not authenticated, show the Auth (Login/Signup) page only
  if (!isAuthenticated) {
    return <Auth onLogin={login} />;
  }

  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen font-sans">
        
        {/* Sidebar Navigation - Stays fixed on the left */}
        <Navbar onLogout={logout} />

        {/* Main Content Area - Shifted to the right to make room for Navbar */}
        <main className="flex-1 ml-64 overflow-y-auto">
          <Routes>
            {/* Core Dashboard & AI Insights */}
            <Route path="/" element={<Dashboard />} />
            
            {/* Transaction Management & AI Categorization */}
            <Route path="/transactions" element={<Transactions />} />
            
            {/* Budgets & Saving Goals */}
            <Route path="/budgets-goals" element={<BudgetsGoals />} />
            
            {/* Shared Expenses & Group Settlements */}
            <Route path="/shared" element={<SharedGroups />} />
            
            {/* Recurring Payments & Subscriptions */}
            <Route path="/recurring" element={<Recurring />} />
            
            {/* AI Reports & Analytics */}
            <Route path="/reports" element={<Reports />} />
            
            {/* Profile & Security Settings */}
            <Route path="/profile" element={<Profile />} />

            {/* Catch-all: Redirect any unknown routes to Dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;