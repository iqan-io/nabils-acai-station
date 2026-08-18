import type { Metadata } from "next";
import { LocationsHero, LocationsFull } from "@/components/sections/LocationsFull";
import { NightCta } from "@/components/shared/NightCta";
import { pageMetadata } from "@/lib/seo";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = pageMetadata({
  title: "Locations",
  description:
    "Find Nabil's Acai Station in Mount Lawley and Ballajura. Get Google Maps directions, hours, phone details and location info for both Perth dessert shops.",
  path: "/locations",
  keywords: [
    "Nabil's Acai Station Mount Lawley",
    "Nabil's Acai Station Ballajura",
    "dessert cafe Mount Lawley",
    "acai near Beaufort Street",
  ],
});

export default function Page() {
  return (
    <>
      <ScrollReveal />
      <LocationsHero />
      <LocationsFull />
      <NightCta secondaryHref="/menu" secondaryLabel="Browse the menu" />
    </>
  );
}
