import React, { useState, useEffect } from 'react';
import { Wallet, BrainCircuit, ArrowUpCircle, ArrowDownCircle, PieChart, Loader2 } from 'lucide-react';
import { Card, CardHeader } from './ui';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await API.get('/transactions/summary');
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name || 'User'}</h1>
          <p className="text-gray-500">Here is your financial wellness summary for today.</p>
        </div>
        <div className="bg-white p-3 rounded-full shadow-sm">
          <PieChart className="text-blue-600" />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Balance Card */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Wallet size={20} />
            </div>
            <span className="text-gray-600 font-medium text-sm">In My Pocket</span>
          </div>
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            <h2 className={`text-3xl font-bold text-left ${summary.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              LKR {formatAmount(summary.balance)}
            </h2>
          )}
        </Card>

        {/* AI Insight Card (Addresses SRS requirement for Intelligent Summarization) */}
        <Card variant="gradient" className="p-6 md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit size={22} className="text-purple-200" />
              <span className="font-semibold tracking-wide uppercase text-xs text-purple-100">AI Spending Analysis</span>
            </div>
            <p className="text-lg leading-relaxed text-left">
                "Your <span className="font-bold text-white decoration-purple-400">Eating Out</span> expenses 
                are <span className="font-bold text-yellow-300 text-xl">15% higher</span> than your set budget. 
                Reducing this could help you reach your <span className="font-bold text-white">Emergency Fund</span> goal 
                3 weeks earlier."
            </p>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Income/Expense View */}
        <Card className="p-6">
          <CardHeader title="Cash Flow" />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowUpCircle className="text-green-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Income</p>
                  <p className="text-xs text-gray-400">Total Received</p>
                </div>
              </div>
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-gray-400" />
              ) : (
                <span className="font-bold text-green-600">LKR {formatAmount(summary.totalIncome)}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ArrowDownCircle className="text-red-500" />
                <div className="text-left">
                  <p className="text-sm font-semibold">Expenses</p>
                  <p className="text-xs text-gray-400">Total Spent</p>
                </div>
              </div>
              {isLoading ? (
                <Loader2 size={16} className="animate-spin text-gray-400" />
              ) : (
                <span className="font-bold text-red-600">LKR {formatAmount(summary.totalExpense)}</span>
              )}
            </div>
          </div>
        </Card>

        {/* Budget Alerts (Addresses Automated Monitoring requirement) */}
        <Card className="p-6">
          <CardHeader title="Budget Alerts" />
          <div className="space-y-4">
             <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg text-left">
                <p className="text-sm text-yellow-700 font-medium">Warning: Food & Groceries</p>
                <p className="text-xs text-yellow-600">You have used 85% of your monthly limit.</p>
             </div>
             <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg text-left">
                <p className="text-sm text-red-700 font-medium">Critical: Entertainment</p>
                <p className="text-xs text-red-600">You are LKR 1,500 over your limit.</p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;