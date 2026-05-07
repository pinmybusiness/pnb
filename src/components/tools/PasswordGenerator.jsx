'use client';

import { useState, useCallback } from 'react';
import { KeyRound, RefreshCw, Shield, ShieldAlert, ShieldCheck, ShieldOff, Check, Copy, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import CopyButton from '@/components/ui/CopyButton';
import { copyToClipboard, cn } from '@/lib/utils';

function PasswordRow({ pwd }) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleClick = async () => {
    const ok = await copyToClipboard(pwd);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const display = hidden ? '•'.repeat(pwd.length) : pwd;

  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2.5 rounded-lg border transition-colors group',
        copied
          ? 'bg-emerald-500/[0.08] border-emerald-400/30'
          : 'bg-[#0d0e13] border-[#232733] hover:border-[#2c3140]'
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        title="Click to copy"
        className="flex-1 text-left text-[13px] font-mono text-slate-100 break-all px-1.5 cursor-pointer"
      >
        {display}
      </button>
      <button
        type="button"
        onClick={() => setHidden((v) => !v)}
        aria-label={hidden ? 'Show password' : 'Hide password'}
        className="shrink-0 p-1.5 rounded text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors"
      >
        {hidden ? <Eye size={13} /> : <EyeOff size={13} />}
      </button>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Copy password"
        className={cn(
          'shrink-0 p-1.5 rounded transition-colors',
          copied
            ? 'text-emerald-300'
            : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
        )}
      >
        {copied ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} />}
      </button>
    </div>
  );
}

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
  if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700', Icon: ShieldOff };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 2) return { score, label: 'Weak',   color: 'bg-rose-500',    Icon: ShieldAlert };
  if (score <= 4) return { score, label: 'Fair',   color: 'bg-amber-400',   Icon: Shield };
  if (score <= 5) return { score, label: 'Good',   color: 'bg-sky-400',     Icon: Shield };
  return           { score, label: 'Strong', color: 'bg-emerald-400', Icon: ShieldCheck };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [count, setCount]   = useState(1);
  const [opts, setOpts]     = useState({
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
      <div className="rounded-2xl surface p-6 space-y-6">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <KeyRound size={16} className="text-rose-300" />
          Generator Settings
        </h2>

        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-200">Password Length</label>
            <span className="text-2xl font-semibold text-white tabular-nums">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/[0.06] accent-indigo-400"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1.5">
            <span>4</span><span>32</span><span>64</span>
          </div>
        </div>

        {/* Character sets */}
        <div>
          <p className="text-sm font-medium text-slate-200 mb-3">Include characters</p>
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
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all backdrop-blur-sm ${
                  opts[key]
                    ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-100 shadow-[0_0_0_1px_rgba(129,140,248,0.2)]'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                <span>{label}</span>
                <span className={`text-xs font-mono ${opts[key] ? 'text-indigo-300' : 'text-slate-500'}`}>
                  {example}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-200">Generate multiple</label>
            <span className="text-sm font-bold text-slate-200">
              {count} password{count > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex gap-2">
            {[1, 3, 5, 10].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-all backdrop-blur-sm ${
                  count === n
                    ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-100'
                    : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
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
          <p className="text-xs text-rose-300 text-center -mt-4">
            Select at least one character type
          </p>
        )}
      </div>

      {/* Results */}
      {passwords.length > 0 && (
        <div className="rounded-2xl surface p-6 space-y-4 fade-up">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Generated Passwords</h2>
            <button
              onClick={generate}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors"
            >
              <RefreshCw size={12} /> Regenerate
            </button>
          </div>

          {/* Strength indicator for first password */}
          {passwords[0] && (
            <div className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <StrengthIcon
                size={18}
                className={
                  strength.label === 'Strong' ? 'text-emerald-300'
                  : strength.label === 'Good'   ? 'text-sky-300'
                  : strength.label === 'Fair'   ? 'text-amber-300'
                  : 'text-rose-300'
                }
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">
                    Strength: {strength.label}
                  </span>
                  <span className="text-xs text-slate-500">Score {strength.score}/7</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        i < strength.score ? strength.color : 'bg-white/[0.05]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {passwords.map((pwd, i) => (
              <PasswordRow key={i} pwd={pwd} index={i} />
            ))}
          </div>

          <CopyButton
            text={passwords.join('\n')}
            label={`Copy all ${passwords.length}`}
            size="md"
            className="w-full justify-center"
          />
        </div>
      )}

      {/* Empty state */}
      {passwords.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-white/[0.08] p-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-400/30 mx-auto mb-4">
            <KeyRound size={26} className="text-rose-300" />
          </div>
          <p className="text-sm font-medium text-slate-300 mb-1">Your passwords will appear here</p>
          <p className="text-xs text-slate-500">Configure settings and click Generate</p>
        </div>
      )}

      {/* Security tips */}
      <div className="rounded-2xl surface p-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-300" />
          Password security tips
        </h3>
        <ul className="space-y-2.5">
          {[
            'Use a unique password for every account - never reuse passwords',
            'Use a password manager like 1Password or Bitwarden to store them safely',
            'Enable two-factor authentication (2FA) wherever possible',
            'Passwords 16+ characters with mixed types are extremely difficult to crack',
            'Your passwords are generated locally - we never see or store them',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={10} className="text-emerald-300" strokeWidth={3} />
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
