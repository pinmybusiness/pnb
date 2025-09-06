import "./globals.css";
import { inter, yesteryear } from '@/lib/fonts';
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import ClientHeaderFooter from "./ClientHeaderFooter";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "Restaurant Jobs in India for Students & Freshers | FasterQ",
  description: "Find verified restaurant jobs in India for waiter, chef, manager, captain, and barista roles for students and freshers. Apply fast and start your hospitality career with FasterQ.",
   icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`$ ${inter.variable} ${yesteryear.variable}`}>
     <head>
       {/* Favicon with proper public path */}
        <link rel="icon" type="image/png" href="/favicon.png" />
     </head>
      <body
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <Providers>
            <Toaster position="top-center" />
            <ClientHeaderFooter position="header" />
            {children}
            <ClientHeaderFooter position="footer" />
          </Providers>
        </GoogleOAuthProvider>
        {/* <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers> */}
      </body>
    </html>
  );
}
