"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AcaiStory.module.css";
import { brand } from "@/lib/brand";
import { track } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------------------------------------------------------
   The act, as normalised progress across the pinned section.

   These windows are the contract between four independent things: the cutout
   choreography, the video's currentTime, the chapter copy, and the two
   crossfades. They live in one table so a timing change stays a one-line edit
   instead of a hunt through four `scrollTrigger` blocks with hand-guessed
   pixel offsets.

     0.00  the berry alone
     0.14  the other ingredients start arriving
     0.30  the rosette is assembled; the film's first frame fades up beneath it
     0.36  the video takes over (it is sitting on the frame we just faded in)
     0.86  the video has reached the real cup
     0.90  the cup becomes a static image
     1.00  end of pin
   --------------------------------------------------------------------------- */
const ACT = {
  buildStart: 0.14,
  buildEnd: 0.3,
  seamIn: 0.28,
  filmIn: 0.36,
  filmOut: 0.86,
  productIn: 0.9,
} as const;

const CHAPTERS = [
  { id: "origin", in: 0.02, out: 0.13 },
  { id: "build", in: 0.17, out: 0.31 },
  { id: "spoon", in: 0.7, out: 0.85 },
  { id: "close", in: 0.92, out: 1.0 },
] as const;

/*
  The five approved cutouts and where they belong.

  `end` is the resting rosette. It is not a free composition: it has to occupy
  the same footprint as the film's first frame, because the two are crossfaded
  and any difference in scale reads as a pop. The film's constellation spans
  roughly 85vmin across a contained 16:9 frame with the açaí at the core and the
  strawberries on a ring at about 27vmin, so that is what these numbers
  reproduce. Measured off a real screenshot of the running page, not guessed —
  a first pass built to a guess came out at half the size and the seam jumped.

  `start` is where each one enters from: further out along its own resting
  angle, so every element travels inward on a straight line. Elements that drift
  sideways read as decoration; elements that converge read as assembly.

  Offsets are vmin so the rosette keeps its shape and its share of the frame at
  any viewport, which matters because the video it hands off to is framed the
  same way at every size.
*/
type Cutout = {
  src: string;
  alt: string;
  size: string;
  end: { x: number; y: number; rotate: number; scale: number };
  start: { x: number; y: number; rotate: number; scale: number };
};

const CUTOUTS: Cutout[] = [
  {
    src: "/media/acai-story/acai-berries.webp",
    alt: "",
    size: "26vmin",
    end: { x: 0, y: 0, rotate: 0, scale: 1 },
    start: { x: 0, y: 0, rotate: 0, scale: 1 },
  },
  {
    src: "/media/acai-story/strawberries.webp",
    alt: "",
    size: "22vmin",
    end: { x: 28, y: -14, rotate: 8, scale: 1 },
    start: { x: 96, y: -54, rotate: -26, scale: 0.62 },
  },
  {
    src: "/media/acai-story/blueberries.webp",
    alt: "",
    size: "19vmin",
    end: { x: -28, y: -19, rotate: -6, scale: 1 },
    start: { x: -92, y: -66, rotate: 22, scale: 0.62 },
  },
  {
    src: "/media/acai-story/granola.webp",
    alt: "",
    size: "24vmin",
    // The two lower elements sit wider and higher than a true circle would put
    // them, to keep the band directly under the constellation clear — that is
    // where the chapter headline lands.
    end: { x: 32, y: 20, rotate: -5, scale: 1 },
    start: { x: 88, y: 78, rotate: 18, scale: 0.64 },
  },
  {
    src: "/media/acai-story/drizzle.webp",
    alt: "",
    size: "16vmin",
    end: { x: -34, y: 21, rotate: 12, scale: 1 },
    start: { x: -92, y: 82, rotate: -20, scale: 0.64 },
  },
];

