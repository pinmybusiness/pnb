'use client';

import { useState, useMemo, useEffect } from 'react';
import { MessageCircle, ExternalLink, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Combobox from '@/components/ui/Combobox';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import { COUNTRY_CODES } from '@/lib/utils';

const STORAGE_KEY = 'pmb:whatsapp:country';

export default function WhatsAppGenerator() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState(false);

  // Restore last selected country
  useEffect(() => {
    const saved = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
    if (saved && COUNTRY_CODES.some((c) => c.code === saved)) setCountryCode(saved);
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, countryCode); } catch {}
  }, [countryCode]);

  const countryOptions = useMemo(
    () =>
      COUNTRY_CODES.map((c) => ({
        value: c.code,
        label: c.country,
        leading: c.flag,
        trailing: c.code,
        search: `${c.country} ${c.code} ${c.flag}`,
      })),
    []
  );

  const cleanPhone = phone.replace(/\D/g, '');
  const fullNumber = `${countryCode.replace('+', '')}${cleanPhone}`;

  // Light validation: WhatsApp numbers are typically 8-15 digits (E.164)
  const validation = useMemo(() => {
    if (!cleanPhone) return { ok: false, msg: '' };
    if (cleanPhone.length < 7) return { ok: false, msg: 'Number looks too short.' };
    if (cleanPhone.length > 15) return { ok: false, msg: 'Number looks too long.' };
    return { ok: true, msg: 'Looks valid.' };
  }, [cleanPhone]);

  const whatsappUrl = useMemo(() => {
    if (!validation.ok) return '';
    const encoded = message ? encodeURIComponent(message) : '';
    return encoded
      ? `https://wa.me/${fullNumber}?text=${encoded}`
      : `https://wa.me/${fullNumber}`;
  }, [fullNumber, message, validation.ok]);

  const handleGenerate = () => {
    if (validation.ok) setGenerated(true);
  };

  // Cmd/Ctrl+Enter to generate
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && validation.ok) {
        e.preventDefault();
        setGenerated(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [validation.ok]);

  const reset = () => {
    setPhone('');
    setMessage('');
    setGenerated(false);
  };

  return (
    <div className="space-y-5">
      {/* Input Panel */}
      <div className="rounded-xl surface p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-500/15 border border-emerald-400/25">
            <Phone size={14} className="text-emerald-300" />
          </span>
          <h2 className="text-[15px] font-semibold text-white">Phone number</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3">
          <Combobox
            label="Country"
            value={countryCode}
            onChange={setCountryCode}
            options={countryOptions}
            placeholder="Select country"
            searchPlaceholder="Search 33 countries…"
            emptyText="No country matches"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-300">Phone number</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-mono text-slate-400 pointer-events-none">
                {countryCode}
              </span>
              <input
                type="tel"
                inputMode="tel"
                placeholder="555 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#232733] bg-[#16181f] pl-14 pr-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
              />
            </div>
            {phone && (
              <p
                className={`text-[12px] flex items-center gap-1 ${
                  validation.ok ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {validation.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {validation.msg} <span className="text-slate-500">· {cleanPhone.length} digits</span>
              </p>
            )}
            {!phone && (
              <p className="text-[12px] text-slate-500">No spaces or dashes needed — we&apos;ll clean it.</p>
            )}
          </div>
        </div>

        <Textarea
          label="Pre-filled message (optional)"
          placeholder="Hi! I'd like to know more about your services..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          hint={`${message.length} characters · auto-fills in WhatsApp`}
        />

        <div className="flex flex-col-reverse sm:flex-row gap-2">
          <Button variant="ghost" size="lg" onClick={reset} className="sm:w-auto">
            Clear
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!validation.ok}
            size="lg"
            icon={MessageCircle}
            className="flex-1"
          >
            Generate WhatsApp link
          </Button>
        </div>
        <p className="text-[11.5px] text-slate-500 text-center">
          Tip: press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[10.5px] font-mono">⌘ Enter</kbd> to generate
        </p>
      </div>

      {/* Output Panel */}
      {generated && whatsappUrl && (
        <div className="rounded-xl surface p-5 sm:p-6 space-y-5 fade-up" style={{ borderColor: 'rgba(52,211,153,0.25)' }}>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-emerald-500/15 border border-emerald-400/25">
              <MessageCircle size={14} className="text-emerald-300" />
            </span>
            <h2 className="text-[15px] font-semibold text-white">Your WhatsApp link</h2>
            <span className="ml-auto px-2 py-0.5 text-[10.5px] font-medium text-emerald-300 border border-emerald-400/25 rounded-full">
              Ready
            </span>
          </div>

          <div className="bg-[#0d0e13] rounded-lg border border-[#232733] px-4 py-3 font-mono text-[13px] text-slate-200 break-all select-all">
            {whatsappUrl}
          </div>

          <div className="flex flex-wrap gap-2">
            <CopyButton text={whatsappUrl} label="Copy link" size="md" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-400 transition-colors"
            >
              <ExternalLink size={13} />
              Open in WhatsApp
            </a>
            <Button variant="ghost" size="md" onClick={reset}>
              Reset
            </Button>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-emerald-500/[0.06] border border-emerald-400/20 p-3.5">
            <p className="text-[10.5px] font-semibold text-emerald-300 mb-2.5 uppercase tracking-[0.14em]">
              Preview
            </p>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-white">
                  Chat with {countryCode} {phone}
                </p>
                {message && (
                  <p className="text-[12px] text-slate-400 mt-0.5 italic line-clamp-2">
                    &ldquo;{message}&rdquo;
                  </p>
                )}
                <p className="text-[11.5px] text-emerald-300 mt-1 font-mono truncate">
                  wa.me/{fullNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!generated && (
        <div className="rounded-xl border border-dashed border-white/[0.08] p-7 text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/25 mx-auto mb-3">
            <MessageCircle size={20} className="text-emerald-300" />
          </div>
          <p className="text-[13.5px] font-medium text-slate-300 mb-0.5">Your link will appear here</p>
          <p className="text-[12px] text-slate-500">Enter a phone number and click generate</p>
        </div>
      )}

      {/* Usage guide */}
      <div className="rounded-xl surface p-5 sm:p-6">
        <h3 className="text-[14px] font-semibold text-white mb-3">
          How to use your WhatsApp link
        </h3>
        <ul className="space-y-2">
          {[
            'Website "Chat on WhatsApp" button',
            'Email signature for easy contact',
            'Social media bios & business cards',
            'Google Business Profile',
            'Marketing emails and newsletters',
          ].map((step) => (
            <li key={step} className="flex items-start gap-2.5 text-[13px] text-slate-300">
              <span className="w-1 h-1 rounded-full bg-emerald-400 mt-2 shrink-0" />
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
