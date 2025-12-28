import React from 'react';
import { Wallet, BrainCircuit, ArrowUpCircle, ArrowDownCircle, PieChart } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hello, Saranga</h1>
          <p className="text-gray-500">Here is your financial wellness summary for today.</p>
        </div>
        <div className="bg-white p-3 rounded-full shadow-sm">
          <PieChart className="text-blue-600" />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Wallet size={20} />
            </div>
            <span className="text-gray-600 font-medium text-sm">In My Pocket</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">LKR 45,250.00</h2>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <span className="text-green-500 flex items-center">↑ 4.5%</span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>

        {/* AI Insight Card (Addresses SRS requirement for Intelligent Summarization) */}
        <div className="bg-linear-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit size={22} className="text-purple-200" />
              <span className="font-semibold tracking-wide uppercase text-xs text-purple-100">AI Spending Analysis</span>
            </div>
            <p className="text-lg leading-relaxed">
                "Your <span className="font-bold text-white decoration-purple-400">Eating Out</span> expenses 
                are <span className="font-bold text-yellow-300 text-xl">15% higher</span> than your set budget. 
                Reducing this could help you reach your <span className="font-bold text-white">Emergency Fund</span> goal 
                3 weeks earlier."
            </p>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Income/Expense View */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-bold mb-6">Cash Flow</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowUpCircle className="text-green-500" />
                <div>
                  <p className="text-sm font-semibold">Income</p>
                  <p className="text-xs text-gray-400">Monthly Salary</p>
                </div>
              </div>
              <span className="font-bold text-green-600">LKR 120,000</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowDownCircle className="text-red-500" />
                <div>
                  <p className="text-sm font-semibold">Expenses</p>
                  <p className="text-xs text-gray-400">Fixed & Variable</p>
                </div>
              </div>
              <span className="font-bold text-red-600">LKR 74,750</span>
            </div>
          </div>
        </div>

        {/* Budget Alerts (Addresses Automated Monitoring requirement) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-800 font-bold mb-4">Budget Alerts</h3>
          <div className="space-y-4">
             <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="text-sm text-yellow-700 font-medium">Warning: Food & Groceries</p>
                <p className="text-xs text-yellow-600">You have used 85% of your monthly limit.</p>
             </div>
             <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <p className="text-sm text-red-700 font-medium">Critical: Entertainment</p>
                <p className="text-xs text-red-600">You are LKR 1,500 over your limit.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;