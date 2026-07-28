import Image from "next/image";
import Link from "next/link";
import { menu, menuSlug, type MenuSection } from "@/lib/brand";

const featuredImage: Record<string, { src: string; alt: string; frameClass?: string }> = {
  "Açaí — Build Your Own": {
    src: "/images/enhanced/menu-acai.png",
    alt: "A Nabil's açaí bowl topped with strawberries, banana and chocolate drizzle",
  },
  "Classic Crêpes": {
    src: "/images/enhanced/menu-classic-crepe.png",
    alt: "A classic Nabil's crêpe with strawberries, banana and sauce",
  },
  "Signature Crêpes": {
    src: "/images/enhanced/menu-signature-crepe.png",
    alt: "A signature Nabil's crêpe with pistachio, chocolate and crushed nuts",
  },
  "Strawberry Cups": {
    src: "/images/enhanced/menu-strawberry-cup.png",
    alt: "A Nabil's strawberry cup with milk chocolate and pistachio",
  },
  "Dubai Chocolate": {
    src: "/images/enhanced/menu-dubai-chocolate.png",
    alt: "Nabil's pistachio-filled Dubai chocolate",
  },
  Brownies: {
    src: "/images/enhanced/menu-brownie.png",
    alt: "A Nabil's brownie dessert with milk chocolate and pistachio",
  },
  "Fruit Cocktails": {
    src: "/images/enhanced/fruit-cocktail-client-enhanced.jpg",
    alt: "A Nabil's fruit cocktail layered with fruit, ashta, cashew and honey",
  },
  "Waffle Snack Pack": {
    src: "/images/enhanced/menu-waffle-snack-pack.png",
    alt: "A waffle snack pack with strawberries, banana and drizzle",
    frameClass: "aspect-[4/3]",
  },
  Mocktails: {
    src: "/images/enhanced/menu-mocktails.png",
    alt: "A bright Nabil's mocktail over ice",
  },
  "Probiotic Splash": {
    src: "/images/enhanced/menu-probiotic-splash.png",
    alt: "Two sparkling probiotic splash drinks with citrus and ice",
  },
};

const sectionAccent: Record<string, string> = {
  "Açaí — Build Your Own": "var(--arch-mauve)",
  "Classic Crêpes": "var(--honey)",
  "Signature Crêpes": "var(--honey)",
  "Waffle Snack Pack": "var(--honey)",
  "Strawberry Cups": "var(--strawberry)",
  "Dubai Chocolate": "var(--strawberry)",
  Brownies: "var(--strawberry)",
  "Fruit Cocktails": "var(--pistachio)",
  Matcha: "var(--pistachio)",
  Mocktails: "var(--pistachio)",
  "Iced Lattes": "var(--pistachio)",
  Milkshakes: "var(--pistachio)",
  "Probiotic Splash": "var(--pistachio)",
};

