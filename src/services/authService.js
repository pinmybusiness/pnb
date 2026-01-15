import apiClient from '../lib/apiClient.js';

// Use environment variable for API URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

// Register user
const register = async (userData) => {
  const response = await apiClient.post(`${API_URL}/register`, userData);
  return response.data; // Return API response data
};

// Login user
const login = async ({ mobile, password, rememberMe }) => {
  const response = await apiClient.post(`${API_URL}/login`, {
    mobile,
    password,
    rememberMe,
  });
  return response.data;
};

// Get logged-in user profile
const getMe = async () => {
  const response = await apiClient.get(`${API_URL}/me`);
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await apiClient.get(`${API_URL}/logout`);
  return response.data;
};

// Refresh access token
const refreshToken = async () => {
  const response = await apiClient.post(`${API_URL}/refresh`);
  return response.data;
};

const googleLogin = async (authCode) => {
  const response = await apiClient.post(`${API_URL}/google-client-login`, {
    code: authCode,
  });
  return response.data;
};

export const authService = {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  googleLogin
};
