import type { Metadata } from "next";
import { MenuHero, MenuFull } from "@/components/sections/MenuFull";
import { CategoryNav } from "@/components/menu/CategoryNav";
import { NightCta } from "@/components/shared/NightCta";
import { pageMetadata } from "@/lib/seo";

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
      <MenuHero />
      <CategoryNav />
      <MenuFull />
      <NightCta secondaryHref="/locations" secondaryLabel="Find a store" />
    </>
  );
}
