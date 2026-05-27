# File & Folder Inventory

A complete technical breakdown of every file and folder in the project — what it is, what it does, and why it exists.

> **Recent change (May 2026):** the original CMS layer (`src/lib/cms/index.ts` ≈ 2 400 lines) and several large component files were split so every `.ts`/`.tsx` file under `src/` is now ≤ 300 lines. `src/lib/cms/index.ts` is now a 16-line barrel; behavior is unchanged.

---

## Root Configuration Files

| Path | What it is | What it does | Why it exists |
|---|---|---|---|
| [package.json](package.json) | npm manifest | Declares dependencies (`next`, `react`, `react-dom`, `@neondatabase/serverless`), dev deps (Tailwind v4, TypeScript, ESLint), and scripts (`dev`, `build`, `start`, `lint`) | Single source of truth for tooling and install reproducibility |
| `package-lock.json` | Lockfile | Pins exact dependency versions | Deterministic installs across machines / CI / Vercel |
| [tsconfig.json](tsconfig.json) | TypeScript config | Sets strict mode, `@/*` path alias to `src/*`, Next.js plugin, JSX preserve | Strong typing across the CMS abstraction |
| [next.config.ts](next.config.ts) | Next.js config | Whitelists `images.unsplash.com` for `next/image`; sets Turbopack root | Per-app framework configuration |
| [next-env.d.ts](next-env.d.ts) | Auto-generated types | Adds Next.js global types | Required by Next.js; do not edit manually |
| [eslint.config.mjs](eslint.config.mjs) | Flat ESLint config | Extends `eslint-config-next` | Lint enforcement |
| [postcss.config.mjs](postcss.config.mjs) | PostCSS config | Loads `@tailwindcss/postcss` | Tailwind v4 uses PostCSS instead of `tailwind.config` |
| `.env.example` | Env template | Documents required environment variables | Anyone cloning knows which keys to supply |
| `.env.local` | Local secrets | Real values for CMS, preview/revalidate secrets, DB URL | Loaded by Next.js at runtime; gitignored |
| `.gitignore` | Git ignore rules | Excludes `node_modules`, `.next`, `.env.local`, `.vercel` | Keep secrets and build artifacts out of the repo |

## Root Documentation Files

| Path | Purpose |
|---|---|
| [README.md](README.md) | Quickstart + feature list + preview/revalidation usage |
| [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) | Blueprint-level rebuild guide (architecture, contracts, decisions) |
| [FILE_INVENTORY.md](FILE_INVENTORY.md) | This file |
| [CONTENT_SOURCE_INVENTORY.md](CONTENT_SOURCE_INVENTORY.md) | Where every user-visible string lives |
| [documentation.md](documentation.md) | Step-by-step setup, full Optimizely content schema, Vercel deploy walkthrough |
| [SetupGuide.md](SetupGuide.md) | Environment setup details |
| [Guide.md](Guide.md) | Additional usage notes |
| [SCRATCH_TO_FINISH_BUILD_GUIDE.md](SCRATCH_TO_FINISH_BUILD_GUIDE.md) | From-scratch rebuild walkthrough |
| `INTEGRATION_TO_TRIAL_IMPORT (1).md` | Notes on importing content into Optimizely trial |
| [AGENTS.md](AGENTS.md) | Rules for AI coding agents working in this repo |
| [CLAUDE.md](CLAUDE.md) | Imports `AGENTS.md`; entry point for Claude tooling |

## Auto-managed / Build Folders

| Path | Purpose |
|---|---|
| `node_modules/` | Installed npm packages — never edited, never committed |
| `.next/` | Next.js build output (server bundles, static chunks, cache) |
| `.vercel/` | Vercel CLI link state |
| `.git/` | Git repository internals |

---

## `public/` — Static Assets

| File | Purpose |
|---|---|
| `robots.txt` | SEO crawler directives + sitemap pointer |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Default icons from the Next.js starter |

