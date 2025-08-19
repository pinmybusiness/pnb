/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: false, // Disable for MediaPipe to work
  images: {
    domains: ['lh3.googleusercontent.com', 'localhost', 'www.randomstrangerchats.com', 'www.pridelocation.com', 'www.c.animaapp.com'],
  },
};

export default nextConfig;
