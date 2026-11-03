import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  images: {
    deviceSizes: [320, 360, 480, 640, 768, 1024, 1440],
    imageSizes: [320, 480, 640, 768, 1024, 1440],
    formats: ["image/webp"],
    qualities: [75, 90],
  },
  poweredByHeader: false,
};
export default config;
