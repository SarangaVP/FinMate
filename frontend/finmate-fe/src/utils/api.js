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
    (error) => Promise.reject(error)
);

export default API;