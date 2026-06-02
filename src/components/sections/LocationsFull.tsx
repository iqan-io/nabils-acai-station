import Image from "next/image";
import { brand, locations } from "@/lib/brand";
import { Sparkle, StarRating, CedarLeaf } from "@/components/shared/Ornaments";

const locationPhotos = [
  {
    src: "/images/locations/location-mount-lawley.png",
    alt: "Nabil's Acai Station Mt Lawley dining room",
    frameClass: "aspect-[4/5] rounded-[10rem_10rem_2rem_2rem]",
  },
  {
    src: "/images/locations/location-ballajura.png",
    alt: "Nabil's Lebanese Sweets Ballajura storefront",
    frameClass: "aspect-[4/3] rounded-[2rem]",
  },
] as const;

export function LocationsHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream-warm)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-50 mix-blend-multiply"
      />
      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-28 lg:px-10">
        <div className="text-[0.7rem] uppercase tracking-[0.32em] text-[var(--acai)]/70 flex items-center justify-center gap-2">
          <Sparkle className="size-3 text-[var(--saffron)]" />
          Visit us
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-[var(--acai-deep)] md:text-7xl">
          Two shops. <span className="italic">One family.</span>
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-base leading-relaxed text-[var(--acai-deep)]/75 md:text-lg">
          The Mt Lawley flagship on Beaufort Street, and the original
          Lebanese sweets stall inside Ballajura City Shopping Centre. Both
          family-run, both worth the trip.
        </p>
      </div>
    </section>
  );
}

export function LocationsFull() {
  return (
    <section className="relative bg-[var(--cream)]">
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28 lg:px-10">
        <div className="space-y-16 md:space-y-24">
          {locations.map((loc, idx) => (
            <article
              key={loc.slug}
              id={loc.slug}
              className="grid scroll-mt-28 grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <div className={`lg:col-span-6 ${idx === 1 ? "lg:order-2" : ""}`}>
                <div
                  className={`relative overflow-hidden ring-1 ring-[var(--acai)]/15 shadow-[0_30px_60px_-30px_rgba(31,11,37,0.35)] ${locationPhotos[idx].frameClass}`}
                >
                  <Image
                    src={locationPhotos[idx].src}
                    alt={locationPhotos[idx].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 lg:pt-6">
                <div className="text-[0.7rem] uppercase tracking-[0.32em] text-[var(--acai)]/70 flex items-center gap-2">
                  {idx === 1 ? (
                    <CedarLeaf className="size-4 text-[var(--cedar)]" />
                  ) : (
                    <Sparkle className="size-3 text-[var(--saffron)]" />
                  )}
                  Location {String(idx + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-3 font-display text-5xl leading-none tracking-tight text-[var(--acai-deep)] md:text-6xl">
                  {loc.name}
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <StarRating value={loc.rating} />
                  <span className="text-sm font-semibold text-[var(--acai-deep)]">
                    {loc.rating}
                    {loc.reviewCount && (
                      <span className="ml-1 font-normal text-[var(--acai-deep)]/60">
                        ({loc.reviewCount} reviews)
                      </span>
                    )}
                  </span>
                </div>
                <p className="mt-5 text-base leading-relaxed text-[var(--acai-deep)]/85">
                  {loc.address}
                </p>
                {loc.note && (
                  <p className="mt-3 text-base italic text-[var(--cedar)]">
                    {loc.note}
                  </p>
                )}

                {loc.hours && (
                  <div className="mt-7">
                    <div className="text-[0.65rem] uppercase tracking-[0.28em] text-[var(--acai)]/60 mb-3">
                      Hours
                    </div>
                    <dl className="grid grid-cols-1 gap-y-2 rounded-2xl bg-[var(--cream-warm)] p-5 text-sm sm:grid-cols-2 sm:gap-x-10">
                      {loc.hours.map(([day, hrs]) => (
                        <div key={day} className="flex justify-between gap-4">
                          <dt className="font-semibold text-[var(--acai-deep)]">
                            {day}
                          </dt>
                          <dd className="text-[var(--acai-deep)]/70">{hrs}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {!loc.hours && (
                  <p className="mt-5 text-sm text-[var(--acai-deep)]/60">
                    Hours follow the Ballajura City Shopping Centre. Call
                    ahead for evenings.
                  </p>
                )}

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href={loc.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--acai)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cream)] hover:bg-[var(--acai-deep)] transition-colors"
                  >
                    Open in Maps →
                  </a>
                  {"phone" in loc && loc.phone && (
                    <a
                      href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--acai)]/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--acai)] hover:bg-[var(--cream-warm)] transition-colors"
                    >
                      Call {loc.phone}
                    </a>
                  )}
                  {idx === 0 && (
                    <a
                      href={brand.phoneHref}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--acai)]/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--acai)] hover:bg-[var(--cream-warm)] transition-colors"
                    >
                      Call {brand.phone}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
