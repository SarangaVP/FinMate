import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const settlementsApi = {
  // Pay a settlement
  paySettlement: async (settlementId, amount) => {
    const response = await axios.post(
      `${API_BASE_URL}/shared-expenses/settlement/${settlementId}/pay`,
      { amount },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  },

  // Get pending settlements for a group
  getGroupSettlements: async (groupId) => {
    const response = await axios.get(
      `${API_BASE_URL}/shared-groups/${groupId}`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    return response.data;
  }
};

export default settlementsApi;
