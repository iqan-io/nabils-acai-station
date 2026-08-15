import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { brandAssets } from "@/lib/brandAssets";

/**
 * Closing band for the about and order routes. Mirrors the homepage's final
 * band so every route lands on the same note.
 */
export function FinalCta() {
  return (
    <section
      className="bg-[var(--c-paper)] px-5 pb-14 pt-2 lg:px-8"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 rounded-2xl bg-[var(--c-grape)] p-7 text-white sm:p-9 lg:flex-row lg:items-center lg:gap-8">
        <Image
          src={brandAssets.darkBackgroundLogo}
          alt=""
          width={81}
          height={120}
          className="h-28 w-auto shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-white/65">
            {brand.tagline}
          </p>
          <h2 className="mt-1.5 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.08] text-white [text-transform:none]">
            Still deciding? Start with the menu.
          </h2>
        </div>
        <div className="flex w-full shrink-0 gap-2.5 lg:w-auto">
          <Link
            href="/menu"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-white px-6 text-[0.9rem] font-bold text-[var(--c-grape)] lg:flex-none"
          >
            View the menu
          </Link>
          <a
            href={brand.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg border border-white/70 px-6 text-[0.9rem] font-bold text-white transition-colors hover:bg-white/15 lg:flex-none"
          >
            Order delivery
          </a>
        </div>
      </div>
    </section>
  );
}
