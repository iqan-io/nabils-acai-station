import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.nabilsacaistation.com.au",
          },
        ],
        destination: "https://nabilsacaistation.com.au/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
