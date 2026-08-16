import Image from "next/image";
import Link from "next/link";

export function FinalCta() {
  return (
    <section className="grid border-y-2 border-[#47206e] bg-[#c4dc67] text-[#32104f] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:pl-[max(4rem,calc((100vw-80rem)/2))]">
        <p className="font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#ef2b37]">Come say hi</p>
        <h2 className="mt-4 max-w-3xl font-home-display text-4xl leading-[1.05] text-[#47206e] md:text-6xl">The menu is calling.</h2>
        <p className="mt-6 max-w-xl font-home-body text-lg leading-8 text-[#32104f]/80">Walk in, order delivery or pick the sweet you&apos;re thinking about before someone else adds three toppings.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/menu" className="inline-flex min-h-12 items-center justify-center bg-[#47206e] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-[#ef2b37]">View the menu →</Link>
          <Link href="/locations" className="inline-flex min-h-12 items-center justify-center border-2 border-[#47206e] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-[#47206e] hover:bg-white">Find a store</Link>
        </div>
      </div>
      <div className="relative min-h-[28rem] border-t-2 border-[#47206e] lg:border-l-2 lg:border-t-0">
        <Image src="/images/enhanced/fruit-cocktail-client-enhanced.jpg" alt="Nabil's fruit cocktail layered with fruit, ashta, cashew and pistachio" fill quality={90} sizes="(max-width: 1023px) 100vw, 45vw" className="object-cover" />
        <Image src="/images/logo-192.png" alt="" width={112} height={112} unoptimized className="absolute bottom-5 right-5 size-28 object-contain" />
      </div>
    </section>
  );
}
