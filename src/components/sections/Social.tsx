import Image from "next/image";
import { brand } from "@/lib/brand";
import { Sparkle } from "@/components/shared/Ornaments";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";

const tiles = [
  { src: "/images/enhanced/signature-dubai-strawberry-cup-v2.jpg", alt: "Dubai chocolate strawberry cup promo" },
  { src: "/images/enhanced/signature-build-your-own-acai-v2.jpg", alt: "Bueno açaí bowl on a blue backdrop" },
  { src: "/images/enhanced/story-mt-lawley-interior.jpg", alt: "Mt Lawley dessert counter and neon interior" },
  { src: "/images/enhanced/location-ballajura-stall-v2.jpg", alt: "Nabil's Lebanese Sweets counter in Ballajura" },
  { src: "/images/enhanced/blue-hawaii-mocktail-client-enhanced.jpg", alt: "Blue Hawaii mocktail in a branded Nabil's can" },
  { src: "/images/enhanced/signature-matcha-bowl-v2.jpg", alt: "Pistachio açaí bowl" },
];

export function Social() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-28 lg:px-10">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-[0.7rem] uppercase tracking-[0.32em] text-[var(--acai)]/70 flex items-center gap-2">
              <Sparkle className="size-3 text-[var(--saffron)]" />
              Follow along
            </div>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight text-[var(--acai-deep)] md:text-5xl lg:text-6xl">
              <span className="italic">{brand.instagram.handle}</span>
              <br />
              {brand.instagram.followersLabel} already do.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--acai-deep)]/75">
              We post the new flavours, the late-night specials and the
              one-off Dubai chocolate drops there first. Mostly food, some
              chef, occasional dog.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--acai)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cream)] hover:bg-[var(--acai-deep)] transition-colors"
              >
                <BiLogoInstagram className="size-4" />
                Instagram
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--acai)]/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--acai)] hover:bg-[var(--cream-warm)] transition-colors"
              >
                <BiLogoTiktok className="size-4" />
                TikTok
              </a>
            </div>
          </div>

          <div className="hidden md:block max-w-xs text-right text-[0.65rem] uppercase tracking-[0.28em] text-[var(--acai)]/50">
            Tap any tile<br />
            to open Instagram →
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {tiles.map((tile, i) => (
            <a
              key={tile.src}
              href={brand.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl ring-1 ring-[var(--acai)]/10"
              style={{
                transform:
                  i % 3 === 0
                    ? "translateY(0)"
                    : i % 3 === 1
                      ? "translateY(12px)"
                      : "translateY(-6px)",
              }}
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-[var(--acai-deep)] opacity-0 transition-opacity group-hover:opacity-30"
              />
              <BiLogoInstagram
                aria-hidden
                className="absolute right-3 top-3 size-5 text-[var(--cream)] opacity-0 transition-opacity group-hover:opacity-100"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
