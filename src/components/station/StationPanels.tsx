import Image from "next/image";
import type { ReactNode } from "react";
import { PanelStack } from "./PanelStack";
import styles from "./StationPage.module.css";

/*
  The reference's page grammar as four primitives. Every route but `/` is
  composed from these, so the panel radius, the cream hairline, the 8px inset
  and the nav clearance are defined once and cannot drift between pages — which
  is exactly how the site ended up with two design systems the first time.
*/

/** The black ground every non-home route sits on. */
export function StationPage({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page} data-stack>
      {children}
      <PanelStack />
    </div>
  );
}

/**
 * One outlined, large-radius panel. `opening` marks the first panel of a route:
 * its copy is padded clear of the nav, which rides over it.
 */
export function Panel({
  children,
  opening = false,
  id,
  labelledBy,
  className = "",
}: {
  children: ReactNode;
  opening?: boolean;
  id?: string;
  labelledBy?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-panel
      className={`${styles.panel} ${opening ? styles.opening : ""} ${className}`}
    >
      {children}
    </section>
  );
}

/** Ordinary section padding inside a panel. */
export function PanelBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
}

/**
 * Copy on one side, a photograph bleeding to the panel's own rounded edge on
 * the other. `flip` puts the photograph on the left at desktop widths without
 * reordering the markup, so the reading order stays correct.
 */
export function PanelSplit({
  children,
  flip = false,
  wide = false,
}: {
  children: ReactNode;
  flip?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`${styles.split} ${wide ? styles.splitWide : ""} ${
        flip ? styles.splitFlip : ""
      }`}
    >
      {children}
    </div>
  );
}

/**
 * The photograph half of a split panel.
 *
 * `contain` exists because most of Nabil's product and storefront photography
 * is portrait: cropping a portrait frame into a landscape half is what once
 * cut the açaí bowl in half, so a portrait source is contained on cream rather
 * than covered. See PROGRESS.md, 2026-08-16.
 */
export function PanelMedia({
  src,
  alt,
  caption,
  contain = false,
  priority = false,
  objectPosition,
  imgClassName,
  // Two columns from 44rem (700px) up, but a tall panel (hours, long copy)
  // crops its photo by HEIGHT, so it can need well over half the viewport in
  // file pixels — hence 75vw, capped by the file's own width. On phones the
  // photo is a 4:5 portrait box, so a LANDSCAPE source is cover-cropped to
  // roughly half its width and needs ~1.6x the viewport in file pixels to stay
  // sharp; the file's own width caps what is served, so portrait sources cost
  // no more.
  sizes = "(min-width: 44rem) 75vw, 160vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  contain?: boolean;
  priority?: boolean;
  /** Where to hold the crop when covering — e.g. "50% 22%" to keep a face. */
  objectPosition?: string;
  /** For a crop that has to change per breakpoint (defined in the CSS module). */
  imgClassName?: string;
  sizes?: string;
}) {
  return (
    <div className={`${styles.media} ${contain ? styles.mediaContain : ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={90}
        priority={priority}
        className={imgClassName}
        style={objectPosition ? { objectPosition } : undefined}
      />
      {caption && <span className={styles.mediaCaption}>{caption}</span>}
    </div>
  );
}

export { styles as stationStyles };
