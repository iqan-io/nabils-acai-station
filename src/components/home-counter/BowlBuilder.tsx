"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { acaiBuilder, brand } from "@/lib/brand";
import styles from "./HomeCounter.module.css";

/**
 * The homepage signature interaction: build an açaí, watch the price move.
 *
 * Deliberately NOT a cart. Uber Eats has no deep link that can carry a custom
 * build, so pretending to hand the order over would be a lie. Instead the panel
 * produces a plain-text summary the customer can copy and read out (or show) at
 * the counter, and the delivery button opens the real store page.
 */

/** Toggle a name in a selection list, keeping the source order stable. */
function toggle(list: string[], name: string): string[] {
  return list.includes(name)
    ? list.filter((entry) => entry !== name)
    : [...list, name];
}

function priceOf(options: { name: string; price: number }[], name: string) {
  return options.find((option) => option.name === name)?.price ?? 0;
}

export function BowlBuilder() {
  const [size, setSize] = useState("Regular");
  const [drizzles, setDrizzles] = useState<string[]>(["Pistachio"]);
  const [toppings, setToppings] = useState<string[]>([
    "Strawberries",
    "Crunchy Dubai filling",
  ]);
  const [copied, setCopied] = useState(false);

  const total = useMemo(() => {
    const base = priceOf(acaiBuilder.sizes, size);
    const add = (list: string[], options: { name: string; price: number }[]) =>
      list.reduce((sum, name) => sum + priceOf(options, name), 0);
    return (
      base +
      add(drizzles, acaiBuilder.drizzles) +
      add(toppings, acaiBuilder.toppings)
    );
  }, [size, drizzles, toppings]);

  const summary = useMemo(() => {
    const parts = [`${size} açaí`];
    if (drizzles.length) parts.push(`${drizzles.join(" + ")} drizzle`);
    if (toppings.length) parts.push(toppings.join(", "));
    return `${parts.join(" · ")} — $${total}.00`;
  }, [size, drizzles, toppings, total]);

  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(`${summary} (${brand.name})`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard can be blocked by permissions or a non-secure context. The
      // summary is already visible on screen, so failing quietly is fine —
      // never show an error for something the customer can just read.
    }
  }

  return (
    <div className={styles.builder}>
      <div className={styles.builderHead}>
        <Image
          src="/images/enhanced/signature-build-your-own-acai-v2.jpg"
          alt="A Nabil's build-your-own açaí bowl"
          width={140}
          height={140}
          quality={90}
          className={styles.builderThumb}
        />
        <div>
          <h2 className={styles.builderTitle}>Build your own açaí</h2>
          <p className={styles.builderNote}>
            {acaiBuilder.included.join(", ")} included
          </p>
        </div>
      </div>

      <fieldset className={styles.step}>
        <legend className={styles.stepHead}>
          <span className={styles.stepNum} aria-hidden>
            1
          </span>
          Pick your size
        </legend>
        <div className={styles.options}>
          {acaiBuilder.sizes.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-pressed={size === option.name}
              onClick={() => setSize(option.name)}
              className={`${styles.option} ${
                size === option.name ? styles.optionOn : ""
              }`}
            >
              {option.name}
              <span className={styles.optionPrice}>${option.price}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.step}>
        <legend className={styles.stepHead}>
          <span className={styles.stepNum} aria-hidden>
            2
          </span>
          Choose a drizzle
          <span className={styles.stepCount}>
            {drizzles.length} selected
          </span>
        </legend>
        <div className={styles.options}>
          {acaiBuilder.drizzles.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-pressed={drizzles.includes(option.name)}
              onClick={() => setDrizzles((list) => toggle(list, option.name))}
              className={`${styles.option} ${
                drizzles.includes(option.name) ? styles.optionOn : ""
              }`}
            >
              {option.name}
              <span className={styles.optionPrice}>+${option.price}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.step}>
        <legend className={styles.stepHead}>
          <span className={styles.stepNum} aria-hidden>
            3
          </span>
          Pile it on
          <span className={styles.stepCount}>{toppings.length} selected</span>
        </legend>
        <div className={styles.options}>
          {acaiBuilder.toppings.map((option) => (
            <button
              key={option.name}
              type="button"
              aria-pressed={toppings.includes(option.name)}
              onClick={() => setToppings((list) => toggle(list, option.name))}
              className={`${styles.option} ${
                toppings.includes(option.name) ? styles.optionOn : ""
              }`}
            >
              {option.name}
              <span className={styles.optionPrice}>+${option.price}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className={styles.totalBar}>
        <div className={styles.totalLeft}>
          <span className={styles.totalLabel}>Your bowl</span>
          <strong className={styles.totalValue}>${total}.00</strong>
          {/* Announced politely so screen-reader users hear the new total
              without every individual topping tap interrupting them. */}
          <p className={styles.totalSummary} aria-live="polite">
            {summary}
          </p>
        </div>
        <div className={styles.totalActions}>
          <a
            className={styles.totalPrimary}
            href={brand.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order on Uber Eats
          </a>
          <button
            type="button"
            className={styles.totalSecondary}
            onClick={copyOrder}
          >
            {copied ? "Copied ✓" : "Copy this order"}
          </button>
        </div>
      </div>
    </div>
  );
}
