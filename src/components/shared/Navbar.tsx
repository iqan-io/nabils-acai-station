"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "Our story" },
  { href: "/specials", label: "Specials" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  // The homepage opens on a full-bleed dark frame, so the bar rides over it
  // transparently and only takes a ground once you scroll off the hero.
  // Every other route keeps the solid bar from the first pixel.
  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) {
      setAtTop(false);
      return;
    }
    const onScroll = () => setAtTop(window.scrollY < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // An open mobile menu always needs the solid ground behind it to stay legible.
  const overFilm = isHome && atTop && !open;

  /*
    The ground the scrolled bar takes, and why the homepage gets a different one.

    Everywhere else the bar goes cream, which is right over cream pages. The
    homepage spends 460vh inside a true-black cinematic section, and a cream bar
    lying across that draws a hard horizontal edge over the top of the film —
    the single most expensive thing you can do to an effect whose whole premise
    is that there is no visible frame. So on `/` the scrolled bar takes the
    night ground instead. It still reads as a solid bar over the paper sections
    further down; it just stops cutting the film in half.
  */
  const scrolledGround = isHome
    ? "border-b border-[rgb(var(--ds-ink-invert-rgb)/0.12)] bg-[rgb(var(--ds-night-rgb)/0.82)] text-[var(--ds-ink-invert)] backdrop-blur"
    : "border-b border-[rgb(var(--ds-ink-rgb)/0.1)] bg-[rgb(var(--ds-paper-rgb)/0.95)] text-[var(--ds-ink)] backdrop-blur";

  // Whether the bar's contents are drawn light-on-dark. True over the hero, and
  // still true once scrolled on the homepage — unlike `overFilm`, which is only
  // about transparency.
  const onDark = isHome ? !open : false;

  return (
    <header
      className={`z-40 font-home-body transition-colors duration-300 ${
        // A sticky bar reserves layout height, which would push the homepage film
        // down by 80px and break the full-bleed opening shot. On `/` the bar is
        // taken out of flow so the film starts at the very top of the viewport.
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0"
      } ${
        overFilm
          ? "border-b border-transparent bg-transparent text-[var(--ds-ink-invert)]"
          : scrolledGround
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[80px] lg:px-10">
        <a href="/" aria-label="Nabil's Açaí Station home" className="group inline-flex min-h-11 items-center gap-3">
          {/* One round badge serves every logo slot on the site. It is square
              and self-contained, so it needs no cropping and its circle reads
              as the brand even at bar height, where interior detail cannot. */}
          <Image
            src="/brand/logo-round.png"
            alt="Nabil's Açaí Station"
            width={1024}
            height={1024}
            priority
            className="size-14 object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] lg:size-16"
          />
          <span
            className={`font-home-display hidden text-[1.7rem] leading-none sm:block ${
              onDark ? "text-[var(--ds-ink-invert)]" : "text-[var(--ds-ink)]"
            }`}
          >
            Nabil&apos;s Açaí Station
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-11 items-center px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? onDark
                      ? "text-[var(--ds-honey-light)]"
                      : "text-[var(--ds-honey-deep)]"
                    : onDark
                      ? "text-[rgb(var(--ds-ink-invert-rgb)/0.72)] hover:text-[var(--ds-honey-light)]"
                      : "text-[rgb(var(--ds-ink-rgb)/0.62)] hover:text-[var(--ds-honey-deep)]"
                }`}
              >
                {link.label}
                {active && <span className={`absolute inset-x-4 bottom-1 h-px ${onDark ? "bg-[var(--ds-honey-light)]" : "bg-[var(--ds-honey-deep)]"}`} />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/order"
            className={`hidden min-h-11 items-center rounded-full px-6 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-colors sm:inline-flex ${
              onDark
                ? "bg-[var(--ds-honey)] text-[var(--ds-night)] hover:bg-[var(--ds-honey-light)]"
                : "bg-[var(--ds-night)] text-[var(--ds-ink-invert)] hover:bg-[var(--ds-honey)] hover:text-[var(--ds-night)]"
            }`}
          >
            Order
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className={`relative inline-flex size-11 items-center justify-center rounded-full border md:hidden ${
              onDark
                ? "border-[rgb(var(--ds-ink-invert-rgb)/0.45)] text-[var(--ds-ink-invert)]"
                : "border-[rgb(var(--ds-ink-rgb)/0.25)] text-[var(--ds-ink)]"
            }`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-200 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span aria-hidden className={`absolute h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-200 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile primary" className="border-t border-[rgb(var(--ds-ink-rgb)/0.1)] bg-[var(--ds-paper)] px-4 pb-5 pt-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between border-b border-[rgb(var(--ds-ink-rgb)/0.1)] px-2 font-home-display text-2xl ${active ? "text-[var(--ds-honey-deep)]" : "text-[var(--ds-ink)]"}`}
                >
                  {link.label}
                  <span aria-hidden className="font-home-body text-sm text-[var(--ds-honey-deep)]">→</span>
                </Link>
              );
            })}
            <Link
              href="/order"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--ds-night)] px-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ds-ink-invert)]"
            >
              Order options
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
