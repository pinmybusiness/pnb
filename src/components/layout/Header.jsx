'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

function BrandMark({ size = 28 }) {
  return (
    <span
      className="flex items-center justify-center font-black text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        borderRadius: size * 0.24,
        fontSize: size * 0.55,
        letterSpacing: '-0.05em',
        boxShadow: '0 4px 12px -2px rgba(79, 70, 229, 0.35)',
      }}
    >
      P
    </span>
  );
}

const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setOpen(false); setToolsOpen(false); }, [pathname]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/85 backdrop-blur-xl border-b border-slate-200/70'
          : 'bg-white/0 border-b border-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <BrandMark size={30} />
            <span className="text-[15.5px] font-bold text-slate-900 tracking-tight">
              PinMyBusiness
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen((v) => !v)}
                className={cn(
                  'flex items-center gap-1 px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors',
                  isActive('/tools') || toolsOpen
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Tools
                <ChevronDown
                  size={13}
                  className={cn('transition-transform duration-200 text-slate-400', toolsOpen && 'rotate-180')}
                />
              </button>

              {toolsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[360px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-2 z-50 fade-up">
                    <div className="px-3 py-2 mb-1 flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">Free Tools</p>
                      <Link
                        href="/tools"
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                        onClick={() => setToolsOpen(false)}
                      >
                        View all →
                      </Link>
                    </div>
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.slug}
                          href={tool.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <span className={cn('flex items-center justify-center w-9 h-9 rounded-lg shrink-0', tool.bgLight)}>
                            <Icon size={16} className={tool.textColor} strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{tool.name}</p>
                            <p className="text-[11.5px] text-slate-500 truncate">{tool.tagline}</p>
                          </div>
                          <ArrowUpRight size={13} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3.5 py-2 rounded-lg text-[14px] font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Contact
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Open a Tool
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-5 py-5 space-y-1 fade-up">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] px-3 pb-2">Free Tools</p>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.slug} href={tool.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className={cn('flex items-center justify-center w-9 h-9 rounded-lg shrink-0', tool.bgLight)}>
                  <Icon size={16} className={tool.textColor} strokeWidth={1.75} />
                </span>
                <span className="text-[13.5px] font-semibold text-slate-800">{tool.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-slate-100 space-y-1">
            {[...NAV_LINKS, { label: 'Contact', href: '/contact' }].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex px-3 py-2.5 text-[14px] font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                {l.label}
              </Link>
            ))}
            <Link
              href="/tools"
              className="mt-3 flex items-center justify-center gap-1.5 px-4 py-3 text-[14px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
            >
              Open a Tool
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
