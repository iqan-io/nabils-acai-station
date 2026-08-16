import type { Metadata } from "next";
import { brand, locations } from "@/lib/brand";

const fallbackSiteUrl = "https://nabilsacaistation.com.au";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl
).replace(/\/+$/, "");

export const defaultKeywords = [
  "acai Perth",
  "acai bowls Perth",
  "Dubai chocolate Perth",
  "dessert cafe Mount Lawley",
  "Mount Lawley dessert",
  "Ballajura dessert",
  "crepes Perth",
  "Lebanese sweets Perth",
  "Nabil's Acai Station",
];

const defaultImage = {
  url: "/images/enhanced/hero-bueno-editorial-v3.jpg",
  width: 1200,
  height: 630,
  alt: "Nabil's Acai Station acai bowl with chocolate drizzle and strawberries",
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: brand.name,
      type: "website",
      locale: "en_AU",
      images: [defaultImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage.url],
    },
  };
}

function mtLawleyHoursSpecification() {
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday"],
      opens: "11:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Thursday", "Friday", "Saturday"],
      opens: "11:00",
      closes: "23:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "11:00",
      closes: "22:30",
    },
  ];
}

export function localBusinessJsonLd() {
  const [mountLawley, ballajura] = locations;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: brand.name,
        url: siteUrl,
        logo: absoluteUrl("/brand/logo-round.png"),
        sameAs: [
          brand.instagram.url,
          brand.tiktok.url,
          mountLawley.mapsUrl,
          ballajura.mapsUrl,
        ],
      },
      {
        "@type": "Restaurant",
        "@id": absoluteUrl("/#restaurant"),
        name: brand.name,
        url: siteUrl,
        image: absoluteUrl(defaultImage.url),
        telephone: brand.phone,
        priceRange: "$$",
        menu: absoluteUrl("/menu"),
        servesCuisine: [
          "Acai bowls",
          "Dessert",
          "Crepes",
          "Dubai chocolate",
          "Lebanese sweets",
        ],
        sameAs: [
          brand.instagram.url,
          brand.tiktok.url,
          mountLawley.mapsUrl,
          ballajura.mapsUrl,
        ],
        department: [
          {
            "@type": "Restaurant",
            "@id": absoluteUrl("/locations#mount-lawley"),
            name: `${brand.name} - Mount Lawley`,
            url: absoluteUrl("/locations#mount-lawley"),
            telephone: brand.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: "664 Beaufort St",
              addressLocality: "Mount Lawley",
              addressRegion: "WA",
              postalCode: "6050",
              addressCountry: "AU",
            },
            hasMap: mountLawley.mapsUrl,
            openingHoursSpecification: mtLawleyHoursSpecification(),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: mountLawley.rating,
              reviewCount: mountLawley.reviewCount,
            },
          },
          {
            "@type": "Restaurant",
            "@id": absoluteUrl("/locations#ballajura"),
            name: `${brand.name} - Ballajura`,
            url: absoluteUrl("/locations#ballajura"),
            telephone: brand.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: "N Illawarra Cres",
              addressLocality: "Ballajura",
              addressRegion: "WA",
              postalCode: "6066",
              addressCountry: "AU",
            },
            hasMap: ballajura.mapsUrl,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: ballajura.rating,
              reviewCount: ballajura.reviewCount,
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: brand.name,
        url: siteUrl,
        publisher: {
          "@id": absoluteUrl("/#organization"),
        },
        inLanguage: "en-AU",
      },
    ],
  };
}
