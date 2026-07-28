import Image from "next/image";
import Link from "next/link";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { brand, locations } from "@/lib/brand";

function shortAddress(full: string) {
  return full.replace(/\sWA\s?\d{4}.*$/i, "");
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--gold-highlight)]/20 bg-[var(--night-plum)] text-[var(--cream)]">
      <div aria-hidden className="night-grain pointer-events-none absolute inset-0 opacity-[0.035]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <a href="/" aria-label="Nabil's Açaí Station home" className="inline-flex items-center gap-4">
              <Image
                src="/images/logo-192.png"
                alt="Nabil's Açaí Station"
                width={76}
                height={76}
                unoptimized
                className="size-[4.75rem] object-contain"
              />
              <span>
                <span className="block font-display text-3xl italic leading-none">Nabil&apos;s</span>
                <span className="mt-2 block text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[var(--gold-highlight)]">
                  Açaí Station
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-md text-base leading-7 text-[var(--cream)]/68">
              Açaí, crêpes, Dubai chocolate and Lebanese sweets in Perth.
            </p>
            <p className="mt-2 font-display text-xl italic text-[var(--gold-highlight)]">
              {brand.tagline}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="night-label text-[var(--gold-highlight)]">Visit</p>
            <ul className="mt-5 space-y-5">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={`/locations#${location.slug}`}
                    className="font-display text-xl text-[var(--cream)] hover:text-[var(--gold-highlight)]"
                  >
                    {location.name}
                  </Link>
                  <p className="mt-1 max-w-xs text-sm leading-6 text-[var(--cream)]/58">
                    {shortAddress(location.address)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="night-label text-[var(--gold-highlight)]">Explore</p>
            <nav aria-label="Footer" className="mt-5 flex flex-col items-start gap-3 text-sm">
              <Link href="/menu" className="min-h-8 text-[var(--cream)]/72 hover:text-[var(--cream)]">Menu</Link>
              <Link href="/locations" className="min-h-8 text-[var(--cream)]/72 hover:text-[var(--cream)]">Locations</Link>
              <Link href="/about" className="min-h-8 text-[var(--cream)]/72 hover:text-[var(--cream)]">Our story</Link>
              <a href={brand.phoneHref} className="min-h-8 text-[var(--cream)]/72 hover:text-[var(--cream)]">
                {brand.phone}
              </a>
            </nav>
            <div className="mt-5 flex gap-3">
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--cream)]/20 transition-colors hover:border-[var(--gold-highlight)] hover:text-[var(--gold-highlight)]"
              >
                <BiLogoInstagram className="size-5" />
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--cream)]/20 transition-colors hover:border-[var(--gold-highlight)] hover:text-[var(--gold-highlight)]"
              >
                <BiLogoTiktok className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--cream)]/12 pt-6 text-xs text-[var(--cream)]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}.</p>
          <p>Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
