import Image from "next/image";
import { founder } from "@/lib/brand";

export function AboutHero() {
  return (
    <section className="grid min-h-[35rem] border-b-2 border-[#47206e] bg-[#ef2b37] text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2))]">
        <p className="font-home-body text-sm font-bold uppercase tracking-[0.12em] text-[#f3c52f]">Our story</p>
        <h1 className="mt-5 max-w-2xl font-home-display text-[clamp(5rem,11vw,9rem)] leading-[0.78]">Family shop. Big sweet energy.</h1>
        <p className="mt-7 max-w-[54ch] font-home-body text-lg leading-8 text-white/90">From a Lebanese sweets stall in Ballajura to Perth&apos;s viral açaí and Dubai chocolate—same family, same kitchen, made for sweet moments.</p>
      </div>
      <div className="relative min-h-[28rem] border-t-2 border-[#47206e] lg:border-l-2 lg:border-t-0">
        <Image src="/images/interior-neon.jpg" alt="Inside Nabil's Açaí Station in Mount Lawley" fill priority quality={90} sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
        <span className="absolute bottom-5 right-5 bg-[#c4dc67] px-5 py-3 font-home-display text-3xl text-[#47206e]">Made for sweet moments.</span>
      </div>
    </section>
  );
}

export function FounderFeature() {
  return (
    <section className="bg-[#f3c52f] text-[#32104f]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-10">
        <div className="grid border-2 border-[#47206e] bg-white lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-[34rem] border-b-2 border-[#47206e] lg:border-b-0 lg:border-r-2">
            <Image src={founder.photo} alt={`${founder.name}, ${founder.role} of Nabil's Açaí Station`} fill quality={90} sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover object-top" />
            <div className="absolute bottom-0 left-0 bg-[#47206e] px-5 py-3 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-white">{founder.name} · {founder.role}</div>
          </div>
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#ef2b37]">Meet the owner</p>
            <h2 className="mt-4 font-home-display text-7xl leading-[0.84] text-[#47206e] md:text-8xl">{founder.name}</h2>
            <div className="mt-7 max-w-2xl space-y-5 font-home-body text-lg leading-8 text-[#32104f]/82">
              {founder.bio.map((para, index) => <p key={index}>{para}</p>)}
            </div>
            {founder.pullQuote && <blockquote className="mt-9 border-2 border-[#47206e] bg-[#c4dc67] p-6 font-home-display text-4xl leading-[0.95] text-[#47206e]">{founder.pullQuote}</blockquote>}
          </div>
        </div>
      </div>
    </section>
  );
}
