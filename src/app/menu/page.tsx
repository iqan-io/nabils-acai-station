import type { Metadata } from "next";
import { StationPage, Panel } from "@/components/station/StationPanels";
import { StationMenuBrowser } from "@/components/station/StationMenuBrowser";
import { OrderPickupPill } from "@/components/station/OrderPickupPill";
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
    <StationPage>
      {/* The menu is the reference's own signature page, so it is the opening
          panel rather than sitting behind a hero: the categories are the first
          thing on screen. */}
      <Panel opening labelledBy="menu-title">
        <h1 id="menu-title" className="sr-only">
          Pick your sweet — the full Nabil&apos;s menu
        </h1>
        <StationMenuBrowser />
      </Panel>

      <OrderPickupPill placement="menu_page" />
    </StationPage>
  );
}
