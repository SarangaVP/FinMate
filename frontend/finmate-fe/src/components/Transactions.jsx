import React, { useState } from 'react';
import { Plus, Search, Filter, Sparkles, ArrowDownRight, ArrowUpRight, Tag } from 'lucide-react';

const Transactions = () => {
  // Mock state to simulate AI categorization
  const [description, setDescription] = useState('');
  const [aiCategory, setAiCategory] = useState('Pending...');

  // Simple logic to show AI "thinking" for the report screenshot
  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);
    if (val.toLowerCase().includes('coffee') || val.toLowerCase().includes('starbucks')) {
      setAiCategory('Food & Drink');
    } else if (val.toLowerCase().includes('uber') || val.toLowerCase().includes('fuel')) {
      setAiCategory('Transport');
    } else {
      setAiCategory('General');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
            <p className="text-gray-500 text-sm">Record your expenses and let AI do the sorting.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              <Plus size={16} /> New Entry
            </button>
          </div>
        </div>

        {/* 1. Smart Entry Form (The AI Core) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-blue-500" /> Data Entry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Description</label>
              <input 
                type="text" 
                value={description}
                onChange={handleDescriptionChange}
                placeholder="What did you spend on? (e.g., Movie tickets, groceries)" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              {/* The AI Feedback Badge */}
              <div className="absolute right-3 top-8 flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <Sparkles size={12} />
                AI Suggests: {aiCategory}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Amount</label>
              <input type="number" placeholder="0.00" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Date</label>
              <input type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-gray-500 outline-none" />
            </div>
          </div>
        </div>

        {/* 2. Transaction History (Balance Management) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <span className="font-bold text-gray-700">Recent Logs</span>
            <div className="relative">
              <Search className="absolute left-3 top-2 text-gray-400" size={14} />
              <input type="text" placeholder="Search..." className="bg-white border rounded-lg pl-8 pr-4 py-1 text-xs outline-none" />
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Entity/Description</th>
                <th className="px-6 py-4 text-center">AI Category</th>
                <th className="px-6 py-4 text-right">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4"><ArrowDownRight className="text-red-500 bg-red-50 p-1 rounded" size={24} /></td>
                <td className="px-6 py-4 font-medium text-gray-700 text-sm">Pizza</td>
                <td className="px-6 py-4 text-center"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">Food & Drink</span></td>
                <td className="px-6 py-4 text-right font-bold text-red-600">- 1,250.00</td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4"><ArrowUpRight className="text-green-500 bg-green-50 p-1 rounded" size={24} /></td>
                <td className="px-6 py-4 font-medium text-gray-700 text-sm">Monthly Salary</td>
                <td className="px-6 py-4 text-center"><span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold border border-green-100">Income</span></td>
                <td className="px-6 py-4 text-right font-bold text-green-600">+ 120,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;