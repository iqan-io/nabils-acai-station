import Link from "next/link";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { Wordmark } from "./Wordmark";
import { brand, locations } from "@/lib/brand";

function shortAddress(full: string) {
  return full
    .replace(/\sWA\s?\d{4}.*$/i, "")
    .replace(/^Inside\s/i, "Inside ");
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--acai-deep)] text-[var(--cream)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-sunburst-acai opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-20 md:pb-12 md:pt-24 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <div className="text-[var(--cream)]">
              <Wordmark size="lg" tone="light" asLink={false} />
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--lavender)]">
              A Lebanese sweets family in Perth, doing açaí, crêpes and Dubai
              chocolate. Made for sweet moments.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--cream)]/20 transition-colors hover:bg-[var(--cream)]/10"
              >
                <BiLogoInstagram className="size-5" />
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--cream)]/20 transition-colors hover:bg-[var(--cream)]/10"
              >
                <BiLogoTiktok className="size-5" />
              </a>
              <a
                href={brand.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--cream)]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[var(--cream)]/10"
              >
                Call {brand.phone}
              </a>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--saffron)]">
              Visit
            </div>
            <ul className="mt-3 space-y-2.5 text-sm text-[var(--lavender)]">
              {locations.map((loc) => (
                <li key={loc.slug} className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold text-[var(--cream)]">{loc.name}</span>
                  <span className="text-[var(--lavender)]/80">— {shortAddress(loc.address)}</span>
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--honey)] hover:underline underline-offset-4"
                  >
                    Maps →
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/locations"
              className="mt-4 inline-block text-xs uppercase tracking-[0.22em] text-[var(--honey)]/90 hover:text-[var(--honey)] hover:underline underline-offset-4"
            >
              All hours & info →
            </Link>
          </div>

          <div className="md:col-span-2">
            <div className="text-[0.7rem] uppercase tracking-[0.28em] text-[var(--saffron)]">
              Site
            </div>
            <ul className="mt-3 space-y-2 text-sm text-[var(--lavender)]">
              <li>
                <Link href="/menu" className="hover:text-[var(--cream)]">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/specials" className="hover:text-[var(--cream)]">
                  Specials
                </Link>
              </li>
              <li>
                <Link href="/locations" className="hover:text-[var(--cream)]">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--cream)]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-[var(--cream)]">
                  Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[var(--cream)]/15 pt-6 text-xs text-[var(--lavender)]/70 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} {brand.name}. Made in Perth.
          </p>
          <p className="italic font-display text-sm text-[var(--honey)]">
            Made for sweet moments.
          </p>
        </div>
      </div>
    </footer>
  );
}
