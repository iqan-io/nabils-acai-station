import { productImages } from "@/lib/productImages";

export const brand = {
  name: "Nabil's Açaí Station",
  tagline: "Made for sweet moments.",
  phone: "+61 8 6285 5935",
  phoneHref: "tel:+61862855935",
  orderUrl:
    "https://www.ubereats.com/au/store/nabils-acai-station-nabils-lebanese-sweets-pty-ltd/B5xIbcLwW8ORip2Jj-A1sg",
  doordashUrl:
    "https://www.doordash.com/store/nabil%E2%80%99s-acai-station-ballajura-34876453/72960151/",
  instagram: {
    handle: "@nabilsacaistation",
    url: "https://instagram.com/nabilsacaistation",
    // Follower counts drift constantly and can't be reliably re-checked, so the
    // UI shows `followersLabel` (an evergreen "5K+") rather than a precise
    // number that silently goes stale. Bump the band only when it clearly
    // crosses a threshold (e.g. "10K+"). `followers` is kept for reference.
    followers: 5289,
    followersLabel: "5K+",
  },
  tiktok: {
    handle: "@nabilsacaistation",
    url: "https://tiktok.com/@nabilsacaistation",
  },
};

export const locations = [
  {
    slug: "mount-lawley",
    name: "Mount Lawley",
    address: "664 Beaufort St, Mount Lawley WA 6050",
    note: "Dine-in · Takeout · Delivery",
    // Google snapshot, Jun 2026 (read off the live Google listing). Mt Lawley is
    // the new shop (opened ~May 2026) so the review count is still small. This
    // object is the single source for the Locations page display *and* the
    // JSON-LD in seo.ts.
    rating: 4.7,
    reviewCount: 12,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Nabil%27s%20Acai%20Station%20664%20Beaufort%20St%20Mount%20Lawley%20WA%206050",
    hours: [
      ["Mon", "11 AM – 10 PM"],
      ["Tue", "11 AM – 10 PM"],
      ["Wed", "11 AM – 10 PM"],
      ["Thu", "11 AM – 11 PM"],
      ["Fri", "11 AM – 11 PM"],
      ["Sat", "11 AM – 11 PM"],
      ["Sun", "11 AM – 10:30 PM"],
    ] as const,
  },
  {
    slug: "ballajura",
    name: "Ballajura",
    address:
      "Inside Ballajura City Shopping Centre · N Illawarra Cres, Ballajura WA 6066",
    note: "Home of Nabil's Lebanese Sweets — where it all started.",
    // Google snapshot, Jun 2026 (read off the live Google listing) — the
    // established shop, with the bulk of the reviews.
    rating: 4.5,
    reviewCount: 148,
    phone: "+61 8 6285 5935",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Nabil%27s%20Acai%20Station%20Ballajura%20City%20Shopping%20Centre%20WA%206066",
    hours: null,
  },
] as const;

export const press = [
  {
    outlet: "PerthNow",
    outletShort: "PerthNow",
    headline: "Viral Dubai chocolate puts Ballajura sweet shop on the map",
    quote:
      "Chocoholics have been beating a path to Ballajura where an unassuming Lebanese sweet shop has suddenly become a social media hit.",
    author: "Jay Hanna",
    date: "Feb 2025",
    isoDate: "2025-02-09",
    url: "https://www.perthnow.com.au/food/nabils-acai-station-viral-dubai-chocolate-puts-ballajura-sweet-shop-on-the-map-c-17665925",
  },
  {
    outlet: "The West Australian",
    outletShort: "The West",
    headline: "This Perth cafe nails the Dubai chocolate trend",
    quote:
      "An unassuming eatery that's serving up what may be the best local version of the viral sweet treat.",
    author: "April Ooi",
    date: "Jul 2025",
    isoDate: "2025-07-30",
    url: "https://thewest.com.au/lifestyle/food/nabils-acai-station-review-april-ooi-visits-ballajura-shop-for-viral-dubai-chocolate-acai-bowl-c-19437977",
  },
] as const;

