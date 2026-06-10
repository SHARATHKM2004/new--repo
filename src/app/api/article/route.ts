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

// Escape a string for safe embedding in a GraphQL string literal.
function gqlString(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function projectArticle(it: RawItem, fallbackLocale: SupportedLocale) {
  const j = it._json ?? {};
  const m = it._metadata ?? {};
  const keywordMetadata = parseCmsKeywordMetadata(it.keywords);
  const path = m.url?.default ?? m.url?.hierarchical ?? "";

  const publishedAtRaw =
    readString(j.publishedAt) ??
    readString(j.PublishedAt) ??
    readString(j.publishDate) ??
    readString(j.PublishDate) ??
    readString(j.startPublish) ??
    readString(m.published) ??
    readString(m.lastModified) ??
    readString(m.created);

  return {
    id: m.key ?? null,
    locale: m.locale ?? fallbackLocale,
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
    readTime: readString(j.readTime) ?? readString(j.ReadTime) ?? null,
    authorId:
      readString(j.authorId) ?? readString(j.AuthorId) ?? keywordMetadata.authorId ?? null,
    authorName:
      readString(j.authorName) ?? readString(j.AuthorName) ?? keywordMetadata.authorName ?? null,
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
}

export async function GET(request: Request) {
  const unauthorized = requireBasicAuth(request, "Article API");
  if (unauthorized) return unauthorized;

  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();

  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const urlParam = url.searchParams.get("url")?.trim() ?? "";
  const keyParam = url.searchParams.get("id")?.trim() ?? "";
  const localeParam = url.searchParams.get("locale");
  const locale = parseLocale(localeParam);
  const localeFellBack = !!localeParam && locale !== localeParam.trim().toLowerCase();

  if (!urlParam && !keyParam) {
    return NextResponse.json(
      {
        error: "Missing identifier",
        hint: "Pass ?url=/en/article/foo-bar (preferred) or ?id=<content-key>.",
      },
      { status: 400 },
    );
  }

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;

  // Direct fetch — single Graph query, indexed lookup, no metadata scan.
  // When the caller provides ?url=, match on _metadata.url.default.
  // When the caller provides ?id=, match on the content key directly.
  const whereClause = keyParam
    ? ""
    : `, where: { _metadata: { url: { default: { eq: "${gqlString(urlParam)}" } } } }`;
  const idsClause = keyParam ? `, ids: ["${gqlString(keyParam)}"]` : "";

  const query = `query {
    CMSPage(locale: ${locale}${idsClause}${whereClause}) {
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

  const resp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  if (!resp.ok) {
    return NextResponse.json(
      { error: "Optimizely Graph request failed", status: resp.status },
      { status: 502 },
    );
  }

  const payload = await resp.json();
  const item = (payload?.data?.CMSPage?.item ?? null) as RawItem | null;

  if (!item) {
    return NextResponse.json(
      {
        error: "Article not found",
        locale,
        requestedLocale: localeParam ?? null,
        localeFellBack,
        lookup: keyParam ? { id: keyParam } : { url: urlParam },
      },
      { status: 404 },
    );
  }

  const projected = projectArticle(item, locale);

  return NextResponse.json({
    locale,
    requestedLocale: localeParam ?? null,
    localeFellBack,
    supportedLocales: SUPPORTED_LOCALES,
    generatedAt: new Date().toISOString(),
    lookup: keyParam ? { id: keyParam } : { url: urlParam },
    item: projected,
  });
}
