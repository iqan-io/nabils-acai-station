import { shop } from "@/lib/brand";
import { quote } from "@/lib/shop";
import { accessToken, squareUrl, SQUARE_VERSION } from "@/lib/square";

/*
  Turns a cart into one Square checkout page.

  The browser sends only product ids and quantities; prices and postage are
  worked out here from `brand.ts`, then Square's Checkout API creates the order
  and a hosted payment page in a single call. The buyer pays and enters their
  address on Square, and the order lands in the owner's Square dashboard.
  Credentials and environment: see `lib/square.ts`.
*/

export async function POST(request: Request) {
  const locationId = process.env.SQUARE_LOCATION_ID;

  let token: string | null;
  try {
    token = await accessToken();
  } catch (error) {
    console.error(error);
    token = null;
  }

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

  const { items, service } = (body ?? {}) as { items?: unknown; service?: unknown };
  const order = quote(items, service);
  if (!order.lines.length) {
    return Response.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const shippingCents = order.shippingCents;
  // Named so the owner's Square order says what to post it as.
  const postageName =
    order.parcels > 1
      ? `${order.service.name} (${order.parcels} parcels)`
      : order.service.name;

  const origin = new URL(request.url).origin;
  const response = await fetch(
    squareUrl("/v2/online-checkout/payment-links"),
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
          // Every price is GST-inclusive, so the tax changes no total: it makes
          // Square record the GST already inside each sale. Shipping is a
          // taxable order charge rather than `checkout_options.shipping_fee`
          // so the same GST covers postage too.
          taxes: [
            {
              uid: "gst",
              name: "GST",
              percentage: String(shop.gstPercent),
              type: "INCLUSIVE",
              scope: "ORDER",
            },
          ],
          ...(shippingCents > 0 && {
            service_charges: [
              {
                name: postageName,
                amount_money: { amount: shippingCents, currency: "AUD" },
                calculation_phase: "SUBTOTAL_PHASE",
                taxable: true,
              },
            ],
          }),
        },
        checkout_options: {
          ask_for_shipping_address: true,
          redirect_url: `${origin}/shop/thanks`,
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
