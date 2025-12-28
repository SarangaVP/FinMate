import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';

// Temporary placeholder components for other pages
const Budget = () => <div className="p-8">Budget & Goals Page Coming Soon</div>;
const Shared = () => <div className="p-8">Shared Expenses Page Coming Soon</div>;
const Profile = () => <div className="p-8">Profile Management Page Coming Soon</div>;

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
            <Route path="/budget" element={<Budget />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;