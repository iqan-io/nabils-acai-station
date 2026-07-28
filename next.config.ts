import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    qualities: [75, 90],
  },
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
  // Film fully removed as a route (2026-07-28): `/` renders the fast
  // app-router homepage and there is no `/film` experience. The static assets
  // under public/film/ are retained only because the site fonts
  // (/film/fonts/*) and the Locations still (/film/frames/f_0001.jpg) load
  // from those paths; the film's index.html is no longer routed to.
};

export default nextConfig;
