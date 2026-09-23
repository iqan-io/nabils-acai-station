"use client";

import { useEffect, useRef } from "react";
import { BiLogoGoogle } from "react-icons/bi";
import { locations, press, reviews } from "@/lib/brand";
import styles from "./Station.module.css";

/*
  The reference's reviews: two rows of large rounded cards, full bleed and
  running off both edges, under the REVIEWS band. Captured from the live
  reference (the recording never scrolls this far): the cards are still while
  the page is still, and as it scrolls the rows slide in OPPOSITE directions —
  the top row right, the bottom row left — at about 0.4px per pixel scrolled.

  What Nabil's puts in them is only what is on record. The three Google reviews
  and two press quotes are the real ones in brand.ts. The reference prints five
  gold stars on every card; no per-review rating is recorded for these three,
  so no card claims one. Stars appear only on the card that carries the two
  counters' real Google ratings, which links to all of their reviews.
*/

const SPEED = 0.4;

function Stars({ value }: { value: number }) {
  // Filled stars for the whole number, a partial star for the remainder.
  return (
    <span className={styles.stars} aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className={styles.star} aria-hidden="true">
            <span style={{ width: `${fill * 100}%` }}>★</span>★
          </span>
        );
      })}
    </span>
  );
}

function PressCard({ article }: { article: (typeof press)[number] }) {
  return (
    <article className={`${styles.reviewCard} ${styles.reviewCardWide}`}>
      <header>
        <h3>{article.outlet}</h3>
        <span className={styles.reviewSource}>{article.date}</span>
      </header>
      <p>“{article.quote}”</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.reviewLink}>
        Read the article ↗
      </a>
    </article>
  );
}

export function ReviewRows() {
  const root = useRef<HTMLElement>(null);
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Captured once. Reading `rowA.current` inside the frame loop crashed on
    // client-side navigation away from the homepage: React detaches refs (sets
    // them to null) a beat BEFORE it runs this effect's cleanup, so one queued
    // frame could run against a null row — "Cannot read properties of null
    // (reading 'getBoundingClientRect')". The nodes themselves stay valid.
    const el = root.current;
    const a = rowA.current;
    const b = rowB.current;
    if (!el || !a || !b) return;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-width: 861px)");
    let raf = 0;
    let last = NaN;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!el.isConnected) return;
      if (!motion.matches) {
        if (last !== 0) { a.style.transform = ""; b.style.transform = ""; last = 0; }
        return;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      // Each row is phased on ITS OWN centre, not the block's: a row sits
      // centred (overflowing both edges evenly) when it is in the middle of the
      // screen, and reaches its outer positions while still clear of the nav.
      // Phased on the block, the top row only reached its ends while half under
      // the nav, and its first card was never wholly readable.
      const mid = window.innerHeight / 2;
      const phase = (row: HTMLDivElement) => {
        const box = row.getBoundingClientRect();
        // Measure without our own transform: only the vertical centre matters.
        return (mid - (box.top + box.height / 2)) * SPEED;
      };
      const dxA = phase(a);
      const dxB = -phase(b);
      if (Math.abs(dxA - last) < 0.25) return;
      last = dxA;
      a.style.transform = `translate3d(${dxA.toFixed(1)}px, 0, 0)`;
      b.style.transform = `translate3d(${dxB.toFixed(1)}px, 0, 0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const totalReviews = locations.reduce((sum, l) => sum + l.reviewCount, 0);

  return (
    <section className={styles.reviewsBlock} aria-label="What customers and the press say" ref={root}>
      <div className={styles.reviewRow} ref={rowA}>
        {reviews.map((review) => (
          <article key={review.author} className={styles.reviewCard}>
            <header>
              <h3>{review.author.split(" ")[0]}</h3>
              <span className={styles.reviewSource}>
                <BiLogoGoogle aria-hidden /> {review.badge ?? "Google review"}
              </span>
            </header>
            <p>{review.quote}</p>
          </article>
        ))}
      </div>
      {/* The ratings card sits in the MIDDLE of the lower row. The rows overflow
          both edges and only slide so far while on screen; at the end of the
          row it was never more than 68% visible on a 1440px screen. */}
      <div className={styles.reviewRow} ref={rowB}>
        <PressCard article={press[0]} />
        <article className={styles.reviewCard}>
          <header>
            <h3>On Google</h3>
            <span className={styles.reviewSource}>{totalReviews}+ reviews</span>
          </header>
          <ul className={styles.ratingList}>
            {locations.map((location) => (
              <li key={location.slug}>
                <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">
                  <span>{location.name} ↗</span>
                  <Stars value={location.rating} />
                  <b>{location.rating}</b>
                </a>
              </li>
            ))}
          </ul>
        </article>
        <PressCard article={press[1]} />
      </div>
    </section>
  );
}
