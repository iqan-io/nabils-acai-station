import { shop, type ShopProduct } from "@/lib/brand";

/*
  Cart arithmetic, shared by the cart (to show totals) and `/api/checkout` (to
  charge them). Both run the same function on the same catalogue, so the price
  a buyer sees is the price Square is asked for.
*/

export type CartLine = { id: string; quantity: number };

export type PricedProduct = ShopProduct & { priceCents: number };

export type Quote = {
  lines: { product: PricedProduct; quantity: number; totalCents: number }[];
  subtotalCents: number;
  /** `null` until the owner confirms postage below the free threshold. */
  shippingCents: number | null;
  /** How much more to spend for free shipping; 0 once it applies. */
  freeShippingGapCents: number;
};

/** Enough for a big gift order; anything larger is a phone call, not a cart. */
export const MAX_QUANTITY = 12;

export function formatAud(cents: number) {
  return cents % 100 === 0
    ? `$${cents / 100}`
    : `$${(cents / 100).toFixed(2)}`;
}

/**
 * Postage for an order. The one place the shipping rule lives, so when the
 * Australia Post rates arrive (possibly by weight or zone, not flat) only this
 * changes.
 */
export function shippingFor(subtotalCents: number): number | null {
  if (subtotalCents >= shop.freeShippingFromCents) return 0;
  return shop.flatShippingCents;
}

/** On sale means priced: a product without a price is listed but not sold. */
export function isForSale(product: ShopProduct): product is PricedProduct {
  return product.priceCents !== null;
}

/**
 * Prices a cart from product ids and quantities alone. Unknown or unpriced ids
 * are dropped and quantities clamped, because the input may come straight off
 * the network.
 */
export function quote(cart: unknown): Quote {
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

  return {
    lines,
    subtotalCents,
    shippingCents: lines.length ? shippingFor(subtotalCents) : 0,
    freeShippingGapCents: Math.max(0, shop.freeShippingFromCents - subtotalCents),
  };
}
