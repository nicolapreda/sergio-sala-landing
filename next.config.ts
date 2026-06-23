import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vz-644ea2f1-c54.b-cdn.net',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply to all routes except Next.js static assets (already cache-busted by hash)
        source: "/((?!_next/static|_next/image|favicon).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
