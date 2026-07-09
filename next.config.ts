import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
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
