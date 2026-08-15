import Image from "next/image";
import Link from "next/link";
import { menu, menuSlug, type MenuSection } from "@/lib/brand";

const featuredImage: Record<string, { src: string; alt: string; landscape?: boolean }> = {
  "Açaí — Build Your Own": { src: "/images/enhanced/menu-acai.png", alt: "A Nabil's açaí bowl topped with strawberries, banana and chocolate drizzle" },
  "Classic Crêpes": { src: "/images/enhanced/menu-classic-crepe.png", alt: "A classic Nabil's crêpe with strawberries, banana and sauce" },
  "Signature Crêpes": { src: "/images/enhanced/menu-signature-crepe.png", alt: "A signature Nabil's crêpe with pistachio, chocolate and crushed nuts" },
  "Strawberry Cups": { src: "/images/enhanced/menu-strawberry-cup.png", alt: "A Nabil's strawberry cup with milk chocolate and pistachio" },
  "Dubai Chocolate": { src: "/images/enhanced/menu-dubai-chocolate.png", alt: "Nabil's pistachio-filled Dubai chocolate" },
  Brownies: { src: "/images/enhanced/menu-brownie.png", alt: "A Nabil's brownie dessert with milk chocolate and pistachio" },
  "Fruit Cocktails": { src: "/images/enhanced/fruit-cocktail-client-enhanced.jpg", alt: "A Nabil's fruit cocktail layered with fruit, ashta, cashew and honey" },
  "Waffle Snack Pack": { src: "/images/enhanced/menu-waffle-snack-pack.png", alt: "A waffle snack pack with strawberries, banana and drizzle", landscape: true },
  Mocktails: { src: "/images/enhanced/menu-mocktails.png", alt: "A bright Nabil's mocktail over ice" },
  "Probiotic Splash": { src: "/images/enhanced/menu-probiotic-splash.png", alt: "Two sparkling probiotic splash drinks with citrus and ice" },
};

const accents = ["#47206e", "#ef2b37", "#c4dc67", "#f3c52f"];

function MenuCard({ section, index }: { section: MenuSection; index: number }) {
  const media = featuredImage[section.title];
  const accent = accents[index % accents.length];

  return (
    <article id={menuSlug(section.title)} className="mb-6 break-inside-avoid scroll-mt-36 border-2 border-[#47206e] bg-white md:mb-7">
      {media && (
        <div className={`relative overflow-hidden border-b-2 border-[#47206e] ${media.landscape ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
          <Image src={media.src} alt={media.alt} fill quality={90} sizes="(max-width: 767px) 100vw, 540px" className="object-cover" />
          <span className="absolute left-0 top-0 px-4 py-2 font-home-body text-xs font-bold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: accent }}>
            Nabil&apos;s pick
          </span>
        </div>
      )}
      <div className="p-6 sm:p-7">
        <header className="border-b border-[#47206e]/25 pb-5">
          <h2 className="font-home-display text-[2.7rem] leading-[0.9] text-[#47206e] sm:text-[3.2rem]">{section.title}</h2>
          {section.subtitle && <p className="mt-4 max-w-[52ch] font-home-body text-sm leading-6 text-[#32104f]/72">{section.subtitle}</p>}
        </header>
        <ul className="divide-y divide-[#47206e]/18">
          {section.items.map((item) => (
            <li key={item.name} className="py-4">
              <div className="flex items-baseline gap-3 font-home-body">
                <span className="text-base font-bold leading-snug text-[#32104f]">{item.name}</span>
                {item.price && <><span aria-hidden className="mb-1 flex-1 border-b border-dotted border-[#47206e]/30" /><span className="shrink-0 font-bold tabular-nums text-[#ef2b37]">{item.price}</span></>}
              </div>
              {item.note && <p className="mt-1 font-home-body text-sm leading-5 text-[#32104f]/65">{item.note}</p>}
            </li>
          ))}
        </ul>
        {section.footnote && <p className="border-t border-[#47206e]/25 pt-4 font-home-body text-xs leading-5 text-[#32104f]/65">{section.footnote}</p>}
      </div>
    </article>
  );
}

export function MenuHero() {
  return (
    <section className="grid min-h-[36rem] border-b-2 border-[#47206e] bg-[#f3c52f] lg:grid-cols-[0.9fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-[max(2.5rem,calc((100vw-80rem)/2))]">
        <p className="font-home-body text-sm font-bold uppercase tracking-[0.12em] text-[#ef2b37]">The full menu · Prices in AUD</p>
        <h1 className="mt-5 max-w-xl font-home-display text-[clamp(5rem,11vw,9rem)] leading-[0.78] text-[#47206e]">Pick your sweet.</h1>
        <p className="mt-7 max-w-[52ch] font-home-body text-lg leading-8 text-[#32104f]">Açaí built your way, loaded crêpes, Dubai chocolate, fruit cocktails, matcha, mocktails and more.</p>
        <p className="mt-5 font-home-body text-xs font-bold uppercase tracking-[0.1em] text-[#32104f]/65">Made to order · Subject to availability</p>
      </div>
      <div className="relative min-h-[28rem] border-t-2 border-[#47206e] lg:border-l-2 lg:border-t-0">
        <Image src="/images/enhanced/strawberry-cup-neon.jpg" alt="Nabil's Viral Dubai Strawberry Cup" fill priority quality={90} sizes="(max-width: 1023px) 100vw, 55vw" className="object-cover" />
        <div className="absolute bottom-5 right-5 bg-[#ef2b37] px-5 py-3 font-home-display text-3xl text-white">Fresh. Loaded. Yours.</div>
      </div>
    </section>
  );
}

export function MenuFull() {
  return (
    <section className="bg-[#f7f7f3] text-[#32104f]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-10">
        <div className="mb-12 grid gap-5 border-b-2 border-[#47206e] pb-8 md:grid-cols-[1fr_0.55fr] md:items-end">
          <h2 className="font-home-display text-6xl leading-[0.86] text-[#47206e] md:text-8xl">Every kind of craving.</h2>
          <p className="font-home-body text-base leading-7 text-[#32104f]/72">Jump with the category bar or browse the full counter below. Every price and option comes from Nabil&apos;s current menu.</p>
        </div>
        <div className="md:columns-2 md:gap-7">
          {menu.map((section, index) => <MenuCard key={section.title} section={section} index={index} />)}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t-2 border-[#47206e] bg-[#c4dc67] p-7 sm:flex-row sm:items-center">
          <p className="font-home-display text-4xl leading-none text-[#47206e]">Mount Lawley or Ballajura?</p>
          <Link href="/locations" className="inline-flex min-h-12 items-center justify-center bg-[#47206e] px-7 font-home-body text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#ef2b37]">Find your station →</Link>
        </div>
      </div>
    </section>
  );
}
