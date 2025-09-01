import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["mikulnews.com", "dev.mikulnews.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add experimental features for better chunk handling
  experimental: {
    optimizePackageImports: ["@ckeditor/ckeditor5-react", "react-apexcharts"],
  },
};

export default nextConfig;
