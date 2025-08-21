// authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { setCredentials, logout, setLoading } from './authSlice';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(userData);

      // response.data.data se user + token nikalna
      const userDataResponse = response.data.data;

      dispatch(setCredentials({ 
        user: userDataResponse, 
        token: userDataResponse.token 
      }));

      return userDataResponse;
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

      // ✅ API structure: { success: true, data: {...user, token} }
      const userDataResponse = response.data;

      return {
        user: userDataResponse,
        token: userDataResponse.token
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

      // yaha bhi data andar hoga
      const userDataResponse = response.data.data;

      dispatch(setCredentials({
        user: userDataResponse,
        token: token // existing token rakho
      }));

      return userDataResponse;
    } catch (error) {
      localStorage.removeItem('token');
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
      localStorage.removeItem('token');
      dispatch(logout());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);
