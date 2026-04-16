'use client';

import { useState } from 'react';
import { Mail, Copy, Check, Linkedin, Twitter, Globe, Phone, Briefcase } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';

const THEMES = [
  { id: 'indigo',  label: 'Indigo',  primary: '#4f46e5', text: '#0f172a' },
  { id: 'emerald', label: 'Emerald', primary: '#059669', text: '#0f172a' },
  { id: 'rose',    label: 'Rose',    primary: '#e11d48', text: '#0f172a' },
  { id: 'amber',   label: 'Amber',   primary: '#d97706', text: '#0f172a' },
  { id: 'slate',   label: 'Slate',   primary: '#334155', text: '#0f172a' },
];

export default function EmailSignatureGenerator() {
  const [form, setForm] = useState({
    name: '', title: '', company: '',
    email: '', phone: '', website: '',
    linkedin: '', twitter: '',
    avatar: '',
  });
  const [themeId, setThemeId] = useState('indigo');
  const [copied, setCopied] = useState(false);

  const theme = THEMES.find((t) => t.id === themeId);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const signatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;border-right:3px solid ${theme.primary};">
      ${form.avatar
        ? `<img src="${form.avatar}" alt="${form.name}" width="64" height="64" style="border-radius:50%;display:block;" />`
        : `<div style="width:64px;height:64px;border-radius:50%;background:${theme.primary};display:flex;align-items:center;justify-content:center;color:white;font-size:22px;font-weight:bold;text-align:center;line-height:64px;">${form.name ? form.name.charAt(0).toUpperCase() : '?'}</div>`
      }
    </td>
    <td style="padding-left:16px;vertical-align:top;">
      <p style="margin:0;font-size:16px;font-weight:bold;color:${theme.text};">${form.name || 'Your Name'}</p>
      ${form.title ? `<p style="margin:2px 0 0;font-size:13px;color:${theme.primary};font-weight:600;">${form.title}</p>` : ''}
      ${form.company ? `<p style="margin:2px 0 0;font-size:13px;color:#64748b;">${form.company}</p>` : ''}
      <p style="margin:8px 0 0;font-size:12px;color:#94a3b8;">──────────────────</p>
      ${form.email ? `<p style="margin:4px 0 0;font-size:12px;color:#64748b;">✉ <a href="mailto:${form.email}" style="color:${theme.primary};text-decoration:none;">${form.email}</a></p>` : ''}
      ${form.phone ? `<p style="margin:2px 0 0;font-size:12px;color:#64748b;">📞 <a href="tel:${form.phone}" style="color:#64748b;text-decoration:none;">${form.phone}</a></p>` : ''}
      ${form.website ? `<p style="margin:2px 0 0;font-size:12px;color:#64748b;">🌐 <a href="${form.website}" style="color:${theme.primary};text-decoration:none;">${form.website.replace(/^https?:\/\//, '')}</a></p>` : ''}
      ${(form.linkedin || form.twitter) ? `
      <p style="margin:6px 0 0;">
        ${form.linkedin ? `<a href="${form.linkedin}" style="display:inline-block;margin-right:6px;padding:3px 8px;background:${theme.primary};color:white;border-radius:4px;font-size:11px;text-decoration:none;font-weight:600;">LinkedIn</a>` : ''}
        ${form.twitter ? `<a href="https://twitter.com/${form.twitter.replace('@','')}" style="display:inline-block;padding:3px 8px;background:#1da1f2;color:white;border-radius:4px;font-size:11px;text-decoration:none;font-weight:600;">Twitter</a>` : ''}
      </p>` : ''}
    </td>
  </tr>
</table>`.trim();

  const handleCopyHtml = async () => {
    await copyToClipboard(signatureHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Mail size={16} className="text-sky-600" />
          Your Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Jane Smith" value={form.name} onChange={set('name')} icon={Briefcase} />
          <Input label="Job Title" placeholder="Marketing Manager" value={form.title} onChange={set('title')} />
          <Input label="Company" placeholder="Acme Corp" value={form.company} onChange={set('company')} />
          <Input label="Email" placeholder="jane@acme.com" type="email" value={form.email} onChange={set('email')} icon={Mail} />
          <Input label="Phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} icon={Phone} />
          <Input label="Website" placeholder="https://acme.com" value={form.website} onChange={set('website')} icon={Globe} />
          <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/jane" value={form.linkedin} onChange={set('linkedin')} icon={Linkedin} />
          <Input label="Twitter / X handle" placeholder="@janesmith" value={form.twitter} onChange={set('twitter')} icon={Twitter} />
          <Input
            label="Profile image URL (optional)"
            placeholder="https://... .jpg"
            value={form.avatar}
            onChange={set('avatar')}
            containerClassName="sm:col-span-2"
            hint="Paste a direct image URL (HTTPS). Leave blank to use initials."
          />
        </div>
      </div>

      {/* Theme picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Accent Color</h2>
        <div className="flex flex-wrap gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeId(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                themeId === t.id ? 'border-slate-900 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span
                className="w-4 h-4 rounded-full inline-block shrink-0"
                style={{ background: t.primary }}
              />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-900">Live Preview</h2>
          <button
            onClick={handleCopyHtml}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
            }`}
          >
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy HTML</>}
          </button>
        </div>

        {/* Rendered preview */}
        <div
          className="p-5 bg-slate-50 rounded-xl border border-slate-100"
          dangerouslySetInnerHTML={{ __html: signatureHtml }}
        />

        {/* Raw HTML */}
        <details className="mt-4">
          <summary className="text-xs font-medium text-slate-500 cursor-pointer hover:text-slate-700 select-none">
            Show raw HTML
          </summary>
          <pre className="mt-3 p-4 bg-slate-900 text-slate-300 text-xs rounded-xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
            {signatureHtml}
          </pre>
        </details>
      </div>

      {/* How to use */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">How to add to Gmail / Outlook</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            ['Gmail', 'Settings → See all settings → General → Signature → Create new → Paste HTML in source mode'],
            ['Outlook', 'Settings → View all Outlook settings → Compose and reply → Email signature → Paste HTML'],
            ['Apple Mail', 'Mail → Preferences → Signatures → Create → Paste HTML source'],
            ['Thunderbird', 'Account Settings → Signature text → Enable HTML → Paste HTML'],
          ].map(([client, steps]) => (
            <div key={client} className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-bold text-slate-800 mb-1">{client}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{steps}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
