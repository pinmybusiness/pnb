'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

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

const NAV_LINKS = [
  { label: 'Tools', href: '/tools' },
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
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-colors duration-200',
        scrolled
          ? 'bg-[#0e1015]/85 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <BrandMark size={26} />
            <span className="text-[14.5px] font-semibold text-white tracking-tight">
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
                  'flex items-center gap-1 px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors',
                  isActive('/tools') || toolsOpen
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                Tools
                <ChevronDown
                  size={12}
                  className={cn('transition-transform duration-150', toolsOpen && 'rotate-180')}
                />
              </button>

              {toolsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[340px] surface-2 rounded-xl p-2 z-50 fade-up shadow-2xl shadow-black/60">
                    <div className="px-2 pt-1.5 pb-1 flex items-center justify-between">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.14em]">
                        Free tools
                      </p>
                      <Link
                        href="/tools"
                        className="text-[11px] font-medium text-indigo-300 hover:text-indigo-200"
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
                          className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group"
                        >
                          <span className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-md shrink-0 border',
                            tool.tintBg, tool.tintBorder
                          )}>
                            <Icon size={14} className={tool.tintText} strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-white">{tool.name}</p>
                            <p className="text-[11.5px] text-slate-500 truncate">{tool.tagline}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {NAV_LINKS.filter((l) => l.href !== '/tools').map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-[13.5px] font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/contact"
              className="text-[13.5px] font-medium text-slate-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Contact
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-[13px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
            >
              Open a tool
              <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-slate-200 hover:bg-white/[0.05] transition-colors"
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-[#0e1015]/97 backdrop-blur-md border-t border-white/[0.06] max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-5 py-5 space-y-1">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.14em] px-2 pb-2">
              Free tools
            </p>
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  <span className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-md shrink-0 border',
                    tool.tintBg, tool.tintBorder
                  )}>
                    <Icon size={16} className={tool.tintText} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-white">{tool.name}</p>
                    <p className="text-[12px] text-slate-500 truncate">{tool.tagline}</p>
                  </div>
                </Link>
              );
            })}
            <div className="pt-4 mt-3 border-t border-white/[0.06] space-y-1">
              {[...NAV_LINKS.filter(l => l.href !== '/tools'), { label: 'Contact', href: '/contact' }].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex px-3 py-2.5 text-[14px] font-medium text-slate-300 rounded-lg hover:bg-white/[0.04] hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/tools"
                className="mt-3 flex items-center justify-center gap-1 px-4 py-3 text-[14px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
              >
                Open a tool
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
