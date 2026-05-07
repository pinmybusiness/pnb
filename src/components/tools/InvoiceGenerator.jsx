'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Plus, Trash2, Printer, FileText, Building2, User, GripVertical, Eraser } from 'lucide-react';
import Combobox from '@/components/ui/Combobox';
import Button from '@/components/ui/Button';
import { CURRENCIES } from '@/lib/utils';

const STORAGE_KEY = 'pmb:invoice:v1';
const COUNTER_KEY = 'pmb:invoice:counter';

const emptyItem = () => ({ id: Date.now() + Math.random(), description: '', qty: 1, rate: 0 });

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c.code,
  label: c.name,
  leading: c.symbol,
  trailing: c.code,
  search: `${c.name} ${c.code} ${c.symbol}`,
}));

function nextInvoiceNumber() {
  try {
    const n = parseInt(window.localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    return `INV-${String(n).padStart(3, '0')}`;
  } catch {
    return 'INV-001';
  }
}

export default function InvoiceGenerator() {
  const printRef = useRef(null);

  const [hydrated, setHydrated] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState('');
  const [from, setFrom] = useState({ name: '', email: '', address: '', phone: '' });
  const [to, setTo] = useState({ name: '', email: '', address: '', phone: '' });
  const [items, setItems] = useState([emptyItem()]);

  // Restore from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        if (saved.currency) setCurrency(saved.currency);
        if (saved.invoiceNumber) setInvoiceNumber(saved.invoiceNumber);
        if (saved.invoiceDate) setInvoiceDate(saved.invoiceDate);
        if (saved.dueDate) setDueDate(saved.dueDate);
        if (typeof saved.taxRate !== 'undefined') setTaxRate(saved.taxRate);
        if (saved.notes) setNotes(saved.notes);
        if (saved.from) setFrom(saved.from);
        if (saved.to) setTo(saved.to);
        if (Array.isArray(saved.items) && saved.items.length) setItems(saved.items);
      } else {
        setInvoiceNumber(nextInvoiceNumber());
      }
    } catch {
      setInvoiceNumber(nextInvoiceNumber());
    }
    setHydrated(true);
  }, []);

  // Persist (debounced via batching)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ currency, invoiceNumber, invoiceDate, dueDate, taxRate, notes, from, to, items })
      );
    } catch {}
  }, [hydrated, currency, invoiceNumber, invoiceDate, dueDate, taxRate, notes, from, to, items]);

  const currencySymbol = useMemo(
    () => CURRENCIES.find((c) => c.code === currency)?.symbol ?? '$',
    [currency]
  );

  const updateItem = (id, field, value) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const removeItem = (id) => setItems((prev) => prev.filter((it) => it.id !== id));

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const taxAmount = subtotal * (Number(taxRate) / 100);
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    // Bump counter when an invoice is printed
    try {
      const m = invoiceNumber.match(/(\d+)$/);
      if (m) window.localStorage.setItem(COUNTER_KEY, m[1]);
    } catch {}
    window.print();
  };

  const clearAll = () => {
    if (!confirm('Clear all invoice fields? This cannot be undone.')) return;
    setFrom({ name: '', email: '', address: '', phone: '' });
    setTo({ name: '', email: '', address: '', phone: '' });
    setItems([emptyItem()]);
    setNotes('');
    setTaxRate(0);
    setDueDate('');
    setInvoiceNumber(nextInvoiceNumber());
  };

  // Re-usable input class (printable invoice paper stays light)
  const paperInput =
    'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-colors';

  return (
    <div className="space-y-5">
      {/* Settings bar */}
      <div className="rounded-xl surface p-5 sm:p-6 no-print">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-500/15 border border-amber-400/25">
              <FileText size={14} className="text-amber-300" />
            </span>
            <h2 className="text-[15px] font-semibold text-white">Invoice settings</h2>
          </div>
          <p className="text-[11.5px] text-slate-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 align-middle" />
            Auto-saved to this browser
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-300">Invoice #</label>
            <input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full rounded-lg border border-[#232733] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
            />
          </div>
          <Combobox
            label="Currency"
            value={currency}
            onChange={setCurrency}
            options={CURRENCY_OPTIONS}
            searchPlaceholder="Search 18 currencies…"
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-300">Invoice date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full rounded-lg border border-[#232733] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-slate-300">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-[#232733] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-white focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 hover:border-[#2c3140] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Invoice paper (printable — kept light) */}
      <div
        ref={printRef}
        className="print-area bg-white rounded-xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]"
      >
        {/* Invoice header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-7">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-[28px] font-extrabold text-white tracking-tight">INVOICE</h1>
              <p className="text-amber-100 text-sm mt-1">{invoiceNumber}</p>
            </div>
            <div className="text-right text-white">
              <p className="text-xs text-amber-100">Date</p>
              <p className="text-[14px] font-semibold">{invoiceDate || '-'}</p>
              {dueDate && (
                <>
                  <p className="text-xs text-amber-100 mt-1">Due date</p>
                  <p className="text-[14px] font-semibold">{dueDate}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-7 space-y-7">
          {/* From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={13} className="text-slate-400" />
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em]">From</span>
              </div>
              <div className="space-y-2 no-print">
                <input className={paperInput} placeholder="Your business name" value={from.name} onChange={(e) => setFrom({ ...from, name: e.target.value })} />
                <input className={paperInput} placeholder="email@business.com" value={from.email} onChange={(e) => setFrom({ ...from, email: e.target.value })} />
                <input className={paperInput} placeholder="Phone number" value={from.phone} onChange={(e) => setFrom({ ...from, phone: e.target.value })} />
                <textarea className={paperInput} placeholder="Business address" rows={2} value={from.address} onChange={(e) => setFrom({ ...from, address: e.target.value })} />
              </div>
              <div className="hidden print:block">
                <p className="font-bold text-slate-900">{from.name}</p>
                <p className="text-sm text-slate-600">{from.email}</p>
                <p className="text-sm text-slate-600">{from.phone}</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{from.address}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User size={13} className="text-slate-400" />
                <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em]">Bill to</span>
              </div>
              <div className="space-y-2 no-print">
                <input className={paperInput} placeholder="Client name / company" value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} />
                <input className={paperInput} placeholder="client@email.com" value={to.email} onChange={(e) => setTo({ ...to, email: e.target.value })} />
                <input className={paperInput} placeholder="Phone number" value={to.phone} onChange={(e) => setTo({ ...to, phone: e.target.value })} />
                <textarea className={paperInput} placeholder="Client address" rows={2} value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} />
              </div>
              <div className="hidden print:block">
                <p className="font-bold text-slate-900">{to.name}</p>
                <p className="text-sm text-slate-600">{to.email}</p>
                <p className="text-sm text-slate-600">{to.phone}</p>
                <p className="text-sm text-slate-600 whitespace-pre-line">{to.address}</p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="grid grid-cols-12 gap-2 mb-2 px-2">
              <span className="col-span-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em]">Description</span>
              <span className="col-span-2 text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em] text-center">Qty</span>
              <span className="col-span-2 text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em] text-right">Rate</span>
              <span className="col-span-2 text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em] text-right">Amount</span>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-lg p-2 group">
                  <div className="col-span-6 flex items-center gap-1">
                    <GripVertical size={13} className="text-slate-300 shrink-0 no-print" />
                    <input
                      className="w-full bg-transparent px-1 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      placeholder={`Item ${idx + 1} description`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      className="w-full bg-white rounded-md border border-slate-200 px-2 py-1.5 text-sm text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">{currencySymbol}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full bg-white rounded-md border border-slate-200 pl-5 pr-2 py-1.5 text-sm text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-sm font-semibold text-slate-800 text-right pr-2 tabular-nums">
                    {currencySymbol}{(Number(item.qty) * Number(item.rate)).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    aria-label="Remove line item"
                    className="col-span-1 flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 no-print"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setItems((p) => [...p, emptyItem()])}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors no-print"
            >
              <Plus size={13} /> Add line item
            </button>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2">
              <div className="flex justify-between text-sm text-slate-600 py-1">
                <span>Subtotal</span>
                <span className="font-medium tabular-nums">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600 py-1">
                <div className="flex items-center gap-2">
                  <span>Tax</span>
                  <div className="no-print flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-14 px-2 py-0.5 text-xs text-slate-900 text-center border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <span className="text-xs text-slate-400 ml-1">%</span>
                  </div>
                  <span className="hidden print:inline">{taxRate}%</span>
                </div>
                <span className="font-medium tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-slate-900">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg text-slate-900 tabular-nums">
                  {currencySymbol}{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-[10.5px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-2">Notes</p>
            <div className="no-print">
              <textarea
                className={paperInput}
                placeholder="Payment terms, bank details, thank you message…"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            {notes && <p className="hidden print:block text-sm text-slate-600 whitespace-pre-line">{notes}</p>}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 no-print">
        <Button onClick={handlePrint} size="lg" icon={Printer} className="flex-1 sm:flex-none">
          Print / Save as PDF
        </Button>
        <Button variant="outline" size="lg" icon={Eraser} onClick={clearAll}>
          Clear all
        </Button>
      </div>

      <p className="text-[11.5px] text-slate-500 no-print">
        💡 Tip: in your browser&apos;s print dialog, choose &ldquo;Save as PDF&rdquo; as the destination.
      </p>
    </div>
  );
}
