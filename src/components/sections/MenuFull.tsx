import Image from "next/image";
import Link from "next/link";
import { menu, menuSlug, type MenuSection } from "@/lib/brand";
import { Sparkle, PalmFrond } from "@/components/shared/Ornaments";

// Only the strongest, enhanced food shots earn an image. Sections not listed
// here render as clean text cards — this is what kills the old dead space:
// images are no longer forced one-per-section regardless of list length.
const featuredImage: Record<
  string,
  { src: string; alt: string; frameClass?: string }
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
    alt: "A signature Nabil's crêpe finished with pistachio, chocolate drizzle and crushed nuts",
  },
  "Strawberry Cups": {
    src: "/images/enhanced/menu-strawberry-cup.png",
    alt: "A Nabil's strawberry cup topped with milk chocolate and pistachio",
  },
  "Dubai Chocolate": {
    src: "/images/enhanced/menu-dubai-chocolate.png",
    alt: "Nabil's pistachio milk chocolate bar with Dubai chocolate pieces",
  },
  "Brownies": {
    src: "/images/enhanced/menu-brownie.png",
    alt: "A Nabil's brownie dessert topped with glossy milk chocolate and crushed pistachio",
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
  "Mocktails": {
    src: "/images/enhanced/menu-mocktails.png",
    alt: "A bright Nabil's mocktail over ice on the counter",
  },
  "Probiotic Splash": {
    src: "/images/enhanced/menu-probiotic-splash.png",
    alt: "Two sparkling probiotic splash drinks with citrus, ice and condensation",
  },
};

// Each menu section carries a category colour, shown as a thin accent edge on
// the card. This pulls the otherwise-unused strawberry / pistachio / cedar into
// the palette and gives the long menu a colour rhythm that aids scanning:
// purple = açaí, warm honey = crêpes/waffles, strawberry = chocolate & sweets,
// pistachio = fruit, cedar green = drinks. (Edge only — text stays high-contrast.)
const sectionAccent: Record<string, string> = {
  "Açaí — Build Your Own": "var(--acai)",
  "Classic Crêpes": "var(--honey)",
  "Signature Crêpes": "var(--honey)",
  "Waffle Snack Pack": "var(--honey)",
  "Strawberry Cups": "var(--strawberry)",
  "Dubai Chocolate": "var(--strawberry)",
  Brownies: "var(--strawberry)",
  "Fruit Cocktails": "var(--pistachio)",
  Mocktails: "var(--cedar)",
  "Probiotic Splash": "var(--cedar)",
  Matcha: "var(--cedar)",
  "Iced Lattes": "var(--cedar)",
  Milkshakes: "var(--cedar)",
};

function accentFor(title: string): string {
  return sectionAccent[title] ?? "var(--acai)";
}

const mobileSectionOrder = [
  "Açaí — Build Your Own",
  "Dubai Chocolate",
  "Strawberry Cups",
  "Brownies",
  "Classic Crêpes",
  "Signature Crêpes",
  "Waffle Snack Pack",
  "Fruit Cocktails",
  "Mocktails",
  "Probiotic Splash",
  "Matcha",
  "Iced Lattes",
  "Milkshakes",
] as const;

const desktopSectionColumns = [
  [
    "Açaí — Build Your Own",
    "Strawberry Cups",
    "Classic Crêpes",
    "Signature Crêpes",
    "Fruit Cocktails",
  ],
  [
    "Dubai Chocolate",
    "Brownies",
    "Waffle Snack Pack",
    "Mocktails",
    "Probiotic Splash",
    "Matcha",
    "Iced Lattes",
    "Milkshakes",
  ],
] as const;

const menuByTitle = new Map(menu.map((section) => [section.title, section]));

function getOrderedSections(titles: readonly string[]) {
  return titles
    .map((title) => menuByTitle.get(title))
    .filter((section): section is MenuSection => Boolean(section));
}

const mobileMenuSections = getOrderedSections(mobileSectionOrder);
const desktopMenuColumns = desktopSectionColumns.map(getOrderedSections);

