# Technical Documentation — Summit Advisory Group Practice Build

A blueprint-level walkthrough of what was built, why, and how someone could rebuild it from scratch. Intentionally avoids full source code — focuses on architecture, contracts, data shapes, and step ordering.

> **Recent change (May 2026):** The CMS layer and several large component files were split for maintainability. Every `.ts`/`.tsx` file under `src/` is now ≤ 300 lines; the public surface (function names, types, behavior) is unchanged. `src/lib/cms/index.ts` is now a 16-line barrel that re-exports from 19 sibling files.

---

## 1. Project Summary

A localized, CMS-driven corporate marketing site built on **Next.js 16 (App Router, Turbopack)** and **React 19**, integrated with **Optimizely SaaS CMS** via the Optimizely Graph API. The frontend is decoupled from the CMS through a typed content layer, so the same UI renders from either a mock dataset or live Optimizely content.

**Core capabilities**
- Localized routing (`en`, `es`) under a single catch-all route + dedicated location routes.
- Typed CMS abstraction with a swappable provider (mock / Optimizely).
- Draft / Preview mode using Next.js `draftMode()` + Optimizely admin credentials.
- On-demand revalidation via secret-protected endpoint + Optimizely webhook.
- Lead capture and newsletter forms persisted to Neon Postgres (with JSON fallback for leads).
- Diagnostic health endpoint + four `debug-*` endpoints for the CMS connection.
- Block-based page composition (Hero, Story, Services, Industries, RichText, Image, Video, Quote, Stats, CardGrid, CTA, ArticleList, NewsList, EventsListing, LocationsDirectory, SignIn, PayBill, PortalApplications, Form, etc.).
- Full-text search across all pages with a live header dropdown.
- Multi-variant portal sign-in flows (401k / Hub / ShareFile).
- Office locator with state-level and per-office detail routes.
- Lazy loading via `next/dynamic` for heavy interactive blocks and admin widgets.

---

## 2. Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router, RSC, Turbopack) | Server components, route handlers, draft mode, ISR/revalidateTag |
| Language | TypeScript 5 | Strong typing for CMS contracts |
| UI | React 19 | Matches Next 16 |
| Styling | Tailwind CSS v4 (PostCSS plugin) | Utility-first, no global CSS bloat |
| CMS | Optimizely SaaS CMS + Optimizely Graph | Headless content + GraphQL endpoint |
| Persistence | Neon Postgres (`@neondatabase/serverless`) + JSON fallback | Production DB for subscribers/leads; JSON for local-first leads demo |
| Lint | ESLint 9 + `eslint-config-next` | Standard Next presets |
| Hosting | Vercel | Native Next.js, env management, preview deploys |

---

## 3. High-Level Architecture

```
Browser
   │
   ▼
Next.js App Router  ── src/app/[locale]/[[...slug]]/page.tsx  (catch-all)
                       src/app/[locale]/locations/...         (location routes)
   │
   ├─► PageRenderer (dispatcher) ──┬─► DefaultView
   │                               ├─► InsightView
   │                               ├─► ContactView
   │                               ├─► NewsLandingView
   │                               └─► ResourceCenterView
   │                                     │
   │                                     ▼
   │                               BlockRenderer ─► (hero, story, services, ...)
   │
   ▼
CMS Abstraction  ── src/lib/cms/index.ts  (barrel re-exporting 19 files)
   │                     ├─ provider = "optimizely" → Graph fetch
   │                     └─ provider = "mock"       → in-memory dataset
   │
   ▼
Optimizely Graph (cg.optimizely.com)
```

**Responsibility rule (enforced by folder layout):**
- `src/app/**` — routing, params, metadata, draft mode.
- `src/lib/cms/**` — fetching + normalization. **No raw Optimizely shapes leak out of this folder.**
- `src/components/**` — pure rendering of normalized types.

This single rule is what makes provider-swapping trivial.

---

## 4. Folder Structure (what each thing is for)

