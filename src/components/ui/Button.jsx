'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-600 ' +
    'shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset]',
  secondary:
    'bg-white/[0.04] text-white border border-white/10 ' +
    'hover:bg-white/[0.07] hover:border-white/20',
  ghost:
    'bg-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white',
  danger:
    'bg-rose-500 text-white hover:bg-rose-400',
  success:
    'bg-emerald-500 text-white hover:bg-emerald-400',
  outline:
    'bg-transparent text-slate-200 border border-white/15 hover:bg-white/[0.04] hover:border-white/25',
};

const sizes = {
  xs: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
  sm: 'text-[13px] px-3.5 py-2 rounded-lg gap-1.5',
  md: 'text-[13.5px] px-4 py-2 rounded-lg gap-2',
  lg: 'text-[14px] px-5 py-2.5 rounded-lg gap-2',
  xl: 'text-[15px] px-6 py-3 rounded-lg gap-2.5',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer select-none whitespace-nowrap',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e1015]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={14} />
      ) : Icon ? (
        <Icon size={size === 'lg' || size === 'xl' ? 16 : 14} />
      ) : null}
      {children}
      {!loading && IconRight && (
        <IconRight size={size === 'lg' || size === 'xl' ? 16 : 14} />
      )}
    </button>
  );
}