export const reviews = [
  {
    quote:
      "Everyone who works there is so sweet. The food is amazing and really worth the price.",
    author: "Emily Brown",
    badge: null,
  },
  {
    quote:
      "Best dessert and açaí in town. Keep up the good work Nabil and team. Loved it.",
    author: "Rakesh Jha",
    badge: "Local Guide",
  },
  {
    quote:
      "Strawberries were fresh, brownies were nice and warm, and the drink was really refreshing. Portions were good and everything tasted homemade. Place has a chill vibe too.",
    author: "Raina Aljorany",
    badge: "Local Guide",
  },
] as const;

// ---------------------------------------------------------------------------
// About / Our Story — founder + team.
//
// PLACEHOLDER CONTENT. Swap the names, photos and copy below once the client
// supplies the real founder bio, headshots and staff list. Real photos go in
// /public/images/team/ and are referenced as "/images/team/<file>". Until those
// exist, every portrait falls back to the brand mascot medallion so nothing
// 404s in dev or production.
//
// The `team` list is also the seed for the future "cheers" feature: each
// member's `slug` will be the stable key votes are counted against, so pick
// slugs you're happy to keep (changing a slug later resets that person's
// count). See AGENTS notes / the plan for the voting backend.
// ---------------------------------------------------------------------------

const placeholderPortrait = "/images/enhanced/brand-mascot-medallion.jpg";

export type Founder = {
  name: string;
  role: string;
  photo: string;
  /** Each string renders as its own paragraph. */
  bio: string[];
  pullQuote?: string;
};

export const founder: Founder = {
  name: "Mahmoud Rahal",
  role: "Owner",
  photo: "/images/team/mahmoud-rahal.png",
  bio: [
    "Mahmoud grew up in the family business. Nabil's Lebanese Sweets — the Ballajura shop his father, Nabil, started more than 15 years ago — built its name on baklava and traditional Lebanese sweets long before açaí ever entered the picture.",
    "When Dubai chocolate started going viral on TikTok, Mahmoud set about making his own. “After lots of trials we worked out the best recipe,” he says. The family had launched the açaí side of the shop the year before, and in January 2025 they added the Dubai chocolate range — the original bar, Dubai-filled brownies and açaí bowls.",
    "The response was instant. After a feature from Big Bite Halal racked up more than 150,000 views, queues started forming out the front. “We were shocked,” Mahmoud says. “We sold out of all stock and are just trying to keep up with demand.” Same family, same kitchen — now serving some of Perth's most-wanted sweets, open till late.",
  ],
  pullQuote:
    "“It was meant to be a little extra thing to our menu — and now it is the menu.”",
};

export type StaffMember = {
  /** Stable key — also the vote key for the future cheers feature. */
  slug: string;
  name: string;
  role: string;
  photo: string;
  location?: "Mount Lawley" | "Ballajura";
  /** A light, fun line that gives each profile personality. */
  funFact?: string;
};

// TODO(client): replace with the real roster + headshots. Order doesn't matter;
// once cheers are live the leaderboard will reorder by monthly count.
export const team: StaffMember[] = [
  {
    slug: "sample-one",
    name: "Team Member One",
    role: "Açaí Artist",
    photo: placeholderPortrait,
    location: "Mount Lawley",
    funFact: "Can build a perfect Dubai strawberry cup with their eyes closed.",
  },
  {
    slug: "sample-two",
    name: "Team Member Two",
    role: "Crêpe Specialist",
    photo: placeholderPortrait,
    location: "Mount Lawley",
    funFact: "Holds the unofficial record for fastest Nutella fold.",
  },
  {
    slug: "sample-three",
    name: "Team Member Three",
    role: "Front of House",
    photo: placeholderPortrait,
    location: "Ballajura",
    funFact: "Knows every regular's order before they reach the counter.",
  },
  {
    slug: "sample-four",
    name: "Team Member Four",
    role: "Matcha & Drinks",
    photo: placeholderPortrait,
    location: "Ballajura",
    funFact: "Convinced the whole team that ube matcha is the best on the menu.",
  },
];

