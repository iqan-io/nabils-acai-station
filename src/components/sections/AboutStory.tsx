import Image from "next/image";
import { founder } from "@/lib/brand";
import { CedarLeaf, PalmFrond, Sparkle } from "@/components/shared/Ornaments";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream-warm)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-50 mix-blend-multiply"
      />
      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-28 lg:px-10">
        <div className="text-[0.7rem] uppercase tracking-[0.32em] text-[var(--acai)]/70 flex items-center justify-center gap-2">
          <Sparkle className="size-3 text-[var(--saffron)]" />
          Our story
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-[var(--acai-deep)] md:text-7xl">
          The family <span className="italic">behind the counter</span>.
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-base leading-relaxed text-[var(--acai-deep)]/75 md:text-lg">
          From a Lebanese sweets stall in Ballajura to Perth&rsquo;s viral açaí
          and Dubai chocolate — same family, same kitchen, made for sweet
          moments.
        </p>
      </div>
    </section>
  );
}

export function FounderFeature() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <PalmFrond className="pointer-events-none absolute -top-6 -left-10 h-32 w-64 text-[var(--cedar)]/25 hidden md:block" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[8rem_8rem_2rem_2rem] ring-1 ring-[var(--acai)]/15 shadow-[0_30px_60px_-30px_rgba(31,11,37,0.35)]">
              <Image
                src={founder.photo}
                alt={`${founder.name}, ${founder.role} of Nabil's Acai Station`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-top"
              />
            </div>
            <div className="mt-4 text-xs uppercase tracking-[0.28em] text-[var(--acai)]/60">
              {founder.name} · {founder.role}
            </div>
          </div>

          <div className="lg:col-span-7 lg:order-2">
            <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.32em] text-[var(--cedar)]">
              <CedarLeaf className="size-5" />
              Meet the owner
            </div>
            <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-[var(--acai-deep)] md:text-5xl">
              {founder.name}
            </h2>
            <div className="mt-7 space-y-5 text-lg leading-relaxed text-[var(--acai-deep)]/85 max-w-xl">
              {founder.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {founder.pullQuote && (
              <blockquote className="mt-8 border-l-2 border-[var(--saffron)] pl-5 font-display text-xl italic leading-snug text-[var(--acai)] md:text-2xl">
                {founder.pullQuote}
              </blockquote>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
