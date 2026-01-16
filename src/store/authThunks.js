// authThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { setCredentials, logout, setLoading, setError, setInitialized } from './authSlice';

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.register(userData);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      dispatch(setCredentials({ 
        user: response.data
      }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Register candidate
export const registerCandidate = createAsyncThunk(
  'auth/registerCandidate',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.registerCandidate(userData);
      if (!response.success) {
        throw new Error(response.message || 'Candidate registration failed');
      }
      const { data } = response;
      dispatch(setCredentials({
        user: {
          _id: data._id,
          name: data.name,
          mobile: data.mobile,
          email: data.email,
          role: data.role,
          roleName: data.roleName,
          candidateProfile: data.candidateProfile,
        }
      }));
      return data; // Return full data for flexibility
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
      console.log("Login response:", response.data);
      
      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const userDataResponse = response.data;
      
      // Common user data for all roles
      const commonUserData = {
        _id: userDataResponse._id,
        name: userDataResponse.name,
        mobile: userDataResponse.mobile,
        email: userDataResponse.email,
        role: userDataResponse.role,
        roleName: userDataResponse.roleName
      };

      // Add role-specific data
      if (userDataResponse.role === 10) { // Candidate
        commonUserData.candidateProfile = userDataResponse.candidateProfile;
      } else if (userDataResponse.role === 6) { // Branch Manager
        commonUserData.branch = userDataResponse.branch;
        commonUserData.restaurant = userDataResponse.restaurant;
      }
      // Add more role-specific conditions as needed

      return {
        user: commonUserData
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Initialize auth state (check if user is authenticated via cookies)
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      // Try to get current user using cookies
      const response = await authService.getMe();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }
      
      dispatch(setCredentials({
        user: response.data
      }));
      
      return response.data;
    } catch (error) {
      // Don't treat as error - user might not be logged in
      dispatch(setInitialized());
      return null;
    }
  }
);

// Load user (legacy - for backward compatibility)
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.getMe();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }
      const userDataResponse = response.data;
      dispatch(setCredentials({
        user: userDataResponse
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
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.logout();
      dispatch(logout());
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(setError(error.message || 'Logout failed'));
      // Still logout locally even if server call fails
      dispatch(logout());
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
      dispatch(setCredentials({ user }));
      return { user };
    } catch (error) {
      console.error('Google login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Google login failed');
    } finally {
      dispatch(setLoading(false));
    }
  }
);