/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "iqivyevxvhssrslgcgam.supabase.co"], 
  },
  experimental: {
    appDir: true, // Garante compatibilidade com a App Router
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

module.exports = nextConfig;
