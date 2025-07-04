import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "randomuser.me",
      "estatesync.s3.eu-north-1.amazonaws.com",
      "www.citypng.com"
    ],
    remotePatterns: [{
      protocol: 'https',
      hostname: 'estatesync.s3.eu-north-1.amazonaws.com',
      pathname: '**'
    }]
  },
};

export default nextConfig;