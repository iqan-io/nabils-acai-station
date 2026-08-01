import Image from "next/image";
import { locations } from "@/lib/brand";
import { StarRating } from "@/components/shared/Ornaments";

const locationPhotos = [
  { src: "/images/locations/location-mount-lawley.png", alt: "Inside Nabil's Açaí Station in Mount Lawley" },
  { src: "/images/locations/location-ballajura.png", alt: "Nabil's Lebanese Sweets counter in Ballajura" },
] as const;

export function LocationsHero() {
  return (
    <section className="grid min-h-[35rem] border-b-2 border-[#47206e] bg-[#c4dc67] lg:grid-cols-[0.92fr_1.08fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2))]">
        <p className="font-home-body text-sm font-bold uppercase tracking-[0.12em] text-[#ef2b37]">Mount Lawley + Ballajura</p>
        <h1 className="mt-5 max-w-xl font-home-display text-[clamp(5.2rem,11vw,9rem)] leading-[0.78] text-[#47206e]">Find your station.</h1>
        <p className="mt-7 max-w-[52ch] font-home-body text-lg leading-8 text-[#32104f]">Two Perth counters for açaí, crêpes, Dubai chocolate and the group order that keeps growing.</p>
      </div>
      <div className="relative min-h-[27rem] border-t-2 border-[#47206e] lg:border-l-2 lg:border-t-0">
        <Image src="/images/enhanced/location-mt-lawley-storefront-v2.jpg" alt="Nabil's Açaí Station on Beaufort Street in Mount Lawley" fill priority quality={90} sizes="(max-width: 1023px) 100vw, 55vw" className="object-cover" />
        <span className="absolute bottom-5 left-5 bg-[#f3c52f] px-5 py-3 font-home-display text-3xl text-[#47206e]">Two shops. Same big sweet energy.</span>
      </div>
    </section>
  );
}

export function LocationsFull() {
  return (
    <section className="bg-white text-[#32104f]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-10">
        <div className="space-y-16 md:space-y-24">
          {locations.map((location, index) => (
            <article key={location.slug} id={location.slug} className="grid scroll-mt-28 border-2 border-[#47206e] lg:grid-cols-2">
              <div className={`relative min-h-[28rem] ${index === 1 ? "lg:order-2" : ""}`}>
                <Image src={locationPhotos[index].src} alt={locationPhotos[index].alt} fill quality={90} sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
                <span className="absolute left-0 top-0 bg-[#47206e] px-5 py-3 font-home-display text-3xl text-white">0{index + 1}</span>
              </div>
              <div className={`flex flex-col justify-center border-t-2 border-[#47206e] p-7 sm:p-10 lg:border-t-0 ${index === 1 ? "bg-[#f3c52f] lg:order-1 lg:border-r-2" : "bg-[#ef2b37] text-white lg:border-l-2"}`}>
                <p className={`font-home-body text-xs font-bold uppercase tracking-[0.14em] ${index === 1 ? "text-[#ef2b37]" : "text-[#f3c52f]"}`}>Nabil&apos;s location</p>
                <h2 className={`mt-4 font-home-display text-6xl leading-[0.85] md:text-7xl ${index === 1 ? "text-[#47206e]" : "text-white"}`}>{location.name}</h2>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <StarRating value={location.rating} />
                  <span className="font-home-body text-sm font-bold tabular-nums">{location.rating} <span className="font-normal opacity-70">({location.reviewCount} reviews)</span></span>
                </div>
                <p className="mt-6 max-w-[46ch] font-home-body text-lg leading-8">{location.address}</p>
                {location.note && <p className="mt-3 max-w-[46ch] font-home-body font-bold">{location.note}</p>}
                {location.hours ? (
                  <div className={`mt-7 border p-5 ${index === 1 ? "border-[#47206e] bg-white" : "border-white/50 bg-white text-[#32104f]"}`}>
                    <p className="font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#ef2b37]">Hours</p>
                    <dl className="mt-3 grid gap-x-7 text-sm sm:grid-cols-2">
                      {location.hours.map(([day, hours]) => <div key={day} className="flex justify-between gap-4 border-b border-[#47206e]/20 py-2 font-home-body"><dt className="font-bold">{day}</dt><dd className="text-right tabular-nums">{hours}</dd></div>)}
                    </dl>
                  </div>
                ) : <p className={`mt-7 border p-4 font-home-body text-sm ${index === 1 ? "border-[#47206e]" : "border-white/50"}`}>Hours are not listed here. Call before visiting in the evening.</p>}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center bg-[#47206e] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#32104f]">Open in Maps →</a>
                  {"phone" in location && location.phone && <a href={`tel:${location.phone.replace(/\s+/g, "")}`} className={`inline-flex min-h-12 items-center justify-center border px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] ${index === 1 ? "border-[#47206e] text-[#47206e]" : "border-white text-white"}`}>Call {location.phone}</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
