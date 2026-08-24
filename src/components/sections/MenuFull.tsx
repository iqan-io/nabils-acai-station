import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand, menu, menuGroups, menuSlug, type MenuSection } from "@/lib/brand";
import {
  menuSectionGallery,
  menuSectionImage,
  PRODUCT_CARD_RATIO,
} from "@/lib/productImages";
import styles from "@/components/shared/Page.module.css";

/*
  Ten of the thirteen sections have a photograph. Those run as editorial rows —
  one large image beside its prices, alternating side down the page. The three
  without one (Matcha, Iced Lattes, Milkshakes) run as a compact list at the foot
  of their band; giving them an empty image column would only advertise the gap.

  Which photograph a section gets — and its alt text — is no longer decided
  here. It comes from `lib/productImages.ts`, the single registry for System B
  merchandising photography, so the menu and the homepage lineup can never drift
  apart. This file only decides layout.
*/

const sectionByTitle = new Map(menu.map((section) => [section.title, section]));

function PriceList({ section }: { section: MenuSection }) {
  return (
    <>
      <ul className={styles.priceList}>
        {section.items.map((item) => (
          <li key={item.name} className={styles.priceItem}>
            <div className={styles.priceRow}>
              <span className={styles.itemName}>{item.name}</span>
              {item.price && <span className={styles.itemPrice}>{item.price}</span>}
            </div>
            {item.note && <p className={styles.itemNote}>{item.note}</p>}
          </li>
        ))}
      </ul>
      {section.footnote && <p className={styles.footnote}>{section.footnote}</p>}
    </>
  );
}

function EditorialRow({
  section,
  flip,
}: {
  section: MenuSection;
  flip: boolean;
}) {
  const media = menuSectionImage(section.title);
  if (!media) return null;
  return (
    <article
      id={menuSlug(section.title)}
      className={`${styles.row} ${flip ? styles.rowFlip : ""}`}
      data-reveal
    >
      {/*
        One ratio for every product row. The box used to take each file's own
        dimensions, which meant a 2:3 açaí sat beside a 4:3 waffle pack and the
        grid never settled. The studio assets are all delivered on the same 4:5
        canvas, so the box can be fixed and `cover` crops nothing.
      */}
      <div
        className={`${styles.rowMedia} ${styles.productMedia}`}
        style={{ "--media-ratio": PRODUCT_CARD_RATIO } as React.CSSProperties}
      >
        <Image
          src={media.src}
          alt={media.alt}
          fill
          quality={90}
          sizes="(min-width: 64rem) 40vw, (min-width: 48rem) 46vw, 100vw"
        />
      </div>
      <div className={styles.rowBody}>
        <h3 className={styles.sectionTitle}>{section.title}</h3>
        {section.subtitle && <p className={styles.sectionLede}>{section.subtitle}</p>}
        <PriceList section={section} />
      </div>
    </article>
  );
}

