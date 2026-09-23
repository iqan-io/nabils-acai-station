"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { menu, menuGroups, menuSlug } from "@/lib/brand";
import { stationGalleryFor, stationPhotoFor, type StationPhoto } from "@/lib/stationPhotos";
import styles from "./StationPage.module.css";

/*
  The reference's menus page, as it actually behaves.

  The first version of this was thirteen tabs: click a category, see only that
  category. The recording does something different, and it is the thing that
  made the page read as the reference's: the whole menu is ONE long list, the
  rail on the left is a short list of five categories that follows your scroll
  (the filled cream pill moves from APPETIZERS to SIDE SOUP to SALADS as their
  items pass), and the photograph on the right changes to whatever is on
  screen. You read a menu; you do not operate one.

  So the rail is the five `menuGroups` rather than all thirteen sections — the
  reference's rail is five — and each group's sections run in sequence in the
  middle column. Every section keeps its own `id` (its slug), so the homepage's
  deep links and `/menu#acai-build-your-own` still land on the right heading.
*/

type Row = { index: number; title: string; group: number };

const rows: Row[] = menu.map((section, index) => ({
  index,
  title: section.title,
  group: Math.max(0, menuGroups.findIndex((g) => g.sections.includes(section.title))),
}));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function StationMenuBrowser() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const railRef = useRef<HTMLElement>(null);

  // Scroll-spy. A section is "on screen" when it crosses a band just above the
  // middle of the viewport, which is where the eye is while reading a list.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(Number((hit.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-38% 0px -55% 0px" },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeGroup = rows[active]?.group ?? 0;

  // Keep the active pill visible in the horizontal rail on phones.
  useEffect(() => {
    const pill = railRef.current?.querySelector<HTMLElement>(`[data-group="${activeGroup}"]`);
    if (pill && railRef.current && railRef.current.scrollWidth > railRef.current.clientWidth) {
      railRef.current.scrollTo({ left: pill.offsetLeft - 16, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [activeGroup]);

  // The photograph shown is the active section's; a section with none (matcha,
  // milkshakes) leaves the previous one up rather than showing a gap.
  const photo = useMemo(() => {
    for (let i = active; i >= 0; i -= 1) {
      const found = stationPhotoFor(menu[i].title);
      if (found) return found;
    }
    return stationPhotoFor(menu[0].title) as StationPhoto;
  }, [active]);

  function goToGroup(group: number) {
    const first = rows.find((row) => row.group === group);
    const target = first ? sectionRefs.current[first.index] : null;
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    setActive(first!.index);
    history.replaceState(null, "", `#${menuSlug(first!.title)}`);
  }

  return (
    <div className={styles.menuFrame}>
      <nav ref={railRef} className={styles.rail} aria-label="Menu categories">
        {menuGroups.map((group, index) => (
          <button
            key={group.label}
            type="button"
            data-group={index}
            aria-current={activeGroup === index ? "true" : undefined}
            onClick={() => goToGroup(index)}
          >
            {group.label}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </nav>

      <div className={styles.menuCopy}>
        <p className={styles.menuMeta}>Made to order · Prices in AUD</p>
        {rows.map((row) => {
          const section = menu[row.index];
          const inline = stationPhotoFor(section.title);
          return (
            <section
              key={section.title}
              id={menuSlug(section.title)}
              data-index={row.index}
              ref={(el) => {
                sectionRefs.current[row.index] = el;
              }}
              className={styles.menuSection}
              aria-labelledby={`${menuSlug(section.title)}-title`}
            >
              <h2 id={`${menuSlug(section.title)}-title`}>{section.title}</h2>
              {section.subtitle && <p className={styles.menuIntro}>{section.subtitle}</p>}
              {/* Phones have no photograph column, so each section carries its
                  own picture inline instead of losing the photography. */}
              {inline && (
                <div className={styles.sectionPhoto}>
                  <Image src={inline.src} alt={inline.alt} fill sizes="(max-width: 73.75rem) 92vw, 1px" />
                </div>
              )}
              <ul className={styles.prices}>
                {section.items.map((item) => (
                  <li key={item.name}>
                    <div className={styles.priceHead}>
                      <span>{item.name}</span>
                      {item.price && <span>{item.price}</span>}
                    </div>
                    {item.note && <p>{item.note}</p>}
                  </li>
                ))}
              </ul>
              {section.footnote && <p className={styles.footnote}>{section.footnote}</p>}
              {/* The açaí build strip the live menu showed under the footnote:
                  the "choose your drizzle" choice, photographed. */}
              {stationGalleryFor(section.title).length > 0 && (
                <ul className={styles.buildGallery} aria-label="Açaí builds">
                  {stationGalleryFor(section.title).map((frame) => (
                    <li key={frame.src}>
                      <Image src={frame.src} alt={frame.alt} fill sizes="(min-width: 74rem) 12vw, 30vw" />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className={styles.menuPhotoCol}>
        <div className={styles.menuPhoto}>
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 74rem) 34vw, 0px"
            quality={88}
            className={styles.menuPhotoImg}
          />
        </div>
      </div>
    </div>
  );
}
