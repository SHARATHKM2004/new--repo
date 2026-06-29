/**
 * Diagnostic endpoint — captures every incoming request so we can inspect
 * exactly what Optimizely sends (headers, body, method).
 *
 * Register THIS URL in Optimizely webhooks instead of /api/optimizely/webhook,
 * publish something, then GET this URL with the admin key to see the capture.
 *
 * GET  /api/optimizely/capture?key=<ADMIN_KEY>   → view last 10 captures
 * POST /api/optimizely/capture                   → always 200, stores request
 * DELETE /api/optimizely/capture?key=<ADMIN_KEY> → clear captures
 */

import { NextResponse } from "next/server";

type Capture = {
  capturedAt: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

// In-memory store — survives for the lifetime of the serverless instance
const captures: Capture[] = [];

export async function POST(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let body: unknown = null;
  try {
    const text = await request.text();
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  } catch {
    body = "(could not read body)";
  }

  const capture: Capture = {
    capturedAt: new Date().toISOString(),
    method: request.method,
    headers,
    body,
  };

  captures.unshift(capture); // newest first
  if (captures.length > 10) captures.pop();

  console.log("[capture] Received:", JSON.stringify(capture, null, 2));

  // Always return 200 so Optimizely marks the delivery as successful
  return NextResponse.json({ ok: true, captured: true });
}

export async function GET(request: Request) {
  const adminKey = process.env.ADMIN_KEY ?? "";
  const key = new URL(request.url).searchParams.get("key");

  if (!adminKey || key !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    count: captures.length,
    captures,
  });
}

export async function DELETE(request: Request) {
  const adminKey = process.env.ADMIN_KEY ?? "";
  const key = new URL(request.url).searchParams.get("key");

  if (!adminKey || key !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  captures.length = 0;
  return NextResponse.json({ ok: true, cleared: true });
}