function MenuCard({ section }: { section: MenuSection }) {
  const media = featuredImage[section.title];
  const accent = sectionAccent[section.title] ?? "var(--arch-mauve)";

  return (
    <article id={menuSlug(section.title)} className="mb-6 break-inside-avoid scroll-mt-36 md:mb-7">
      <div
        className={`overflow-hidden border border-[var(--cream)]/12 bg-[var(--deep-plum)] shadow-[0_28px_70px_-42px_rgba(0,0,0,0.9)] ${
          media ? "night-arch" : "rounded-[1.5rem]"
        }`}
      >
        {media && (
          <div className={`relative overflow-hidden bg-[var(--night-plum)] ${media.frameClass ?? "aspect-[3/4]"}`}>
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="(max-width: 767px) 100vw, 540px"
              quality={90}
              className="object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--deep-plum)]/45 via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 sm:p-7">
          <header className="flex items-start gap-4">
            <span
              aria-hidden
              className="mt-2.5 size-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <div>
              <h2 className="font-display text-[2rem] leading-[1.02] text-[var(--cream)] sm:text-[2.25rem]">
                {section.title}
              </h2>
              {section.subtitle && (
                <p className="mt-3 max-w-[52ch] text-sm leading-6 text-[var(--cream)]/62">
                  {section.subtitle}
                </p>
              )}
            </div>
          </header>

          <ul className="mt-5 divide-y divide-[var(--cream)]/10">
            {section.items.map((item) => (
              <li key={item.name} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-[0.98rem] font-medium leading-snug text-[var(--cream)]">
                    {item.name}
                  </span>
                  {item.price && (
                    <>
                      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-[var(--cream)]/18" />
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-[var(--gold-highlight)]">
                        {item.price}
                      </span>
                    </>
                  )}
                </div>
                {item.note && (
                  <p className="mt-1 max-w-[56ch] text-[0.82rem] leading-5 text-[var(--cream)]/52">
                    {item.note}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {section.footnote && (
            <p className="mt-5 border-t border-[var(--cream)]/12 pt-4 text-xs leading-5 text-[var(--cream)]/55">
              {section.footnote}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function MenuHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--night-plum)] text-[var(--cream)]">
      <div aria-hidden className="night-grain pointer-events-none absolute inset-0 opacity-[0.04]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 top-16 size-[32rem] rounded-full bg-[var(--arch-mauve)]/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24 lg:px-10 lg:py-28">
        <div>
          <p className="night-label text-[var(--gold-highlight)]">The full menu</p>
          <h1 className="mt-6 max-w-2xl font-display text-[clamp(3.6rem,8vw,6rem)] leading-[0.9] text-[var(--cream)]">
            Sweet moments, <span className="italic text-[var(--gold-highlight)]">made to order.</span>
          </h1>
          <p className="mt-7 max-w-[58ch] text-base leading-7 text-[var(--cream)]/68 md:text-lg md:leading-8">
            Açaí built your way, classic and signature crêpes, Dubai chocolate, fruit cocktails, matcha, mocktails and more.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[var(--cream)]/45">
            Prices in AUD · Subject to availability
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[28rem]">
          <div aria-hidden className="absolute -inset-3 rounded-t-[999px] rounded-b-[1.75rem] border border-[var(--gold-highlight)]/35" />
          <div className="night-arch relative aspect-[4/5] overflow-hidden bg-[var(--deep-plum)]">
            <Image
              src="/images/enhanced/strawberry-cup-neon.jpg"
              alt="Nabil's Viral Dubai Strawberry Cup"
              fill
              priority
              sizes="(max-width: 767px) 90vw, 448px"
              quality={90}
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--night-plum)]/45 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function MenuFull() {
  return (
    <section className="relative overflow-hidden bg-[var(--night-plum)] text-[var(--cream)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--deep-plum)]/55 to-transparent" />
      <div
        className="relative mx-auto px-6 py-16 md:py-24 lg:px-10"
        style={{ maxWidth: "70rem" }}
      >
        <div className="mb-12 flex flex-col gap-5 border-b border-[var(--cream)]/14 pb-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl font-display text-4xl leading-none text-[var(--cream)] md:text-5xl">
            Pick your <span className="italic text-[var(--gold-highlight)]">ritual.</span>
          </h2>
          <p className="max-w-sm text-sm leading-6 text-[var(--cream)]/56">
            Use the category bar to jump straight to what you came for.
          </p>
        </div>

        <div className="md:columns-2 md:gap-7">
          {menu.map((section) => (
            <MenuCard key={section.title} section={section} />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-[var(--cream)]/14 pt-9 sm:flex-row sm:items-center">
          <p className="max-w-xl font-display text-2xl italic text-[var(--cream)]/82 md:text-3xl">
            Find Nabil&apos;s in Mount Lawley and Ballajura.
          </p>
          <Link
            href="/locations"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[var(--honey)] px-7 text-xs font-bold uppercase tracking-[0.18em] text-[var(--night-plum)] transition-colors hover:bg-[var(--gold-highlight)]"
          >
            Find a store →
          </Link>
        </div>
      </div>
    </section>
  );
}
