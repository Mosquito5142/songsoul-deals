import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ปิด cacheComponents เพื่อให้หน้าแอดมินอ่านคุกกี้ได้ตรงๆ
  // และให้หน้าแรก revalidate เมื่อบันทึกสินค้า
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
