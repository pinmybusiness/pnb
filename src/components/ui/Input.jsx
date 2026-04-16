import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    icon: Icon,
    iconRight: IconRight,
    className,
    containerClassName,
    ...props
  },
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
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400',
            'transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
            error
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-200 hover:border-slate-300',
            Icon && 'pl-10',
            IconRight && 'pr-10',
            className
          )}
          {...props}
        />
        {IconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconRight size={16} />
          </span>
        )}
      </div>
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
});

export default Input;
