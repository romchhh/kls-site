import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
    ],
  },
  // Keep heavy Node packages out of the client/server bundle graph
  serverExternalPackages: ["puppeteer", "exceljs", "@prisma/client", "bcryptjs"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
