import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from './ui';

const AddExpenseModal = ({ isOpen, onClose, onSubmit, groupMembers, loading, payerCurrency = 'USD', initialExpense = null }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'General',
    paidBy: '',
    selectedMembers: {}
  });

  // Initialize form with existing expense data if editing
  useEffect(() => {
    if (initialExpense) {
      setFormData({
        description: initialExpense.description,
        amount: initialExpense.amount.toString(),
        category: initialExpense.category,
        paidBy: initialExpense.paidBy._id,
        selectedMembers: initialExpense.participants.reduce((acc, p) => {
          acc[p.userID._id] = true;
          return acc;
        }, {})
      });
    } else {
      setFormData({
        description: '',
        amount: '',
        category: 'General',
        paidBy: '',
        selectedMembers: {}
      });
    }
  }, [initialExpense, isOpen]);

  const handleMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: {
        ...prev.selectedMembers,
        [memberId]: !prev.selectedMembers[memberId]
      }
    }));
  };

  const getSelectedMembers = () => {
    return groupMembers.filter(member => formData.selectedMembers[member._id]);
  };

  const calculateSplitAmount = () => {
    const selected = getSelectedMembers();
    const amt = parseFloat(formData.amount);
    if (selected.length === 0 || !amt || isNaN(amt)) {
      return 0;
    }
    return amt / selected.length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.paidBy.trim()) {
      alert('Please select who is paying');
      return;
    }

    const selectedMembers = getSelectedMembers();
    if (selectedMembers.length === 0) {
      alert('Please select at least one member to split with');
      return;
    }

    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    const splitAmount = amount / selectedMembers.length;
    
    const participants = selectedMembers.map(member => ({
      userID: member._id,
      amount: splitAmount
    }));

    onSubmit({
      description: formData.description,
      amount: amount,
      category: formData.category,
      splitType: 'equal',
      participants: participants,
      paidBy: formData.paidBy
    });

    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'General',
      paidBy: '',
      selectedMembers: {}
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialExpense ? 'Edit Shared Expense' : 'Add Shared Expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Expense Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Expense Details</h3>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Dinner, Movie tickets, Groceries"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Travel">Travel</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Split Type Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Who is Paying? *</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {groupMembers.map(member => (
                <div
                  key={member._id}
                  onClick={() => setFormData({ ...formData, paidBy: member._id })}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paidBy === member._id
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-800">{member.name || member.email}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                  {formData.paidBy === member._id && (
                    <p className="text-xs font-semibold text-green-600 mt-1">✓ Paying</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Members Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">
              Split Among Members * ({getSelectedMembers().length} selected)
            </h3>
            <p className="text-xs text-gray-500">Select who should split this expense (can include the payer)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {groupMembers.map(member => (
                <div
                  key={member._id}
                  onClick={() => handleMemberToggle(member._id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.selectedMembers[member._id]
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-gray-800">{member.name || member.email}</p>
                  <p className="text-xs text-gray-500">{member.email}</p>
                  {formData.paidBy === member._id && (
                    <p className="text-xs font-semibold text-green-600 mt-1">Payer</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Split Details */}
          {getSelectedMembers().length > 0 && formData.paidBy && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">Equal Split Preview</h3>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Total Amount: <span className="font-bold">{payerCurrency} {(parseFloat(formData.amount) || 0).toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Per Person: <span className="font-bold">{payerCurrency} {calculateSplitAmount().toFixed(2)}</span>
                </p>
                <div className="space-y-2 pt-3 border-t border-gray-200">
                  {getSelectedMembers().map(member => (
                    <div key={member._id} className="flex justify-between text-sm bg-white p-2 rounded">
                      <span className="text-gray-700">
                        {member.name || member.email}
                        {formData.paidBy === member._id && <span className="text-green-600 ml-2">(Payer)</span>}
                      </span>
                      <span className="font-semibold text-gray-800">
                        {payerCurrency} {calculateSplitAmount().toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? (initialExpense ? 'Updating...' : 'Adding...') : (initialExpense ? 'Update Expense' : 'Add Expense')}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpenseModal;
