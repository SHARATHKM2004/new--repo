# Portal Insights API — Implementation Documentation

End-to-end documentation of the `/api/portal/insights` endpoint that mirrors `wipfli.com/api/portal/insights` for consumption by D365.

---

## 1. Goal

Expose a public API on this Next.js + Optimizely CMS project that matches the production `wipfli.com/api/portal/insights` contract **byte-for-byte**, so D365 (or any other downstream consumer) can call it with the same query parameters and receive the same response shape.

Key constraints:

- **No mock data.** Articles must come from Optimizely CMS only. An empty CMS → empty response array.
- **Authoring stays in CMS.** Tagging an article to an industry is done by editing the `Keywords` field in Optimizely — no code change required to add/move articles between industries.
- **D365 sends a controlled vocabulary.** Filter values like `Financial Services`, `Manufacturing and Distribution`, `Nonprofits`, etc. are the agreed `industryName` strings; the API maps them to the actual CMS industry tag names.

---

## 2. Reference contract (wipfli.com)

```
GET https://www.wipfli.com/api/portal/insights
    ?sc_apikey=<API_KEY>
    &recordCount=7
    &industryName=Manufacturing and Distribution
```

Response — bare JSON array (no envelope), PascalCase fields:

```json
[
  {
    "ID": "9fb72c23-aced-490e-9c08-88a61cb6b0a7",
    "PageUrl": "www.wipfli.com/insights/articles/...",
    "Title": "How to build a sales strategy for today's manufacturing environment",
    "Details": "<p>Learn how manufacturers can modernize sales strategies, ...</p>"
  },
  ...
]
```

Our endpoint produces an identical shape.

---

## 3. Architecture overview

```
┌───────────────────────────┐
│ D365 / external consumer  │
│ GET /api/portal/insights  │
│ ?sc_apikey=…              │
│ &recordCount=…            │
│ &industryName=…           │
└──────────────┬────────────┘
               │ HTTPS
               ▼
┌────────────────────────────────────────────────────────┐
│ Next.js App Router (Vercel)                            │
│ src/app/api/portal/insights/route.ts                   │
│                                                        │
│  1. requireBasicAuth(request)   ←  src/lib/api-auth.ts │
│  2. resolveIndustryMatch(industryName)                 │
│       ←  src/lib/cms/industry-map.ts                   │
│  3. Build GraphQL query for CMSPage                    │
│  4. POST to Optimizely Graph                           │
│  5. Filter in-memory by industry tag                   │
│  6. Project to wipfli response shape                   │
└──────────────┬─────────────────────────────────────────┘
               │ POST GraphQL
               ▼
┌────────────────────────────────────────────────────────┐
│ Optimizely Graph                                       │
│ POST <OPTIMIZELY_RENDER_URL>/content/v2?auth=<KEY>     │
│ → returns CMSPage items (title, shortDescription,      │
│   keywords, _metadata{url, published, status})         │
└────────────────────────────────────────────────────────┘
```

---

## 4. Files involved

| File | Role |
| --- | --- |
| `src/app/api/portal/insights/route.ts` | The HTTP handler. Parses params, calls Optimizely Graph, filters, projects to wipfli shape. |
| `src/lib/cms/industry-map.ts` | The D365 → CMS industry mapping table (single source of truth). |
| `src/lib/api-auth.ts` | Shared `requireBasicAuth` helper. Validates `?sc_apikey=` against `API_ACCESS_KEY` env. |
| `src/lib/cms/keyword-metadata.ts` | Parses the CMS `Keywords` field (`author:…, date:…, industry:…, topic:…`) into structured metadata. |
| `.env.local` | Provides `OPTIMIZELY_RENDER_URL`, `OPTIMIZELY_RENDER_KEY`, `API_ACCESS_KEY`. |

---

## 5. Auth — `sc_apikey`

Every protected endpoint uses [src/lib/api-auth.ts](../src/lib/api-auth.ts).

- Reads `?sc_apikey=` from the URL.
- Compares it against `API_ACCESS_KEY` (env) using `crypto.timingSafeEqual` (constant-time, prevents timing attacks).
- Missing key → `401 { error: "Authentication required", queryParam: "sc_apikey", hint: "..." }`.
- Env not set → `503 { error: "Server auth not configured" }`.

```
API_ACCESS_KEY={1f9-c8b7e-4a2d6c3f9e1b7a5d2-c8e4f6a9}
```

---

## 6. D365 → CMS industry map

[src/lib/cms/industry-map.ts](../src/lib/cms/industry-map.ts) holds the agreed mapping from the spreadsheet provided by the US team.

