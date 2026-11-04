import { NextResponse, type NextRequest } from "next/server";
import { seal } from "@/lib/seal";
import { obtainToken, squareUrl, SQUARE_VERSION } from "@/lib/square";

/*
  Step 2 of connecting the owner's Square account: Square returns here with a
  one-time code. The code is exchanged for a long-lived refresh token, which is
  sealed with IQAN's connect public key (`lib/seal.ts`) before it leaves the
  server. Only the private key, kept off this site in `iqan-secrets`, can open
  it — so the owner can send the sealed code over WhatsApp, and nothing
  readable is ever shown, logged or stored here.
*/

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const done = (fragment: string) => {
    const response = NextResponse.redirect(new URL(`/shop/connected${fragment}`, url.origin));
    response.cookies.delete({ name: "square_oauth_state", path: "/api/square" });
    return response;
  };

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expected = request.cookies.get("square_oauth_state")?.value;
  const publicKey = process.env.SQUARE_CONNECT_PUBLIC_KEY;

  // Declined on Square's screen, an expired or forged return, or no key to
  // seal with: never exchange the code.
  if (!code || !state || state !== expected || !publicKey) {
    console.error("Square connect rejected", {
      squareError: url.searchParams.get("error"),
      hasCode: Boolean(code),
      stateMatches: Boolean(state) && state === expected,
    });
    return done("?status=failed");
  }

  try {
    const token = await obtainToken({ code });
    const locations = await fetch(squareUrl("/v2/locations"), {
      headers: { Authorization: `Bearer ${token.access_token}`, "Square-Version": SQUARE_VERSION },
      cache: "no-store",
    }).then((response) => response.json());

    // The fragment never reaches a server, so the sealed code is not in any
    // request log either.
    const sealed = seal(
      {
        refresh_token: token.refresh_token,
        merchant_id: token.merchant_id,
        locations: (locations?.locations ?? []).map(
          (location: { id: string; name: string; status: string; currency: string }) => ({
            id: location.id,
            name: location.name,
            status: location.status,
            currency: location.currency,
          }),
        ),
        connected_at: new Date().toISOString(),
      },
      Buffer.from(publicKey, "base64").toString("utf8"),
    );
    return done(`#${sealed}`);
  } catch (error) {
    console.error("Square connect failed", error instanceof Error ? error.message : error);
    return done("?status=failed");
  }
}
