import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import SharedGroups from './components/SharedGroups';
import BudgetsGoals from './components/BudgetsGoals';

function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen">
        {/* Sidebar Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 ml-64 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets-goals" element={<BudgetsGoals />} />
            <Route path="/shared" element={<SharedGroups />} />
            {/* <Route path="/profile" element={<Profile />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;