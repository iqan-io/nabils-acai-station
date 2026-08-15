"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus } from "@/lib/hours";
import styles from "./HomeCounter.module.css";

/**
 * Live "open now / closes 11 PM" pill for the Mount Lawley flagship.
 *
 * Computed after mount rather than on the server: the page is statically
 * rendered, so a build-time status would be frozen at deploy time and would
 * confidently tell a visitor the shop is open at 3 AM. Until it resolves the
 * pill renders the trading window as a plain fact, which is true at any hour
 * and avoids a hydration mismatch.
 */
export function LiveStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    setStatus(getOpenStatus());
    // Re-check every minute so the pill flips at close without a reload.
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) {
    return (
      <span className={styles.statusPill}>
        <span className={styles.statusDotIdle} aria-hidden />
        Mount Lawley · open till 11 PM Thu–Sat
      </span>
    );
  }

  return (
    <span className={styles.statusPill}>
      <span
        className={status.open ? styles.statusDotOpen : styles.statusDotShut}
        aria-hidden
      />
      {status.open
        ? `Open now · closes ${status.closesAt}`
        : `Closed · opens ${status.opensAt}${
            status.opensDay ? ` ${status.opensDay}` : ""
          }`}
    </span>
  );
}
