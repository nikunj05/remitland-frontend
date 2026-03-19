import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // Enable strict mode for better development error detection
  reactStrictMode: true,

  // Allow images from common CDNs (extend as needed)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Proxy API requests to the Laravel backend during development
  // This avoids CORS issues by routing /api/* through Next.js
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
