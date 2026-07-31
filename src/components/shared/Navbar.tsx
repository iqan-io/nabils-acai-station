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
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#47206e] bg-white font-home-body text-[#32104f]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[80px] lg:px-10">
        <a href="/" aria-label="Nabil's Açaí Station home" className="group inline-flex min-h-11 items-center gap-3">
          <Image
            src="/images/logo-192.png"
            alt="Nabil's Açaí Station"
            width={56}
            height={56}
            priority
            unoptimized
            className="size-14 object-contain transition-transform duration-300 ease-out group-hover:scale-[1.03] lg:size-16"
          />
          <span className="font-home-display hidden text-[1.7rem] leading-none text-[#47206e] sm:block">
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
                className={`relative inline-flex min-h-11 items-center px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition-colors ${active ? "text-[#e12e3b]" : "text-[#32104f] hover:text-[#e12e3b]"}`}
              >
                {link.label}
                {active && <span className="absolute inset-x-4 bottom-1 h-px bg-[#e12e3b]" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/order"
            className="hidden min-h-11 items-center border border-[#47206e] bg-[#47206e] px-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-[#e12e3b] hover:bg-[#e12e3b] sm:inline-flex"
          >
            Order
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="relative inline-flex size-11 items-center justify-center border border-[#47206e] text-[#47206e] md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-200 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
            <span aria-hidden className={`absolute h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`} />
            <span aria-hidden className={`absolute h-px w-5 bg-current transition-transform duration-200 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile primary" className="border-t border-[#47206e] bg-white px-4 pb-5 pt-3 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col">
            {links.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between border-b border-[#47206e]/20 px-2 font-home-display text-2xl ${active ? "text-[#e12e3b]" : "text-[#47206e]"}`}
                >
                  {link.label}
                  <span aria-hidden className="font-home-body text-sm text-[#e12e3b]">→</span>
                </Link>
              );
            })}
            <Link
              href="/order"
              className="mt-5 inline-flex min-h-12 items-center justify-center bg-[#47206e] px-6 text-xs font-bold uppercase tracking-[0.18em] text-white"
            >
              Order options
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
