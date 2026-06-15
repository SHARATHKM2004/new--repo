# Portal Insights — Core Response Logic

How a successful `GET /api/portal/insights?...&industryName=...` request becomes a JSON response. Strictly the happy path. The actual code that produces the response, annotated.

---

## The pipeline at a glance

```
industryName  ──►  map to CMS tags  ──►  GraphQL to Optimizely  ──►  filter rows  ──►  project shape  ──►  JSON array
```

Five stages, one file each owns one stage.

| Stage | File | What it does |
| --- | --- | --- |
| 1. Vocabulary lookup | `src/lib/cms/industry-map.ts` | Turns `"Manufacturing and Distribution"` into the list of CMS tags it should match. |
| 2. GraphQL fetch | `src/app/api/portal/insights/route.ts` | Builds and sends the query to Optimizely Graph. |
| 3. Industry filter | `src/lib/cms/keyword-metadata.ts` + `industry-map.ts` | Parses `Keywords` and keeps only matching rows. |
| 4. Shape projection | `src/app/api/portal/insights/route.ts` | Converts each CMS row to `{ ID, PageUrl, Title, Details }`. |
| 5. Serialize | `NextResponse.json(filtered)` | Sends back a bare array. |

---

## Stage 1 — map D365 vocabulary to CMS tags

**File:** [src/lib/cms/industry-map.ts](../src/lib/cms/industry-map.ts)

D365 sends names like `Manufacturing and Distribution`. CMS stores tags like `Manufacturing`, `Distribution`, `Agribusiness`, `Dealerships`. This table is the translation.

```ts
export const INDUSTRY_MAP: Readonly<Record<string, IndustryMatch>> = {
  "Financial Services": ["Financial Services", "Insurance", "Financial Institutions", "Fintech", "Private Equity"],
  "Manufacturing and Distribution": ["Manufacturing", "Distribution", "Agribusiness", "Dealerships"],
  "Healthcare": ["Healthcare"],
  "Technology and Innovation": ["Technology Companies", "Fintech"],
  "General Office": "*",       // wildcard — return latest, ignore tags
  // ...
};

export function resolveIndustryMatch(industryName) {
  const needle = industryName.trim().toLowerCase();
  for (const key of ACCEPTED_INDUSTRY_NAMES) {
    if (key.toLowerCase() === needle) return INDUSTRY_MAP[key];
  }
  return null;
}
```

After this stage we have a `match` value that's either:
- `["Manufacturing", "Distribution", "Agribusiness", "Dealerships"]` (filter target), or
- `"*"` (wildcard — skip filtering entirely).

---

## Stage 2 — fetch articles from Optimizely Graph

**File:** [src/app/api/portal/insights/route.ts](../src/app/api/portal/insights/route.ts)

The route builds a GraphQL query that pushes everything Optimizely *can* do server-side: locale, URL prefix, ordering, limit. The expensive industry-tag filtering happens after the response comes back (CMS tags live inside a free-form `keywords` string, not as a first-class index field).

### Why a bigger fetch window for filtered calls

Wildcard calls fetch exactly `recordCount`. Filtered calls fetch up to **6×** more, because most rows will be dropped during the in-memory pass.

```ts
const isWildcard = match === "*";
const graphLimit = isWildcard
  ? recordCount
  : Math.min(Math.max(recordCount * 6, 50), 100);
```

### The query

```ts
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
```

What each piece does:

| Clause | Effect |
| --- | --- |
| `locale: en` | Scopes to the English content tree. |
| `limit: graphLimit` | Returns the N most recent candidates. |
| `orderBy published DESC` | Newest first, so trimming to `recordCount` later still gives the freshest. |
| `where url.startsWith "/en/article/"` | Excludes home page, services, industries, locations — only article pages. |
| `keywords` | The CSV string we'll parse to find `industry:<tag>` entries. |
| `_metadata.key` | The article ID we expose as `ID`. |
| `_metadata.url.default` | The path we expose as `PageUrl`. |

### The HTTP call

```ts
const resp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query }),
  cache: "no-store",      // every request hits Graph fresh
});

const payload = JSON.parse(await resp.text());
const items = payload?.data?.CMSPage?.items ?? [];
```

After this stage, `items` is an array of CMS rows (e.g. 50–100 of them for a filtered call).

---

## Stage 3 — filter to articles matching the requested industry

Two helpers do the work.

### 3a. Parse the `keywords` CSV

**File:** [src/lib/cms/keyword-metadata.ts](../src/lib/cms/keyword-metadata.ts)

CMS authors put structured data inside the free-form `Keywords` field, like:

```
author:Jane Doe, date:2026-05-15, time:6 min read, topic:Banking, industry:Financial Services
```

The parser walks each comma-separated entry and routes `key:value` pairs to the right bucket. Industries end up in `relatedIndustryIds`.

