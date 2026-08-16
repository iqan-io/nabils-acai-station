import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export function SpecialsComingSoon() {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] border-b-2 border-[#47206e] bg-[#c4dc67] lg:grid-cols-[1fr_0.85fr]">
      <section className="flex flex-col justify-center px-6 py-20 sm:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2))]">
        <p className="font-home-body text-sm font-bold uppercase tracking-[0.12em] text-[#ef2b37]">Drops + limited runs</p>
        <h1 className="mt-5 max-w-3xl font-home-display text-[clamp(2.6rem,6.5vw,5rem)] leading-[1.02] text-[#47206e]">New sweets land fast.</h1>
        <p className="mt-7 max-w-[52ch] font-home-body text-lg leading-8 text-[#32104f]">Seasonal flavours, Dubai chocolate drops and one-off experiments show up on Instagram first. The everyday favourites are always on the menu.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center bg-[#ef2b37] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#47206e]">Follow on Instagram ↗</a>
          <Link href="/menu" className="inline-flex min-h-12 items-center justify-center border-2 border-[#47206e] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#47206e] hover:bg-white">Browse the menu</Link>
        </div>
      </section>
      <div className="relative min-h-[32rem] border-t-2 border-[#47206e] lg:border-l-2 lg:border-t-0">
        <Image src="/images/enhanced/menu-dubai-chocolate.png" alt="Nabil's pistachio-filled Dubai chocolate" fill priority quality={90} sizes="(max-width: 1023px) 100vw, 46vw" className="object-cover" />
        <span className="absolute bottom-5 left-5 bg-[#f3c52f] px-5 py-3 font-home-display text-xl text-[#47206e]">Follow the fresh stuff.</span>
      </div>
    </main>
  );
}