| D365 `industryName` | CMS tags matched | Behavior |
| --- | --- | --- |
| Construction and Real Estate | Construction and Real Estate, Construction, Real Estate | filter |
| Financial Services | Financial Services, Insurance, Financial Institutions, Fintech, Private Equity | filter |
| General Office | — | **wildcard** (latest, no industry filter) |
| Healthcare | Healthcare | filter |
| Manufacturing and Distribution | Manufacturing, Distribution, Agribusiness, Dealerships | filter |
| Nonprofits | Nonprofits | filter |
| Governments | Governments | filter |
| Education | Education | filter |
| Private Client | — | **wildcard** |
| Technology and Innovation | Technology Companies, Fintech | filter |
| Tribal | Tribal | filter |
| Wipfli Internal | — | **wildcard** |

Wildcards (`"*"`) mean "return the latest N articles regardless of industry tag" — matching the *Returns latest records irrespective of the industry* remark from the spreadsheet.

Two helper functions are exported:

- `resolveIndustryMatch(industryName)` — case-insensitive lookup. Returns the array of CMS tag names, `"*"` for wildcard, or `null` for unknown.
- `articleMatchesIndustry(articleTags, match)` — true if any of the article's industry tags is in the matched list (or always true for wildcard).

---

## 7. The route — `src/app/api/portal/insights/route.ts`

### 7.1 Inputs

| Param | Required | Default | Notes |
| --- | --- | --- | --- |
| `sc_apikey` | yes | — | matched against `API_ACCESS_KEY` |
| `industryName` | yes | — | one of the D365 vocabulary values (case-insensitive) |
| `recordCount` | no | 10 | 1–100 |
| `locale` | no | `en` | `en` or `es` |

### 7.2 Step-by-step

1. **Auth gate** — `requireBasicAuth(request)`. Returns `401`/`503` if it fails.
2. **Env check** — `OPTIMIZELY_RENDER_URL` and `OPTIMIZELY_RENDER_KEY` must be set, else `503`.
3. **Parse params**:
   - `industryName` required → `400` with `acceptedValues` list if missing.
   - `resolveIndustryMatch()` → `400` with `acceptedValues` if unknown.
   - `recordCount` clamped to 1–100.
   - `locale` parsed against the supported list (`en`, `es`).
4. **Window sizing** — for wildcard, fetch exactly `recordCount` from Graph. For specific industries, fetch `recordCount * 6` (capped at 100) so the in-memory filter still has enough rows to satisfy `recordCount` even when most articles don't match.
5. **GraphQL push-down** — sent to Optimizely Graph:
   ```graphql
   CMSPage(
     locale: en,
     limit: <graphLimit>,
     orderBy: { _metadata: { published: DESC } },
     where: { _metadata: { url: { default: { startsWith: "/en/article/" } } } }
   ) { items { title shortDescription keywords _metadata { key locale displayName status published url { default hierarchical } } } }
   ```
   - `startsWith: "/en/article/"` restricts to the article subtree.
   - `orderBy published DESC` gives newest-first.
6. **Filter in memory**:
   - Drop landing pages (`/en/article`, `/en/article/all`).
   - Drop non-published items.
   - If non-wildcard: parse `keywords` via `parseCmsKeywordMetadata()` → check `relatedIndustryIds` against the matched CMS tag list via `articleMatchesIndustry()`.
7. **Project** to wipfli shape:
   ```ts
   {
     ID: meta.key,
     PageUrl: `${host}${path}`,   // host derived from x-forwarded-host / host header
     Title: title,
     Details: shortDescription
   }
   ```
8. **Trim** to `recordCount`.
9. **Return** `NextResponse.json(filtered)` — a bare array.

### 7.3 Error envelopes

| Scenario | Status | Body |
| --- | --- | --- |
| Missing/invalid `sc_apikey` | `401` | `{ error, queryParam, hint }` |
| `API_ACCESS_KEY` not set | `503` | `{ error: "Server auth not configured", queryParam }` |
| Optimizely env not set | `503` | `{ error: "Optimizely not configured" }` |
| Missing `industryName` | `400` | `{ error, acceptedValues: [...] }` |
| Unknown `industryName` | `400` | `{ error: "Unknown industryName \"X\".", acceptedValues: [...] }` |
| Optimizely Graph non-2xx or returned `errors` | `502` | `{ error, status, graphErrors }` |
| Optimizely Graph returned non-JSON | `502` | `{ error, status, body }` |

---

## 8. CMS authoring contract

For an article to appear under a given D365 `industryName`, its **Keywords** field in Optimizely must include at least one `industry:<value>` entry from the matched-tag column above.

### Example — Financial Services article

