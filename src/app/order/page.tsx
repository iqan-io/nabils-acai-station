import type { Metadata } from "next";
import { OrderHero, OrderInfo } from "@/components/sections/OrderInfo";
import { FinalCta } from "@/components/sections/FinalCta";
import { pageMetadata } from "@/lib/seo";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

export const metadata: Metadata = pageMetadata({
  title: "Order",
  description:
    "Order Nabil's Acai Station for pickup or delivery in Perth through Uber Eats or DoorDash. Get acai bowls, Dubai chocolate, crepes and desserts from Mount Lawley or Ballajura.",
  path: "/order",
  keywords: [
    "order acai Perth",
    "acai delivery Perth",
    "Dubai chocolate delivery Perth",
    "dessert delivery Mount Lawley",
  ],
});

export default function Page() {
  return (
    <>
      <ScrollReveal />
      <OrderHero />
      <OrderInfo />
      <FinalCta />
    </>
  );
}
