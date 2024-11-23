import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(md|py)$/, // Target .md and .py files
      use: 'raw-loader',   // Use raw-loader to import them as strings
    });
    return config;
  },
};

export default nextConfig;