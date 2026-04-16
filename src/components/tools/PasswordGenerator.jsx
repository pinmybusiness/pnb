'use client';

import { useState, useCallback } from 'react';
import { KeyRound, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import { clamp } from '@/lib/utils';

const CHAR_SETS = {
  uppercase:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase:  'abcdefghijklmnopqrstuvwxyz',
  numbers:    '0123456789',
  symbols:    '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length, opts) {
  let pool = '';
  if (opts.uppercase) pool += CHAR_SETS.uppercase;
  if (opts.lowercase) pool += CHAR_SETS.lowercase;
  if (opts.numbers)   pool += CHAR_SETS.numbers;
  if (opts.symbols)   pool += CHAR_SETS.symbols;
  if (!pool) return '';

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => pool[n % pool.length]).join('');
}

function getStrength(pwd) {
  if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200', Icon: ShieldOff };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: 'Weak',   color: 'bg-red-500',    Icon: ShieldAlert };
  if (score <= 4) return { score, label: 'Fair',   color: 'bg-amber-500',  Icon: Shield };
  if (score <= 5) return { score, label: 'Good',   color: 'bg-sky-500',    Icon: Shield };
  return           { score, label: 'Strong', color: 'bg-emerald-500', Icon: ShieldCheck };
}

export default function PasswordGenerator() {
  const [length, setLength]  = useState(16);
  const [count, setCount]    = useState(1);
  const [opts, setOpts]      = useState({
    uppercase: true,
    lowercase: true,
    numbers:   true,
    symbols:   false,
  });
  const [passwords, setPasswords] = useState([]);

  const toggle = (k) => setOpts((o) => ({ ...o, [k]: !o[k] }));

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => generatePassword(length, opts));
    setPasswords(list);
  }, [length, count, opts]);

  const strength = getStrength(passwords[0] ?? '');
  const StrengthIcon = strength.Icon;

  const hasAny = Object.values(opts).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <KeyRound size={16} className="text-rose-600" />
          Generator Settings
        </h2>

        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Password Length</label>
            <span className="text-2xl font-extrabold text-indigo-600">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>4</span><span>32</span><span>64</span>
          </div>
        </div>

        {/* Character sets */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Include characters</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'uppercase', label: 'Uppercase', example: 'A–Z' },
              { key: 'lowercase', label: 'Lowercase', example: 'a–z' },
              { key: 'numbers',   label: 'Numbers',   example: '0–9' },
              { key: 'symbols',   label: 'Symbols',   example: '!@#$%' },
            ].map(({ key, label, example }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  opts[key]
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span>{label}</span>
                <span className={`text-xs font-mono ${opts[key] ? 'text-indigo-500' : 'text-slate-400'}`}>
                  {example}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Generate multiple</label>
            <span className="text-sm font-bold text-slate-700">{count} password{count > 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-2">
            {[1, 3, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                  count === n
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={generate}
          disabled={!hasAny}
          size="lg"
          icon={RefreshCw}
          className="w-full"
        >
          Generate Password{count > 1 ? 's' : ''}
        </Button>
        {!hasAny && (
          <p className="text-xs text-red-500 text-center -mt-4">
            Select at least one character type
          </p>
        )}
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 fade-in-up">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">Generated Passwords</h2>
            <button
              onClick={generate}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <RefreshCw size={12} /> Regenerate
            </button>
          </div>

          {/* Strength indicator for first password */}
          {passwords[0] && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <StrengthIcon
                size={18}
                className={
                  strength.label === 'Strong' ? 'text-emerald-500'
                  : strength.label === 'Good'   ? 'text-sky-500'
                  : strength.label === 'Fair'   ? 'text-amber-500'
                  : 'text-red-500'
                }
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">
                    Strength: {strength.label}
                  </span>
                  <span className="text-xs text-slate-400">Score {strength.score}/7</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i < strength.score ? strength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {passwords.map((pwd, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors"
              >
                <code className="flex-1 text-sm font-mono text-slate-800 break-all select-all">
                  {pwd}
                </code>
                <CopyButton text={pwd} label="Copy" size="sm" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <CopyButton text={passwords.join('\n')} label={`Copy all ${passwords.length}`} size="md" className="w-full justify-center" />
        </div>
      )}

      {/* Empty state */}
      {passwords.length === 0 && (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-100 mx-auto mb-4">
            <KeyRound size={26} className="text-rose-600" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">Your passwords will appear here</p>
          <p className="text-xs text-slate-400">Configure settings and click Generate</p>
        </div>
      )}

      {/* Security tips */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          Password security tips
        </h3>
        <ul className="space-y-2">
          {[
            'Use a unique password for every account - never reuse passwords',
            'Use a password manager like 1Password or Bitwarden to store them safely',
            'Enable two-factor authentication (2FA) wherever possible',
            'Passwords 16+ characters with mixed types are extremely difficult to crack',
            'Your passwords are generated locally - we never see or store them',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <path d="M1 3L3 5L7 1" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
