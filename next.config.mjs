/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable for MediaPipe to work
  images: {
    domains: ['lh3.googleusercontent.com', 'localhost', 'www.pridelocation.com', 'api.fasterq.in'],
  },
  output: 'standalone', // For AWS Amplify serverful deployment
  async rewrites() {
    return [
      {
        source: '/restaurant/register',
        destination: '/restaurant/register',
      },
    ];
  },
};

// PWA configuration
const withPWA = (await import('next-pwa')).default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default withPWA(nextConfig);