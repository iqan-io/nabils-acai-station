import Image from "next/image";
import { locations } from "@/lib/brand";
import { StarRating } from "@/components/shared/Ornaments";

const locationPhotos = [
  {
    src: "/images/locations/location-mount-lawley.png",
    alt: "Inside Nabil's Açaí Station in Mount Lawley",
    frameClass: "night-arch aspect-[4/5]",
  },
  {
    src: "/images/locations/location-ballajura.png",
    alt: "Nabil's Lebanese Sweets counter in Ballajura",
    frameClass: "rounded-[1.5rem] aspect-[4/3]",
  },
] as const;

export function LocationsHero() {
  return (
    <section className="relative min-h-[68vh] overflow-hidden bg-[var(--night-plum)] text-[var(--cream)]">
      <Image
        src="/film/frames/f_0001.jpg"
        alt="Nabil's Açaí Station glowing on Beaufort Street at night"
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[var(--night-plum)] via-[var(--night-plum)]/72 to-[var(--night-plum)]/22" />
      <div aria-hidden className="night-grain absolute inset-0 opacity-[0.045] mix-blend-screen" />
      <div className="relative mx-auto flex min-h-[68vh] max-w-6xl items-end px-6 py-16 md:items-center md:py-24 lg:px-10">
        <div className="max-w-3xl">
          <p className="night-label text-[var(--gold-highlight)]">Visit Nabil&apos;s</p>
          <h1 className="mt-6 font-display text-[clamp(3.7rem,8vw,6rem)] leading-[0.9] text-[var(--cream)]">
            Two places. <span className="italic text-[var(--gold-highlight)]">One glow.</span>
          </h1>
          <p className="mt-7 max-w-[54ch] text-base leading-7 text-[var(--cream)]/72 md:text-lg md:leading-8">
            Find us on Beaufort Street in Mount Lawley and inside Ballajura City Shopping Centre.
          </p>
        </div>
      </div>
    </section>
  );
}

export function LocationsFull() {
  return (
    <section className="relative overflow-hidden bg-[var(--night-plum)] text-[var(--cream)]">
      <div aria-hidden className="pointer-events-none absolute right-[-16rem] top-[18rem] size-[38rem] rounded-full bg-[var(--arch-mauve)]/18 blur-3xl" />
      <div
        className="relative mx-auto px-6 py-16 md:py-24 lg:px-10"
        style={{ maxWidth: "72rem" }}
      >
        <div className="space-y-20 md:space-y-28">
          {locations.map((location, index) => (
            <article
              key={location.slug}
              id={location.slug}
              className="grid scroll-mt-28 items-start gap-10 lg:grid-cols-12 lg:gap-14"
            >
              <div className={`lg:col-span-6 ${index === 1 ? "lg:order-2" : ""}`}>
                <div className="relative">
                  <div
                    aria-hidden
                    className={`absolute -inset-3 border border-[var(--gold-highlight)]/25 ${
                      index === 0
                        ? "rounded-t-[999px] rounded-b-[1.75rem]"
                        : "rounded-[1.75rem]"
                    }`}
                  />
                  <div className={`relative overflow-hidden bg-[var(--deep-plum)] ${locationPhotos[index].frameClass}`}>
                    <Image
                      src={locationPhotos[index].src}
                      alt={locationPhotos[index].alt}
                      fill
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      quality={90}
                      className="object-cover"
                    />
                    <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[var(--cream)]/10" />
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-6 lg:pt-8 ${index === 1 ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="night-label text-[var(--gold-highlight)]">Location</span>
                  <span aria-hidden className="h-px flex-1 bg-[var(--gold-highlight)]/28" />
                  <span className="font-display text-lg italic text-[var(--cream)]/45">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h2 className="mt-6 font-display text-5xl leading-none text-[var(--cream)] md:text-6xl">
                  {location.name}
                </h2>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <StarRating value={location.rating} />
                  <span className="text-sm font-semibold tabular-nums text-[var(--cream)]">
                    {location.rating}
                    <span className="ml-1 font-normal text-[var(--cream)]/52">
                      ({location.reviewCount} reviews)
                    </span>
                  </span>
                </div>

                <p className="mt-7 max-w-[46ch] text-lg leading-8 text-[var(--cream)]/78">
                  {location.address}
                </p>
                {location.note && (
                  <p className="mt-3 max-w-[48ch] font-display text-xl italic leading-7 text-[var(--pistachio)]">
                    {location.note}
                  </p>
                )}

                {location.hours ? (
                  <div className="mt-8 rounded-[1.5rem] border border-[var(--cream)]/12 bg-[var(--deep-plum)] p-5 sm:p-6">
                    <p className="night-label text-[var(--gold-highlight)]">Hours</p>
                    <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      {location.hours.map(([day, hours]) => (
                        <div key={day} className="flex justify-between gap-5 border-b border-[var(--cream)]/9 py-2">
                          <dt className="font-semibold text-[var(--cream)]">{day}</dt>
                          <dd className="text-right tabular-nums text-[var(--cream)]/62">{hours}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <p className="mt-7 rounded-[1.25rem] border border-[var(--cream)]/12 bg-[var(--deep-plum)] px-5 py-4 text-sm leading-6 text-[var(--cream)]/62">
                    Hours are not listed here. Call before visiting in the evening.
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--honey)] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--night-plum)] transition-colors hover:bg-[var(--gold-highlight)]"
                  >
                    Open in Maps →
                  </a>
                  {"phone" in location && location.phone && (
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, "")}`}
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--cream)]/25 px-7 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cream)] transition-colors hover:border-[var(--gold-highlight)] hover:text-[var(--gold-highlight)]"
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
