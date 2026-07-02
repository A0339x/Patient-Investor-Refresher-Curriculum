// POST /__auth — receiving end of the members-platform handshake.
//
// The platform's /open-refresher page mints a short-lived HS256 JWT and
// auto-submits a top-level form POST here (field "t"). Verify it, set the
// first-party session cookie, and redirect to the library. See the
// platform's app/open-digest/page.tsx design comment for why a form POST
// (first-party cookie, token never in a URL).
//
// The cookie stores the JWT itself; _middleware.js re-verifies it (including
// expiry) on every request, so there is no separate session store. Max-Age
// mirrors the token's remaining life — when it lapses, the member just
// clicks Videos in the platform again.

import {
  denyResponse,
  EXPECTED_AUDIENCE,
  SECRETS_BINDING,
  SESSION_COOKIE,
  verifyToken,
} from "./jwt.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  let token = null;
  try {
    const form = await request.formData();
    const value = form.get("t");
    if (typeof value === "string") token = value;
  } catch {
    // Not form-encoded — fall through to deny.
  }

  const claims = await verifyToken(token, env[SECRETS_BINDING], EXPECTED_AUDIENCE);
  if (!claims) return denyResponse(env, 403);

  const maxAge = Math.max(0, claims.exp - Math.floor(Date.now() / 1000));
  const url = new URL(request.url);
  return new Response(null, {
    status: 303,
    headers: {
      Location: `${url.origin}/`,
      "Set-Cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`,
      "Cache-Control": "no-store",
    },
  });
}

// A GET (someone typing /__auth into the bar) just gets the deny page.
export async function onRequestGet(context) {
  return denyResponse(context.env, 401);
}
