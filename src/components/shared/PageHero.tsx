import Image from "next/image";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: { src: string; alt: string };
  children?: React.ReactNode;
};

/**
 * Shared page header for every route below the homepage, in "The Counter"
 * system: paper ground, sentence-case heading, optional supporting photo.
 *
 * Replaces the per-page coloured slabs (lime, red, mustard) of the previous
 * system — those made each route shout its own colour and gave the site five
 * competing identities.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  children,
}: PageHeroProps) {
  return (
    <section
      className="border-b border-[var(--c-line)] bg-[var(--c-paper)]"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div
        className={`mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:px-8 lg:py-16 ${
          image ? "lg:grid-cols-[1.05fr_0.95fr]" : ""
        }`}
      >
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-[var(--c-ink-3)]">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-[16ch] text-[clamp(2.25rem,4.6vw,3.6rem)] leading-[1.04] text-[var(--c-ink)] [text-transform:none] [text-wrap:balance]">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-[var(--c-ink-2)]">
              {lead}
            </p>
          )}
          {children && <div className="mt-6">{children}</div>}
        </div>

        {image && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              quality={90}
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