```
src/
  app/
    layout.tsx                          # Root <html>, fonts, metadata
    page.tsx                            # Redirects "/" → "/en"
    not-found.tsx                       # 404
    globals.css                         # Tailwind v4 entry
    [locale]/
      layout.tsx                        # Locale validation + header/footer + draftMode
      [[...slug]]/page.tsx              # Catch-all CMS page renderer
      locations/[slug]/page.tsx         # Single office detail page
      locations/state/[state]/page.tsx  # State-level office listing
    admin/
      leads/page.tsx                    # Leads viewer (Neon)
      subscribers/page.tsx              # Subscribers viewer (Neon)
    subscription/
      layout.tsx
      page.tsx                          # Subscription center
      subscription-form.tsx             # Client form
    api/
      draft/route.ts                    # Enable preview
      draft/disable/route.ts            # Disable preview
      revalidate/route.ts               # Path/tag revalidation
      leads/route.ts                    # POST lead submissions
      subscribe/route.ts                # POST newsletter signups
      search/route.ts                   # Site search
      admin/leads.csv/route.ts          # CSV export
      admin/subscribers.csv/route.ts    # CSV export
      optimizely/health/route.ts        # Connectivity diagnostic
      optimizely/webhook/route.ts       # Publish hook from Optimizely
      optimizely/debug-startpage/route.ts
      optimizely/debug-page/route.ts
      optimizely/debug-header/route.ts
      optimizely/debug-articles/route.ts

  components/
    cms/
      page-renderer.tsx                 # Dispatcher → one of the 5 view files below
      page-renderer-default-view.tsx    # Standard layout with hero + blocks
      page-renderer-contact-view.tsx    # Contact page layout
      page-renderer-insight-view.tsx    # Article / insight layout
      page-renderer-news-landing.tsx    # News listing landing
      page-renderer-resource-center.tsx # Searchable insights with filters
      page-renderer-kicker.tsx          # Page type badge
      page-renderer-helpers.tsx         # Shared formatting/intro extraction
      block-renderer.tsx                # Switch over block.type
      block-renderer-static.tsx         # Static block views (Hero, RichText, Image, …)
      block-helpers.tsx                 # Link/href resolution helpers
      article-listing.tsx               # Article cards grid (client)
      news-listing.tsx                  # News list with filters (client)
      news-sidebar.tsx                  # Sidebar extraction helper
      events-listing.tsx                # Events list with load-more (client)
      locations-directory.tsx           # Offices grouped by state (client)
      sign-in.tsx                       # Sign-in variant dispatcher
      sign-in/
        shared.tsx                      # Shared config parsing
        variant-401k.tsx                # 401(k) portal
        variant-hub.tsx                 # General hub portal
        variant-sharefile.tsx           # ShareFile portal
      pay-bill.tsx                      # Bill payment form
      portal-applications.tsx           # Portal app links/cards
    site/
      site-header.tsx                   # Global header
      site-header-panel.tsx             # Mega-menu / dropdown panel
      site-footer.tsx                   # Global footer
      header-search.tsx                 # Live site search box (client)
      alerts-callout.tsx                # Admin alert banner (lazy)
    forms/
      lead-form.tsx                     # Lead capture (client)
      lead-form-helpers.ts              # US states list + helpers

  lib/
    db.ts                               # Neon SQL client + table init
    leads.ts                            # Lead persistence (JSON/Neon)
    cms/
      index.ts                          # 16-line public barrel
      types.ts                          # Page union, SEO, content types
      types-blocks.ts                   # Block union types

      # Optimizely access ------------------------------------------------
      optimizely-config.ts              # Env + auth helpers
      optimizely-graph.ts               # GraphQL client + connection status
      optimizely-fetchers.ts            # Page-by-slug / listings / live-pages
      optimizely-types.ts               # API response types
      optimizely-block-type.ts          # OptimizelyJsonBlock interface

      # Mapping (Optimizely → local types) -------------------------------
      block-mapper.ts                   # Dispatcher
      block-mapper-content.ts           # Hero, RichText, Image, Form, Contact, …
      block-mapper-marketing.ts         # Story, Services, Industries, Logos, …
      page-mapper-cms.ts                # CMSPage → Page
      page-mapper-start.ts              # StartPage → HomePage
      keyword-metadata.ts               # Keywords / topics / pageType inference
      text-helpers.ts                   # slugKey, stripHtmlTags, richText, images

      # Domain operations ------------------------------------------------
      page-resolver.ts                  # resolvePages, getPageBySlug, offices
      navigation.ts                     # getNavigation, getSiteHeaderContent
      footer.ts                         # getSiteFooterContent
      subscription.ts                   # getSubscriptionPageContent
      search.ts                         # searchAllPages
      insights.ts                       # Insights filtering + recommendations

      # Mock dataset (split for the 300-line cap) ------------------------
      mock-content.ts                   # Aggregates the mock dataset
      mock-content-pages-en.ts          # English page index
      mock-content-pages-en-1.ts        # English pages (part 1)
      mock-content-pages-en-2.ts        # English pages (part 2)
      mock-content-pages-es.ts          # Spanish pages
      mock-content-articles.ts          # Article/insight pages
      mock-content-events.ts            # Events + shared image pool
      mock-articles.ts                  # Article blueprints + builder
      mock-authors.ts                   # Author fixtures

      cms-utils.ts                      # Internal utility types (OptimizelyRichTextField)
data/leads.json                         # Local persistence
public/                                 # Static assets (+ robots.txt)
scripts/                                # Split helpers used during refactor
```

