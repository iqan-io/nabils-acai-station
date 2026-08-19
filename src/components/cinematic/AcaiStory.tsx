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
  // The cutouts finish converging BEFORE the dissolve starts. The first version
  // overlapped them: the constellation still faded up from 0.28 while the
  // cutouts were still fading out at 0.36, so for ~250px of scroll you saw two
  // different arrangements of the same fruit at once. A double exposure is what
  // "the transition feels off" looks like.
  buildEnd: 0.32,
  seamIn: 0.32,
  seamFull: 0.37,
  filmIn: 0.37,
  filmOut: 0.86,
  productIn: 0.9,
} as const;

/*
  How hard the timeline is eased.

  This started at 0.6, on the reference spec's advice that ~0.5-0.6 makes the
  footage "glide rather than snap". Measured on the built page, it did not glide
  — it trailed. Driving a brisk scroll through the film window and sampling every
  frame, the video ran a mean 0.95s of footage behind the scroll, and 1.8-2.2s
  behind on a fast flick. On an 11.6s film that is up to a fifth of the whole
  sequence lagging the wheel.

  The cause was three independent easing layers compounding: Lenis smoothing the
  scroll, ScrollTrigger's scrub smoothing the progress, and a per-frame lerp
  smoothing the video time again on top. CPU throttling barely moved the number
  and only 6% of frames failed to advance, which rules out decode cost — it was
  purely accumulated smoothing.

  So there is now exactly one easing stage for the film, and this is it. The lerp
  is gone; currentTime is written straight from the already-scrubbed progress.

  Phones get a tighter value. Scrub is a time constant, so the seconds-of-video
  it puts you behind depend on how much footage each pixel of scroll carries —
  and a phone's act is shorter, so its film is denser even after the pin was
  lengthened. Matching the *feel* means not matching the number.
*/
const SCRUB_DESKTOP = 0.25;
const SCRUB_COMPACT = 0.14;

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
      `compact` now selects the file, and nothing else.

      It used to also mean "do not scrub — play the film through once", which is
      what both source briefs advise, because seeking a GOP-encoded H.264 on a
      phone is slow and lumpy. That advice was right about the encode and wrong
      once the encode changed: the delivered cuts are all-intra, so every seek is
      a single-frame decode with nothing to walk forward from.

      It was also actively broken. Play-once decouples the film from the scroll,
      and the scroll is much faster than the film: the film window is about
      1240px on a phone, which is a two-second flick, against 11.6s of footage.
      So a visitor arrived at the product handoff — where the finished cup fades
      in over the film's final frame — while the video was still two seconds in
      and showing the explosion. The two crossfaded into each other. Measured on
      a 390x844 capture before this change.

      Scrubbing on both makes the transport identical everywhere, which is also
      one code path instead of two.
    */
    const compact = window.matchMedia("(max-width: 47.99rem)").matches;

    /*
      Matches the --rosette token in the stylesheet, and must keep matching it.

      A portrait stage magnifies the film less than a landscape one does (see
      --film-scale: the source is 720p and a phone at DPR 3 runs out of real
      pixels fast), so the cutout constellation has to shrink by the same ratio
      or it stops lining up with the frame it dissolves into. The CSS token
      handles the cutouts' size; this handles the distances GSAP moves them.
    */
    const rosette = window.matchMedia("(max-aspect-ratio: 1 / 1)").matches
      ? 0.78
      : 1;

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
        ? "/media/acai-story/acai-sequence-mobile.mp4"
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
      let ready = video.readyState >= 1;

      const onMeta = () => {
        ready = true;
      };
      video.addEventListener("loadedmetadata", onMeta);

      // ---- the master timeline -------------------------------------------
      // One trigger, one timeline, normalised 0-1. Everything above reads off
      // the same clock, which is the only way the two crossfades stay welded to
      // the choreography either side of them.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: compact ? SCRUB_COMPACT : SCRUB_DESKTOP,
          onUpdate: (self) => {
            if (!ready || !Number.isFinite(video.duration)) return;
            const span = ACT.filmOut - ACT.filmIn;
            const p = gsap.utils.clamp(
              0,
              1,
              (self.progress - ACT.filmIn) / span,
            );
            // `self.progress` is already the scrub-eased value, so this is the
            // one and only smoothing the film gets. The guard stays: issuing a
            // seek while the last one is still in flight drops frames on Safari.
            if (!video.seeking) video.currentTime = p * video.duration;
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
          x: `${cutout.start.x * rosette}vmin`,
          y: `${cutout.start.y * rosette}vmin`,
          rotate: cutout.start.rotate,
          scale: cutout.start.scale,
        });

        const stagger = (index - 1) * 0.022;
        tl.to(
          el,
          {
            autoAlpha: 1,
            x: `${cutout.end.x * rosette}vmin`,
            y: `${cutout.end.y * rosette}vmin`,
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

      /*
        A true dissolve: the two sides share one window and both run linear, so
        their alphas sum to roughly constant across it and there is no moment
        where both are near full and the frame goes bright.

        The cutouts also keep moving through it — a further 4vmin inward and a
        touch of scale, as if they are being absorbed into the larger
        constellation. That is what actually sells the seam. Two still images
        cross-dissolving read as two images; two images cross-dissolving while
        one is still travelling reads as one thing continuing to move.
      */
      const dissolve = ACT.seamFull - ACT.seamIn;
      tl.to(
        seam,
        { autoAlpha: 1, ease: "none", duration: dissolve },
        ACT.seamIn,
      );

      const ingredientLayer = q<HTMLElement>(`.${styles.ingredients}`)[0];
      /*
        The whole cutout layer leaves at once — items and bloom together — so the
        browser composites one fading layer instead of six, and so the bloom
        can't outlive the food it was lighting.

        It also defocuses on the way out. A straight opacity crossfade between
        five sharp cutouts and a constellation of twenty-five reads as two
        stacked layers, because both sides are sharp and the eye can separate
        them. Blurring the outgoing side turns it into depth instead: the
        cutouts read as falling out of focus while the thing behind them
        resolves, which is a camera doing something rather than a website
        swapping images.
      */
      /*
        Opacity runs linear so the two sides sum to a constant across the
        dissolve; the layer also swells slightly as it goes, which reads as the
        cutouts passing the camera rather than simply switching off.

        It used to defocus instead — an animated blur from 0 to 10px, which
        separated the two layers by depth and looked better than this does. It
        was removed on measurement, not on taste. Animating a blur on a
        full-viewport layer means re-rasterising it every frame; profiled on a
        phone at DPR 3 that phase ran a 29.5ms mean frame with 196ms spikes,
        against 16.7ms during the video scrub. The seam was the slowest thing on
        a page whose whole selling point is that it moves smoothly.

        A transform and an opacity are the two properties a compositor can
        animate without touching the main thread, so this version is effectively
        free.
      */
      tl.to(
        ingredientLayer,
        { autoAlpha: 0, ease: "none", duration: dissolve },
        ACT.seamIn,
      );
      tl.to(
        ingredientLayer,
        { scale: 1.12, ease: "power2.out", duration: dissolve },
        ACT.seamIn,
      );
      items.forEach((el, index) => {
        const cutout = CUTOUTS[index];
        if (!cutout) return;
        // Everything drifts a little further in as it goes, so the layer is
        // still travelling throughout the dissolve.
        tl.to(
          el,
          {
            x: `${cutout.end.x * 0.8 * rosette}vmin`,
            y: `${cutout.end.y * 0.8 * rosette}vmin`,
            scale: index === 0 ? 1.04 : 1.08,
            ease: "power1.in",
            duration: dissolve,
          },
          ACT.seamIn,
        );
        // The outer four clear out early. The açaí cluster is the one cutout
        // that has a genuine counterpart in the incoming frame — it is the
        // constellation's core — so it is the last thing holding, and the
        // handoff happens on the element where the two sides actually agree.
        if (index > 0) {
          tl.to(
            el,
            { autoAlpha: 0, ease: "power2.in", duration: dissolve * 0.62 },
            ACT.seamIn,
          );
        }
      });

      // The video is pixel-identical to the still underneath it at t=0, so this
      // fade has nothing to reveal — it exists only to get a <video> on screen
      // before it needs to move.
      tl.to(film, { autoAlpha: 1, duration: 0.02 }, ACT.filmIn - 0.01);

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
      /*
        The photograph resolves out of blur as it arrives, meeting the defocus
        the film racks into. This is the one filter animation left in the act and
        it is affordable where the others were not: a single image, over 3% of
        the scroll, once — against five images animating continuously for a fifth
        of it. Measured after the change rather than assumed.
      */
      gsap.set(product, { filter: "blur(18px)" });
      tl.to(
        product,
        { autoAlpha: 1, ease: "power1.inOut", duration: 0.05 },
        ACT.productIn - 0.02,
      );
      tl.to(
        product,
        { filter: "blur(0px)", ease: "power2.out", duration: 0.055 },
        ACT.productIn - 0.005,
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

      return () => {
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
              src="/media/acai-story/real-acai-counter.webp"
              alt="A Nabil's açaí cup built at the counter — açaí swirl, granola, blueberries and strawberry, with drizzle being poured over the top."
              loading="lazy"
              decoding="async"
            />
            <span className={styles.productScrim} aria-hidden="true" />
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
