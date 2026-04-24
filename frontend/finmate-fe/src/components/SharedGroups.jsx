import React, { useState, useEffect } from 'react';
import { Users, UserPlus, ArrowRightLeft, CheckCircle2, MoreVertical, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, Button, Badge } from './ui';
import { sharedGroupsApi, sharedExpensesApi } from '../api/sharedGroupsApi';
import AddExpenseModal from './AddExpenseModal';

const SharedGroups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ groupName: '', memberEmails: [] });
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [groupBalances, setGroupBalances] = useState(null);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expandedExpense, setExpandedExpense] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, []);

  // Fetch group balances when selected group changes
  useEffect(() => {
    if (selectedGroup) {
      fetchGroupBalances(selectedGroup._id);
      fetchGroupExpenses(selectedGroup._id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await sharedGroupsApi.getGroups();
      setGroups(response.data);
      if (response.data.length > 0) {
        setSelectedGroup(response.data[0]);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupBalances = async (groupId) => {
    try {
      const response = await sharedGroupsApi.getGroupBalances(groupId);
      setGroupBalances(response.data);
    } catch (err) {
      console.error('Failed to fetch balances:', err);
    }
  };

  const fetchGroupExpenses = async (groupId) => {
    try {
      const response = await sharedExpensesApi.getGroupExpenses(groupId);
      setGroupExpenses(response.data);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!formData.groupName.trim()) {
      showToast('Group name is required', 'error');
      return;
    }

    try {
      setLoading(true);
      await sharedGroupsApi.createGroup(formData);
      showToast('Group created successfully');
      setShowCreateModal(false);
      setFormData({ groupName: '', memberEmails: [] });
      fetchGroups();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !selectedGroup) {
      showToast('Email is required', 'error');
      return;
    }

    try {
      setLoading(true);
      await sharedGroupsApi.addMember(selectedGroup._id, newMemberEmail);
      showToast('Member added successfully');
      setShowAddMemberModal(false);
      setNewMemberEmail('');
      fetchGroups();
      fetchGroupBalances(selectedGroup._id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSettleBalance = async (fromUserId, toUserId, amount) => {
    try {
      setLoading(true);
      await sharedGroupsApi.settleBalance(selectedGroup._id, fromUserId, toUserId, amount);
      showToast('Balance settled successfully');
      fetchGroupBalances(selectedGroup._id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to settle balance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addEmailToForm = () => {
    if (newMemberEmail.trim()) {
      setFormData({
        ...formData,
        memberEmails: [...formData.memberEmails, newMemberEmail]
      });
      setNewMemberEmail('');
    }
  };

  const removeEmailFromForm = (email) => {
    setFormData({
      ...formData,
      memberEmails: formData.memberEmails.filter(e => e !== email)
    });
  };

  const handleAddExpense = async (expenseData) => {
    try {
      setLoading(true);
      await sharedExpensesApi.addExpense({
        groupID: selectedGroup._id,
        ...expenseData
      });
      showToast('Expense added successfully');
      setShowAddExpenseModal(false);
      fetchGroupExpenses(selectedGroup._id);
      fetchGroupBalances(selectedGroup._id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense? This will also update all balances.')) {
      return;
    }

    try {
      setLoading(true);
      await sharedExpensesApi.deleteExpense(expenseId);
      showToast('Expense deleted successfully');
      fetchGroupExpenses(selectedGroup._id);
      fetchGroupBalances(selectedGroup._id);
      setExpandedExpense(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = async (expenseId, expenseData) => {
    try {
      setLoading(true);
      await sharedExpensesApi.updateExpense(expenseId, expenseData);
      showToast('Expense updated successfully');
      setEditingExpenseId(null);
      fetchGroupExpenses(selectedGroup._id);
      fetchGroupBalances(selectedGroup._id);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && groups.length === 0) {
    return <div className="p-8 text-center">Loading groups...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 text-left">Shared Expense Groups</h1>
            <p className="text-gray-500 text-sm">Manage split bills and collaborative tracking with friends.</p>
          </div>
          <Button variant="primary" icon={UserPlus} onClick={() => setShowCreateModal(true)}>
            Create New Group
          </Button>
        </div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Group</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateGroup} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={formData.groupName}
                    onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Roommates, Trip Fund"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Add Members (Optional)</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="member@email.com"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewMemberEmail('');
                        addEmailToForm();
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {formData.memberEmails.length > 0 && (
                    <div className="space-y-2">
                      {formData.memberEmails.map((email) => (
                        <div key={email} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg text-sm">
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => removeEmailFromForm(email)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && selectedGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Member to {selectedGroup.groupName}</h2>
                <button onClick={() => setShowAddMemberModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Member Email</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="member@email.com"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Member'}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Add/Edit Expense Modal */}
        {(showAddExpenseModal || editingExpenseId) && selectedGroup && (
          <AddExpenseModal
            isOpen={showAddExpenseModal || !!editingExpenseId}
            onClose={() => {
              setShowAddExpenseModal(false);
              setEditingExpenseId(null);
            }}
            onSubmit={(expenseData) => {
              if (editingExpenseId) {
                handleEditExpense(editingExpenseId, expenseData);
              } else {
                handleAddExpense(expenseData);
              }
            }}
            groupMembers={selectedGroup.memberIDs || []}
            loading={loading}
            payerCurrency={selectedGroup.memberIDs?.[0]?.primaryCurrency || 'USD'}
            initialExpense={editingExpenseId ? groupExpenses.find(e => e._id === editingExpenseId) : null}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Group List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Groups</h3>
            {groups.length === 0 ? (
              <Card className="p-6 text-center text-gray-500">
                <p>No groups yet. Create one to get started!</p>
              </Card>
            ) : (
              groups.map(group => {
                const memberCount = group.memberIDs?.length || 0;
                const isSelected = selectedGroup?._id === group._id;

                return (
                  <Card
                    key={group._id}
                    className={`p-5 hover:border-blue-300 transition-all cursor-pointer group ${
                      isSelected ? 'border-blue-600 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Users size={20} />
                      </div>
                      <button className="text-gray-400"><MoreVertical size={16} /></button>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1 text-left">{group.groupName}</h4>
                    <p className="text-xs text-gray-500 mb-4 text-left">{memberCount} Members</p>
                  </Card>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Breakdown */}
          {selectedGroup ? (
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <CardHeader icon={Users} title={`Settle Balances: ${selectedGroup.groupName}`} />
                  <Badge variant="default" size="sm">Members: {selectedGroup.memberIDs?.length || 0}</Badge>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-gray-800">Group Members</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedGroup.memberIDs?.map(member => (
                        <div key={member._id} className="p-3 bg-gray-50 rounded-lg text-sm">
                          <p className="font-semibold text-gray-800">{member.name || member.email}</p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="w-full px-4 py-2 mb-6 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} /> Add Member
                  </button>

                  {/* Expenses Section */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Recent Expenses</h4>
                    {groupExpenses && groupExpenses.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {groupExpenses.slice(0, 5).map((expense) => (
                          <div key={expense._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">{expense.description}</p>
                                <p className="text-xs text-gray-500">{expense.category}</p>
                              </div>
                              <div className="text-right flex items-start gap-2">
                                <span className="font-bold text-gray-800">{expense.paidBy?.primaryCurrency} {expense.amount.toFixed(2)}</span>
                                {expense.createdBy?._id === expense.paidBy?._id && (
                                  <button
                                    onClick={() => setExpandedExpense(expandedExpense === expense._id ? null : expense._id)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                  >
                                    <MoreVertical size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-600">
                              <span>Paid by {expense.paidBy.name || expense.paidBy.email}</span>
                              <span className="text-blue-600 font-semibold">{expense.participants.length} split</span>
                            </div>
                            {expandedExpense === expense._id && (
                              <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingExpenseId(expense._id);
                                    setExpandedExpense(null);
                                  }}
                                  className="flex-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-semibold"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteExpense(expense._id)}
                                  className="flex-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 font-semibold"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No expenses yet. Add one to get started!</p>
                    )}
                  </div>

                  {groupBalances && groupBalances.balances && groupBalances.balances.length > 0 ? (
                    <>
                      <h4 className="font-semibold text-gray-800 mb-4">Outstanding Balances</h4>
                      <div className="space-y-3 mb-6">
                        {groupBalances.balances.map((item, idx) => {
                          if (item.balance === 0) return null;
                          const isOwed = item.balance > 0;
                          // Get currency from the selected group's first member (usually the payer)
                          const currency = selectedGroup.memberIDs?.[0]?.primaryCurrency || 'USD';

                          return (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                              <div className="text-left">
                                <p className="text-sm font-bold text-gray-800">
                                  {isOwed ? `${item.user.name || item.user.email} owes you` : `You owe ${item.user.name || item.user.email}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`text-lg font-black ${isOwed ? 'text-green-600' : 'text-red-400'}`}>
                                  {currency} {Math.abs(item.balance).toLocaleString()}
                                </p>
                                <button
                                  onClick={() => handleSettleBalance(
                                    isOwed ? item.user._id : selectedGroup.memberIDs[0]._id,
                                    isOwed ? selectedGroup.memberIDs[0]._id : item.user._id,
                                    Math.abs(item.balance)
                                  )}
                                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 ml-auto mt-1"
                                >
                                  <CheckCircle2 size={12} /> Mark Settled
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                      <p>No pending balances. All settled!</p>
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    icon={ArrowRightLeft}
                    onClick={() => setShowAddExpenseModal(true)}
                    className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Add Shared Expense to this Group
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <Card className="p-8 text-center text-gray-500">
                <p>Select a group to view details</p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedGroups;