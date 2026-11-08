/*
  Checks the cart's postage against the owner's Australia Post price list.
  Run: npx tsx scripts/check-postage.ts   (exits 1 on any mismatch)
*/
import { quote } from "../src/lib/shop";

type Case = { name: string; cart: { id: string; quantity: number }[]; parcel: number; express: number; parcels: number };

// Expected numbers follow from the table plus the packed weights in brand.ts
// (tub = net + 50g, bar = 475g so 1 boxed bar = the weighed 575g, packaging 100g per parcel). Re-derive them
// whenever the owner's weighed numbers replace those estimates.
const cases: Case[] = [
  // 475 + 100 = 575g (the owner's scale) -> up to 1kg
  { name: "1 Dubai bar", cart: [{ id: "dubai-bar", quantity: 1 }], parcel: 1600, express: 2000, parcels: 1 },
  // 2 x 475 + 100 = 1050g -> up to 3kg
  { name: "2 Dubai bars", cart: [{ id: "dubai-bar", quantity: 2 }], parcel: 2025, express: 2475, parcels: 1 },
  // 400 + 100 = 500g -> up to 500g (boundary is inclusive)
  { name: "1 Pistachio 350g", cart: [{ id: "pistachio-baklava", quantity: 1 }], parcel: 1170, express: 1520, parcels: 1 },
  // 550 + 100 = 650g -> up to 1kg
  { name: "1 Assorted 500g", cart: [{ id: "assorted-baklava", quantity: 1 }], parcel: 1600, express: 2000, parcels: 1 },
  // 475 + 400 + 100 = 975g -> up to 1kg  (the reel's $43 cart)
  { name: "Bar + Pistachio", cart: [{ id: "dubai-bar", quantity: 1 }, { id: "pistachio-baklava", quantity: 1 }], parcel: 1600, express: 2000, parcels: 1 },
  // 4 x 450 + 100 = 1900g -> up to 3kg
  { name: "4 Barazik", cart: [{ id: "barazik", quantity: 4 }], parcel: 2025, express: 2475, parcels: 1 },
  // 10 x 450 + 100 = 4600g -> up to 5kg
  { name: "10 Barazik", cart: [{ id: "barazik", quantity: 10 }], parcel: 2445, express: 3295, parcels: 1 },
  // 12 x 550 = 6600g item -> 2 parcels of 3300 + 100 = 3400g -> each up to 5kg
  { name: "12 Assorted", cart: [{ id: "assorted-baklava", quantity: 12 }], parcel: 2 * 2445, express: 2 * 3295, parcels: 2 },
];

let failed = 0;
for (const c of cases) {
  const parcel = quote(c.cart, "parcel");
  const express = quote(c.cart, "express");
  const ok =
    parcel.shippingCents === c.parcel &&
    express.shippingCents === c.express &&
    parcel.parcels === c.parcels &&
    parcel.service.id === "parcel" &&
    express.service.id === "express";
  if (!ok) failed++;
  console.log(
    `${ok ? "ok  " : "FAIL"} ${c.name.padEnd(18)} ${String(parcel.packedGrams).padStart(5)}g ` +
      `parcel ${parcel.shippingCents} (want ${c.parcel})  express ${express.shippingCents} (want ${c.express})  parcels ${parcel.parcels}`,
  );
}

// Untrusted input: unknown service falls back to the first; empty cart costs nothing.
const bogus = quote([{ id: "dubai-bar", quantity: 1 }], "drone");
const empty = quote([], "express");
const guards = bogus.service.id === "parcel" && empty.shippingCents === 0 && empty.parcels === 0;
if (!guards) failed++;
console.log(`${guards ? "ok  " : "FAIL"} unknown service -> parcel; empty cart -> $0`);

process.exit(failed ? 1 : 0);
