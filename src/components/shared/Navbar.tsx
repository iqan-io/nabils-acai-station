"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "Our story" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#F2C879]/20 bg-[#160B18]/95 text-[var(--cream)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[80px] lg:px-10">
        <a
          href="/"
          aria-label="Nabil's Açaí Station home"
          className="group inline-flex min-h-11 items-center gap-3"
        >
          <Image
            src="/images/logo-192.png"
            alt="Nabil's Açaí Station"
            width={56}
            height={56}
            priority
            unoptimized
            className="size-12 object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] lg:size-14"
          />
          <span className="hidden sm:block">
            <span className="block font-display text-[1.2rem] italic leading-none text-[var(--cream)]">
              Nabil&apos;s
            </span>
            <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.25em] text-[var(--gold-highlight)]">
              Açaí Station
            </span>
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
                    ? "text-[var(--gold-highlight)]"
                    : "text-[var(--cream)]/78 hover:text-[var(--gold-highlight)]"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-4 bottom-1 h-px bg-[var(--gold-highlight)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={brand.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-11 items-center rounded-full bg-[var(--honey)] px-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--night-plum)] transition-colors hover:bg-[var(--gold-highlight)] sm:inline-flex"
          >
            Order
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="relative inline-flex size-11 items-center justify-center rounded-full border border-[var(--cream)]/20 text-[var(--cream)] md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-transform duration-200 ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-current transition-transform duration-200 ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile primary"
          className="border-t border-[var(--cream)]/12 bg-[var(--night-plum)] px-4 pb-5 pt-3 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between border-b border-[var(--cream)]/10 px-2 font-display text-2xl ${
                    active
                      ? "italic text-[var(--gold-highlight)]"
                      : "text-[var(--cream)]"
                  }`}
                >
                  {link.label}
                  <span aria-hidden className="font-sans text-sm text-[var(--honey)]">
                    →
                  </span>
                </Link>
              );
            })}
            <a
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--honey)] px-6 text-xs font-bold uppercase tracking-[0.18em] text-[var(--night-plum)]"
            >
              Order on Uber Eats
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
