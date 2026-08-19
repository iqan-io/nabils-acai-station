"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AcaiStory } from "@/components/cinematic/AcaiStory";
import { brand, locations, press, reviews, signatures } from "@/lib/brand";
import { getOpenStatus } from "@/lib/hours";
import { track } from "@/lib/analytics";
import { useSmoothScroll } from "@/lib/useSmoothScroll";
import styles from "./HomeCinematic.module.css";

gsap.registerPlugin(ScrollTrigger);

const SIZES = [
  ["Large", "$15"],
  ["Regular", "$12"],
  ["Small", "$10"],
  ["Cone", "$9"],
] as const;

const DRIZZLES = [
  "Honey",
  "Condensed milk",
  "Passion fruit",
  "Nutella",
  "Pistachio",
  "Biscoff",
  "Bueno",
  "Peanut butter",
  "Milk chocolate",
] as const;

const TOPPINGS = [
  "Banana",
  "Granola",
  "M&M's",
  "Strawberries",
  "Blueberries",
  "Crushed pistachios",
  "Crushed almonds",
  "Paçoca",
  "Oreo crumbs",
  "Biscoff crumbs",
  "Coconut",
  "Choc chips",
  "Dubai filling",
] as const;

export function HomeCinematic() {
  const rootRef = useRef<HTMLDivElement>(null);

  // The open/closed pill is real-time, so it cannot be rendered on the server
  // without shipping a status that is stale by the time it arrives. It renders
  // as nothing until the client knows the actual Perth time.
  const [status, setStatus] = useState<ReturnType<typeof getOpenStatus> | null>(
    null,
  );
  useEffect(() => setStatus(getOpenStatus()), []);

  useSmoothScroll();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // One shared entrance for every block below the film: the children rise
      // and fade as their container reaches the lower third. Deliberately the
      // only motion down here — after a 460vh film, more movement reads as
      // noise rather than polish.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const mtLawley = locations[0];
  const ballajura = locations[1];

  return (
    <div className={styles.root} ref={rootRef}>
      {/* --------------------------------------------------------- opening */}
      <section className={styles.opening} aria-labelledby="home-title">
        <div className={styles.openingInner}>
          <div className={styles.openingCopy}>
            {status ? (
              <p className={styles.status}>
                <span
                  className={styles.statusDot}
                  data-open={status.open}
                  aria-hidden="true"
                />
                {status.open
                  ? `Open now · till ${status.closesAt}`
                  : status.opensDay
                    ? `Closed · opens ${status.opensDay} ${status.opensAt}`
                    : `Closed · opens ${status.opensAt}`}
              </p>
            ) : null}

            <h1 id="home-title" className={styles.title}>
              Nabil&apos;s Açaí Station
            </h1>
            <p className={styles.tagline}>
              Açaí, crêpes and the viral Dubai chocolate, built to order in
              Mount Lawley and Ballajura. {brand.tagline}
            </p>

            <div className={styles.openingActions}>
              <Link href="/menu" className={`${styles.btn} ${styles.btnPrimary}`}>
                See the menu
              </Link>
              <a
                href={brand.orderUrl}
                className={`${styles.btn} ${styles.btnGhost}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("order_click", {
                    platform: "ubereats",
                    placement: "home_hero",
                  })
                }
              >
                Order delivery
              </a>
            </div>
          </div>

          <div className={styles.openingMedia}>
            <span className={styles.openingGlow} aria-hidden="true" />
            {/*
              The opening image is the real cup on transparency, not the film's
              poster frame — it is 158KB against the video's 5MB, it needs no
              decode of a keyframe, and it is the same product the film spends
              460vh arriving at. Priority-loaded because it is the LCP.
            */}
            <Image
              className={styles.openingBowl}
              src="/media/acai-story/nabils-bowl.webp"
              alt="A Nabil's açaí cup with granola, strawberries, blueberries and a pistachio drizzle."
              width={760}
              height={950}
              priority
              sizes="(min-width: 48rem) 22rem, 66vw"
            />
          </div>
        </div>

        <span className={styles.scrollCue} aria-hidden="true">
          Scroll
        </span>
      </section>

      {/* ----------------------------------------------------------- story */}
      <AcaiStory />

      {/* ---------------------------------------------------------- lineup */}
      {/*
        The lineup is merchandising, not film. It used to sit on a night band,
        which was right when its photographs carried their own environments —
        but the studio set is a continuous cream sweep, and on black each card
        became a lit rectangle rather than a product. Paper here also gives the
        film the contrast it needs: black sequence, real product reveal, then
        the cream product world opens on this section.
      */}
      <section
        id="lineup"
        className={`${styles.section} ${styles.paper}`}
        aria-labelledby="lineup-title"
      >
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>The lineup</span>
            <h2 id="lineup-title" className={styles.sectionTitle}>
              What people come for
            </h2>
          </header>

          <div className={styles.lineup}>
            {signatures.map((item, index) => (
              <article className={styles.item} key={item.name} data-reveal>
                <div className={styles.itemMedia}>
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 64rem) 34rem, (min-width: 48rem) 45vw, 100vw"
                  />
                  {item.tag ? (
                    <span className={styles.itemTag}>{item.tag}</span>
                  ) : null}
                </div>
                <div>
                  <span className={styles.itemIndex}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <span className={styles.itemPrice}>{item.price}</span>
                  <p className={styles.itemBlurb}>{item.blurb}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- counter */}
      <section
        className={`${styles.section} ${styles.paper}`}
        aria-labelledby="counter-title"
      >
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>The counter</span>
            <h2 id="counter-title" className={styles.sectionTitle}>
              Build your own
            </h2>
            <p className={styles.sectionLede}>
              Every cup comes with granola, banana and strawberries. Pick a
              size, then keep going.
            </p>
          </header>

          <div className={styles.counterGrid} data-reveal>
            <div>
              <p className={styles.subhead}>Sizes</p>
              <dl>
                {SIZES.map(([label, price]) => (
                  <div className={styles.priceRow} key={label}>
                    <dt>{label}</dt>
                    <dd>{price}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p className={styles.subhead}>Drizzles · $1–$2</p>
              <ul className={styles.tokenList}>
                {DRIZZLES.map((drizzle) => (
                  <li className={styles.token} key={drizzle}>
                    {drizzle}
                  </li>
                ))}
              </ul>

              <p className={`${styles.subhead} ${styles.subheadSpaced}`}>
                Toppings · $1–$3
              </p>
              <ul className={styles.tokenList}>
                {TOPPINGS.map((topping) => (
                  <li className={styles.token} key={topping}>
                    {topping}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>Crunchy Dubai filling is $3.</p>
            </div>
          </div>

          <div className={styles.orderBar}>
            <span className={styles.orderLabel}>Order</span>
            <Link href="/menu" className={`${styles.btn} ${styles.btnPrimary}`}>
              Full menu
            </Link>
            <a
              href={brand.orderUrl}
              className={`${styles.btn} ${styles.btnGhost}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("order_click", {
                  platform: "ubereats",
                  placement: "home_close",
                })
              }
            >
              Uber Eats
            </a>
            <a
              href={brand.doordashUrl}
              className={`${styles.btn} ${styles.btnGhost}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("order_click", {
                  platform: "doordash",
                  placement: "home_close",
                })
              }
            >
              DoorDash
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- proof */}
      <section
        className={`${styles.section} ${styles.paper}`}
        aria-labelledby="proof-title"
      >
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>On the record</span>
            <h2 id="proof-title" className={styles.sectionTitle}>
              The Dubai chocolate one
            </h2>
          </header>

          <div className={styles.pressGrid} data-reveal>
            {press.map((entry) => (
              <a
                key={entry.outlet}
                className={styles.press}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.pressOutlet}>{entry.outlet}</span>
                <blockquote className={styles.pressQuote}>
                  &ldquo;{entry.quote}&rdquo;
                </blockquote>
                <span className={styles.pressMeta}>
                  {entry.author} · {entry.date}
                </span>
              </a>
            ))}
          </div>

          <div className={styles.reviewGrid} data-reveal>
            {reviews.map((review) => (
              <figure className={styles.review} key={review.author}>
                <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
                <figcaption className={styles.reviewAuthor}>
                  {review.author}
                  {review.badge ? ` · ${review.badge}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className={styles.ratingRow}>
            {locations.map((loc) => (
              <span className={styles.rating} key={loc.slug}>
                <span className={styles.ratingValue}>{loc.rating}★</span>{" "}
                {loc.name} · {loc.reviewCount} Google reviews
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- find us */}
      <section
        className={`${styles.section} ${styles.night}`}
        aria-labelledby="find-title"
      >
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Find us</span>
            <h2 id="find-title" className={styles.sectionTitle}>
              Two stations
            </h2>
          </header>

          <div className={styles.findGrid} data-reveal>
            <div>
              <h3 className={styles.placeName}>{mtLawley.name}</h3>
              <p className={styles.placeAddress}>{mtLawley.address}</p>
              <dl className={styles.hours}>
                {mtLawley.hours.map(([day, time]) => (
                  <div className={styles.hourRow} key={day}>
                    <dt>{day}</dt>
                    <dd>{time}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.placeActions}>
                <a
                  href={mtLawley.mapsUrl}
                  className={`${styles.btn} ${styles.btnGhost}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("directions_click", {
                      platform: "google_maps",
                      location: mtLawley.slug,
                      placement: "home_locations",
                    })
                  }
                >
                  Directions
                </a>
              </div>
            </div>

            <div>
              <h3 className={styles.placeName}>{ballajura.name}</h3>
              <p className={styles.placeAddress}>{ballajura.address}</p>
              {/*
                Ballajura's full trading hours are still unconfirmed. Saying so
                is better than publishing a closing time we would be guessing at.
              */}
              <p className={styles.unknown}>
                Trading hours for Ballajura aren&apos;t confirmed yet — call the
                shop before heading over.
              </p>
              <div className={styles.placeActions}>
                <a
                  href={brand.phoneHref}
                  className={`${styles.btn} ${styles.btnGhost}`}
                  onClick={() =>
                    track("call_click", {
                      location: ballajura.slug,
                      placement: "home_locations",
                    })
                  }
                >
                  {brand.phone}
                </a>
                <a
                  href={ballajura.mapsUrl}
                  className={`${styles.btn} ${styles.btnGhost}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("directions_click", {
                      platform: "google_maps",
                      location: ballajura.slug,
                      placement: "home_locations",
                    })
                  }
                >
                  Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
