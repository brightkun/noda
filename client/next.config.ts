import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  // По умолчанию прокси рвёт запрос через 30 с, а ответ AI может идти дольше
  experimental: { proxyTimeout: 120_000 },
  // Браузер ходит на /api/*, Next проксирует на Express: CORS не нужен
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/api/:path*` }];
  },
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
