import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <Navbar />

      {/* Main content area - adjust margin for responsiveness */}
      <div className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all">
        {/* This Outlet renders the matched child route's element */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;