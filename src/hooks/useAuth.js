// hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { logoutUser } from '../store/authThunks';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error, isInitialized } = useSelector((state) => state.auth);

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    return roles.includes(user?.role);
  }, [user]);

  const isCandidate = useCallback(() => {
    return user?.role === 10;
  }, [user]);

  const isBranchManager = useCallback(() => {
    return user?.role === 6;
  }, [user]);

  const isRestaurantAdmin = useCallback(() => {
    return [3, 4, 5].includes(user?.role);
  }, [user]);

  const isCompanyAdmin = useCallback(() => {
    return [0, 1, 2].includes(user?.role);
  }, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    logout,
    hasRole,
    hasAnyRole,
    isCandidate,
    isBranchManager,
    isRestaurantAdmin,
    isCompanyAdmin,
  };
};
