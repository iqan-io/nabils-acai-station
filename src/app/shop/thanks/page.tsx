import type { Metadata } from "next";
import Link from "next/link";
import {
  StationPage,
  Panel,
  PanelBody,
  stationStyles as s,
} from "@/components/station/StationPanels";
import { ClearCart } from "@/components/shop/ClearCart";
import { pageMetadata } from "@/lib/seo";

// Where Square sends the buyer after a successful payment (`redirect_url` in
// `/api/checkout`). Square has already emailed the receipt.
export const metadata: Metadata = pageMetadata({
  title: "Order received",
  description: "Thanks for your order from Nabil's Açaí Station.",
  path: "/shop/thanks",
  noindex: true,
});

export default function Page() {
  return (
    <StationPage>
      <Panel opening labelledBy="thanks-title">
        <PanelBody>
          <span className={s.label}>Order received</span>
          <h1 id="thanks-title" className={s.title}>
            Thank you. It&apos;s on its way to the packing bench.
          </h1>
          <p className={s.lede}>
            Square has emailed your receipt. We&apos;ll pack your order and post
            it to the address you gave at checkout.
          </p>
          <div className={s.textActions}>
            <Link href="/shop">Back to the shop</Link>
            <Link href="/">Home</Link>
          </div>
        </PanelBody>
      </Panel>
      <ClearCart />
    </StationPage>
  );
}
