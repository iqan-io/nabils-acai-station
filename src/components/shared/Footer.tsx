import Image from "next/image";
import Link from "next/link";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { brand, locations } from "@/lib/brand";

function shortAddress(full: string) {
  return full.replace(/\sWA\s?\d{4}.*$/i, "");
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--ds-night)] font-home-body text-[var(--ds-ink-invert)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[rgb(217_164_65_/_0.45)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <a href="/" aria-label="Nabil's Açaí Station home" className="inline-flex items-center gap-4">
              <Image
                src="/brand/logo-round.png"
                alt="Nabil's Açaí Station"
                width={1024}
                height={1024}
                className="size-24 object-contain"
              />
              <span>
                <span className="font-home-display block text-4xl leading-none">Nabil&apos;s</span>
                <span className="mt-1 block text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[var(--ds-honey-light)]">
                  Açaí Station · Perth
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-md text-base leading-7 text-[rgb(var(--ds-ink-invert-rgb)/0.72)]">
              Açaí, crêpes, Dubai chocolate and Lebanese sweets in Perth.
            </p>
            <p className="mt-2 text-xl font-bold text-[var(--ds-honey-light)]">
              {brand.tagline}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--ds-honey-light)]">Visit</p>
            <ul className="mt-5 space-y-5">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={`/locations#${location.slug}`}
                    className="font-home-display text-2xl text-[var(--ds-ink-invert)] transition-colors hover:text-[var(--ds-honey-light)]"
                  >
                    {location.name}
                  </Link>
                  <p className="mt-1 max-w-xs text-sm leading-6 text-[rgb(var(--ds-ink-invert-rgb)/0.62)]">
                    {shortAddress(location.address)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--ds-honey-light)]">Explore</p>
            <nav aria-label="Footer" className="mt-5 flex flex-col items-start gap-3 text-sm">
              <Link href="/menu" className="min-h-8 text-[rgb(var(--ds-ink-invert-rgb)/0.72)] transition-colors hover:text-[var(--ds-honey-light)]">Menu</Link>
              <Link href="/locations" className="min-h-8 text-[rgb(var(--ds-ink-invert-rgb)/0.72)] transition-colors hover:text-[var(--ds-honey-light)]">Locations</Link>
              <Link href="/about" className="min-h-8 text-[rgb(var(--ds-ink-invert-rgb)/0.72)] transition-colors hover:text-[var(--ds-honey-light)]">Our story</Link>
              <Link href="/order" className="min-h-8 text-[rgb(var(--ds-ink-invert-rgb)/0.72)] transition-colors hover:text-[var(--ds-honey-light)]">Order</Link>
              <Link href="/specials" className="min-h-8 text-[rgb(var(--ds-ink-invert-rgb)/0.72)] transition-colors hover:text-[var(--ds-honey-light)]">Specials</Link>
              <a href={brand.phoneHref} className="min-h-8 text-[rgb(var(--ds-ink-invert-rgb)/0.72)] transition-colors hover:text-[var(--ds-honey-light)]">
                {brand.phone}
              </a>
            </nav>
            <div className="mt-5 flex gap-3">
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-11 items-center justify-center rounded-full border border-[rgb(var(--ds-ink-invert-rgb)/0.25)] transition-colors hover:border-[var(--ds-honey)] hover:bg-[var(--ds-honey)] hover:text-[var(--ds-night)]"
              >
                <BiLogoInstagram className="size-5" />
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-11 items-center justify-center rounded-full border border-[rgb(var(--ds-ink-invert-rgb)/0.25)] transition-colors hover:border-[var(--ds-honey)] hover:bg-[var(--ds-honey)] hover:text-[var(--ds-night)]"
              >
                <BiLogoTiktok className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[rgb(var(--ds-ink-invert-rgb)/0.12)] pt-6 text-xs text-[rgb(var(--ds-ink-invert-rgb)/0.52)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}.</p>
          <p>Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
