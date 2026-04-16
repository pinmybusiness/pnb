import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, hint, error, className, containerClassName, rows = 4, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400',
          'resize-y transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
          error
            ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
            : 'border-slate-200 hover:border-slate-300',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Textarea;
