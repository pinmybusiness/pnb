// authThunks.js
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
      const userDataResponse = response.data; // { success: true, data: { user, token } }
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      dispatch(setCredentials({ 
        user: userDataResponse.user, 
        token: userDataResponse.token 
      }));
      return userDataResponse.user;
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
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }
      return {
        user: response.data,
        token: response.data.token
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Load user
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error('No token found');
      dispatch(setLoading(true));
      const response = await authService.getMe();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }
      const userDataResponse = response.data.user;
      dispatch(setCredentials({
        user: userDataResponse,
        token // Keep existing token
      }));
      return userDataResponse;
    } catch (error) {
      dispatch(logout()); // Clear Redux state on error
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const state = getState();
      const token = state.auth.token; // Get token from Redux
      if (!token) {
        throw new Error('No token found in Redux');
      }
      const response = await authService.logout(token);
      localStorage.removeItem('token');
      dispatch(logout());
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(setError(error.message || 'Logout failed'));
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Google login
export const googleLoginUser = createAsyncThunk(
  'auth/googleLogin',
  async (authCode, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.googleLogin(authCode);
      if (!response.success) {
        throw new Error(response.message || 'Google login failed');
      }
      const user = response.data; // User is directly in response.data
      const token = response.token; // Token is in response.token
      dispatch(setCredentials({ user, token }));
      return { user, token };
    } catch (error) {
      console.error('Google login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Google login failed');
    } finally {
      dispatch(setLoading(false));
    }
  }
);