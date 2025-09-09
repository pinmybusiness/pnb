//store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import customerReducer from './customerSlice';
import analyticsReducer from './analyticsSlice';

// Configuration for auth persistence
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'user'],
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data)
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    customers: customerReducer,   // non-persisted
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
       serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);