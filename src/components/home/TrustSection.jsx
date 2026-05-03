'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight, Check } from 'lucide-react';

const COMPARE = [
  { label: 'QR Code Generator',     theirs: '$15+/mo' },
  { label: 'Invoice Software',      theirs: '$30+/mo' },
  { label: 'Email Signature Tools', theirs: '$10+/mo' },
  { label: 'WhatsApp Link Builder', theirs: '$9+/mo'  },
  { label: 'Password Generator',    theirs: '$3+/mo'  },
];

const FAQS = [
  {
    q: 'Are these tools genuinely free?',
    a: 'Yes — every tool is fully featured, with no trial expiry, no premium tier, and no locked exports. Costs are covered by simple, non-intrusive advertising.',
  },
  {
    q: 'Do I need to create an account or share my email?',
    a: "No. Open any tool and start using it immediately. We don't ask for your name, email, phone, or any personal information — ever.",
  },
  {
    q: 'Where does my data go when I use a tool?',
    a: 'Nowhere. All processing happens locally in your browser tab. We never see, store, or transmit anything you create. GDPR-friendly by design.',
  },
  {
    q: 'Can I use the tools commercially in the US or UK?',
    a: 'Absolutely. Every output — WhatsApp links, QR codes, invoices, signatures — is yours to use commercially with no attribution, no restrictions, no licensing fees.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-slate-900 leading-snug">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-[14px] text-slate-600 leading-[1.65] pr-6 fade-up">{a}</p>
      )}
    </div>
  );
}

export default function TrustSection() {
  return (
    <>
      {/* Pricing comparison */}
      <section className="py-24 sm:py-32 bg-slate-50/60 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left copy */}
            <div>
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-4">
                Vs. paid alternatives
              </p>
              <h2 className="text-[34px] sm:text-[44px] font-black text-slate-900 tracking-[-0.035em] leading-[1.05] mb-5">
                Most charge $15–$50 a month.{' '}
                <span className="gradient-text-dark">We charge nothing.</span>
              </h2>
              <p className="text-[16.5px] text-slate-600 leading-[1.6] mb-8">
                Standard SaaS products lock these basic utilities behind monthly fees, signup walls, and feature tiers. We made them free because, for a small business, they should be.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 px-5 py-3 text-[14.5px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Open a tool — $0
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Right table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
              <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 border-b border-slate-200">
                <span className="col-span-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.12em]">Tool</span>
                <span className="col-span-3 text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.12em]">Typical</span>
                <span className="col-span-3 text-right text-[10.5px] font-bold text-indigo-600 uppercase tracking-[0.12em]">Ours</span>
              </div>

              {COMPARE.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-12 px-6 py-4 items-center ${i !== COMPARE.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <p className="col-span-6 text-[14px] font-semibold text-slate-900">{row.label}</p>
                  <span className="col-span-3 text-[14px] text-slate-400 line-through font-medium">{row.theirs}</span>
                  <span className="col-span-3 inline-flex items-center justify-end gap-1 text-[14px] font-bold text-emerald-600">
                    <Check size={13} strokeWidth={3} />
                    Free
                  </span>
                </div>
              ))}

              <Link
                href="/tools"
                className="block px-6 py-4 bg-slate-900 hover:bg-slate-800 transition-colors group"
              >
                <span className="flex items-center justify-center gap-1.5 text-[14px] font-semibold text-white">
                  Browse all 5 tools
                  <ArrowUpRight size={14} strokeWidth={2.5} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.14em] mb-4">
              Frequently asked
            </p>
            <h2 className="text-[34px] sm:text-[44px] font-black text-slate-900 tracking-[-0.035em] leading-[1.05] mb-5">
              Questions, <span className="gradient-text-dark">answered.</span>
            </h2>
            <p className="text-[16.5px] text-slate-600 leading-[1.55]">
              Everything you might want to know before opening your first tool.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-6 sm:px-8">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>

          <p className="text-center text-[13.5px] text-slate-500 mt-8">
            Still curious?{' '}
            <Link href="/faq" className="font-semibold text-indigo-600 hover:text-indigo-700">
              See the full FAQ
            </Link>{' '}or{' '}
            <Link href="/contact" className="font-semibold text-indigo-600 hover:text-indigo-700">
              get in touch
            </Link>.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24 sm:pb-32 bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="relative rounded-[28px] overflow-hidden bg-slate-950 px-8 sm:px-16 py-20 sm:py-24">
            {/* Top glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(99,102,241,0.30) 0%, transparent 70%), radial-gradient(ellipse 50% 35% at 80% 100%, rgba(139,92,246,0.18) 0%, transparent 70%)',
              }}
            />
            {/* Grid */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            <div className="relative max-w-3xl mx-auto text-center">
              <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-[0.14em] mb-5">
                Ready when you are
              </p>
              <h2 className="text-[36px] sm:text-[52px] font-black text-white tracking-[-0.035em] leading-[1.05] mb-5">
                Start in <span className="gradient-text">10 seconds.</span>
              </h2>
              <p className="text-[17px] text-slate-300 leading-[1.55] mb-10 max-w-lg mx-auto">
                No account. No credit card. No catch. Pick a tool, get your output, get on with your day.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-1.5 px-7 py-3.5 text-[15px] font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md"
                >
                  Open a Tool
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 px-6 py-3.5 text-[14.5px] font-semibold text-slate-300 hover:text-white rounded-xl border border-white/10 hover:border-white/25 transition-all"
                >
                  Read the blog
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 pt-8 border-t border-white/10">
                {[
                  { val: '5',     label: 'Free tools' },
                  { val: '0',     label: 'Accounts needed' },
                  { val: '$0',    label: 'Cost forever' },
                  { val: '50+',   label: 'Countries served' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[24px] font-black text-white tracking-tight">{s.val}</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-[0.12em] mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
