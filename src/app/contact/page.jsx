'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Send, CheckCircle, Zap } from 'lucide-react';
import { SITE } from '@/lib/tools';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 mb-4 uppercase tracking-wider">
            Contact
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-slate-600">
            Have a question, feedback, or a tool idea? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            {[
              { icon: Mail,          label: 'Email Us',      value: `hello@${SITE.domain}`, href: `mailto:hello@${SITE.domain}`, color: 'bg-indigo-50 text-indigo-600' },
              { icon: MessageCircle, label: 'WhatsApp',       value: 'Chat with us',          href: 'https://wa.me/1234567890',    color: 'bg-emerald-50 text-emerald-600' },
              { icon: Zap,           label: 'Response Time',  value: 'Within 24 hours',                                            color: 'bg-amber-50 text-amber-600' },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${color}`}>
                  <Icon size={18} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                {href
                  ? <a href={href} className="text-sm font-semibold text-indigo-600 hover:underline">{value}</a>
                  : <p className="text-sm font-semibold text-slate-800">{value}</p>}
              </div>
            ))}
          </div>

          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle size={48} className="text-emerald-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                <p className="text-slate-600">Thanks for reaching out. We&apos;ll reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <h2 className="text-base font-semibold text-slate-900 mb-5">Send a Message</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'name',  label: 'Name',  placeholder: 'Your name',        type: 'text' },
                    { key: 'email', label: 'Email', placeholder: 'you@example.com',  type: 'email' },
                  ].map(({ key, label, placeholder, type }) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-slate-700">{label}</label>
                      <input required type={type} placeholder={placeholder} value={form[key]} onChange={set(key)}
                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <input placeholder="What's this about?" value={form.subject} onChange={set('subject')}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Message <span className="text-rose-500">*</span></label>
                  <textarea required rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={set('message')}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500" />
                </div>
                <button type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all">
                  <Send size={14} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
