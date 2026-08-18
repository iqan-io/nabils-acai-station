import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";

export function SpecialsComingSoon() {
  return (
    <div className={styles.root}>
      <section className={styles.opening} aria-labelledby="specials-title">
        <Image
          className={styles.openingMedia}
        data-parallax
          src="/images/enhanced/menu-dubai-chocolate.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          quality={90}
          sizes="100vw"
        />
        <div className={styles.openingScrim} />
        <div className={styles.openingInner}>
          <span className={styles.eyebrow}>Drops + limited runs</span>
          <h1 id="specials-title" className={styles.openingTitle}>
            New sweets land fast
          </h1>
          <p className={styles.openingLede}>
            Seasonal flavours, Dubai chocolate drops and one-off experiments show
            up on Instagram first. The everyday favourites are always on the menu.
          </p>
          <div className={styles.closingActions} style={{ justifyContent: "center", marginTop: "var(--ds-step-4)" }}>
            <a
              href={brand.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Follow on Instagram
            </a>
            <Link href="/menu" className={`${styles.btn} ${styles.btnGhost}`}>
              Browse the menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
