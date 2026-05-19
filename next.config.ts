import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    process.env.NETWORK_IP_ADDRESS || "192.168.1.41",
    "172.29.192.1",
  ], //replace with your own network ip
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
