import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Download, TrendingDown, TrendingUp, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, Button } from './ui';
import API from '../utils/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      totalTransactions: 0
    },
    categories: [],
    monthlyTrend: [],
    insights: {
      topCategory: 'N/A',
      topCategorySpend: 0,
      mostExpensiveDay: 'N/A'
    }
  });

  const formatAmount = (value) =>
    new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/reports/analytics?months=6');
      setAnalytics(response.data);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.error || 'Failed to load reports analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const handleTransactionsUpdated = () => {
      fetchAnalytics();
    };

    window.addEventListener('transactions:updated', handleTransactionsUpdated);
    return () => {
      window.removeEventListener('transactions:updated', handleTransactionsUpdated);
    };
  }, []);

  const maxCategorySpend = useMemo(
    () => Math.max(...analytics.categories.map((item) => item.total), 0),
    [analytics.categories]
  );

  const maxMonthlyValue = useMemo(() => {
    const maxValue = analytics.monthlyTrend.reduce(
      (currentMax, row) => Math.max(currentMax, row.income, row.expense),
      0
    );
    return maxValue || 1;
  }, [analytics.monthlyTrend]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-500 text-sm">Live insights from your income, spending, and category behavior.</p>
          </div>
          <Button variant="secondary" icon={Download} onClick={fetchAnalytics} disabled={loading}>
            Refresh
          </Button>
        </div>

        {error && (
          <Card className="p-4 mb-6 border border-red-100 bg-red-50 text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">{error}</span>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-5">
            <p className="text-xs uppercase text-gray-400 font-bold mb-1">Income</p>
            <p className="text-xl font-bold text-green-600">LKR {formatAmount(analytics.summary.totalIncome)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase text-gray-400 font-bold mb-1">Expense</p>
            <p className="text-xl font-bold text-red-600">LKR {formatAmount(analytics.summary.totalExpense)}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase text-gray-400 font-bold mb-1">Balance</p>
            <p className={`text-xl font-bold ${analytics.summary.balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
              LKR {formatAmount(analytics.summary.balance)}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase text-gray-400 font-bold mb-1">Transactions</p>
            <p className="text-xl font-bold text-gray-800">{analytics.summary.totalTransactions}</p>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span>Loading analytics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 rounded-2xl border-indigo-50">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="text-indigo-400" size={18} />
                  <h2 className="font-bold text-gray-800">Insights Digest</h2>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <TrendingDown className="text-rose-500" size={16} />
                    Top spending category: <span className="font-bold">{analytics.insights.topCategory}</span>
                    <span className="text-gray-500">(LKR {formatAmount(analytics.insights.topCategorySpend)})</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <BarChart3 className="text-indigo-500" size={16} />
                    Most expensive day (last 6 months): <span className="font-bold">{analytics.insights.mostExpensiveDay}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="text-green-500" size={16} />
                    Net position: <span className="font-bold">LKR {formatAmount(analytics.summary.balance)}</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <CardHeader title="Income vs Expense Trend (6 months)" />
                {analytics.monthlyTrend.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-4">No monthly data available yet.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {analytics.monthlyTrend.map((row) => (
                      <div key={row.label}>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{row.label}</span>
                          <span>
                            +{formatAmount(row.income)} / -{formatAmount(row.expense)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <div
                            className="h-2 bg-green-500 rounded"
                            style={{ width: `${Math.max((row.income / maxMonthlyValue) * 100, 2)}%` }}
                          />
                          <div
                            className="h-2 bg-red-500 rounded"
                            style={{ width: `${Math.max((row.expense / maxMonthlyValue) * 100, 2)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <CardHeader title="Spending by Category" />
                {analytics.categories.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-3">No expense categories found yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {analytics.categories.map((category) => (
                      <div key={category.category}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-700">{category.category}</span>
                          <span className="text-gray-500">LKR {formatAmount(category.total)}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded">
                          <div
                            className="h-2 bg-indigo-500 rounded"
                            style={{ width: `${Math.max((category.total / (maxCategorySpend || 1)) * 100, 5)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;