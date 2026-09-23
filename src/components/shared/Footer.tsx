import Image from "next/image";
import Link from "next/link";
import { BiLogoInstagram, BiLogoTiktok } from "react-icons/bi";
import { brand, locations } from "@/lib/brand";
import styles from "./Footer.module.css";

/*
  The footer in the reference's grammar.

  It used to be a plum band under a cream strip, which meant every route —
  including the black cinematic homepage — ended on two colour changes that
  belong to the pre-redesign system. On a page whose whole premise is one
  unbroken black ground, that read as the site running out of design at the
  bottom. It is now the last outlined panel in the stack: same 8px inset, same
  cream hairline, same radius, no ground change at all.
*/

function shortAddress(full: string) {
  return full.replace(/\sWA\s?\d{4}.*$/i, "");
}

const explore = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "Our story" },
  { href: "/order", label: "Order" },
  { href: "/specials", label: "Specials" },
] as const;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.panel}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <a href="/" aria-label="Nabil's Açaí Station home" className={styles.logo}>
              <Image
                src="/brand/logo-round.png"
                alt="Nabil's Açaí Station"
                width={1024}
                height={1024}
              />
              <span>
                <span className={styles.logoName}>Nabil&apos;s</span>
                <span className={styles.logoSub}>Açaí Station · Perth</span>
              </span>
            </a>
            <p className={styles.blurb}>
              Açaí, crêpes, Dubai chocolate and Lebanese sweets in Perth.
            </p>
            <p className={styles.tagline}>{brand.tagline}</p>
          </div>

          <div>
            <p className={styles.colLabel}>Visit</p>
            <ul className={styles.visitList}>
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link href={`/locations#${location.slug}`} className={styles.visitName}>
                    {location.name}
                  </Link>
                  <p className={styles.visitAddress}>{shortAddress(location.address)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.colLabel}>Explore</p>
            <nav aria-label="Footer" className={styles.exploreNav}>
              {explore.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <a href={brand.phoneHref}>{brand.phone}</a>
            </nav>
            <div className={styles.social}>
              <a
                href={brand.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <BiLogoInstagram aria-hidden />
              </a>
              <a
                href={brand.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <BiLogoTiktok aria-hidden />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.baseline}>
          <p>
            © {new Date().getFullYear()} {brand.name}.
          </p>
          <p>Perth, Western Australia</p>
        </div>
      </div>
    </footer>
  );
}
