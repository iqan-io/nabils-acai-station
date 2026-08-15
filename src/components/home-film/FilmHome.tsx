"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  brand,
  locations,
  press,
  reviews,
  signatures,
} from "@/lib/brand";
import styles from "./FilmHome.module.css";

gsap.registerPlugin(ScrollTrigger);

/*
  The film is one 10s take cut into three shots, re-ordered at encode time so the
  scroll reads origin -> build -> first spoon. These are the normalised progress
  windows each shot occupies, used to time the chapter copy to the cuts.

    berries  0.00 - 0.40
    drizzle  0.40 - 0.70
    spoon    0.70 - 1.00
*/
const CHAPTERS = [
  // The opening beat is on screen before a single pixel is scrolled, so it only
  // ever fades out. Everything after it fades in and out inside its own shot.
  { id: "hero", in: 0.0, out: 0.13, holds: true },
  { id: "origin", in: 0.16, out: 0.37, holds: false },
  { id: "build", in: 0.44, out: 0.65, holds: false },
  { id: "spoon", in: 0.72, out: 0.95, holds: false },
] as const;

export function FilmHome() {
  const rootRef = useRef<HTMLDivElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setReduced(true);
      return;
    }

    const video = videoRef.current;
    const film = filmRef.current;
    if (!video || !film) return;

    // Mobile gets the half-resolution cut. Source is assigned here rather than in
    // JSX so the server and client markup can't disagree, and so the 2.5MB file
    // never competes with the poster for first paint.
    const compact = window.matchMedia("(max-width: 47.99rem)").matches;
    video.src = compact
      ? "/videos/acai-film-mobile.mp4"
      : "/videos/acai-film.mp4";

    // Lenis is scoped to this page and torn down on unmount so the other five
    // routes keep native scrolling.
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // ---- the scrub -------------------------------------------------------
      // Scroll position drives a target time; a ticker eases the video toward
      // it. Assigning currentTime straight from the scroll handler tracks every
      // jitter in the wheel, which reads as stutter even on all-intra footage.
      let target = 0;
      let current = 0;
      let ready = false;

      const onMeta = () => {
        ready = true;
      };
      if (video.readyState >= 1) ready = true;
      else video.addEventListener("loadedmetadata", onMeta);

      ScrollTrigger.create({
        trigger: film,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!ready || !Number.isFinite(video.duration)) return;
          target = self.progress * video.duration;
        },
      });

      const drive = () => {
        if (!ready || !Number.isFinite(video.duration)) return;
        current += (target - current) * 0.12;
        if (Math.abs(target - current) < 0.001) current = target;
        // Seeking while a previous seek is in flight drops frames on Safari.
        if (!video.seeking) video.currentTime = current;
      };
      gsap.ticker.add(drive);

      // ---- chapter copy ----------------------------------------------------
      // One timeline scrubbed against the same range, so copy is locked to the
      // cuts rather than to a guessed pixel offset.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: film,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      CHAPTERS.forEach((chapter) => {
        const el = film.querySelector<HTMLElement>(`[data-chapter="${chapter.id}"]`);
        if (!el) return;
        const span = chapter.out - chapter.in;
        const fade = Math.min(0.06, span / 3);
        if (!chapter.holds) {
          tl.fromTo(
            el,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: fade, ease: "power3.out" },
            chapter.in,
          );
        }
        tl.to(
          el,
          { opacity: 0, y: -30, duration: fade, ease: "power2.in" },
          chapter.out - fade,
        );
      });

      // ---- everything below the film --------------------------------------
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el.children, {
          opacity: 0,
          y: 40,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
      });

      return () => {
        gsap.ticker.remove(drive);
        video.removeEventListener("loadedmetadata", onMeta);
      };
    }, rootRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
    };
  }, []);

  const mtLawley = locations[0];
  const ballajura = locations[1];

  return (
    <div className={styles.root} ref={rootRef} data-reduced={reduced}>
      {/* ------------------------------------------------------------ film */}
      <section
        className={styles.film}
        ref={filmRef}
        aria-labelledby="film-title"
      >
        <div className={styles.stage}>
          <Image
            className={styles.poster}
            src="/videos/acai-film-poster.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            aria-hidden="true"
          />
          {/*
            No `src` in markup — it is assigned on mount (and never under reduced
            motion). If the file fails, the poster underneath is what shows,
            rather than a black rectangle.
          */}
          <video
            className={styles.video}
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            poster="/videos/acai-film-poster.jpg"
          />
          <div className={styles.scrim} />

          <div className={styles.chapters}>
            <div className={styles.chapter} data-chapter="hero">
              <h1 id="film-title" className={styles.heroTitle}>
                Nabil&apos;s Açaí Station
              </h1>
              <p className={styles.heroTagline}>{brand.tagline}</p>
              <div className={styles.heroActions}>
                <Link href="/menu" className={`${styles.btn} ${styles.btnPrimary}`}>
                  See the menu
                </Link>
                <a
                  href={brand.orderUrl}
                  className={`${styles.btn} ${styles.btnGhost}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order delivery
                </a>
              </div>
            </div>

            <div className={styles.chapter} data-chapter="origin">
              <span className={styles.eyebrow}>01 — Origin</span>
              <h2 className={styles.chapterTitle}>It starts as a berry</h2>
              <p className={styles.chapterBody}>
                Açaí grows in bunches on a palm. Everything else on this page is
                what happens after that.
              </p>
            </div>

            <div className={styles.chapter} data-chapter="build">
              <span className={styles.eyebrow}>02 — The build</span>
              <h2 className={styles.chapterTitle}>Then you build it</h2>
              <p className={styles.chapterBody}>
                Granola, banana and strawberries come standard on every cup. The
                drizzle is the part that makes it yours.
              </p>
            </div>

            <div className={styles.chapter} data-chapter="spoon">
              <span className={styles.eyebrow}>03 — The spoon</span>
              <h2 className={styles.chapterTitle}>Then the first spoon</h2>
              <p className={styles.chapterBody}>
                Large, regular, small, or a cone. Nine dollars to fifteen, open
                till late in Mount Lawley.
              </p>
            </div>
          </div>

          <span className={styles.cue} aria-hidden="true">
            Scroll
          </span>
        </div>
      </section>

      {/* ---------------------------------------------------------- lineup */}
      <section className={`${styles.section} ${styles.paper}`} aria-labelledby="lineup-title">
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>The lineup</span>
            <h2 id="lineup-title" className={styles.sectionTitle}>
              What people come for
            </h2>
          </header>

          <div className={styles.lineup} data-reveal>
            {signatures.map((item) => (
              <article key={item.name} className={styles.card}>
                <div className={styles.cardMedia}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 48rem) 33vw, 100vw"
                  />
                  {item.tag ? (
                    <span className={styles.cardTag}>{item.tag}</span>
                  ) : null}
                </div>
                <div className={styles.cardHead}>
                  <h3 className={styles.cardName}>{item.name}</h3>
                  <span className={styles.cardPrice}>{item.price}</span>
                </div>
                <p className={styles.cardBlurb}>{item.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- counter */}
      <section className={`${styles.section} ${styles.night}`} aria-labelledby="counter-title">
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>The counter</span>
            <h2 id="counter-title" className={styles.sectionTitle}>
              Build your own
            </h2>
            <p className={styles.sectionLede}>
              Every cup comes with granola, banana and strawberries. Pick a size,
              then keep going.
            </p>
          </header>

          <div className={styles.counterGrid} data-reveal>
            <div>
              <p className={styles.subhead}>Sizes</p>
              <dl>
                <div className={styles.priceRow}>
                  <dt>Large</dt>
                  <dd>$15</dd>
                </div>
                <div className={styles.priceRow}>
                  <dt>Regular</dt>
                  <dd>$12</dd>
                </div>
                <div className={styles.priceRow}>
                  <dt>Small</dt>
                  <dd>$10</dd>
                </div>
                <div className={styles.priceRow}>
                  <dt>Cone</dt>
                  <dd>$9</dd>
                </div>
              </dl>
            </div>

            <div>
              <p className={styles.subhead}>Drizzles · $1–$2</p>
              <ul className={styles.tokenList}>
                {[
                  "Honey",
                  "Condensed milk",
                  "Passion fruit",
                  "Nutella",
                  "Pistachio",
                  "Biscoff",
                  "Bueno",
                  "Peanut butter",
                  "Milk chocolate",
                ].map((d) => (
                  <li key={d} className={styles.token}>
                    {d}
                  </li>
                ))}
              </ul>

              <p className={`${styles.subhead} ${styles.subheadSpaced}`}>
                Toppings · $1–$3
              </p>
              <ul className={styles.tokenList}>
                {[
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
                ].map((t) => (
                  <li key={t} className={styles.token}>
                    {t}
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
            >
              Uber Eats
            </a>
            <a
              href={brand.doordashUrl}
              className={`${styles.btn} ${styles.btnGhost}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              DoorDash
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- proof */}
      <section className={`${styles.section} ${styles.paper}`} aria-labelledby="proof-title">
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
              <figure key={review.author} className={styles.review}>
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
              <span key={loc.slug} className={styles.rating}>
                <span className={styles.ratingValue}>{loc.rating}★</span>{" "}
                {loc.name} · {loc.reviewCount} Google reviews
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- find us */}
      <section className={`${styles.section} ${styles.night}`} aria-labelledby="find-title">
        <div className={styles.shell}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Find us</span>
            <h2 id="find-title" className={styles.sectionTitle}>
              Two stations
            </h2>
          </header>

          <div className={styles.findGrid} data-reveal>
            <div className={styles.place}>
              <h3 className={styles.placeName}>{mtLawley.name}</h3>
              <p className={styles.placeAddress}>{mtLawley.address}</p>
              <dl className={styles.hours}>
                {mtLawley.hours.map(([day, time]) => (
                  <div key={day} className={styles.hourRow}>
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
                >
                  Directions
                </a>
              </div>
            </div>

            <div className={styles.place}>
              <h3 className={styles.placeName}>{ballajura.name}</h3>
              <p className={styles.placeAddress}>{ballajura.address}</p>
              {/*
                Ballajura's full trading hours are still unconfirmed. Saying so is
                better than publishing a closing time we would be guessing at.
              */}
              <p className={styles.unknown}>
                Trading hours for Ballajura aren&apos;t confirmed yet — call the
                shop before heading over.
              </p>
              <div className={styles.placeActions}>
                <a
                  href={brand.phoneHref}
                  className={`${styles.btn} ${styles.btnGhost}`}
                >
                  {brand.phone}
                </a>
                <a
                  href={ballajura.mapsUrl}
                  className={`${styles.btn} ${styles.btnGhost}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
