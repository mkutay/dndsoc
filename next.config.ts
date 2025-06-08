import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "8mb",
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supa.kcldnd.uk",
        pathname: "/**",
      },
    ],
    loader: "custom",
    loaderFile: './loader.js',
  },
};

export default nextConfig;