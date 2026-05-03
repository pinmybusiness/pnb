'use client';

import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export default function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 text-[14px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl w-full lg:max-w-md">
        <Check size={16} strokeWidth={2.5} />
        Thanks — we&apos;ll keep you posted.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full lg:max-w-md"
    >
      <input
        type="email"
        required
        placeholder="you@company.com"
        className="flex-1 px-4 py-3 text-[14px] bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-1.5 px-5 py-3 text-[14px] font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shrink-0"
      >
        Subscribe
        <ArrowUpRight size={14} strokeWidth={2.5} />
      </button>
    </form>
  );
}
