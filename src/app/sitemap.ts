import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { path: "/", priority: 1 },
    { path: "/menu", priority: 0.95 },
    { path: "/order", priority: 0.9 },
    { path: "/locations", priority: 0.9 },
  ].map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}
