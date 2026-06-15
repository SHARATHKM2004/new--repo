// Wipfli-compatible insights endpoint.
//
// Mirrors the contract that wipfli.com/api/portal/insights exposes to
// downstream consumers like D365:
//
//   GET /api/portal/insights
//     ?sc_apikey=<API_ACCESS_KEY>
//     &recordCount=<1..100>           (default 10)
//     &industryName=<D365 vocabulary> (required)
//     &locale=<en|es>                 (default en, optional)
//
// Response is a BARE JSON array (no envelope), e.g.:
//   [
//     {
//       "ID": "9fb72c23-aced-490e-9c08-88a61cb6b0a7",
//       "PageUrl": "www.example.com/en/article/some-slug",
//       "Title": "...",
//       "Details": "<p>...</p>"
//     },
//     ...
//   ]
//
// Industry filtering uses the agreed D365 → CMS mapping in
// `src/lib/cms/industry-map.ts`. Articles must be tagged in Optimizely
// CMS for them to appear — there are NO hard-coded sample articles in
// this route; an unmapped or empty CMS yields `[]`.

import { NextResponse } from "next/server";
import { requireBasicAuth } from "@/lib/api-auth";
import { parseCmsKeywordMetadata } from "@/lib/cms/keyword-metadata";
import {
  ACCEPTED_INDUSTRY_NAMES,
  articleMatchesIndustry,
  resolveIndustryMatch,
} from "@/lib/cms/industry-map";

export const dynamic = "force-dynamic";

type RawItem = {
  title?: string | null;
  shortDescription?: string | null;
  keywords?: string | null;
  _metadata?: {
    key?: string;
    locale?: string;
    displayName?: string;
    status?: string;
    published?: string | null;
    url?: { default?: string; hierarchical?: string };
  };
};

const SUPPORTED_LOCALES = ["en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function parseLocale(raw: string | null | undefined): SupportedLocale {
  const v = (raw ?? "").trim().toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(v) ? (v as SupportedLocale) : "en";
}

function resolveHost(request: Request): string {
  const headerHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (headerHost) return headerHost.replace(/^https?:\/\//, "");
  try {
    return new URL(request.url).host;
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  const unauthorized = requireBasicAuth(request, "Portal Insights");
  if (unauthorized) return unauthorized;

  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();
  if (!renderUrl || !renderKey) {
    return NextResponse.json({ error: "Optimizely not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const industryNameRaw = url.searchParams.get("industryName");
  const recordCount = Math.min(
    Math.max(parseInt(url.searchParams.get("recordCount") ?? "10", 10) || 10, 1),
    100,
  );
  const locale = parseLocale(url.searchParams.get("locale"));

  if (!industryNameRaw || !industryNameRaw.trim()) {
    return NextResponse.json(
      {
        error: "Missing required query parameter `industryName`.",
        acceptedValues: ACCEPTED_INDUSTRY_NAMES,
      },
      { status: 400 },
    );
  }

  const match = resolveIndustryMatch(industryNameRaw);
  if (!match) {
    return NextResponse.json(
      {
        error: `Unknown industryName "${industryNameRaw}".`,
        acceptedValues: ACCEPTED_INDUSTRY_NAMES,
      },
      { status: 400 },
    );
  }

  const isWildcard = match === "*";

  // Wildcard → no in-memory filter. Specific list → expand the fetch window
  // so the post-filter still has enough rows to satisfy recordCount.
  const graphLimit = isWildcard ? recordCount : Math.min(Math.max(recordCount * 6, 50), 100);

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;
  const articlePrefix = `/${locale}/article/`;

  const query = `query {
    CMSPage(
      locale: ${locale}
      limit: ${graphLimit}
      orderBy: { _metadata: { published: DESC } }
      where: { _metadata: { url: { default: { startsWith: "${articlePrefix}" } } } }
    ) {
      items {
        title
        shortDescription
        keywords
        _metadata {
          key locale displayName status
          published
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
  let payload: { data?: { CMSPage?: { items?: RawItem[] } }; errors?: unknown } = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        error: "Optimizely Graph returned non-JSON",
        status: resp.status,
        body: rawBody.slice(0, 2000),
      },
      { status: 502 },
    );
  }

  if (!resp.ok || payload?.errors) {
    return NextResponse.json(
      {
        error: "Optimizely Graph request failed",
        status: resp.status,
        graphErrors: payload?.errors ?? null,
      },
      { status: 502 },
    );
  }

  const items = payload?.data?.CMSPage?.items ?? [];
  const host = resolveHost(request);

  // 1. Drop landing pages and non-published items.
  // 2. Apply the D365 → CMS industry filter (wildcard skips it).
  // 3. Project into wipfli's response shape.
  const filtered: Array<{ ID: string; PageUrl: string; Title: string; Details: string }> = [];

  for (const it of items) {
    const meta = it._metadata ?? {};
    const path = meta.url?.default ?? meta.url?.hierarchical ?? "";
    const normalised = path.replace(/\/+$/, "");
    if (!path) continue;
    if (normalised === `/${locale}/article` || normalised === `/${locale}/article/all`) {
      continue;
    }
    const status = (meta.status ?? "").toLowerCase();
    if (status && status !== "published") continue;

    if (!isWildcard) {
      const parsed = parseCmsKeywordMetadata(it.keywords);
      if (!articleMatchesIndustry(parsed.relatedIndustryIds, match)) {
        continue;
      }
    }

    const id = meta.key ?? "";
    const title = (it.title ?? meta.displayName ?? "").trim();
    const details = (it.shortDescription ?? "").trim();
    const pageUrl = host ? `${host}${path.startsWith("/") ? path : `/${path}`}` : path;

    if (!id || !title) continue;

    filtered.push({ ID: id, PageUrl: pageUrl, Title: title, Details: details });

    if (filtered.length >= recordCount) break;
  }

  return NextResponse.json(filtered);
}
