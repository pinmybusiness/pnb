import { cn } from '@/lib/utils';

const variants = {
  default:  'bg-white/[0.05] text-slate-300 border border-white/10',
  primary:  'bg-indigo-500/10 text-indigo-300 border border-indigo-400/25',
  success:  'bg-emerald-500/10 text-emerald-300 border border-emerald-400/25',
  warning:  'bg-amber-500/10 text-amber-300 border border-amber-400/25',
  danger:   'bg-rose-500/10 text-rose-300 border border-rose-400/25',
  violet:   'bg-violet-500/10 text-violet-300 border border-violet-400/25',
  sky:      'bg-sky-500/10 text-sky-300 border border-sky-400/25',
  rose:     'bg-rose-500/10 text-rose-300 border border-rose-400/25',
  emerald:  'bg-emerald-500/10 text-emerald-300 border border-emerald-400/25',
  amber:    'bg-amber-500/10 text-amber-300 border border-amber-400/25',
  indigo:   'bg-indigo-500/10 text-indigo-300 border border-indigo-400/25',
  fuchsia:  'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-400/25',
  gradient: 'bg-indigo-500 text-white border border-white/10',
};

const dotColors = {
  default: 'bg-slate-400',
  primary: 'bg-indigo-400',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger:  'bg-rose-400',
  violet:  'bg-violet-400',
  sky:     'bg-sky-400',
  rose:    'bg-rose-400',
  emerald: 'bg-emerald-400',
  amber:   'bg-amber-400',
  indigo:  'bg-indigo-400',
  fuchsia: 'bg-fuchsia-400',
  gradient:'bg-white',
};

export default function Badge({ variant = 'default', className, children, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-wide',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('inline-block w-1.5 h-1.5 rounded-full', dotColors[variant] || 'bg-current')} />
      )}
      {children}
    </span>
  );
}