---

## 5. Routing Model

Two route families:

**a. CMS catch-all** — `/[locale]/[[...slug]]`
- `locale` validated against `["en", "es"]`.
- `slug` is an array (e.g. `["services", "digital-platform-strategy"]`).
- The page calls `getPageBySlug({ locale, slug, draft })` and renders the result via `PageRenderer`; if no page → `notFound()`.
- `generateMetadata` reads SEO fields off the returned `Page` (title, description, canonical, hreflang alternates, OpenGraph).
- Root `/` redirects to `/en`.

**b. Locations** — `/[locale]/locations/...`
- `/[locale]/locations/[slug]` — individual office detail.
- `/[locale]/locations/state/[state]` — state-level listing.
- Both call into `getLocationOffices` / `getOfficeSlug` from the CMS layer.

**Why two patterns:** office content is structured rather than block-based, and benefits from explicit routes for SEO + static params.

---

## 6. CMS Abstraction Contract

The frontend never sees Optimizely shapes. It sees these normalized types (from `src/lib/cms/types.ts` and `types-blocks.ts`):

- **`Page` discriminated union:** `HomePage | StandardPage | InsightPage | AuthorPage | ServicePage | IndustryPage | ResourceCenterPage | ContactPage | LocationPage` (+ `SubscriptionPageContent` separately).
- Each page has: `slug: string[]`, `locale`, `status` (`published` / `draft`), `seo`, `sections: Block[]`, plus type-specific fields.
- **`Block` discriminated union:** `hero | richText | html | image | video | stats | quote | cardGrid | cta | featuredContent | articleList | newsList | eventsListing | locationsDirectory | signIn | payBill | portalApplications | form | services | industries | testimonials | story | logos | team`.
- `SiteHeaderContent`, `SiteFooterContent`, `NavigationItem`, `LinkField`.

**Public API surfaced from `src/lib/cms/index.ts`** (a barrel re-exporting the modules below):

| Function | Source file | Purpose |
|---|---|---|
| `getPageBySlug({ locale, slug, draft })` | `page-resolver.ts` | Resolve any URL to a normalized `Page` |
| `getLocationOffices(locale, draft)` | `page-resolver.ts` | All office records for a locale |
| `getOfficeSlug(office)` | `page-resolver.ts` | Canonical office slug |
| `getSiteHeaderContent(locale, draft)` | `navigation.ts` | Header content (logo, nav, CTA) |
| `getNavigation(locale, draft)` | `navigation.ts` | Header navigation tree |
| `getSiteFooterContent(locale, draft)` | `footer.ts` | Footer columns, social, body |
| `getSubscriptionPageContent(locale, draft)` | `subscription.ts` | Subscription page content |
| `searchAllPages({ locale, query })` | `search.ts` | Full-text search across pages |
| `getInsights(filters)` | `insights.ts` | Filtered insight listing |
| `getRelatedPages(page, locale)` | `insights.ts` | Related content lookup |
| `getFeaturedContent(...)` | `insights.ts` | Featured items |
| `getAuthorForInsight(insight, locale)` | `insights.ts` | Author lookup |
| `getInsightsByAuthor(authorId, locale)` | `insights.ts` | All insights for an author |
| `getRelatedInsights(insight, locale)` | `insights.ts` | Recommendation set |
| `getOptimizelyConnectionStatus()` | `optimizely-graph.ts` | Health diagnostic |
| `isOptimizelyProviderEnabled()` | `optimizely-config.ts` | Feature flag |
| `getOptimizelyRevalidationTags()` | `optimizely-config.ts` | Tag list for webhook |

