import Link from 'next/link';
import { TOOLS, SITE } from '@/lib/tools';
import NewsletterForm from './NewsletterForm';

function BrandMark({ size = 30 }) {
  return (
    <span
      className="flex items-center justify-center font-black text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: size * 0.24,
        fontSize: size * 0.55,
        letterSpacing: '-0.05em',
      }}
    >
      P
    </span>
  );
}

const RESOURCES = [
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-and-conditions' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        {/* Newsletter band */}
        <div className="py-14 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-md">
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-3">
                Stay in the loop
              </p>
              <h3 className="text-[22px] sm:text-[26px] font-bold text-slate-900 tracking-tight leading-[1.2] mb-2">
                New tools, in your inbox.
              </h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">
                One short email when we ship something new. No spam, no marketing fluff. Unsubscribe anytime.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>

        {/* Main grid */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <BrandMark size={32} />
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">
                PinMyBusiness
              </span>
            </Link>
            <p className="text-[14px] text-slate-600 leading-relaxed max-w-sm mb-6">
              Beautifully simple business tools — built for founders, freelancers, and small business owners across the US, UK, and beyond.
            </p>
            <div className="flex flex-wrap gap-2">
              {['No accounts', 'No fees', 'Privacy-first', 'GDPR-friendly'].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-full"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="col-span-1 md:col-span-3">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.12em] mb-4">Free Tools</p>
            <ul className="space-y-3">
              {TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link href={t.href}
                    className="text-[13.5px] text-slate-600 hover:text-slate-900 transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.12em] mb-4">Resources</p>
            <ul className="space-y-3">
              {RESOURCES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-[13.5px] text-slate-600 hover:text-slate-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.12em] mb-4">Legal</p>
            <ul className="space-y-3">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-[13.5px] text-slate-600 hover:text-slate-900 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="py-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12.5px] text-slate-500">
            © {year} {SITE.name}. Built for businesses in the US, UK & beyond.
          </p>
          <p className="text-[12.5px] text-slate-400">
            Crafted with care · Always free · Always private
          </p>
        </div>
      </div>
    </footer>
  );
}
