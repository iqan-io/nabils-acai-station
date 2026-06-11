import Image from "next/image";
import Link from "next/link";
import { signatures } from "@/lib/brand";
import { Sparkle } from "@/components/shared/Ornaments";

export function Signatures() {
  return (
    <section className="relative overflow-hidden bg-[var(--acai-deep)] text-[var(--cream)]">
      {/* Sunburst rays — direct lift from Nabil's own menu boards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-sunburst-acai"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(180deg, rgba(31,11,37,1), rgba(31,11,37,0))",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32 lg:px-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-[0.7rem] uppercase tracking-[0.32em] text-[var(--saffron)] flex items-center gap-2">
              <Sparkle className="size-3 text-[var(--saffron)]" /> The signatures
            </div>
            <h2 className="mt-4 font-display text-4xl leading-[1.04] tracking-tight md:text-5xl lg:text-6xl">
              The bowls and crêpes <span className="italic">people actually queue for.</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--cream)]/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--cream)] transition-colors hover:bg-[var(--cream)] hover:text-[var(--acai-deep)]"
          >
            See the full menu
            <span aria-hidden className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
          {signatures.map((item, idx) => (
            <article
              key={item.name}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[var(--cream)] text-[var(--acai-deep)] ring-1 ring-[var(--acai)]/15 transition-transform duration-500 hover:-translate-y-1"
              style={{
                transform:
                  idx % 2 === 0 ? "rotate(-0.4deg)" : "rotate(0.4deg)",
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--cream-warm)]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {item.tag && (
                  <span
                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${
                      item.tag === "viral"
                        ? "bg-[var(--strawberry)] text-[var(--cream)]"
                        : "bg-[var(--saffron)] text-[var(--acai-deep)]"
                    }`}
                  >
                    {item.tag === "viral" && (
                      <Sparkle className="size-2.5 text-[var(--cream)]" />
                    )}
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl leading-tight">
                    {item.name}
                  </h3>
                  <span className="shrink-0 font-semibold text-sm tracking-wide text-[var(--acai)]">
                    {item.price}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--acai-deep)]/75">
                  {item.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Allergen / footnote */}
        <p className="mt-12 max-w-3xl text-xs text-[var(--cream)]/60">
          Drizzles, toppings and signature flavours rotate. The full menu —
          including matcha, mocktails, milkshakes, lattes and probiotic
          splashes — lives on the{" "}
          <Link
            href="/menu"
            className="underline-offset-4 hover:underline text-[var(--cream)]"
          >
            menu page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
