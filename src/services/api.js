// services/api.js
import axios from 'axios';
import { store } from '../store'; // Import the Redux store

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token from Redux
api.interceptors.request.use(
  (config) => {
    const state = store.getState(); // Get the current Redux state
    const token = state.auth.token; // Access the token from the auth slice
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      store.dispatch({ type: 'auth/logout' }); // Dispatch a logout action to clear Redux state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const customerAPI = {
  create: (branchId, customerData) => api.post(`/branches/${branchId}/customers`, customerData),
  getWaitingList: (branchId) => api.get(`/branches/${branchId}/customers/waiting`),
  getHistory: (branchId, params) => api.get(`/branches/${branchId}/customers/history`, { params }),
  markAsServed: (customerId) => api.patch(`/customers/${customerId}/served`),
  markAsLeft: (customerId) => api.patch(`/customers/${customerId}/left`),
};

export const analyticsAPI = {
  getAnalytics: (branchId, period = 'week') => api.get(`/branches/${branchId}/analytics?period=${period}`),
  getCustomerHistory: (branchId, params = {}) => api.get(`/branches/${branchId}/customers/history`, { params }),
  exportData: (branchId, format = 'csv', period = 'week') =>
    api.get(`/branches/${branchId}/analytics/export?format=${format}&period=${period}`, {
      responseType: 'blob',
    }),
  getHourlyAnalytics: (branchId, date) => api.get(`/branches/${branchId}/analytics/hourly?date=${date}`),
  getPeakHours: (branchId, period = 'week') => api.get(`/branches/${branchId}/analytics/peak-hours?period=${period}`),
};

export default api;