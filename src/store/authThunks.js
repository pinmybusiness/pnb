import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { setCredentials, logout, setLoading, setError } from './authSlice';

// Register user
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.register(userData);
    dispatch(setCredentials({ user: response, token: response.token }));
    dispatch(setLoading(false));
    return response;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
    throw error;
  }
};

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.login(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await authService.getMe();
    dispatch(setCredentials({ user: response, token: response.token }));
    dispatch(setLoading(false));
    return response;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
    throw error;
  }
};

// Logout user
export const logoutUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await authService.logout();
    dispatch(logout());
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    dispatch(setLoading(false));
    throw error;
  }
};