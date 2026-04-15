import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.fasterq.phone&hl=en_IN";

const LINKS = {
  product: [
    { name: "Call Management", href: "https://www.fasterq.in/call-management-software" },
    { name: "Download App", href: PLAY_STORE_URL, external: true },
    { name: "FAQ", href: "/faq" },
    { name: "Data Security", href: "/data-security" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
};

const LinkedInSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const FacebookSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const SOCIALS = [
  { Icon: LinkedInSVG, href: "https://www.linkedin.com/company/fasterq", label: "LinkedIn" },
  { Icon: InstagramSVG, href: "https://www.instagram.com/fasterq.in", label: "Instagram" },
  { Icon: FacebookSVG, href: "https://www.facebook.com/fasterqin", label: "Facebook" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-gray-400 border-t border-white/5">

      {/* ── CTA STRIP ── */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#FF5211] font-semibold mb-1">
              Built for every team
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Every team call tracked.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5211] to-orange-400">
                Nothing missed.
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#FF5211] hover:bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-black hover:bg-[#111] border border-white/15 hover:border-white/30 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-black/40 group"
            >
              {/* Official Google Play icon */}
              <svg className="w-7 h-7 shrink-0" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.07 4.28C6.4 4.65 6 5.37 6 6.23V41.77C6 42.63 6.4 43.35 7.07 43.72L7.27 43.91L26.56 24.62V24.38L7.27 5.09L7.07 4.28Z" fill="url(#a)"/>
                <path d="M33.1 31.18L26.56 24.62V24.38L33.1 17.82L33.34 17.96L41.12 22.37C43.29 23.6 43.29 25.4 41.12 26.63L33.34 31.04L33.1 31.18Z" fill="url(#b)"/>
                <path d="M33.34 31.04L26.56 24.5L7.07 43.72C7.8 44.43 8.97 44.52 10.29 43.77L33.34 31.04Z" fill="url(#c)"/>
                <path d="M33.34 17.96L10.29 5.23C8.97 4.48 7.8 4.57 7.07 5.28L26.56 24.5L33.34 17.96Z" fill="url(#d)"/>
                <defs>
                  <linearGradient id="a" x1="24.8" y1="5.67" x2="-5.84" y2="24.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00A0FF"/>
                    <stop offset="0.01" stopColor="#00A1FF"/>
                    <stop offset="0.26" stopColor="#00BEFF"/>
                    <stop offset="0.51" stopColor="#00D2FF"/>
                    <stop offset="0.76" stopColor="#00DFFF"/>
                    <stop offset="1" stopColor="#00E3FF"/>
                  </linearGradient>
                  <linearGradient id="b" x1="43.83" y1="24.5" x2="5.64" y2="24.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFE000"/>
                    <stop offset="0.41" stopColor="#FFBD00"/>
                    <stop offset="0.78" stopColor="#FFA500"/>
                    <stop offset="1" stopColor="#FF9C00"/>
                  </linearGradient>
                  <linearGradient id="c" x1="29.29" y1="27.28" x2="-8.45" y2="64.63" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FF3A44"/>
                    <stop offset="1" stopColor="#C31162"/>
                  </linearGradient>
                  <linearGradient id="d" x1="1.64" y1="-9.4" x2="18.97" y2="8.19" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#32A071"/>
                    <stop offset="0.07" stopColor="#2DA771"/>
                    <stop offset="0.48" stopColor="#15CF74"/>
                    <stop offset="0.8" stopColor="#06E775"/>
                    <stop offset="1" stopColor="#00F076"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-gray-400 group-hover:text-gray-300 uppercase tracking-wider transition-colors">Get it on</span>
                <span className="text-sm font-semibold text-white mt-0.5">Google Play</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Image
              src="/logo-white.png"
              alt="FasterQ"
              width={140}
              height={42}
              className="object-contain"
            />
            <p className="text-sm text-gray-400 leading-relaxed max-w-[220px]">
              Smart call tracking built for modern sales teams.
            </p>
            <a
              href="mailto:info@fasterq.in"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#FF5211] transition-colors mt-1"
            >
              <Mail className="w-4 h-4" />
              info@fasterq.in
            </a>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
              Resources
            </p>
            <ul className="space-y-3">
              {LINKS.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
              Company
            </p>
            <ul className="space-y-3">
              {LINKS.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-5">
              Follow Us
            </p>
            <div className="flex gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#FF5211] border border-white/5 hover:border-[#FF5211] transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span className="text-gray-400">&copy; {currentYear} FasterQ. All rights reserved.</span>
          <span className="hidden sm:block text-gray-500">
            Made with ♥ in Bengaluru
          </span>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">Terms</Link>
            <Link href="/data-security" className="text-gray-400 hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
