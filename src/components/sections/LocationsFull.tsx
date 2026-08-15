import Image from "next/image";
import { locations } from "@/lib/brand";
import { PageHero } from "@/components/shared/PageHero";

const locationPhotos = [
  {
    src: "/images/locations/location-mount-lawley.png",
    alt: "Inside Nabil's Açaí Station in Mount Lawley",
  },
  {
    src: "/images/locations/location-ballajura.png",
    alt: "Nabil's Lebanese Sweets counter in Ballajura",
  },
] as const;

export function LocationsHero() {
  return (
    <PageHero
      eyebrow="Mount Lawley + Ballajura"
      title="Two counters, one very difficult decision."
      lead="Açaí, crêpes, Dubai chocolate and the group order that keeps growing. Mount Lawley runs late; Ballajura is where the family started."
      image={{
        src: "/images/enhanced/location-mt-lawley-storefront-clean.jpg",
        alt: "Nabil's Açaí Station on Beaufort Street in Mount Lawley",
      }}
    />
  );
}

export function LocationsFull() {
  return (
    <section
      className="bg-[var(--c-paper)]"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        {/* items-start so each card keeps its natural height — Ballajura has no
            hours table and stretching left a large void under it. */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {locations.map((location, index) => (
            <article
              key={location.slug}
              id={location.slug}
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-[var(--c-line)] bg-[var(--c-card)]"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={locationPhotos[index].src}
                  alt={locationPhotos[index].alt}
                  fill
                  quality={90}
                  sizes="(max-width: 1023px) 100vw, 46vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 lg:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[1.65rem] text-[var(--c-ink)] [text-transform:none]">
                    {location.name}
                  </h2>
                  <span
                    className="whitespace-nowrap text-right text-[1rem] font-bold tabular-nums text-[var(--c-ink)]"
                    style={{ fontFamily: "var(--font-counter-data)" }}
                  >
                    {location.rating}★
                    <span
                      className="block text-[0.72rem] font-normal text-[var(--c-ink-3)]"
                      style={{ fontFamily: "var(--font-counter-body)" }}
                    >
                      {location.reviewCount} reviews
                    </span>
                  </span>
                </div>

                <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--c-ink-2)]">
                  {location.address}
                </p>
                {location.note && (
                  <p className="mt-2 text-[0.9rem] text-[var(--c-ink-3)]">
                    {location.note}
                  </p>
                )}

                {location.hours ? (
                  <div className="mt-5 rounded-xl border border-[var(--c-line)] p-4">
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-[var(--c-ink-3)]">
                      Hours
                    </p>
                    <dl className="mt-2.5 grid gap-x-7 sm:grid-cols-2">
                      {location.hours.map(([day, hours]) => (
                        <div
                          key={day}
                          className="flex justify-between gap-4 border-b border-[var(--c-line)] py-1.5 text-[0.88rem] last:border-b-0 sm:[&:nth-last-child(-n+1)]:border-b-0"
                        >
                          <dt className="font-semibold text-[var(--c-ink)]">
                            {day}
                          </dt>
                          <dd
                            className="text-right tabular-nums text-[var(--c-ink-2)]"
                            style={{ fontFamily: "var(--font-counter-data)" }}
                          >
                            {hours}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  /* Ballajura's trading hours are genuinely unconfirmed. Saying
                     so is better than publishing a guess a customer could drive
                     across Perth for. */
                  <p className="mt-5 rounded-xl border border-[var(--c-line)] bg-[var(--c-paper)] p-4 text-[0.88rem] text-[var(--c-ink-2)]">
                    Hours aren&apos;t listed for this shop yet — give us a call
                    before heading over in the evening.
                  </p>
                )}

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--c-ink)] px-5 text-[0.88rem] font-bold text-white transition-colors hover:bg-[var(--c-grape)]"
                  >
                    Get directions ↗
                  </a>
                  {"phone" in location && location.phone && (
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, "")}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[var(--c-line-2)] px-5 text-[0.88rem] font-bold text-[var(--c-ink)] transition-colors hover:border-[var(--c-grape)] hover:text-[var(--c-grape)]"
                    >
                      Call {location.phone}
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
