import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    {
      path: '../fonts/Inter_18pt-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Inter_18pt-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/Inter_18pt-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const yesteryear = localFont({
  src: [
    {
      path: '../fonts/Yesteryear-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-yesteryear',
  display: 'swap',
});
