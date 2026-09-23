import type { Metadata } from "next";
import Link from "next/link";
import { SiDoordash, SiUbereats } from "react-icons/si";
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
import { brand, locations } from "@/lib/brand";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Order",
  description:
    "Order Nabil's Acai Station for pickup or delivery in Perth through Uber Eats or DoorDash. Get acai bowls, Dubai chocolate, crepes and desserts from Mount Lawley or Ballajura.",
  path: "/order",
  keywords: [
    "order acai Perth",
    "acai delivery Perth",
    "Dubai chocolate delivery Perth",
    "dessert delivery Mount Lawley",
  ],
});

/*
  The platform brand colours (Uber Eats green, DoorDash red) are the one place
  a colour outside the palette is allowed: they identify a third party, so they
  are information rather than decoration. They stay on the icon glyph only.
*/
const delivery = [
  {
    name: "Uber Eats",
    platform: "ubereats",
    url: brand.orderUrl,
    note: "Choose your available Nabil's location in Uber Eats.",
    logo: SiUbereats,
    colour: "#06C167",
  },
  {
    name: "DoorDash",
    platform: "doordash",
    url: brand.doordashUrl,
    note: "Ballajura delivery through DoorDash.",
    logo: SiDoordash,
    colour: "#FF3008",
  },
];

export default function Page() {
  return (
    <StationPage>
      <Panel opening labelledBy="order-title">
        <PanelSplit wide>
          <PanelBody>
            <span className={s.label}>Order Nabil&apos;s</span>
            <h1 id="order-title" className={s.title}>
              Get the good stuff.
            </h1>
            <p className={s.lede}>
              Choose delivery, get directions for pickup, or browse the menu
              before the group chat changes its mind.
            </p>
            <div className={s.textActions}>
              <TrackedLink
                event="order_click"
                eventParams={{ platform: "ubereats", placement: "order_hero" }}
                href={brand.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Order delivery
              </TrackedLink>
              <Link href="/menu">See the menu</Link>
            </div>
          </PanelBody>
          {/* Was `hero-dubai-strawberry-cup.jpg`, which is a promotional flyer
              with "$10 · 20th–21st Dec ONLY" and an address burned into the
              artwork. A dated offer that has expired cannot be a page's
              permanent hero. This is the dark-ground derivative built for the
              homepage capsules: a real Nabil's açaí cup already lit on near
              black, so it reads as part of the panel rather than a photo
              dropped into it. */}
          <PanelMedia
            src="/images/products/hero-dark/acai-dark-v1.webp"
            alt="A Nabil's açaí cup with granola, blueberries and strawberries under a thick drizzle"
            priority
          />
        </PanelSplit>
      </Panel>

      <Panel labelledBy="order-ways">
        <PanelBody>
          <span className={s.label}>Two ways to get it</span>
          <h2 id="order-ways" className={s.heading}>
            Delivered, or straight from the counter.
          </h2>

          <div className={s.duo} style={{ marginTop: "var(--ds-step-5)" }}>
            <article>
              <h3 className={s.subheading}>Bring Nabil&apos;s to you</h3>
              <div className={s.rows}>
                {delivery.map((item) => {
                  const Logo = item.logo;
                  return (
                    <TrackedLink
                      key={item.name}
                      event="order_click"
                      eventParams={{ platform: item.platform, placement: "order_page" }}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.row}
                    >
                      <span className={s.rowMain}>
                        <Logo aria-hidden className="size-7 shrink-0" style={{ color: item.colour }} />
                        <span>
                          <span className={s.rowTitle}>{item.name}</span>
                          <span className={s.rowNote}>{item.note}</span>
                        </span>
                      </span>
                      <span aria-hidden className={s.rowArrow}>
                        →
                      </span>
                    </TrackedLink>
                  );
                })}
              </div>
              <p className={s.note}>
                Availability varies by platform, location and time.
              </p>
            </article>

            <article>
              <h3 className={s.subheading}>Head to the counter</h3>
              <div className={s.rows}>
                {locations.map((location) => {
                  const phone = "phone" in location ? location.phone : undefined;
                  return (
                    <TrackedLink
                      key={location.slug}
                      event="directions_click"
                      eventParams={{
                        platform: "google_maps",
                        location: location.slug,
                        placement: "order_page",
                      }}
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.row}
                    >
                      <span className={s.rowMain}>
                        <span>
                          <span className={s.rowTitle}>{location.name}</span>
                          <span className={s.rowNote}>
                            {location.address}
                            {phone ? ` · ${phone}` : ""}
                          </span>
                        </span>
                      </span>
                      <span aria-hidden className={s.rowArrow}>
                        →
                      </span>
                    </TrackedLink>
                  );
                })}
              </div>
              <p className={s.note}>Directions open in Google Maps.</p>
            </article>
          </div>
        </PanelBody>
      </Panel>

      <ContactPanel placement="order_contact" />

      <OrderPickupPill placement="order_page" />
    </StationPage>
  );
}
