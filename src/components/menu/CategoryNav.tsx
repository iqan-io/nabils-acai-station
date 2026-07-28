"use client";

import { useCallback, useEffect, useState } from "react";
import { menuGroups, menuSlug } from "@/lib/brand";
import { scrollToMenuSection, visibleMenuSection } from "@/lib/menuScroll";

// One chip per group; clicking jumps to the group's first section. The chip
// highlights while any section in that group is the one you're reading.
const categories = menuGroups.map((group) => ({
  label: group.label,
  ids: group.sections.map(menuSlug),
  target: menuSlug(group.sections[0]),
}));

export function CategoryNav() {
  const [active, setActive] = useState(categories[0]?.label ?? "");

  const scrollToSlug = useCallback((slug: string) => {
    scrollToMenuSection(slug);
  }, []);

  // Scroll-spy: highlight the chip for the last section scrolled past the line
  // just below the sticky bars. A plain scroll pass is more predictable than an
  // observer for the 2-column desktop layout, where groups sit side-by-side.
  useEffect(() => {
    const slugToLabel = new Map<string, string>();
    categories.forEach((c) =>
      c.ids.forEach((id) => slugToLabel.set(id, c.label)),
    );
    const slugs = categories.flatMap((c) => c.ids);

    // Sticky header (~70-78px) + this bar (~52px); flip the chip once a section
    // crosses just under them rather than when it first peeks in at the bottom.
    const LINE = 150;
    let raf = 0;

    const compute = () => {
      raf = 0;
      let currentSlug = slugs[0];
      let bestTop = -Infinity;
      for (const slug of slugs) {
        const el = visibleMenuSection(slug);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= LINE && top > bestTop) {
          bestTop = top;
          currentSlug = slug;
        }
      }
      const label = slugToLabel.get(currentSlug);
      if (label) setActive(label);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Handle links that arrive with a hash (e.g. the navbar Menu dropdown from
  // another page) and same-page hash changes — native scrolling targets the
  // hidden desktop copy on mobile, so we re-resolve to the visible one.
  useEffect(() => {
    const fromHash = () => {
      const slug = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (slug) scrollToSlug(slug);
    };
    // Defer the initial pass so images/layout settle before measuring.
    const t = window.setTimeout(fromHash, 120);
    window.addEventListener("hashchange", fromHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [scrollToSlug]);

  const onChipClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    target: string,
  ) => {
    e.preventDefault();
    setActive(label);
    window.history.pushState(null, "", `#${target}`);
    scrollToSlug(target);
  };

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[72px] z-30 border-y border-[var(--gold-highlight)]/18 bg-[var(--deep-plum)]/95 text-[var(--cream)] backdrop-blur-md lg:top-[80px]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto py-3">
          {categories.map((c) => {
            const isActive = active === c.label;
            return (
              <li key={c.label}>
                <a
                  href={`#${c.target}`}
                  onClick={(e) => onChipClick(e, c.label, c.target)}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full border px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    isActive
                      ? "border-[var(--honey)] bg-[var(--honey)] text-[var(--night-plum)]"
                      : "border-[var(--cream)]/16 text-[var(--cream)]/72 hover:border-[var(--gold-highlight)]/55 hover:text-[var(--gold-highlight)]"
                  }`}
                >
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
