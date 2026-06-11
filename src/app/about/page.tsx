import type { Metadata } from "next";
import { AboutHero, FounderFeature } from "@/components/sections/AboutStory";
// TeamGrid is intentionally not rendered yet — it still holds placeholder
// "Team Member One/Two…" cards. Re-add <TeamGrid /> below once real staff
// names + headshots land in `team` (src/lib/brand.ts).
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
      <FinalCta />
    </>
  );
}
