import API from '../utils/api';

export const sharedGroupsApi = {
  // Get all groups for the current user
  getGroups: () => API.get('/shared-groups'),

  // Get a specific group by ID
  getGroupById: (groupId) => API.get(`/shared-groups/${groupId}`),

  // Get balances for a group
  getGroupBalances: (groupId) => API.get(`/shared-groups/${groupId}/balances`),

  // Create a new group
  createGroup: (groupData) => API.post('/shared-groups', {
    groupName: groupData.groupName,
    memberEmails: groupData.memberEmails || []
  }),

  // Join an existing group
  joinGroup: (groupId) => API.post('/shared-groups/join', { groupId }),

  // Add a member to a group by email
  addMember: (groupId, email) => API.post('/shared-groups/add-member', {
    groupId,
    email
  }),

  // Remove a member from a group
  removeMember: (groupId, memberId) => API.delete('/shared-groups/remove-member', {
    data: { groupId, memberId }
  }),

  // Update group name
  updateGroup: (groupId, groupName) => API.put(`/shared-groups/${groupId}`, {
    groupId,
    groupName
  }),

  // Delete a group
  deleteGroup: (groupId) => API.delete(`/shared-groups/${groupId}`),

  // Settle a balance between two members
  settleBalance: (groupId, fromUserId, toUserId, amount) => API.post(
    `/shared-groups/${groupId}/settle`,
    { groupId, fromUserId, toUserId, amount }
  )
};

export const sharedExpensesApi = {
  // Get all expenses for a group
  getGroupExpenses: (groupId) => API.get(`/shared-expenses/group/${groupId}`),

  // Get a specific expense
  getExpenseById: (expenseId) => API.get(`/shared-expenses/${expenseId}`),

  // Add a new shared expense
  addExpense: (expenseData) => API.post('/shared-expenses', expenseData),

  // Update an expense
  updateExpense: (expenseId, expenseData) => API.put(`/shared-expenses/${expenseId}`, expenseData),

  // Delete an expense
  deleteExpense: (expenseId) => API.delete(`/shared-expenses/${expenseId}`),

  // Calculate group balance (who owes whom)
  calculateGroupBalance: (groupId) => API.get(`/shared-expenses/balance/${groupId}`)
};