import Image from "next/image";
import Link from "next/link";
import { menu, menuSlug, type MenuSection } from "@/lib/brand";
import { PageHero } from "@/components/shared/PageHero";

const featuredImage: Record<
  string,
  { src: string; alt: string; landscape?: boolean }
> = {
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
    landscape: true,
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

function MenuCard({ section }: { section: MenuSection }) {
  const media = featuredImage[section.title];

  return (
    <article
      id={menuSlug(section.title)}
      className="mb-6 break-inside-avoid scroll-mt-36 overflow-hidden rounded-2xl border border-[var(--c-line)] bg-[var(--c-card)]"
    >
      {media && (
        <div
          className={`relative overflow-hidden ${
            media.landscape ? "aspect-[16/9]" : "aspect-[4/3]"
          }`}
        >
          <Image
            src={media.src}
            alt={media.alt}
            fill
            quality={90}
            sizes="(max-width: 767px) 100vw, 540px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <header className="border-b border-[var(--c-line)] pb-4">
          <h2 className="text-[1.5rem] leading-tight text-[var(--c-ink)] [text-transform:none]">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-2 max-w-[52ch] text-[0.88rem] leading-relaxed text-[var(--c-ink-2)]">
              {section.subtitle}
            </p>
          )}
        </header>

        <ul className="divide-y divide-[var(--c-line)]">
          {section.items.map((item) => (
            <li key={item.name} className="py-3">
              <div className="flex items-baseline gap-3">
                <span className="text-[0.98rem] font-semibold leading-snug text-[var(--c-ink)]">
                  {item.name}
                </span>
                {item.price && (
                  <>
                    <span
                      aria-hidden
                      className="mb-1 flex-1 border-b border-dotted border-[var(--c-line-2)]"
                    />
                    <span
                      className="shrink-0 font-bold tabular-nums text-[var(--c-grape)]"
                      style={{ fontFamily: "var(--font-counter-data)" }}
                    >
                      {item.price}
                    </span>
                  </>
                )}
              </div>
              {item.note && (
                <p className="mt-1 text-[0.85rem] leading-relaxed text-[var(--c-ink-3)]">
                  {item.note}
                </p>
              )}
            </li>
          ))}
        </ul>

        {section.footnote && (
          <p className="border-t border-[var(--c-line)] pt-3.5 text-[0.8rem] leading-relaxed text-[var(--c-ink-3)]">
            {section.footnote}
          </p>
        )}
      </div>
    </article>
  );
}

export function MenuHero() {
  return (
    <PageHero
      eyebrow="The full menu · prices in AUD"
      title="Everything on the counter."
      lead="Açaí built your way, loaded crêpes, Dubai chocolate, fruit cocktails, matcha, mocktails and more. Made to order, subject to availability."
      image={{
        src: "/images/enhanced/strawberry-cup-neon.jpg",
        alt: "Nabil's Viral Dubai Strawberry Cup",
      }}
    />
  );
}

export function MenuFull() {
  return (
    <section
      className="bg-[var(--c-paper)]"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="md:columns-2 md:gap-6">
          {menu.map((section) => (
            <MenuCard key={section.title} section={section} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[var(--c-line)] bg-[var(--c-card)] p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[1.35rem] text-[var(--c-ink)] [text-transform:none]">
              Mount Lawley or Ballajura?
            </h2>
            <p className="mt-1 text-[0.92rem] text-[var(--c-ink-2)]">
              Both counters run the same menu.
            </p>
          </div>
          <Link
            href="/locations"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[var(--c-ink)] px-5 text-[0.88rem] font-bold text-white transition-colors hover:bg-[var(--c-grape)]"
          >
            Hours and directions →
          </Link>
        </div>
      </div>
    </section>
  );
}
