// store/slices/analyticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { analyticsAPI } from '../services/api';

// Async thunks
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetch',
  async ({ branchId, period = 'week' }, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getAnalytics(branchId, period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const fetchCustomerHistory = createAsyncThunk(
  'analytics/fetchHistory',
  async ({ branchId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.getCustomerHistory(branchId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer history');
    }
  }
);

export const exportAnalyticsData = createAsyncThunk(
  'analytics/export',
  async ({ branchId, format = 'csv', period = 'week' }, { rejectWithValue }) => {
    try {
      const response = await analyticsAPI.exportData(branchId, format, period);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export data');
    }
  }
);

const initialState = {
  data: {
    totalCustomers: 0,
    servedCustomers: 0,
    leftCustomers: 0,
    waitingCustomers: 0,
    avgWaitTime: 0,
    estimatedRevenueLost: 0,
    period: 'week',
    hourlyData: [],
    peakHours: [],
    customerHistory: []
  },
  loading: false,
  error: null,
  exportLoading: false,
  exportError: null,
  lastUpdated: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
    clearExportError: (state) => {
      state.exportError = null;
    },
    setAnalyticsPeriod: (state, action) => {
      state.data.period = action.payload;
    },
    resetAnalytics: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          ...state.data,
          ...action.payload.data,
          period: action.payload.period || 'week'
        };
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Customer History
      .addCase(fetchCustomerHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data.customerHistory = action.payload.data;
        state.data.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomerHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Export Data
      .addCase(exportAnalyticsData.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })
      .addCase(exportAnalyticsData.fulfilled, (state) => {
        state.exportLoading = false;
      })
      .addCase(exportAnalyticsData.rejected, (state, action) => {
        state.exportLoading = false;
        state.exportError = action.payload;
      });
  }
});

export const { 
  clearAnalyticsError, 
  clearExportError, 
  setAnalyticsPeriod, 
  resetAnalytics 
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

// Selectors
export const selectAnalytics = (state) => state.analytics.data;
export const selectAnalyticsLoading = (state) => state.analytics.loading;
export const selectAnalyticsError = (state) => state.analytics.error;
export const selectExportLoading = (state) => state.analytics.exportLoading;
export const selectLastUpdated = (state) => state.analytics.lastUpdated;
export const selectCustomerHistory = (state) => state.analytics.data.customerHistory;