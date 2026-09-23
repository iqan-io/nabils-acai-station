"use client";

import { useEffect } from "react";

/*
  The reference's panel stack, on the inner pages.

  In the recording, scrolling an inner page does not move the panels past each
  other: the current panel pins and the next one slides up over it. That is a
  `position: sticky` stack — but a fixed `top` is wrong for it. A panel taller
  than the viewport, pinned at 8px, would be covered by the next panel before
  its own bottom was ever on screen, and its last lines would never be seen.

  So each panel's pin point is `min(8px, viewportHeight - panelHeight - 8px)`:
  a short panel pins 8px from the top; a tall one scrolls normally until its
  BOTTOM is in view and only then pins, so every line is read before anything
  covers it. The values track resizes and content changes.

  With no JS, or with reduced motion, `top` is never set and `position: sticky`
  with `top: auto` does not stick — the panels are an ordinary column.
*/
export function PanelStack({
  selector = "[data-stack] > [data-panel]",
  belowNav = false,
}: {
  /** Which panels form the stack. */
  selector?: string;
  /** Pin under the nav bar (homepage) rather than 8px from the top (inner pages). */
  belowNav?: boolean;
}) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panels = [...document.querySelectorAll<HTMLElement>(selector)];
    // A single panel has nothing to slide over it; pinning it gains nothing.
    if (panels.length < 2) return;
    const apply = () => {
      const vh = window.innerHeight;
      // The homepage's panels pin under the solid nav bar: 112px on desktop,
      // 88px at 60rem and below, matching Station.module.css.
      const pin = belowNav ? (window.innerWidth <= 960 ? 88 : 112) : 8;
      panels.forEach((panel) => {
        panel.style.top = `${Math.min(pin, vh - panel.offsetHeight - 8)}px`;
      });
    };
    apply();
    const observer = new ResizeObserver(apply);
    panels.forEach((panel) => observer.observe(panel));
    window.addEventListener("resize", apply);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", apply);
      panels.forEach((panel) => panel.style.removeProperty("top"));
    };
  }, [selector, belowNav]);
  return null;
}