## `data/` — Local Persistence

| File | Purpose |
|---|---|
| [data/leads.json](data/leads.json) | Append-only JSON store for lead submissions; mirrors what is written to Neon |

## `scripts/` — One-off Helpers

| File | Purpose |
|---|---|
| `split-cms-index.ps1` | PowerShell helper that split the original 2 400-line `index.ts` into 19 sibling files |
| `split-page-renderer.ps1` | PowerShell helper that split `page-renderer.tsx` into per-view files |

---

## `src/app/` — Routing & API

Next.js App Router lives here. Every folder is a URL segment; every `route.ts` is an API endpoint; every `page.tsx` is a rendered page.

### Top-level app files

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/app/layout.tsx](src/app/layout.tsx) | Root layout (Server Component) | Renders `<html><body>`, loads DM Sans + Fraunces fonts, sets `metadataBase` + root metadata | Every Next.js app needs one root layout |
| [src/app/page.tsx](src/app/page.tsx) | Root page | Redirects `/` to `/en` | Sites with localized routing need a root redirect |
| [src/app/not-found.tsx](src/app/not-found.tsx) | Global 404 page | Rendered when `notFound()` is called or no route matches | Friendly 404 UX |
| [src/app/globals.css](src/app/globals.css) | Tailwind entry + global styles | Imports Tailwind directives and base CSS | Required for Tailwind v4 to inject utilities |

### `src/app/[locale]/` — Localized routing

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/app/[locale]/layout.tsx](src/app/%5Blocale%5D/layout.tsx) | Locale layout | Validates locale, fetches `SiteHeaderContent` and `SiteFooterContent`, wraps children with `<SiteHeader>` + `<SiteFooter>`, calls `draftMode()` | Header/footer are CMS-driven and shared across every page in a locale |
| [src/app/[locale]/[[...slug]]/page.tsx](src/app/%5Blocale%5D/%5B%5B...slug%5D%5D/page.tsx) | Catch-all CMS page | Resolves `{locale, slug}` → `getPageBySlug()`, renders the returned `Page` via `<PageRenderer>`, builds `generateMetadata` from `page.seo` | One route renders every CMS page |
| [src/app/[locale]/locations/[slug]/page.tsx](src/app/%5Blocale%5D/locations/%5Bslug%5D/page.tsx) | Office detail page | Resolves office by slug, renders address/contact info + nearby offices | Each office gets a dedicated SEO-friendly URL |
| [src/app/[locale]/locations/state/[state]/page.tsx](src/app/%5Blocale%5D/locations/state/%5Bstate%5D/page.tsx) | State office listing | Groups offices by state | State-level browse experience |

### `src/app/admin/` — Internal dashboards

| Path | Purpose |
|---|---|
| [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) | Lists leads from Neon (or `data/leads.json` fallback) in a table; gated by `?key=ADMIN_KEY` |
| [src/app/admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx) | Lists newsletter subscribers from Neon |

### `src/app/subscription/` — Newsletter signup

| Path | Purpose |
|---|---|
| [src/app/subscription/layout.tsx](src/app/subscription/layout.tsx) | Wrapper for the subscription flow (calls `draftMode()`) |
| [src/app/subscription/page.tsx](src/app/subscription/page.tsx) | Subscription landing page; pulls content via `getSubscriptionPageContent` |
| [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) | Client component posting to `/api/subscribe` |

### `src/app/api/` — Route handlers

