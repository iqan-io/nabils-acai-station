"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Page-scoped smooth scrolling, wired to ScrollTrigger.
 *
 * Lenis takes over the scroll position, so ScrollTrigger has to be told when it
 * moves — otherwise pinned sections drift a frame behind the content and the
 * whole page looks like it is made of loose parts. That handshake is the only
 * reason this is a shared hook instead of three copies of six lines.
 *
 * It is deliberately opt-in per route rather than installed in the root layout.
 * Smooth scroll is a real cost on a page that has nothing to choreograph, and
 * hijacking the wheel on `/menu` — where someone is scanning for a price —
 * makes the site feel slower, not more expensive.
 *
 * Two things it will not do:
 *   - run under `prefers-reduced-motion`, where easing the scroll is precisely
 *     the sensation the setting exists to remove;
 *   - survive unmount, so the other routes get native scrolling back.
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    /*
      0.8, not the 1.1 this shipped with.

      Lenis is one of three things that were smoothing the homepage film, and
      together they put the video most of a second behind the wheel. The other
      two are fixed in AcaiStory (one easing stage instead of two); this is the
      remaining one. 0.8 still reads as smooth scrolling — it stops reading as
      the page owing you scroll.
    */
    const lenis = new Lenis({ duration: 0.8, smoothWheel: true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Lenis is driven from GSAP's ticker rather than its own rAF loop so the
    // scroll position and every tween reading it advance in the same frame.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, [enabled]);
}
