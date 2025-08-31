// store/slices/customerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerAPI } from '../services/api';

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getWaitingList(branchId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const addCustomer = createAsyncThunk(
  'customers/add',
  async ({ branchId, customerData }, { rejectWithValue }) => {
    try {
      const response = await customerAPI.create(branchId, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add customer');
    }
  }
);

export const markCustomerAsServed = createAsyncThunk(
  'customers/markServed',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerAPI.markAsServed(customerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as served');
    }
  }
);

export const markCustomerAsLeft = createAsyncThunk(
  'customers/markLeft',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerAPI.markAsLeft(customerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as left');
    }
  }
);

export const fetchCustomerHistory = createAsyncThunk(
  'customers/fetchHistory',
  async ({ branchId, params }, { rejectWithValue }) => {
    try {
      const response = await customerAPI.getHistory(branchId, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    history: [],
    loading: false,
    error: null,
    historyLoading: false,
    historyError: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearHistoryError: (state) => {
      state.historyError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add customer
      .addCase(addCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.data);
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
     // Mark as served - UPDATED
    .addCase(markCustomerAsServed.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload.data._id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
      // Also update analytics if needed
    })
    
    // Mark as left - UPDATED  
    .addCase(markCustomerAsLeft.fulfilled, (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload.data._id);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
      // Also update analytics if needed
    })
      // Fetch history
      .addCase(fetchCustomerHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchCustomerHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.data;
      })
      .addCase(fetchCustomerHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  },
});

export const { clearError, clearHistoryError } = customerSlice.actions;
export default customerSlice.reducer;