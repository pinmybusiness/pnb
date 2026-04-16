/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 🔥 MOST IMPORTANT

  reactStrictMode: true,

  images: {
    remotePatterns: [],
    unoptimized: true, // ⚠️ required for static export
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;