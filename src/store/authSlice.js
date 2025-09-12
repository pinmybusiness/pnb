import { createSlice } from '@reduxjs/toolkit';
import { registerCandidate, loginUser, loadUser, logoutUser, googleLoginUser } from './authThunks';

// Get token safely for SSR
const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const initialState = {
  user: null,
  token: getInitialToken(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerCandidate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCandidate.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          mobile: action.payload.mobile,
          email: action.payload.email,
          role: action.payload.role,
          roleName: action.payload.roleName,
          candidateProfile: action.payload.candidateProfile,
        };
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.isLoading = false;
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
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          mobile: action.payload.mobile,
          email: action.payload.email,
          role: action.payload.role,
          roleName: action.payload.roleName,
          candidateProfile: action.payload.candidateProfile,
        };
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          mobile: action.payload.mobile,
          email: action.payload.email,
          role: action.payload.role,
          roleName: action.payload.roleName,
          candidateProfile: action.payload.candidateProfile,
        };
        state.isLoading = false;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
      })
      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload.user._id,
          name: action.payload.user.name,
          mobile: action.payload.user.mobile,
          email: action.payload.user.email,
          role: action.payload.user.role,
          roleName: action.payload.user.roleName,
          candidateProfile: action.payload.user.candidateProfile,
        };
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        state.isLoading = false;
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;