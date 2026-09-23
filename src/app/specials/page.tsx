import type { Metadata } from "next";
import Link from "next/link";
import {
  StationPage,
  Panel,
  PanelBody,
  PanelSplit,
  PanelMedia,
  stationStyles as s,
} from "@/components/station/StationPanels";
import { ContactPanel } from "@/components/station/ContactPanel";
import { OrderPickupPill } from "@/components/station/OrderPickupPill";
import { brand } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Specials",
    description:
      "Dubai chocolate drops, seasonal flavours and limited-run specials from Nabil's Acai Station in Perth. Follow the latest Mount Lawley and Ballajura dessert updates.",
    path: "/specials",
    keywords: [
      "Dubai chocolate Perth",
      "Dubai chocolate specials Perth",
      "viral desserts Perth",
      "Nabil's specials",
    ],
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <StationPage>
      <Panel opening labelledBy="specials-title">
        <PanelSplit wide>
          <PanelBody>
            <span className={s.label}>Drops + limited runs</span>
            <h1 id="specials-title" className={s.title}>
              New sweets land fast.
            </h1>
            <p className={s.lede}>
              Seasonal flavours, Dubai chocolate drops and one-off experiments
              show up on Instagram first. The everyday favourites are always on
              the menu.
            </p>
            <div className={s.textActions}>
              <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
                Follow {brand.instagram.handle}
              </a>
              <Link href="/menu">Browse the menu</Link>
            </div>
          </PanelBody>
          {/* The studio frame of this product sits on cream, and a cream half
              beside a black half is the exact clash Ali rejected in the first
              capsule round. The dark-ground derivative of the same product is
              the one that belongs on a black page. */}
          <PanelMedia
            src="/images/products/hero-dark/dubai-chocolate-dark-v1.webp"
            alt="Nabil's Dubai chocolate stacked and cut open to show the pistachio kataifi filling"
            priority
          />
        </PanelSplit>
      </Panel>

      <ContactPanel placement="specials_contact" />

      <OrderPickupPill placement="specials_page" />
    </StationPage>
  );
}
