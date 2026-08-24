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
  1200x1500 (4:5) canvas by `scripts/build-studio-assets.py`. Five were already
  4:5 and were resized; açaí, the strawberry cup and the waffle pack were
  extended outwards along their own cream sweep so that no product was cropped.

  The same script also grounds them: every frame's sweep is mapped onto one
  shared backdrop that sits on --ds-paper (#f5ecdf) at the frame edge. That is
  a white balance of the BACKDROP, derived from each frame's own sweep — the
  food is untouched, because the correction is a smooth low-frequency field and
  every local thing (the food, its grain, the contact shadow) rides on top of
  it as a residual.

  It is not optional polish. These render with no border, no radius and no drop
  shadow on purpose — the photograph is meant to BE the card — so the frame
  edge is the only thing hiding the box. As delivered the set missed the page
  by up to 39 units and missed EACH OTHER by up to 27, so the menu read as ten
  rectangles on the cream. `--check` measures it; it is now inside 1.

  Do not regenerate or re-grade the food. Do not hand-edit these webps either:
  they are build output, and the next run of the script will overwrite them.

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
    src: `${STUDIO}/crepe-classic-studio.webp`,
    alt: "A classic Nabil's crêpe tray, cut into squares under a Biscoff drizzle",
    studio: true,
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
    src: `${STUDIO}/mocktail-studio.webp`,
    alt: "Four Nabil's mocktails in branded cans, over ice with fruit and mint",
    studio: true,
  },
  probioticSplash: {
    src: `${STUDIO}/probiotic-splash-studio.webp`,
    alt: "Two cans of Nabil's probiotic splash",
    studio: true,
  },

  /*
    Third batch, 2026-08-24 — the açaí build gallery.

    These six came from Ali's own counter photographs rather than from a
    studio shoot: phone shots on the shop's purple and blue backdrop, in hand,
    or against the counter. Each was relit onto the System B sweep by a
    gpt-image-2 image-to-image edit that replaced the ENVIRONMENT ONLY, so the
    dessert in every frame is the dessert Ali photographed. The unedited
    originals sit beside them at
    `clients/nabils-acai-station/assets/source/soft-serve-2026-08-24/` for
    comparison, and the relit sources at `.../studio-2026-08-24/`.

    ALT TEXT IS DELIBERATELY DESCRIPTIVE, NOT NOMINAL. It says "a pale green
    drizzle", never "pistachio". The açaí footnote sells nine drizzles and
    several of them are hard to tell apart in a photograph — a tan flood could
    be Biscoff, peanut butter or Bueno — so naming one would be inventing a
    business fact about what the customer is looking at. If Ali confirms which
    drizzle is in which frame, the names belong here and captions can go on in
    `menuSectionGalleryKeys` below.
  */
  acaiLoaded: {
    src: `${STUDIO}/acai-loaded-studio.webp`,
    alt: "A clear cup of Nabil's açaí layered over granola with mango, blueberries and strawberries, under a thick pale green drizzle",
    studio: true,
  },
  acaiChocolate: {
    src: `${STUDIO}/acai-chocolate-studio.webp`,
    alt: "A Nabil's açaí swirl coated in dark chocolate, with strawberries, banana and golden crumble around the base",
    studio: true,
  },
  acaiBiscoff: {
    src: `${STUDIO}/acai-biscoff-studio.webp`,
    alt: "A Nabil's açaí swirl flooded with a thick caramel-toned drizzle, packed with strawberries",
    studio: true,
  },
  acaiPistachio: {
    src: `${STUDIO}/acai-pistachio-studio.webp`,
    alt: "A pale green Nabil's soft-serve swirl ringed with whole strawberries",
    studio: true,
  },
  acaiPistachioChoc: {
    src: `${STUDIO}/acai-pistachio-choc-studio.webp`,
    alt: "A chocolate Nabil's açaí swirl under a pale green drizzle, with strawberries and banana around the base",
    studio: true,
  },

  /*
    Registered, built, and deliberately NOT placed on any page yet — see
    UNPLACED below. It is in this registry so the asset is tracked rather than
    orphaned, not because a component reads it.
  */
  brownieBowl: {
    src: `${STUDIO}/brownie-bowl-studio.webp`,
    alt: "A tub of Nabil's brownie pieces with a scoop of pistachio gelato and a vanilla soft-serve swirl",
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
  Section galleries — extra frames that run BELOW a section's editorial row.
  ---------------------------------------------------------------------------

  An editorial row shows one photograph. That is right for a section whose
  items are variations on one object (there is only one way a brownie looks),
  and wrong for "Açaí — Build Your Own", which is the one section on the menu
  where the product is a CHOICE: four sizes, nine drizzles and a topping list,
  all sold by a footnote in 0.82rem grey type and illustrated by a single cup.
  The gallery is that footnote, photographed.

  Deliberately uncaptioned. See the alt-text note in `productImages` above —
  captions would have to name a drizzle, and naming one we cannot verify from
  the photograph is inventing a business fact. The frames carry themselves.

  Order is chosen so no two adjacent cards share a dominant colour: the
  layered clear cup first because it is the only one that shows what is under
  the swirl, then dark, then caramel, then pale green, then the two-tone.
*/
export const menuSectionGalleryKeys: Record<string, readonly ProductKey[]> = {
  "Açaí — Build Your Own": [
    "acaiLoaded",
    "acaiChocolate",
    "acaiBiscoff",
    "acaiPistachio",
    "acaiPistachioChoc",
  ],
};

export function menuSectionGallery(title: string): readonly ProductImage[] {
  return (menuSectionGalleryKeys[title] ?? []).map((key) => productImages[key]);
}

/*
  ---------------------------------------------------------------------------
  Built but not placed.
  ---------------------------------------------------------------------------
  `brownieBowl` is a relit frame of a real Nabil's dessert — brownie pieces, a
  scoop of pistachio gelato and a vanilla soft-serve swirl in a tub — and it
  has no honest home on the menu as written.

  The nearest listing is Brownies / "Brownie Bowl" ($14), described in brand.ts
  as "Premium milk chocolate, strawberries and choice of drizzle". The
  photograph has no strawberries and carries two things that listing does not
  mention, so hanging it on that row would advertise an item that may not be
  orderable. Per AGENTS.md we do not invent business facts, and per the art
  direction we do not substitute a stand-in.

  To place it, Ali needs to confirm one thing: what is in the tub and what it
  is called on the menu. Then either point `brownieBowl` at the right section
  here, or add the section to brand.ts.
*/
export const UNPLACED: ReadonlyArray<{ key: ProductKey; blockedOn: string }> = [
  {
    key: "brownieBowl",
    blockedOn:
      "No matching menu item. Ali to confirm what the tub is and what it is called before it goes on a page.",
  },
];

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
  // Second batch, 2026-08-19. These two closed the last System B gaps.
  {
    from: "/images/enhanced/menu-classic-crepe.png",
    to: "classicCrepes",
    usedBy: "Menu / Classic Crêpes",
    issue: "Hand holding the tray in front of the shop signage; cool interior light.",
  },
  {
    from: "/images/enhanced/menu-mocktails.png",
    to: "mocktails",
    usedBy: "Menu / Mocktails",
    issue: "Shop counter with a pendant lamp and the arches behind the drinks.",
  },
];

/*
  Sections still waiting on an approved studio asset. Per the art direction we
  keep the real photograph rather than substituting a stand-in, and flag it here.

  Empty as of 2026-08-19: every menu section that has a photograph is now on the
  studio set. Matcha, Iced Lattes and Milkshakes are deliberately absent from
  `menuSectionImageKey` rather than listed here — they have never had a
  photograph and render as a compact price list, which is a layout choice, not
  a gap.

  Anything added back here must keep its real photograph until an approved
  replacement exists. Never substitute a stand-in or a stock image.
*/
export const NEEDS_STUDIO_REPLACEMENT: ReadonlyArray<{
  key: ProductKey;
  location: string;
  issue: string;
}> = [];