```
author:Nick G. Ansley, date:2026-05-15, time:6 min read, topic:Financial services, industry:Financial Services
```

### Multi-industry article

A single article can carry multiple `industry:` entries — it will appear under every D365 industry whose CMS tag list includes any of them:

```
author:Mary Beth Marchione, date:2026-05-14, time:5 min read, topic:Technology, industry:Fintech
```

`industry:Fintech` is mapped to both **Financial Services** and **Technology and Innovation**, so this article appears in both.

### Wildcard industries

`General Office`, `Private Client`, `Wipfli Internal` never require any `industry:` tag — they return the latest N articles regardless.

---

## 9. Sample requests and responses

> Replace the host and key as needed. Production today is `https://project-coral-eight.vercel.app`.

### 9.1 Industry filter — match

```
GET /api/portal/insights?sc_apikey=<KEY>&recordCount=3&industryName=Manufacturing and Distribution
```

```json
[
  {
    "ID": "fe9e389e-2b4b-4135-9e41-f4c08d5f468b",
    "PageUrl": "project-coral-eight.vercel.app/en/article/why-middle-market-manufacturers-are-redesigning-plant-analytics-now/",
    "Title": "Why middle-market manufacturers are redesigning plant analytics now",
    "Details": "Plant leaders are moving analytics closer to daily decisions instead of leaving them in monthly reports."
  }
]
```

### 9.2 Wildcard — General Office

```
GET /api/portal/insights?sc_apikey=<KEY>&recordCount=5&industryName=General Office
```

Returns the 5 latest articles regardless of industry tag — same JSON shape.

### 9.3 Unknown industryName

```
GET /api/portal/insights?sc_apikey=<KEY>&industryName=Bad Value
```

```json
{
  "error": "Unknown industryName \"Bad Value\".",
  "acceptedValues": [
    "Construction and Real Estate",
    "Financial Services",
    "General Office",
    "Healthcare",
    "Manufacturing and Distribution",
    "Nonprofits",
    "Governments",
    "Education",
    "Private Client",
    "Technology and Innovation",
    "Tribal",
    "Wipfli Internal"
  ]
}
```

### 9.4 Missing API key

```
GET /api/portal/insights?recordCount=3&industryName=Healthcare
```

```json
{
  "error": "Authentication required",
  "queryParam": "sc_apikey",
  "hint": "Append ?sc_apikey=<your-secret> to the request URL."
}
```

---

## 10. Operational notes

- **Caching** — `export const dynamic = "force-dynamic"` plus `cache: "no-store"` on the upstream fetch ensure every request hits Optimizely Graph fresh. Suitable for a low-volume integration endpoint.
- **Index latency** — newly published/edited articles take ~10–30 seconds to appear in Optimizely Graph results. Verify after a short wait.
- **Adding/removing industries** — only `src/lib/cms/industry-map.ts` needs to change. The route file is generic.
- **Adding a new locale** — add it to `SUPPORTED_LOCALES` in the route file.
- **Vercel deploy** — pushing to `master` on GitHub triggers an auto-deploy; the new route becomes live after the build finishes.

---

## 11. How the goal was achieved (recap)

1. **Inspected the reference response** at `wipfli.com/api/portal/insights` to lock in the exact JSON shape (bare array, PascalCase `ID/PageUrl/Title/Details`).
2. **Captured the D365 vocabulary** from the spreadsheet shared by the US team, including the wildcard rows and the multi-CMS-tag rows (e.g. Financial Services → 5 CMS tags).
3. **Built [src/lib/cms/industry-map.ts](../src/lib/cms/industry-map.ts)** as the single source of truth for the D365 → CMS mapping, with `"*"` as a wildcard sentinel.
4. **Built [src/app/api/portal/insights/route.ts](../src/app/api/portal/insights/route.ts)** to:
   - Reuse the existing `requireBasicAuth` (`?sc_apikey=`) so the auth model stays consistent with the rest of the API.
   - Push down what Optimizely Graph can do (URL prefix, published order, locale).
   - Apply industry filtering in memory against the keyword-derived `relatedIndustryIds` (the same parser used elsewhere in the codebase).
   - Return the wipfli-format bare array with no envelope.
5. **Validated end-to-end** by hitting the deployed Vercel URL with three test cases: a real industry, a wildcard industry, and an unknown industry. All three matched the expected wipfli contract.
6. **Documented the CMS authoring step** — adding `industry:<value>` entries to the `Keywords` field — so non-developers can move articles between industries without code changes.

Result: a wipfli-compatible, CMS-driven `/api/portal/insights` endpoint with zero mock data, a clean separation between vocabulary mapping (code) and content tagging (CMS), and consistent auth + error semantics with the rest of the project.
