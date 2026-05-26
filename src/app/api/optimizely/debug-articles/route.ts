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
    CMSPage(limit: 100, locale: en) {
      items {
        title
        shortDescription
        keywords
        _json
        _metadata { key locale displayName types url { default hierarchical } }
      }
    }
  }`;

  const resp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });
  const payload = await resp.json();
  const items: Array<{
    title?: string;
    _json?: Record<string, unknown>;
    _metadata?: { displayName?: string; url?: { default?: string } };
  }> = payload?.data?.CMSPage?.items ?? [];

  const articles = items
    .filter((it) => {
      const path = it._metadata?.url?.default ?? "";
      return path.includes("/article/") || path.startsWith("/en/article/") || path.startsWith("/article/");
    })
    .map((it) => ({
      displayName: it._metadata?.displayName,
      url: it._metadata?.url?.default,
      title: it.title ?? it._json?.title,
      cardImageUrl: it._json?.cardImageUrl ?? it._json?.CardImageUrl ?? null,
      cardImageAlt: it._json?.cardImageAlt ?? it._json?.CardImageAlt ?? null,
      jsonKeys: it._json ? Object.keys(it._json) : [],
      _json: it._json,
    }));

  return NextResponse.json({
    count: articles.length,
    errors: payload?.errors,
    articles,
  });
}