| Path | Method | What it does | Why |
|---|---|---|---|
| [src/app/api/draft/route.ts](src/app/api/draft/route.ts) | GET | Validates `PREVIEW_SECRET`, enables draft mode, redirects to slug | Entry point for Optimizely "Preview" button |
| [src/app/api/draft/disable/route.ts](src/app/api/draft/disable/route.ts) | GET | Disables draft mode | Exit preview |
| [src/app/api/revalidate/route.ts](src/app/api/revalidate/route.ts) | POST | Secret-guarded `revalidatePath()` + `revalidateTag()` | Manual on-demand revalidation |
| [src/app/api/leads/route.ts](src/app/api/leads/route.ts) | POST | Validates payload, persists lead to Neon + `data/leads.json` | Backend for lead form |
| [src/app/api/subscribe/route.ts](src/app/api/subscribe/route.ts) | POST | Stores newsletter signup in Neon | Backend for subscription form |
| [src/app/api/search/route.ts](src/app/api/search/route.ts) | GET | Calls `searchAllPages` and returns up to 10 matches | Powers `HeaderSearch` |
| [src/app/api/optimizely/webhook/route.ts](src/app/api/optimizely/webhook/route.ts) | POST | Secret-guarded `revalidateTag()` for page/header/footer tags + `revalidatePath("/")`, `/en`, `/es` | Receives publish events from Optimizely |
| [src/app/api/optimizely/health/route.ts](src/app/api/optimizely/health/route.ts) | GET | Returns `{providerEnabled, publicConfigured, adminConfigured, publicReachable, adminReachable}` | Connectivity diagnostic |
| [src/app/api/optimizely/debug-startpage/route.ts](src/app/api/optimizely/debug-startpage/route.ts) | GET | Dumps the raw Optimizely `StartPage` Graph response | Debug |
| [src/app/api/optimizely/debug-page/route.ts](src/app/api/optimizely/debug-page/route.ts) | GET | Dumps a `CMSPage` Graph response by slug | Debug |
| [src/app/api/optimizely/debug-header/route.ts](src/app/api/optimizely/debug-header/route.ts) | GET | Dumps the `Header` Graph response | Debug |
| [src/app/api/optimizely/debug-articles/route.ts](src/app/api/optimizely/debug-articles/route.ts) | GET | Dumps the articles query response | Debug |
| [src/app/api/admin/leads.csv/route.ts](src/app/api/admin/leads.csv/route.ts) | GET | Streams leads as CSV | Export from admin dashboard |
| [src/app/api/admin/subscribers.csv/route.ts](src/app/api/admin/subscribers.csv/route.ts) | GET | Streams subscribers as CSV | Export from admin dashboard |

---

## `src/components/` — UI

Pure presentational components. They consume normalized types from `src/lib/cms` and know nothing about Optimizely.

### `src/components/cms/` — CMS-driven components

