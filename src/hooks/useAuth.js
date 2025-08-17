'use client';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser } from '@/store/authThunks';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const checkAuth = async () => {
    if (token && !user) {
      try {
        await dispatch(loadUser()).unwrap();
      } catch (err) {
        console.error("Failed to load user:", err);
        localStorage.removeItem('token');
      }
    }
  };

    useEffect(() => {
    checkAuth();
  }, [token]); 

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token,
    checkAuth,
  };
};