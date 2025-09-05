import "./globals.css";
import { inter, yesteryear } from '@/lib/fonts';
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FasterQ.in",
  description: "Find the Right Restaurant Job | India’s #1 Restaurant Job Platform",
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
        <Providers>
          {children}
          <Footer />
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
