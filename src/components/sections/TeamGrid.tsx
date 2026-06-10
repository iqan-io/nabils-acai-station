import Image from "next/image";
import { team } from "@/lib/brand";
import { Sparkle } from "@/components/shared/Ornaments";

// STATIC PREVIEW of the "cheers" feature.
//
// For now this renders a non-interactive pill so the client can see the layout
// and approve the concept. When the voting backend lands (Upstash Redis + the
// /api/cheers route), this whole card becomes a client component: the pill turns
// into a button that POSTs a cheer for `member.slug`, shows the live count, and
// disables itself once this visitor has cheered (cookie + server-side daily cap).
// Cheers are upvote-only by design — no downvotes — so nobody can be publicly
// dragged down; the monthly leaderboard just reorders by who got the most love.
function CheersPreview() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cream-warm)] px-3.5 py-1.5 text-xs font-semibold text-[var(--acai)] ring-1 ring-[var(--acai)]/15">
      <span aria-hidden>👏</span>
      Cheers coming soon
    </span>
  );
}

export function TeamGrid() {
  return (
    <section className="relative bg-[var(--cream-warm)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-50 mix-blend-multiply"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.32em] text-[var(--acai)]/70">
            <Sparkle className="size-3 text-[var(--saffron)]" />
            The team
          </div>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-[var(--acai-deep)] md:text-5xl">
            The people who <span className="italic">make your day sweeter</span>.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--acai-deep)]/80 md:text-lg">
            Every bowl, crêpe and cup is made by hand by this crew. Soon
            you&rsquo;ll be able to give a shout-out to the team members who made
            your moment — a little friendly competition for the most cheers each
            month.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {team.map((member) => (
            <li
              key={member.slug}
              className="group flex flex-col overflow-hidden rounded-3xl bg-[var(--cream)] ring-1 ring-[var(--acai)]/12 shadow-[0_24px_50px_-32px_rgba(31,11,37,0.4)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.photo}
                  alt={`${member.name}, ${member.role} at Nabil's Acai Station`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {member.location && (
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--cream)]/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[var(--acai)] backdrop-blur">
                    {member.location}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl leading-tight text-[var(--acai-deep)]">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[var(--cedar)]">
                  {member.role}
                </p>
                {member.funFact && (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--acai-deep)]/70">
                    {member.funFact}
                  </p>
                )}
                <div className="mt-5 pt-1">
                  <CheersPreview />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
