import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const displayName = url.searchParams.get("slug") ?? "Login";

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;

  const listQuery = `query {
    CMSPage(limit: 5, locale: en, where: { _metadata: { displayName: { eq: "${displayName}" } } }) {
      items {
        _metadata { key locale displayName }
      }
    }
  }`;

  const listResp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: listQuery }),
    cache: "no-store",
  });
  const listPayload = await listResp.json();
  const items = listPayload?.data?.CMSPage?.items ?? [];

  if (!items.length) {
    return NextResponse.json({ displayName, count: 0, errors: listPayload?.errors });
  }

  const detailed = await Promise.all(
    items.map(async (it: { _metadata?: { key?: string; displayName?: string } }) => {
      const key = it._metadata?.key;
      if (!key) return { metadata: it._metadata, item: null };
      const itemQuery = `query {
        CMSPage(locale: en, ids: ["${key}"]) {
          item {
            title
            _json
            _metadata { key locale displayName types url { default hierarchical } }
          }
        }
      }`;
      const r = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: itemQuery }),
        cache: "no-store",
      });
      const payload = await r.json();
      const item = payload?.data?.CMSPage?.item;
      return {
        metadata: item?._metadata ?? it._metadata,
        title: item?.title,
        jsonKeys: item?._json ? Object.keys(item._json) : null,
        blocks: item?._json?.blocks ?? item?._json?.Blocks ?? null,
        rawJson: item?._json,
        errors: payload?.errors ?? null,
      };
    }),
  );

  return NextResponse.json({ displayName, count: items.length, items: detailed });
}
