// app/layout.jsx
import "./globals.css";
import { inter, yesteryear } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";
import ClientHeaderFooter from "./ClientHeaderFooter";

export const metadata = {
  title: "Restaurant Jobs in India for Students & Freshers | FasterQ",
  description:
    "Find verified restaurant jobs in India for waiter, chef, manager, captain, and barista roles for students and freshers. Apply fast and start your hospitality career with FasterQ.",
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