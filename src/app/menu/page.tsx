import type { Metadata } from "next";
import { MenuHero, MenuFull } from "@/components/sections/MenuFull";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { pageMetadata } from "@/lib/seo";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = pageMetadata({
  title: "Menu",
  description:
    "See the full Nabil's Acai Station menu: acai bowls, Dubai chocolate, crepes, strawberry cups, fruit cocktails, matcha, mocktails, milkshakes and sweets in Perth.",
  path: "/menu",
  keywords: [
    "Nabil's Acai Station menu",
    "acai menu Perth",
    "Dubai chocolate menu Perth",
    "Mount Lawley acai menu",
  ],
});

export default function Page() {
  return (
    <>
      <ScrollReveal />
      <MenuHero />
      <CategoryNav />
      {/* NightCta removed here: MenuFull now closes on its own night band with
          the same two actions, so the old purple/lime CTA was a duplicate. */}
      <MenuFull />
    </>
  );
}
