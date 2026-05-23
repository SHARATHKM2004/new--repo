import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "login";

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;
  const query = `query {
    CMSPage(limit: 5, locale: en, where: { _metadata: { displayName: { eq: "${slug}" } } }) {
      items {
        title
        _json
        _metadata { key locale displayName types url { default hierarchical } }
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
  const items = payload?.data?.CMSPage?.items ?? [];

  return NextResponse.json({
    slug,
    count: items.length,
    items: items.map((item: { title?: string; _json?: Record<string, unknown>; _metadata?: unknown }) => ({
      title: item.title,
      metadata: item._metadata,
      jsonKeys: item._json ? Object.keys(item._json) : null,
      blocks: item._json?.blocks ?? item._json?.Blocks ?? null,
      rawJson: item._json,
    })),
    errors: payload?.errors ?? null,
  });
}
