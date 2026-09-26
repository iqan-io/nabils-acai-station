"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { menu, menuGroups, menuSlug } from "@/lib/brand";
import { stationGalleryFor, stationPhotoFor, type StationPhoto } from "@/lib/stationPhotos";
import { studioBlur } from "@/lib/studioBlur";
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

// useLayoutEffect on the client (runs before paint), useEffect on the server
// (where layout effects warn and never run anyway).
const useBeforePaint = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function indexFromHash(): number {
  const slug = decodeURIComponent(window.location.hash.slice(1));
  return slug ? menu.findIndex((section) => menuSlug(section.title) === slug) : -1;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function StationMenuBrowser() {
  const [active, setActive] = useState(0);
  // Rail transitions are held off until the first frame has painted, so the
  // arrival state never animates in from a wrong one.
  const [settled, setSettled] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const railRef = useRef<HTMLElement>(null);
  // The photograph fades in only when it REPLACES another one. Gating the fade
  // on a container attribute re-triggered it on the photo already on screen
  // the moment the attribute appeared — a fade-out-and-in just after arrival.
  const arrivalPhoto = useRef<string | null>(null);
  const [photoSwapped, setPhotoSwapped] = useState(false);

  /*
    Arriving from a homepage category link (/menu#classic-crepes) used to paint
    the FIRST category for ~130ms — "Açaí & Bowls" highlighted, the açaí photo
    requested — until the scroll-spy caught up, and then the highlight faded
    across to the right category. Reading the hash before paint means the very
    first frame already has the right category, rail and photograph.
  */
  useBeforePaint(() => {
    const index = indexFromHash();
    if (index >= 0) {
      setActive(index);
      // Land on the section ourselves, before paint. This used to be left to
      // Next's scroll-to-hash after a client navigation, which on short phones
      // (640-667px) sometimes did not scroll at all: "Açaí & Bowls" from the
      // homepage left the page 4,200px down, near Chocolate & Sweets. The
      // section's scroll-margin clears the nav and the sticky category strip.
      sectionRefs.current[index]?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)));
    const onHash = () => {
      const i = indexFromHash();
      if (i >= 0) setActive(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  /*
    Scroll-spy: the active section is the LAST one whose top has passed the
    middle of the viewport — or the last section of all once the page is
    scrolled to the bottom (short trailing sections never reach the middle).

    This replaced an IntersectionObserver band at 38-45% of the viewport. A
    category link lands its heading ~280px from the top, which on a 640-667px
    phone (iPhone SE) sat on the band's edge: the section ABOVE was still in
    the band, so the strip lit "Açaí & Bowls" over the Classic Crêpes heading.
    A single line at 50% is always below where a link lands, at any height.
  */
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = window.innerHeight * 0.5;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = 0;
      sectionRefs.current.forEach((el, index) => {
        if (el && el.getBoundingClientRect().top <= line) current = index;
      });
      if (atBottom) current = sectionRefs.current.length - 1;
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    // Arriving on a category link, the hash has already set the category (see
    // above) and the browser may not have scrolled to it yet: measuring now
    // would read the top of the page and flash the wrong category. Let the
    // first real scroll take over instead.
    if (indexFromHash() < 0) measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeGroup = rows[active]?.group ?? 0;

  // Keep the active pill visible in the horizontal rail on phones. Until the
  // arrival frame has settled, the strip JUMPS to the pill: the first pass runs
  // for the default category before the link's category is applied, so gating
  // on "first call" still let the real move glide visibly across the strip.
  useBeforePaint(() => {
    const pill = railRef.current?.querySelector<HTMLElement>(`[data-group="${activeGroup}"]`);
    if (pill && railRef.current && railRef.current.scrollWidth > railRef.current.clientWidth) {
      const behavior = settled && !prefersReducedMotion() ? "smooth" : "auto";
      railRef.current.scrollTo({ left: pill.offsetLeft - 16, behavior });
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

  useEffect(() => {
    if (!settled) return;
    if (arrivalPhoto.current === null) arrivalPhoto.current = photo.src;
    else if (photo.src !== arrivalPhoto.current) setPhotoSwapped(true);
  }, [settled, photo.src]);

  function goToGroup(group: number) {
    const first = rows.find((row) => row.group === group);
    const target = first ? sectionRefs.current[first.index] : null;
    if (!target) return;
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    setActive(first!.index);
    history.replaceState(null, "", `#${menuSlug(first!.title)}`);
  }

  return (
    <div className={styles.menuFrame} data-settled={settled || undefined}>
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
                  <Image
                    src={inline.src}
                    alt={inline.alt}
                    fill
                    sizes="(max-width: 73.75rem) 92vw, 1px"
                    placeholder={studioBlur[inline.src] ? "blur" : "empty"}
                    blurDataURL={studioBlur[inline.src]}
                  />
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
                      <Image
                        src={frame.src}
                        alt={frame.alt}
                        fill
                        sizes="(min-width: 74rem) 12vw, 30vw"
                        placeholder={studioBlur[frame.src] ? "blur" : "empty"}
                        blurDataURL={studioBlur[frame.src]}
                      />
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
            placeholder={studioBlur[photo.src] ? "blur" : "empty"}
            blurDataURL={studioBlur[photo.src]}
            className={photoSwapped ? styles.menuPhotoImg : undefined}
          />
        </div>
      </div>
    </div>
  );
}
