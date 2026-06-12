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
    <section className="relative overflow-hidden bg-[var(--acai-deep)] text-[var(--cream)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-110"
        style={{
          backgroundImage:
            "url('/images/enhanced/nabils-hero-acai-poster.webp')",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_30%,rgba(244,184,96,0.18)_0%,transparent_55%),linear-gradient(180deg,rgba(31,11,37,0.85)_0%,rgba(31,11,37,0.96)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-25 mix-blend-soft-light"
      />

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:min-h-[46rem] md:py-24 lg:grid-cols-12 lg:gap-4 lg:px-10 lg:py-28">
        <div className="relative lg:col-span-7 lg:pr-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] uppercase tracking-[0.28em] text-[var(--honey)] rise-in rise-in-delay-1">
            <span className="inline-flex items-center gap-1.5">
              <Sparkle className="size-2.5 text-[var(--saffron)]" />
              Perth · Open till late
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Sparkle className="size-2.5 text-[var(--saffron)]" />
              Loved on Google
            </span>
          </div>

          <div className="mt-8 max-w-[22rem] sm:max-w-3xl lg:mt-10 lg:max-w-[42rem]">
            <h1 className="font-display text-[clamp(2.85rem,9.5vw,6.5rem)] leading-[0.92] tracking-tight rise-in rise-in-delay-2">
              Acai, crepes &amp;{" "}
              <span className="block italic text-[var(--honey)]">
                Dubai chocolate<span className="text-[var(--saffron)]">.</span>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--cream)]/85 md:text-xl rise-in rise-in-delay-3">
              A Lebanese dessert family in Perth, doing the viral stuff right.
              Build-your-own bowls, signature crepes, Dubai crunch, mocktails on
              tap. Made for sweet moments, open till late.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4 rise-in rise-in-delay-4">
              <Link
                href="/menu"
                className="group relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-full bg-[var(--cream)] px-8 py-5 text-[0.9rem] font-bold uppercase tracking-[0.18em] text-[var(--acai-deep)] shadow-[0_22px_60px_-18px_rgba(0,0,0,0.75)] ring-1 ring-[var(--saffron)]/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--honey)] max-sm:w-full sm:px-9 sm:text-[0.95rem]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">View the menu</span>
                <span
                  aria-hidden
                  className="relative inline-flex size-6 items-center justify-center rounded-full bg-[var(--acai)] text-[var(--cream)] transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <Link
                href="/locations"
                className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--cream)] underline-offset-[6px] transition-colors hover:underline max-sm:basis-full"
              >
                Find a store
              </Link>
              <span
                aria-hidden
                className="hidden h-4 w-px bg-[var(--cream)]/35 sm:inline-block"
              />
              <a
                href={brand.phoneHref}
                className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--cream)] underline-offset-[6px] transition-colors hover:underline max-sm:basis-full"
              >
                Call us
              </a>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-[var(--cream)]/25 pt-7 rise-in rise-in-delay-5 sm:gap-6">
              <div>
                <dt className="text-[0.58rem] uppercase tracking-[0.18em] text-[var(--cream)]/62 sm:text-[0.65rem] sm:tracking-[0.22em]">
                  Followers
                </dt>
                <dd className="mt-1.5 font-display text-2xl">
                  {brand.instagram.followersLabel}
                </dd>
              </div>
              <div>
                <dt className="text-[0.58rem] uppercase tracking-[0.18em] text-[var(--cream)]/62 sm:text-[0.65rem] sm:tracking-[0.22em]">
                  Acai toppings
                </dt>
                <dd className="mt-1.5 font-display text-2xl">14</dd>
              </div>
              <div>
                <dt className="text-[0.58rem] uppercase tracking-[0.18em] text-[var(--cream)]/62 sm:text-[0.65rem] sm:tracking-[0.22em]">
                  Crepes signed
                </dt>
                <dd className="mt-1.5 font-display text-2xl">4</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:-ml-24 xl:-ml-36 rise-in rise-in-delay-3">
          <div className="relative mx-auto w-full max-w-[28rem] lg:max-w-none lg:scale-[1.08] xl:scale-[1.14] lg:rotate-[-1.75deg]">
            <span
              aria-hidden
              className="absolute -inset-6 rounded-[2.25rem] bg-[radial-gradient(60%_50%_at_50%_40%,rgba(244,184,96,0.35)_0%,transparent_70%)] blur-2xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-12 -top-10 z-20 hidden size-28 items-center justify-center lg:flex"
            >
              <span className="spin-slow absolute inset-0 inline-flex items-center justify-center">
                <svg
                  viewBox="0 0 120 120"
                  className="h-full w-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <path
                      id="hero-sticker-curve"
                      d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                      fill="none"
                    />
                  </defs>
                  <text
                    fill="var(--cream)"
                    style={{
                      fontFamily:
                        'var(--font-display), ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif',
                      fontSize: "10.5px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    <textPath
                      href="#hero-sticker-curve"
                      startOffset="0"
                      textLength="276"
                      lengthAdjust="spacingAndGlyphs"
                    >
                      Open till late · Made for sweet moments ·
                    </textPath>
                  </text>
                </svg>
              </span>
              <span className="relative inline-flex size-10 items-center justify-center rounded-full bg-[var(--saffron)] text-[var(--acai-deep)] shadow-[0_8px_30px_-6px_rgba(255,183,64,0.6)] ring-1 ring-[var(--acai-deep)]/15">
                <svg viewBox="0 0 24 24" className="size-5" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[var(--acai)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-[var(--cream)]/15">
              <video
                className="hero-video absolute inset-0 h-full w-full object-cover"
                src="/videos/nabils-hero-acai-opt.mp4"
                poster="/images/enhanced/nabils-hero-acai-poster.webp"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="A cinematic acai bowl on the counter at Nabil's Acai Station"
              />
              {/* Still fallback for reduced-motion users (the video is hidden
                  for them, so its poster never paints). CSS handles the swap. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/enhanced/nabils-hero-acai-poster.webp"
                alt="An acai bowl on the counter at Nabil's Acai Station"
                className="hero-video-fallback absolute inset-0 h-full w-full object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_55%,rgba(31,11,37,0.55)_100%)]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-soft-light"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[var(--cream)]/10"
              />
              <div className="pointer-events-none absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[var(--acai-deep)]/55 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.22em] text-[var(--cream)] backdrop-blur-md ring-1 ring-[var(--cream)]/15">
                <span className="relative inline-flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--saffron)] opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-[var(--saffron)]" />
                </span>
                Now serving
              </div>
              <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between text-[var(--cream)]">
                <span className="font-display italic text-lg leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  Made for
                  <br />
                  sweet moments
                </span>
                <span className="text-[0.55rem] uppercase tracking-[0.24em] text-[var(--cream)]/70">
                  Mt Lawley · Ballajura
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-y border-[var(--cream)]/15 bg-[var(--acai-deep)]/92 text-[var(--cream)] backdrop-blur-sm">
        <div className="marquee-track py-4 text-sm md:text-base">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-10 px-6">
              {specials.map((label) => (
                <span
                  key={`${dup}-${label}`}
                  className="inline-flex items-center gap-4 font-display italic"
                >
                  <Sparkle className="size-3 text-[var(--saffron)]" />
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
