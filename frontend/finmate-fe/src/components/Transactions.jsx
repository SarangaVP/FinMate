import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Sparkles, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, Button, Input, PageHeader, Badge } from './ui';
import API from '../utils/api';

const Transactions = () => {
  const [description, setDescription] = useState('');
  const [aiCategory, setAiCategory] = useState('Pending...');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await API.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

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

  const handleFormSubmit = async () => {
    if (!description || !amount) {
      alert('Please fill in description and amount');
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        description,
        amount: parseFloat(amount),
        type,
        date
      };

      const response = await API.post('/transactions', payload);
      setAiCategory(response.data.category);
      alert(`Saved! AI categorized this as: ${response.data.category}`);
      
      // Refresh transaction list
      fetchTransactions();
      
      // Reset form
      setDescription('');
      setAmount('');
      setAiCategory('Pending...');
    } catch (error) {
      console.error("Submission failed", error);
      alert('Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <PageHeader 
          title="Transactions" 
          subtitle="Record your expenses and let AI do the sorting."
        >
          <Button variant="secondary" icon={Filter}>Filter</Button>
          <Button variant="primary" icon={Plus}>New Entry</Button>
        </PageHeader>

        {/* Smart Entry Form */}
        <Card className="p-6 mb-8 border-blue-50">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-blue-500" /> Data Entry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Input
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="What did you spend on?"
              />
              <div className="absolute right-3 top-8 flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                <Sparkles size={12} />
                AI Suggests: {aiCategory}
              </div>
            </div>
            <Input 
              label="Amount" 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input 
              label="Date" 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm outline-none"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <Button 
              variant="primary" 
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Transaction'}
            </Button>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="overflow-hidden">
          <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <span className="font-bold text-gray-700">Recent Logs</span>
            <div className="relative">
              <Search className="absolute left-3 top-2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border rounded-lg pl-8 pr-4 py-1 text-xs outline-none" 
              />
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">AI Category</th>
                <th className="px-6 py-4 text-right">Amount (LKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="text-green-500 bg-green-50 p-1 rounded" size={24} />
                      ) : (
                        <ArrowDownRight className="text-red-500 bg-red-50 p-1 rounded" size={24} />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700 text-sm">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={transaction.type === 'income' ? 'success' : 'primary'}>
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Transactions;