import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supa.kcldnd.uk",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;