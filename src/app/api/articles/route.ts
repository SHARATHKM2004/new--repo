import { NextResponse } from "next/server";
import { requireBasicAuth } from "@/lib/api-auth";
import { parseCmsKeywordMetadata } from "@/lib/cms/keyword-metadata";

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
    status?: string;
    published?: string | null;
    created?: string | null;
    lastModified?: string | null;
    url?: { default?: string; hierarchical?: string };
  };
};

const SUPPORTED_LOCALES = ["en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function parseLocale(raw: string | null | undefined): SupportedLocale {
  const v = (raw ?? "").trim().toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(v) ? (v as SupportedLocale) : "en";
}

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

function parseDate(value: unknown): number | null {
  const str = readString(value);
  if (!str) return null;
  const time = Date.parse(str);
  return Number.isFinite(time) ? time : null;
}

function normalizeFilterValue(value: string | null | undefined): string | null {
  const normalized = (value ?? "").trim().toLowerCase();
  return normalized || null;
}

function matchesFilter(values: string[], filter: string | null) {
  if (!filter) return true;
  return values.some((value) => normalizeFilterValue(value) === filter);
}

function includesText(value: string | null | undefined, query: string | null) {
  if (!query) return true;
  return normalizeFilterValue(value)?.includes(query) ?? false;
}

