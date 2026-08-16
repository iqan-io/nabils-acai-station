import Image from "next/image";
import { locations } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";
import { TrackedLink } from "@/components/shared/TrackedLink";

// `w`/`h` are the files' real dimensions and set the media box's aspect ratio.
// Mount Lawley is portrait and Ballajura landscape, so a single fixed ratio
// cropped one or the other badly.
const locationPhotos = [
  {
    src: "/images/locations/location-mount-lawley.png",
    alt: "Inside Nabil's Açaí Station in Mount Lawley",
    w: 1086,
    h: 1449,
  },
  {
    src: "/images/locations/location-ballajura.png",
    alt: "Nabil's Lebanese Sweets counter in Ballajura",
    w: 1448,
    h: 1086,
  },
] as const;

export function LocationsHero() {
  return (
    <section className={styles.opening} aria-labelledby="locations-title">
      <Image
        className={styles.openingMedia}
        src="/images/enhanced/location-mt-lawley-storefront-v2.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={90}
        sizes="100vw"
      />
      <div className={styles.openingScrim} />
      <div className={styles.openingInner}>
        <span className={styles.eyebrow}>Mount Lawley + Ballajura</span>
        <h1 id="locations-title" className={styles.openingTitle}>
          Find your station
        </h1>
        <p className={styles.openingLede}>
          Two Perth counters for açaí, crêpes, Dubai chocolate and the group
          order that keeps growing.
        </p>
      </div>
    </section>
  );
}

export function LocationsFull() {
  return (
    <div className={styles.root}>
      {locations.map((location, index) => {
        const isNight = index % 2 === 1;
        const photo = locationPhotos[index];
        const phone = "phone" in location ? location.phone : undefined;

        return (
          <section
            key={location.slug}
            id={location.slug}
            className={`${styles.band} ${isNight ? styles.night : styles.paper}`}
            aria-labelledby={`loc-${location.slug}`}
          >
            <div className={styles.shell}>
              <header className={styles.bandHead}>
                <span className={styles.bandIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 id={`loc-${location.slug}`} className={styles.bandTitle}>
                  {location.name}
                </h2>
              </header>

              {/* Same editorial row as the menu: one large photograph, the
                  facts beside it, sides alternating down the page. */}
              <article className={`${styles.row} ${isNight ? styles.rowFlip : ""}`}>
                <div
                  className={styles.rowMedia}
                  style={
                    photo
                      ? ({ "--media-ratio": `${photo.w} / ${photo.h}` } as React.CSSProperties)
                      : undefined
                  }
                >
                  {photo && (
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      quality={90}
                      sizes="(min-width: 64rem) 40vw, (min-width: 48rem) 46vw, 100vw"
                    />
                  )}
                </div>
                <div className={styles.rowBody}>
                  <span className={styles.kicker}>Nabil&apos;s location</span>
                  <p className={styles.ratingLine}>
                    <span>
                      {location.rating}★ · {location.reviewCount} Google reviews
                    </span>
                  </p>
                  <p className={styles.sectionLede}>{location.address}</p>
                  {location.note && <p className={styles.note}>{location.note}</p>}

                  {location.hours ? (
                    <dl className={styles.dataList}>
                      {location.hours.map(([day, hours]) => (
                        <div key={day} className={styles.dataRow}>
                          <dt>{day}</dt>
                          <dd>{hours}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    /* Ballajura's trading hours are still unconfirmed. Saying so
                       is better than publishing a closing time we would be
                       guessing at. */
                    <p className={styles.note}>
                      Trading hours for {location.name} aren&apos;t confirmed yet
                      — call the shop before heading over.
                    </p>
                  )}

                  <div className={styles.actions}>
                    <TrackedLink
                      event="directions_click"
                      eventParams={{
                        platform: "google_maps",
                        location: location.slug,
                        placement: "locations_page",
                      }}
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.btn} ${isNight ? styles.btnPrimary : styles.btnInk}`}
                    >
                      Open in Maps
                    </TrackedLink>
                    {phone && (
                      <TrackedLink
                        event="call_click"
                        eventParams={{
                          location: location.slug,
                          placement: "locations_page",
                        }}
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className={`${styles.btn} ${isNight ? styles.btnGhost : styles.btnOutline}`}
                      >
                        Call {phone}
                      </TrackedLink>
                    )}
                  </div>
                </div>
              </article>
            </div>
          </section>
        );
      })}
    </div>
  );
}
