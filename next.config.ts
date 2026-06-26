import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // dummyjson serves user avatars from this host
      { protocol: "https", hostname: "dummyjson.com" },
    ],
  },
};

export default nextConfig;
