import type { Metadata } from "next";
import { SpecialsComingSoon } from "@/components/sections/SpecialsComingSoon";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Specials",
    description:
      "Dubai chocolate drops, seasonal flavours and limited-run specials from Nabil's Acai Station in Perth. Follow the latest Mount Lawley and Ballajura dessert updates.",
    path: "/specials",
    keywords: [
      "Dubai chocolate Perth",
      "Dubai chocolate specials Perth",
      "viral desserts Perth",
      "Nabil's specials",
    ],
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return <SpecialsComingSoon />;
}
