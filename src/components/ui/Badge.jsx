import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-indigo-100 text-indigo-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-red-100 text-red-700',
  violet:  'bg-violet-100 text-violet-700',
  sky:     'bg-sky-100 text-sky-700',
  rose:    'bg-rose-100 text-rose-700',
  gradient: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white',
};

export default function Badge({ variant = 'default', className, children, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'inline-block w-1.5 h-1.5 rounded-full pulse-dot',
            variant === 'success' ? 'bg-emerald-500' : 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  );
}
