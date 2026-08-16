import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";

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
            <a
              href={brand.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Order on Uber Eats
            </a>
            <Link href={secondaryHref} className={`${styles.btn} ${styles.btnGhost}`}>
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
