import { brand } from "@/lib/brand";
import { TrackedLink } from "@/components/shared/TrackedLink";
import styles from "./StationPage.module.css";

/**
 * The persistent bottom-right pill.
 *
 * It is in every frame of the reference recording and never leaves the screen,
 * which is a real part of why that site reads the way it does — there is always
 * one filled cream shape on a black page. Nabil's has no on-site checkout, so
 * the pill goes where the order actually completes (Uber Eats) rather than to a
 * cart that does not exist, and it reports `order_click` like every other
 * ordering link on the site.
 */
export function OrderPickupPill({ placement }: { placement: string }) {
  return (
    <TrackedLink
      event="order_click"
      eventParams={{ platform: "ubereats", placement }}
      href={brand.orderUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.orderPickup}
    >
      Order pickup
    </TrackedLink>
  );
}
