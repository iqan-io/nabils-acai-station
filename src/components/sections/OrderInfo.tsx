import Image from "next/image";
import { brand, locations } from "@/lib/brand";
import { SiDoordash, SiUbereats } from "react-icons/si";
import styles from "@/components/shared/Page.module.css";

/*
  The platform brand colours (Uber Eats green, DoorDash red) are the one place
  a colour outside the palette is allowed: they identify a third party, so they
  are information rather than decoration. They stay on the icon glyph only.
*/
const delivery = [
  {
    name: "Uber Eats",
    url: brand.orderUrl,
    note: "Choose your available Nabil's location in Uber Eats.",
    logo: SiUbereats,
    colour: "#06C167",
  },
  {
    name: "DoorDash",
    url: brand.doordashUrl,
    note: "Ballajura delivery through DoorDash.",
    logo: SiDoordash,
    colour: "#FF3008",
  },
];

export function OrderHero() {
  return (
    <section className={styles.opening} aria-labelledby="order-title">
      <Image
        className={styles.openingMedia}
        src="/images/enhanced/signature-dubai-strawberry-cup-v2.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={90}
        sizes="100vw"
      />
      <div className={styles.openingScrim} />
      <div className={styles.openingInner}>
        <span className={styles.eyebrow}>Order Nabil&apos;s</span>
        <h1 id="order-title" className={styles.openingTitle}>
          Get the good stuff
        </h1>
        <p className={styles.openingLede}>
          Choose delivery, get directions for pickup, or browse the menu before
          the group chat changes its mind.
        </p>
      </div>
    </section>
  );
}

export function OrderInfo() {
  return (
    <div className={styles.root}>
      <section className={`${styles.band} ${styles.paper}`} aria-labelledby="order-ways">
        <div className={styles.shell}>
          <header className={styles.bandHead}>
            <span className={styles.bandIndex}>01</span>
            <h2 id="order-ways" className={styles.bandTitle}>
              Two ways to get it
            </h2>
          </header>

          <div className={styles.splitGrid}>
            <div>
              <span className={styles.kicker}>Delivery</span>
              <h3 className={styles.sectionTitle}>Bring Nabil&apos;s to you</h3>
              <div className={styles.dataList}>
                {delivery.map((item) => {
                  const Logo = item.logo;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkRow}
                    >
                      <span className={styles.linkRowMain}>
                        <Logo
                          aria-hidden
                          className="size-7 shrink-0"
                          style={{ color: item.colour }}
                        />
                        <span>
                          <span className={styles.linkRowTitle}>{item.name}</span>
                          <span className={styles.linkRowNote}>{item.note}</span>
                        </span>
                      </span>
                      <span aria-hidden className={styles.linkRowArrow}>
                        →
                      </span>
                    </a>
                  );
                })}
              </div>
              <p className={styles.note}>
                Availability varies by platform, location and time.
              </p>
            </div>

            <div>
              <span className={styles.kicker}>Pick up</span>
              <h3 className={styles.sectionTitle}>Head to the counter</h3>
              <div className={styles.dataList}>
                {locations.map((location) => {
                  const phone = "phone" in location ? location.phone : undefined;
                  return (
                    <a
                      key={location.slug}
                      href={location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkRow}
                    >
                      <span className={styles.linkRowMain}>
                        <span>
                          <span className={styles.linkRowTitle}>{location.name}</span>
                          <span className={styles.linkRowNote}>
                            {location.address}
                            {phone ? ` · ${phone}` : ""}
                          </span>
                        </span>
                      </span>
                      <span aria-hidden className={styles.linkRowArrow}>
                        →
                      </span>
                    </a>
                  );
                })}
              </div>
              <p className={styles.note}>
                Directions open in Google Maps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
