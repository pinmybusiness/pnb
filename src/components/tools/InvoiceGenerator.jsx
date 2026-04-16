'use client';

import { useState, useRef } from 'react';
import { Plus, Trash2, Printer, FileText, Building2, User } from 'lucide-react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { CURRENCIES, formatCurrency } from '@/lib/utils';

const emptyItem = () => ({ id: Date.now(), description: '', qty: 1, rate: 0 });

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  value: c.code,
  label: `${c.symbol} ${c.name} (${c.code})`,
}));

export default function InvoiceGenerator() {
  const printRef = useRef(null);

  const [currency, setCurrency] = useState('USD');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate]     = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate]             = useState('');
  const [taxRate, setTaxRate]             = useState(0);
  const [notes, setNotes]                 = useState('');

  // From (your business)
  const [from, setFrom] = useState({ name: '', email: '', address: '', phone: '' });
  // To (client)
  const [to, setTo] = useState({ name: '', email: '', address: '', phone: '' });

  const [items, setItems] = useState([emptyItem()]);

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? '$';

  const updateItem = (id, field, value) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const subtotal = items.reduce((s, it) => s + Number(it.qty) * Number(it.rate), 0);
  const taxAmount = subtotal * (Number(taxRate) / 100);
  const total = subtotal + taxAmount;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Settings bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 no-print">
        <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-amber-600" />
          Invoice Settings
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Input
            label="Invoice #"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          <Select
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            options={CURRENCY_OPTIONS}
          />
          <Input
            label="Invoice Date"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {/* Invoice Preview (printable) */}
      <div
        ref={printRef}
        className="print-area bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        {/* Invoice header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">INVOICE</h1>
              <p className="text-amber-100 text-sm mt-1">{invoiceNumber}</p>
            </div>
            <div className="text-right text-white">
              <p className="text-sm text-amber-100">Date</p>
              <p className="font-semibold">{invoiceDate || '-'}</p>
              {dueDate && (
                <>
                  <p className="text-sm text-amber-100 mt-1">Due Date</p>
                  <p className="font-semibold">{dueDate}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* From / To */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</span>
              </div>
              <div className="space-y-2 no-print">
                <Input placeholder="Your business name" value={from.name} onChange={(e) => setFrom({ ...from, name: e.target.value })} />
                <Input placeholder="email@business.com" value={from.email} onChange={(e) => setFrom({ ...from, email: e.target.value })} />
                <Input placeholder="Phone number" value={from.phone} onChange={(e) => setFrom({ ...from, phone: e.target.value })} />
                <Textarea placeholder="Business address" rows={2} value={from.address} onChange={(e) => setFrom({ ...from, address: e.target.value })} />
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
                <User size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bill To</span>
              </div>
              <div className="space-y-2 no-print">
                <Input placeholder="Client name / company" value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} />
                <Input placeholder="client@email.com" value={to.email} onChange={(e) => setTo({ ...to, email: e.target.value })} />
                <Input placeholder="Phone number" value={to.phone} onChange={(e) => setTo({ ...to, phone: e.target.value })} />
                <Textarea placeholder="Client address" rows={2} value={to.address} onChange={(e) => setTo({ ...to, address: e.target.value })} />
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
              <span className="col-span-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</span>
              <span className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Qty</span>
              <span className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Rate</span>
              <span className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</span>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 rounded-xl p-2">
                  <div className="col-span-6">
                    <input
                      className="w-full bg-transparent px-2 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      placeholder={`Item ${idx + 1} description`}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      className="w-full bg-white rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
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
                        className="w-full bg-white rounded-lg border border-slate-200 pl-5 pr-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-span-1 text-sm font-semibold text-slate-800 text-right pr-2">
                    {currencySymbol}{(Number(item.qty) * Number(item.rate)).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="col-span-1 flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-30 no-print"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setItems((p) => [...p, emptyItem()])}
              className="mt-3 flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors no-print"
            >
              <Plus size={14} /> Add Line Item
            </button>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-slate-600 py-1">
                <span>Subtotal</span>
                <span className="font-medium">{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-slate-600 py-1">
                <div className="flex items-center gap-2">
                  <span>Tax</span>
                  <div className="no-print">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      className="w-14 px-2 py-0.5 text-xs text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    />
                    <span className="text-xs text-slate-400 ml-1">%</span>
                  </div>
                  <span className="hidden print:inline">{taxRate}%</span>
                </div>
                <span className="font-medium">{currencySymbol}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t-2 border-slate-900">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-lg text-slate-900">
                  {currencySymbol}{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</p>
            <div className="no-print">
              <Textarea
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
      <div className="flex flex-wrap gap-3 no-print">
        <Button onClick={handlePrint} size="lg" icon={Printer} className="shadow-md shadow-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
          Print / Save as PDF
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setFrom({ name: '', email: '', address: '', phone: '' });
            setTo({ name: '', email: '', address: '', phone: '' });
            setItems([emptyItem()]);
            setNotes('');
          }}
        >
          Clear All
        </Button>
      </div>

      <p className="text-xs text-slate-400 no-print">
        💡 Tip: Use your browser&apos;s print dialog to save as PDF. Select &quot;Save as PDF&quot; as the destination.
      </p>
    </div>
  );
}
