import React from 'react';
import { Target, PieChart, AlertTriangle, Plus, Flame, TrendingUp } from 'lucide-react';

const BudgetsGoals = () => {
  const categories = [
    { name: 'Food & Groceries', spent: 18500, limit: 20000, color: 'bg-amber-500' },
    { name: 'Transport', spent: 4200, limit: 10000, color: 'bg-blue-500' },
    { name: 'Entertainment', spent: 12000, limit: 10000, color: 'bg-red-500' }, // Over budget
  ];

  const goals = [
    { name: 'New Laptop', current: 45000, target: 150000, deadline: 'Dec 2025' },
    { name: 'Emergency Fund', current: 80000, target: 100000, deadline: 'Aug 2026' },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 text-left">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Budgets & Saving Goals</h1>
            <p className="text-gray-500 text-sm">Set limits and track your journey to financial milestones.</p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <Plus size={16} /> Create New
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. Monthly Budgets Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="text-blue-600" size={20} />
              <h2 className="font-bold text-gray-800">Category Budgets</h2>
            </div>
            
            <div className="space-y-8">
              {categories.map((cat, idx) => {
                const percent = (cat.spent / cat.limit) * 100;
                const isOver = cat.spent > cat.limit;
                
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-end mb-2">
                      <div className='text-left'>
                        <p className="text-sm font-bold text-gray-700">{cat.name}</p>
                        <p className="text-xs text-gray-400">
                          LKR {cat.spent.toLocaleString()} of {cat.limit.toLocaleString()}
                        </p>
                      </div>
                      <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
                        {percent.toFixed(0)}%
                      </span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${isOver ? 'bg-red-500' : cat.color}`} 
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      ></div>
                    </div>
                    {isOver && (
                      <div className="flex items-center gap-1 mt-2 text-red-500">
                        <AlertTriangle size={12} />
                        <span className="text-[10px] font-bold uppercase">Over Budget Alert</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Saving Goals Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Target className="text-indigo-600" size={20} />
                <h2 className="font-bold text-gray-800">Saving Goals</h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {goals.map((goal, idx) => {
                  const percent = (goal.current / goal.target) * 100;
                  return (
                    <div key={idx} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 border-dashed">
                      <div className="flex justify-between items-center mb-3">
                        <div className='text-left'>
                          <h4 className="font-bold text-indigo-900">{goal.name}</h4>
                          <p className="text-[10px] text-indigo-400 uppercase font-black">Target: {goal.deadline}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-indigo-600">{percent.toFixed(0)}% Done</p>
                        </div>
                      </div>
                      <div className="w-full bg-white h-4 rounded-full p-1 border border-indigo-100 shadow-inner">
                        <div 
                          className="h-full bg-indigo-500 rounded-full flex items-center justify-end pr-1 transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        >
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-xs font-medium text-indigo-700">LKR {goal.current.toLocaleString()}</p>
                        <p className="text-xs font-medium text-gray-400">Goal: {goal.target.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Contribution Suggestion (SRS Requirement: Proactive Planning) */}
            <div className="bg-linear-to-r from-orange-400 to-rose-500 p-6 rounded-2xl shadow-md text-white">
              <div className="flex items-center gap-2 mb-2 text-left">
                <Flame size={18} />
                <span className="font-bold text-sm uppercase tracking-tighter">AI Quick Action</span>
              </div>
              <p className="text-sm font-medium leading-relaxed mb-4 text-left">
                "We found a surplus of LKR 5,000 in your wallet. 
                Move it to your 'New Laptop' goal to finish earlier?"
              </p>
              <button className="w-full bg-white text-rose-500 py-2 rounded-lg font-bold text-xs hover:bg-rose-50 transition-colors">
                Apply Contribution
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BudgetsGoals;