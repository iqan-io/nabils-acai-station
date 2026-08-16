"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { track, type ConversionEvent, type ConversionParams } from "@/lib/analytics";

/**
 * An `<a>` that reports a conversion when clicked.
 *
 * This exists so that server components — `OrderInfo`, `LocationsFull`,
 * `FinalCta`, `NightCta`, `Footer` — can track a click without themselves
 * becoming client components. Marking a whole section `"use client"` to count
 * one click ships that entire section's JS to the browser for no reason; this
 * moves the boundary down to the single link that needs it.
 *
 * Props pass straight through, so this is a drop-in for a plain `<a>`.
 */

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  event: ConversionEvent;
  eventParams?: ConversionParams;
};

export function TrackedLink({
  event,
  eventParams,
  onClick,
  children,
  ...anchorProps
}: TrackedLinkProps) {
  function handleClick(clickEvent: MouseEvent<HTMLAnchorElement>) {
    // Fire before navigation. These are all `target="_blank"` or `tel:` links,
    // so the current document survives the click and the beacon has time to
    // leave. A same-tab navigation would need `transport_type: "beacon"`.
    track(event, eventParams);
    onClick?.(clickEvent);
  }

  return (
    <a {...anchorProps} onClick={handleClick}>
      {children}
    </a>
  );
}
