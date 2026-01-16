// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, googleLoginUser, registerCandidate } from './authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage token (migration cleanup)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    // Migration helper to clear old token storage
    clearLegacyTokens: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
     // Register Candidate cases
    .addCase(registerCandidate.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(registerCandidate.fulfilled, (state, action) => {
      state.user = action.payload.data;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(registerCandidate.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        // Clear legacy tokens on successful login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        // Clear legacy tokens on successful login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCredentials, 
  logout, 
  setLoading, 
  setError, 
  clearError, 
  setInitialized,
  clearLegacyTokens 
} = authSlice.actions;

export default authSlice.reducer;