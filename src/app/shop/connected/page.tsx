import type { Metadata } from "next";
import {
  StationPage,
  Panel,
  PanelBody,
  stationStyles as s,
} from "@/components/station/StationPanels";
import { ConnectedCode } from "@/components/shop/ConnectedCode";
import { pageMetadata } from "@/lib/seo";

// Where `/api/square/callback` lands the owner after Square's "Allow". The
// sealed code rides in the URL fragment, so only this page's script sees it.
export const metadata: Metadata = pageMetadata({
  title: "Square connected",
  description: "Connecting Nabil's Açaí Station's Square account to the online shop.",
  path: "/shop/connected",
  noindex: true,
});

export default function Page() {
  return (
    <StationPage>
      <Panel opening labelledBy="connected-title">
        <PanelBody>
          <ConnectedCode
            label={<span className={s.label}>Online shop</span>}
            titleClassName={s.title}
            ledeClassName={s.lede}
          />
        </PanelBody>
      </Panel>
    </StationPage>
  );
}
