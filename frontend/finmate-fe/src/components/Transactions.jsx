import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Sparkles, ArrowDownRight, ArrowUpRight, Pencil, Trash2, X, Check, CheckCircle, AlertCircle } from 'lucide-react';
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
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    description: '',
    amount: '',
    type: '',
    date: ''
  });

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

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleFormSubmit = async () => {
    if (!description || !amount) {
      showToast('Please fill in description and amount', 'error');
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
      showToast(`Saved! AI categorized this as: ${response.data.category}`, 'success');
      
      // Refresh transaction list
      fetchTransactions();
      
      // Reset form
      setDescription('');
      setAmount('');
      setAiCategory('Pending...');
    } catch (error) {
      console.error("Submission failed", error);
      showToast('Failed to save transaction', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a transaction
  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date ? transaction.date.split('T')[0] : ''
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ description: '', amount: '', type: '', date: '' });
  };

  // Save edited transaction
  const handleSaveEdit = async (id) => {
    if (!editForm.description || !editForm.amount) {
      showToast('Please fill in description and amount', 'error');
      return;
    }

    try {
      await API.put(`/transactions/${id}`, {
        description: editForm.description,
        amount: parseFloat(editForm.amount),
        type: editForm.type,
        date: editForm.date
      });
      
      showToast('Transaction updated successfully!', 'success');
      setEditingId(null);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to update transaction', error);
      showToast('Failed to update transaction', 'error');
    }
  };

  // Delete a transaction
  const handleDeleteClick = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const handleConfirmDelete = async () => {
    try {
      await API.delete(`/transactions/${deleteConfirm.id}`);
      showToast('Transaction deleted successfully!', 'success');
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction', error);
      showToast('Failed to delete transaction', 'error');
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, id: null });
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Transaction</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4 text-right">Amount (LKR)</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Check if this row is being edited */}
                    {editingId === transaction._id ? (
                      // Edit Mode Row
                      <>
                        <td className="px-6 py-4">
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            className="border rounded px-2 py-1 text-sm outline-none"
                          >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="border rounded px-2 py-1 text-sm w-full outline-none"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={editForm.type === 'income' ? 'success' : 'primary'}>
                            {transaction.category}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="border rounded px-2 py-1 text-sm outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="border rounded px-2 py-1 text-sm w-24 text-right outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSaveEdit(transaction._id)}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Save"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      // Normal View Row
                      <>
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
                        <td className="px-6 py-4 text-center text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(transaction)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(transaction._id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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