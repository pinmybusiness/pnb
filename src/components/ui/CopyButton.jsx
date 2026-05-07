'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { copyToClipboard, cn } from '@/lib/utils';

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
    md: 'text-[13px] px-3.5 py-2 gap-1.5',
    lg: 'text-[14px] px-4 py-2.5 gap-2',
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center font-medium rounded-lg transition-colors duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1015]',
        sizeClasses[size],
        copied
          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
          : 'bg-white/[0.04] text-slate-200 border border-white/10 hover:bg-white/[0.07] hover:border-white/20',
        className
      )}
    >
      {copied ? (
        <>
          <Check size={13} className="text-emerald-300" />
          Copied
        </>
      ) : (
        <>
          <Copy size={13} />
          {label}
        </>
      )}
    </button>
  );
}
