/*
  ---------------------------------------------------------------------------
  System B — menu / product photography
  ---------------------------------------------------------------------------

  Nabil's runs two media systems and they must not be mixed:

    System A — cinematic. Pure black ground, high contrast, cold. It belongs to
      the homepage film (`components/cinematic/`), its scroll sequence, and the
      full-bleed scrimmed hero backdrops. Those assets live under
      `/media/acai-story/` and `/images/enhanced/` and are NOT registered here.

    System B — this file. Ordinary merchandising: the menu rows, the homepage
      lineup, product cards. One shoot: warm cream sweep, key light upper-left,
      soft rear-right rim, a single grounding contact shadow. No hands, no
      counter, no street, no props.

  The rule is: the food provides the colour, the site provides the consistency.
  So this registry — not the components — decides what a product looks like.

  Approved assets were supplied by Ali on 2026-08-18 and normalised onto one
  1200x1500 (4:5) canvas. The normalisation is canvas only: five were already
  4:5 and were resized; açaí, the strawberry cup and the waffle pack were
  extended outwards along their own cream sweep so that no product was cropped.
  The food itself is untouched. Do not regenerate or re-grade these.

  Two sections are still on their pre-studio photograph and are marked
  `studio: false`. They are listed in NEEDS_STUDIO_REPLACEMENT with what is
  wrong with them, and they are the only entries here that should change
  without a new shoot.
*/

/** One ratio for every product card on the site. */
export const PRODUCT_CARD_RATIO = "4 / 5";
export const PRODUCT_CARD_WIDTH = 1200;
export const PRODUCT_CARD_HEIGHT = 1500;

export type ProductImage = {
  src: string;
  /** Short and descriptive. Never keyword-stuffed — the name is already HTML. */
  alt: string;
  /** false = still on pre-studio photography; see NEEDS_STUDIO_REPLACEMENT. */
  studio: boolean;
};

const STUDIO = "/images/products/studio";

export const productImages = {
  acai: {
    src: `${STUDIO}/acai-build-your-own-studio.webp`,
    alt: "Nabil's açaí cup with granola, blueberries, strawberry and a drizzled swirl on top",
    studio: true,
  },
  classicCrepes: {
    // Pre-studio: hand-held tray in front of the shop signage.
    src: "/images/enhanced/menu-classic-crepe.png",
    alt: "A classic Nabil's crêpe tray with a Biscoff drizzle",
    studio: false,
  },
  signatureCrepes: {
    src: `${STUDIO}/crepe-signature-studio.webp`,
    alt: "A Nabil's crêpe tray topped with strawberries, banana and crushed Biscoff",
    studio: true,
  },
  strawberryCups: {
    src: `${STUDIO}/strawberry-cup-studio.webp`,
    alt: "Nabil's viral Dubai strawberry cup with kataifi, milk chocolate and strawberries",
    studio: true,
  },
  dubaiChocolate: {
    src: `${STUDIO}/dubai-chocolate-studio.webp`,
    alt: "Nabil's Dubai chocolate stacked and cut open to show the pistachio kataifi filling",
    studio: true,
  },
  brownies: {
    src: `${STUDIO}/brownie-studio.webp`,
    alt: "A Nabil's Dubai choc brownie with milk chocolate drizzle and crushed pistachio",
    studio: true,
  },
  waffleSnackPack: {
    src: `${STUDIO}/waffle-snack-pack-studio.webp`,
    alt: "A Nabil's waffle snack pack with strawberries, banana and chocolate drizzle",
    studio: true,
  },
  fruitCocktails: {
    src: `${STUDIO}/fruit-cocktail-studio.webp`,
    alt: "A Nabil's fruit cocktail layered with strawberry and avocado, topped with crushed nuts",
    studio: true,
  },
  mocktails: {
    // Pre-studio: the shop interior, pendant lamp and arches behind the drinks.
    src: "/images/enhanced/menu-mocktails.png",
    alt: "Nabil's mocktails lined up over ice",
    studio: false,
  },
  probioticSplash: {
    src: `${STUDIO}/probiotic-splash-studio.webp`,
    alt: "Two cans of Nabil's probiotic splash",
    studio: true,
  },
} satisfies Record<string, ProductImage>;

export type ProductKey = keyof typeof productImages;

