'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboardRoute && <Header />}
       <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {children}
       </GoogleOAuthProvider>
      {!isDashboardRoute && <Footer />}
    </>
  );
}
