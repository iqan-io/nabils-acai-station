"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { AcaiStory } from "@/components/cinematic/AcaiStory";
import { ArrivalClip } from "./ArrivalClip";
import { OrderPickupPill } from "@/components/station/OrderPickupPill";
import { ReviewRows } from "./ReviewRows";
import { PanelStack } from "@/components/station/PanelStack";
import { brand, locations, menuGroups, menuSlug } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { useSmoothScroll } from "@/lib/useSmoothScroll";
import styles from "./Station.module.css";

/* Hero-only background edits of Nabil's existing product photographs. The menu
   keeps its cream merchandising system; these live on black because their job
   is to disappear into the reference's long, narrow photographic apertures. */
const heroPhotos = [
  "/images/products/hero-dark/acai-dark-v1.webp",
  "/images/products/hero-dark/crepe-dark-v1.webp",
  "/images/products/hero-dark/dubai-chocolate-dark-v1.webp",
  "/images/products/hero-dark/fruit-cocktail-dark-v1.webp",
] as const;

/*
  The capsule lattice.

  The field is a grid in the capsules' own rotated frame — `--cols` columns
  across, `--rows` rows along the drift axis — and Station.module.css slides the
  whole lattice two row pitches per cycle. Three rules keep that loop invisible
  while still turning the dishes over:

    1. The photograph is chosen from `(col * 2 + row % 2)`, so it repeats every
       TWO rows. That is exactly the animation's travel, so the reset lands on
       an identical field. It also means a capsule always arrives where a
       different dish just was, which is what makes the roster appear to rotate.
    2. The per-column stagger steps each column along the drift axis by 2/5 of
       a row pitch, wrapped into one pitch. 2 and 5 are coprime, so the five
       columns land on five evenly spread phases (0, .4, .8, .2, .6) and the
       field reads as even diagonal bands. A plain 0.31 step clustered them and
       left the density lurching through the cycle; an unwrapped step would push
       the later columns out of the covered area entirely.
    3. The crop scale and origin vary per cell, so the four sources do not read
       as four repeated tiles. They are derived from the same `(col, row % 2)`
       pair, so they stay periodic too.

  The counts are the smallest that cover the viewport once rotated by 30deg,
  plus the two rows of overscan the loop consumes. Every cell reuses one of four
  already-downloaded images, so the extra capsules cost DOM, not network.
*/
const LATTICE = { cols: 5, rows: 7 } as const;
const CAP_SCALES = ["1.32", "1.46", "1.58"] as const;
const CAP_ORIGINS = ["44%", "56%", "68%"] as const;

type Cell = {
  key: string;
  photo: string;
  col: number;
  row: number;
  stagger: string;
  scale: string;
  origin: string;
  priority: boolean;
};

function latticeCells(): Cell[] {
  const cells: Cell[] = [];
  for (let col = 0; col < LATTICE.cols; col += 1) {
    for (let row = 0; row < LATTICE.rows; row += 1) {
      const phase = (col * 2 + (row % 2)) % heroPhotos.length;
      const variant = (col + (row % 2) * 2) % CAP_SCALES.length;
      cells.push({
        key: `${col}-${row}`,
        photo: heroPhotos[phase],
        col,
        row,
        // Wrapped into one row pitch — see rule 2 above.
        stagger: (((col * 2) / LATTICE.cols) % 1).toFixed(3),
        scale: CAP_SCALES[variant],
        origin: CAP_ORIGINS[variant],
        // Every cell draws one of the same four files, so preloading the first
        // occurrence of each is enough for the whole field to paint at once.
        // Marking all 35 priority would preload nothing extra and just flood
        // the first paint with duplicate hints.
        priority: false,
      });
    }
  }
  // Promote the first cell that uses each photograph, so all four sources are
  // fetched eagerly and no capsule paints as an empty black pill.
  const seen = new Set<string>();
  for (const cell of cells) {
    if (!seen.has(cell.photo)) {
      seen.add(cell.photo);
      cell.priority = true;
    }
  }
  return cells;
}

const CELLS = latticeCells();