/*
  The extra frames for a section that has them, run as a full-width strip below
  its editorial row rather than inside it — the row is a two-column grid and a
  gallery nested in either column would be half the page wide and land at a
  different size on flipped rows.

  Only "Açaí — Build Your Own" has one today. The section's whole proposition
  is choice, and until now the choice was carried entirely by a grey 0.82rem
  footnote listing nine drizzles under a single photograph.

  Uncaptioned on purpose: `productImages.ts` explains why a caption would have
  to name a drizzle we cannot verify from the photograph. So each figure is
  just the frame, and the alt text does the describing.
*/
function BuildGallery({ section }: { section: MenuSection }) {
  const frames = menuSectionGallery(section.title);
  if (frames.length === 0) return null;
  return (
    <div className={styles.gallery} data-reveal>
      <p className={styles.galleryLede}>A few builds from the counter</p>
      <ul className={styles.galleryGrid}>
        {frames.map((frame) => (
          <li key={frame.src}>
            <div
              className={`${styles.rowMedia} ${styles.productMedia}`}
              style={{ "--media-ratio": PRODUCT_CARD_RATIO } as React.CSSProperties}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                quality={90}
                /*
                  Three up on desktop, two below — matching the flex-basis in
                  Page.module.css so the browser never fetches a 1200px card to
                  paint it a third of that. Keep the two in step.
                */
                sizes="(min-width: 64rem) 30vw, 46vw"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompactSection({ section }: { section: MenuSection }) {
  return (
    <article id={menuSlug(section.title)} className={styles.compact}>
      <h3 className={styles.sectionTitle}>{section.title}</h3>
      {section.subtitle && <p className={styles.sectionLede}>{section.subtitle}</p>}
      <PriceList section={section} />
    </article>
  );
}

export function MenuHero() {
  return (
    <section className={styles.opening} aria-labelledby="menu-title">
      {/*
        The previous opening used strawberry-cup-neon.jpg, a soft interior shot
        that graded down to a brown blur behind the type. This one is sharp and
        the product fills the frame, so it survives both the crop and the scrim.
      */}
      <Image
        className={styles.openingMedia}
        data-parallax
        src="/images/enhanced/hero-bueno-editorial-v3.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={90}
        sizes="100vw"
      />
      <div className={styles.openingScrim} />
      <div className={styles.openingInner}>
        <span className={styles.eyebrow}>The full menu · Prices in AUD</span>
        <h1 id="menu-title" className={styles.openingTitle}>
          Pick your sweet
        </h1>
        <p className={styles.openingLede}>
          Açaí built your way, loaded crêpes, Dubai chocolate, fruit cocktails,
          matcha, mocktails and more.
        </p>
        <p className={styles.openingMeta}>Made to order · Subject to availability</p>
      </div>
    </section>
  );
}

export function MenuFull() {
  /*
    The product bands used to alternate paper and night. That worked when the
    photographs carried their own environments, but the studio set is a single
    continuous cream sweep: on a night band each photo became a lit rectangle
    floating on near-black, and scrolling the menu broke into ten separate
    pictures instead of one shoot. The bands are all paper now, so the cream in
    the photograph and the cream of the page are the same surface and only the
    food changes colour down the page. The closing CTA keeps its night ground —
    it carries no product.
  */
  return (
    <div className={styles.root}>
      {menuGroups.map((group, groupIndex) => {
        const sections = group.sections
          .map((title) => sectionByTitle.get(title))
          .filter((section): section is MenuSection => Boolean(section));
        const withMedia = sections.filter((s) => menuSectionImage(s.title));
        const withoutMedia = sections.filter((s) => !menuSectionImage(s.title));

        return (
          <section
            key={group.label}
            className={`${styles.band} ${styles.paper}`}
            aria-labelledby={`group-${menuSlug(group.label)}`}
          >
            <div className={styles.shell}>
              <header className={styles.bandHead} data-reveal>
                <span className={styles.bandIndex}>
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                <h2 id={`group-${menuSlug(group.label)}`} className={styles.bandTitle}>
                  {group.label}
                </h2>
              </header>

              {withMedia.map((section, i) => (
                <Fragment key={section.title}>
                  <EditorialRow section={section} flip={i % 2 === 1} />
                  <BuildGallery section={section} />
                </Fragment>
              ))}

              {withoutMedia.length > 0 && (
                <div className={styles.compactGrid}>
                  {withoutMedia.map((section) => (
                    <CompactSection key={section.title} section={section} />
                  ))}
                </div>
              )}

            </div>
          </section>
        );
      })}

      {/* The film closes on a night band; so does this. */}
      <section className={`${styles.band} ${styles.night}`}>
        <div className={styles.shell}>
          <div className={styles.closing}>
            <p className={styles.closingText}>Mount Lawley or Ballajura?</p>
            <div className={styles.closingActions}>
              <Link href="/locations" className={`${styles.btn} ${styles.btnPrimary}`}>
                Find your station
              </Link>
              <a
                href={brand.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.btn} ${styles.btnGhost}`}
              >
                Order delivery
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
