import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.NETWORK_IP_ADDRESS || "192.168.1.41"], //replace with your own network ip
};

export default nextConfig;
