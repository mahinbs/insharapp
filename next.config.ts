import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "export" output mode to support API routes (auth callback)
  // output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
