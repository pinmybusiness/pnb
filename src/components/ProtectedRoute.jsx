'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }

    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, router, user, requiredRole]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <div>Checking permissions...</div>;
  }

  return children;
}