import { brand, locations } from "@/lib/brand";
import { SiDoordash, SiUbereats } from "react-icons/si";

const delivery = [
  { name: "Uber Eats", url: brand.orderUrl, note: "Choose your available Nabil's location in Uber Eats.", logo: SiUbereats, colour: "#06C167" },
  { name: "DoorDash", url: brand.doordashUrl, note: "Ballajura delivery through DoorDash.", logo: SiDoordash, colour: "#FF3008" },
];

export function OrderHero() {
  return (
    <section className="grid min-h-[32rem] border-b-2 border-[#47206e] bg-[#47206e] text-white lg:grid-cols-[1fr_0.7fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2))]">
        <p className="font-home-body text-sm font-bold uppercase tracking-[0.12em] text-[#c4dc67]">Order Nabil&apos;s</p>
        <h1 className="mt-5 max-w-2xl font-home-display text-[clamp(2.6rem,6.5vw,4.5rem)] leading-[1.02]">Get the good stuff.</h1>
        <p className="mt-7 max-w-[52ch] font-home-body text-lg leading-8 text-white/85">Choose delivery, get directions for pickup, or browse the menu before the group chat changes its mind.</p>
      </div>
      <div className="flex items-center justify-center border-t-2 border-white/45 bg-[#ef2b37] p-10 lg:border-l-2 lg:border-t-0">
        <div className="font-home-display text-[clamp(2.75rem,7.5vw,6rem)] leading-[1.04] text-[#f3c52f]">Order.<br />Eat.<br />Repeat.</div>
      </div>
    </section>
  );
}

export function OrderInfo() {
  return (
    <section className="bg-white text-[#32104f]">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-2 md:py-24 lg:px-10">
        <article className="border-2 border-[#47206e] bg-[#f3c52f] p-7 sm:p-10">
          <p className="font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#ef2b37]">Delivery</p>
          <h2 className="mt-4 font-home-display text-3xl leading-[1.05] text-[#47206e]">Bring Nabil&apos;s to you.</h2>
          <ul className="mt-7 border-t-2 border-[#47206e]">
            {delivery.map((item) => {
              const Logo = item.logo;
              return (
                <li key={item.name} className="border-b-2 border-[#47206e] bg-white">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-28 items-center justify-between gap-5 p-5">
                    <span className="flex min-w-0 items-center gap-4">
                      <Logo aria-hidden className="size-9 shrink-0" style={{ color: item.colour }} />
                      <span><span className="block font-home-display text-2xl leading-[1.15] text-[#47206e]">{item.name}</span><span className="mt-2 block font-home-body text-sm leading-5 text-[#32104f]/68">{item.note}</span></span>
                    </span>
                    <span aria-hidden className="text-2xl text-[#ef2b37] transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 font-home-body text-xs leading-5 text-[#32104f]/65">Availability varies by platform, location and time.</p>
        </article>

        <article className="border-2 border-[#47206e] bg-[#c4dc67] p-7 sm:p-10">
          <p className="font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#ef2b37]">Pick up</p>
          <h2 className="mt-4 font-home-display text-3xl leading-[1.05] text-[#47206e]">Head to the counter.</h2>
          <ul className="mt-7 border-t-2 border-[#47206e]">
            {locations.map((location) => (
              <li key={location.slug} className="border-b-2 border-[#47206e] bg-white p-5">
                <h3 className="font-home-display text-2xl leading-[1.15] text-[#47206e]">{location.name}</h3>
                <p className="mt-2 font-home-body text-sm leading-6 text-[#32104f]/72">{location.address}</p>
                <div className="mt-4 flex flex-wrap gap-4 font-home-body text-sm font-bold text-[#ef2b37]">
                  <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">Directions ↗</a>
                  {"phone" in location && location.phone && <a href={`tel:${location.phone.replace(/\s+/g, "")}`} className="underline-offset-4 hover:underline">Call {location.phone}</a>}
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
