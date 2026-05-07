'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Combobox — searchable, keyboard-navigable single select.
 *
 * Props:
 *   - options:      [{ value, label, search?, leading?, trailing?, hint? }]
 *   - value:        currently selected value
 *   - onChange:     (newValue) => void
 *   - placeholder:  trigger placeholder when nothing selected
 *   - searchPlaceholder: search input placeholder
 *   - label:        optional field label
 *   - hint:         optional helper text below
 *   - error:        optional error string
 *   - emptyText:    text when filter yields no results
 *   - renderTrigger: optional (option) => JSX to override trigger display
 *
 * Each option's `leading` (e.g. flag/symbol) and `trailing` (e.g. dial code)
 * are rendered alongside its `label`. `search` lets you customise what the
 * filter matches against (defaults to label + value + trailing).
 */
export default function Combobox({
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  label,
  hint,
  error,
  required,
  emptyText = 'No matches',
  renderTrigger,
  className,
  containerClassName,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const triggerRef = useRef(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const hay = (o.search ?? `${o.label} ${o.value} ${o.trailing ?? ''}`)
        .toString()
        .toLowerCase();
      return hay.includes(q);
    });
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  // Focus search input when opened, reset query, position activeIdx on selected
  useEffect(() => {
    if (!open) return;
    setQuery('');
    requestAnimationFrame(() => inputRef.current?.focus());
    const idx = options.findIndex((o) => o.value === value);
    setActiveIdx(idx >= 0 ? idx : 0);
  }, [open, options, value]);

  // Keep activeIdx in range as filter changes
  useEffect(() => {
    if (activeIdx >= filtered.length) setActiveIdx(0);
  }, [filtered.length, activeIdx]);

  // Scroll active option into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const select = useCallback(
    (opt) => {
      onChange?.(opt.value);
      setOpen(false);
      // Restore focus to trigger so keyboard users don't lose context
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [onChange]
  );

  const onKeyDown = (e) => {
    if (!open) {
      if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIdx(filtered.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = filtered[activeIdx];
      if (opt) select(opt);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)} ref={wrapRef}>
      {label && (
        <label className="text-[13px] font-medium text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          ref={triggerRef}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            'w-full flex items-center justify-between gap-2 rounded-lg border bg-[#16181f] px-3.5 py-2.5 text-[14px] text-left',
            'transition-colors duration-150 cursor-pointer',
            'focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-400'
              : 'border-[#232733] hover:border-[#2c3140]',
            open && 'border-indigo-500/70 ring-2 ring-indigo-500/20',
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0 flex-1 text-white">
            {selected ? (
              renderTrigger ? (
                renderTrigger(selected)
              ) : (
                <>
                  {selected.leading && (
                    <span className="shrink-0 text-base leading-none">{selected.leading}</span>
                  )}
                  <span className="truncate">{selected.label}</span>
                  {selected.trailing && (
                    <span className="text-slate-400 text-[13px] shrink-0">{selected.trailing}</span>
                  )}
                </>
              )
            ) : (
              <span className="text-slate-500">{placeholder}</span>
            )}
          </span>
          <ChevronDown
            size={15}
            className={cn(
              'shrink-0 text-slate-500 transition-transform duration-150',
              open && 'rotate-180 text-indigo-300'
            )}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-lg border border-[#2c3140] bg-[#14161d] shadow-xl shadow-black/50 overflow-hidden"
          >
            {/* Search */}
            <div className="relative border-b border-[#232733]">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent pl-9 pr-9 py-2.5 text-[13.5px] text-white placeholder:text-slate-500 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-500 hover:text-white hover:bg-white/[0.05]"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Options */}
            <div ref={listRef} className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3.5 py-6 text-center text-[13px] text-slate-500">
                  {emptyText}
                </div>
              ) : (
                filtered.map((opt, idx) => {
                  const isActive = idx === activeIdx;
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      data-idx={idx}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onClick={() => select(opt)}
                      className={cn(
                        'w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13.5px] transition-colors',
                        isActive ? 'bg-white/[0.05] text-white' : 'text-slate-300'
                      )}
                    >
                      {opt.leading && (
                        <span className="shrink-0 text-base leading-none">{opt.leading}</span>
                      )}
                      <span className="flex-1 truncate">{opt.label}</span>
                      {opt.trailing && (
                        <span
                          className={cn(
                            'shrink-0 text-[12.5px] font-mono',
                            isActive ? 'text-slate-300' : 'text-slate-500'
                          )}
                        >
                          {opt.trailing}
                        </span>
                      )}
                      {isSelected && (
                        <Check size={13} className="text-indigo-300 shrink-0" strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Result count */}
            {filtered.length > 0 && (
              <div className="px-3 py-1.5 border-t border-[#232733] text-[11px] text-slate-500 flex justify-between">
                <span>
                  {filtered.length} of {options.length}
                </span>
                <span className="hidden sm:inline">↑↓ navigate · ↵ select · esc close</span>
              </div>
            )}
          </div>
        )}
      </div>

      {hint && !error && <p className="text-[12px] text-slate-500">{hint}</p>}
      {error && <p className="text-[12px] text-rose-400">{error}</p>}
    </div>
  );
}
