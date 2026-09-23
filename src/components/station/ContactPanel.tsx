import Image from "next/image";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { brand, locations } from "@/lib/brand";
import { TrackedLink } from "@/components/shared/TrackedLink";
import styles from "./StationPage.module.css";

/*
  The reference's CONTACT panel: a huge heading, the address, the ways to
  reach the shop with a row of social icons beside them, and a tall
  photograph in its own outlined card on the right. In the recording it
  closes the inner pages, so it closes Nabil's inner pages too, and it is the
  opening of `/locations` (the reference's contact page).

  The reference lists an email address. Nabil's has no published one, so this
  panel does not invent one — the phone and the two social accounts are the
  real ways to reach the shop.
*/

function shortAddress(full: string) {
  return full.replace(/\s·\s/g, ", ").replace(/,?\s*WA\s?\d{4}.*$/i, "");
}

export function ContactPanel({
  opening = false,
  placement,
  headingLevel = 2,
}: {
  opening?: boolean;
  placement: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <section
      data-panel
      className={`${styles.panel} ${opening ? styles.opening : ""}`}
      aria-labelledby={`contact-${placement}`}
    >
      <div className={`${styles.split} ${styles.splitWide}`}>
        <div className={`${styles.body} ${styles.contactBody}`}>
          <Heading id={`contact-${placement}`} className={styles.contactTitle}>
            Contact
          </Heading>
          {locations.map((location) => (
            <TrackedLink
              key={location.slug}
              event="directions_click"
              eventParams={{ platform: "google_maps", location: location.slug, placement }}
              href={location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLine}
            >
              <span className={styles.contactPlace}>{location.name}</span>
              {shortAddress(location.address)}
            </TrackedLink>
          ))}
          <div className={styles.contactReach}>
            <TrackedLink
              event="call_click"
              eventParams={{ location: "ballajura", placement }}
              href={brand.phoneHref}
              className={styles.contactLine}
            >
              {brand.phone}
            </TrackedLink>
            <div className={styles.contactIcons}>
              <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${brand.instagram.handle}`}>
                <BiLogoInstagram aria-hidden />
              </a>
              <a href={brand.tiktok.url} target="_blank" rel="noopener noreferrer" aria-label={`TikTok ${brand.tiktok.handle}`}>
                <BiLogoTiktok aria-hidden />
              </a>
            </div>
          </div>
        </div>
        <div className={`${styles.media} ${styles.mediaCard}`}>
          <Image
            src="/images/enhanced/blue-hawaii-mocktail-client-enhanced.jpg"
            alt="A Nabil's Blue Hawaii mocktail on the counter, the shop's arches soft behind it"
            fill
            sizes="(min-width: 44rem) 75vw, 160vw"
            quality={88}
          />
        </div>
      </div>
    </section>
  );
}
