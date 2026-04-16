'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Clock } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden w-full" style={{ backgroundColor: '#020617' }}>
      {/* Glow blobs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-80px', right: '10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: '0', left: '0',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }}
      />

      {/* Main container - FIXED CENTERING */}
      <div className="relative w-full px-5 sm:px-6 lg:px-8 pt-24 pb-32">
        <div className="max-w-4xl mx-auto text-center">

          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 mx-auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #34d399' }} />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', letterSpacing: '0.02em' }}>
              Free forever · No account · Made for US small businesses
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-black tracking-tight text-white mb-6"
            style={{ fontSize: 'clamp(40px, 6.5vw, 74px)', lineHeight: '1.04', letterSpacing: '-0.03em' }}
          >
            Free Business Tools
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              American Entrepreneurs
            </span>
            <br />
            Actually Use
          </h1>

          {/* Sub */}
          <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            WhatsApp link generator, QR code maker, invoice builder, email signatures, and
            password generator - all free, all instant, all private. No subscriptions. No BS.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-[15px] transition-all"
              style={{
                background: '#4f46e5',
                boxShadow: '0 0 0 0 rgba(99,102,241,0)',
                transition: 'background 0.15s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#4338ca'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.2), 0 4px 20px rgba(79,70,229,0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 0 0 rgba(99,102,241,0)'; }}
            >
              <Zap size={15} strokeWidth={2.5} />
              Explore All 5 Free Tools
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-slate-400 rounded-xl transition-all hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              Learn more
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              { icon: ShieldCheck, text: 'No data stored ever' },
              { icon: Clock,       text: 'Results in seconds' },
              { icon: Zap,         text: '100% browser-based' },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5" style={{ fontSize: '13px', color: '#64748b' }}>
                <Icon size={13} style={{ color: '#818cf8' }} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* Tool quick links */}
        <div className="mt-16 flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#94a3b8',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${tool.bgLight}`}>
                  <Icon size={11} className={tool.textColor} />
                </span>
                {tool.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}