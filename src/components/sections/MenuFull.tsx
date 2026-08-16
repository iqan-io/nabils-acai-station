import Image from "next/image";
import Link from "next/link";
import { brand, menu, menuGroups, menuSlug, type MenuSection } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";

/*
  Ten of the thirteen sections have a photograph. Those run as editorial rows —
  one large image beside its prices, alternating side down the page. The three
  without one (Matcha, Iced Lattes, Milkshakes) run as a compact list at the foot
  of their band; giving them an empty image column would only advertise the gap.
*/
const featuredImage: Record<
  string,
  { src: string; alt: string; w: number; h: number }
> = {
  // `w`/`h` are the real pixel dimensions of each file. They drive the media
  // box's aspect ratio, so nothing is cropped. Nine of these ten are portrait;
  // the waffle pack is the only landscape shot.
  "Açaí — Build Your Own": {
    src: "/images/enhanced/menu-acai.png",
    alt: "A Nabil's açaí bowl topped with strawberries, banana and chocolate drizzle",
    w: 1024,
    h: 1536,
  },
  "Classic Crêpes": {
    src: "/images/enhanced/menu-classic-crepe.png",
    alt: "A classic Nabil's crêpe with strawberries, banana and sauce",
    w: 1122,
    h: 1402,
  },
  "Signature Crêpes": {
    src: "/images/enhanced/menu-signature-crepe.png",
    alt: "A signature Nabil's crêpe with pistachio, chocolate and crushed nuts",
    w: 1122,
    h: 1402,
  },
  "Strawberry Cups": {
    src: "/images/enhanced/menu-strawberry-cup.png",
    alt: "A Nabil's strawberry cup with milk chocolate and pistachio",
    w: 1024,
    h: 1536,
  },
  "Dubai Chocolate": {
    src: "/images/enhanced/menu-dubai-chocolate.png",
    alt: "Nabil's pistachio-filled Dubai chocolate",
    w: 1122,
    h: 1402,
  },
  Brownies: {
    src: "/images/enhanced/menu-brownie.png",
    alt: "A Nabil's brownie dessert with milk chocolate and pistachio",
    w: 1122,
    h: 1402,
  },
  "Waffle Snack Pack": {
    src: "/images/enhanced/menu-waffle-snack-pack.png",
    alt: "A waffle snack pack with strawberries, banana and drizzle",
    w: 1448,
    h: 1086,
  },
  "Fruit Cocktails": {
    src: "/images/enhanced/fruit-cocktail-client-enhanced.jpg",
    alt: "A Nabil's fruit cocktail layered with fruit, ashta, cashew and honey",
    w: 1122,
    h: 1402,
  },
  Mocktails: {
    src: "/images/enhanced/menu-mocktails.png",
    alt: "A bright Nabil's mocktail over ice",
    w: 1086,
    h: 1448,
  },
  "Probiotic Splash": {
    src: "/images/enhanced/menu-probiotic-splash.png",
    alt: "Two sparkling probiotic splash drinks with citrus and ice",
    w: 1122,
    h: 1402,
  },
};

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
  const media = featuredImage[section.title];
  return (
    <article
      id={menuSlug(section.title)}
      className={`${styles.row} ${flip ? styles.rowFlip : ""}`}
    >
      <div
        className={styles.rowMedia}
        style={{ "--media-ratio": `${media.w} / ${media.h}` } as React.CSSProperties}
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
  // Bands alternate paper and night, the same rhythm the homepage film uses
  // below the fold, so the two surfaces read as one site.
  return (
    <div className={styles.root}>
      {menuGroups.map((group, groupIndex) => {
        const sections = group.sections
          .map((title) => sectionByTitle.get(title))
          .filter((section): section is MenuSection => Boolean(section));
        const withMedia = sections.filter((s) => featuredImage[s.title]);
        const withoutMedia = sections.filter((s) => !featuredImage[s.title]);
        const isNight = groupIndex % 2 === 1;

        return (
          <section
            key={group.label}
            className={`${styles.band} ${isNight ? styles.night : styles.paper}`}
            aria-labelledby={`group-${menuSlug(group.label)}`}
          >
            <div className={styles.shell}>
              <header className={styles.bandHead}>
                <span className={styles.bandIndex}>
                  {String(groupIndex + 1).padStart(2, "0")}
                </span>
                <h2 id={`group-${menuSlug(group.label)}`} className={styles.bandTitle}>
                  {group.label}
                </h2>
              </header>

              {withMedia.map((section, i) => (
                <EditorialRow key={section.title} section={section} flip={i % 2 === 1} />
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
