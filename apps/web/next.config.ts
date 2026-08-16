import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  transpilePackages: ["@envirescue/types", "@envirescue/ui"],
};

export default nextConfig;
