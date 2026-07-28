import Image from "next/image";
import Link from "next/link";
import { Sparkle } from "@/components/shared/Ornaments";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--acai)] text-[var(--cream)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-sunburst-acai opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[40vh] w-[60vw] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,184,96,0.4), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.32em] text-[var(--saffron)]">
              <Sparkle className="size-3 text-[var(--saffron)]" />
              Come say hi
            </div>
            <h2 className="mt-5 font-display text-4xl leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
              We&rsquo;re open till{" "}
              <span className="italic text-[var(--honey)]">eleven</span>.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--lavender)]">
              Open till late in Perth. Walk in for a seat by the neon, tap
              order for delivery, or call ahead for pickup — whichever kind of
              sweet moment you&rsquo;re after.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--cream)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--acai-deep)] transition-colors hover:bg-[var(--honey)]"
              >
                View the menu <span aria-hidden>→</span>
              </Link>
              <Link
                href="/locations"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--cream)]/30 px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--cream)] transition-colors hover:bg-[var(--cream)]/10"
              >
                Find a store
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative mx-auto min-h-[28rem] w-full max-w-md">
              <div
                aria-hidden
                className="absolute inset-x-6 bottom-4 top-10 rounded-[8rem_8rem_2rem_2rem] bg-[var(--cream)]/10 ring-1 ring-[var(--cream)]/15"
              />
              <div className="absolute left-0 top-0 aspect-[4/5] w-[66%] overflow-hidden rounded-[7rem_7rem_1.5rem_1.5rem] ring-2 ring-[var(--honey)]/40 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)]">
                <Image
                  src="/images/enhanced/fruit-cocktail-client-enhanced.jpg"
                  alt="Nabil's fruit cocktail layered with fruit, ashta, cashew and pistachio"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="absolute right-0 top-24 aspect-[4/5] w-[58%] overflow-hidden rounded-[1.5rem_6rem_1.5rem_1.5rem] ring-2 ring-[var(--cream)]/25 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)]">
                <Image
                  src="/images/enhanced/strawberry-cup-neon.jpg"
                  alt="Dubai strawberry cup with pistachio and strawberries"
                  fill
                  sizes="(max-width: 1024px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-16 right-10 rounded-full bg-[var(--cream)] px-5 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--acai)] shadow-[0_14px_32px_-18px_rgba(0,0,0,0.7)]">
                Late-night sweets, made properly
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
