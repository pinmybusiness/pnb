import axios from "axios";

// Use environment variable for API URL
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

// Always send cookies (important for sessions/JWT stored in cookies)
axios.defaults.withCredentials = true;

// Register user
const registerCandidate = async (userData) => {
  const response = await axios.post(`${API_URL}/register-candidate`, userData);
  return response.data; // Return API response data
};

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data; // Return API response data
};

// Login user
const login = async ({ mobile, password, rememberMe }) => {
  const response = await axios.post(`${API_URL}/login`, {
    mobile,
    password,
    rememberMe,
  }, {
    withCredentials: true // Needed if backend sets token cookie
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
const logout = async (token) => {
  const response = await axios.get(`${API_URL}/logout`, {
    headers: {
      Authorization: `Bearer ${token}` // Send token from Redux
    }
  });
  return response.data;
};

const googleLogin = async (authCode) => {
  const response = await axios.post(`${API_URL}/google-client-login`, {
    code: authCode,
  });
  return response.data;
};

export const authService = {
  registerCandidate,
  register,
  login,
  getMe,
  logout,
  googleLogin
};
