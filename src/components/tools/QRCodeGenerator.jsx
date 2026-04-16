'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, RefreshCw, Link, Type } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import { downloadDataUrl } from '@/lib/utils';

const SIZE_OPTIONS = [
  { value: '128', label: '128 × 128 (Small)' },
  { value: '256', label: '256 × 256 (Medium)' },
  { value: '400', label: '400 × 400 (Large)' },
  { value: '512', label: '512 × 512 (XL)' },
];

const ERROR_LEVELS = [
  { value: 'L', label: 'Low (7% recovery)' },
  { value: 'M', label: 'Medium (15% recovery)' },
  { value: 'Q', label: 'High (25% recovery)' },
  { value: 'H', label: 'Max (30% recovery)' },
];

const QUICK_PRESETS = [
  { label: 'Website URL', icon: Link,  value: 'https://example.com' },
  { label: 'Plain Text',  icon: Type,  value: 'Hello from PinMyBusiness!' },
];

export default function QRCodeGenerator() {
  const [input, setInput] = useState('https://');
  const [size, setSize]   = useState('256');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
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

  // Auto-generate with debounce
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
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <QrCode size={16} className="text-indigo-600" />
          Enter URL or Text
        </h2>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {QUICK_PRESETS.map(({ label, icon: Icon, value }) => (
            <button
              key={label}
              onClick={() => setInput(value)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="QR Code Size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            options={SIZE_OPTIONS}
          />
          <Select
            label="Error Correction"
            value={errorLevel}
            onChange={(e) => setErrorLevel(e.target.value)}
            options={ERROR_LEVELS}
            hint="Higher = more resilient to damage"
          />
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">QR Color</label>
            <div className="flex items-center gap-2 h-[42px] px-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-sm text-slate-700 font-mono">{fgColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Background Color</label>
            <div className="flex items-center gap-2 h-[42px] px-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="text-sm text-slate-700 font-mono">{bgColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preview & Download */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <QrCode size={16} className="text-indigo-600" />
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
          <div className="flex items-center justify-center h-48 bg-red-50 rounded-xl border border-red-100">
            <p className="text-sm text-red-600 text-center px-4">{error}</p>
          </div>
        ) : dataUrl ? (
          <div className="flex flex-col items-center gap-6">
            {/* QR Code image */}
            <div
              className="p-4 rounded-2xl border border-slate-200 shadow-sm"
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
              <Button
                onClick={handleDownload}
                size="lg"
                icon={Download}
                className="shadow-md shadow-indigo-200"
              >
                Download PNG
              </Button>
              <CopyButton text={input} label="Copy URL" size="lg" />
              <Button
                variant="ghost"
                size="md"
                icon={RefreshCw}
                onClick={generate}
              >
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
                  className="px-2.5 py-1 text-xs bg-slate-50 text-slate-500 rounded-full border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <QrCode size={36} className="text-slate-300 mb-3" />
            <p className="text-sm text-slate-400">Enter a URL or text above to generate</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">QR Code use cases</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Restaurant Menu', 'Link to your online menu'],
            ['Business Card', 'Point to your website or LinkedIn'],
            ['Wi-Fi Details', 'Let guests connect easily'],
            ['Product Info', 'Link to product pages or videos'],
            ['Social Media', 'Drive followers to your profile'],
            ['Contact Info', 'Share your vCard/contact details'],
          ].map(([title, desc]) => (
            <div key={title} className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-800 mb-0.5">{title}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
