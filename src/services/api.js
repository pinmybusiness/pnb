// services/api.js
import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyticsAPI = {
  // Get analytics for a branch
  getAnalytics: (branchId, period = 'week') => 
    api.get(`/branches/${branchId}/analytics?period=${period}`),
  
  // Get customer history
  getCustomerHistory: (branchId, params = {}) => 
    api.get(`/branches/${branchId}/customers/history`, { params }),
  
  // Export analytics data
  exportData: (branchId, format = 'csv', period = 'week') => 
    api.get(`/branches/${branchId}/analytics/export?format=${format}&period=${period}`, {
      responseType: 'blob' // Important for file downloads
    }),
  
  // Get hourly analytics
  getHourlyAnalytics: (branchId, date) => 
    api.get(`/branches/${branchId}/analytics/hourly?date=${date}`),
  
  // Get peak hours
  getPeakHours: (branchId, period = 'week') => 
    api.get(`/branches/${branchId}/analytics/peak-hours?period=${period}`),
};