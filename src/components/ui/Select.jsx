import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';

const Select = forwardRef(function Select(
  { label, hint, error, options = [], className, containerClassName, placeholder, ...props },
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
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border bg-[#16181f] px-3.5 py-2.5 pr-10 text-[14px] text-white',
            'transition-colors duration-150 cursor-pointer',
            'focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20',
            error
              ? 'border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-400'
              : 'border-[#232733] hover:border-[#2c3140]',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="bg-[#16181f] text-slate-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              className="bg-[#16181f] text-white"
            >
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
        />
      </div>
      {hint && !error && <p className="text-[12px] text-slate-500">{hint}</p>}
      {error && <p className="text-[12px] text-rose-400">{error}</p>}
    </div>
  );
});

export default Select;
