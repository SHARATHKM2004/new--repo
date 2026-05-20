# Technical Documentation — Summit Advisory Group Practice Build

A blueprint-level walkthrough of what was built, why, and how someone could rebuild it from scratch. Intentionally avoids full source code — focuses on architecture, contracts, data shapes, and step ordering.

---

## 1. Project Summary

A localized, CMS-driven corporate marketing site built on **Next.js 16 (App Router)** and **React 19**, integrated with **Optimizely SaaS CMS** via the Optimizely Graph API. The frontend is decoupled from the CMS through a typed content layer, so the same UI renders from either a mock dataset or live Optimizely content.

**Core capabilities**
- Localized routing (`en`, `es`) under a single catch-all route.
- Typed CMS abstraction with a swappable provider (mock / Optimizely).
- Draft / Preview mode using Next.js `draftMode` + Optimizely admin credentials.
- On-demand revalidation via secret-protected endpoint + Optimizely webhook.
- Lead capture form persisted to a local JSON file (or DB-ready interface).
- Diagnostic health endpoint for the CMS connection.
- Block-based page composition (Hero, Services, Industries, Story, RichText, Testimonials, etc.).

---

## 2. Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router, RSC) | Server components, route handlers, draft mode, ISR/revalidateTag |
| Language | TypeScript 5 | Strong typing for CMS contracts |
| UI | React 19 | Matches Next 16 |
| Styling | Tailwind CSS v4 (PostCSS plugin) | Utility-first, no global CSS bloat |
| CMS | Optimizely SaaS CMS + Optimizely Graph | Headless content + GraphQL endpoint |
| Persistence (leads) | JSON file (`data/leads.json`) | Local-first, swappable for Neon/Postgres (`@neondatabase/serverless` already installed) |
| Lint | ESLint 9 + `eslint-config-next` | Standard Next presets |
| Hosting | Vercel | Native Next.js, env management, preview deploys |

---

## 3. High-Level Architecture

```
Browser
   │
   ▼
Next.js App Router  ── src/app/[locale]/[[...slug]]/page.tsx  (catch-all)
   │
   ├─► PageRenderer ──► BlockRenderer  (src/components/cms/*)
   │
   ▼
CMS Abstraction  ── src/lib/cms/index.ts
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
    layout.tsx                    # Root <html>
    page.tsx                      # Redirects "/" → "/en"
    not-found.tsx                 # 404
    [locale]/
      layout.tsx                  # Locale validation + header/footer
      [[...slug]]/page.tsx        # Single catch-all that renders ANY CMS page
    admin/leads/                  # Lead viewer UI
    admin/subscribers/            # Subscriber viewer UI
    subscription/                 # Subscription landing + form
    api/
      draft/route.ts              # Enable preview mode
      draft/disable/route.ts      # Disable preview mode
      revalidate/route.ts         # On-demand revalidation
      optimizely/webhook/route.ts # Publish hook from Optimizely
      optimizely/health/route.ts  # Connectivity diagnostic
      optimizely/debug-startpage/ # Debug helper
      leads/route.ts              # POST lead submissions
      subscribe/route.ts          # POST newsletter signups
      search/route.ts             # Site search
      admin/leads.csv/            # CSV export
      admin/subscribers.csv/      # CSV export
  components/
    cms/page-renderer.tsx         # Maps a Page → list of blocks
    cms/block-renderer.tsx        # Switch over block.type → component
    site/site-header.tsx          # Global header (CMS-driven)
    site/site-footer.tsx          # Global footer (CMS-driven)
    site/header-search.tsx
    site/alerts-callout.tsx
    forms/lead-form.tsx
  lib/
    cms/types.ts                  # Single source of truth: Page, Block, etc.
    cms/index.ts                  # Provider dispatch + Graph queries + normalize
    cms/mock-content.ts           # Fallback / offline dataset
    leads.ts                      # Lead storage interface
    db.ts                         # DB connection (Neon-ready)
data/leads.json                   # Local persistence
public/                           # Static assets
```

---

## 5. Routing Model

One catch-all handles the whole site.

- URL pattern: `/[locale]/[[...slug]]`
- `locale` is validated against `["en", "es"]` (`isLocale`).
- `slug` is an array (e.g. `["services", "digital-platform-strategy"]`).
- The page calls `getPageBySlug({ locale, slug, draft })` and renders whatever comes back; if nothing comes back → `notFound()`.
- `generateMetadata` reads SEO fields off the same page object (title, description, canonical, hreflang alternates, OpenGraph).
- Root `/` redirects to `/en` (or detected locale).

