'use client';

import { useState, useMemo } from 'react';
import { MessageCircle, ExternalLink, Phone, MessageSquare } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import { COUNTRY_CODES } from '@/lib/utils';

export default function WhatsAppGenerator() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [generated, setGenerated] = useState(false);

  const countryOptions = COUNTRY_CODES.map((c) => ({
    value: c.code,
    label: `${c.flag} ${c.code} ${c.country}`,
  }));

  const cleanPhone = phone.replace(/\D/g, '');
  const fullNumber = `${countryCode.replace('+', '')}${cleanPhone}`;

  const whatsappUrl = useMemo(() => {
    if (!cleanPhone) return '';
    const encoded = message ? encodeURIComponent(message) : '';
    return encoded
      ? `https://wa.me/${fullNumber}?text=${encoded}`
      : `https://wa.me/${fullNumber}`;
  }, [fullNumber, message, cleanPhone]);

  const handleGenerate = () => {
    if (cleanPhone.length < 5) return;
    setGenerated(true);
  };

  const isValid = cleanPhone.length >= 5;

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Phone size={16} className="text-emerald-600" />
          Phone Number
        </h2>

        <div className="flex gap-3">
          <Select
            label="Country"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            options={countryOptions}
            containerClassName="w-56 shrink-0"
          />
          <Input
            label="Phone number"
            placeholder="e.g. 5551234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            containerClassName="flex-1"
            hint="Enter without country code or spaces"
            type="tel"
          />
        </div>

        <Textarea
          label="Pre-filled message (optional)"
          placeholder="Hi! I'd like to know more about your services..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          icon={MessageSquare}
          hint="This message will auto-fill in WhatsApp when the link is opened"
        />

        <Button
          onClick={handleGenerate}
          disabled={!isValid}
          size="lg"
          icon={MessageCircle}
          className="w-full"
        >
          Generate WhatsApp Link
        </Button>
      </div>

      {/* Output Panel */}
      {generated && whatsappUrl && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 space-y-5 fade-in-up">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
              <MessageCircle size={16} className="text-emerald-600" />
            </span>
            <h2 className="text-base font-semibold text-slate-900">Your WhatsApp Link</h2>
            <span className="ml-auto px-2.5 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
              Ready ✓
            </span>
          </div>

          {/* Link display */}
          <div className="flex items-stretch gap-2">
            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm text-slate-800 break-all select-all">
              {whatsappUrl}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <CopyButton text={whatsappUrl} label="Copy Link" size="lg" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
            >
              <ExternalLink size={14} />
              Open in WhatsApp
            </a>
            <Button
              variant="ghost"
              size="md"
              onClick={() => { setPhone(''); setMessage(''); setGenerated(false); }}
            >
              Reset
            </Button>
          </div>

          {/* Preview card */}
          <div className="mt-2 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-3 uppercase tracking-wide">
              Link Preview
            </p>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                <MessageCircle size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Chat with {countryCode} {phone}
                </p>
                {message && (
                  <p className="text-xs text-slate-500 mt-0.5 italic line-clamp-2">
                    &ldquo;{message}&rdquo;
                  </p>
                )}
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  wa.me/{fullNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!generated && (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 mx-auto mb-4">
            <MessageCircle size={26} className="text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Your link will appear here</p>
          <p className="text-xs text-slate-400">Enter a phone number and click generate</p>
        </div>
      )}

      {/* Usage guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">
          How to use your WhatsApp link
        </h3>
        <ol className="space-y-3">
          {[
            'Add it to your website as a "Chat on WhatsApp" button',
            'Put it in your email signature for easy contact',
            'Share on social media profiles and business cards',
            'Add to Google My Business profile',
            'Embed in marketing emails and newsletters',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
