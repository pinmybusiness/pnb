'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Check } from 'lucide-react';

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
    a: 'Yes - every tool is fully featured, with no trial expiry, no premium tier, and no locked exports. Costs are covered by simple, non-intrusive advertising.',
  },
  {
    q: 'Do I need to create an account or share my email?',
    a: "No. Open any tool and start using it immediately. We don't ask for your name, email, phone, or any personal information - ever.",
  },
  {
    q: 'Where does my data go when I use a tool?',
    a: 'Nowhere. All processing happens locally in your browser tab. We never see, store, or transmit anything you create.',
  },
  {
    q: 'Can I use the tools commercially?',
    a: 'Absolutely. Every output is yours to use commercially with no attribution, no restrictions, no licensing fees.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[14px] font-medium text-white leading-snug">{q}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-slate-500 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-[13.5px] text-slate-400 leading-[1.7] pr-6">{a}</p>
      )}
    </div>
  );
}

export default function TrustSection() {
  return (
    <>
      {/* Pricing comparison */}
      <section className="py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="fade-up">
              <p className="section-label mb-4">Vs. paid alternatives</p>
              <h2 className="text-[26px] sm:text-[34px] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">
                Most charge $15–$50 a month. <span className="text-slate-400">We charge nothing.</span>
              </h2>
              <p className="text-[15px] text-slate-400 leading-[1.65] mb-6">
                Standard SaaS products lock these basic utilities behind monthly fees and signup walls. We made them free because, for a small business, they should be.
              </p>
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
              >
                Open a tool
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="rounded-xl surface overflow-hidden fade-up delay-2">
              <div className="grid grid-cols-12 px-5 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                <span className="col-span-6 text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Tool</span>
                <span className="col-span-3 text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.12em]">Typical</span>
                <span className="col-span-3 text-right text-[10.5px] font-semibold text-indigo-300 uppercase tracking-[0.12em]">Ours</span>
              </div>
              {COMPARE.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-12 px-5 py-3 items-center ${i !== COMPARE.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                >
                  <p className="col-span-6 text-[13.5px] text-white">{row.label}</p>
                  <span className="col-span-3 text-[13px] text-slate-500 line-through">{row.theirs}</span>
                  <span className="col-span-3 inline-flex items-center justify-end gap-1 text-[13px] font-medium text-emerald-300">
                    <Check size={12} strokeWidth={2.5} />
                    Free
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 border-t border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10 fade-up">
            <p className="section-label mb-4 mx-auto">Frequently asked</p>
            <h2 className="text-[26px] sm:text-[34px] font-semibold text-white tracking-[-0.02em] leading-[1.15] mb-4">
              Questions, answered.
            </h2>
          </div>
          <div className="rounded-xl surface px-5 sm:px-7 fade-up delay-2">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
          <p className="text-center text-[13px] text-slate-500 mt-6">
            Still curious?{' '}
            <Link href="/faq" className="font-medium text-indigo-300 hover:text-indigo-200">See the full FAQ</Link>{' '}
            or{' '}
            <Link href="/contact" className="font-medium text-indigo-300 hover:text-indigo-200">get in touch</Link>.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 text-center fade-up">
          <h2 className="text-[28px] sm:text-[40px] font-semibold text-white tracking-[-0.025em] leading-[1.1] mb-4">
            Start in <span className="gradient-text-accent">10 seconds.</span>
          </h2>
          <p className="text-[15.5px] text-slate-400 leading-[1.6] mb-8 max-w-md mx-auto">
            No account. No credit card. Pick a tool, get your output, get on with your day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors w-full sm:w-auto"
            >
              Open a tool
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-slate-300 hover:text-white rounded-md transition-colors w-full sm:w-auto"
            >
              Read the blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
