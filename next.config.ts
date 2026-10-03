import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    // This allows you to use the high-performance Next.js Image component
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.linkedin.com',
      },
      // Add other domains if you plan to host images externally
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
