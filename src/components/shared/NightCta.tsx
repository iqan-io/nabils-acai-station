import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";

export function NightCta({ secondaryHref, secondaryLabel }: { secondaryHref: string; secondaryLabel: string }) {
  return (
    <section className="grid border-y-2 border-[#47206e] bg-[#47206e] text-white md:grid-cols-[0.72fr_1.28fr]">
      <div className="relative min-h-[22rem] border-b-2 border-white/40 md:border-b-0 md:border-r-2">
        <Image src="/images/enhanced/strawberry-cup-neon.jpg" alt="Nabil's Viral Dubai Strawberry Cup" fill quality={90} sizes="(max-width: 767px) 100vw, 42vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
        <p className="font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#c4dc67]">Made for sweet moments</p>
        <h2 className="mt-4 max-w-2xl font-home-display text-3xl leading-[1.05] md:text-5xl">Your next favourite is waiting.</h2>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={brand.orderUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center bg-[#f3c52f] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#32104f] hover:bg-[#c4dc67]">Order on Uber Eats</a>
          <Link href={secondaryHref} className="inline-flex min-h-12 items-center justify-center border border-white px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-white hover:text-[#47206e]">{secondaryLabel}</Link>
        </div>
      </div>
    </section>
  );
}
