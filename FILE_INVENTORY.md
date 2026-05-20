# File & Folder Inventory

A complete technical breakdown of every file and folder in the project — what it is, what it does, and why it exists.

---

## Root Configuration Files

| Path | What it is | What it does | Why it exists |
|---|---|---|---|
| [package.json](package.json) | npm manifest | Declares dependencies (`next`, `react`, `react-dom`, `@neondatabase/serverless`), dev deps (Tailwind v4, TypeScript, ESLint), and scripts (`dev`, `build`, `start`, `lint`) | Single source of truth for tooling and install reproducibility |
| `package-lock.json` | Lockfile | Pins exact dependency versions resolved by npm | Deterministic installs across machines / CI / Vercel |
| [tsconfig.json](tsconfig.json) | TypeScript config | Sets strict mode, `@/*` path alias to `src/*`, Next.js plugin, JSX preserve, module resolution | Enables strong typing across the CMS abstraction and the `@/` import style |
| [next.config.ts](next.config.ts) | Next.js config | Custom config object for the framework (images, redirects, experimental flags) | Per-app framework configuration |
| [next-env.d.ts](next-env.d.ts) | Auto-generated types | Adds Next.js global TypeScript types | Required by Next.js; do not edit manually |
| [eslint.config.mjs](eslint.config.mjs) | Flat ESLint config | Extends `eslint-config-next` rules | Lint enforcement for the codebase |
| [postcss.config.mjs](postcss.config.mjs) | PostCSS config | Loads `@tailwindcss/postcss` plugin | Tailwind v4 uses PostCSS pipeline instead of a separate tailwind config |
| `.env.example` | Env template | Documents required environment variables without secrets | Anyone cloning knows which keys to supply |
| `.env.local` | Local secrets | Real values for `CMS_PROVIDER`, Optimizely keys, preview/revalidate secrets | Loaded by Next.js at runtime; gitignored |
| `.gitignore` | Git ignore rules | Excludes `node_modules`, `.next`, `.env.local`, `.vercel`, etc. | Keep secrets and build artifacts out of the repo |

## Root Documentation Files

| Path | Purpose |
|---|---|
| [README.md](README.md) | Quickstart + feature list + preview/revalidation usage |
| [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) | Blueprint-level rebuild guide (architecture, contracts, design decisions) |
| [documentation.md](documentation.md) | Step-by-step setup, full Optimizely content schema, Vercel deploy walkthrough |
| [SetupGuide.md](SetupGuide.md) | Environment setup details |
| [Guide.md](Guide.md) | Additional usage notes |
| [SCRATCH_TO_FINISH_BUILD_GUIDE.md](SCRATCH_TO_FINISH_BUILD_GUIDE.md) | Full from-scratch rebuild walkthrough |
| `INTEGRATION_TO_TRIAL_IMPORT (1).md` | Notes on importing content into the Optimizely trial environment |
| [AGENTS.md](AGENTS.md) | Rules for AI coding agents working in this repo (Next.js 16 caveats) |
| [CLAUDE.md](CLAUDE.md) | Imports `AGENTS.md`; entry point for Claude-based tooling |

## Auto-managed / Build Folders

| Path | Purpose |
|---|---|
| `node_modules/` | Installed npm packages — never edited, never committed |
| `.next/` | Next.js build output (server bundles, static chunks, cache) |
| `.vercel/` | Vercel CLI link state (project id, org id) |
| `.git/` | Git repository internals |

---

## `public/` — Static Assets

Files served as-is from the site root (`/file.svg`, `/next.svg`, etc.).

| File | Purpose |
|---|---|
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Default icons from the Next.js starter; available for use in components |

## `data/` — Local Persistence

| File | Purpose |
|---|---|
| [data/leads.json](data/leads.json) | Append-only JSON store for lead form submissions. Acts as the demo database; can be swapped for Neon/Postgres by changing `src/lib/leads.ts` |

---

## `src/app/` — Routing & API

Next.js App Router lives here. Every folder is a URL segment; every `route.ts` is an API endpoint; every `page.tsx` is a rendered page.

