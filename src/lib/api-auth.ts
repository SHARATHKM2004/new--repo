import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const API_ACCESS_QUERY_PARAM = "key";

export function getApiAccessKey(): string {
  return (
    process.env.API_ACCESS_KEY?.trim() ||
    process.env.API_BASIC_AUTH_PASSWORD?.trim() ||
    ""
  );
}

export function getExpectedPassword(): string {
  return getApiAccessKey();
}

export function requireApiSession(
  request: Request,
  _realm?: string,
): NextResponse | null {
  void _realm;
  const secret = getApiAccessKey();
  if (!secret) {
    return NextResponse.json(
      { error: "Server auth not configured", queryParam: API_ACCESS_QUERY_PARAM },
      { status: 503 },
    );
  }

  const provided = new URL(request.url).searchParams.get(API_ACCESS_QUERY_PARAM)?.trim() ?? "";
  if (provided && safeEqual(provided, secret)) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Authentication required",
      queryParam: API_ACCESS_QUERY_PARAM,
      hint: `Append ?${API_ACCESS_QUERY_PARAM}=<your-secret> to the request URL.`,
    },
    { status: 401 },
  );
}

export const requireBasicAuth = requireApiSession;

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length || a.length === 0) {
    return false;
  }
  return timingSafeEqual(a, b);
}
