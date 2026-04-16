'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { TOOLS } from '@/lib/tools';

const FAQS = [
  {
    q: 'Are these tools really 100% free?',
    a: 'Yes. No trial, no freemium, no hidden upgrade. Every tool is fully functional for free, forever. We cover costs through advertising — you never pay a cent.',
  },
  {
    q: 'Do I need to create an account or give my email?',
    a: "No. Open any tool and start using it immediately. We don't ask for your name, email, phone, or any personal information — ever.",
  },
  {
    q: 'Where does my data go when I use these tools?',
    a: 'Nowhere. All processing happens locally in your browser tab. When you close the tab, everything is gone. We have zero access to anything you create.',
  },
  {
    q: 'Can I use these tools for my US business legally?',
    a: 'Absolutely. These tools generate standard outputs — WhatsApp links, QR codes, invoice PDFs, HTML email signatures — that you own fully and can use commercially without restriction.',
  },
  {
    q: "Why are these tools free? What's the catch?",
    a: "No catch. We display non-intrusive ads on the site to cover hosting costs. The tools themselves will always be free. We believe basic business utilities shouldn't cost money.",
  },
  {
    q: 'Do the tools work outside the US?',
    a: 'Yes — we support international phone formats (33 country codes), 18 global currencies, and work in every country. We just focus our marketing on the US market.',
  },
];

const COMPARE = [
  { label: 'QR Code Generator', theirs: '$15/mo', tag: 'Beaconstac, QR Tiger' },
  { label: 'Invoice Software', theirs: '$30/mo', tag: 'FreshBooks, Wave' },
  { label: 'Email Signature Builder', theirs: '$10/mo', tag: 'WiseStamp, Newoldstamp' },
  { label: 'WhatsApp Link Tool', theirs: '$9/mo', tag: 'WATI, Respond.io' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-slate-800 leading-snug">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm text-slate-500 leading-relaxed pr-6">{a}</p>
      )}
    </div>
  );
}

export default function TrustSection() {
  return (
    <>
      {/* Comparison section */}
      <section className="py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: copy */}
            <div>
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-4">
                vs. paid alternatives
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-5">
                They charge $20–$100/mo.
                <span className="block gradient-text-dark">We charge $0.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                QR code generators, invoice builders, and email signature tools are standard
                SaaS products charging monthly fees. We made them free because they should be.
              </p>
              <Link
                href="/tools"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm rounded-xl"
              >
                Start for Free <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right: comparison table */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
              {/* Header row */}
              <div className="grid grid-cols-3 px-5 py-3 bg-slate-50 border-b border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest col-span-2">Tool</span>
                <div className="grid grid-cols-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Others</span>
                  <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Ours</span>
                </div>
              </div>

              {COMPARE.map((row, i) => (
                <div
                  key={row.label}
                  className={`grid grid-cols-3 px-5 py-4 items-center ${i !== COMPARE.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <div className="col-span-2">
                    <p className="text-sm font-semibold text-slate-800">{row.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{row.tag}</p>
                  </div>
                  <div className="grid grid-cols-2 items-center">
                    <span className="text-sm text-slate-400 line-through">{row.theirs}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      Free
                    </span>
                  </div>
                </div>
              ))}

              <div className="px-5 py-4 bg-indigo-600">
                <Link
                  href="/tools"
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-white"
                >
                  Try all 5 tools — $0 <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left */}
            <div className="lg:col-span-2">
              <span className="section-label mb-6 inline-flex">FAQ</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
                Questions
                <span className="block gradient-text-dark">answered.</span>
              </h2>
              <p className="text-slate-500 text-[15px] leading-relaxed mb-8">
                Everything you need to know before you start using our tools.
              </p>

              <div className="space-y-2">
                {TOOLS.slice(0, 3).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.slug}
                      href={tool.href}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/40 transition-all group"
                    >
                      <span className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${tool.gradient} shrink-0`}>
                        <Icon size={14} className="text-white" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </span>
                      <ArrowRight size={12} className="ml-auto text-slate-300 group-hover:text-indigo-400 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right: accordion */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-slate-100 px-8 py-1">
                {FAQS.map((faq) => (
                  <FAQItem key={faq.q} {...faq} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-28 bg-white">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 px-8 sm:px-16 py-16 text-center">
            {/* Top glow */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.3) 0%, transparent 70%)',
              }}
            />
            {/* Grid overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            <div className="relative">
              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 mb-10">
                {[
                  { val: '5', label: 'free tools' },
                  { val: '0', label: 'accounts needed' },
                  { val: '$0', label: 'cost forever' },
                  { val: '100%', label: 'browser-based' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-black text-white">{s.val}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mb-3">
                Start in 10 seconds.
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto">
                No account. No credit card. No catch. Just tools that work.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/tools"
                  className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-[15px] rounded-xl"
                >
                  <Zap size={16} strokeWidth={2.5} />
                  Try All 5 Free Tools
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-medium text-slate-400 rounded-xl border border-white/10 hover:border-white/20 hover:text-white transition-all"
                >
                  Read the Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
