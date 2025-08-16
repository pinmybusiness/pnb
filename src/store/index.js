import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // other reducers here
  },
});

export const RootState = store.getState;
export const AppDispatch = store.dispatch;