```ts
for (const entry of entries) {
  const i = entry.indexOf(":");
  if (i === -1) { topics.push(entry); continue; }
  const key   = entry.slice(0, i).trim().toLowerCase();
  const value = entry.slice(i + 1).trim();
  switch (key) {
    case "industry": industries.push(value); break;
    case "topic":    topics.push(value);     break;
    // ... author, date, time, service, etc.
  }
}
return { /* ... */ relatedIndustryIds: industries /* ... */ };
```

### 3b. Decide if the article matches the requested D365 industry

**File:** [src/lib/cms/industry-map.ts](../src/lib/cms/industry-map.ts)

```ts
export function articleMatchesIndustry(articleIndustryTags, match) {
  if (match === "*") return true;                                  // wildcard
  const tags   = articleIndustryTags.map(t => t.trim().toLowerCase());
  const wanted = match.map(t => t.trim().toLowerCase());
  return tags.some(t => wanted.includes(t));                       // any overlap
}
```

So `industryName=Manufacturing and Distribution` matches any article whose `industry:` entries include `Manufacturing` *or* `Distribution` *or* `Agribusiness` *or* `Dealerships`.

### 3c. Where the filter actually runs in the route

```ts
for (const it of items) {
  // skip landing pages
  if (normalised === `/${locale}/article` || normalised === `/${locale}/article/all`) continue;

  // skip unpublished
  if (status && status !== "published") continue;

  // the industry gate (skipped for wildcards)
  if (!isWildcard) {
    const parsed = parseCmsKeywordMetadata(it.keywords);
    if (!articleMatchesIndustry(parsed.relatedIndustryIds, match)) continue;
  }

  // ...projection happens next
}
```

After this stage we have a list of CMS rows that *are* relevant to the requested industry.

---

## Stage 4 — project each row into the wipfli response shape

The wipfli contract is `{ ID, PageUrl, Title, Details }`, PascalCase, in a bare array. The route maps each surviving CMS row onto that shape:

```ts
const id      = meta.key ?? "";
const title   = (it.title ?? meta.displayName ?? "").trim();
const details = (it.shortDescription ?? "").trim();
const pageUrl = host ? `${host}${path.startsWith("/") ? path : `/${path}`}` : path;

filtered.push({ ID: id, PageUrl: pageUrl, Title: title, Details: details });

if (filtered.length >= recordCount) break;   // stop once we've collected enough
```

| Response field | Comes from |
| --- | --- |
| `ID` | `_metadata.key` (Optimizely content GUID) |
| `PageUrl` | request host + `_metadata.url.default` |
| `Title` | `title` (fallback to `displayName`) |
| `Details` | `shortDescription` |

The `break` on line 6 is the reason fetching `recordCount * 6` from Graph is safe — we stop as soon as we have enough matches.

---

## Stage 5 — serialize

```ts
return NextResponse.json(filtered);
```

Next.js returns `Content-Type: application/json` and the body is the bare array — no envelope, no metadata field, no pagination object. That's the wipfli contract.

---

## End-to-end trace — `industryName=Manufacturing and Distribution&recordCount=3`

| # | What happens | Result |
| --- | --- | --- |
| 1 | `resolveIndustryMatch("Manufacturing and Distribution")` | `["Manufacturing", "Distribution", "Agribusiness", "Dealerships"]` |
| 2 | `graphLimit = max(3 * 6, 50) = 50`. Query asks Optimizely for 50 most recent article pages. | 50 CMS rows. |
| 3 | Loop drops landing pages + unpublished rows, then for each remaining row parses `keywords` and checks if any `industry:` entry is in the wanted list. | Suppose 5 rows match. |
| 4 | First 3 are projected to `{ID, PageUrl, Title, Details}`; loop breaks. | 3 row array. |
| 5 | `NextResponse.json([...])` | Bare JSON array sent to the client. |

```json
[
  {
    "ID": "fe9e389e-2b4b-4135-9e41-f4c08d5f468b",
    "PageUrl": "project-coral-eight.vercel.app/en/article/why-middle-market-manufacturers-are-redesigning-plant-analytics-now/",
    "Title": "Why middle-market manufacturers are redesigning plant analytics now",
    "Details": "Plant leaders are moving analytics closer to daily decisions instead of leaving them in monthly reports."
  },
  { "ID": "...", "PageUrl": "...", "Title": "...", "Details": "..." },
  { "ID": "...", "PageUrl": "...", "Title": "...", "Details": "..." }
]
```

---

## The wildcard path (`General Office`, `Private Client`, `Wipfli Internal`)

Identical pipeline, two differences:

- `graphLimit = recordCount` (no expansion — we keep everything).
- The `articleMatchesIndustry` check is skipped entirely.

So the response is simply the latest `recordCount` published articles, projected to the wipfli shape. That's the "Returns latest records irrespective of the industry" remark from the spreadsheet, implemented as a single `if (!isWildcard)` branch.