/*
  Menu section title -> product key. Titles must match `menu[].title` in
  brand.ts exactly. Matcha, Iced Lattes and Milkshakes are deliberately absent:
  they have never had a photograph, and the menu renders them as a compact list
  rather than advertising the gap with an empty media box.
*/
export const menuSectionImageKey: Record<string, ProductKey> = {
  "Açaí — Build Your Own": "acai",
  "Classic Crêpes": "classicCrepes",
  "Signature Crêpes": "signatureCrepes",
  "Strawberry Cups": "strawberryCups",
  "Dubai Chocolate": "dubaiChocolate",
  Brownies: "brownies",
  "Waffle Snack Pack": "waffleSnackPack",
  "Fruit Cocktails": "fruitCocktails",
  Mocktails: "mocktails",
  "Probiotic Splash": "probioticSplash",
};

export function menuSectionImage(title: string): ProductImage | undefined {
  const key = menuSectionImageKey[title];
  return key ? productImages[key] : undefined;
}

/*
  ---------------------------------------------------------------------------
  Replacement manifest — what changed on 2026-08-18 and where it is used.
  ---------------------------------------------------------------------------
  Kept in code rather than a doc so it cannot drift from the paths above.
*/
export const REPLACEMENTS: ReadonlyArray<{
  from: string;
  to: ProductKey;
  usedBy: string;
  issue: string;
}> = [
  {
    from: "/images/enhanced/menu-acai.png",
    to: "acai",
    usedBy: "Menu / Açaí — Build Your Own",
    issue: "Hand holding the cup; café interior behind it.",
  },
  {
    from: "/images/enhanced/signature-build-your-own-acai-v2.jpg",
    to: "acai",
    usedBy: "Homepage / lineup 01",
    issue: "Hand holding the cup; shop arches and downlights behind it.",
  },
  {
    from: "/images/enhanced/menu-signature-crepe.png",
    to: "signatureCrepes",
    usedBy: "Menu / Signature Crêpes",
    issue: "Hand holding the tray; shop signage behind it.",
  },
  {
    from: "/images/enhanced/menu-strawberry-cup.png",
    to: "strawberryCups",
    usedBy: "Menu / Strawberry Cups",
    issue:
      "Hand holding the cup; outdoor street background with other cups in frame.",
  },
  {
    from: "/images/enhanced/menu-dubai-chocolate.png",
    to: "dubaiChocolate",
    usedBy: "Menu / Dubai Chocolate · Homepage / lineup 03",
    issue: "Retail packaging dominated the frame; wooden surface.",
  },
  {
    from: "/images/enhanced/menu-brownie.png",
    to: "brownies",
    usedBy: "Menu / Brownies",
    issue: "Dark slate plate in a lit café interior; graded cold against the set.",
  },
  {
    from: "/images/enhanced/menu-waffle-snack-pack.png",
    to: "waffleSnackPack",
    usedBy: "Menu / Waffle Snack Pack",
    issue:
      "Closest to the new system already, but a different crop and colour temperature.",
  },
  {
    from: "/images/enhanced/fruit-cocktail-client-enhanced.jpg",
    to: "fruitCocktails",
    usedBy: "Menu / Fruit Cocktails · Homepage / lineup 02",
    issue: "Outdoor street background on a marble table.",
  },
  {
    from: "/images/enhanced/menu-probiotic-splash.png",
    to: "probioticSplash",
    usedBy: "Menu / Probiotic Splash",
    issue: "Shop counter and warm interior behind the cans.",
  },
];

/*
  Sections still waiting on an approved studio asset. Per the art direction we
  keep the real photograph rather than substituting a stand-in, and flag it.
*/
export const NEEDS_STUDIO_REPLACEMENT: ReadonlyArray<{
  key: ProductKey;
  location: string;
  issue: string;
}> = [
  {
    key: "classicCrepes",
    location: "Menu / Classic Crêpes",
    issue:
      "Hand holding the tray in front of the shop signage, cool interior light. " +
      "The supplied crêpe asset is the studio version of the Signature tray, so " +
      "Classic still needs its own.",
  },
  {
    key: "mocktails",
    location: "Menu / Mocktails",
    issue:
      "Shot on the shop counter with a pendant lamp and the arches behind it — " +
      "environmental background and a different colour temperature to the set.",
  },
];
