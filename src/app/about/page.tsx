import type { Metadata } from "next";
import { AboutHero, FounderFeature } from "@/components/sections/AboutStory";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "Meet the family behind Nabil's Acai Station — from a Lebanese sweets stall in Ballajura to Perth's viral acai and Dubai chocolate. Founder story and the team.",
  path: "/about",
  keywords: [
    "Nabil's Acai Station founder",
    "Nabil's Acai Station team",
    "about Nabil's Acai Station",
    "Lebanese sweets Perth family",
  ],
});

export default function Page() {
  return (
    <>
      <AboutHero />
      <FounderFeature />
      <TeamGrid />
      <FinalCta />
    </>
  );
}