export type Signature = {
  name: string;
  price: string;
  blurb: string;
  image: string;
  /** Describes the photograph, not the product — the name is already HTML. */
  imageAlt: string;
  tag: "viral" | "signature" | null;
};

/*
  The photographs come from `lib/productImages.ts` rather than being written out
  here, so the homepage lineup and the matching menu row can never end up on
  different pictures of the same product. Names, prices and blurbs stay here:
  this file remains the single source for menu content.
*/
export const signatures: Signature[] = [
  {
    name: "Build Your Own Açaí",
    price: "from $9",
    blurb:
      "Large · Regular · Small · Cone. Granola, banana and strawberries included — then drizzle and top your way.",
    image: productImages.acai.src,
    imageAlt: productImages.acai.alt,
    tag: "signature",
  },
  {
    name: "Fruit Cocktails",
    price: "$15",
    blurb:
      "Avocado · Mango · Strawberry · Sunset Swirl · The Beast. Blended fresh with ashta, cashew and honey.",
    image: productImages.fruitCocktails.src,
    imageAlt: productImages.fruitCocktails.alt,
    tag: null,
  },
  {
    name: "Dubai Chocolate",
    price: "from $18",
    blurb:
      "Nabil's viral Dubai chocolate with pistachio kataifi filling and a thick milk chocolate shell.",
    image: productImages.dubaiChocolate.src,
    imageAlt: productImages.dubaiChocolate.alt,
    tag: "viral",
  },
];

export type MenuItem = { name: string; price?: string; note?: string };
export type MenuSection = {
  title: string;
  subtitle?: string;
  items: MenuItem[];
  footnote?: string;
};