export function AcaiStory() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    const video = videoRef.current;
    if (!stage || !root || !video) return;

    // Reduced motion is handled entirely in CSS (see the media query in the
    // stylesheet). All this check does is decline to build a timeline, so the
    // static layout is never overwritten by inline styles.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /*
      Phones do not scrub. iOS Safari's seek on a compressed H.264 is slow and
      lumpy enough that the illusion breaks, and the fix is not more code — it
      is a different interaction. Mobile keeps the pin, the choreography and the
      chapter copy, and plays the film through once when it reaches the film
      window. Same footage, same beats, none of the fragility.
    */
    const compact = window.matchMedia("(max-width: 47.99rem)").matches;

    /*
      The film is requested on the first idle frame, not on mount.

      Two reasons it is assigned in JS at all rather than in the markup: only one
      of the two cuts should ever be fetched (5.0MB desktop, 2.1MB mobile, chosen
      by breakpoint), and under reduced motion neither should be fetched at all.

      The reason it waits for idle is the hero. The opening frame's LCP is a
      158KB webp of the real cup, and starting a multi-megabyte video in the same
      breath puts it in contention for bandwidth with the one image a hungry
      customer is waiting on. Idle is after first paint but still roughly two
      hundred viewport-heights of scroll before the film window opens, which is
      far more runway than the download needs.
    */
    const load = () => {
      video.src = compact
        ? "/media/acai-story/acai-sequence-768.mp4"
        : "/media/acai-story/acai-sequence-1280.mp4";
      video.load();
    };
    // `typeof` rather than a truthiness check: the DOM lib types declare
    // requestIdleCallback as always present, so `if (window.requestIdleCallback)`
    // is a type error, not a feature test. Safari only shipped it in 16.4, so
    // the timeout fallback is still doing real work.
    const supportsIdle = typeof window.requestIdleCallback === "function";
    const handle = supportsIdle
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 900);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);

      // ---- the scrub ----------------------------------------------------
      // Scroll sets a target time; a ticker eases the element toward it. Writing
      // currentTime straight from the scroll handler tracks every jitter in the
      // wheel and reads as stutter even on densely-keyframed footage.
      let target = 0;
      let current = 0;
      let ready = video.readyState >= 1;
      let played = false;

      const onMeta = () => {
        ready = true;
      };
      video.addEventListener("loadedmetadata", onMeta);

      const drive = () => {
        if (compact || !ready || !Number.isFinite(video.duration)) return;
        current += (target - current) * 0.14;
        if (Math.abs(target - current) < 0.002) current = target;
        // Seeking while a previous seek is still in flight drops frames on
        // Safari, so a seek is only issued once the last one has landed.
        if (!video.seeking) video.currentTime = current;
      };
      gsap.ticker.add(drive);

      // ---- the master timeline -------------------------------------------
      // One trigger, one timeline, normalised 0-1. Everything above reads off
      // the same clock, which is the only way the two crossfades stay welded to
      // the choreography either side of them.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            if (compact || !ready || !Number.isFinite(video.duration)) return;
            const span = ACT.filmOut - ACT.filmIn;
            const p = gsap.utils.clamp(
              0,
              1,
              (self.progress - ACT.filmIn) / span,
            );
            target = p * video.duration;
          },
        },
      });

      // The bloom behind the constellation comes up with the first berry and
      // leaves with the cutouts, so the DOM half of the sequence is lit the same
      // way the footage is.
      const glow = q<HTMLElement>(`.${styles.ingredientGlow}`)[0];
      gsap.set(glow, { autoAlpha: 0 });
      tl.to(glow, { autoAlpha: 1, ease: "power1.out", duration: 0.12 }, 0.01);

      // The scroll cue has done its job the moment the visitor scrolls, and
      // leaving it under the closing tagline turns the last frame of the film
      // into an instruction. It goes early and does not come back.
      tl.to(
        q<HTMLElement>(`.${styles.cue}`)[0],
        { autoAlpha: 0, duration: 0.05 },
        0.03,
      );

      // Ingredient build. The açaí cluster is already on screen from the first
      // frame — it is the "it starts as a berry" beat — so it only breathes.
      // The other four travel in along their own angle.
      const items = q<HTMLElement>(`.${styles.ingredient}`);
      items.forEach((el, index) => {
        const cutout = CUTOUTS[index];
        if (!cutout) return;

        if (index === 0) {
          gsap.set(el, { autoAlpha: 1, xPercent: 0, yPercent: 0 });
          // Restrained: a slow settle and a hair of scale across the opening
          // beat. No float loop, no particles — the brief asks for quiet, and
          // the contrast with the detonation is the whole point of the act.
          tl.fromTo(
            el,
            { scale: 1.14, y: "2vmin" },
            { scale: 1, y: 0, ease: "none", duration: ACT.buildEnd },
            0,
          );
          return;
        }

        gsap.set(el, {
          autoAlpha: 0,
          x: `${cutout.start.x}vmin`,
          y: `${cutout.start.y}vmin`,
          rotate: cutout.start.rotate,
          scale: cutout.start.scale,
        });

        const stagger = (index - 1) * 0.022;
        tl.to(
          el,
          {
            autoAlpha: 1,
            x: `${cutout.end.x}vmin`,
            y: `${cutout.end.y}vmin`,
            rotate: cutout.end.rotate,
            scale: cutout.end.scale,
            // power2.out, not an elastic or a back: food arriving on a spring
            // reads as a toy. It should arrive like it was placed.
            ease: "power2.out",
            duration: ACT.buildEnd - ACT.buildStart - stagger,
          },
          ACT.buildStart + stagger,
        );
      });

      // ---- seam one: cutouts -> the film's own first frame ----------------
      // The still fades up while the cutouts are still travelling, and the
      // cutouts leave while still travelling. Neither side ever holds a pose, so
      // there is no moment the eye can read as a cut.
      const seam = q<HTMLElement>(`.${styles.seam}`)[0];
      const film = q<HTMLElement>(`.${styles.film}`)[0];

      tl.to(
        seam,
        { autoAlpha: 1, ease: "power1.inOut", duration: ACT.filmIn - ACT.seamIn },
        ACT.seamIn,
      );
      // The whole cutout layer leaves at once — items and bloom together — so
      // the browser composites one fading layer instead of six, and so the
      // bloom can't outlive the food it was lighting.
      tl.to(
        q<HTMLElement>(`.${styles.ingredients}`)[0],
        { autoAlpha: 0, ease: "power1.in", duration: 0.06 },
        ACT.seamIn + 0.02,
      );

      // The video is pixel-identical to the still underneath it at t=0, so this
      // fade has nothing to reveal — it exists only to get a <video> on screen
      // before it needs to move.
      tl.to(film, { autoAlpha: 1, duration: 0.03 }, ACT.filmIn - 0.03);

      /*
        The still is deliberately NOT hidden once the video is up.

        It occupies exactly the same box, so a video with a decoded frame covers
        it completely and it costs nothing to leave there. What it buys is every
        failure mode at once, for free: autoplay refused on a phone, a seek that
        has not landed, the network dropped mid-scroll, a codec the browser will
        not take. In all of them the frame underneath is a real photograph of the
        food rather than a black rectangle — which is also why this component
        carries no `poster` attribute. A poster would download on every single
        visit to cover the same cases this already covers with an image the act
        needs anyway.
      */

      // ---- seam two: the film -> an ordinary image ------------------------
      // The film's last half-second is a hold on the finished cup, so the
      // static bowl can fade in over a frame that is already still. Once it
      // has, the video is dropped and the rest of the page is plain DOM.
      const product = q<HTMLElement>(`.${styles.product}`)[0];
      tl.to(
        product,
        { autoAlpha: 1, ease: "power1.inOut", duration: 0.05 },
        ACT.productIn - 0.02,
      );
      // Film and still leave together — the still has been sitting under the
      // video as its safety net since the first seam.
      tl.to([film, seam], { autoAlpha: 0, duration: 0.04 }, ACT.productIn + 0.02);

      // ---- chapter copy ----------------------------------------------------
      CHAPTERS.forEach((chapter) => {
        const el = stage.querySelector<HTMLElement>(
          `[data-chapter="${chapter.id}"]`,
        );
        if (!el) return;
        const fade = Math.min(0.05, (chapter.out - chapter.in) / 3);
        tl.fromTo(
          el,
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, ease: "power3.out", duration: fade },
          chapter.in,
        );
        // The closing beat carries the tagline and a link, so it holds to the
        // end of the pin instead of fading out into black.
        if (chapter.out < 1) {
          tl.to(
            el,
            { autoAlpha: 0, y: -26, ease: "power2.in", duration: fade },
            chapter.out - fade,
          );
        }
      });

      // ---- mobile: play once instead of scrubbing --------------------------
      if (compact) {
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (played || self.progress < ACT.filmIn) return;
            played = true;
            // If autoplay is refused the poster stays up, and the poster is the
            // finished cup — the same thing the film would have ended on. The
            // failure mode is a still, never a black rectangle.
            video.play().catch(() => {});
          },
        });
      }

      return () => {
        gsap.ticker.remove(drive);
        video.removeEventListener("loadedmetadata", onMeta);
      };
    }, rootRef);

    return () => {
      ctx.revert();
      if (supportsIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, []);

  return (
    <>
      <section
        className={styles.story}
        ref={rootRef}
        aria-labelledby="story-title"
      >
        <div className={styles.stage} ref={stageRef}>
          <div className={`${styles.layer} ${styles.ingredients}`} aria-hidden="true">
            <span className={styles.ingredientGlow} />
            {CUTOUTS.map((cutout) => (
              // Plain <img>, not next/image: these are transform-animated
              // overlays with no layout box to optimise, they are already
              // hand-sized webp, and next/image's wrapper would add a
              // positioned element between GSAP and the thing it animates.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={cutout.src}
                className={styles.ingredient}
                style={{ "--size": cutout.size } as React.CSSProperties}
                src={cutout.src}
                alt={cutout.alt}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>

          {/* The film's own first frame. Exported at encode time from the
              delivered file, so the crossfade into the video has nothing to
              conceal. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.seam}
            src="/media/acai-story/sequence-first-frame.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />

          {/* No `src` in markup — it is chosen by breakpoint on the first idle
              frame, and never requested at all under reduced motion. `auto` is
              safe here precisely because nothing loads until that assignment:
              scrubbing wants the whole file buffered, and by the time the src
              lands the hero has already painted. */}
          <video
            className={styles.film}
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className={`${styles.layer} ${styles.product}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.productImage}
              src="/media/acai-story/nabils-bowl.webp"
              alt="A finished Nabil's açaí cup — açaí, granola, strawberries, blueberries and a pistachio drizzle."
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className={styles.foot} aria-hidden="true" />

          <div className={styles.chapters}>
            <div className={styles.chapter} data-chapter="origin">
              <div className={styles.chapterInner}>
                <span className={styles.eyebrow}>01 — Origin</span>
                <h2 id="story-title" className={styles.chapterTitle}>
                  It starts as a berry
                </h2>
                <p className={styles.chapterBody}>
                  Açaí grows in bunches on a palm. Everything else on this page
                  is what happens after that.
                </p>
              </div>
            </div>

            <div className={styles.chapter} data-chapter="build">
              <div className={styles.chapterInner}>
                <span className={styles.eyebrow}>02 — The build</span>
                <h2 className={styles.chapterTitle}>Then you build it</h2>
                <p className={styles.chapterBody}>
                  Granola, banana and strawberries come standard on every cup.
                  The drizzle is the part that makes it yours.
                </p>
              </div>
            </div>

            <div className={styles.chapter} data-chapter="spoon">
              <div className={styles.chapterInner}>
                <span className={styles.eyebrow}>03 — The first spoon</span>
                <h2 className={styles.chapterTitle}>Then the first spoon</h2>
                <p className={styles.chapterBody}>
                  Large, regular, small, or a cone. Nine dollars to fifteen, open
                  till late in Mount Lawley.
                </p>
              </div>
            </div>

            <div className={styles.chapter} data-chapter="close">
              <div className={styles.chapterInner}>
                <h2 className={styles.chapterTitle}>{brand.tagline}</h2>
                <div className={styles.chapterActions}>
                  <Link
                    href="/menu"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
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
                        placement: "home_story_close",
                      })
                    }
                  >
                    Order delivery
                  </a>
                </div>
              </div>
            </div>
          </div>

          <span className={styles.cue} aria-hidden="true">
            Keep scrolling
          </span>

          <a className={styles.skip} href="#lineup">
            Skip to the food
          </a>
        </div>
      </section>

      {/* Section 19 of the brief: walk the ground out of true black and back
          into Nabil's own palette rather than cutting between them. */}
      <div className={styles.exit} aria-hidden="true" />
    </>
  );
}
