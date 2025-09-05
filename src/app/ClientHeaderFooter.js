// app/ClientHeaderFooter.jsx (Client Component)
'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from '@/components/Footer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

export default function ClientHeaderFooter({ position }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isDashboardRoute) return null;

  return (
    <Providers>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Toaster position="top-center" />
        {position === "header" && <Header />}
        {position === "footer" && <Footer />}
      </GoogleOAuthProvider>
    </Providers>
  );
}
