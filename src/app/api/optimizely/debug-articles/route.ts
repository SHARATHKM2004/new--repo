import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RawItem = {
  title?: string | null;
  shortDescription?: string | null;
  keywords?: string | null;
  _json?: Record<string, unknown> | null;
  _metadata?: {
    key?: string;
    locale?: string;
    displayName?: string;
    types?: string[];
    url?: { default?: string; hierarchical?: string };
  };
};

function readString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseKeywords(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;\n]/)
    .map((k) => k.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const recordCount = Math.min(parseInt(url.searchParams.get("recordCount") ?? "100", 10) || 100, 100);
  const industryName = url.searchParams.get("industryName")?.trim().toLowerCase();
  const topicName = url.searchParams.get("topicName")?.trim().toLowerCase();
  const locale = url.searchParams.get("locale")?.trim() || "en";

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;

  const listQuery = `query {
    CMSPage(limit: 100, locale: ${locale}) {
      items {
        _metadata { key locale displayName url { default hierarchical } }
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
  const listItems: RawItem[] = listPayload?.data?.CMSPage?.items ?? [];

  const articleStubs = listItems.filter((it) => {
    const path = it._metadata?.url?.default ?? it._metadata?.url?.hierarchical ?? "";
    return /\/article\//i.test(path) && !/\/article\/all\b/i.test(path);
  });

  const detailed = await Promise.all(
    articleStubs.slice(0, recordCount).map(async (stub) => {
      const key = stub._metadata?.key;
      if (!key) return null;
      const detailQuery = `query {
        CMSPage(locale: ${locale}, ids: ["${key}"]) {
          item {
            title
            shortDescription
            keywords
            _json
            _metadata { key locale displayName url { default hierarchical } }
          }
        }
      }`;
      const r = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: detailQuery }),
        cache: "no-store",
      });
      const p = await r.json();
      return (p?.data?.CMSPage?.item ?? null) as RawItem | null;
    }),
  );

  const items = detailed
    .filter((it): it is RawItem => Boolean(it))
    .map((it) => {
      const j = it._json ?? {};
      const path = it._metadata?.url?.default ?? "";
      const topics = parseKeywords(it.keywords ?? (j.keywords as string | undefined));
      const industries = parseKeywords(
        (j.relatedIndustryIds as string | undefined) ??
          (j.RelatedIndustryIds as string | undefined),
      );
      const services = parseKeywords(
        (j.relatedServiceIds as string | undefined) ??
          (j.RelatedServiceIds as string | undefined),
      );
      return {
        id: it._metadata?.key,
        displayName: it._metadata?.displayName,
        title: readString(it.title) ?? readString(j.title) ?? it._metadata?.displayName,
        summary: readString(it.shortDescription) ?? readString(j.shortDescription),
        url: path,
        imageUrl: readString(j.cardImageUrl) ?? readString(j.CardImageUrl),
        imageAlt: readString(j.cardImageAlt) ?? readString(j.CardImageAlt),
        publishedAt: readString(j.publishedAt) ?? readString(j.PublishedAt),
        readTime: readString(j.readTime) ?? readString(j.ReadTime),
        authorId: readString(j.authorId) ?? readString(j.AuthorId),
        topics,
        industries,
        services,
        jsonKeys: Object.keys(j),
      };
    })
    .filter((card) => {
      if (industryName) {
        if (!card.industries.map((i) => i.toLowerCase()).includes(industryName)) return false;
      }
      if (topicName) {
        if (!card.topics.map((t) => t.toLowerCase()).includes(topicName)) return false;
      }
      return true;
    });

  return NextResponse.json({
    count: items.length,
    recordCount,
    locale,
    filter: { industryName: industryName ?? null, topicName: topicName ?? null },
    errors: listPayload?.errors,
    items,
  });
}
