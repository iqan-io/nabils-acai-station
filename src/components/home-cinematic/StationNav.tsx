"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Station.module.css";

/*
  The reference's navigation, now the site's only navigation.

  It was written for the homepage, where the four primary links are in-page
  anchors into the homepage (`#home-title`, `#find-title`). Off the
  homepage those anchors point at nothing, so the same labels resolve to the
  routes that hold the same content. That is the whole reason this component
  is path-aware: one bar, one look, links that work on every page.
*/

const HOME_LINKS = [
  { href: "#home-title", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/order", label: "Order", order: true },
  { href: "#find-title", label: "Find us" },
] as const;

const ROUTE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our story" },
  { href: "/order", label: "Order", order: true },
  { href: "/locations", label: "Find us" },
] as const;

const DROPDOWN = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "Our story" },
  { href: "/locations", label: "Locations" },
  { href: "/specials", label: "Specials" },
  { href: "/order", label: "Order delivery ↗" },
] as const;

export function StationNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  const links = isHome ? HOME_LINKS : ROUTE_LINKS;
  // "Desserts & drinks" is the reference's FOOD & DRINKS: it goes to the menu
  // page from everywhere, the homepage included, now that the homepage no
  // longer carries its own menu browser.
  const lineupHref = "/menu";

  return (
    <header ref={root} className={`${styles.nav} ${scrolled || open ? styles.navSolid : ""}`}>
      <a href="/" aria-label="Nabil's Açaí Station home" className={styles.logo}>
        <Image src="/brand/logo-round.png" alt="Nabil's Açaí Station" width={120} height={120} priority />
      </a>
      <nav className={styles.navLinks} aria-label="Primary">
        {links.map((link) => {
          const current = link.href.startsWith("#")
            ? link.label === "Home"
            : link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          const className = "order" in link && link.order ? styles.navOrder : undefined;
          // In-page anchors must stay plain `<a>`; the router would treat them
          // as a navigation and lose the smooth scroll the film depends on.
          return link.href.startsWith("#") ? (
            <a key={link.href} href={link.href} className={className} aria-current={current ? "page" : undefined}>
              {link.label}
            </a>
          ) : (
            <Link key={link.href} href={link.href} className={className} aria-current={current ? "page" : undefined}>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.navActions}>
        <Link href={lineupHref} className={styles.pill}>
          Desserts &amp; drinks
        </Link>
        <button
          ref={toggle}
          type="button"
          className={styles.navToggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="station-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav id="station-navigation" aria-label="Mobile primary" className={styles.navDropdown}>
          {DROPDOWN.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
