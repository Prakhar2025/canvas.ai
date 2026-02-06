import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for multiple lockfiles warning
  turbopack: {
    root: './',
  },
};

export default nextConfig;
