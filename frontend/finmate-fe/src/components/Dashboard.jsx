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
  const [insights, setInsights] = useState({
    topCategory: 'N/A',
    topCategorySpend: 0,
    mostExpensiveDay: 'N/A'
  });
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    const handleTransactionsUpdated = () => {
      fetchDashboardData();
    };

    window.addEventListener('transactions:updated', handleTransactionsUpdated);

    return () => {
      window.removeEventListener('transactions:updated', handleTransactionsUpdated);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryResponse, budgetsResponse, analyticsResponse] = await Promise.allSettled([
        API.get('/transactions/summary'),
        API.get('/planning/budgets'),
        API.get('/reports/analytics?months=6')
      ]);

      if (summaryResponse.status === 'fulfilled') {
        setSummary(summaryResponse.value.data || { totalIncome: 0, totalExpense: 0, balance: 0 });
      }

      if (budgetsResponse.status === 'fulfilled') {
        setBudgets(budgetsResponse.value.data || []);
      }

      if (analyticsResponse.status === 'fulfilled') {
        setInsights(analyticsResponse.value.data?.insights || {
          topCategory: 'N/A',
          topCategorySpend: 0,
          mostExpensiveDay: 'N/A'
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const budgetAlerts = budgets
    .map((budget) => {
      const spendingLimit = Number(budget.spendingLimit || 0);
      const currentSpending = Number(budget.currentSpending || 0);
      const usagePercent = spendingLimit > 0 ? (currentSpending / spendingLimit) * 100 : 0;
      const overAmount = Math.max(0, currentSpending - spendingLimit);

      if (usagePercent >= 100) {
        return {
          id: budget._id,
          level: 'critical',
          category: budget.category,
          usagePercent,
          overAmount
        };
      }

      if (usagePercent >= 75) {
        return {
          id: budget._id,
          level: 'warning',
          category: budget.category,
          usagePercent,
          overAmount: 0
        };
      }

      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b.usagePercent - a.usagePercent)
    .slice(0, 3);

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

        {/* AI Insight Card */}
        <Card variant="gradient" className="p-6 md:col-span-2 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit size={22} className="text-purple-200" />
              <span className="font-semibold tracking-wide uppercase text-xs text-purple-100">Spending Analysis</span>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 text-purple-100">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Loading insights...</span>
              </div>
            ) : (
              <div className="space-y-1 text-left">
                <p className="text-lg leading-relaxed">
                  Top spending category: <span className="font-bold text-white">{insights.topCategory || 'N/A'}</span>
                </p>
                <p className="text-sm text-purple-100">
                  Spent: <span className="font-bold text-yellow-300">LKR {formatAmount(insights.topCategorySpend)}</span>
                </p>
                <p className="text-sm text-purple-100">
                  Most expensive day: <span className="font-bold text-white">{insights.mostExpensiveDay || 'N/A'}</span>
                </p>
              </div>
            )}
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

        {/* Budget Alerts */}
        <Card className="p-6">
          <CardHeader title="Budget Alerts" />
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading alerts...</span>
            </div>
          ) : budgetAlerts.length === 0 ? (
            <p className="text-sm text-gray-500 text-left">No warnings right now. Your budget usage looks healthy.</p>
          ) : (
            <div className="space-y-4">
              {budgetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 rounded-r-lg text-left ${
                    alert.level === 'critical'
                      ? 'bg-red-50 border-red-400'
                      : 'bg-yellow-50 border-yellow-400'
                  }`}
                >
                  <p className={`text-sm font-medium ${alert.level === 'critical' ? 'text-red-700' : 'text-yellow-700'}`}>
                    {alert.level === 'critical' ? 'Critical' : 'Warning'}: {alert.category}
                  </p>
                  {alert.level === 'critical' ? (
                    <p className="text-xs text-red-600">
                      You are LKR {formatAmount(alert.overAmount)} over your budget ({Math.round(alert.usagePercent)}% used).
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-600">
                      You have used {Math.round(alert.usagePercent)}% of your budget limit.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;