The mock provider implements the same surface so the entire app works offline.

---

## 7. Optimizely Integration

### 7.1 Endpoints used
- **Public content:** `POST {OPTIMIZELY_RENDER_URL}/content/v2?auth={OPTIMIZELY_RENDER_KEY}`
- **Draft / admin:** Optimizely Graph with `OPTIMIZELY_GRAPH_APP_KEY` + `OPTIMIZELY_GRAPH_SECRET` (Basic auth).
- **Authoring UI:** `OPTIMIZELY_AUTHORING_URL` (Optimizely CMS app URL — used for "Edit in CMS" links).

### 7.2 Query strategy
- One reusable GraphQL fragment per content type (`StartPage`, `CMSPage`, `Header`, `Footer`).
- All custom authored fields are read off the `_json` blob, so adding a new authored field does not require editing the GraphQL query.
- Tag-based caching: every fetch tags results with `optimizely:page:{slug}`, `optimizely:header`, `optimizely:footer`. The webhook revalidates these tags.

### 7.3 Provider switch
- `CMS_PROVIDER=optimizely` → live Graph; merges live results with mock for any unauthored content.
- `CMS_PROVIDER=mock` → mock-only (offline dev).
- Draft mode forces `cache: "no-store"` via admin credentials so unpublished changes appear.

### 7.4 Debug endpoints
Four endpoints under `/api/optimizely/debug-*` dump raw Graph responses for `StartPage`, `CMSPage`, `Header`, and articles queries. Useful for verifying schema mapping during content authoring.

---

## 8. Draft / Preview Mode

1. Author clicks Preview in Optimizely.
2. Optimizely opens `/api/draft?secret=<PREVIEW_SECRET>&slug=/en/...`.
3. Route handler validates the secret, calls `draftMode().enable()`, redirects to the slug.
4. The catch-all page reads `draftMode().isEnabled`, passes `draft: true` to the CMS layer.
5. CMS layer uses admin credentials + `cache: "no-store"`.
6. `/api/draft/disable` clears the draft cookie.

> **Performance note:** because `[locale]/layout.tsx` calls `draftMode()`, the catch-all route is always dynamic. This is intentional (preview must always be live) but it disables back/forward cache and forces `cache-control: no-store` on the HTML response.

---

## 9. Revalidation

Two ways to invalidate:

| Trigger | Endpoint | Behavior |
|---|---|---|
| Manual | `POST /api/revalidate` (secret + path) | `revalidatePath(path)` and/or `revalidateTag(tag, { expire: 0 })` |
| Optimizely | `POST /api/optimizely/webhook` (secret in header or query) | Revalidates the page tags + `revalidatePath("/")`, `/en`, `/es` |

Both endpoints reject without the shared secret.

---

## 10. Lead Capture & Subscriptions

- Form components: `src/components/forms/lead-form.tsx` and `src/app/subscription/subscription-form.tsx` (both client components posting JSON).
- APIs: `POST /api/leads` and `POST /api/subscribe` validate required fields and persist to Neon Postgres via `src/lib/db.ts`. The leads endpoint also appends to `data/leads.json` through `src/lib/leads.ts` for offline visibility.
- Admin: `/admin/leads` and `/admin/subscribers` render tables; matching `/api/admin/*.csv` routes export them.

---

## 11. Search

