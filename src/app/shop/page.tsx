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
import { productImages } from "@/lib/productImages";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shop online",
  description:
    "Order Nabil's Dubai chocolate and Lebanese sweets online, posted anywhere in Australia by Australia Post.",
  path: "/shop",
  keywords: [
    "Dubai chocolate online Australia",
    "baklava online Australia",
    "Lebanese sweets delivery Australia",
  ],
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
              and we&apos;ll post them to you, anywhere in Australia, by{" "}
              {shop.postage.carrier}{" "}
              {shop.postage.services.map((service) => service.name).join(" or ")}.
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
