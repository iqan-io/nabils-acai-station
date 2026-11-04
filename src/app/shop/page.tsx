import type { Metadata } from "next";
import {
  StationPage,
  Panel,
  PanelBody,
  PanelSplit,
  PanelMedia,
  stationStyles as s,
} from "@/components/station/StationPanels";
import { ContactPanel } from "@/components/station/ContactPanel";
import { ShopCart } from "@/components/shop/ShopCart";
import { shop } from "@/lib/brand";
import { formatAud } from "@/lib/shop";
import { productImages } from "@/lib/productImages";
import { pageMetadata } from "@/lib/seo";

// Kept out of search and off the nav until launch: postage rates and the
// Lebanese sweets range are still to come from the owner (C-047).
export const metadata: Metadata = pageMetadata({
  title: "Shop online",
  description:
    "Order Nabil's Dubai chocolate and Lebanese sweets online, posted anywhere in Australia. Free shipping from $100.",
  path: "/shop",
  noindex: true,
});

export default function Page() {
  return (
    <StationPage>
      <Panel opening labelledBy="shop-title">
        <PanelSplit wide>
          <PanelBody>
            <span className={s.label}>Shop online</span>
            <h1 id="shop-title" className={s.title}>
              Nabil&apos;s, posted Australia-wide.
            </h1>
            <p className={s.lede}>
              Order the Dubai chocolate and Nabil&apos;s Lebanese sweets online
              and we&apos;ll post them to you, anywhere in Australia. Free
              shipping from{" "}
              {formatAud(shop.freeShippingFromCents)}.
            </p>
          </PanelBody>
          <PanelMedia
            src={productImages.dubaiChocolate.src}
            alt={productImages.dubaiChocolate.alt}
            contain
            priority
          />
        </PanelSplit>
      </Panel>

      <Panel labelledBy="shop-products">
        <PanelBody>
          <span className={s.label}>The range</span>
          <h2 id="shop-products" className={s.heading}>
            Pick your box.
          </h2>
          <ShopCart />
        </PanelBody>
      </Panel>

      <ContactPanel placement="shop_contact" />
    </StationPage>
  );
}