**Why one route:** the CMS owns the URL tree. Adding a new page in Optimizely means publishing — no Next.js code change.

---

## 6. CMS Abstraction Contract

The frontend never sees Optimizely shapes. It sees these normalized types (from `src/lib/cms/types.ts`):

- `Page` (discriminated union): `StartPage | ServicePage | IndustryPage | InsightPage | AuthorPage | ContactPage | ResourceCenterPage | SubscriptionPageContent`
- Each page has: `slug: string[]`, `locale`, `status` (`published` / `draft`), `seo`, `blocks: Block[]`, plus type-specific fields.
- `Block` union: `hero | richText | html | image | video | stats | quote | cardGrid | cta | featuredContent | articleList | form | services | industries | testimonials | story | logos | team`
- `SiteHeaderContent`, `SiteFooterContent`, `NavigationItem`, `LinkField`.

The provider layer is responsible for converting Optimizely's `_json` payloads into these shapes. Anything missing falls back to mock data.

**Public API of `src/lib/cms/index.ts`** (what the rest of the app calls):

| Function | Purpose |
|---|---|
| `getPageBySlug({ locale, slug, draft })` | Resolve any URL to a normalized `Page` |
| `getSiteHeader(locale, draft)` | Header content (logo, nav, CTA) |
| `getSiteFooter(locale, draft)` | Footer columns, social, body |
| `listInsights(filters)` | For listing + filtering insight pages |
| `getInsightById`, `getAuthorById`, `getServiceById`, `getIndustryById` | Cross-reference helpers |
| `getNavigation(locale)` | Header nav |

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
- Draft mode forces `no-store` fetches via the admin credentials so unpublished changes appear.

---

## 8. Draft / Preview Mode

1. Author clicks Preview in Optimizely.
2. Optimizely opens `/api/draft?secret=<PREVIEW_SECRET>&slug=/en/...`.
3. Route handler validates the secret, calls `draftMode().enable()`, and redirects to the slug.
4. The catch-all page reads `draftMode().isEnabled`, passes `draft: true` to the CMS layer.
5. CMS layer uses admin credentials + `cache: "no-store"`.
6. `/api/draft/disable` clears the draft cookie.

---

## 9. Revalidation

Two ways to invalidate:

| Trigger | Endpoint | Behavior |
|---|---|---|
| Manual | `POST /api/revalidate` (secret + path) | `revalidatePath(path)` |
| Optimizely | `POST /api/optimizely/webhook` (secret in header or query) | `revalidateTag("optimizely:page:*")`, `revalidateTag("optimizely:header")`, `revalidateTag("optimizely:footer")`, plus `revalidatePath("/")`, `/en`, `/es` |

Both endpoints reject without the shared secret.

---

## 10. Lead Capture

- Form component: `src/components/forms/lead-form.tsx` (client component, posts JSON).
- API: `POST /api/leads` validates required fields, appends to `data/leads.json` through `src/lib/leads.ts`.
- Admin: `/admin/leads` reads the file and renders a table; `/api/admin/leads.csv` exports it.
- DB-ready: `src/lib/db.ts` uses `@neondatabase/serverless`. Swap the storage function in `lib/leads.ts` to migrate without touching the form or route.

The same pattern is mirrored for newsletter subscribers (`/api/subscribe`, `/admin/subscribers`).

---

## 11. Environment Variables

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

---

## 12. Optimizely Content Model (Schema to Replicate)

### Page-level types
| Type Key | Notes |
|---|---|
| `StartPage` | Home page, one per locale |
| `CMSPage` | All inner pages; differentiated by a `pageType` string field |
| `Header` | Global header, one per locale |
| `Footer` | Global footer, one per locale |

### `CMSPage.pageType` values
`service` · `industry` · `insight` · `author` · `contact` · `resource-center`

### Key authored fields on `CMSPage`
`title`, `shortDescription`, `keywords`, `pageType`, `eyebrow`, `outcomes[]`, `audience[]`, `featuredTopics[]`, `authorId`, `publishedAt`, `readTime`, `topics[]`, `relatedServiceIds[]`, `relatedIndustryIds[]`, `cardImageUrl`, `cardImageAlt`, `role`, `expertise[]`, `avatarSrc`, `offices[]`, `blocks` (Content Area).

