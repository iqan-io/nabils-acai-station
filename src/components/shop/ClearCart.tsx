"use client";

import { useEffect } from "react";

/** Empties the `/shop` cart once the buyer is back from a paid Square checkout. */
export function ClearCart() {
  useEffect(() => {
    try {
      localStorage.removeItem("nabils-shop-cart");
    } catch {
      // Storage blocked: there was no stored cart to clear.
    }
  }, []);
  return null;
}
