// Shared JWT verification for the Pages Functions gate (_middleware.js and
// __auth.js). Deliberately dependency-free: HS256 verify via WebCrypto, so
// the Pages build needs no package.json / npm install.
//
// Token contract (must match the members platform's lib/unlocks/auth.ts):
//   - HS256, issuer "social.patient-investor"
//   - audience "refresher" (each gated site validates its own key)
//   - secrets: comma-separated REFRESHER_SHARED_SECRETS env binding; any
//     listed secret validates (zero-downtime rotation — signer on the
//     platform side always uses the first).

export const JWT_ISSUER = "social.patient-investor";
export const EXPECTED_AUDIENCE = "refresher";
export const SECRETS_BINDING = "REFRESHER_SHARED_SECRETS";
export const SESSION_COOKIE = "pi_refresher_session";

function base64urlToBytes(s) {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const raw = atob(padded);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function decodeJson(b64url) {
  return JSON.parse(new TextDecoder().decode(base64urlToBytes(b64url)));
}

/**
 * Verify a compact JWT against every secret in the comma-separated list.
 * Returns the claims object on success, null on ANY failure (malformed,
 * expired, wrong issuer/audience/alg, bad signature, missing secrets).
 */
export async function verifyToken(token, secretsCsv, expectedAud) {
  try {
    if (!token || !secretsCsv) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = decodeJson(parts[0]);
    if (header.alg !== "HS256") return null;

    const claims = decodeJson(parts[1]);
    const now = Math.floor(Date.now() / 1000);
    if (claims.iss !== JWT_ISSUER) return null;
    if (typeof claims.exp !== "number" || claims.exp <= now) return null;
    if (expectedAud && claims.aud !== expectedAud) return null;

    const encoder = new TextEncoder();
    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = base64urlToBytes(parts[2]);

    const secrets = secretsCsv
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const secret of secrets) {
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"],
      );
      if (await crypto.subtle.verify("HMAC", key, signature, data)) {
        return claims;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/** Read one cookie value from a Cookie header. */
export function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

/**
 * Brand-matched "come in through the platform" page. Shown to anyone who
 * hits the site without a valid session — the site's content never loads.
 */
export function denyResponse(env, status = 401) {
  const platformUrl = env.PLATFORM_URL || "https://patient-investor-demo.vercel.app";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>The Patient Investor Mastermind</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center;
         background:#050505; color:#e8e8e4;
         font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif; }
  .stage { text-align:center; padding:32px; max-width:460px; }
  .lamp { width:8px; height:8px; border-radius:50%; background:#cfb428;
          margin:0 auto 28px; box-shadow:0 0 24px rgba(207,180,40,0.35); }
  .eyebrow { font-size:11px; letter-spacing:0.22em; text-transform:uppercase;
             color:#cfb428; margin-bottom:14px; }
  h1 { font-family: 'Playfair Display', Georgia, serif; font-weight:500;
       font-size:28px; line-height:1.25; margin:0 0 14px;
       background:linear-gradient(90deg,#bf953f 0%,#fcf6ba 40%,#b38728 70%,#fbf5b7 100%);
       -webkit-background-clip:text; background-clip:text; color:transparent; }
  p  { color:#8a8a84; font-size:14px; line-height:1.65; margin:0 0 26px; }
  a.btn { display:inline-block; background:#cfb428; color:#0b0b0b;
          text-decoration:none; padding:12px 22px; border-radius:8px;
          font-size:14px; font-weight:600; }
</style>
</head>
<body>
  <div class="stage">
    <div class="lamp"></div>
    <div class="eyebrow">The Patient Investor Mastermind</div>
    <h1>This library opens from inside the community.</h1>
    <p>Access to the Refresher Library is unlocked through your member account. Sign in to the platform and use the Videos link.</p>
    <a class="btn" href="${platformUrl}">Go to the platform &rarr;</a>
  </div>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
