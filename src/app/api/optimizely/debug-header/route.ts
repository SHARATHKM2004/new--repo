import { NextResponse } from "next/server";
import { requireBasicAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = requireBasicAuth(request, "Optimizely Debug — Header");
  if (unauthorized) return unauthorized;

  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;
  const query = `query {
    Header(limit: 1, locale: en) {
      item {
        _json
      }
    }
  }`;

  const response = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "graph request failed", status: response.status, body: await response.text() },
      { status: 502 },
    );
  }

  const payload = await response.json();
  return NextResponse.json(payload?.data?.Header?.item?._json ?? payload, { status: 200 });
}
