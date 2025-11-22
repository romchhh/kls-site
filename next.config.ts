import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.aliexpress.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "graincomshipping.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.dhl.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ups.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logos-world.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.fedex.com",
        pathname: "/**",
      },
    ],
  },
  // Дозволяємо обробку відео файлів
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(webm|mp4)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;

