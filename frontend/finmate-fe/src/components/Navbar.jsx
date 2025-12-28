import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  CalendarClock, 
  Target, 
  Users, 
  BarChart3, 
  UserCircle, 
  LogOut, 
  Wallet,
  Search
} from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { 
      name: 'Recurring', 
      path: '/recurring', 
      icon: <CalendarClock size={20} />, 
      alert: '3 Due' // Visual indicator for Automated Monitoring
    },
    { name: 'Budgets & Goals', path: '/budget', icon: <Target size={20} /> },
    { name: 'Shared Groups', path: '/shared', icon: <Users size={20} /> },
    { name: 'Reports & AI', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Profile', path: '/profile', icon: <UserCircle size={20} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      
      {/* 1. Branding Section */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight italic">FinMate</span>
        </div>

        {/* Search Bar - Addresses GUI Requirement for easy navigation */}
        <div className="relative group">
          <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500" size={16} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* 2. Navigation Menu */}
      <div className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-100' 
                : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            {item.alert && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                // Dynamic styling for alerts
                'bg-amber-100 text-amber-600 group-hover:bg-white group-hover:text-blue-600'
              }`}>
                {item.alert}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* 3. Footer: Balance & User Section */}
      <div className="p-4 border-t border-gray-100 space-y-4">
        {/* Mini Balance Widget - "In My Pocket" Feature */}
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">In My Pocket</p>
          <p className="text-sm font-bold text-gray-800">LKR 45,250.00</p>
        </div>

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            SM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">Saranga Malshan</p>
            <p className="text-[10px] text-green-600 font-medium">Member</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;