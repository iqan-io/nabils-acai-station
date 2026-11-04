/*
  Square connection details, shared by `/api/checkout` and the one-time
  `/api/square/*` connect flow. Server-only: it reads secrets.

  Environment (Vercel project settings, never the repo — this repo is public):
    SQUARE_ENVIRONMENT        "production" for real money; anything else is sandbox
    SQUARE_LOCATION_ID        the Square location online orders are booked under
    SQUARE_ACCESS_TOKEN       a fixed token (sandbox testing); wins if set
    SQUARE_APPLICATION_ID     IQAN Online Shop's application id   } production:
    SQUARE_APPLICATION_SECRET IQAN Online Shop's application secret } a fresh
    SQUARE_REFRESH_TOKEN      from the owner's OAuth "Allow"       } token per 30 days
    SQUARE_CONNECT_PUBLIC_KEY base64 PEM; encrypts the connect result (see
                              `scripts/square-connect.mjs`)
*/

export const SQUARE_VERSION = "2026-09-16";

export const isProduction = () => process.env.SQUARE_ENVIRONMENT === "production";

export function squareUrl(path: string) {
  return `https://connect.${isProduction() ? "squareup" : "squareupsandbox"}.com${path}`;
}

/** The permissions IQAN Online Shop asks the owner for: orders and payments, nothing else. */
export const OAUTH_SCOPES = [
  "ORDERS_READ",
  "ORDERS_WRITE",
  "PAYMENTS_WRITE",
  "MERCHANT_PROFILE_READ",
];

/** Exchanges an authorization code or a refresh token at Square's ObtainToken. */
export async function obtainToken(
  grant: { code: string } | { refresh_token: string },
) {
  const response = await fetch(squareUrl("/oauth2/token"), {
    method: "POST",
    headers: { "Content-Type": "application/json", "Square-Version": SQUARE_VERSION },
    body: JSON.stringify({
      client_id: process.env.SQUARE_APPLICATION_ID,
      client_secret: process.env.SQUARE_APPLICATION_SECRET,
      grant_type: "code" in grant ? "authorization_code" : "refresh_token",
      ...grant,
    }),
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || typeof data?.access_token !== "string") {
    throw new Error(`Square token exchange failed (${response.status}): ${JSON.stringify(data?.errors ?? data)}`);
  }
  return data as {
    access_token: string;
    expires_at: string;
    merchant_id: string;
    refresh_token?: string;
  };
}

// An access token lasts 30 days; one per warm server instance is plenty.
let cached: { token: string; expiresAt: number } | null = null;

/** A working access token, or `null` when checkout is not configured. */
export async function accessToken(): Promise<string | null> {
  if (process.env.SQUARE_ACCESS_TOKEN) return process.env.SQUARE_ACCESS_TOKEN;

  const refreshToken = process.env.SQUARE_REFRESH_TOKEN;
  if (!refreshToken || !process.env.SQUARE_APPLICATION_ID || !process.env.SQUARE_APPLICATION_SECRET) {
    return null;
  }

  const DAY = 24 * 60 * 60 * 1000;
  if (cached && cached.expiresAt - DAY > Date.now()) return cached.token;

  const fresh = await obtainToken({ refresh_token: refreshToken });
  cached = { token: fresh.access_token, expiresAt: Date.parse(fresh.expires_at) };
  return cached.token;
}
