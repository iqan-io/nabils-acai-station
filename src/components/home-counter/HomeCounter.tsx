import Image from "next/image";
import Link from "next/link";
import { brand, founder, locations, press, reviews } from "@/lib/brand";
import { brandAssets } from "@/lib/brandAssets";
import { BowlBuilder } from "./BowlBuilder";
import { LiveStatus } from "./LiveStatus";
import styles from "./HomeCounter.module.css";

/**
 * Homepage — "The Counter" direction (approved by Ali, Gate 1, 2026-08-14).
 *
 * Thesis: the site is the counter. The build-your-own bowl is the hero, not a
 * section further down. Everything else earns its place by answering a question
 * the customer has before they leave the house: what else is there, who are
 * these people, and which shop is still open.
 */

const categories = [
  {
    name: "Dubai Chocolate",
    blurb: "The bar that started the queue.",
    price: "from $18",
    image: "/images/enhanced/menu-dubai-chocolate.png",
    href: "/menu#dubai-chocolate",
  },
  {
    name: "Signature Crêpes",
    blurb: "Pistachio Delight · Dubai Royal.",
    price: "$14 – $16",
    image: "/images/enhanced/menu-signature-crepe.png",
    href: "/menu#signature-crepes",
  },
  {
    name: "Fruit Cocktails",
    blurb: "Blended with ashta, cashew and honey.",
    price: "$15",
    image: "/images/enhanced/fruit-cocktail-client-enhanced.jpg",
    href: "/menu#fruit-cocktails",
  },
  {
    name: "Mocktails & Matcha",
    blurb: "Six mocktails, four iced matcha.",
    price: "$8 – $9",
    image: "/images/enhanced/blue-hawaii-mocktail-client-enhanced.jpg",
    href: "/menu#mocktails",
  },
] as const;

const locationImages: Record<string, string> = {
  "mount-lawley": "/images/locations/location-mount-lawley.png",
  ballajura: "/images/locations/location-ballajura.png",
};