export const menu: MenuSection[] = [
  {
    title: "Açaí — Build Your Own",
    subtitle:
      "All cups come with granola, banana and strawberries. Then choose your drizzle and toppings.",
    items: [
      { name: "Large", price: "$15" },
      { name: "Regular", price: "$12" },
      { name: "Small", price: "$10" },
      { name: "Cone", price: "$9" },
    ],
    footnote:
      "Drizzles $1–$2 (honey, condensed milk, passion fruit, Nutella, pistachio, Biscoff, Bueno, peanut butter, milk chocolate). Toppings $1–$3 (Dubai filling +$3).",
  },
  {
    title: "Classic Crêpes",
    subtitle:
      "All crêpes come with bananas and strawberries on the side.",
    items: [
      { name: "Nutella Crêpe", price: "$14", note: "Filled with Nutella." },
      {
        name: "Lotus Biscoff Crêpe",
        price: "$14",
        note: "Biscoff spread with crushed Lotus biscuits.",
      },
      {
        name: "Bueno Crêpe",
        price: "$14",
        note: "Hazelnut cream with Bueno pieces.",
      },
      {
        name: "Cookies & Cream Crêpe",
        price: "$14",
        note: "Oreo cookies with Nutella.",
      },
    ],
  },
  {
    title: "Signature Crêpes",
    items: [
      {
        name: "Triple Indulgence",
        price: "$15",
        note: "Bueno, crushed Oreos and milk chocolate.",
      },
      {
        name: "Pistachio Delight",
        price: "$16",
        note: "Pistachio spread, crushed pistachio.",
      },
      {
        name: "Dubai Royal",
        price: "$16",
        note: "Dubai chocolate filling with pistachio.",
      },
      { name: "Fettuccine Crêpe", price: "$14" },
    ],
  },
  {
    title: "Strawberry Cups",
    items: [
      {
        name: "Classic — Large",
        price: "$12",
        note: "Strawberries with milk chocolate.",
      },
      { name: "Classic — Small", price: "$9" },
      {
        name: "Viral Dubai Strawberry Cup — Large",
        price: "$17.50",
        note: "Kataifi filling, strawberries, milk chocolate, Dubai sauce.",
      },
      { name: "Viral Dubai Strawberry Cup — Small", price: "$12" },
    ],
  },
  {
    title: "Dubai Chocolate",
    items: [
      { name: "Nabil's Dubai Chocolate", price: "$30" },
      { name: "Small Choc Bar", price: "$18" },
      { name: "Dubai Crunch Box", price: "$25" },
    ],
  },
  {
    title: "Brownies",
    items: [
      {
        name: "Dubai Choc Brownies",
        price: "$16",
        note: "Brownies, Dubai chocolate filling, milk chocolate drizzles and pistachios.",
      },
      {
        name: "Brownie Bowl",
        price: "$14",
        note: "Premium milk chocolate, strawberries and choice of drizzle.",
      },
    ],
  },
  {
    title: "Waffle Snack Pack",
    items: [
      {
        name: "Waffle Snack Pack",
        price: "$14",
        note: "Strawberries, banana and choice of drizzle.",
      },
    ],
  },
  {
    title: "Fruit Cocktails",
    subtitle: "Each layered with fruit pieces, ashta, cashew and honey drizzle.",
    items: [
      {
        name: "Avocado Cocktail",
        price: "$15",
        note: "Avocado blend, crushed pistachios on top.",
      },
      {
        name: "The Beast",
        price: "$15",
        note: "Mango, avocado & strawberry blend.",
      },
      { name: "Strawberry Cocktail", price: "$15" },
      { name: "Sunny Mango", price: "$15" },
      { name: "Sunset Swirl", price: "$15", note: "Mango & strawberry blend." },
    ],
  },
  {
    title: "Matcha",
    items: [
      { name: "Strawberry Iced Matcha", price: "$9" },
      { name: "Lychee Iced Matcha", price: "$9" },
      { name: "Passionfruit Iced Matcha", price: "$9" },
      { name: "Ube Matcha", price: "$9" },
    ],
  },
  {
    title: "Mocktails",
    items: [
      { name: "Watermelon", price: "$8" },
      { name: "Blue Hawaii", price: "$8" },
      { name: "Fizzy Pomegranate", price: "$8" },
      { name: "Strawberry", price: "$8" },
      { name: "Passionfruit", price: "$8" },
      { name: "Yuzu", price: "$8" },
    ],
  },
  {
    title: "Iced Lattes",
    items: [
      { name: "Matcha", price: "$9" },
      { name: "Pistachio", price: "$9" },
      { name: "Bueno", price: "$9" },
      { name: "Biscoff", price: "$9" },
      { name: "Hazelnut", price: "$9" },
    ],
  },
  {
    title: "Milkshakes",
    items: [
      { name: "Cookies & Cream", price: "$10" },
      { name: "Snickers", price: "$10" },
      { name: "Bueno", price: "$10" },
      { name: "Nutella", price: "$10" },
      { name: "Dulce de Leche", price: "$10" },
      { name: "Pistachio", price: "$10" },
    ],
  },
  {
    title: "Probiotic Splash",
    items: [
      { name: "Lychee", price: "$9" },
      { name: "Mango", price: "$9" },
      { name: "Pineapple", price: "$9" },
      { name: "Strawberry", price: "$9" },
    ],
  },
];

// Anchor id for a menu section. Must stay in sync with the ids rendered on the
// menu page so navbar/category links land on the right section.
export function menuSlug(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type MenuGroup = {
  label: string;
  /** Section titles (must match `menu` titles) grouped under this label. */
  sections: string[];
};

// One source of truth for how the long menu is grouped — consumed by both the
// navbar dropdown and the sticky category bar on the menu page.
export const menuGroups: MenuGroup[] = [
  { label: "Açaí & Bowls", sections: ["Açaí — Build Your Own"] },
  {
    label: "Crêpes & Waffles",
    sections: ["Classic Crêpes", "Signature Crêpes", "Waffle Snack Pack"],
  },
  {
    label: "Chocolate & Sweets",
    sections: ["Dubai Chocolate", "Brownies", "Strawberry Cups"],
  },
  { label: "Fruit", sections: ["Fruit Cocktails"] },
  {
    label: "Drinks",
    sections: ["Mocktails", "Probiotic Splash", "Matcha", "Iced Lattes", "Milkshakes"],
  },
];
