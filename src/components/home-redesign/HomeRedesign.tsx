import Image from "next/image";
import Link from "next/link";
import {
  brand,
  locations,
  menuGroups,
  menuSlug,
  press,
  reviews,
  signatures,
} from "@/lib/brand";
import styles from "./HomeRedesign.module.css";

const heroProducts = [
  {
    name: "Açaí",
    image: "/images/enhanced/hero-bueno-editorial-v3.jpg",
    alt: "A towering Nabil's açaí bowl with banana, strawberries and Bueno drizzle",
    href: "/menu#acai-build-your-own",
    tone: "grape",
  },
  {
    name: "Crepes",
    image: "/images/enhanced/menu-signature-crepe.png",
    alt: "A Nabil's signature crepe finished with strawberries and chocolate",
    href: "/menu#signature-crepes",
    tone: "strawberry",
  },
  {
    name: "Fruit cocktails",
    image: "/images/enhanced/fruit-cocktail-client-enhanced.jpg",
    alt: "Colourful Nabil's fruit cocktails topped with fresh fruit and pistachio",
    href: "/menu#fruit-cocktails",
    tone: "pistachio",
  },
] as const;

const steps = [
  {
    number: "1",
    title: "Pick your size",
    body: "Cone, small, regular or large. Every açaí starts with granola, banana and strawberries.",
  },
  {
    number: "2",
    title: "Choose a drizzle",
    body: "Pistachio, Bueno, Biscoff, Nutella, passion fruit and plenty more.",
  },
  {
    number: "3",
    title: "Pile it on",
    body: "Fresh fruit, crunch, chocolate and Dubai filling—build the bowl you came for.",
  },
] as const;

const locationImages: Record<string, string> = {
  "mount-lawley": "/images/locations/location-mount-lawley.png",
  ballajura: "/images/locations/location-ballajura.png",
};

