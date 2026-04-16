import {
  MessageCircle,
  QrCode,
  FileText,
  Mail,
  KeyRound,
} from 'lucide-react';

export const TOOLS = [
  {
    slug: 'whatsapp-link-generator',
    name: 'WhatsApp Link Generator',
    tagline: 'Create click-to-chat WhatsApp links in seconds',
    description:
      'Generate shareable WhatsApp links with pre-filled messages. Perfect for business websites, email signatures, and marketing campaigns.',
    icon: MessageCircle,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    href: '/tools/whatsapp-link-generator',
    category: 'Communication',
    badge: 'Most Popular',
    keywords: [
      'whatsapp link generator',
      'click to chat whatsapp',
      'whatsapp business link',
      'wa.me link generator',
    ],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    tagline: 'Generate custom QR codes for any URL or text',
    description:
      'Create high-quality QR codes for websites, menus, contact info, and more. Customize colors, download as PNG.',
    icon: QrCode,
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-500',
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    href: '/tools/qr-code-generator',
    category: 'Marketing',
    badge: 'Free Download',
    keywords: [
      'qr code generator',
      'free qr code',
      'custom qr code',
      'qr code maker',
    ],
  },
  {
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    tagline: 'Create professional invoices and print as PDF',
    description:
      'Build clean, professional invoices with line items, taxes, and totals. Print or save as PDF instantly.',
    icon: FileText,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    borderColor: 'border-amber-200',
    href: '/tools/invoice-generator',
    category: 'Finance',
    badge: 'PDF Export',
    keywords: [
      'invoice generator',
      'free invoice maker',
      'online invoice generator',
      'invoice template',
    ],
  },
  {
    slug: 'email-signature-generator',
    name: 'Email Signature Generator',
    tagline: 'Build a polished HTML email signature',
    description:
      'Design a professional email signature with your name, title, links, and social profiles. Copy HTML instantly.',
    icon: Mail,
    color: 'sky',
    gradient: 'from-sky-500 to-blue-500',
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-600',
    borderColor: 'border-sky-200',
    href: '/tools/email-signature-generator',
    category: 'Communication',
    badge: 'Copy HTML',
    keywords: [
      'email signature generator',
      'html email signature',
      'professional email signature',
      'free signature maker',
    ],
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    tagline: 'Generate strong, secure passwords instantly',
    description:
      'Create uncrackable passwords with custom length and character sets. No data is stored or transmitted.',
    icon: KeyRound,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-600',
    borderColor: 'border-rose-200',
    href: '/tools/password-generator',
    category: 'Security',
    badge: '100% Private',
    keywords: [
      'password generator',
      'strong password generator',
      'secure password maker',
      'random password generator',
    ],
  },
];

export const TOOL_MAP = Object.fromEntries(TOOLS.map((t) => [t.slug, t]));

export const SITE = {
  name: 'PinMyBusiness',
  domain: 'pinmybusiness.com',
  url: 'https://pinmybusiness.com',
  tagline: 'Free Business Tools for Modern Entrepreneurs',
  description:
    'Free online tools for small businesses, freelancers, and creators. WhatsApp links, QR codes, invoices, email signatures, password generators - no signup required.',
};
