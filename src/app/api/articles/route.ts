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
  const skip = Math.max(parseInt(url.searchParams.get("skip") ?? "0", 10) || 0, 0);
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

  // ─── Build the Graph `where` clause from filters we can push down ────────
  //
  // Pushed to Optimizely Graph (the index does the work — fast at 10k+ pages):
  //   - URL convention: page URL must contain "/article/"
  //   - locale → query argument
  //   - topic  → keywords contains <topic>
  //   - q      → keywords contains <q>  (best-effort; in-memory pass refines)
  //   - since  → _metadata.published >= <since ISO>
  //   - until  → _metadata.published <= <until ISO>
  //   - order  → orderBy _metadata.published ASC|DESC
  //
  // Still applied in-memory on the (much smaller) result set:
  //   - industry / service / authorId / author
  //   - q extended match across header + description + author
  //   (these fields live inside _json and aren't first-class Graph index fields)
  //
  // ─── Build the Graph `where` clause from filters we can push down ────────
  //
  // Pushed to Optimizely Graph (the index does the work — fast at 10k+ pages):
  //   - URL convention: page URL must MATCH "/article/" (substring)
  //   - locale → query argument
  //   - since  → _metadata.published >= <since ISO>
  //   - until  → _metadata.published <= <until ISO>
  //   - order  → orderBy _metadata.published ASC|DESC
  //
  // Applied in-memory on the (much smaller) result set:
  //   - topic / industry / service / authorId / author / q
  //   (`keywords` and the `_json` fields are not first-class Graph index
  //    filters in this schema, so we cannot push them down.)
  //
  // GraphQL forbids duplicate keys at the same level, so all `_metadata`
  // sub-filters are merged into a single object.
  const metadataParts: string[] = [
    `url: { default: { match: "/article/" } }`,
  ];

  if (sinceMs !== null || untilMs !== null) {
    const bounds: string[] = [];
    if (sinceMs !== null) bounds.push(`gte: "${new Date(sinceMs).toISOString()}"`);
    if (untilMs !== null) bounds.push(`lte: "${new Date(untilMs).toISOString()}"`);
    metadataParts.push(`published: { ${bounds.join(", ")} }`);
  }

  const whereClauses: string[] = [`_metadata: { ${metadataParts.join(", ")} }`];

  // When secondary in-memory filters are active we fetch a larger window so
  // the post-filter still has enough rows to satisfy `limit`.
  const hasInMemoryFilter =
    !!topicFilter ||
    !!industryFilter ||
    !!serviceFilter ||
    !!authorIdFilter ||
    !!authorFilter ||
    !!queryFilter;
  const graphLimit = hasInMemoryFilter
    ? Math.min(Math.max(limit * 4, 50), 100)
    : Math.min(Math.max(limit, 1), 100);

  const orderByGraph = order === "asc" ? "ASC" : "DESC";
  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;

  // ─── Single Graph query — full article rows, no metadata scan ────────────
  const query = `query {
    CMSPage(
      locale: ${locale}
      limit: ${graphLimit}
      skip: ${skip}
      orderBy: { _metadata: { published: ${orderByGraph} } }
      where: { ${whereClauses.join(", ")} }
    ) {
      total
      items {
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

  const resp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  const rawBody = await resp.text();
  let payload: { data?: { CMSPage?: { items?: RawItem[]; total?: number } }; errors?: unknown } = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Optimizely Graph returned non-JSON", status: resp.status, body: rawBody.slice(0, 2000) },
      { status: 502 },
    );
  }

  if (!resp.ok || payload?.errors) {
    return NextResponse.json(
      {
        error: "Optimizely Graph request failed",
        status: resp.status,
        graphErrors: payload?.errors ?? null,
        sentQuery: query,
      },
      { status: 502 },
    );
  }

  const graphItems: RawItem[] = payload?.data?.CMSPage?.items ?? [];
  const graphTotal: number = payload?.data?.CMSPage?.total ?? graphItems.length;

  // Project Optimizely's raw shape into the stable public shape.
  const projected = graphItems
    .filter((it) => {
      // Belt-and-braces: drop the /article/all index page and any non-Published items
      // (Graph already filtered to /article/ but the index page sneaks through).
      const path = it._metadata?.url?.default ?? it._metadata?.url?.hierarchical ?? "";
      if (/\/article\/all\b/i.test(path)) return false;
      const status = (it._metadata?.status ?? "").toLowerCase();
      return !status || status === "published";
    })
    .map((it) => {
      const j = it._json ?? {};
      const m = it._metadata ?? {};
      const keywordMetadata = parseCmsKeywordMetadata(it.keywords);
      const path = m.url?.default ?? "";

      // Date fallback chain — guarantees every article has a usable date even
      // when the template field is missing.
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

  // In-memory pass for filters that aren't first-class Graph index fields.
  const filtered = projected.filter((article) => {
    if (!matchesFilter(article.topics, topicFilter)) return false;
    if (!matchesFilter(article.industries, industryFilter)) return false;
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

    // Belt-and-braces date filter — Graph already applied since/until but
    // re-apply against the projected fallback date in case the article's
    // _json.publishedAt differs from _metadata.published.
    if (sinceMs !== null && (article.publishedAtMs === null || article.publishedAtMs < sinceMs)) {
      return false;
    }
    if (untilMs !== null && (article.publishedAtMs === null || article.publishedAtMs > untilMs)) {
      return false;
    }

    return true;
  });

  const items = filtered.slice(0, limit).map((article) => {
    const { publishedAtMs, ...rest } = article;
    void publishedAtMs;
    return rest;
  });

  return NextResponse.json({
    count: items.length,
    total: graphTotal,
    locale,
    requestedLocale: localeParam ?? null,
    localeFellBack,
    order,
    limit,
    skip,
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
    pushedToGraph: {
      urlConvention: "/article/",
      locale: true,
      since: sinceMs !== null,
      until: untilMs !== null,
      order: true,
    },
    appliedInMemory: {
      topic: !!topicFilter,
      industry: !!industryFilter,
      service: !!serviceFilter,
      authorId: !!authorIdFilter,
      author: !!authorFilter,
      q: !!queryFilter,
    },
    supportedLocales: SUPPORTED_LOCALES,
    generatedAt: new Date().toISOString(),
    items,
  });
}
