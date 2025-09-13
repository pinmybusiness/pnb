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
  whitelist: ['token', 'user'], // Persist only token and user
  serialize: (data) => JSON.stringify(data),
  deserialize: (data) => JSON.parse(data),
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Factory function to create a new store for each request
export const makeStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: persistedAuthReducer,
      customers: customerReducer,
      analytics: analyticsReducer,
    },
    preloadedState: initialState, // Allow server to pass initial state
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore redux-persist actions for serializable check
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH'],
        },
      }),
    devTools: process.env.NODE_ENV !== 'production', // Enable DevTools in development
  });
};

// Client-side singleton store (optional, for client-side use)
export const store = makeStore();
export const persistor = persistStore(store);

// Type exports for TypeScript
// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore['getState']>;
// export type AppDispatch = AppStore['dispatch'];