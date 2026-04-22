import API from '../utils/api';

export const sharedGroupsApi = {
  // Get all groups for the current user
  getGroups: () => API.get('/shared-groups'),

  // Get a specific group by ID
  getGroupById: (groupId) => API.get(`/shared-groups/${groupId}`),

  // Get balances for a group
  getGroupBalances: (groupId) => API.get(`/shared-groups/${groupId}/balances`),

  // Get expenses for a group
  getGroupExpenses: (groupId) => API.get(`/shared-groups/${groupId}/expenses`),

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
  settleBalance: (groupId, payerId, payeeId, amount) => API.post(
    `/shared-groups/${groupId}/settle`,
    { payerId, payeeId, amount }
  ),

  // Add a shared expense to a group (Splitwise style)
  addSharedExpense: (groupId, expenseData) => API.post(
    `/shared-groups/${groupId}/add-expense`,
    {
      description: expenseData.description,
      amount: expenseData.amount,
      splitWith: expenseData.splitWith,
      date: expenseData.date
    }
  )
};
