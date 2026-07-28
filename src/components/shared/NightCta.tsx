import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export function NightCta({
  secondaryHref,
  secondaryLabel,
}: {
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--deep-plum)] text-[var(--cream)]">
      <div aria-hidden className="night-grain pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:py-20 lg:px-10">
        <div className="relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden rounded-full border border-[var(--gold-highlight)]/35 bg-[var(--night-plum)]">
          <Image
            src="/images/enhanced/strawberry-cup-neon.jpg"
            alt="Nabil's Viral Dubai Strawberry Cup"
            fill
            sizes="288px"
            quality={90}
            className="object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <p className="night-label text-[var(--gold-highlight)]">Made for sweet moments</p>
          <h2 className="mt-5 font-display text-5xl leading-[0.98] text-[var(--cream)] md:text-6xl">
            Your next favourite is <span className="italic text-[var(--gold-highlight)]">waiting.</span>
          </h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <a
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--honey)] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--night-plum)] transition-colors hover:bg-[var(--gold-highlight)]"
            >
              Order on Uber Eats
            </a>
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--cream)]/28 px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cream)] transition-colors hover:border-[var(--gold-highlight)] hover:text-[var(--gold-highlight)]"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
