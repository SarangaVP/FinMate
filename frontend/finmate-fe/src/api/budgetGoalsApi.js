import API from '../utils/api';

export const budgetGoalsApi = {
  getBudgets: () => API.get('/planning/budgets'),
  createBudget: (payload) => API.post('/planning/budgets', payload),
  updateBudget: (id, payload) => API.put(`/planning/budgets/${id}`, payload),
  deleteBudget: (id) => API.delete(`/planning/budgets/${id}`),

  getGoals: () => API.get('/planning/goals'),
  createGoal: (payload) => API.post('/planning/goals', payload),
  updateGoal: (id, payload) => API.put(`/planning/goals/${id}`, payload),
  contributeToGoal: (id, amount) => API.put(`/planning/goals/${id}/contribute`, { amount }),
  deleteGoal: (id) => API.delete(`/planning/goals/${id}`)
};
