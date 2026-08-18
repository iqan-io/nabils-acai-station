"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The motion layer for the five inner routes.
 *
 * The homepage owns a pinned film; these pages do not, and they should not —
 * someone on `/menu` is scanning for a price and someone on `/locations` wants
 * an address. What they *were* missing is any sense of being the same website
 * as the homepage, because they had no motion at all: you left a page that
 * moved and arrived on five that were completely inert.
 *
 * So this is deliberately two effects and no more:
 *
 *   - `[data-parallax]`  the hero photograph drifts and scales a little slower
 *                        than the page. This is the one thing that makes a
 *                        static opening read as a shot rather than a banner.
 *   - `[data-reveal]`    a block's children rise and fade as it comes up. Same
 *                        curve, same stagger, same trigger point as the
 *                        homepage's sections, so the two halves of the site
 *                        move the same way.
 *
 * No smooth-scroll here. Easing the wheel on a page someone is scanning makes
 * the site feel slower, not more expensive — `useSmoothScroll` stays opt-in and
 * the homepage is the only thing that opts in.
 *
 * Renders nothing.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        // Scale first, then move. Without the scale the drift would expose the
        // edge of the image at one end of the travel.
        gsap.fromTo(
          el,
          { scale: 1.12, yPercent: -4 },
          {
            scale: 1.12,
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

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
    });

    return () => ctx.revert();
  }, []);

  return null;
}
