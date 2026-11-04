"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { shop } from "@/lib/brand";
import { track } from "@/lib/analytics";
import { formatAud, isForSale, MAX_QUANTITY, quote } from "@/lib/shop";
import styles from "./ShopCart.module.css";

/*
  The `/shop` cart. It holds only ids and quantities; every total on screen
  comes from `quote()`, the same function `/api/checkout` charges with. The cart
  survives a reload in localStorage, which is a convenience only: if storage is
  blocked the cart simply starts empty.
*/

const STORAGE_KEY = "nabils-shop-cart";

type Quantities = Record<string, number>;

function readStored(): Quantities {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function ShopCart() {
  const [quantities, setQuantities] = useState<Quantities>({});
  const [loaded, setLoaded] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // Read storage after mount, so the server render and the first client render
  // agree (both empty) and hydration stays clean.
  useEffect(() => {
    setQuantities(readStored());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
    } catch {
      // Storage blocked (private window, previews): the cart still works.
    }
  }, [quantities, loaded]);

  const items = Object.entries(quantities).map(([id, quantity]) => ({ id, quantity }));
  const order = quote(items);
  const empty = order.lines.length === 0;

  function setQuantity(id: string, quantity: number) {
    setError("");
    setQuantities((current) => {
      const next = { ...current };
      if (quantity < 1) delete next[id];
      else next[id] = Math.min(MAX_QUANTITY, quantity);
      return next;
    });
  }

  async function checkout() {
    setPending(true);
    setError("");
    track("checkout_start", { placement: "shop_cart" });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.url !== "string") {
        throw new Error(data.error || "Checkout couldn't start. Please try again.");
      }
      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
      setPending(false);
    }
  }

  return (
    <div className={styles.cart}>
      <ul className={styles.products} aria-label="Products">
        {shop.products.map((product) => {
          const quantity = quantities[product.id] ?? 0;
          return (
            <li key={product.id} className={styles.product} data-product={product.id}>
              <div className={styles.photo}>
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(min-width: 44rem) 220px, 40vw"
                  quality={90}
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.blurb}>{product.blurb}</p>
                <div className={styles.buy}>
                  {!isForSale(product) ? (
                    <span className={styles.soon}>Price coming soon</span>
                  ) : (
                    <span className={styles.price}>{formatAud(product.priceCents)}</span>
                  )}
                  {!isForSale(product) ? null : quantity === 0 ? (
                    <button
                      type="button"
                      className={styles.add}
                      onClick={() => setQuantity(product.id, 1)}
                    >
                      Add to cart
                    </button>
                  ) : (
                    <div className={styles.stepper} role="group" aria-label={`${product.name} quantity`}>
                      <button
                        type="button"
                        aria-label={`Remove one ${product.name}`}
                        onClick={() => setQuantity(product.id, quantity - 1)}
                      >
                        −
                      </button>
                      <output aria-live="polite">{quantity}</output>
                      <button
                        type="button"
                        aria-label={`Add one ${product.name}`}
                        disabled={quantity >= MAX_QUANTITY}
                        onClick={() => setQuantity(product.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className={styles.summary} aria-label="Order summary">
        <h3 className={styles.summaryTitle}>Your order</h3>
        {empty ? (
          <p className={styles.muted}>Nothing in your cart yet.</p>
        ) : (
          <dl className={styles.totals}>
            {order.lines.map((line) => (
              <div key={line.product.id}>
                <dt>
                  {line.quantity} × {line.product.name}
                </dt>
                <dd>{formatAud(line.totalCents)}</dd>
              </div>
            ))}
            <div className={styles.subtotal}>
              <dt>Subtotal</dt>
              <dd data-subtotal>{formatAud(order.subtotalCents)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd data-shipping>
                {order.shippingCents === 0
                  ? "Free"
                  : order.shippingCents === null
                    ? "At checkout"
                    : formatAud(order.shippingCents)}
              </dd>
            </div>
            {order.shippingCents !== null && (
              <div className={styles.total}>
                <dt>Total</dt>
                <dd data-total>{formatAud(order.subtotalCents + order.shippingCents)}</dd>
              </div>
            )}
          </dl>
        )}

        <p className={styles.freeShipping} data-free-shipping>
          {order.freeShippingGapCents === 0
            ? "You've got free shipping."
            : `Free shipping Australia-wide from ${formatAud(shop.freeShippingFromCents)}${
                empty ? "." : ` — add ${formatAud(order.freeShippingGapCents)} more.`
              }`}
        </p>

        <button
          type="button"
          className={styles.checkout}
          disabled={empty || pending}
          onClick={checkout}
        >
          {pending ? "Opening checkout…" : "Checkout"}
        </button>
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {/* Square's hosted checkout cannot restrict the shipping country, so
            this line is the guard; a non-Australian order is refunded. */}
        <p className={styles.muted}>
          We post within Australia only. Secure payment by Square; you&apos;ll
          add your delivery address there.
        </p>
      </aside>
    </div>
  );
}
