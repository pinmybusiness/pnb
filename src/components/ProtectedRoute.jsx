'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

    // console.log("token", token)

 useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated]);


  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>;
  }

 return isAuthenticated ? children : null;
}