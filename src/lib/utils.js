import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Copy text to clipboard, returns success boolean */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}

/** Format number as currency */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Download a data URL as a file */
export function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Generate a random string */
export function randomId(len = 8) {
  return Math.random().toString(36).substring(2, 2 + len);
}

/** Clamp a number between min and max */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/** Validate URL */
export function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/** Truncate string */
export function truncate(str, length = 60) {
  if (str.length <= length) return str;
  return str.slice(0, length) + '…';
}

/** Debounce function */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Country codes for phone number inputs */
export const COUNTRY_CODES = [
  { code: '+1',   country: 'US/CA', flag: '🇺🇸' },
  { code: '+44',  country: 'UK',    flag: '🇬🇧' },
  { code: '+91',  country: 'India', flag: '🇮🇳' },
  { code: '+61',  country: 'AU',    flag: '🇦🇺' },
  { code: '+49',  country: 'DE',    flag: '🇩🇪' },
  { code: '+33',  country: 'FR',    flag: '🇫🇷' },
  { code: '+34',  country: 'ES',    flag: '🇪🇸' },
  { code: '+39',  country: 'IT',    flag: '🇮🇹' },
  { code: '+55',  country: 'BR',    flag: '🇧🇷' },
  { code: '+52',  country: 'MX',    flag: '🇲🇽' },
  { code: '+81',  country: 'JP',    flag: '🇯🇵' },
  { code: '+82',  country: 'KR',    flag: '🇰🇷' },
  { code: '+86',  country: 'CN',    flag: '🇨🇳' },
  { code: '+65',  country: 'SG',    flag: '🇸🇬' },
  { code: '+971', country: 'UAE',   flag: '🇦🇪' },
  { code: '+966', country: 'SA',    flag: '🇸🇦' },
  { code: '+27',  country: 'ZA',    flag: '🇿🇦' },
  { code: '+234', country: 'NG',    flag: '🇳🇬' },
  { code: '+62',  country: 'ID',    flag: '🇮🇩' },
  { code: '+60',  country: 'MY',    flag: '🇲🇾' },
  { code: '+64',  country: 'NZ',    flag: '🇳🇿' },
  { code: '+31',  country: 'NL',    flag: '🇳🇱' },
  { code: '+46',  country: 'SE',    flag: '🇸🇪' },
  { code: '+47',  country: 'NO',    flag: '🇳🇴' },
  { code: '+45',  country: 'DK',    flag: '🇩🇰' },
  { code: '+41',  country: 'CH',    flag: '🇨🇭' },
  { code: '+7',   country: 'RU',    flag: '🇷🇺' },
  { code: '+380', country: 'UA',    flag: '🇺🇦' },
  { code: '+48',  country: 'PL',    flag: '🇵🇱' },
  { code: '+92',  country: 'PK',    flag: '🇵🇰' },
  { code: '+880', country: 'BD',    flag: '🇧🇩' },
  { code: '+84',  country: 'VN',    flag: '🇻🇳' },
  { code: '+66',  country: 'TH',    flag: '🇹🇭' },
  { code: '+63',  country: 'PH',    flag: '🇵🇭' },
];

/** Supported currencies */
export const CURRENCIES = [
  { code: 'USD', symbol: '$',  name: 'US Dollar' },
  { code: 'EUR', symbol: '€',  name: 'Euro' },
  { code: 'GBP', symbol: '£',  name: 'British Pound' },
  { code: 'INR', symbol: '₹',  name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥',  name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥',  name: 'Chinese Yuan' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'ZAR', symbol: 'R',  name: 'South African Rand' },
  { code: 'NGN', symbol: '₦',  name: 'Nigerian Naira' },
  { code: 'KRW', symbol: '₩',  name: 'South Korean Won' },
];
