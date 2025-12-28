import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';

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
            {/* <Route path="/budget" element={<Budget />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/profile" element={<Profile />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;