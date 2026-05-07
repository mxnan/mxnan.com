import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Image Optimization ────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ─── Performance ────────────────────────────────────────────────────────
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // ─── Experimental Features ──────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "motion/react",
      "sonner",
      "@radix-ui/*",
    ],
  },

  // ─── Security Headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
