import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google OAuth avatars
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Fallback avatar service
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },
};

export default nextConfig;
