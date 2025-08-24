// services/api.js
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const customerAPI = {
  // Create a new customer
  create: (branchId, customerData) => 
    api.post(`/branches/${branchId}/customers`, customerData),
  
  // Get waiting list for a branch
  getWaitingList: (branchId) => 
    api.get(`/branches/${branchId}/customers/waiting`),
  
  // Get customer history
  getHistory: (branchId, params) => 
    api.get(`/branches/${branchId}/customers/history`, { params }),
  
  // Mark as served
  markAsServed: (customerId) => 
    api.patch(`/customers/${customerId}/served`),
  
  // Mark as left
  markAsLeft: (customerId) => 
    api.patch(`/customers/${customerId}/left`),
};

export const analyticsAPI = {
  // Get analytics for a branch
  getAnalytics: (branchId, period = 'day') => 
    api.get(`/branches/${branchId}/analytics?period=${period}`),
};

export default api;