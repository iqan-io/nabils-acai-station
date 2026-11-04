import { quote } from "@/lib/shop";

/*
  Turns a cart into one Square checkout page.

  The browser sends only product ids and quantities; prices and postage are
  worked out here from `brand.ts`, then Square's Checkout API creates the order
  and a hosted payment page in a single call. The buyer pays and enters their
  address on Square, and the order lands in the owner's Square dashboard.

  Environment (Vercel project settings, never the repo — this repo is public):
    SQUARE_ACCESS_TOKEN   token from the owner's OAuth "Allow", or a sandbox token
    SQUARE_LOCATION_ID    the Square location online orders are booked under
    SQUARE_ENVIRONMENT    "production" for real money; anything else is sandbox
*/

const SQUARE_VERSION = "2026-09-16";

// Lets a sandbox order be placed end to end before the owner's Australia Post
// rates exist. Never used against production: an unknown postage closes the
// real checkout instead of guessing.
const SANDBOX_PLACEHOLDER_SHIPPING_CENTS = 1000;

export async function POST(request: Request) {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const production = process.env.SQUARE_ENVIRONMENT === "production";

  if (!token || !locationId) {
    return Response.json(
      { error: "Online checkout isn't switched on yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const order = quote((body as { items?: unknown })?.items);
  if (!order.lines.length) {
    return Response.json({ error: "Your cart is empty." }, { status: 400 });
  }

  let shippingCents = order.shippingCents;
  if (shippingCents === null) {
    if (production) {
      return Response.json(
        { error: "Shipping rates are still being set up." },
        { status: 503 },
      );
    }
    shippingCents = SANDBOX_PLACEHOLDER_SHIPPING_CENTS;
  }

  const origin = new URL(request.url).origin;
  const response = await fetch(
    `https://connect.${production ? "squareup" : "squareupsandbox"}.com/v2/online-checkout/payment-links`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Square-Version": SQUARE_VERSION,
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        order: {
          location_id: locationId,
          // Ad hoc line items: priced from `brand.ts`, not the Square catalogue.
          // Linking each to its catalogue variation (`catalog_object_id`) is
          // what will make online sales draw down Square's stock count.
          line_items: order.lines.map((line) => ({
            name: line.product.name,
            quantity: String(line.quantity),
            base_price_money: { amount: line.product.priceCents, currency: "AUD" },
          })),
        },
        checkout_options: {
          ask_for_shipping_address: true,
          redirect_url: `${origin}/shop/thanks`,
          ...(shippingCents > 0 && {
            shipping_fee: {
              name: "Australia-wide shipping",
              charge: { amount: shippingCents, currency: "AUD" },
            },
          }),
        },
      }),
      cache: "no-store",
    },
  );

  const data = await response.json().catch(() => null);
  const url = data?.payment_link?.url;
  if (!response.ok || typeof url !== "string") {
    console.error("Square checkout failed", response.status, data?.errors);
    return Response.json(
      { error: "Checkout couldn't start. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ url });
}
