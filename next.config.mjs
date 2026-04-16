/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  // headers() is not supported with output: 'export'
  // Security headers are set via public/_headers (Cloudflare Pages)
};

export default nextConfig;