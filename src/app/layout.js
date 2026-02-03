// app/layout.jsx
import "./globals.css";
import { inter, yesteryear } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";
import ClientHeaderFooter from "./ClientHeaderFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import Script from "next/script";

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
    const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en" className={`${inter.variable} ${yesteryear.variable}`}>
    <head>
      <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#FF5211" />
      <link rel="icon" type="image/png" href="/favicon.png" />

        {/* Microsoft Clarity – ONLY in Production */}
        {isProduction && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ux8nquyd1j");
            `}
          </Script>
        )}
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