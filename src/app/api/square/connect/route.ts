import { NextResponse } from "next/server";
import { isProduction, OAUTH_SCOPES, squareUrl } from "@/lib/square";

/*
  Step 1 of connecting the owner's Square account (done once, by the owner):
  send them to Square's authorization page for IQAN Online Shop. Square comes
  back to `/api/square/callback`, the redirect URL set in the developer console.
  The `state` cookie lets the callback reject a response we did not ask for.
*/

export async function GET() {
  const clientId = process.env.SQUARE_APPLICATION_ID;
  if (!clientId || !process.env.SQUARE_CONNECT_PUBLIC_KEY) {
    return new Response("Square connection isn't configured on this site.", { status: 503 });
  }

  const state = crypto.randomUUID();
  const authorize = new URL(squareUrl("/oauth2/authorize"));
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("scope", OAUTH_SCOPES.join(" "));
  // Required in production: makes the owner sign in, so the account that
  // authorizes is the one they mean, not whichever is already signed in.
  authorize.searchParams.set("session", "false");
  authorize.searchParams.set("state", state);

  const response = NextResponse.redirect(authorize);
  response.cookies.set("square_oauth_state", state, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax",
    path: "/api/square",
    maxAge: 15 * 60,
  });
  return response;
}
