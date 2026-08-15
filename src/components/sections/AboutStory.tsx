import Image from "next/image";
import { founder } from "@/lib/brand";
import { brandAssets } from "@/lib/brandAssets";
import { PageHero } from "@/components/shared/PageHero";

export function AboutHero() {
  return (
    <PageHero
      eyebrow="Our story"
      title="Fifteen years, one family, one kitchen."
      lead="From a Lebanese sweets counter in Ballajura to Perth's viral açaí and Dubai chocolate — same family, same kitchen, open till late."
      image={{
        src: "/images/enhanced/story-mt-lawley-interior.jpg",
        alt: "Inside Nabil's Açaí Station in Mount Lawley",
      }}
    >
      <Image
        src={brandAssets.primaryLogo}
        alt=""
        aria-hidden
        width={69}
        height={100}
        className="h-24 w-auto object-contain"
      />
    </PageHero>
  );
}

export function FounderFeature() {
  return (
    <section
      className="bg-[var(--c-paper)]"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid overflow-hidden rounded-2xl border border-[var(--c-line)] bg-[var(--c-card)] lg:grid-cols-[0.78fr_1.22fr]">
          <div className="relative min-h-[22rem]">
            <Image
              src={founder.photo}
              alt={`${founder.name}, ${founder.role} of Nabil's Açaí Station`}
              fill
              quality={90}
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover object-top"
            />
          </div>

          <div className="p-7 sm:p-9 lg:p-12">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-[var(--c-ink-3)]">
              Meet the owner
            </p>
            <h2 className="mt-2 text-[clamp(1.9rem,3.4vw,2.75rem)] leading-[1.05] text-[var(--c-ink)] [text-transform:none]">
              {founder.name}
            </h2>
            <p className="mt-1 text-[0.92rem] text-[var(--c-ink-3)]">
              {founder.role}
            </p>

            <div className="mt-6 max-w-[62ch] space-y-4 text-[1.02rem] leading-relaxed text-[var(--c-ink-2)]">
              {founder.bio.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>

            {founder.pullQuote && (
              <blockquote className="mt-7 border-l-[3px] border-[var(--c-honey)] pl-5 text-[1.2rem] font-medium leading-snug text-[var(--c-ink)]">
                {founder.pullQuote}
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
