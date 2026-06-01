import { NextResponse } from "next/server";

/**
 * HTTP Basic Auth guard for API routes.
 *
 * Usage at the top of any route handler:
 *
 *   const unauthorized = requireBasicAuth(request);
 *   if (unauthorized) return unauthorized;
 *
 * Credentials come from env vars:
 *   API_BASIC_AUTH_USER     (default "admin")
 *   API_BASIC_AUTH_PASSWORD (no default — if unset, auth fails closed)
 *
 * The browser shows a native username/password prompt because we return
 * 401 with a `WWW-Authenticate: Basic` header.
 */
export function requireBasicAuth(
  request: Request,
  realm = "Restricted API",
): NextResponse | null {
  const expectedUser = (process.env.API_BASIC_AUTH_USER ?? "admin").trim();
  const expectedPass = (process.env.API_BASIC_AUTH_PASSWORD ?? "").trim();

  // Fail closed if no password is configured — never expose data because
  // a deployment forgot to set the env var.
  if (!expectedPass) {
    return new NextResponse(
      JSON.stringify({ error: "Server auth not configured" }),
      { status: 503, headers: { "content-type": "application/json" } },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) {
    return challenge(realm);
  }

  let decoded: string;
  try {
    decoded = atob(header.slice(6).trim());
  } catch {
    return challenge(realm);
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return challenge(realm);

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);

  if (!safeEqual(user, expectedUser) || !safeEqual(pass, expectedPass)) {
    return challenge(realm);
  }

  return null;
}

function challenge(realm: string): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: "Authentication required" }),
    {
      status: 401,
      headers: {
        "content-type": "application/json",
        "www-authenticate": `Basic realm="${realm.replace(/"/g, "")}", charset="UTF-8"`,
      },
    },
  );
}

/** Constant-time string comparison to resist timing attacks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
