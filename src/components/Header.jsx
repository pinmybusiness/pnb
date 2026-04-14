// Server Component — no "use client"
// All <a> tags here are rendered in HTML source (SSR) for SEO and crawlers.
// HeaderClient handles all interactive behavior (hover, dropdowns, auth).

import HeaderClient from "./HeaderClient";

// Paths kept in sync with HeaderClient.jsx and the sitemap.
const megaMenuItems = [
  { label: "Overview", path: "/features" },
  { label: "Inbound Call Tracking", path: "/features/inbound-call-tracking" },
  { label: "Outbound Call Tracking", path: "/features/outbound-call-tracking" },
  { label: "Missed Call Tracker", path: "/features/missed-call-tracker" },
  { label: "Call Analytics Dashboard", path: "/features/call-analytics-dashboard" },
  { label: "Call Recording for Business", path: "/call-recording/call-recording-auto" },
];

const navLinks = [
  { name: "ROI Calculator", path: "/call-tracker-roi" },
];

export default function Header({ activeLink = "" }) {
  return (
    <>
      {/*
        SSR nav — visually hidden, always present in HTML source.
        Googlebot and other crawlers read these <a> tags for indexing.
        sr-only = screen-reader accessible, not visible to users.
      */}
      <nav aria-label="site-navigation" className="sr-only">
        {/* Core pages */}
        <a href="/">FasterQ Home</a>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
        <a href="/blog">Blog</a>
        <a href="/faq">FAQ</a>
        <a href="/download">Download App</a>

        {/* Features */}
        <a href="/features">Features Overview</a>
        {megaMenuItems.map((item) => (
          <a key={item.path} href={item.path}>
            {item.label}
          </a>
        ))}
        <a href="/features/sim-call-tracking">SIM Call Tracking</a>
        <a href="/features/call-recording-software">Call Recording Software</a>
        <a href="/features/call-analytics-dashboard">Call Analytics Dashboard</a>

        {/* Call Recording */}
        <a href="/call-recording">Call Recording</a>
        <a href="/call-recording/call-recording-app">Call Recording App</a>
        <a href="/call-recording/call-recording-backup">Call Recording Backup</a>
        <a href="/call-recording/google-dialer-vs-oem-call-recording">Google Dialer vs OEM Call Recording</a>

        {/* Mobile Call Tracking */}
        <a href="/mobile-call-tracking">Mobile Call Tracking</a>
        <a href="/mobile-call-tracking/mobile-call-dashboard">Mobile Call Dashboard</a>
        <a href="/mobile-call-tracking/track-calls-by-number">Track Calls by Number</a>
        <a href="/mobile-call-tracking/call-details-application">Call Details Application</a>

        {/* Industries */}
        <a href="/industries">Industries</a>
        <a href="/industries/real-estate">Real Estate Call Tracking</a>

        {/* Other nav links */}
        {navLinks.map((link) => (
          <a key={link.path} href={link.path}>
            {link.name}
          </a>
        ))}
        <a href="/contact">Book a Demo</a>

        {/* Legal */}
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms-and-conditions">Terms and Conditions</a>
      </nav>

      {/* Interactive header — client component (mega menu, mobile menu, auth) */}
      <HeaderClient activeLink={activeLink} />
    </>
  );
}
