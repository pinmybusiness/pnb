'use client';

import { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SITE } from '@/lib/tools';

const FAQS = [
  { category: 'General', items: [
    { q: 'Are all the tools really free?',           a: "Yes - 100% free forever. No hidden fees, no premium paywalls. We're supported by advertising." },
    { q: 'Do I need to create an account?',          a: 'No. Zero signup required. Open any tool and start using it immediately.' },
    { q: 'Is my data safe?',                         a: 'All tools run 100% in your browser. We never send your data to any server.' },
    { q: 'Do the tools work on mobile?',             a: 'Yes - every tool is fully responsive and works great on phones, tablets, and desktops.' },
  ]},
  { category: 'WhatsApp Link Generator', items: [
    { q: 'What is a WhatsApp link?',                 a: 'A wa.me link opens WhatsApp directly to a chat with a specific number - optionally with a pre-filled message.' },
    { q: 'Which countries are supported?',           a: 'All countries. We include 30+ country codes and you can enter any valid international number.' },
    { q: 'Does the message get sent automatically?', a: 'No - the message is pre-filled in the compose box. The user can edit it before sending.' },
  ]},
  { category: 'QR Code Generator', items: [
    { q: 'What can I encode?',                       a: 'URLs, text, phone numbers, email addresses, Wi-Fi credentials, vCard contact info - any text content.' },
    { q: 'What format is the download?',             a: 'PNG, at your chosen size from 128×128 up to 512×512 pixels.' },
    { q: 'Can I customize colors?',                  a: 'Yes - choose any foreground and background color using the color pickers.' },
  ]},
  { category: 'Invoice Generator', items: [
    { q: 'How do I save as PDF?',                    a: "Click \"Print / Save as PDF\", then select \"Save as PDF\" in your browser's print dialog." },
    { q: 'Which currencies are supported?',          a: 'We support 18 major global currencies including USD, EUR, GBP, INR, AED, SGD, and more.' },
    { q: 'Is my invoice data saved?',                a: 'No. Everything stays in your browser tab. Refreshing starts fresh.' },
  ]},
  { category: 'Password Generator', items: [
    { q: 'Are the passwords truly random?',          a: "Yes - we use crypto.getRandomValues(), which is cryptographically secure." },
    { q: 'Are passwords sent anywhere?',             a: 'Never. All generation happens locally in your browser.' },
    { q: "What's the maximum length?",               a: 'Up to 64 characters. We recommend at least 16 with mixed types.' },
  ]},
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.flatMap((s) =>
    s.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    }))
  ),
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.05] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
      >
        <span className="text-[13.5px] font-medium text-white">{q}</span>
        <ChevronDown size={14} className={`shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-3.5 text-[13px] text-slate-400 leading-[1.7] pr-6">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          <p className="section-label mb-4 fade-up">FAQ</p>
          <h1 className="text-[32px] sm:text-[44px] font-semibold text-white tracking-[-0.025em] leading-[1.1] mb-3 fade-up delay-1">
            Frequently asked questions.
          </h1>
          <p className="text-[15.5px] text-slate-400 fade-up delay-2">
            Everything you need to know about {SITE.name} and our free tools.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-12 space-y-5">
        {FAQS.map((s) => (
          <div key={s.category} className="rounded-xl surface px-5 sm:px-6 pt-5 pb-1">
            <h2 className="text-[10.5px] font-semibold text-indigo-300 uppercase tracking-[0.14em] mb-2">{s.category}</h2>
            {s.items.map((item) => <FAQItem key={item.q} {...item} />)}
          </div>
        ))}

        <div className="rounded-xl surface p-7 text-center mt-8">
          <h2 className="text-[16px] font-semibold text-white mb-1.5">Still have a question?</h2>
          <p className="text-[13px] text-slate-400 mb-4">We&apos;ll respond within 24 hours.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
            >
              Contact us
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium text-slate-300 hover:text-white border border-white/10 hover:border-white/25 rounded-md transition-colors"
            >
              Try our tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
