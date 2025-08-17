import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { setCredentials, logout, setLoading, setError } from './authSlice';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(userData);
      dispatch(setCredentials({ 
        user: response.data.user, 
        token: response.data.token 
      }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.login(userData);
      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No token found");
      
      dispatch(setLoading(true));
      const response = await authService.getMe();
      dispatch(setCredentials({
        user: response.data,
        token: token // मौजूदा टोकन को बनाए रखें
      }));
      return response.data;
    } catch (error) {
      localStorage.removeItem('token'); // इनवैलिड टोकन को हटाएं
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      await authService.logout();
      localStorage.removeItem('token'); // टोकन साफ करें
      dispatch(logout());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);