| Path | What it is | What it does |
|---|---|---|
| [src/components/cms/page-renderer.tsx](src/components/cms/page-renderer.tsx) | Page dispatcher | Gathers shared data (related pages, recommendations, offices) and routes the page to one of the 5 view components |
| [src/components/cms/page-renderer-default-view.tsx](src/components/cms/page-renderer-default-view.tsx) | Default page layout | Renders hero video/image, kicker, blocks, related content, trending insights for home |
| [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) | Article layout | Article header (author/date), body, key takeaways, top picks, related insights |
| [src/components/cms/page-renderer-contact-view.tsx](src/components/cms/page-renderer-contact-view.tsx) | Contact layout | Dark hero, intro text, lead form |
| [src/components/cms/page-renderer-news-landing.tsx](src/components/cms/page-renderer-news-landing.tsx) | News landing | News listing with sidebar |
| [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) | Resource Center | Search toolbar + Suspense-wrapped filterable results |
| [src/components/cms/page-renderer-kicker.tsx](src/components/cms/page-renderer-kicker.tsx) | Page-type badge | Eyebrow/badge indicating the active page type |
| [src/components/cms/page-renderer-helpers.tsx](src/components/cms/page-renderer-helpers.tsx) | Shared helpers | Date formatting, intro extraction, article body composition |
| [src/components/cms/block-renderer.tsx](src/components/cms/block-renderer.tsx) | Block dispatcher | `switch(block.type)` → renders static views or dynamic blocks; lazy-loads heavy interactive blocks |
| [src/components/cms/block-renderer-static.tsx](src/components/cms/block-renderer-static.tsx) | Static block views | `HeroBlockView`, `RichTextBlockView`, `HtmlBlockView`, `ImageBlockView`, `VideoBlockView`, `QuoteBlockView`, `StatsBlockView`, `CtaBlockView`, `CardGridBlockView`, `resolveCardHref` |
| [src/components/cms/block-helpers.tsx](src/components/cms/block-helpers.tsx) | Link helpers | href resolution with locale prefixing and external-URL detection |
| [src/components/cms/article-listing.tsx](src/components/cms/article-listing.tsx) | Article grid (client) | Cards with title, summary, author, topics; filter + pagination |
| [src/components/cms/news-listing.tsx](src/components/cms/news-listing.tsx) | News list (client) | Filterable news items |
| [src/components/cms/news-sidebar.tsx](src/components/cms/news-sidebar.tsx) | News sidebar | Sidebar extraction helper for news pages |
| [src/components/cms/events-listing.tsx](src/components/cms/events-listing.tsx) | Events grid (client) | Event cards with load-more, formatted dates |
| [src/components/cms/locations-directory.tsx](src/components/cms/locations-directory.tsx) | Office directory (client) | Offices grouped by state with search/filter |
| [src/components/cms/sign-in.tsx](src/components/cms/sign-in.tsx) | Sign-in dispatcher | Picks one of three variants based on config |
| [src/components/cms/sign-in/shared.tsx](src/components/cms/sign-in/shared.tsx) | Shared parsing | Variant config parsing/normalization |
| [src/components/cms/sign-in/variant-401k.tsx](src/components/cms/sign-in/variant-401k.tsx) | 401(k) login | 401(k) portal login UI |
| [src/components/cms/sign-in/variant-hub.tsx](src/components/cms/sign-in/variant-hub.tsx) | Hub login | Generic hub login UI |
| [src/components/cms/sign-in/variant-sharefile.tsx](src/components/cms/sign-in/variant-sharefile.tsx) | ShareFile login | ShareFile portal login UI |
| [src/components/cms/pay-bill.tsx](src/components/cms/pay-bill.tsx) | Pay bill form | Billing-portal credentials form |
| [src/components/cms/portal-applications.tsx](src/components/cms/portal-applications.tsx) | Portal links | Card list of portal applications |

### `src/components/site/` — Site shell

| Path | What it is | What it does |
|---|---|---|
| [src/components/site/site-header.tsx](src/components/site/site-header.tsx) | Global header | Logo, primary nav, locale switcher, CTA, mobile toggle, `HeaderSearch` |
| [src/components/site/site-header-panel.tsx](src/components/site/site-header-panel.tsx) | Header mega-panel | Mobile/dropdown panel rendering secondary nav + quick links |
| [src/components/site/site-footer.tsx](src/components/site/site-footer.tsx) | Global footer | Columns, body, social, brand label; lazy-loads `AlertsCallout` |
| [src/components/site/header-search.tsx](src/components/site/header-search.tsx) | Live search box | Debounced query → `/api/search` → dropdown results |
| [src/components/site/alerts-callout.tsx](src/components/site/alerts-callout.tsx) | Alert banner | Optional CMS-driven alert banner with CTA |

### `src/components/forms/` — Forms

| Path | What it is | What it does |
|---|---|---|
| [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) | Lead form (client) | Validates input, posts JSON to `/api/leads`, shows success/error state |
| [src/components/forms/lead-form-helpers.ts](src/components/forms/lead-form-helpers.ts) | Form helpers | US states list + reusable form utilities |

---

## `src/lib/` — Domain logic

### `src/lib/cms/` — CMS abstraction

The boundary between routes/components and the CMS. After the May 2026 split, the public surface (`index.ts`) is a barrel re-exporting from the modules below.

#### Types

