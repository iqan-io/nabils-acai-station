import type { MetadataRoute } from "next";
import { brandAssets } from "@/lib/brandAssets";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nabil's Acai Station",
    short_name: "Nabil's Acai",
    description:
      "Acai bowls, crepes and Dubai chocolate in Mount Lawley and Ballajura.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf6",
    theme_color: "#5a2a86",
    icons: [
      {
        src: brandAssets.faviconPng,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: brandAssets.faviconWebp,
        sizes: "512x512",
        type: "image/webp",
      },
    ],
  };
}
