import "./globals.css";
import { inter, yesteryear } from '@/lib/fonts';
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ListenLift",
  description: "Listen Smarter, Grow Faster.",
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
        <Providers>{children}
           <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
