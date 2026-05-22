import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Automatically add the JWT token to the header if it exists
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(
    (response) => {
        const method = response.config?.method?.toLowerCase();
        const url = response.config?.url || '';

        const isMutation = method === 'post' || method === 'put' || method === 'delete';
        const affectsBalance =
            url.startsWith('/transactions') ||
            /\/planning\/goals\/[^/]+\/contribute$/.test(url) ||
            /\/recurring\/[^/]+\/pay$/.test(url);

        if (isMutation && affectsBalance && typeof window !== 'undefined') {
            window.dispatchEvent(new Event('transactions:updated'));
        }

        return response;
    },
    (error) => {
        // Handle expired token (401 Unauthorized)
        if (error.response?.status === 401) {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirect to login page
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default API;