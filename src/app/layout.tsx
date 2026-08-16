import type { Metadata } from "next";
import ReactDOM from "react-dom";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Analytics } from "@/components/shared/Analytics";
import { StructuredData } from "@/components/shared/StructuredData";
import {
  defaultKeywords,
  localBusinessJsonLd,
  siteUrl,
} from "@/lib/seo";

const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nabil's Acai Station - Acai, Crepes & Dubai Chocolate in Perth",
    template: "%s | Nabil's Acai Station",
  },
  description:
    "Acai bowls, crepes and Dubai chocolate in Perth. Made for sweet moments - open till late in Mount Lawley and Ballajura.",
  keywords: defaultKeywords,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.png", type: "image/png", sizes: "1024x1024" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Nabil's Acai Station",
    description:
      "Acai bowls, crepes and Dubai chocolate in Perth. Made for sweet moments.",
    url: "/",
    siteName: "Nabil's Acai Station",
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: "/images/enhanced/hero-bueno-editorial-v3.jpg",
        width: 1200,
        height: 630,
        alt: "Nabil's Acai Station acai bowl with chocolate drizzle and strawberries",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nabil's Acai Station",
    description:
      "Acai bowls, crepes and Dubai chocolate in Perth. Made for sweet moments.",
    images: ["/images/enhanced/hero-bueno-editorial-v3.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Both brand faces are above the fold on every route — Titan One in the first
  // heading, Nunito in the nav — so both are preloaded. The Nunito italic and
  // the Baloo 2 / Fredoka display fallbacks deliberately are not.
  //
  // This is ReactDOM.preload rather than a <link> in the tree: React hoists a
  // rendered `link rel="preload"` into the head *and* keeps the element where
  // it was declared, so the JSX form emitted every preload twice.
  ReactDOM.preload("/fonts/titan-one-latin.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });
  ReactDOM.preload("/fonts/nunito-latin-variable.woff2", {
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  });

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--cream)] text-[var(--acai-deep)]">
        <Analytics />
        <VercelAnalytics />
        <SpeedInsights />
        <StructuredData data={localBusinessJsonLd()} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