`/api/search?q=...&locale=en|es` calls `searchAllPages` (in `src/lib/cms/search.ts`), which scans `title`, `summary`, and section content across every page in the chosen locale and returns up to 10 results. The header dropdown (`src/components/site/header-search.tsx`) debounces input and surfaces matches live.

---

## 12. Environment Variables

| Variable | Purpose |
|---|---|
| `CMS_PROVIDER` | `optimizely` or `mock` |
| `SITE_URL` | Canonical origin (used in metadata) |
| `PREVIEW_SECRET` | Guards `/api/draft` |
| `REVALIDATE_SECRET` | Guards `/api/revalidate` and `/api/optimizely/webhook` |
| `OPTIMIZELY_AUTHORING_URL` | CMS authoring UI link |
| `OPTIMIZELY_RENDER_URL` | Graph endpoint (e.g. `https://cg.optimizely.com`) |
| `OPTIMIZELY_RENDER_KEY` | Public single-key for published reads |
| `OPTIMIZELY_GRAPH_APP_KEY` | Admin app key (Basic auth user) |
| `OPTIMIZELY_GRAPH_SECRET` | Admin secret (Basic auth password) |
| `OPTIMIZELY_CONTENT_CLIENT_ID` | Reserved for future Content Management API use |
| `OPTIMIZELY_CONTENT_SECRET` | Reserved for future Content Management API use |
| `DATABASE_URL` | Neon Postgres connection string |
| `ADMIN_KEY` | Required query key for `/admin/*` pages |

---

## 13. Optimizely Content Model (Schema to Replicate)

### Page-level types
| Type Key | Notes |
|---|---|
| `StartPage` | Home page, one per locale |
| `CMSPage` | All inner pages; differentiated by a `pageType` string field |
| `Header` | Global header, one per locale |
| `Footer` | Global footer, one per locale |

### `CMSPage.pageType` values
`service` · `industry` · `insight` · `author` · `contact` · `resource-center` · `standard` · `news-landing`

### Key authored fields on `CMSPage`
`title`, `shortDescription`, `keywords`, `pageType`, `eyebrow`, `outcomes[]`, `audience[]`, `featuredTopics[]`, `authorId`, `publishedAt`, `readTime`, `topics[]`, `relatedServiceIds[]`, `relatedIndustryIds[]`, `cardImageUrl`, `cardImageAlt`, `role`, `expertise[]`, `avatarSrc`, `offices[]`, `blocks` (Content Area).

### Reusable block types
`HeroBlock`, `ServicesBlock`, `IndustriesBlock`, `LogosBlock`, `TestimonialsBlock`, `StoryBlock`, `RichTextBlock` (`paragraph_text`), `ImageBlock`, `VideoBlock`, `TeamBlock`, `ContactBlock`, `PortfolioGridBlock`, `ParagraphTextElement`, `NewsListBlock`, `EventsListingBlock`, `LocationsDirectoryBlock`, `SignInBlock`, `PayBillBlock`, `PortalApplicationsBlock`.

Full field-by-field schema lives in [documentation.md](documentation.md) §6.

---

## 14. Performance & SEO

- **Lazy loading**: heavy interactive blocks (`PortalApplications`, `LocationsDirectory`, `PayBill`, `SignIn` variants, `AlertsCallout`) use `next/dynamic` with server-rendering enabled where safe.
- **LCP**: home page video has `preload="auto"` + `fetchpriority="high"`; hero poster image uses `next/image` with `priority`.
- **Images**: `next.config.ts` whitelists `images.unsplash.com` for the optimizer.
- **SEO**: `public/robots.txt` ships at the site root; `metadataBase` is set in `app/layout.tsx`.
- **Tailwind v4**: utility-first, no separate config file (PostCSS plugin only).

---

## 15. Rebuild From Scratch — Step Order

A second engineer should follow this order. Each step is independently testable.

