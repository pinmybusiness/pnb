'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login',
  loadingComponent = null 
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, isInitialized } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth to be initialized
      if (!isInitialized) {
        return;
      }

      setIsChecking(false);

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        const currentPath = pathname || window.location?.pathname || '/';
        const redirectUrl = `${fallbackPath}?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectUrl);
        return;
      }

      // Check role-based access if roles are specified
      if (requiredRoles.length > 0 && user) {
        const userRole = user.role;
        const hasRequiredRole = requiredRoles.includes(userRole);
        
        if (!hasRequiredRole) {
          router.push('/unauthorized');
          return;
        }
      }

      // Legacy role check (for backward compatibility)
      if (user?.role < 0 || user?.role > 9) {
        router.push('/unauthorized');
        return;
      }
    };

    checkAuth();
  }, [isAuthenticated, isInitialized, user, requiredRoles, router, fallbackPath, pathname]);

  // Show loading spinner while checking auth
  if (isLoading || isChecking || !isInitialized) {
    return loadingComponent || (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated and authorized, render children
  if (isAuthenticated && user?.role >= 0 && user?.role <= 9) {
    return children;
  }

  return null;
}