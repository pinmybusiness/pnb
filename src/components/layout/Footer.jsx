import Link from 'next/link';
import { Zap } from 'lucide-react';
import { TOOLS, SITE } from '@/lib/tools';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-900">

          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-5">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600">
                <Zap size={14} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="text-[15px] font-bold text-white tracking-tight">
                PinMy<span className="text-indigo-400">Business</span>
              </span>
            </Link>
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-[200px]">
              Free business tools for US entrepreneurs, freelancers, and small businesses.
            </p>
            <p className="mt-4 text-[12px] text-slate-600">
              No account · No data stored · No fees
            </p>
          </div>

          {/* Tools */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Tools</p>
            <ul className="space-y-2.5">
              {TOOLS.map((t) => (
                <li key={t.slug}>
                  <Link href={t.href}
                    className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Resources</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'FAQ', href: '/faq' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Terms of Service', href: '/terms-and-conditions' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-[13px] text-slate-500 hover:text-slate-200 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-slate-600">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="text-[12px] text-slate-700">
            Made for US businesses · Works globally · Always free
          </p>
        </div>
      </div>
    </footer>
  );
}
