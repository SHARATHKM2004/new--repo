import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Short-lived signed-cookie session for protected API endpoints.
 *
 * Flow:
 *   1. Request hits a protected route → `requireApiSession(request)`.
 *   2. If cookie is missing / expired / tampered:
 *        - HTML clients (browsers) → 302 redirect to /auth/login?next=<url>
 *        - API clients (curl / fetch) → 401 JSON
 *   3. User submits the login form → /api/auth/login validates password,
 *      sets a signed cookie with 60s expiry, redirects back to `next`.
 *
 * Env vars:
 *   API_BASIC_AUTH_USER       (default "admin")
 *   API_BASIC_AUTH_PASSWORD   (required; also used as the HMAC secret)
 *
 * Session TTL: 60 seconds. After that the user must log in again on every
 * subsequent request (no silent extension).
 *
 * Backwards-compatible alias `requireBasicAuth` is kept so existing imports
 * keep working; new code should call `requireApiSession`.
 */

export const SESSION_COOKIE = "api_session";
export const SESSION_TTL_SECONDS = 60;

export function getExpectedUser(): string {
  return (process.env.API_BASIC_AUTH_USER ?? "admin").trim();
}

export function getExpectedPassword(): string {
  return (process.env.API_BASIC_AUTH_PASSWORD ?? "").trim();
}

/** Guard. Returns a NextResponse if the request is blocked, else null.
 *  The optional `_realm` arg is ignored — kept for back-compat with the
 *  earlier Basic Auth helper signature. */
export function requireApiSession(
  request: Request,
  _realm?: string,
): NextResponse | null {
  const secret = getExpectedPassword();
  if (!secret) {
    return NextResponse.json(
      { error: "Server auth not configured" },
      { status: 503 },
    );
  }

  const token = readCookie(request, SESSION_COOKIE);
  if (token && verifySessionToken(token, secret)) {
    return null;
  }

  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/html")) {
    const reqUrl = new URL(request.url);
    const nextPath = reqUrl.pathname + reqUrl.search;
    const loginUrl = new URL(
      `/auth/login?next=${encodeURIComponent(nextPath)}`,
      request.url,
    );
    return NextResponse.redirect(loginUrl, { status: 302 });
  }

  return NextResponse.json({ error: "Authentication required" }, { status: 401 });
}

/** Alias kept for existing route handlers that imported the Basic Auth helper. */
export const requireBasicAuth = requireApiSession;

/** Build a session token: `<expiryMs>.<hmacHex>` */
export function createSessionToken(
  secret: string,
  ttlSeconds = SESSION_TTL_SECONDS,
): string {
  const expiry = Date.now() + ttlSeconds * 1000;
  const sig = sign(String(expiry), secret);
  return `${expiry}.${sig}`;
}

export function verifySessionToken(token: string, secret: string): boolean {
  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const expiryStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expectedSig = sign(expiryStr, secret);
  let a: Buffer;
  let b: Buffer;
  try {
    a = Buffer.from(sig, "hex");
    b = Buffer.from(expectedSig, "hex");
  } catch {
    return false;
  }
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) {
      try {
        return decodeURIComponent(trimmed.slice(eq + 1));
      } catch {
        return trimmed.slice(eq + 1);
      }
    }
  }
  return null;
}
