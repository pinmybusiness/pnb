'use client';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser, logoutUser } from '../store/authThunks';
import { useEffect } from 'react';

export const useAuth = () => {
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && token) {
      dispatch(loadUser());
    }
  }, [dispatch, user, token]);

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    token,
    isLoading,
    error,
    logout,
    isAuthenticated: !!user,
  };
};