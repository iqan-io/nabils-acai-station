import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export function SpecialsComingSoon() {
  return (
    <main
      className="bg-[var(--c-paper)]"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
        <section>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-[var(--c-ink-3)]">
            Drops + limited runs
          </p>
          <h1 className="mt-3 max-w-[15ch] text-[clamp(2.25rem,4.6vw,3.6rem)] leading-[1.04] text-[var(--c-ink)] [text-transform:none] [text-wrap:balance]">
            New sweets land fast.
          </h1>
          <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-[var(--c-ink-2)]">
            Seasonal flavours, Dubai chocolate drops and one-off experiments
            show up on Instagram first. The everyday favourites are always on
            the menu.
          </p>
          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={brand.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[var(--c-ink)] px-6 text-[0.9rem] font-bold text-white transition-colors hover:bg-[var(--c-grape)]"
            >
              Follow on Instagram ↗
            </a>
            <Link
              href="/menu"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[var(--c-line-2)] px-6 text-[0.9rem] font-bold text-[var(--c-ink)] transition-colors hover:border-[var(--c-grape)] hover:text-[var(--c-grape)]"
            >
              Browse the menu
            </Link>
          </div>
        </section>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src="/images/enhanced/menu-dubai-chocolate.png"
            alt="Nabil's pistachio-filled Dubai chocolate"
            fill
            priority
            quality={90}
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="object-cover"
          />
        </div>
      </div>
    </main>
  );
}
