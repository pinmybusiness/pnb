'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Send, Check, Zap } from 'lucide-react';
import { SITE } from '@/lib/tools';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
          <p className="section-label mb-4 fade-up">Contact</p>
          <h1 className="text-[32px] sm:text-[44px] font-semibold text-white tracking-[-0.025em] leading-[1.1] mb-3 fade-up delay-1">
            Get in touch.
          </h1>
          <p className="text-[15.5px] text-slate-400 fade-up delay-2">
            Have a question, feedback, or a tool idea? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-3">
            {[
              { icon: Mail,          label: 'Email',         value: `hello@${SITE.domain}`, href: `mailto:hello@${SITE.domain}` },
              { icon: MessageCircle, label: 'WhatsApp',      value: 'Chat with us',         href: 'https://wa.me/1234567890' },
              { icon: Zap,           label: 'Response time', value: 'Within 24 hours' },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="rounded-xl surface card-hover p-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/10 border border-indigo-400/25 mb-2.5">
                  <Icon size={15} className="text-indigo-300" strokeWidth={1.75} />
                </div>
                <p className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-[0.14em] mb-1">{label}</p>
                {href
                  ? <a href={href} className="text-[13.5px] font-medium text-indigo-300 hover:text-indigo-200 transition-colors">{value}</a>
                  : <p className="text-[13.5px] font-medium text-white">{value}</p>}
              </div>
            ))}
          </div>

          <div className="md:col-span-2 rounded-xl surface p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mb-3">
                  <Check size={20} className="text-emerald-300" strokeWidth={2.5} />
                </div>
                <h2 className="text-[17px] font-semibold text-white mb-1.5">Message sent</h2>
                <p className="text-[13.5px] text-slate-400">Thanks for reaching out. We&apos;ll reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <h2 className="text-[15px] font-semibold text-white mb-3">Send a message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'name',  label: 'Name',  placeholder: 'Your name',       type: 'text' },
                    { key: 'email', label: 'Email', placeholder: 'you@example.com', type: 'email' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-medium text-slate-300">
                        {label} <span className="text-rose-400">*</span>
                      </label>
                      <input
                        required
                        type={type}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={set(key)}
                        className="w-full rounded-lg border border-[#232733] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-300">Subject</label>
                  <input
                    placeholder="What's this about?"
                    value={form.subject}
                    onChange={set('subject')}
                    className="w-full rounded-lg border border-[#232733] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-slate-300">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={set('message')}
                    className="w-full rounded-lg border border-[#232733] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500 resize-y focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-[14px] font-medium text-white bg-indigo-500 hover:bg-indigo-400 rounded-md transition-colors"
                >
                  <Send size={13} /> Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
