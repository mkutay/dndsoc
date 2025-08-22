import type { NextConfig } from "next";

import "./src/env";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "8mb",
    },
    useCache: true,
    globalNotFound: true,
    ppr: "incremental",
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
    loaderFile: "./loader.js",
  },
};

export default nextConfig;
