import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Don't fail build on ESLint errors
  },

  // Add other config options below
  
};

export default nextConfig;
