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

// Lets `next dev` talk to the OpenNext Cloudflare adapter so local dev
// matches the deployed Worker (bindings, runtime).
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
