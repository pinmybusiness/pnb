// app/layout.jsx
import "./globals.css";
import { inter, yesteryear } from "@/lib/fonts";
import { Toaster } from "react-hot-toast";
import ClientHeaderFooter from "./ClientHeaderFooter";
import HeaderWrapper from "./HeaderWrapper";
import Header from "@/components/Header";
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
   openGraph: {
    title: "Call Tracking Software India | FasterQ",
    description:
      "Track & record all sales calls automatically. Works on SIM-based calls. No VoIP required.",
    url: "https://www.fasterq.in", 
    siteName: "FasterQ",
    images: [
      {
        url: "https://www.fasterq.in/images/og-image.webp",
        width: 1200,
        height: 630,
        alt: "FasterQ Call Tracking",
      },
    ],
    type: "website",
  },

  // for WhatsApp / Twitter
  twitter: {
    card: "summary_large_image",
    title: "Call Tracking Software India | FasterQ",
    description:
      "Track & record all sales calls automatically. No VoIP needed.",
    images: ["https://www.fasterq.in/images/og-image.webp"],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FasterQ",
  },

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.fasterq.in/#organization",
      "name": "FasterQ",
      "url": "https://www.fasterq.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.fasterq.in/favicon.png",
        "width": 50,
        "height": 50,
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@fasterq.in",
        "contactType": "customer support",
        "availableLanguage": ["English", "Hindi"],
      },
      "sameAs": [
        "https://www.linkedin.com/company/fasterq",
        "https://twitter.com/fasterqin",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.fasterq.in/#software",
      "name": "FasterQ",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Android",
      "url": "https://www.fasterq.in",
      "description":
        "Automatically track and record all SIMs. Get real-time call logs, CRM sync, and insights for your sales team - no VoIP, no number change.",
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "priceValidUntil": "2026-12-31",
      },
      "publisher": {
        "@id": "https://www.fasterq.in/#organization",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.fasterq.in/#website",
      "url": "https://www.fasterq.in",
      "name": "FasterQ",
      "publisher": {
        "@id": "https://www.fasterq.in/#organization",
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://www.fasterq.in/blog?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

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

        {/* Header rendered outside PersistGate so <a> links appear in HTML source (SSR) */}
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        {children}
         {/* <ChatWidget /> */}
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