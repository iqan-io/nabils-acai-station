import { brand, locations } from "@/lib/brand";
import { SiDoordash, SiUbereats } from "react-icons/si";
import { PageHero } from "@/components/shared/PageHero";

const delivery = [
  {
    name: "Uber Eats",
    url: brand.orderUrl,
    note: "Choose your available Nabil's location in Uber Eats.",
    logo: SiUbereats,
    colour: "#06C167",
  },
  {
    name: "DoorDash",
    url: brand.doordashUrl,
    note: "Ballajura delivery through DoorDash.",
    logo: SiDoordash,
    colour: "#FF3008",
  },
];

export function OrderHero() {
  return (
    <PageHero
      eyebrow="Order Nabil's"
      title="Delivered, or ready at the counter."
      lead="Choose a delivery platform, or get directions and pick it up yourself before the group chat changes its mind."
      image={{
        src: "/images/enhanced/viral-dubai-strawberry.png",
        alt: "Nabil's Dubai strawberry cups ready at the counter",
      }}
    />
  );
}

export function OrderInfo() {
  return (
    <section
      className="bg-[var(--c-paper)]"
      style={{ fontFamily: "var(--font-counter-body)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-2 lg:px-8 lg:py-16">
        <article className="rounded-2xl border border-[var(--c-line)] bg-[var(--c-card)] p-6 sm:p-7">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-[var(--c-ink-3)]">
            Delivery
          </p>
          <h2 className="mt-2 text-[1.6rem] text-[var(--c-ink)] [text-transform:none]">
            Bring Nabil&apos;s to you.
          </h2>

          <ul className="mt-5 space-y-2.5">
            {delivery.map((item) => {
              const Logo = item.logo;
              return (
                <li key={item.name}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--c-line)] p-4 transition-colors hover:border-[var(--c-grape)]"
                  >
                    <span className="flex min-w-0 items-center gap-3.5">
                      <Logo
                        aria-hidden
                        className="size-7 shrink-0"
                        style={{ color: item.colour }}
                      />
                      <span className="min-w-0">
                        <span className="block text-[1.05rem] font-bold text-[var(--c-ink)]">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block text-[0.85rem] leading-relaxed text-[var(--c-ink-2)]">
                          {item.note}
                        </span>
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="text-[var(--c-grape)] transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="mt-4 text-[0.8rem] leading-relaxed text-[var(--c-ink-3)]">
            Availability varies by platform, location and time.
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--c-line)] bg-[var(--c-card)] p-6 sm:p-7">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.09em] text-[var(--c-ink-3)]">
            Pick up
          </p>
          <h2 className="mt-2 text-[1.6rem] text-[var(--c-ink)] [text-transform:none]">
            Head to the counter.
          </h2>

          <ul className="mt-5 space-y-2.5">
            {locations.map((location) => (
              <li
                key={location.slug}
                className="rounded-xl border border-[var(--c-line)] p-4"
              >
                <h3 className="text-[1.15rem] text-[var(--c-ink)] [text-transform:none]">
                  {location.name}
                </h3>
                <p className="mt-1 text-[0.88rem] leading-relaxed text-[var(--c-ink-2)]">
                  {location.address}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-[0.88rem] font-bold text-[var(--c-grape)]">
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    Directions ↗
                  </a>
                  {"phone" in location && location.phone && (
                    <a
                      href={`tel:${location.phone.replace(/\s+/g, "")}`}
                      className="underline-offset-4 hover:underline"
                    >
                      Call {location.phone}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
