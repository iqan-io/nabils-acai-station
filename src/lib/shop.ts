import { shop, type PostageService, type ShopProduct } from "@/lib/brand";

/*
  Cart arithmetic, shared by the cart (to show totals) and `/api/checkout` (to
  charge them). Both run the same function on the same catalogue, so the price
  a buyer sees is the price Square is asked for.
*/

export type CartLine = { id: string; quantity: number };

export type PricedProduct = ShopProduct & { priceCents: number };

export type PostageOption = {
  id: string;
  name: string;
  eta: string;
  cents: number;
};

export type Quote = {
  lines: { product: PricedProduct; quantity: number; totalCents: number }[];
  subtotalCents: number;
  /** The chosen postage service (the first one if none was chosen). */
  service: PostageService;
  /** Postage for the chosen service; 0 for an empty cart. */
  shippingCents: number;
  /** Every service priced for this cart, for the buyer to choose from. */
  postageOptions: PostageOption[];
  /** Packed weight, packaging included; 0 for an empty cart. */
  packedGrams: number;
  /** How many parcels the order goes as; 0 for an empty cart. */
  parcels: number;
};

/** Enough for a big gift order; anything larger is a phone call, not a cart. */
export const MAX_QUANTITY = 12;

export function formatAud(cents: number) {
  return cents % 100 === 0
    ? `$${cents / 100}`
    : `$${(cents / 100).toFixed(2)}`;
}

/** The service with this id, or the first service for anything else. */
export function postageService(id: unknown): PostageService {
  const { services } = shop.postage;
  return services.find((service) => service.id === id) ?? services[0];
}

/**
 * Splits a cart's item weight into parcels, each within the parcel limit with
 * its own packaging. Returns each parcel's packed weight.
 */
export function parcelWeights(itemGrams: number): number[] {
  if (itemGrams <= 0) return [];
  const { packagingGrams, maxParcelGrams } = shop.postage;
  const room = maxParcelGrams - packagingGrams;
  const count = Math.ceil(itemGrams / room);
  // Spread evenly, as a packer would, rather than one full parcel and a
  // near-empty one. An approximation: tubs don't split, so it's close, not exact.
  const each = itemGrams / count;
  return Array.from({ length: count }, () => each + packagingGrams);
}

/** One parcel's price on a service's table, by packed weight. */
export function parcelCents(service: PostageService, grams: number): number {
  const bracket = service.rates.find(([upTo]) => grams <= upTo);
  // `parcelWeights` keeps every parcel within the last bracket, so this only
  // guards against a table edited to end below the parcel limit.
  return (bracket ?? service.rates[service.rates.length - 1])[1];
}

/** Postage for a cart's item weight on one service. The one place the rule lives. */
export function postageFor(service: PostageService, itemGrams: number): number {
  return parcelWeights(itemGrams).reduce(
    (sum, grams) => sum + parcelCents(service, grams),
    0,
  );
}

/** On sale means priced: a product without a price is listed but not sold. */
export function isForSale(product: ShopProduct): product is PricedProduct {
  return product.priceCents !== null;
}

/**
 * Prices a cart from product ids, quantities and a postage service id alone.
 * Unknown or unpriced ids are dropped, quantities clamped and an unknown
 * service replaced by the first, because the input may come straight off the
 * network.
 */
export function quote(cart: unknown, serviceId?: unknown): Quote {
  const wanted = new Map<string, number>();
  if (Array.isArray(cart)) {
    for (const entry of cart) {
      const id = typeof entry?.id === "string" ? entry.id : "";
      const quantity = Math.floor(Number(entry?.quantity));
      if (!id || !Number.isFinite(quantity) || quantity < 1) continue;
      wanted.set(id, Math.min(MAX_QUANTITY, (wanted.get(id) ?? 0) + quantity));
    }
  }

  const lines = shop.products
    .filter(isForSale)
    .filter((product) => wanted.has(product.id))
    .map((product) => {
      const quantity = wanted.get(product.id)!;
      return { product, quantity, totalCents: product.priceCents * quantity };
    });

  const subtotalCents = lines.reduce((sum, line) => sum + line.totalCents, 0);
  const itemGrams = lines.reduce(
    (sum, line) => sum + line.product.packedGrams * line.quantity,
    0,
  );
  const parcels = parcelWeights(itemGrams);
  const service = postageService(serviceId);

  return {
    lines,
    subtotalCents,
    service,
    shippingCents: postageFor(service, itemGrams),
    postageOptions: shop.postage.services.map((option) => ({
      id: option.id,
      name: option.name,
      eta: option.eta,
      cents: postageFor(option, itemGrams),
    })),
    packedGrams: Math.round(parcels.reduce((sum, grams) => sum + grams, 0)),
    parcels: parcels.length,
  };
}
