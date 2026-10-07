import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // Thumbnail hosts vary per source (cdn.sanity.io, res.infoq.com, blog.cloudflare.com, avatars.githubusercontent.com, …).
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