export async function GET(request: Request) {
  const unauthorized = requireBasicAuth(request, "Articles API");
  if (unauthorized) return unauthorized;

  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "20", 10) || 20, 100);
  const order = (url.searchParams.get("order") ?? "desc").toLowerCase() === "asc" ? "asc" : "desc";
  const localeParam = url.searchParams.get("locale");
  const locale = parseLocale(localeParam);
  const localeFellBack = !!localeParam && locale !== localeParam.trim().toLowerCase();
  const sinceMs = parseDate(url.searchParams.get("since"));
  const untilMs = parseDate(url.searchParams.get("until"));
  const industryFilter = normalizeFilterValue(url.searchParams.get("industry"));
  const topicFilter = normalizeFilterValue(url.searchParams.get("topic"));
  const serviceFilter = normalizeFilterValue(url.searchParams.get("service"));
  const authorIdFilter = normalizeFilterValue(url.searchParams.get("authorId"));
  const authorFilter = normalizeFilterValue(url.searchParams.get("author"));
  const queryFilter = normalizeFilterValue(url.searchParams.get("q"));

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;

  // Step 1 — list every CMSPage whose URL contains "/article/" (the article
  // landing convention used in this project). We only ask for metadata here
  // to keep the listing query cheap. _metadata.published gives us the
  // authoritative publish date even when the article body doesn't include one.
  const listQuery = `query {
    CMSPage(limit: 100, locale: ${locale}) {
      items {
        _metadata {
          key locale displayName status
          published created lastModified
          url { default hierarchical }
        }
      }
    }
  }`;

  const listResp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: listQuery }),
    cache: "no-store",
  });

  if (!listResp.ok) {
    return NextResponse.json(
      { error: "Optimizely Graph request failed", status: listResp.status },
      { status: 502 },
    );
  }

  const listPayload = await listResp.json();
  const listItems: RawItem[] = listPayload?.data?.CMSPage?.items ?? [];

  const articleStubs = listItems.filter((it) => {
    const path = it._metadata?.url?.default ?? it._metadata?.url?.hierarchical ?? "";
    const isArticleUrl = /\/article\//i.test(path) && !/\/article\/all\b/i.test(path);
    if (!isArticleUrl) return false;
    // Only keep Published items. Some Optimizely Graph deployments expose a
    // status field; when absent we trust that the public render key only
    // returns Published content.
    const status = (it._metadata?.status ?? "").toLowerCase();
    if (status && status !== "published") return false;
    return true;
  });

  // Step 2 — fetch the full detail for every article (parallel) so we have
  // the published date, summary, image, topics and the rest of the fields.
  const detailed = await Promise.all(
    articleStubs.map(async (stub) => {
      const key = stub._metadata?.key;
      if (!key) return null;
      const detailQuery = `query {
        CMSPage(locale: ${locale}, ids: ["${key}"]) {
          item {
            title
            shortDescription
            keywords
            _json
            _metadata {
              key locale displayName status
              published created lastModified
              url { default hierarchical }
            }
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

  // Step 3 — normalise and project the fields we want to expose.
  const projected = detailed
    .filter((it): it is RawItem => Boolean(it))
    .filter((it) => {
      const status = (it._metadata?.status ?? "").toLowerCase();
      return !status || status === "published";
    })
    .map((it) => {
      const j = it._json ?? {};
      const m = it._metadata ?? {};
      const keywordMetadata = parseCmsKeywordMetadata(it.keywords);
      const path = m.url?.default ?? "";
      // Fallback chain for the date we expose + filter on. Order matters:
      // explicit article publishedAt first, then Optimizely's metadata
      // published, then lastModified, then created — so every article ends
      // up with *some* date and filters return meaningful results.
      const publishedAtRaw =
        readString(j.publishedAt) ??
        readString(j.PublishedAt) ??
        readString(j.publishDate) ??
        readString(j.PublishDate) ??
        readString(j.startPublish) ??
        readString(m.published) ??
        readString(m.lastModified) ??
        readString(m.created);
      const publishedAtMs = parseDate(publishedAtRaw);

      return {
        id: m.key ?? null,
        locale: m.locale ?? locale,
        status: m.status ?? "Published",
        header: readString(it.title) ?? readString(j.title) ?? m.displayName ?? null,
        description:
          readString(it.shortDescription) ??
          readString(j.shortDescription) ??
          readString(j.summary) ??
          null,
        url: path || null,
        imageUrl: readString(j.cardImageUrl) ?? readString(j.CardImageUrl) ?? null,
        imageAlt: readString(j.cardImageAlt) ?? readString(j.CardImageAlt) ?? null,
        publishedAt: publishedAtRaw ?? null,
        publishedAtMs,
        readTime: readString(j.readTime) ?? readString(j.ReadTime) ?? null,
        authorId:
          readString(j.authorId) ??
          readString(j.AuthorId) ??
          keywordMetadata.authorId ??
          null,
        authorName:
          readString(j.authorName) ??
          readString(j.AuthorName) ??
          keywordMetadata.authorName ??
          null,
        topics: parseKeywords(it.keywords ?? (j.keywords as string | undefined)),
        industries: parseKeywords(
          (j.relatedIndustryIds as string | undefined) ??
            (j.RelatedIndustryIds as string | undefined),
        ),
        services: parseKeywords(
          (j.relatedServiceIds as string | undefined) ??
            (j.RelatedServiceIds as string | undefined),
        ),
      };
    });

  // Step 4 — semantic filters (industry/topic/service/author/q).
  const contentFiltered = projected.filter((article) => {
    if (!matchesFilter(article.industries, industryFilter)) return false;
    if (!matchesFilter(article.topics, topicFilter)) return false;
    if (!matchesFilter(article.services, serviceFilter)) return false;
    if (authorIdFilter && normalizeFilterValue(article.authorId) !== authorIdFilter) return false;
    if (authorFilter && !includesText(article.authorName, authorFilter)) return false;

    if (queryFilter) {
      const searchableParts = [
        article.header,
        article.description,
        article.authorName,
        article.authorId,
        ...article.topics,
        ...article.industries,
        ...article.services,
      ];

      const hasQueryMatch = searchableParts.some((value) => includesText(value, queryFilter));
      if (!hasQueryMatch) return false;
    }

    return true;
  });

  // Step 5 — date filtering (since/until are inclusive ISO dates).
  const dateFiltered = contentFiltered.filter((a) => {
    if (sinceMs !== null && (a.publishedAtMs === null || a.publishedAtMs < sinceMs)) return false;
    if (untilMs !== null && (a.publishedAtMs === null || a.publishedAtMs > untilMs)) return false;
    return true;
  });

  // Step 6 — sort by published date. Items without a publishedAt sink to the
  // end regardless of order.
  const sorted = [...dateFiltered].sort((a, b) => {
    const aMs = a.publishedAtMs;
    const bMs = b.publishedAtMs;
    if (aMs === null && bMs === null) return 0;
    if (aMs === null) return 1;
    if (bMs === null) return -1;
    return order === "asc" ? aMs - bMs : bMs - aMs;
  });

  const items = sorted.slice(0, limit).map((article) => {
    const { publishedAtMs, ...rest } = article;
    void publishedAtMs;
    return rest;
  });

  return NextResponse.json({
    count: items.length,
    total: dateFiltered.length,
    locale,
    requestedLocale: localeParam ?? null,
    localeFellBack,
    order,
    limit,
    filter: {
      industry: industryFilter,
      topic: topicFilter,
      service: serviceFilter,
      authorId: authorIdFilter,
      author: authorFilter,
      q: queryFilter,
      since: sinceMs !== null ? new Date(sinceMs).toISOString() : null,
      until: untilMs !== null ? new Date(untilMs).toISOString() : null,
    },
    supportedLocales: SUPPORTED_LOCALES,
    generatedAt: new Date().toISOString(),
    items,
  });
}
