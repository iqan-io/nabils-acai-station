import Image from "next/image";
import Link from "next/link";
import { Sparkle } from "@/components/shared/Ornaments";
import { brand } from "@/lib/brand";

const specials = [
  "Dubai Strawberry Cup",
  "Pistachio Delight",
  "Build-Your-Own Acai",
  "Triple Indulgence",
  "Viral Strawberry Cup",
  "Iced Pistachio Latte",
  "Mocktails on Tap",
  "Bueno Crepe",
  "Sunset Swirl Cocktail",
  "Waffle Snack Pack",
  "Cookies & Cream Shake",
  "Ube Matcha",
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--night-plum)] text-[var(--cream)]">
      {/* Cinematic storefront-at-night backdrop — the glowing Beaufort St shop. */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="/images/hero-storefront-night.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.06] object-cover object-center"
        />
      </div>

      {/* Warm glow echoing the shopfront light, then a plum wash that keeps the
          top navbar-safe and darkens the lower third so the copy stays crisp. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_38%,rgba(242,200,121,0.16)_0%,transparent_58%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,11,24,0.62)_0%,rgba(22,11,24,0.14)_28%,rgba(22,11,24,0.72)_64%,rgba(22,11,24,0.97)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-soft-light"
      />

      {/* Content — bottom-anchored so the shopfront breathes above it. */}
      <div className="relative mx-auto flex min-h-[calc(100svh-5rem)] max-w-4xl flex-col items-center justify-end px-6 pb-16 pt-24 text-center md:min-h-[46rem] md:pb-20">
        <div className="rise-in rise-in-delay-1">
          <Image
            src="/brand/logo-round.png"
            alt={brand.name}
            width={1024}
            height={1024}
            priority
            className="size-32 drop-shadow-[0_20px_55px_rgba(0,0,0,0.65)] sm:size-44"
          />
        </div>

        <div className="mt-6 inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.3em] text-[var(--gold-highlight)] rise-in rise-in-delay-2">
          <Sparkle className="size-2.5" />
          Mount Lawley &amp; Ballajura · Perth
          <Sparkle className="size-2.5" />
        </div>

        <h1 className="mt-5 font-display text-[clamp(2.6rem,8.5vw,5.5rem)] leading-[0.94] tracking-tight rise-in rise-in-delay-2">
          Acai, crepes &amp;{" "}
          <span className="italic text-[var(--honey)]">
            Dubai chocolate<span className="text-[var(--gold-highlight)]">.</span>
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--cream)]/85 md:text-xl rise-in rise-in-delay-3">
          A Lebanese dessert family doing the viral stuff right — build-your-own
          bowls, signature crepes, Dubai crunch and mocktails on tap. Made for
          sweet moments, open till eleven.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 rise-in rise-in-delay-4">
          <Link
            href="/menu"
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--cream)] px-8 py-4 text-[0.9rem] font-bold uppercase tracking-[0.18em] text-[var(--night-plum)] shadow-[0_22px_60px_-18px_rgba(0,0,0,0.85)] ring-1 ring-[var(--gold-highlight)]/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--honey)] max-sm:w-full sm:px-9"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">View the menu</span>
            <span
              aria-hidden
              className="relative inline-flex size-6 items-center justify-center rounded-full bg-[var(--deep-plum)] text-[var(--cream)] transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <a
            href={brand.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--cream)]/35 bg-[var(--night-plum)]/30 px-7 py-4 text-[0.9rem] font-bold uppercase tracking-[0.18em] text-[var(--cream)] backdrop-blur-md transition-colors hover:border-[var(--gold-highlight)]/70 hover:text-[var(--gold-highlight)] max-sm:w-full"
          >
            Order on Uber Eats
          </a>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.72rem] uppercase tracking-[0.2em] text-[var(--cream)]/70 rise-in rise-in-delay-5">
          <span className="inline-flex items-center gap-2">
            <span className="text-[var(--gold-highlight)]">★★★★★</span>
            Loved on Google · 160+ reviews
          </span>
          <span aria-hidden className="hidden h-3 w-px bg-[var(--cream)]/30 sm:inline-block" />
          <a href={brand.phoneHref} className="transition-colors hover:text-[var(--cream)]">
            Call {brand.phone}
          </a>
        </div>
      </div>

      {/* Specials ticker — a warm band closing the cinematic frame. */}
      <div className="relative border-t border-[var(--cream)]/12 bg-[var(--night-plum)]/85 text-[var(--cream)] backdrop-blur-sm">
        <div className="marquee-track py-4 text-sm md:text-base">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10 px-6">
              {specials.map((label) => (
                <span
                  key={`${dup}-${label}`}
                  className="inline-flex items-center gap-4 font-display italic"
                >
                  <Sparkle className="size-3 text-[var(--gold-highlight)]" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
