import Image from "next/image";
import Link from "next/link";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { brand, locations } from "@/lib/brand";

function shortAddress(full: string) {
  return full.replace(/\sWA\s?\d{4}.*$/i, "");
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#f3c52f] bg-[#47206e] font-home-body text-white">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[#f3c52f]" />
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
                <span className="font-home-display block text-4xl leading-none">Nabil&apos;s</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#c4dc67]">
                  Açaí Station · Perth
                </span>
              </span>
            </a>
            <p className="mt-6 max-w-md text-base leading-7 text-white/78">
              Açaí, crêpes, Dubai chocolate and Lebanese sweets in Perth.
            </p>
            <p className="mt-2 text-xl font-bold text-[#f3c52f]">
              {brand.tagline}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#c4dc67]">Visit</p>
            <ul className="mt-5 space-y-5">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={`/locations#${location.slug}`}
                    className="font-home-display text-3xl text-white hover:text-[#f3c52f]"
                  >
                    {location.name}
                  </Link>
                  <p className="mt-1 max-w-xs text-sm leading-6 text-white/68">
                    {shortAddress(location.address)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-sm font-bold uppercase tracking-[0.1em] text-[#c4dc67]">Explore</p>
            <nav aria-label="Footer" className="mt-5 flex flex-col items-start gap-3 text-sm">
              <Link href="/menu" className="min-h-8 text-white/78 hover:text-[#f3c52f]">Menu</Link>
              <Link href="/locations" className="min-h-8 text-white/78 hover:text-[#f3c52f]">Locations</Link>
              <Link href="/about" className="min-h-8 text-white/78 hover:text-[#f3c52f]">Our story</Link>
              <Link href="/order" className="min-h-8 text-white/78 hover:text-[#f3c52f]">Order</Link>
              <Link href="/specials" className="min-h-8 text-white/78 hover:text-[#f3c52f]">Specials</Link>
              <a href={brand.phoneHref} className="min-h-8 text-white/78 hover:text-[#f3c52f]">
                {brand.phone}
              </a>
            </nav>
            <div className="mt-5 flex gap-3">
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-11 items-center justify-center border border-white/40 transition-colors hover:border-[#f3c52f] hover:bg-[#f3c52f] hover:text-[#32104f]"
              >
                <BiLogoInstagram className="size-5" />
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-11 items-center justify-center border border-white/40 transition-colors hover:border-[#f3c52f] hover:bg-[#f3c52f] hover:text-[#32104f]"
              >
                <BiLogoTiktok className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/25 pt-6 text-xs text-white/62 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}.</p>
          <p>Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