### Reusable block types
`HeroBlock`, `ServicesBlock`, `IndustriesBlock`, `LogosBlock`, `TestimonialsBlock`, `StoryBlock`, `RichTextBlock` (`paragraph_text`), `ImageBlock`, `VideoBlock`, `TeamBlock`, `ContactBlock`, `PortfolioGridBlock`, `ParagraphTextElement`.

Full field-by-field schema lives in [documentation.md](documentation.md) §6.

---

## 13. Rebuild From Scratch — Step Order

A second engineer should follow this order. Each step is independently testable.

1. **Scaffold.** `npx create-next-app@latest` with TypeScript + App Router + Tailwind. Upgrade to Next 16 / React 19 if needed.
2. **Folder skeleton.** Create `src/app`, `src/components/{cms,site,forms}`, `src/lib/cms`, `data/`.
3. **Type contracts first.** Author `src/lib/cms/types.ts` — `Locale`, `Page` union, `Block` union, `SiteHeaderContent`, `SiteFooterContent`. Nothing else compiles until this is stable.
4. **Mock provider.** Build `src/lib/cms/mock-content.ts` with one of each page type and one of each block. Build `src/lib/cms/index.ts` exposing `getPageBySlug` / `getSiteHeader` / `getSiteFooter` reading from mocks.
5. **Renderer.** Implement `PageRenderer` (Page → blocks) and `BlockRenderer` (switch on `block.type`). Build one block component at a time; render the mock home page.
6. **Routing.** Add `src/app/page.tsx` (redirect to default locale) and `src/app/[locale]/layout.tsx` (validate locale, render header + footer). Add the catch-all `src/app/[locale]/[[...slug]]/page.tsx`. Wire `generateMetadata`.
7. **Header & footer components.** Driven by `getSiteHeader` / `getSiteFooter`. Provide local defaults if CMS data is null.
8. **Lead form + API.** Build `lead-form.tsx` client component → `POST /api/leads` → append to `data/leads.json` through `src/lib/leads.ts`. Add `/admin/leads` and CSV export.
9. **Draft mode.** Add `/api/draft` and `/api/draft/disable`. Thread `draftMode()` into the catch-all and CMS layer.
10. **Revalidation.** Add `/api/revalidate` (path-based) and stub `/api/optimizely/webhook` (tag-based). Protect both with `REVALIDATE_SECRET`.
11. **Optimizely provider.** In `src/lib/cms/index.ts`, add a Graph fetcher (POST to `/content/v2?auth=...`). Add per-type GraphQL queries reading `_json`. Add a normalizer that maps each Optimizely type → the local `Page`/`Block` shape. Gate behind `CMS_PROVIDER === "optimizely"`. Fall back to mocks for missing items.
12. **Admin credentials path.** When `draft === true`, switch the fetcher to Basic auth (`OPTIMIZELY_GRAPH_APP_KEY:OPTIMIZELY_GRAPH_SECRET`) and `cache: "no-store"`.
13. **Health endpoint.** `/api/optimizely/health` returns `{providerEnabled, publicConfigured, adminConfigured, publicReachable, adminReachable}`. 200 if reachable, 503 otherwise.
14. **Optimizely content.** In Optimizely CMS, create content types from §12, then create published items: Header, Footer, StartPage, all Services, Industries, Insights, Authors, Contact, Resource Center. Slugs must match the URL paths exactly.
15. **Wire webhook.** Configure Optimizely to call `/api/optimizely/webhook` on publish with the shared secret.
16. **Deploy.** Push to GitHub → import in Vercel → add env vars for Production/Preview/Development → first deploy → verify `/api/optimizely/health` returns all `true` on the live URL.
17. **Validate.** Walk through every locale route, trigger a publish from Optimizely, confirm the live page updates. Test preview link, test lead submission, test CSV export.

---

## 14. Related Documents

- [README.md](README.md) — quickstart
- [documentation.md](documentation.md) — full step-by-step setup, full CMS schema, and Vercel deployment guide
- [SetupGuide.md](SetupGuide.md) — environment setup details
- [Guide.md](Guide.md) — additional notes
- [SCRATCH_TO_FINISH_BUILD_GUIDE.md](SCRATCH_TO_FINISH_BUILD_GUIDE.md) — rebuild walkthrough
