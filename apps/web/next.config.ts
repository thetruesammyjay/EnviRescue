import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@envirescue/types", "@envirescue/ui"],
};

export default nextConfig;