export function HomeRedesign() {
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p className={styles.locationLine}>Mount Lawley + Ballajura</p>
          <h1 id="home-title" className={styles.heroTitle}>
            Choose
            <span>your</span>
            sweet
          </h1>
          <p className={styles.heroLead}>
            Build-your-own açaí, loaded crepes, Dubai chocolate and fruit
            cocktails—made fresh for the whole group.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/menu">
              View the menu <span aria-hidden>→</span>
            </Link>
            <a
              className={styles.secondaryAction}
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order delivery
            </a>
          </div>
        </div>

        <div className={styles.heroGallery} aria-label="Popular menu categories">
          {heroProducts.map((product, index) => (
            <Link
              key={product.name}
              href={product.href}
              className={`${styles.heroProduct} ${styles[product.tone]}`}
            >
              <span className={styles.heroProductName}>{product.name}</span>
              <Image
                src={product.image}
                alt={product.alt}
                fill
                priority={index < 2}
                quality={90}
                sizes="(max-width: 767px) 84vw, (max-width: 1100px) 45vw, 22vw"
                className={styles.heroProductImage}
              />
              <span className={styles.heroProductArrow} aria-hidden>
                ↗
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.heroSeal} aria-hidden>
          <Image
            src="/images/logo-192.png"
            alt=""
            width={120}
            height={120}
            priority
            unoptimized
          />
        </div>
      </section>

      <div className={styles.waveBand}>
        <svg
          className={styles.wave}
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 34C120 2 210 66 330 34S540 2 660 34s210 32 330 0 210-32 330 0 120 0 120 0v38H0Z" />
        </svg>
        <nav className={styles.categoryNav} aria-label="Menu categories">
          {menuGroups.map((group) => (
            <Link
              key={group.label}
              href={`/menu#${menuSlug(group.sections[0])}`}
            >
              {group.label}
            </Link>
          ))}
        </nav>
      </div>

      <section className={styles.signatures} aria-labelledby="signatures-title">
        <div className={styles.sectionHeading}>
          <h2 id="signatures-title">The good stuff</h2>
          <p>
            Fresh fruit, proper crunch and the kind of toppings that need two
            hands. These are the Nabil&apos;s favourites worth starting with.
          </p>
        </div>

        <div className={styles.signatureLayout}>
          {signatures.map((item, index) => (
            <article
              key={item.name}
              className={`${styles.signatureItem} ${
                index === 0 ? styles.signatureFeature : ""
              }`}
            >
              <div className={styles.signatureImage}>
                <Image
                  src={item.image}
                  alt={item.blurb}
                  fill
                  quality={90}
                  sizes={index === 0 ? "(max-width: 767px) 100vw, 58vw" : "(max-width: 767px) 100vw, 38vw"}
                  className={styles.coverImage}
                />
              </div>
              <div className={styles.signatureCopy}>
                <h3>{item.name}</h3>
                <span className={styles.price}>{item.price}</span>
                <p>{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>
        <Link className={styles.textLink} href="/menu">
          See every sweet on the menu <span aria-hidden>→</span>
        </Link>
      </section>

      <section className={styles.buildSection} aria-labelledby="build-title">
        <div className={styles.buildIntro}>
          <p>Build your own</p>
          <h2 id="build-title">Your bowl. Your rules.</h2>
          <Link href="/menu#acai-build-your-own">Start with the açaí menu →</Link>
        </div>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.number}>
              <span className={styles.stepNumber}>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.story} aria-labelledby="story-title">
        <div className={styles.storyImage}>
          <Image
            src="/images/interior-neon.jpg"
            alt="A loaded açaí bowl on the counter inside Nabil's Mount Lawley shop"
            fill
            quality={90}
            sizes="(max-width: 767px) 100vw, 55vw"
            className={styles.coverImage}
          />
        </div>
        <div className={styles.storyCopy}>
          <p className={styles.storyPhrase}>Made for sweet moments.</p>
          <h2 id="story-title">Family shop. Big sweet energy.</h2>
          <p>
            Nabil&apos;s started with Lebanese sweets in Ballajura. Today the
            family is still behind the counter—now serving Perth&apos;s late-night
            açaí, crepes and Dubai-chocolate fix from two locations.
          </p>
          <Link className={styles.inverseLink} href="/about">
            Meet the family <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className={styles.locations} aria-labelledby="locations-title">
        <div className={styles.sectionHeading}>
          <h2 id="locations-title">Find your station</h2>
          <p>Two Perth counters. One very difficult menu decision.</p>
        </div>
        <div className={styles.locationGrid}>
          {locations.map((location, index) => (
            <article className={styles.locationItem} key={location.slug}>
              <div className={styles.locationImage}>
                <Image
                  src={locationImages[location.slug]}
                  alt={`Nabil's Açaí Station at ${location.name}`}
                  fill
                  quality={90}
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className={styles.coverImage}
                />
                <span className={styles.locationIndex}>0{index + 1}</span>
              </div>
              <div className={styles.locationCopy}>
                <h3>{location.name}</h3>
                <p>{location.address}</p>
                <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                  Get directions <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.proof} aria-labelledby="proof-title">
        <div className={styles.proofQuote}>
          <p id="proof-title">“{reviews[2].quote}”</p>
          <span>— {reviews[2].author}, Google Local Guide</span>
        </div>
        <div className={styles.pressLinks} aria-label="Nabil's in the news">
          <p>As seen in</p>
          {press.map((item) => (
            <a key={item.outlet} href={item.url} target="_blank" rel="noopener noreferrer">
              {item.outletShort} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.finalCta} aria-labelledby="final-title">
        <Image
          src="/images/logo-400.png"
          alt=""
          width={180}
          height={180}
          unoptimized
          className={styles.finalSeal}
        />
        <div>
          <p>Still choosing?</p>
          <h2 id="final-title">Start with the menu.</h2>
        </div>
        <Link href="/menu" className={styles.finalAction}>
          Pick your sweet <span aria-hidden>→</span>
        </Link>
      </section>
    </div>
  );
}

