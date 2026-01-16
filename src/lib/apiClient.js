// lib/apiClient.js
import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track ongoing refresh requests to prevent multiple simultaneous refreshes
let isRefreshing = false;
let refreshSubscribers = [];

// Add subscriber for refresh completion
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers that refresh is complete
const onRefreshComplete = (error = null) => {
  refreshSubscribers.forEach((callback) => callback(error));
  refreshSubscribers = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // No need to manually add Authorization header
    // Cookies are sent automatically with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle specific auth error codes
    const errorCode = error.response?.data?.code;
    
    if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
      // If refresh is already in progress, wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((refreshError) => {
            if (refreshError) {
              reject(refreshError);
            } else {
              resolve(apiClient(originalRequest));
            }
          });
        });
      }

      // Start refresh process
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await apiClient.post('/api/auth/refresh');
        
        // Refresh successful, retry original request
        onRefreshComplete();
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, notify all subscribers and redirect to login
        onRefreshComplete(refreshError);
        
        // Clear any stored auth state and redirect to login
        if (typeof window !== 'undefined') {
          // Dispatch logout action to Redux
          window.store?.dispatch({ type: 'auth/logout' });
          
          // Redirect to login page
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other 401 errors (no token, user not found, etc.)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Dispatch logout action to Redux
        window.store?.dispatch({ type: 'auth/logout' });
        
        // Redirect to login page
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
