import OfflineClient from './OfflineClient';

export const metadata = {
  title: 'Offline',
  description: "You're offline. Reconnect to continue using PinMyBusiness tools.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: '/offline' },
};

export default function OfflinePage() {
  return <OfflineClient />;
}
