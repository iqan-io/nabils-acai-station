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
import { OrderPickupPill } from "@/components/station/OrderPickupPill";
import { brand, locations } from "@/lib/brand";
import { TrackedLink } from "@/components/shared/TrackedLink";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Locations",
  description:
    "Find Nabil's Acai Station in Mount Lawley and Ballajura. Get Google Maps directions, hours, phone details and location info for both Perth dessert shops.",
  path: "/locations",
  keywords: [
    "Nabil's Acai Station Mount Lawley",
    "Nabil's Acai Station Ballajura",
    "dessert cafe Mount Lawley",
    "acai near Beaufort Street",
  ],
});

/*
  The reference's contact page is a single CONTACT panel. Nabil's has two
  counters and one of them has trading hours worth publishing, so it gets one
  more panel: both counters, stacked, beside a photograph taken inside the
  Mount Lawley shop.

  This replaces two per-location panels whose photographs were wide daytime
  streetscapes — the shop was a small strip in the middle of each frame and
  had to be hand-cropped to be visible at all.
*/
export default function Page() {
  return (
    <StationPage>
      <ContactPanel opening headingLevel={1} placement="locations_contact" />

      <Panel labelledBy="counters-title">
        <PanelSplit>
          <PanelBody>
            <span className={s.label}>Two counters</span>
            <h2 id="counters-title" className={s.heading}>
              See you at yours.
            </h2>
            {locations.map((location) => {
              const phone = "phone" in location ? location.phone : undefined;
              return (
                <article key={location.slug} id={location.slug} className={s.counter}>
                  <h3 className={s.subheading}>{location.name}</h3>
                  <p className={s.lede}>{location.address}</p>
                  <p className={s.note}>
                    {location.rating} ★ · {location.reviewCount} Google reviews · {location.note}
                  </p>
                  {location.hours && (
                    <dl className={s.hours}>
                      {location.hours.map(([day, span]) => (
                        <div key={day}>
                          <dt>{day}</dt>
                          <dd>{span}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className={s.actions}>
                    <TrackedLink
                      event="directions_click"
                      eventParams={{ platform: "google_maps", location: location.slug, placement: "locations_page" }}
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${s.pill} ${s.pillFilled}`}
                    >
                      Directions ↗
                    </TrackedLink>
                    {phone && (
                      <TrackedLink
                        event="call_click"
                        eventParams={{ location: location.slug, placement: "locations_page" }}
                        href={brand.phoneHref}
                        className={s.pill}
                      >
                        {phone}
                      </TrackedLink>
                    )}
                  </div>
                </article>
              );
            })}
          </PanelBody>
          <PanelMedia
            src="/images/enhanced/story-sweet-moments-neon.jpg"
            alt="A Nabil's strawberry cup on the Mount Lawley counter under the Made for Sweet Moments neon"
          />
        </PanelSplit>
      </Panel>

      <OrderPickupPill placement="locations_page" />
    </StationPage>
  );
}