function MenuSectionCard({ section }: { section: MenuSection }) {
  const media = featuredImage[section.title];

  return (
    <article
      id={menuSlug(section.title)}
      className="break-inside-avoid scroll-mt-36"
    >
      <div
        className="overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-[var(--acai)]/12 shadow-[0_22px_55px_-38px_rgba(31,11,37,0.55)]"
        style={{ borderTop: `3px solid ${accentFor(section.title)}` }}
      >
        {media && (
          <div
            className={`relative ${
              media.frameClass ?? "aspect-[3/4]"
            } overflow-hidden bg-[var(--cream-warm)]`}
          >
            {/* Most source shots are portrait; waffle uses its own
                landscape frame so it does not get over-cropped. */}
            <Image
              src={media.src}
              alt={media.alt}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0 ring-1 ring-inset ring-[var(--acai-deep)]/10"
            />
          </div>
        )}

        <div className="p-6 md:p-7">
          <header>
            <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-[var(--acai)]/55">
              <Sparkle className="size-2.5 text-[var(--saffron)]" />
              Menu
            </div>
            <h2 className="mt-2 font-display text-2xl tracking-tight text-[var(--acai-deep)] md:text-3xl">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="mt-2 text-sm italic leading-relaxed text-[var(--acai-deep)]/70">
                {section.subtitle}
              </p>
            )}
          </header>

          <ul className="mt-5">
            {section.items.map((item) => (
              <li key={item.name} className="py-2.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[1.05rem] leading-tight text-[var(--acai-deep)]">
                    {item.name}
                  </span>
                  {item.price && (
                    <>
                      <span
                        aria-hidden
                        className="mb-1 flex-1 border-b border-dotted border-[var(--acai)]/30"
                      />
                      <span className="shrink-0 font-semibold text-sm tracking-wide text-[var(--acai)]">
                        {item.price}
                      </span>
                    </>
                  )}
                </div>
                {item.note && (
                  <p className="mt-0.5 text-[0.85rem] leading-snug text-[var(--acai-deep)]/65">
                    {item.note}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {section.footnote && (
            <p className="mt-4 border-t border-[var(--acai)]/10 pt-4 text-xs italic leading-relaxed text-[var(--acai-deep)]/70">
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
    <section className="relative overflow-hidden bg-[var(--acai-deep)] text-[var(--cream)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-sunburst-acai"
      />
      <PalmFrond
        className="pointer-events-none absolute -top-2 -left-6 h-24 w-56 text-[var(--cedar)]/40"
      />
      <PalmFrond
        flip
        className="pointer-events-none absolute -top-2 -right-6 h-24 w-56 text-[var(--cedar)]/40"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 text-center md:py-28 lg:px-10">
        <div className="flex items-center justify-center gap-2 text-[0.7rem] uppercase tracking-[0.32em] text-[var(--saffron)]">
          <Sparkle className="size-3 text-[var(--saffron)]" />
          The full menu
          <Sparkle className="size-3 text-[var(--saffron)]" />
        </div>
        <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight md:text-7xl">
          Everything <span className="italic text-[var(--honey)]">we make</span>.
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-base leading-relaxed text-[var(--lavender)] md:text-lg">
          Açaí built your way, classic and signature crêpes, the Dubai
          chocolate range, fruit cocktails, matcha, mocktails and more.
          Prices in AUD. Subject to availability — viral items go fast.
        </p>
        {/* Section jump-links live in the sticky category bar below the hero. */}
      </div>
    </section>
  );
}

export function MenuFull() {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-sunburst-cream opacity-60"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28 lg:px-10">
        <div className="space-y-6 md:hidden">
          {mobileMenuSections.map((section) => {
            const media = featuredImage[section.title];
            return (
              <article
                key={section.title}
                data-anchor={menuSlug(section.title)}
                className="break-inside-avoid scroll-mt-36"
              >
                <div
                  className="overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-[var(--acai)]/12 shadow-[0_22px_55px_-38px_rgba(31,11,37,0.55)]"
                  style={{ borderTop: `3px solid ${accentFor(section.title)}` }}
                >
                  {media && (
                    <div
                      className={`relative ${
                        media.frameClass ?? "aspect-[3/4]"
                      } overflow-hidden bg-[var(--cream-warm)]`}
                    >
                      {/* Most source shots are portrait; waffle uses its own
                          landscape frame so it does not get over-cropped. */}
                      <Image
                        src={media.src}
                        alt={media.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 512px"
                        className="object-cover object-center"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 ring-1 ring-inset ring-[var(--acai-deep)]/10"
                      />
                    </div>
                  )}

                  <div className="p-6 md:p-7">
                    <header>
                      <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.28em] text-[var(--acai)]/55">
                        <Sparkle className="size-2.5 text-[var(--saffron)]" />
                        Menu
                      </div>
                      <h2 className="mt-2 font-display text-2xl tracking-tight text-[var(--acai-deep)] md:text-3xl">
                        {section.title}
                      </h2>
                      {section.subtitle && (
                        <p className="mt-2 text-sm italic leading-relaxed text-[var(--acai-deep)]/70">
                          {section.subtitle}
                        </p>
                      )}
                    </header>

                    <ul className="mt-5">
                      {section.items.map((item) => (
                        <li key={item.name} className="py-2.5">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-[1.05rem] leading-tight text-[var(--acai-deep)]">
                              {item.name}
                            </span>
                            {item.price && (
                              <>
                                <span
                                  aria-hidden
                                  className="mb-1 flex-1 border-b border-dotted border-[var(--acai)]/30"
                                />
                                <span className="shrink-0 font-semibold text-sm tracking-wide text-[var(--acai)]">
                                  {item.price}
                                </span>
                              </>
                            )}
                          </div>
                          {item.note && (
                            <p className="mt-0.5 text-[0.85rem] leading-snug text-[var(--acai-deep)]/65">
                              {item.note}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>

                    {section.footnote && (
                      <p className="mt-4 border-t border-[var(--acai)]/10 pt-4 text-xs italic leading-relaxed text-[var(--acai-deep)]/70">
                        {section.footnote}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="hidden gap-7 md:grid md:grid-cols-2 md:items-start">
          {desktopMenuColumns.map((sections, columnIndex) => (
            <div key={columnIndex} className="space-y-7">
              {sections.map((section) => (
                <MenuSectionCard key={section.title} section={section} />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-4 border-t border-[var(--acai)]/15 pt-12 text-center">
          <p className="font-display text-2xl italic text-[var(--acai-deep)] md:text-3xl">
            Allergens, swaps, anything custom — just ask at the counter.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--acai)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cream)] hover:bg-[var(--acai-deep)] transition-colors"
          >
            Find a store →
          </Link>
        </div>
      </div>
    </section>
  );
}