| Path | Exports |
|---|---|
| [src/lib/cms/types.ts](src/lib/cms/types.ts) | `Locale`, `PublishStatus`, `SeoFields`, page interfaces (`HomePage`, `StandardPage`, `InsightPage`, `AuthorPage`, `ServicePage`, `IndustryPage`, `ResourceCenterPage`, `ContactPage`, `LocationPage`), `Page` union, `SiteHeaderContent`, `SiteFooterContent`, `NavigationItem`, `SubscriptionPageContent` |
| [src/lib/cms/types-blocks.ts](src/lib/cms/types-blocks.ts) | All block interfaces + `Block` discriminated union |
| [src/lib/cms/cms-utils.ts](src/lib/cms/cms-utils.ts) | Internal utility types — `OptimizelyRichTextField`, `getRichTextValue` |

#### Optimizely access

| Path | Exports |
|---|---|
| [src/lib/cms/optimizely-config.ts](src/lib/cms/optimizely-config.ts) | `isOptimizelyProviderEnabled`, `getOptimizelyBasicAuthHeader`, `getOptimizelyTag`, `getOptimizelyRevalidationTags` |
| [src/lib/cms/optimizely-graph.ts](src/lib/cms/optimizely-graph.ts) | `fetchOptimizelyGraph<T>(query, options)`, `getOptimizelyConnectionStatus()` |
| [src/lib/cms/optimizely-fetchers.ts](src/lib/cms/optimizely-fetchers.ts) | `getOptimizelyPageBySlug`, `getOptimizelyStartPage`, `getOptimizelyCmsPages`, `getLivePages` |
| [src/lib/cms/optimizely-types.ts](src/lib/cms/optimizely-types.ts) | `OptimizelyGraphResponse<T>`, `OptimizelyJsonBlock`, `OptimizelyCmsPageItem`, `OptimizelyStartPageItem`, `OptimizelyHeaderItem`, `OptimizelyFooterItem` |
| [src/lib/cms/optimizely-block-type.ts](src/lib/cms/optimizely-block-type.ts) | `OptimizelyJsonBlock` interface variants |

#### Mapping (Optimizely → local types)

| Path | Exports |
|---|---|
| [src/lib/cms/block-mapper.ts](src/lib/cms/block-mapper.ts) | `mapOptimizelyBlock(block, fallbackTitle)` (dispatcher), `mapOptimizelyBlocks(blocks, fallbackTitle)` |
| [src/lib/cms/block-mapper-content.ts](src/lib/cms/block-mapper-content.ts) | `mapContentBlock` — `HeroBlock`, `ContactBlock`, `RichTextBlock`, `HtmlBlock`, `ImageBlock`, `VideoBlock`, `FormBlock`, etc. |
| [src/lib/cms/block-mapper-marketing.ts](src/lib/cms/block-mapper-marketing.ts) | `mapMarketingBlock` — `StoryBlock`, `ServicesBlock`, `IndustriesBlock`, `LogosBlock`, `TestimonialsBlock`, `TeamBlock`, `StatsBlock`, etc. |
| [src/lib/cms/page-mapper-cms.ts](src/lib/cms/page-mapper-cms.ts) | `mapOptimizelyCmsPage(item)` → `Page` |
| [src/lib/cms/page-mapper-start.ts](src/lib/cms/page-mapper-start.ts) | `mapOptimizelyStartPage(item)` → `HomePage` |
| [src/lib/cms/keyword-metadata.ts](src/lib/cms/keyword-metadata.ts) | `normalizeKeywords`, `normalizeStringArray`, `parseCmsKeywordMetadata`, `inferCmsPageType`, `normalizeOptimizelySlug` |
| [src/lib/cms/text-helpers.ts](src/lib/cms/text-helpers.ts) | `slugKey`, `preferCmsPagesBySlug`, `toSlugSegment`, `getPlaceholderCardHref`, `normalizeLinkItems`, `toArray`, `decodeHtmlEntities`, `stripHtmlTags`, `getRichTextValue`, `getImageSource`, `getImageAlt`, `getVideoSource`, `inferVideoMode` |

