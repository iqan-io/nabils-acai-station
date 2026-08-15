import type { Metadata } from "next";
import { Nunito, Titan_One } from "next/font/google";
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
import { brandAssets } from "@/lib/brandAssets";

const titanOne = Titan_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-titan-one",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

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
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: brandAssets.faviconIco, type: "image/x-icon" },
      { url: brandAssets.faviconPng, type: "image/png", sizes: "512x512" },
      { url: brandAssets.faviconWebp, type: "image/webp", sizes: "512x512" },
    ],
    shortcut: brandAssets.faviconIco,
    apple: [{ url: brandAssets.faviconPng, sizes: "512x512" }],
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
  return (
    <html
      lang="en"
      className={`${titanOne.variable} ${nunito.variable} h-full antialiased`}
    >
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