### Top-level app files

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/app/layout.tsx](src/app/layout.tsx) | Root layout (Server Component) | Renders `<html><body>`, loads global CSS, sets root metadata | Every Next.js app needs one root layout |
| [src/app/page.tsx](src/app/page.tsx) | Root page | Redirects `/` to the default locale (`/en`) | Sites with localized routing need a root redirect |
| [src/app/not-found.tsx](src/app/not-found.tsx) | Global 404 page | Rendered when `notFound()` is called or no route matches | Friendly 404 UX |
| [src/app/globals.css](src/app/globals.css) | Tailwind entry + global styles | Imports Tailwind directives and any base CSS | Required for Tailwind v4 to inject utilities |
| `src/app/favicon.ico` | Site favicon | Served at `/favicon.ico` | Browser tab icon |

### `src/app/[locale]/` — Localized routing

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) | Locale layout | Validates locale, fetches `SiteHeaderContent` and `SiteFooterContent` from CMS, wraps children with `<SiteHeader>` + `<SiteFooter>` | Header/footer are CMS-driven and shared across every page in a locale |
| [src/app/[locale]/[[...slug]]/page.tsx](src/app/%5Blocale%5D/%5B%5B...slug%5D%5D/page.tsx) | Catch-all CMS page | Resolves `{locale, slug}` → `getPageBySlug()`, renders the returned `Page` via `<PageRenderer>`, builds `generateMetadata` from `page.seo` | One route renders every CMS page; adding pages in Optimizely needs zero code changes |

### `src/app/admin/` — Internal dashboards

| Path | Purpose |
|---|---|
| [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) | Lists rows from `data/leads.json` in a table |
| [src/app/admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx) | Lists newsletter subscribers |

### `src/app/subscription/` — Newsletter signup

| Path | Purpose |
|---|---|
| [src/app/subscription/layout.tsx](src/app/subscription/layout.tsx) | Wrapper for the subscription flow |
| [src/app/subscription/page.tsx](src/app/subscription/page.tsx) | Subscription landing page |
| [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) | Client component posting to `/api/subscribe` |

### `src/app/api/` — Route handlers

| Path | Method | What it does | Why |
|---|---|---|---|
| [src/app/api/draft/route.ts](src/app/api/draft/route.ts) | GET | Validates `PREVIEW_SECRET`, calls `draftMode().enable()`, redirects to slug | Entry point for Optimizely "Preview" button |
| [src/app/api/draft/disable/route.ts](src/app/api/draft/disable/route.ts) | GET | Calls `draftMode().disable()` | Exit preview |
| [src/app/api/revalidate/route.ts](src/app/api/revalidate/route.ts) | POST | Secret-guarded `revalidatePath()` | Manual on-demand revalidation |
| [src/app/api/optimizely/webhook/route.ts](src/app/api/optimizely/webhook/route.ts) | POST | Secret-guarded `revalidateTag()` for page/header/footer tags + `revalidatePath('/')`, `/en`, `/es` | Receives publish events from Optimizely to invalidate cached content |
| [src/app/api/optimizely/health/route.ts](src/app/api/optimizely/health/route.ts) | GET | Returns `{providerEnabled, publicConfigured, adminConfigured, publicReachable, adminReachable}` | Diagnostic to verify CMS connectivity in dev and on Vercel |
| [src/app/api/optimizely/debug-startpage/route.ts](src/app/api/optimizely/debug-startpage/route.ts) | GET | Dumps the raw Optimizely `StartPage` Graph response | Debugging schema/field mapping issues |
| [src/app/api/leads/route.ts](src/app/api/leads/route.ts) | POST | Validates payload, appends a lead via `src/lib/leads.ts` | Backend for the contact form |
| [src/app/api/subscribe/route.ts](src/app/api/subscribe/route.ts) | POST | Stores newsletter signup | Backend for the subscription form |
| [src/app/api/search/route.ts](src/app/api/search/route.ts) | GET | Full-site search over CMS content | Powers `HeaderSearch` |
| [src/app/api/admin/leads.csv/route.ts](src/app/api/admin/leads.csv/route.ts) | GET | Streams leads as CSV | Export from admin dashboard |
| [src/app/api/admin/subscribers.csv/route.ts](src/app/api/admin/subscribers.csv/route.ts) | GET | Streams subscribers as CSV | Export from admin dashboard |

---

## `src/components/` — UI

Pure presentational components. They consume normalized types from `src/lib/cms` and know nothing about Optimizely.

