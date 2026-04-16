'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:from-indigo-700 hover:to-violet-700 active:scale-[0.98]',
  secondary:
    'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 active:scale-[0.98]',
  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200 active:scale-[0.98]',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 active:scale-[0.98]',
  outline:
    'bg-transparent text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]',
};

const sizes = {
  xs: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
  sm: 'text-sm px-4 py-2 rounded-lg gap-2',
  md: 'text-sm px-5 py-2.5 rounded-lg gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2.5',
  xl: 'text-base px-8 py-4 rounded-xl gap-3',
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
        'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : Icon ? (
        <Icon size={size === 'lg' || size === 'xl' ? 20 : 16} />
      ) : null}
      {children}
      {!loading && IconRight && (
        <IconRight size={size === 'lg' || size === 'xl' ? 20 : 16} />
      )}
    </button>
  );
}
