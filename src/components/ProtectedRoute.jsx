'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { user, token, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
      if (!isLoading) {
        // If not logged in
        if (!token) {
          router.push('/login');
          return;
        }

        // If user role is not between 0–9
        if (user?.role < 0 || user?.role > 9) {
          router.push('/unauthorized');
          return;
        }
      }
    }, [isLoading, token, user, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      );
    }

    // If authenticated and role is between 0–9
    if (token && user?.role >= 0 && user?.role <= 9) {
      return children;
    }

  return null;
}