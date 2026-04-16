'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Zap } from 'lucide-react';
import { TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';

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
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-slate-100'
          : 'bg-white border-b border-slate-100'
      )}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-[60px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 shadow-sm shadow-indigo-200">
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-bold text-slate-900 tracking-tight">
              PinMy<span className="text-indigo-600">Business</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen((v) => !v)}
                className={cn(
                  'flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive('/tools')
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                Free Tools
                <ChevronDown size={13} className={cn('transition-transform duration-200', toolsOpen && 'rotate-180')} />
              </button>

              {toolsOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setToolsOpen(false)} />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[320px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-2 z-50">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Free Tools</p>
                    </div>
                    {TOOLS.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.slug}
                          href={tool.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                        >
                          <span className={cn('flex items-center justify-center w-8 h-8 rounded-lg shrink-0', tool.bgLight)}>
                            <Icon size={15} className={tool.textColor} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{tool.name}</p>
                            <p className="text-[11px] text-slate-400 truncate">{tool.tagline}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {[{ label: 'Blog', href: '/blog' }, { label: 'Pricing', href: '#', badge: 'Free' }, { label: 'About', href: '/about' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(item.href) && item.href !== '#'
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                )}
              >
                {item.label}
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wide">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tools"
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-sm"
            >
              <Zap size={13} strokeWidth={2.5} />
              Try Free Tools
            </Link>
          </div>

          {/* Mobile */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-5 py-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2">Free Tools</p>
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.slug} href={tool.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className={cn('flex items-center justify-center w-8 h-8 rounded-lg shrink-0', tool.bgLight)}>
                  <Icon size={15} className={tool.textColor} />
                </span>
                <span className="text-[13px] font-semibold text-slate-800">{tool.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 space-y-1">
            {[{ label: 'Blog', href: '/blog' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
