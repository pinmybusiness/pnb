'use client';

import { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, RefreshCw, Link, Type, Wifi, Mail, Phone, ArrowLeftRight } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import { downloadDataUrl, cn } from '@/lib/utils';

const SIZE_OPTIONS = [
  { value: '128', label: '128' },
  { value: '256', label: '256' },
  { value: '400', label: '400' },
  { value: '512', label: '512' },
];

const ERROR_LEVELS = [
  { value: 'L', label: 'Low (7% recovery)' },
  { value: 'M', label: 'Medium (15% recovery)' },
  { value: 'Q', label: 'High (25% recovery)' },
  { value: 'H', label: 'Max (30% recovery)' },
];

const QUICK_PRESETS = [
  { label: 'URL',   icon: Link,  value: 'https://example.com' },
  { label: 'Text',  icon: Type,  value: 'Hello from PinMyBusiness!' },
  { label: 'Email', icon: Mail,  value: 'mailto:hello@example.com' },
  { label: 'Phone', icon: Phone, value: 'tel:+15551234567' },
  { label: 'Wi-Fi', icon: Wifi,  value: 'WIFI:T:WPA;S:NetworkName;P:password;;' },
];

const COLOR_PRESETS = [
  { name: 'Classic',    fg: '#000000', bg: '#ffffff' },
  { name: 'Inverted',   fg: '#ffffff', bg: '#0a0a0a' },
  { name: 'Indigo',     fg: '#4f46e5', bg: '#ffffff' },
  { name: 'Emerald',    fg: '#059669', bg: '#ffffff' },
  { name: 'Sunset',     fg: '#0f172a', bg: '#fef3c7' },
  { name: 'Midnight',   fg: '#a5b4fc', bg: '#0e1015' },
];