### `src/components/cms/`

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/components/cms/page-renderer.tsx](src/components/cms/page-renderer.tsx) | Page composer | Receives a `Page`, iterates `page.blocks`, delegates to `<BlockRenderer>` | One component for any page type — keeps page routes thin |
| [src/components/cms/block-renderer.tsx](src/components/cms/block-renderer.tsx) | Block switch | `switch (block.type)` → renders the matching block UI (hero, services, richText, etc.) | Discriminated-union dispatch enforces exhaustive block handling at compile time |

### `src/components/site/`

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/components/site/site-header.tsx](src/components/site/site-header.tsx) | Global header | Renders logo, nav items, locale switcher, CTA from `SiteHeaderContent` | Header content is authored in Optimizely's `Header` type |
| [src/components/site/site-footer.tsx](src/components/site/site-footer.tsx) | Global footer | Renders columns, body, social links, copyright from `SiteFooterContent` | Footer content is authored in Optimizely's `Footer` type |
| [src/components/site/header-search.tsx](src/components/site/header-search.tsx) | Client search box | Calls `/api/search`, shows live results | Site-wide search UX |
| [src/components/site/alerts-callout.tsx](src/components/site/alerts-callout.tsx) | Banner component | Shows draft-mode banner (and any future alerts) | Visual signal when preview cookie is active |

### `src/components/forms/`

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) | Client form | Validates input, posts JSON to `/api/leads`, shows success/error state | Reusable lead-capture UI for `form` blocks and the contact page |

---

## `src/lib/` — Domain logic

The boundary between routes/components and external systems.

### `src/lib/cms/`

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/lib/cms/types.ts](src/lib/cms/types.ts) | Type contracts | Defines `Locale`, `Page` discriminated union (StartPage, ServicePage, IndustryPage, InsightPage, AuthorPage, ContactPage, ResourceCenterPage, SubscriptionPageContent), `Block` union (hero, richText, html, image, video, stats, quote, cardGrid, cta, featuredContent, articleList, form, services, industries, testimonials, story, logos, team), `SiteHeaderContent`, `SiteFooterContent`, `LinkField`, `NavigationItem`, `PublishStatus`, etc. | Single source of truth that decouples UI from CMS shape |
| [src/lib/cms/index.ts](src/lib/cms/index.ts) | Provider dispatcher | Exposes `getPageBySlug`, `getSiteHeader`, `getSiteFooter`, `listInsights`, `getInsightById`, `getAuthorById`, `getServiceById`, `getIndustryById`, `getNavigation`. Internally chooses between Optimizely Graph fetcher and mock data based on `CMS_PROVIDER`. Normalizes Optimizely's `_json` payloads into the local types and falls back to mock content for missing items. Tags fetches for `revalidateTag` | Provider-swappable CMS abstraction — the heart of the app |
| [src/lib/cms/mock-content.ts](src/lib/cms/mock-content.ts) | Offline dataset | Hardcoded set of pages and blocks for every page type | Lets the entire site run with `CMS_PROVIDER=mock` (no network), and fills gaps while Optimizely content is still being authored |

### Other lib files

| Path | What it is | What it does | Why |
|---|---|---|---|
| [src/lib/leads.ts](src/lib/leads.ts) | Lead storage interface | Reads/writes `data/leads.json` (and exposes the same shape for a future DB) | Isolates persistence so the API route and admin page don't know whether storage is a file or a database |
| [src/lib/db.ts](src/lib/db.ts) | DB connection | Configures Neon serverless client | Ready-made hook to migrate `leads.ts`/`subscribers` from JSON to Postgres without touching routes |

---

## How the pieces fit (one-line recap)

`URL` → `[locale]/[[...slug]]/page.tsx` → `lib/cms/index.ts` (provider chooses Optimizely Graph or mock) → returns a normalized `Page` → `components/cms/page-renderer.tsx` walks `page.blocks` → `components/cms/block-renderer.tsx` renders each block → header/footer come from `lib/cms` via `[locale]/layout.tsx`.

Forms post to `app/api/*/route.ts` → `lib/leads.ts` / `lib/db.ts` → `data/leads.json` (or Neon). Optimizely publish webhook hits `app/api/optimizely/webhook/route.ts` → `revalidateTag()` → cache flushed → next request re-fetches Graph.
