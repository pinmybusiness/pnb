import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, hint, error, icon: Icon, iconRight: IconRight, className, containerClassName, ...props },
  ref
) {
  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label className="text-[13px] font-medium text-slate-300">
          {label}
          {props.required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <Icon size={15} />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500',
            'transition-colors duration-150',
            'focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20',
            error
              ? 'border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-400'
              : 'border-[#232733] hover:border-[#2c3140]',
            Icon && 'pl-10',
            IconRight && 'pr-10',
            className
          )}
          {...props}
        />
        {IconRight && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <IconRight size={15} />
          </span>
        )}
      </div>
      {hint && !error && <p className="text-[12px] text-slate-500">{hint}</p>}
      {error && <p className="text-[12px] text-rose-400">{error}</p>}
    </div>
  );
});

export default Input;
