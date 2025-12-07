/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable for MediaPipe to work
  images: {
    domains: ['lh3.googleusercontent.com', 'localhost', 'www.fasterq.in', 'api.fasterq.in'],
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

export default nextConfig;