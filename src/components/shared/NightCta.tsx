import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";
import { TrackedLink } from "@/components/shared/TrackedLink";

export function NightCta({
  secondaryHref,
  secondaryLabel,
}: {
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className={styles.root} aria-labelledby="night-cta-title">
      <div className={styles.opening} style={{ minHeight: "44vh" }}>
        <Image
          className={styles.openingMedia}
          src="/images/enhanced/strawberry-cup-neon.jpg"
          alt=""
          aria-hidden="true"
          fill
          quality={90}
          sizes="100vw"
        />
        <div className={styles.openingScrim} />
        <div className={styles.openingInner}>
          <span className={styles.eyebrow}>Made for sweet moments</span>
          <h2 id="night-cta-title" className={styles.openingTitle}>
            Your next favourite is waiting
          </h2>
          <div
            className={styles.closingActions}
            style={{ justifyContent: "center", marginTop: "var(--ds-step-4)" }}
          >
            <TrackedLink
              event="order_click"
              eventParams={{ platform: "ubereats", placement: "night_cta" }}
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Order on Uber Eats
            </TrackedLink>
            <Link href={secondaryHref} className={`${styles.btn} ${styles.btnGhost}`}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