export default function QRCodeGenerator() {
  const [input, setInput] = useState('https://');
  const [size, setSize]   = useState('256');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0a0a14');
  const [errorLevel, setErrorLevel] = useState('M');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError]     = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(async () => {
    if (!input.trim()) { setDataUrl(''); return; }
    setGenerating(true);
    setError('');
    try {
      const url = await QRCode.toDataURL(input.trim(), {
        width: parseInt(size),
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel,
      });
      setDataUrl(url);
    } catch {
      setError('Could not generate QR code. Try simplifying the input.');
      setDataUrl('');
    } finally {
      setGenerating(false);
    }
  }, [input, size, fgColor, bgColor, errorLevel]);

  useEffect(() => {
    const t = setTimeout(generate, 400);
    return () => clearTimeout(t);
  }, [generate]);

  const handleDownload = () => {
    if (dataUrl) downloadDataUrl(dataUrl, 'qrcode-pinmybusiness.png');
  };

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="rounded-2xl surface p-6 space-y-5">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <QrCode size={16} className="text-indigo-300" />
          Enter URL or Text
        </h2>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {QUICK_PRESETS.map(({ label, icon: Icon, value }) => (
            <button
              key={label}
              onClick={() => setInput(value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-indigo-500/15 hover:border-indigo-400/40 hover:text-indigo-200 transition-all"
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        <Input
          label="URL or Text"
          placeholder="https://yourwebsite.com"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          hint="Paste any URL, text, phone number, email address, or Wi-Fi details"
        />

        {/* Size as button group */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-slate-300">Size</label>
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-[#0d0e13] border border-[#232733]">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSize(opt.value)}
                className={cn(
                  'py-2 rounded-md text-[12.5px] font-medium tabular-nums transition-colors',
                  size === opt.value
                    ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[12px] text-slate-500">Output: {size} × {size} px PNG</p>
        </div>

        {/* Error correction */}
        <Select
          label="Error correction"
          value={errorLevel}
          onChange={(e) => setErrorLevel(e.target.value)}
          options={ERROR_LEVELS}
          hint="Higher = more resilient to damage / scanning at angles"
        />

        {/* Color presets */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium text-slate-300">Color preset</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {COLOR_PRESETS.map((p) => {
              const active = fgColor.toLowerCase() === p.fg.toLowerCase() && bgColor.toLowerCase() === p.bg.toLowerCase();
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg border transition-colors',
                    active
                      ? 'border-indigo-400/50 bg-indigo-500/10'
                      : 'border-[#232733] bg-[#0d0e13] hover:border-[#2c3140]'
                  )}
                  title={`${p.fg} on ${p.bg}`}
                >
                  <div className="relative w-8 h-8 rounded overflow-hidden border border-white/10">
                    <div className="absolute inset-0" style={{ background: p.bg }} />
                    <div className="absolute inset-1 rounded-sm" style={{ background: p.fg }} />
                  </div>
                  <span className="text-[10.5px] text-slate-400">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom colors + swap */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 sm:items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-300">QR color</label>
            <div className="flex items-center gap-2 h-[42px] px-3 rounded-lg border border-[#232733] bg-[#16181f] hover:border-[#2c3140] transition-colors cursor-pointer">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-[13px] text-slate-200 font-mono uppercase">{fgColor}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { const a = fgColor; setFgColor(bgColor); setBgColor(a); }}
            aria-label="Swap colors"
            className="self-end h-[42px] w-full sm:w-[42px] flex items-center justify-center rounded-lg border border-[#232733] bg-[#16181f] text-slate-400 hover:text-white hover:border-[#2c3140] transition-colors"
            title="Swap colors"
          >
            <ArrowLeftRight size={14} />
          </button>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-300">Background</label>
            <div className="flex items-center gap-2 h-[42px] px-3 rounded-lg border border-[#232733] bg-[#16181f] hover:border-[#2c3140] transition-colors cursor-pointer">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-[13px] text-slate-200 font-mono uppercase">{bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="rounded-2xl surface p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <QrCode size={16} className="text-indigo-300" />
            QR Code Preview
          </h2>
          {generating && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <RefreshCw size={12} className="animate-spin" />
              Generating…
            </span>
          )}
        </div>

        {error ? (
          <div className="flex items-center justify-center h-48 bg-rose-500/10 rounded-xl border border-rose-400/30">
            <p className="text-sm text-rose-300 text-center px-4">{error}</p>
          </div>
        ) : dataUrl ? (
          <div className="flex flex-col items-center gap-6">
            {/* QR Code image */}
            <div
              className="p-4 rounded-2xl border border-white/[0.08] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              style={{ backgroundColor: bgColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt="Generated QR Code"
                style={{ width: Math.min(parseInt(size), 280), height: Math.min(parseInt(size), 280) }}
                className="block"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 justify-center">
              <Button onClick={handleDownload} size="lg" icon={Download}>
                Download PNG
              </Button>
              <CopyButton text={input} label="Copy URL" size="lg" />
              <Button variant="ghost" size="md" icon={RefreshCw} onClick={generate}>
                Refresh
              </Button>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                `${size}×${size}px`,
                `EC Level: ${errorLevel}`,
                'PNG format',
                'Print ready',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs bg-white/[0.04] text-slate-400 rounded-full border border-white/[0.08]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.1]">
            <QrCode size={36} className="text-slate-600 mb-3" />
            <p className="text-sm text-slate-500">Enter a URL or text above to generate</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-2xl surface p-6">
        <h3 className="text-sm font-semibold text-white mb-4">QR Code use cases</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Restaurant Menu', 'Link to your online menu'],
            ['Business Card', 'Point to your website or LinkedIn'],
            ['Wi-Fi Details', 'Let guests connect easily'],
            ['Product Info', 'Link to product pages or videos'],
            ['Social Media', 'Drive followers to your profile'],
            ['Contact Info', 'Share your vCard/contact details'],
          ].map(([title, desc]) => (
            <div
              key={title}
              className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
            >
              <p className="text-xs font-semibold text-white mb-0.5">{title}</p>
              <p className="text-xs text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
