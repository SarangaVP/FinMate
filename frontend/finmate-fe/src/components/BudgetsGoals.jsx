import React, { useEffect, useState } from 'react';
import { Target, PieChart, AlertTriangle, Plus, Pencil, Check, X, Trash2 } from 'lucide-react';
import { Card, CardHeader, Button, ProgressBar, Input } from './ui';
import { budgetGoalsApi } from '../api/budgetGoalsApi';

const BudgetsGoals = () => {
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [budgetForm, setBudgetForm] = useState({
    category: '',
    spendingLimit: '',
    timeFrame: 'Monthly'
  });

  const [goalForm, setGoalForm] = useState({
    goalName: '',
    targetValue: '',
    currentSavedAmount: '0',
    targetDate: ''
  });

  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editGoalForm, setEditGoalForm] = useState({
    goalName: '',
    targetValue: '',
    currentSavedAmount: '',
    targetDate: ''
  });

  const [goalContributionAmounts, setGoalContributionAmounts] = useState({});

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [budgetsResponse, goalsResponse] = await Promise.all([
        budgetGoalsApi.getBudgets(),
        budgetGoalsApi.getGoals()
      ]);
      setBudgets(budgetsResponse.data || []);
      setGoals(goalsResponse.data || []);
    } catch (fetchError) {
      setError(fetchError?.response?.data?.error || 'Failed to load budgets and goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBudget = async () => {
    if (!budgetForm.category || !budgetForm.spendingLimit) {
      setError('Please enter budget category and spending limit');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await budgetGoalsApi.createBudget({
        category: budgetForm.category,
        spendingLimit: Number(budgetForm.spendingLimit),
        timeFrame: budgetForm.timeFrame
      });
      setBudgetForm({ category: '', spendingLimit: '', timeFrame: 'Monthly' });
      setMessage('Budget created');
      fetchData();
    } catch (createError) {
      setError(createError?.response?.data?.error || 'Failed to create budget');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!goalForm.goalName || !goalForm.targetValue) {
      setError('Please enter goal name and target value');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await budgetGoalsApi.createGoal({
        goalName: goalForm.goalName,
        targetValue: Number(goalForm.targetValue),
        currentSavedAmount: Number(goalForm.currentSavedAmount || 0),
        targetDate: goalForm.targetDate || undefined
      });
      setGoalForm({ goalName: '', targetValue: '', currentSavedAmount: '0', targetDate: '' });
      setMessage('Saving goal created');
      fetchData();
    } catch (createError) {
      setError(createError?.response?.data?.error || 'Failed to create saving goal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    setActionLoading(true);
    setError('');
    try {
      await budgetGoalsApi.deleteBudget(id);
      setMessage('Budget deleted');
      fetchData();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.error || 'Failed to delete budget');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    setActionLoading(true);
    setError('');
    try {
      await budgetGoalsApi.deleteGoal(id);
      setMessage('Saving goal deleted');
      fetchData();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.error || 'Failed to delete saving goal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStartEditGoal = (goal) => {
    setEditingGoalId(goal._id);
    setEditGoalForm({
      goalName: goal.goalName || '',
      targetValue: String(goal.targetValue ?? ''),
      currentSavedAmount: String(goal.currentSavedAmount ?? 0),
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : ''
    });
  };

  const handleCancelEditGoal = () => {
    setEditingGoalId(null);
    setEditGoalForm({
      goalName: '',
      targetValue: '',
      currentSavedAmount: '',
      targetDate: ''
    });
  };

  const handleUpdateGoal = async (id) => {
    if (!editGoalForm.goalName || !editGoalForm.targetValue) {
      setError('Goal name and target value are required');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await budgetGoalsApi.updateGoal(id, {
        goalName: editGoalForm.goalName,
        targetValue: Number(editGoalForm.targetValue),
        currentSavedAmount: Number(editGoalForm.currentSavedAmount || 0),
        targetDate: editGoalForm.targetDate || null
      });
      setMessage('Saving goal updated');
      handleCancelEditGoal();
      fetchData();
    } catch (updateError) {
      setError(updateError?.response?.data?.error || 'Failed to update saving goal');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoalContributionAmountChange = (goalId, value) => {
    setGoalContributionAmounts((prev) => ({
      ...prev,
      [goalId]: value
    }));
  };

  const handleAddCashToGoal = async (goal) => {
    const rawAmount = goalContributionAmounts[goal._id] ?? '';
    const amount = Number(rawAmount);

    if (!amount || amount <= 0) {
      setError('Contribution amount must be greater than 0');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      await budgetGoalsApi.contributeToGoal(goal._id, amount);
      setGoalContributionAmounts((prev) => ({ ...prev, [goal._id]: '' }));
      setMessage(`LKR ${formatCurrency(amount)} added to ${goal.goalName} and logged as a transaction`);
      fetchData();
    } catch (contributionError) {
      setError(contributionError?.response?.data?.error || 'Failed to contribute to goal');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 text-left">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Budgets & Saving Goals</h1>
            <p className="text-gray-500 text-sm">Set limits and track your journey to financial milestones.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={fetchData} disabled={loading || actionLoading}>
            Refresh
          </Button>
        </div>

        {error && <p className="mb-4 text-sm text-red-500 font-medium">{error}</p>}
        {!error && message && <p className="mb-4 text-sm text-green-600 font-medium">{message}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <CardHeader icon={PieChart} title="Create Budget" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Category"
                placeholder="Food"
                value={budgetForm.category}
                onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
              />
              <Input
                label="Limit"
                type="number"
                placeholder="20000"
                value={budgetForm.spendingLimit}
                onChange={(e) => setBudgetForm({ ...budgetForm, spendingLimit: e.target.value })}
              />
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Timeframe</label>
                <select
                  value={budgetForm.timeFrame}
                  onChange={(e) => setBudgetForm({ ...budgetForm, timeFrame: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <Button className="mt-4" onClick={handleCreateBudget} disabled={actionLoading}>
              Add Budget
            </Button>
          </Card>

          <Card className="p-6">
            <CardHeader icon={Target} title="Create Saving Goal" iconColor="text-indigo-600" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Goal Name"
                placeholder="Emergency Fund"
                value={goalForm.goalName}
                onChange={(e) => setGoalForm({ ...goalForm, goalName: e.target.value })}
              />
              <Input
                label="Target Value"
                type="number"
                placeholder="100000"
                value={goalForm.targetValue}
                onChange={(e) => setGoalForm({ ...goalForm, targetValue: e.target.value })}
              />
              <Input
                label="Current Saved"
                type="number"
                value={goalForm.currentSavedAmount}
                onChange={(e) => setGoalForm({ ...goalForm, currentSavedAmount: e.target.value })}
              />
              <Input
                label="Target Date"
                type="date"
                value={goalForm.targetDate}
                onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
              />
            </div>
            <Button className="mt-4" onClick={handleCreateGoal} disabled={actionLoading}>
              Add Goal
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <CardHeader icon={PieChart} title="Category Budgets" />
            {loading ? (
              <p className="text-sm text-gray-500">Loading budgets...</p>
            ) : budgets.length === 0 ? (
              <p className="text-sm text-gray-500">No budgets yet. Create your first category budget.</p>
            ) : (
              <div className="space-y-6 mt-6">
                {budgets.map((budget) => {
                  const percent = budget.spendingLimit ? (budget.currentSpending / budget.spendingLimit) * 100 : 0;
                  const isOver = budget.currentSpending > budget.spendingLimit;
                  const color = isOver ? 'bg-red-500' : percent >= 75 ? 'bg-amber-500' : 'bg-blue-500';

                  return (
                    <div key={budget._id}>
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-700">{budget.category}</p>
                          <p className="text-xs text-gray-400">
                            LKR {formatCurrency(budget.currentSpending)} of {formatCurrency(budget.spendingLimit)} • {budget.timeFrame}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold ${isOver ? 'text-red-500' : 'text-gray-500'}`}>
                            {percent.toFixed(0)}%
                          </span>
                          <button onClick={() => handleDeleteBudget(budget._id)} className="text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <ProgressBar value={budget.currentSpending} max={budget.spendingLimit} color={color} />
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
            )}
          </Card>

          <div>
            <Card className="p-6">
              <CardHeader icon={Target} title="Saving Goals" iconColor="text-indigo-600" />
              {loading ? (
                <p className="text-sm text-gray-500">Loading goals...</p>
              ) : goals.length === 0 ? (
                <p className="text-sm text-gray-500">No goals yet. Create your first saving target.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 mt-6">
                  {goals.map((goal) => {
                    const percent = goal.targetValue ? (goal.currentSavedAmount / goal.targetValue) * 100 : 0;
                    const safePercent = Math.min(percent, 100);
                    const deadlineLabel = goal.targetDate
                      ? new Date(goal.targetDate).toLocaleDateString('en-LK', { year: 'numeric', month: 'short' })
                      : 'No deadline';

                    return (
                      <div key={goal._id} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 border-dashed">
                        {editingGoalId === goal._id ? (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                              <Input
                                label="Goal Name"
                                value={editGoalForm.goalName}
                                onChange={(e) => setEditGoalForm({ ...editGoalForm, goalName: e.target.value })}
                              />
                              <Input
                                label="Target Value"
                                type="number"
                                value={editGoalForm.targetValue}
                                onChange={(e) => setEditGoalForm({ ...editGoalForm, targetValue: e.target.value })}
                              />
                              <Input
                                label="Current Saved"
                                type="number"
                                value={editGoalForm.currentSavedAmount}
                                onChange={(e) => setEditGoalForm({ ...editGoalForm, currentSavedAmount: e.target.value })}
                              />
                              <Input
                                label="Target Date"
                                type="date"
                                value={editGoalForm.targetDate}
                                onChange={(e) => setEditGoalForm({ ...editGoalForm, targetDate: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button size="sm" onClick={() => handleUpdateGoal(goal._id)} disabled={actionLoading} icon={Check}>
                                Save
                              </Button>
                              <Button size="sm" variant="secondary" onClick={handleCancelEditGoal} icon={X}>
                                Cancel
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center mb-3">
                              <div className="text-left">
                                <h4 className="font-bold text-indigo-900">{goal.goalName}</h4>
                                <p className="text-[10px] text-indigo-400 uppercase font-black">Target: {deadlineLabel}</p>
                              </div>
                              <div className="text-right flex items-center gap-3">
                                <p className="text-xs font-bold text-indigo-600">{percent.toFixed(0)}% Done</p>
                                <button onClick={() => handleStartEditGoal(goal)} className="text-indigo-400 hover:text-indigo-600">
                                  <Pencil size={16} />
                                </button>
                                <button onClick={() => handleDeleteGoal(goal._id)} className="text-indigo-400 hover:text-red-500">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-white h-4 rounded-full p-1 border border-indigo-100 shadow-inner">
                              <div
                                className="h-full bg-indigo-500 rounded-full flex items-center justify-end pr-1 transition-all duration-700"
                                style={{ width: `${safePercent}%` }}
                              >
                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                              <p className="text-xs font-medium text-indigo-700">LKR {formatCurrency(goal.currentSavedAmount)}</p>
                              <p className="text-xs font-medium text-gray-400">Goal: {formatCurrency(goal.targetValue)}</p>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <input
                                type="number"
                                placeholder="Add cash"
                                value={goalContributionAmounts[goal._id] ?? ''}
                                onChange={(e) => handleGoalContributionAmountChange(goal._id, e.target.value)}
                                className="flex-1 bg-white border border-indigo-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                              />
                              <Button size="sm" onClick={() => handleAddCashToGoal(goal)} disabled={actionLoading}>
                                Add
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsGoals;