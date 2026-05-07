import Link from 'next/link';
import { TOOLS, SITE } from '@/lib/tools';

function BrandMark({ size = 26 }) {
  return (
    <span
      className="flex items-center justify-center font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: size * 0.26,
        fontSize: size * 0.55,
        letterSpacing: '-0.04em',
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
    <footer className="border-t border-white/[0.06] mt-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <BrandMark size={28} />
              <span className="text-[14.5px] font-semibold text-white tracking-tight">
                PinMyBusiness
              </span>
            </Link>
            <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-sm">
              Beautifully simple business tools - built for founders, freelancers, and small business owners.
            </p>
          </div>

          <div className="col-span-1 md:col-span-3">
            <p className="text-[10.5px] font-semibold text-white uppercase tracking-[0.14em] mb-3">
              Free Tools
            </p>
            <ul className="space-y-2.5">
              {TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link href={t.href} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="text-[10.5px] font-semibold text-white uppercase tracking-[0.14em] mb-3">
              Resources
            </p>
            <ul className="space-y-2.5">
              {RESOURCES.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="text-[10.5px] font-semibold text-white uppercase tracking-[0.14em] mb-3">
              Legal
            </p>
            <ul className="space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-slate-500">
            © {year} {SITE.name}. Always free.
          </p>
          <p className="text-[12px] text-slate-500">
            Built for the US, UK & beyond.
          </p>
        </div>
      </div>
    </footer>
  );
}
