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
        <label className="text-sm font-medium text-slate-700">
          {label}
          {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900',
            'transition-all duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
            error
              ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-200 hover:border-slate-300',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
