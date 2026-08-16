import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";
import { TrackedLink } from "@/components/shared/TrackedLink";

/*
  Closing band for Our Story and Order. Was a lime-green panel beside a boxed
  photo with a 2px purple frame; now the same night band the menu and the
  homepage film close on, with the photograph full-bleed behind it.
*/
export function FinalCta() {
  return (
    <section className={styles.root} aria-labelledby="final-cta-title">
      <div className={styles.opening} style={{ minHeight: "44vh" }}>
        <Image
          className={styles.openingMedia}
          src="/images/enhanced/fruit-cocktail-client-enhanced.jpg"
          alt=""
          aria-hidden="true"
          fill
          quality={90}
          sizes="100vw"
        />
        <div className={styles.openingScrim} />
        <div className={styles.openingInner}>
          <span className={styles.eyebrow}>Come say hi</span>
          <h2 id="final-cta-title" className={styles.openingTitle}>
            The menu is calling
          </h2>
          <p className={styles.openingLede}>
            Walk in, order delivery, or pick the sweet you&apos;re thinking about
            before someone else adds three toppings.
          </p>
          <div
            className={styles.closingActions}
            style={{ justifyContent: "center", marginTop: "var(--ds-step-4)" }}
          >
            <Link href="/menu" className={`${styles.btn} ${styles.btnPrimary}`}>
              View the menu
            </Link>
            <TrackedLink
              event="order_click"
              eventParams={{ platform: "ubereats", placement: "final_cta" }}
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnGhost}`}
            >
              Order delivery
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
