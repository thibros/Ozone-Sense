import type { NextConfig } from 'next';

// This checks if we are building for Cloudflare
const isCloudflare = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'cloudflare';

const nextConfig: NextConfig = {
  /* Keep your existing ignore rules */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  /* Toggle the Static Export based on the environment */
  output: isCloudflare ? 'export' : undefined,

  images: {
    // This is the key: if Cloudflare, we MUST be unoptimized.
    // If not Cloudflare (Firebase), we keep normal optimization.
    unoptimized: isCloudflare,
    
    /* Your existing remote patterns stay exactly as they are */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;