1. **Scaffold.** `npx create-next-app@latest` with TypeScript + App Router + Tailwind. Upgrade to Next 16 / React 19 if needed.
2. **Folder skeleton.** Create `src/app`, `src/components/{cms,site,forms}`, `src/lib/cms`, `data/`.
3. **Type contracts first.** Author `src/lib/cms/types.ts` and `types-blocks.ts` — `Locale`, `Page` union, `Block` union, `SiteHeaderContent`, `SiteFooterContent`. Nothing else compiles until these are stable.
4. **Mock provider.** Build the `mock-*` files with one of each page type and one of each block. Build domain operation files (`page-resolver.ts`, `navigation.ts`, `footer.ts`, `subscription.ts`, `search.ts`, `insights.ts`) reading from mocks. Re-export them from `index.ts`.
5. **Renderers.** Implement `PageRenderer` dispatcher + the 5 view files; build `BlockRenderer` + `block-renderer-static.tsx` one block component at a time; render the mock home page.
6. **Routing.** Add `src/app/page.tsx` (redirect to default locale) and `src/app/[locale]/layout.tsx` (validate locale, render header + footer). Add the catch-all `src/app/[locale]/[[...slug]]/page.tsx`. Wire `generateMetadata`.
7. **Header & footer components.** Driven by `getSiteHeaderContent` / `getSiteFooterContent`. Add `site-header-panel.tsx` for the mega menu.
8. **Lead form + API.** Build `lead-form.tsx` client component → `POST /api/leads` → `src/lib/db.ts` + JSON fallback in `src/lib/leads.ts`. Add `/admin/leads` and CSV export.
9. **Draft mode.** Add `/api/draft` and `/api/draft/disable`. Thread `draftMode()` into the catch-all and CMS layer.
10. **Revalidation.** Add `/api/revalidate` (path/tag-based) and `/api/optimizely/webhook` (tag-based). Protect both with `REVALIDATE_SECRET`.
11. **Optimizely provider.** Add the Graph fetcher (`optimizely-graph.ts`), config (`optimizely-config.ts`), fetchers (`optimizely-fetchers.ts`), and types (`optimizely-types.ts`, `optimizely-block-type.ts`). Wire the block/page mappers (`block-mapper-*.ts`, `page-mapper-*.ts`, `keyword-metadata.ts`). Gate behind `CMS_PROVIDER === "optimizely"`. Fall back to mocks for missing items.
12. **Admin credentials path.** When `draft === true`, switch the fetcher to Basic auth and `cache: "no-store"`.
13. **Health + debug endpoints.** `/api/optimizely/health` returns the connection-status object. `/api/optimizely/debug-*` dump raw responses.
14. **Subscriptions + search.** Implement `/api/subscribe`, the subscription form/page, and `/api/search` backed by `searchAllPages`. Wire the header search dropdown.
15. **Location routes.** Add the two `locations/*` routes and the `LocationsDirectory` block.
16. **Portal/sign-in flows.** Add the sign-in variants, pay-bill, and portal-applications components and matching block mappers.
17. **Optimizely content.** In Optimizely CMS, create content types from §13, then publish: Header, Footer, StartPage, all Services, Industries, Insights, Authors, Contact, Resource Center, Locations. Slugs must match the URL paths exactly.
18. **Wire webhook.** Configure Optimizely to call `/api/optimizely/webhook` on publish with the shared secret.
19. **Deploy.** Push to GitHub → import in Vercel → add env vars for Production/Preview/Development → first deploy → verify `/api/optimizely/health` returns all `true`.
20. **Validate.** Walk through every locale route, trigger a publish from Optimizely, confirm the live page updates. Test preview link, test lead submission, test subscription, test CSV export.

---

## 16. Related Documents

- [README.md](README.md) — quickstart
- [FILE_INVENTORY.md](FILE_INVENTORY.md) — file-by-file reference
- [CONTENT_SOURCE_INVENTORY.md](CONTENT_SOURCE_INVENTORY.md) — where every user-visible string lives
- [documentation.md](documentation.md) — full step-by-step setup, full CMS schema, and Vercel deployment guide
- [SetupGuide.md](SetupGuide.md) — environment setup details
- [Guide.md](Guide.md) — additional notes
- [SCRATCH_TO_FINISH_BUILD_GUIDE.md](SCRATCH_TO_FINISH_BUILD_GUIDE.md) — rebuild walkthrough
