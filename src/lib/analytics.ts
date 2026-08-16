/**
 * Conversion tracking.
 *
 * Nabil's has no on-site checkout — every sale completes on Uber Eats, on
 * DoorDash, or physically at the counter. So there is no `Purchase` event to
 * fire and no true ROAS to measure. What we count instead are *proxy
 * conversions*: the on-site actions that reliably precede money changing hands.
 *
 * Two consumers, two different jobs:
 *   - GA4  — our read on what happened.
 *   - Meta — the signal its ad algorithm optimises against. Without it, Meta
 *            spends budget on cheap clicks from people who never buy.
 *
 * Both are optional. With neither ID configured every call here is a no-op, so
 * this is safe to wire up before the accounts exist.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export type ConversionEvent =
  | "order_click"
  | "call_click"
  | "directions_click"
  | "social_click";

/**
 * Meta rewards its own standard events with better optimisation than custom
 * ones, so map to a standard name wherever the meaning genuinely matches.
 * `order_click` has no honest standard equivalent — the order happens on
 * someone else's domain, so calling it `Purchase` or `InitiateCheckout` would
 * be a lie we then optimise against. It stays custom.
 */
const META_STANDARD_EVENT: Partial<Record<ConversionEvent, string>> = {
  call_click: "Contact",
  directions_click: "FindLocation",
};

export type ConversionParams = {
  /** Which off-site destination: "ubereats", "doordash", "google_maps", … */
  platform?: string;
  /** Which counter the action refers to, where the link is location-specific. */
  location?: string;
  /** Where on the site it was clicked, so we can tell a hero CTA from a footer link. */
  placement?: string;
};

export function track(event: ConversionEvent, params: ConversionParams = {}) {
  // Guard rather than assume a browser: this module is imported by components
  // that render on the server first.
  if (typeof window === "undefined") return;

  window.gtag?.("event", event, params);

  const standard = META_STANDARD_EVENT[event];
  if (standard) {
    window.fbq?.("track", standard, params);
  } else {
    window.fbq?.("trackCustom", event, params);
  }
}
