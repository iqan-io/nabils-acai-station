"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brandAssets } from "@/lib/brandAssets";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "Our story" },
  { href: "/specials", label: "Specials" },
] as const;

/**
 * Site chrome in "The Counter" system: quiet near-white bar, sentence-case
 * links, grape reserved for the current page and the primary action. The old
 * bar shouted in tracked uppercase and competed with the page beneath it.
 */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(20,17,24,0.12)] bg-[rgba(251,250,246,0.92)] backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-5 lg:h-[76px] lg:px-8">
        <Link
          href="/"
          aria-label="Nabil's Açaí Station home"
          className="group inline-flex min-h-11 items-center gap-3"
        >
          <Image
            src={brandAssets.mascotMark}
            alt=""
            width={42}
            height={46}
            priority
            className="h-12 w-auto object-contain sm:hidden"
          />
          <Image
            src={brandAssets.horizontalLogo}
            alt=""
            width={174}
            height={70}
            priority
            className="hidden h-[3.25rem] w-auto object-contain sm:block lg:h-14"
          />
          <span
            className="sr-only"
          >
            Nabil&apos;s Açaí Station
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
          style={{ fontFamily: "var(--font-counter-body)" }}
        >
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-lg px-3.5 text-[0.92rem] transition-colors ${
                  active
                    ? "bg-[#f1e9f8] font-bold text-[#5a2a86]"
                    : "text-[rgba(20,17,24,0.66)] hover:text-[#141118]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="flex items-center gap-2"
          style={{ fontFamily: "var(--font-counter-body)" }}
        >
          {/* Visible at every width — on mobile this is the primary conversion
              action and must not sit behind the hamburger. */}
          <Link
            href="/order"
            className="inline-flex min-h-11 items-center rounded-lg bg-[#141118] px-4 text-[0.88rem] font-bold text-white transition-colors hover:bg-[#5a2a86]"
          >
            Order<span className="hidden sm:inline">&nbsp;delivery</span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="relative inline-flex size-11 items-center justify-center rounded-lg border border-[rgba(20,17,24,0.18)] text-[#141118] md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden
              className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-200 ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-[1.5px] w-5 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-200 ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile primary"
          className="border-t border-[rgba(20,17,24,0.12)] bg-[#fbfaf6] px-5 pb-5 pt-2 md:hidden"
          style={{ fontFamily: "var(--font-counter-body)" }}
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between border-b border-[rgba(20,17,24,0.1)] text-[1.05rem] ${
                    active ? "font-bold text-[#5a2a86]" : "text-[#141118]"
                  }`}
                >
                  {link.label}
                  <span aria-hidden className="text-sm text-[rgba(20,17,24,0.4)]">
                    →
                  </span>
                </Link>
              );
            })}
            <Link
              href="/order"
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#141118] px-6 text-[0.92rem] font-bold text-white"
            >
              Order delivery
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
