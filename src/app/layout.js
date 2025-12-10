// app/layout.jsx
import "./globals.css";
import { inter, yesteryear } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";
import ClientHeaderFooter from "./ClientHeaderFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata = {
  title: "Call Tracking Software India | Track & Record All Sales Calls",
  description:
    "Automatically track and record all SIMs. Get real-time call logs, CRM sync, and insights for your sales team - no VoIP, no number change.",
  icons: {
    icon: "/favicon.png",
  },
  manifest: '/manifest.json',
  themeColor: '#FF5211',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FasterQ',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${yesteryear.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#FF5211" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>

        {/* Move Providers to individual pages or components that need them */}
        <ClientHeaderFooter position="header" />
        {children}
        <WhatsAppButton />
        <ClientHeaderFooter position="footer" />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}