#### Domain operations

| Path | Exports |
|---|---|
| [src/lib/cms/page-resolver.ts](src/lib/cms/page-resolver.ts) | `resolvePages`, `getPagesForLocale`, `getPageBySlug`, `getLocationOffices`, `getOfficeSlug`, `officeSlug` |
| [src/lib/cms/navigation.ts](src/lib/cms/navigation.ts) | `getOptimizelyHeader`, `getOptimizelyFooter`, `getNavigation`, `getSiteHeaderContent` |
| [src/lib/cms/footer.ts](src/lib/cms/footer.ts) | `getSiteFooterContent` |
| [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) | `getSubscriptionPageContent`, `OptimizelySubscriptionPageItem` |
| [src/lib/cms/search.ts](src/lib/cms/search.ts) | `searchAllPages({ locale, query })` |
| [src/lib/cms/insights.ts](src/lib/cms/insights.ts) | `getInsights`, `getRelatedPages`, `getFeaturedContent`, `getAuthorForInsight`, `getInsightsByAuthor`, `getRelatedInsights` |
| [src/lib/cms/index.ts](src/lib/cms/index.ts) | Public barrel: re-exports the functions used by the app shell |

#### Mock dataset (split for the 300-line cap)

| Path | Purpose |
|---|---|
| [src/lib/cms/mock-content.ts](src/lib/cms/mock-content.ts) | Aggregates and exports the full mock dataset (English + Spanish + articles + events) |
| [src/lib/cms/mock-content-pages-en.ts](src/lib/cms/mock-content-pages-en.ts) | Builds the English page index |
| [src/lib/cms/mock-content-pages-en-1.ts](src/lib/cms/mock-content-pages-en-1.ts) | English pages — part 1 |
| [src/lib/cms/mock-content-pages-en-2.ts](src/lib/cms/mock-content-pages-en-2.ts) | English pages — part 2 |
| [src/lib/cms/mock-content-pages-es.ts](src/lib/cms/mock-content-pages-es.ts) | Spanish pages |
| [src/lib/cms/mock-content-articles.ts](src/lib/cms/mock-content-articles.ts) | Article/insight pages |
| [src/lib/cms/mock-content-events.ts](src/lib/cms/mock-content-events.ts) | Event pages + shared `articleFallbackImagePool` |
| [src/lib/cms/mock-articles.ts](src/lib/cms/mock-articles.ts) | `articleBlueprints`, `createArticleInsightPage`, `articleTranslationKeys` |
| [src/lib/cms/mock-authors.ts](src/lib/cms/mock-authors.ts) | Author fixtures |

### Other lib files

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/lib/leads.ts](src/lib/leads.ts) | Lead storage interface | Reads/writes `data/leads.json`; mirrors writes to Neon | Isolates persistence so routes don't care about storage type |
| [src/lib/db.ts](src/lib/db.ts) | DB connection | Configures Neon serverless client, initializes tables | Single connection used by leads + subscribers + admin queries |

---

## How the pieces fit (one-line recap)

`URL` → `[locale]/[[...slug]]/page.tsx` → `lib/cms` (provider chooses Optimizely Graph or mock via the barrel `index.ts`) → returns a normalized `Page` → `components/cms/page-renderer.tsx` dispatches to one of the 5 view components → those iterate `page.sections` and delegate to `components/cms/block-renderer.tsx` → header/footer come from `lib/cms` via `[locale]/layout.tsx`.

Forms post to `app/api/*/route.ts` → `lib/leads.ts` / `lib/db.ts` → `data/leads.json` and/or Neon. Optimizely publish webhook hits `app/api/optimizely/webhook/route.ts` → `revalidateTag()` → cache flushed → next request re-fetches Graph.
