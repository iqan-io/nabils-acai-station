import Image from "next/image";
import Link from "next/link";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { brand, locations } from "@/lib/brand";
import { brandAssets } from "@/lib/brandAssets";

function shortAddress(full: string) {
  return full.replace(/\sWA\s?\d{4}.*$/i, "");
}

/**
 * Footer in "The Counter" system: a quiet ink close under a light page, with
 * grape reserved for links. Replaces the purple-and-lime block that belonged to
 * the previous slab system.
 */
export function Footer() {
  const linkClass =
    "min-h-9 text-[0.92rem] text-white/70 transition-colors hover:text-white";

  return (
    <footer
      className="border-t border-white/10 bg-[#141118] text-white"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8 lg:pt-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Link
              href="/"
              aria-label="Nabil's Açaí Station home"
              className="inline-flex items-center gap-3.5"
            >
              <Image
                src={brandAssets.darkBackgroundLogo}
                alt=""
                width={97}
                height={144}
                className="h-36 w-auto object-contain"
              />
              <span>
                <span className="sr-only">
                  Nabil&apos;s Açaí Station
                </span>
                <span className="mt-0.5 block text-[0.78rem] text-white/55">
                  Mount Lawley &amp; Ballajura · Perth
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-white/70">
              Açaí, crêpes, Dubai chocolate and Lebanese sweets. Built to order,
              open till late.
            </p>
            <p className="mt-3 text-[1.05rem] font-bold text-[#e9a73c]">
              {brand.tagline}
            </p>
          </div>

          <div className="md:col-span-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-white/45">
              Visit
            </p>
            <ul className="mt-4 space-y-4">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={`/locations#${location.slug}`}
                    className="text-[1.1rem] font-bold transition-colors hover:text-[#c2a0e8]"
                  >
                    {location.name}
                  </Link>
                  <p className="mt-0.5 max-w-xs text-[0.88rem] leading-relaxed text-white/60">
                    {shortAddress(location.address)}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href={brand.phoneHref}
              className="mt-4 inline-block text-[0.92rem] text-white/70 transition-colors hover:text-white"
            >
              {brand.phone}
            </a>
          </div>

          <div className="md:col-span-3">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-white/45">
              Explore
            </p>
            <nav
              aria-label="Footer"
              className="mt-4 flex flex-col items-start gap-2"
            >
              <Link href="/menu" className={linkClass}>
                Menu
              </Link>
              <Link href="/locations" className={linkClass}>
                Locations
              </Link>
              <Link href="/about" className={linkClass}>
                Our story
              </Link>
              <Link href="/order" className={linkClass}>
                Order
              </Link>
              <Link href="/specials" className={linkClass}>
                Specials
              </Link>
            </nav>
            <div className="mt-5 flex gap-2.5">
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-white/20 transition-colors hover:border-[#c2a0e8] hover:text-[#c2a0e8]"
              >
                <BiLogoInstagram className="size-5" />
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex size-11 items-center justify-center rounded-lg border border-white/20 transition-colors hover:border-[#c2a0e8] hover:text-[#c2a0e8]"
              >
                <BiLogoTiktok className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/12 pt-6 text-[0.8rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {brand.name}.
          </p>
          <p>Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