export function HomeCounter() {
  return (
    <div className={styles.page}>
      {/* ---- Hero: the counter itself ---- */}
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <LiveStatus />
          <h1 id="home-title" className={styles.heroTitle}>
            Build it here.
            <br />
            Pick it up <span className={styles.mark}>tonight</span>.
          </h1>
          <p className={styles.heroLead}>
            Every açaí starts with granola, banana and strawberries. Nine
            drizzles, thirteen toppings, four sizes — put yours together and see
            the price before you leave the house.
          </p>

          <dl className={styles.proofRow}>
            <div>
              <dt>Uber Eats rating</dt>
              <dd>4.6★</dd>
              <p>250+ ratings</p>
            </div>
            <div>
              <dt>Shops</dt>
              <dd>2</dd>
              <p>Mt Lawley &amp; Ballajura</p>
            </div>
            <div>
              <dt>Latest close</dt>
              <dd>11 PM</dd>
              <p>Thursday to Saturday</p>
            </div>
          </dl>

          {/* Desktop only. The builder column is much taller than this copy,
              and a tool-led hero with no food in it reads like a form. Hidden
              on mobile so the builder itself stays above the fold. */}
          <figure className={styles.heroShot}>
            <Image
              src="/images/enhanced/viral-acai.png"
              alt="An açaí cup being finished with drizzle, granola and berries at Nabil's topping bar"
              fill
              priority
              quality={90}
              sizes="(max-width: 1000px) 0px, 44vw"
              className={styles.heroShotImage}
            />
            <figcaption>Finished to order, at the topping bar.</figcaption>
          </figure>
        </div>

        <div className={styles.heroBuilder}>
          <BowlBuilder />
        </div>
      </section>

      {/* ---- Everything that isn't açaí ---- */}
      <section className={styles.categories} aria-labelledby="categories-title">
        <div className={styles.sectionHead}>
          <h2 id="categories-title">Not in an açaí mood?</h2>
          <Link className={styles.headLink} href="/menu">
            See the full menu <span aria-hidden>→</span>
          </Link>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={styles.category}
            >
              <div className={styles.categoryImage}>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 23vw"
                  className={styles.cover}
                />
              </div>
              <div className={styles.categoryBody}>
                <h3>{category.name}</h3>
                <p>{category.blurb}</p>
                <span className={styles.categoryPrice}>{category.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---- The people behind the counter. This is the section that keeps a
             tool-led homepage from feeling like a vending machine. ---- */}
      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.storyMedia}>
          <Image
            src="/images/enhanced/story-sweet-moments-neon.jpg"
            alt="Inside Nabil's, under the Made for Sweet Moments neon"
            fill
            quality={90}
            sizes="(max-width: 900px) 100vw, 46vw"
            className={styles.cover}
          />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.eyebrow}>Fifteen years in the family</p>
          <h2 id="story-title">
            The chocolate went viral. The shop stayed the same.
          </h2>
          <p>
            Nabil&apos;s Lebanese Sweets has been in Ballajura for more than
            fifteen years, built on baklava long before açaí turned up. When
            Dubai chocolate started going around, {founder.name.split(" ")[0]}{" "}
            worked out his own recipe in the same kitchen.
          </p>
          <blockquote className={styles.pull}>
            {founder.pullQuote}
            <cite>
              {founder.name}, {founder.role}
            </cite>
          </blockquote>
          <Link className={styles.storyLink} href="/about">
            Read the whole story <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ---- Proof: press + a real review ---- */}
      <section className={styles.proof} aria-labelledby="proof-title">
        <h2 id="proof-title" className={styles.srOnly}>
          Press and reviews
        </h2>
        <figure className={styles.quote}>
          <blockquote>“{reviews[2].quote}”</blockquote>
          <figcaption>
            {reviews[2].author}
            {reviews[2].badge ? ` · ${reviews[2].badge}` : ""}
          </figcaption>
        </figure>
        <div className={styles.pressList}>
          <p className={styles.eyebrow}>As seen in</p>
          {press.map((item) => (
            <a
              key={item.outlet}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pressItem}
            >
              <span className={styles.pressOutlet}>{item.outlet}</span>
              <span className={styles.pressHeadline}>{item.headline}</span>
              <span className={styles.pressDate}>{item.date}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ---- Which shop, and is it open ---- */}
      <section className={styles.locations} aria-labelledby="locations-title">
        <div className={styles.sectionHead}>
          <h2 id="locations-title">Two counters</h2>
          <Link className={styles.headLink} href="/locations">
            Hours and directions <span aria-hidden>→</span>
          </Link>
        </div>
        <div className={styles.locationGrid}>
          {locations.map((location) => (
            <article key={location.slug} className={styles.location}>
              <div className={styles.locationImage}>
                <Image
                  src={locationImages[location.slug]}
                  alt={`Nabil's Açaí Station at ${location.name}`}
                  fill
                  quality={90}
                  sizes="(max-width: 900px) 100vw, 46vw"
                  className={styles.cover}
                />
              </div>
              <div className={styles.locationBody}>
                <div className={styles.locationTop}>
                  <h3>{location.name}</h3>
                  <span className={styles.rating}>
                    {location.rating}★
                    <em>{location.reviewCount} reviews</em>
                  </span>
                </div>
                <p className={styles.locationAddress}>{location.address}</p>
                <p className={styles.locationNote}>{location.note}</p>
                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directions}
                >
                  Get directions <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Close ---- */}
      <section className={styles.finalCta}>
        <Image
          src={brandAssets.darkBackgroundLogo}
          alt=""
          width={81}
          height={120}
          className={styles.finalSeal}
        />
        <div className={styles.finalCopy}>
          <p className={styles.eyebrow}>{brand.tagline}</p>
          <h2>Still deciding? Start with the menu.</h2>
        </div>
        <div className={styles.finalActions}>
          <Link href="/menu" className={styles.finalPrimary}>
            View the menu
          </Link>
          <a
            href={brand.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.finalSecondary}
          >
            Order delivery
          </a>
        </div>
      </section>
    </div>
  );
}
