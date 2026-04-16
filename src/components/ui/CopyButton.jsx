'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CopyButton({ text, label = 'Copy', className, size = 'md' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center font-semibold rounded-lg transition-all duration-200 cursor-pointer',
        sizeClasses[size],
        copied
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
        className
      )}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-600" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={14} />
          {label}
        </>
      )}
    </button>
  );
}
