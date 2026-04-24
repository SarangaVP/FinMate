import React, { useState } from 'react';
import { X, Plus, Trash2, Equal, Users } from 'lucide-react';
import { Card } from './ui';

const AddExpenseModal = ({ isOpen, onClose, onSubmit, groupMembers, loading, payerCurrency = 'USD' }) => {
  const [activeTab, setActiveTab] = useState('equal'); // 'equal' or 'custom'
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'General',
    selectedMembers: {}
  });
  const [customAmounts, setCustomAmounts] = useState({});

  const handleMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      selectedMembers: {
        ...prev.selectedMembers,
        [memberId]: !prev.selectedMembers[memberId]
      }
    }));
  };

  const handleCustomAmountChange = (memberId, value) => {
    setCustomAmounts(prev => ({
      ...prev,
      [memberId]: parseFloat(value) || 0
    }));
  };

  const getSelectedMembers = () => {
    return groupMembers.filter(member => formData.selectedMembers[member._id]);
  };

  const calculateSplitAmount = () => {
    const selected = getSelectedMembers();
    return selected.length > 0 ? (parseFloat(formData.amount) || 0) / selected.length : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const selectedMembers = getSelectedMembers();
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    let participants = [];

    if (activeTab === 'equal') {
      const splitAmount = amount / selectedMembers.length;
      participants = selectedMembers.map(member => ({
        userID: member._id,
        amount: splitAmount
      }));
    } else {
      // Custom split - verify total matches
      let total = 0;
      participants = selectedMembers.map(member => {
        const customAmount = customAmounts[member._id] || 0;
        total += customAmount;
        return {
          userID: member._id,
          amount: customAmount
        };
      });

      if (Math.abs(total - amount) > 0.01) {
        alert(`Custom amounts total (${total.toFixed(2)}) does not match expense amount (${amount.toFixed(2)})`);
        return;
      }
    }

    onSubmit({
      description: formData.description,
      amount: amount,
      category: formData.category,
      splitType: activeTab,
      participants: participants
    });

    // Reset form
    setFormData({
      description: '',
      amount: '',
      category: 'General',
      selectedMembers: {}
    });
    setCustomAmounts({});
    setActiveTab('equal');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Shared Expense</h2>
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
            <h3 className="font-semibold text-gray-700">Split Type</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('equal')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'equal'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Equal size={16} /> Equal Split
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('custom')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'custom'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users size={16} /> Custom Split
              </button>
            </div>
          </div>

          {/* Members Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">
              Select Members {activeTab === 'equal' && `(${getSelectedMembers().length} selected)`}
            </h3>
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
                </div>
              ))}
            </div>
          </div>

          {/* Split Details */}
          {getSelectedMembers().length > 0 && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700">
                {activeTab === 'equal' ? 'Equal Split Details' : 'Custom Split Details'}
              </h3>
              
              {activeTab === 'equal' ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Total Amount: <span className="font-bold">{payerCurrency} {parseFloat(formData.amount).toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Per Person: <span className="font-bold">{payerCurrency} {calculateSplitAmount().toFixed(2)}</span>
                  </p>
                  <div className="space-y-2">
                    {getSelectedMembers().map(member => (
                      <div key={member._id} className="flex justify-between text-sm bg-white p-2 rounded">
                        <span className="text-gray-700">{member.name || member.email}</span>
                        <span className="font-semibold text-gray-800">
                          {payerCurrency} {calculateSplitAmount().toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Total: <span className="font-bold">{payerCurrency} {parseFloat(formData.amount).toFixed(2)}</span>
                  </p>
                  <div className="space-y-2">
                    {getSelectedMembers().map(member => (
                      <div key={member._id} className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 min-w-37.5">
                          {member.name || member.email}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={customAmounts[member._id] || ''}
                          onChange={(e) => handleCustomAmountChange(member._id, e.target.value)}
                          placeholder="0.00"
                          className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{payerCurrency}</span>
                      </div>
                    ))}
                  </div>
                  {Object.values(customAmounts).length > 0 && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Allocated: <span className="font-bold">
                          {payerCurrency} {Object.values(customAmounts).reduce((a, b) => a + b, 0).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
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
              {loading ? 'Adding Expense...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddExpenseModal;