export function HomeCinematic() {
  const heroRef = useRef<HTMLElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  useSmoothScroll();

  /* The collage drifts along its own diagonal as the hero scrolls, while the
     wordmark stays put — the reference's opening move. The capsules are rotated
     -28deg, so travelling on that same axis reads as sliding along their length
     rather than as a layer sliding behind the type.

     rAF rather than a scroll event: the page is driven by Lenis, whose smoothed
     position does not land on native scroll events, and reading the hero's own
     rect each frame keeps this independent of AcaiStory's engine. It writes one
     transform on one element and never touches the film. */
  useEffect(() => {
    const hero = heroRef.current;
    const photos = photosRef.current;
    if (!hero || !photos) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = -1;
    let covered = false;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      // The hero is pinned (see .heroScene), so its own rect no longer moves.
      // Progress is how far the film has slid up over it instead: 0 at the top
      // of the page, 1 once the hero is completely covered.
      const height = Math.max(hero.offsetHeight, 1);
      const p = Math.min(1, Math.max(0, window.scrollY / height));
      // Stop compositing a drift nobody can see: the lattice pauses once the
      // film fully covers the hero, and resumes on the way back up.
      const nowCovered = p >= 1;
      if (nowCovered !== covered) {
        covered = nowCovered;
        hero.toggleAttribute("data-covered", covered);
      }
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      // Unit vector of the -28deg axis, travelled backwards so the field falls
      // down-and-left and fresh capsules enter from the top right.
      photos.style.transform = `translate3d(${(-15 * p).toFixed(2)}vw, ${(8 * p).toFixed(2)}vh, 0)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.root}>
      {/* The reference's opening move: the hero stays pinned and the next
          surface slides up over it, wordmark and all. The pin is scoped to this
          wrapper — hero plus film — so the hero unpins when the film ends and
          can never show through the gutters between the panels further down. */}
      <div className={styles.heroScene}>
      <section className={styles.hero} aria-labelledby="home-title" ref={heroRef}>
        {/* Outer wrapper takes the scroll parallax (written by the effect
            above); the lattice inside it carries the continuous drift, so the
            two never fight over one transform. */}
        <div className={styles.heroPhotos} aria-hidden="true" ref={photosRef}>
          <div className={styles.heroDrift}>
            <div className={styles.heroLattice}>
              {CELLS.map((cell) => (
                <div
                  className={styles.capsule}
                  key={cell.key}
                  style={
                    {
                      "--col": cell.col,
                      "--row": cell.row,
                      "--stagger": cell.stagger,
                      "--cap-scale": cell.scale,
                      "--cap-origin": cell.origin,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={cell.photo}
                    alt=""
                    fill
                    // Capsule width x the up-to-1.58x crop scale inside it.
                    // The old 26vw/46vw hint served 640-750px files for a
                    // 1024px source and left every capsule soft on retina.
                    // On tablets the capsule is 30vw and its crop up to 1.58x,
                    // so it needs ~47vw of file; 60vw clears it everywhere.
                    sizes="(min-width: 48rem) 60vw, 100vw"
                    priority={cell.priority}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.heroCopy}>
          <h1 id="home-title">Nabil&apos;s <span>Açaí Station</span></h1>
          <div className={styles.heroActions}>
            <a href={brand.orderUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => track("order_click", { platform: "ubereats", placement: "home_hero" })}>Order delivery</a>
            <Link href="/menu">See the menu</Link>
          </div>
        </div>
      </section>

      <div className={styles.heroCover}>
        <div id="acai-film" className={styles.storyIntro}>A little berry. A whole lot of possibility.</div>
        {/* Preserve the approved movie verbatim, including its mobile and reduced-motion paths. */}
        <AcaiStory />
      </div>
      </div>

      {/* The panels below are sticky siblings: each one pins under the nav and the
          next slides up over it, so sections stack instead of scrolling past. This
          is the reference's signature and it lives entirely in CSS, above the
          film rather than through it — AcaiStory keeps its own scroll handler. */}
      <div className={styles.stack} data-home-stack>
      <section data-panel className={`${styles.panel} ${styles.neonPanel}`} aria-labelledby="neon-title">
        <div className={styles.neonPhoto}>
          <Image src="/media/mt-lawley/neon.webp" alt="Made for Sweet Moments in neon above the counter at Nabil's Mount Lawley shop." fill sizes="(min-width: 48rem) 54vw, 100vw" />
        </div>
        <div className={styles.neonCopy}>
          <p className={styles.label}>From our counter, with love</p>
          <h2 id="neon-title">Your kind of<br />sweet spot.</h2>
          <p>Choose your açaí. Find your favourite drizzle. Stay for something sweet at Mount Lawley or Ballajura.</p>
          <Link href="/about" className={styles.textLink}>Meet Nabil&apos;s <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      {/* id="lineup" is the target of the film's "Skip to the food" link. It used to
          be the homepage menu browser; when that moved to /menu the anchor went
          with it and the skip link pointed at nothing. The film is approved and
          untouched, so the target moved here — the section that is the food. */}
      <section id="lineup" data-panel className={`${styles.panel} ${styles.cravings}`} aria-labelledby="cravings-title">
        <div className={styles.cravingsLeft}>
          <h2 id="cravings-title">Sweet cravings start here,</h2>
          <div className={styles.cravingRound}>
            <Image src="/images/products/hero-dark/acai-dark-v1.webp" alt="A Nabil's açaí cup with granola, blueberries and strawberries under a thick drizzle"
              fill sizes="(min-width: 48rem) 30vw, 68vw" />
          </div>
          <p>made to order, from open till late.</p>
        </div>
        <div className={styles.cravingsRight}>
          <h3>Come for the açaí.<br />Stay for the Dubai chocolate.</h3>
          <p className={styles.label} style={{ marginTop: "var(--ds-step-3)" }}>Our desserts and drinks</p>
          {/* Indexes the real menu groups and deep-links into `/menu`, so this
              is a way in rather than a picture of one. */}
          <nav className={styles.indexList} aria-label="Menu categories">
            {menuGroups.map((group) => (
              <Link key={group.label} href={`/menu#${menuSlug(group.sections[0])}`}>{group.label}</Link>
            ))}
          </nav>
        </div>
      </section>

      {/* The reference's full-bleed word band. Deliberately static — see the
          note in Station.module.css. */}
      <div className={`${styles.panel} ${styles.ticker}`} aria-hidden="true">
        {Array.from({ length: 9 }).map((_, index) => (
          <Fragment key={index}><span>Reviews</span><i>•</i></Fragment>
        ))}
      </div>

      <ReviewRows />


      <section data-panel className={`${styles.panel} ${styles.locations}`} aria-labelledby="find-title">
        <div className={styles.locationBody}>
          <p className={styles.label}>Come on over</p>
          <h2 id="find-title">Two stations.<br />See you at yours.</h2>
          <div className={styles.locationGrid}>
            {locations.map((location) => <article key={location.slug}>
              <h3>{location.name}</h3><p>{location.address}</p>
              {location.hours ? <dl className={styles.hours}>{location.hours.map(([day, time]) =>
                <div key={day}><dt>{day}</dt><dd>{time}</dd></div>)}</dl>
                : <p className={styles.footnote}>Call the shop for trading hours before heading over.</p>}
              <div className={styles.locationActions}>
                <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.pill}
                  onClick={() => track("directions_click", { platform: "google_maps", location: location.slug, placement: "home_locations" })}>Directions ↗</a>
                {location.slug === "ballajura" && <a href={brand.phoneHref} className={styles.textLink}
                  onClick={() => track("call_click", { location: location.slug, placement: "home_locations" })}>Call the shop ↗</a>}
              </div>
            </article>)}
          </div>
        </div>
        <figure className={styles.arrival}>
          <ArrivalClip />
          <figcaption>Inside Mount Lawley ↗</figcaption>
        </figure>
      </section>
      <section data-panel className={`${styles.panel} ${styles.closing}`} aria-label="Order delivery">
        <p>Make it a sweet night.</p>
        <div><a href={brand.orderUrl} target="_blank" rel="noopener noreferrer" className={styles.pill}
          onClick={() => track("order_click", { platform: "ubereats", placement: "home_close" })}>Uber Eats ↗</a>
          <a href={brand.doordashUrl} target="_blank" rel="noopener noreferrer" className={styles.pill}
            onClick={() => track("order_click", { platform: "doordash", placement: "home_close" })}>DoorDash ↗</a></div>
      </section>
      </div>

      {/* The persistent pill is in every frame of the reference, the hero
          included. It shipped on the five inner routes and was missing here —
          on the one page a visitor is most likely to land on. */}
      {/* Height-aware pinning for the homepage stack: a panel taller than the
          space under the nav pins only once its bottom is on screen. With a
          fixed 88px pin, the last index links and both press quotes were never
          visible at all on a 390px phone. */}
      <PanelStack selector="[data-home-stack] > [data-panel]" belowNav />
      <OrderPickupPill placement="home" />
    </div>
  );
}
