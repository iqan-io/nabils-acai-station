"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Wordmark";
import { brand, menuGroups, menuSlug } from "@/lib/brand";
import { scrollToMenuSection, slugFromHref } from "@/lib/menuScroll";

type NavLink = { href: string; label: string };

// Plain links sit to the right of the Menu dropdown.
const links: NavLink[] = [
  { href: "/specials", label: "Specials" },
  { href: "/locations", label: "Locations" },
];

// Build dropdown jump-links from the shared grouping. Each href points at an
// anchor that already exists on /menu (see MenuFull / menuSlug).
const menuDropdown = menuGroups.map((group) => ({
  label: group.label,
  items: group.sections.map((title) => ({
    label: title,
    href: `/menu#${menuSlug(title)}`,
  })),
}));

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false);
  const pathname = usePathname();

  // Close the desktop dropdown on Escape for keyboard users.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const menuActive = pathname.startsWith("/menu");

  // When already on the menu page, Next updates the URL via pushState (no scroll,
  // no hashchange), so jump to the section ourselves. Off the menu page we let
  // the link navigate and CategoryNav handles the scroll on arrival.
  const handleJump = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!menuActive) return;
    const slug = slugFromHref(href);
    if (!slug) return;
    e.preventDefault();
    window.history.pushState(null, "", `#${slug}`);
    // The mobile sheet collapses the header height on close, shifting the whole
    // page mid-scroll — so wait for that animation before scrolling. The desktop
    // dropdown is absolutely positioned and shifts nothing, so it scrolls now.
    if (open) {
      window.setTimeout(() => scrollToMenuSection(slug), 320);
    } else {
      scrollToMenuSection(slug);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--acai)]/15 bg-[var(--cream)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10 lg:py-5">
        <div className="flex items-center gap-5">
          <Wordmark size="md" />
          {/* Live open indicator */}
          <div className="hidden items-center gap-1.5 rounded-full bg-[var(--cream-warm)] px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[var(--acai-deep)] md:inline-flex">
            <span className="relative inline-flex">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[var(--cedar)] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--cedar)]" />
            </span>
            Open · till 11
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Menu dropdown — opens on hover and on keyboard focus within. */}
          <div
            className="relative"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
            onFocus={() => setMenuOpen(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setMenuOpen(false);
              }
            }}
          >
            <Link
              href="/menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className={`relative inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                menuOpen || menuActive
                  ? "border-[var(--acai)]/25 bg-[var(--cream-warm)] text-[var(--acai)]"
                  : "border-transparent text-[var(--acai-deep)] hover:border-[var(--acai)]/20 hover:bg-[var(--cream-warm)] hover:text-[var(--acai)]"
              }`}
            >
              Menu
              <motion.svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ rotate: menuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="size-3.5"
              >
                <path d="m6 9 6 6 6-6" />
              </motion.svg>
              {menuActive && (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--saffron)]"
                />
              )}
            </Link>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full pt-3"
                >
                  <div className="w-[34rem] rounded-3xl border border-[var(--acai)]/15 bg-[var(--cream)] p-5 shadow-[0_28px_60px_-32px_rgba(31,11,37,0.55)]">
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      {menuDropdown.map((group) => (
                        <div key={group.label}>
                          <p className="px-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--acai)]/55">
                            {group.label}
                          </p>
                          <ul className="mt-1.5">
                            {group.items.map((item) => (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  scroll={false}
                                  onClick={(e) => {
                                    setMenuOpen(false);
                                    handleJump(e, item.href);
                                  }}
                                  className="block rounded-xl px-2 py-1.5 text-sm font-medium text-[var(--acai-deep)] transition-colors hover:bg-[var(--cream-warm)] hover:text-[var(--acai)]"
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/menu"
                      onClick={() => setMenuOpen(false)}
                      className="mt-3 flex items-center justify-between rounded-2xl border-t border-[var(--acai)]/10 px-2 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--acai)] hover:text-[var(--acai-deep)]"
                    >
                      View the full menu
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--acai)]"
                    : "text-[var(--acai-deep)] hover:text-[var(--acai)]"
                }`}
              >
                {link.label}
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--saffron)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={brand.phoneHref}
            className="hidden rounded-full border border-[var(--acai)]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--acai)] hover:bg-[var(--cream-warm)] sm:inline-flex"
          >
            Call
          </a>
          <Link
            href="/order"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--saffron)] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--acai-deep)] shadow-[0_8px_20px_-8px_rgba(255,183,64,0.7)] ring-1 ring-[var(--acai)]/10 transition-all hover:-translate-y-0.5 hover:bg-[var(--cream)]"
          >
            Order
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <button
            className="-mr-1 flex size-10 flex-col items-center justify-center lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-[var(--acai-deep)]"
              animate={open ? "open" : "closed"}
              variants={{
                open: { rotate: 45, translateY: 4 },
                closed: { rotate: 0, translateY: 0 },
              }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-[var(--acai-deep)]"
              animate={open ? "open" : "closed"}
              variants={{ open: { opacity: 0 }, closed: { opacity: 1 } }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="my-[3px] h-0.5 w-6 bg-[var(--acai-deep)]"
              animate={open ? "open" : "closed"}
              variants={{
                open: { rotate: -45, translateY: -4 },
                closed: { rotate: 0, translateY: 0 },
              }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--acai)]/15 bg-[var(--cream)] lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-5">
              {/* Menu accordion — tap the chevron to reveal sections, tap the
                  label to open the full menu page. */}
              <div className="rounded-2xl">
                <div className="flex items-stretch">
                  <Link
                    href="/menu"
                    onClick={() => setOpen(false)}
                    className={`flex-1 rounded-2xl px-4 py-3 text-base font-medium ${
                      menuActive
                        ? "bg-[var(--cream-warm)] text-[var(--acai)]"
                        : "text-[var(--acai-deep)] hover:bg-[var(--cream-warm)]"
                    }`}
                  >
                    Menu
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuExpanded((v) => !v)}
                    aria-label="Toggle menu sections"
                    aria-expanded={mobileMenuExpanded}
                    className="flex w-12 items-center justify-center rounded-2xl text-[var(--acai-deep)] hover:bg-[var(--cream-warm)]"
                  >
                    <motion.svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={{ rotate: mobileMenuExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="size-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </motion.svg>
                  </button>
                </div>

                <AnimatePresence>
                  {mobileMenuExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 px-4 pb-3 pt-1">
                        {menuDropdown.map((group) => (
                          <div key={group.label}>
                            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--acai)]/55">
                              {group.label}
                            </p>
                            <ul className="mt-1">
                              {group.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    scroll={false}
                                    onClick={(e) => {
                                      setOpen(false);
                                      setMobileMenuExpanded(false);
                                      handleJump(e, item.href);
                                    }}
                                    className="block rounded-xl py-2 text-[0.95rem] font-medium text-[var(--acai-deep)] hover:text-[var(--acai)]"
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-base font-medium ${
                      active
                        ? "bg-[var(--cream-warm)] text-[var(--acai)]"
                        : "text-[var(--acai-deep)] hover:bg-[var(--cream-warm)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href={brand.phoneHref}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-[var(--acai-deep)] hover:bg-[var(--cream-warm)]"
              >
                Call {brand.phone}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
