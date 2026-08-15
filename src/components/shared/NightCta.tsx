import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

/**
 * Closing call-to-action for the menu and locations routes, in "The Counter"
 * system: one grape panel, one real photograph, two actions. Matches the
 * homepage's final band so the site closes the same way everywhere.
 */
export function NightCta({
  secondaryHref,
  secondaryLabel,
}: {
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section
      className="bg-[var(--c-paper)] px-5 pb-14 pt-2 lg:px-8"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl bg-[var(--c-grape)] text-white md:grid-cols-[0.82fr_1.18fr]">
        <div className="relative min-h-[15rem]">
          <Image
            src="/images/enhanced/strawberry-cup-neon.jpg"
            alt="Nabil's Viral Dubai Strawberry Cup"
            fill
            quality={90}
            sizes="(max-width: 767px) 100vw, 38vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-white/65">
            {brand.tagline}
          </p>
          <h2 className="mt-2.5 max-w-[18ch] text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.06] text-white [text-transform:none]">
            Your next favourite is waiting.
          </h2>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-[0.9rem] font-bold text-[var(--c-grape)]"
            >
              Order on Uber Eats
            </a>
            <Link
              href={secondaryHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/70 px-6 text-[0.9rem] font-bold text-white transition-colors hover:bg-white/15"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
