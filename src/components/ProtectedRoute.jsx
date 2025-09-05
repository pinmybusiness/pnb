'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
      return;
    }
    
    // Agar specific role required hai aur user ka role match nahi karta
    if (!isLoading && token && requiredRole && user?.role !== requiredRole) {
      router.push('/unauthorized');
    }
  }, [isLoading, token, user, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Agar authenticated hai aur (koi role required nahi YA role match karta hai)
  if (token && (!requiredRole || user?.role === requiredRole)) {
    return children;
  }

  return null;
}