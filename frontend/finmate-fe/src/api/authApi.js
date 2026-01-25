import API from '../utils/api';

export const authApi = {
  login: (credentials) => API.post('/auth/login', { 
    email: credentials.email,  // Use 'email' to match backend
    password: credentials.password 
  }),
  register: (userData) => API.post('/auth/register', userData),
};