/**
 * Canonical paths for the client-supplied website logo kit received
 * 2026-08-15. WebP is used for rendered chrome; PNG/ICO remain available for
 * metadata, schema consumers, and platforms that require those formats.
 */
export const brandAssets = {
  primaryLogo: "/images/brand/01_nabils_primary_full_logo_transparent.webp",
  primaryLogoPng:
    "/images/brand/01_nabils_primary_full_logo_transparent.png",
  horizontalLogo:
    "/images/brand/02_nabils_horizontal_header_logo_transparent.webp",
  mascotMark: "/images/brand/03_nabils_mascot_mark_transparent.webp",
  faviconIco: "/images/brand/04_nabils_favicon.ico",
  faviconPng: "/images/brand/04_nabils_favicon_chef_head_512.png",
  faviconWebp: "/images/brand/04_nabils_favicon_chef_head_512.webp",
  darkBackgroundLogo:
    "/images/brand/05_nabils_logo_for_dark_backgrounds.webp",
} as const;
