// Site-wide gate for the LP Refresher Library.
//
// Every request (including static assets) must carry a valid session cookie
// set by /__auth — the receiving end of the members-platform token
// handshake. No valid cookie → the brand-matched deny page; the library's
// HTML/JS/CSS never reaches the browser. This replaces the old client-side
// password overlay as the real fence (the overlay can stay as a harmless
// second layer until it's removed).
//
// Secrets: REFRESHER_SHARED_SECRETS (comma-separated, rotation-friendly) —
// set in the Cloudflare Pages project env, same list as the platform's
// Vercel env. PLATFORM_URL points the deny page's CTA at the platform.

import {
  denyResponse,
  EXPECTED_AUDIENCE,
  readCookie,
  SECRETS_BINDING,
  SESSION_COOKIE,
  verifyToken,
} from "./jwt.js";

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // The handshake endpoint itself is the one ungated path.
  if (url.pathname === "/__auth") return next();

  const cookie = readCookie(request.headers.get("Cookie"), SESSION_COOKIE);
  const claims = await verifyToken(cookie, env[SECRETS_BINDING], EXPECTED_AUDIENCE);
  if (claims) return next();

  return denyResponse(env, 401);
}
