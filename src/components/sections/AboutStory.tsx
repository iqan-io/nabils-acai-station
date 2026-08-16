import Image from "next/image";
import { founder } from "@/lib/brand";
import styles from "@/components/shared/Page.module.css";

export function AboutHero() {
  return (
    <section className={styles.opening} aria-labelledby="about-title">
      <Image
        className={styles.openingMedia}
        src="/images/enhanced/story-mt-lawley-interior.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={90}
        sizes="100vw"
      />
      <div className={styles.openingScrim} />
      <div className={styles.openingInner}>
        <span className={styles.eyebrow}>Our story</span>
        <h1 id="about-title" className={styles.openingTitle}>
          Family shop, big sweet energy
        </h1>
        <p className={styles.openingLede}>
          From a Lebanese sweets stall in Ballajura to Perth&apos;s viral açaí
          and Dubai chocolate — same family, same kitchen, made for sweet
          moments.
        </p>
      </div>
    </section>
  );
}

export function FounderFeature() {
  return (
    <div className={styles.root}>
      <section className={`${styles.band} ${styles.paper}`} aria-labelledby="founder-title">
        <div className={styles.shell}>
          <header className={styles.bandHead}>
            <span className={styles.bandIndex}>01</span>
            <h2 id="founder-title" className={styles.bandTitle}>
              Meet the owner
            </h2>
          </header>

          <article className={styles.row}>
            {/* The founder portrait is 1023x1537; the old fixed 4/3 box cut his
                head and the bakery racks out of frame. */}
            <div
              className={styles.rowMedia}
              style={{ "--media-ratio": "1023 / 1537" } as React.CSSProperties}
            >
              <Image
                src={founder.photo}
                alt={`${founder.name}, ${founder.role} of Nabil's Açaí Station`}
                fill
                quality={90}
                sizes="(min-width: 64rem) 40vw, (min-width: 48rem) 46vw, 100vw"
                className="object-top"
              />
              <span className={styles.mediaCaption}>
                {founder.name} · {founder.role}
              </span>
            </div>
            <div className={styles.rowBody}>
              <h3 className={styles.sectionTitle}>{founder.name}</h3>
              {/* Bio runs as prose at a 60ch measure. The old version ran the
                  full panel width, well past a comfortable line length. */}
              <div className={styles.prose}>
                {founder.bio.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>
              {founder.pullQuote && (
                <blockquote className={styles.quote}>{founder.pullQuote}</blockquote>
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
