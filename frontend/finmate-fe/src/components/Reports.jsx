import React from 'react';
import { BarChart3, BrainCircuit, Download, TrendingDown, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { Card, CardHeader, Button } from './ui';

const Reports = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-left">
      <div className="max-w-6xl mx-auto">
        {/* Header with Export Action */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & AI Insights</h1>
            <p className="text-gray-500 text-sm">Deep dive into your spending patterns powered by Google Gemini.</p>
          </div>
          <Button variant="secondary" icon={Download}>
            Export PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. The "Gemini Digest" - Fulfills Intelligent Summarization Requirement */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 rounded-3xl border-indigo-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Sparkles className="text-indigo-200 animate-pulse" size={40} />
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                  <BrainCircuit size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Weekly AI Digest</h2>
              </div>

              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  "Hello Saranga! Based on your activity from <span className="font-bold">Dec 21 - Dec 27</span>, here is what I found:"
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Zap className="text-amber-500 shrink-0" size={18} />
                    <span className="text-sm text-gray-700">
                      Your <span className="font-bold">Dining Out</span> frequency increased by 12% this week. This is mostly driven by three late-night orders.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <TrendingDown className="text-green-500 shrink-0" size={18} />
                    <span className="text-sm text-gray-700">
                      Great job on <span className="font-bold">Utilities</span>! Your proactive tracking saved you LKR 1,200 compared to last month's average.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <TrendingUp className="text-blue-500 shrink-0" size={18} />
                    <span className="text-sm text-gray-700">
                      You are on track to save <span className="font-bold">LKR 15,000</span> more than last month if you maintain this pace.
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex gap-4">
                <Button variant="ghost" size="sm" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100">
                  Generate Monthly View
                </Button>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
              </div>
            </Card>

            {/* Placeholder for Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 h-64 flex flex-col items-center justify-center">
                <BarChart3 className="text-gray-200 mb-2" size={48} />
                <p className="text-gray-400 text-sm font-medium">Spending by Category Chart</p>
              </Card>
              <Card className="p-6 h-64 flex flex-col items-center justify-center">
                <TrendingUp className="text-gray-200 mb-2" size={48} />
                <p className="text-gray-400 text-sm font-medium">Income vs Expense Trend</p>
              </Card>
            </div>
          </div>

          {/* 2. Side Panel: Quick Stats */}
          <div className="space-y-6">
            <Card variant="dark" className="p-6 rounded-3xl">
              <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Quick Insights</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Most Expensive Day</p>
                  <p className="text-lg font-bold">Tuesday, Dec 23</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Top Spending Category</p>
                  <p className="text-lg font-bold text-amber-400">Food & Beverages</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <CardHeader title="Download History" />
              <div className="space-y-3">
                <div className="flex justify-between text-xs p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
                  <span className="text-gray-600">November_Summary.csv</span>
                  <Download size={14} className="text-gray-400" />
                </div>
                <div className="flex justify-between text-xs p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-all">
                  <span className="text-gray-600">Q4_Tax_Report.pdf</span>
                  <Download size={14} className="text-gray-400" />
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reports;