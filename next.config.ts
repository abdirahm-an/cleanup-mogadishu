import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // Disable static exports to prevent database access during Vercel build
  images: {
    remotePatterns: ['**'],
  },
};

export default nextConfig;
