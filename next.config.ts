import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      // Retired case studies: they named internal tools, so they are gone.
      {
        source: "/projects/nokia-dashboard",
        destination: "/#about",
        permanent: true,
      },
      {
        source: "/projects/cursor-portal",
        destination: "/#about",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "elias-elloumi.vercel.app" }],
        destination: "https://elias-elloumi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
