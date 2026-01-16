"use client"
// components/AuthProvider.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../store/authThunks';
import { setInitialized, clearLegacyTokens } from '../store/authSlice';

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear any legacy tokens from localStorage
    dispatch(clearLegacyTokens());
    
    // Initialize auth state by checking cookies
    const initAuth = async () => {
      try {
        await dispatch(initializeAuth()).unwrap();
      } catch (error) {
        console.log('Auth initialization failed - user not logged in');
      } finally {
        // Always set initialized to true, even if auth fails
        dispatch(setInitialized());
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthProvider;
