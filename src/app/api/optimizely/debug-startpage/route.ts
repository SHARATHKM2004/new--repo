import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;
  const query = `query {
    StartPage(limit: 1, locale: en) {
      item {
        title
        _json
        _metadata { key locale displayName types }
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
  const item = payload?.data?.StartPage?.item;
  const json = item?._json ?? null;

  return NextResponse.json({
    title: item?.title,
    jsonKeys: json ? Object.keys(json) : null,
    headerVideoUrl: json?.headerVideoUrl ?? json?.HeaderVideoUrl ?? null,
    headerVideoPoster: json?.headerVideoPoster ?? json?.HeaderVideoPoster ?? null,
    rawJson: json,
    errors: payload?.errors ?? null,
  });
}
