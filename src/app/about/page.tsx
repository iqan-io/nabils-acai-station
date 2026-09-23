import type { Metadata } from "next";
import {
  StationPage,
  Panel,
  PanelBody,
  PanelSplit,
  PanelMedia,
  stationStyles as s,
} from "@/components/station/StationPanels";
import { ContactPanel } from "@/components/station/ContactPanel";
import { OrderPickupPill } from "@/components/station/OrderPickupPill";
import { founder } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Our Story",
  description:
    "Meet the family behind Nabil's Acai Station — from a Lebanese sweets stall in Ballajura to Perth's viral acai and Dubai chocolate. Founder story and the team.",
  path: "/about",
  keywords: [
    "Nabil's Acai Station founder",
    "Nabil's Acai Station team",
    "about Nabil's Acai Station",
    "Lebanese sweets Perth family",
  ],
});

export default function Page() {
  return (
    <StationPage>
      {/* The reference's about page: headline on black in the left half, food
          photography filling the right half of the same panel, the nav riding
          over the top of it. */}
      <Panel opening labelledBy="about-title">
        <PanelSplit wide>
          <PanelBody>
            <span className={s.label}>Our story</span>
            <h1 id="about-title" className={s.title}>
              Family shop, big sweet energy.
            </h1>
            <p className={s.lede}>
              From a Lebanese sweets stall in Ballajura to Perth&apos;s viral
              açaí and Dubai chocolate — same family, same kitchen, made for
              sweet moments.
            </p>
          </PanelBody>
          {/* 1448x1086. The previous display-case crop was 614x768 and was
              drawn at up to 816px wide — visibly soft on any retina screen. */}
          <PanelMedia
            src="/images/locations/location-ballajura.png"
            alt="The Nabil's Lebanese Sweets counter at Ballajura City Shopping Centre, where the family business began"
            imgClassName={s.storefrontCrop}
            priority
          />
        </PanelSplit>
      </Panel>

      <Panel labelledBy="founder-title">
        <PanelSplit flip>
          <PanelBody>
            <span className={s.label}>Meet the owner</span>
            <h2 id="founder-title" className={s.heading}>
              {founder.name}
            </h2>
            <div className={s.prose} style={{ marginTop: "var(--ds-step-3)" }}>
              {founder.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            {founder.pullQuote && <p className={s.quote}>{founder.pullQuote}</p>}
          </PanelBody>
          {/* A 2:3 portrait in a landscape half. Contained it left cream bars
              either side of a black page, so it covers instead — with the crop
              held at the very top. The frame runs face at 5-25% and the two
              chocolate bars across the lower half, and a landscape half cannot
              hold both — on a panel headed "Meet the owner" the face is the
              subject, so the crop keeps it and loses the bottom of the bars. */}
          <PanelMedia
            src={founder.photo}
            alt={`${founder.name}, ${founder.role} of Nabil's Açaí Station`}
            caption={`${founder.name} · ${founder.role}`}
            objectPosition="50% 4%"
          />
        </PanelSplit>
      </Panel>

      <ContactPanel placement="about_contact" />

      <OrderPickupPill placement="about_page" />
    </StationPage>
  );
}
