import axios from "axios";

// Use environment variable for API URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

// Always send cookies (important for sessions/JWT stored in cookies)
axios.defaults.withCredentials = true;

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data; // Return API response data
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true, // Ensure cookies are included
  });
  return response.data;
};

// Get logged-in user profile
const getMe = async () => {
  const response = await axios.get(`${API_URL}/me`, {
    withCredentials: true,
  });
  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axios.get(`${API_URL}/logout`, {
    withCredentials: true,
  });
  return response.data;
};

export const authService = {
  register,
  login,
  getMe,
  logout,
};
