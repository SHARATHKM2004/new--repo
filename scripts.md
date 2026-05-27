# Project Walkthrough — Speaker Script

A ready-to-speak script that takes the audience from *zero* to *deployed-and-running* — covering every Optimizely step, every frontend decision, and every reason behind them. Speak the lines in plain prose; the **[SHOW]** notes tell you what to put on screen at that moment.

---

## 0. Before You Start (Setup Checklist for the Presenter)

**[SHOW] — close every tab, then open these in order so you can switch by Ctrl+Tab:**

1. The live site: `https://project-coral-eight.vercel.app/en`
2. VS Code on the project folder.
3. GitHub repo: `https://github.com/SHARATHKM2004/project-cms`.
4. Vercel dashboard for the project.
5. Optimizely CMS (the authoring UI).
6. A terminal already inside the project folder.
7. A second browser tab on `https://project-coral-eight.vercel.app/api/optimizely/health` (keep refreshed).

**Speak this opening line:**
> "Good morning everyone. What I am going to walk you through today is a full, production-ready, CMS-driven website — built from scratch on Next.js 16 and React 19, connected to Optimizely SaaS CMS, and deployed live on Vercel. By the end of this session you will know exactly what every file does, every Optimizely step we performed, and the reason behind every decision. There will be no black boxes."

---

## 1. The 60-Second Big Picture

**[SHOW] — the live home page in the browser.**

> "Before we dive in, let me show you what we are working with. This is the live site. Every word, every image, every block you see on this screen — the hero, the story section, the services, the industries, the footer — is being pulled live from Optimizely CMS. Nothing on this page is hardcoded. If a marketer changes a heading in Optimizely right now, this page updates within seconds without any developer touching the code.

> The same site runs in two languages — English and Spanish — and the language is part of the URL. Watch."

**[SHOW] — click the locale switcher; URL changes from `/en` to `/es`.**

> "One codebase. Two languages. Driven entirely by the CMS. That is the goal we are going to achieve, step by step."

---

## 2. The Stack — What We Picked and Why

**[SHOW] — open `package.json` in VS Code.**

> "Let us look at what powers this. Open `package.json`."

Then explain each pick:

- **Next.js 16 with the App Router and Turbopack** — "Next.js gives us server components, file-based routing, draft mode, and on-demand revalidation in one framework. Turbopack is the new bundler — faster dev server and faster builds than Webpack."
- **React 19** — "Required by Next 16. Brings the new Suspense and server-component improvements."
- **TypeScript 5** — "Every CMS field has a type. If the CMS returns the wrong shape, the build fails. That is the safety net."
- **Tailwind CSS v4** — "Utility-first styling. No separate config file in v4 — just a PostCSS plugin. Open `postcss.config.mjs`."

**[SHOW] — open `postcss.config.mjs`** (one-liner that loads `@tailwindcss/postcss`).

- **Optimizely SaaS CMS + Optimizely Graph** — "The headless CMS. Authors edit in Optimizely; we read the content over GraphQL."
- **Neon Postgres** — "For form data — leads and newsletter subscribers. Serverless Postgres, perfect for Vercel."
- **Vercel hosting** — "Native Next.js. Push to GitHub, Vercel builds and deploys. We will see this at the end."

> "The reason we picked this stack is one sentence: every choice supports a CMS-driven, server-rendered, edge-cached site that a marketing team can update without ever touching code."

---

## 3. The Folder Map — One Tour, So Nothing Surprises You Later

**[SHOW] — VS Code file explorer with the project tree expanded, side-by-side with `FILE_INVENTORY.md`.**

> "Before we start building, here is the folder structure. There are exactly four important folders inside `src/`."

Walk through them in this order while pointing at each:

1. **`src/app/`** — "Every URL on the site lives here. Folders become URL segments. Files named `page.tsx` are pages, files named `route.ts` are API endpoints."
2. **`src/components/`** — "Pure UI. Three sub-folders: `cms` for CMS-driven blocks, `site` for the global header and footer, `forms` for the lead form."
3. **`src/lib/cms/`** — "The brain. This is the abstraction layer between Optimizely and the UI. It is also where we fetch, normalize, and cache content. We will spend the most time here."
4. **`src/lib/db.ts` and `src/lib/leads.ts`** — "Database access for leads and subscribers."

> "Memorize one rule: no Optimizely shape ever leaks out of `src/lib/cms/`. The components do not know Optimizely exists. That single rule is what lets us swap the CMS without rewriting the front end."

---

## 4. Step One — Scaffolding the Project

**[SHOW] — open a terminal.**

> "Step one. Create the Next.js project. Run:"

```
npx create-next-app@latest project --typescript --app --tailwind --eslint
```

> "This gives us a working Next.js 16 skeleton with TypeScript, App Router, Tailwind v4, and ESLint configured. We answer the prompts to use the `src/` directory and the `@/*` import alias.

> Now we add the two extra packages we need."

```
npm install @neondatabase/serverless
```

> "That is the only non-default package. Everything else ships in the Next starter."

**[SHOW] — show the empty `src/app` with the default `page.tsx` and `layout.tsx`.**

---

## 5. Step Two — The Type Contracts (the foundation)

**[SHOW] — open `src/lib/cms/types.ts`, then `src/lib/cms/types-blocks.ts`.**

> "Before we write a single line of UI, we define what content looks like. Open `types.ts`."

Explain the key types while scrolling:

- **`Locale`** — "Just `'en'` or `'es'`. The whole site enforces this."
- **`Page` discriminated union** — "A page is one of `HomePage`, `StandardPage`, `InsightPage`, `AuthorPage`, `ServicePage`, `IndustryPage`, `ResourceCenterPage`, `ContactPage`, or `LocationPage`. The `pageType` field discriminates them. TypeScript forces us to handle every type — we cannot forget one."
- **`Block` union (in `types-blocks.ts`)** — "Every section on a page is a block: `hero`, `story`, `services`, `industries`, `richText`, `image`, `video`, `quote`, `stats`, `cardGrid`, `cta`, `featuredContent`, `articleList`, `newsList`, `eventsListing`, `locationsDirectory`, `signIn`, `payBill`, `portalApplications`, `form`. That is the full library."

> "Why discriminated unions? Because when the renderer switches on `block.type`, the TypeScript compiler checks that we handle every case. If we add a new block type tomorrow, the build refuses to pass until we wire it up. That is the safety net I mentioned earlier."

---

## 6. Step Three — The Mock Dataset (so we can build without Optimizely)

**[SHOW] — open `src/lib/cms/mock-content.ts`, then open the split files: `mock-content-pages-en-1.ts`, `mock-content-pages-en-2.ts`, `mock-content-pages-es.ts`, `mock-content-articles.ts`, `mock-content-events.ts`, `mock-articles.ts`, `mock-authors.ts`.**

> "Now we build a fake CMS in memory. Open the mock files. There is one entry for every page type and one of every block. Why?

> Two reasons. One — we can build the entire site offline before Optimizely is even configured. Two — if Optimizely ever returns null for a field, we fall back to this dataset. The site never breaks.

> Originally this was one giant 2 400-line file. We split it across these files so every file stays under 300 lines. Same dataset, easier to read."

---

## 7. Step Four — The CMS Abstraction Layer

**[SHOW] — open `src/lib/cms/index.ts` (the 16-line barrel).**

> "Open `index.ts`. Sixteen lines. This is the public face of the entire CMS layer. Everything else in the app calls into this barrel."

**[SHOW] — scroll through these files in order:** `page-resolver.ts`, `navigation.ts`, `footer.ts`, `subscription.ts`, `search.ts`, `insights.ts`.

Explain each as you scroll:

- **`page-resolver.ts`** — "`getPageBySlug({ locale, slug, draft })` is the most important function in the codebase. Given a URL, it returns a fully normalized `Page` object. It tries Optimizely first, falls back to mocks if nothing matches."
- **`navigation.ts`** — "Builds the header navigation tree from Optimizely's `Header` content type."
- **`footer.ts`** — "Same for the footer."
- **`subscription.ts`** — "Content for the newsletter subscription page."
- **`search.ts`** — "`searchAllPages` — scans every page title, summary, and section content for the query and returns up to ten results."
- **`insights.ts`** — "Filters insights by topic, finds related content, finds the author of an article."

> "Every one of these is provider-agnostic. The component calling them does not know whether the data came from Optimizely or from mocks."

---

## 8. Step Five — The Optimizely Provider

**[SHOW] — open `optimizely-config.ts`, then `optimizely-graph.ts`, then `optimizely-fetchers.ts`.**

> "Now the Optimizely-specific code. Three files."

- **`optimizely-config.ts`** — "Reads environment variables, builds the Basic Auth header for admin requests, defines the revalidation tags."
- **`optimizely-graph.ts`** — "The GraphQL client. It sends a POST request to `cg.optimizely.com/content/v2`. For published content it uses a single auth key. For drafts it uses Basic Auth. It also exposes `getOptimizelyConnectionStatus` which the health endpoint calls."
- **`optimizely-fetchers.ts`** — "The actual GraphQL queries. One reusable fragment per Optimizely content type — `StartPage`, `CMSPage`, `Header`, `Footer`."

**[SHOW] — open `optimizely-types.ts` and `optimizely-block-type.ts`.**

> "These describe what Optimizely sends us. Notice they only live inside the `cms/` folder. They never leak out."

**[SHOW] — open `block-mapper.ts`, then `block-mapper-content.ts`, then `block-mapper-marketing.ts`, then `page-mapper-cms.ts`, then `page-mapper-start.ts`.**

> "These mappers are the translator. Optimizely's `_json` payloads come in — our `Page` and `Block` shapes go out. Why do we read everything from `_json`? Because in Optimizely every custom field gets serialized into this JSON blob. We do not have to update our GraphQL query every time content editors add a new field. That is a huge maintenance win."

---

## 9. Step Six — The Renderers (the UI side of the CMS layer)

**[SHOW] — open `src/components/cms/page-renderer.tsx` and the five view files: `page-renderer-default-view.tsx`, `page-renderer-insight-view.tsx`, `page-renderer-contact-view.tsx`, `page-renderer-news-landing.tsx`, `page-renderer-resource-center.tsx`.**

> "`PageRenderer` is a dispatcher. It looks at the page type and sends rendering to one of five view components. Each view is specialized — articles look different from contact pages, the resource center has search filters, news landing has a sidebar.

> The default view handles every standard page. It renders the hero, the kicker badge, then iterates `page.sections` and hands each block to the block renderer."

**[SHOW] — open `block-renderer.tsx` and `block-renderer-static.tsx`.**

> "The block renderer is a giant switch statement on `block.type`. Static views — Hero, Rich Text, Image, Video, Quote, Stats, CardGrid, CTA — render directly on the server. Heavy interactive blocks — PortalApplications, LocationsDirectory, PayBill, SignIn variants — are lazy-loaded via `next/dynamic`. Why? They include client-side JavaScript we do not want to ship until the user actually scrolls to them. That keeps the Lighthouse performance score at 98."

---

## 10. Step Seven — The Routes

**[SHOW] — open `src/app/[locale]/[[...slug]]/page.tsx`.**

> "Now look at how URLs map to pages. This is one file. One single page component. It handles every URL on the site."

Walk through the file:

1. Destructure `locale` and `slug` from `params`.
2. Validate the locale.
3. Read `draftMode().isEnabled`.
4. Call `getPageBySlug({ locale, slug, draft })`.
5. If null, call `notFound()`.
6. Render with `<PageRenderer page={page} />`.
7. `generateMetadata` reads `page.seo` and builds title, description, canonical, hreflang alternates, OpenGraph.

> "One catch-all route handles the entire site. When a marketer creates a new page in Optimizely, zero developer work is required. The slug works automatically."

**[SHOW] — open `src/app/[locale]/layout.tsx`.**

> "The locale layout fetches the header and footer once and wraps every page. It also calls `draftMode()` so preview mode works."

**[SHOW] — open `src/app/[locale]/locations/[slug]/page.tsx` and `state/[state]/page.tsx`.**

> "Locations get explicit routes because they are structured records — addresses, lat-long, phone numbers — not block-based marketing pages. Explicit routes give us better SEO and static params."

---

## 11. Step Eight — The Site Shell

**[SHOW] — open `src/components/site/site-header.tsx`, `site-header-panel.tsx`, `site-footer.tsx`, `header-search.tsx`, `alerts-callout.tsx`.**

> "The shell — header, footer, search, alert banner. All driven by data fetched in the locale layout. The header panel handles the mobile mega-menu. The search component debounces user input and hits `/api/search`, which we will build next."

---

## 12. Step Nine — The API Routes

**[SHOW] — expand the `src/app/api/` folder.**

> "Every route handler here is an API endpoint. Let me walk through what each one does."

Touch each route quickly:

- **`/api/draft`** — "Optimizely's Preview button hits this. We validate a secret, enable Next.js draft mode, redirect to the slug."
- **`/api/draft/disable`** — "Exits preview."
- **`/api/revalidate`** — "Secret-protected. Manual cache invalidation."
- **`/api/leads`** — "POST. Lead-form backend. Writes to Neon and `data/leads.json`."
- **`/api/subscribe`** — "POST. Newsletter signup. Writes to Neon."
- **`/api/search`** — "GET. Calls `searchAllPages`. Returns up to ten results."
- **`/api/optimizely/webhook`** — "Optimizely hits this on every publish. We `revalidateTag` for the page, header, and footer tags. The next request re-fetches from Optimizely."
- **`/api/optimizely/health`** — "Health check. Returns five booleans — provider enabled, public key configured, admin key configured, public reachable, admin reachable."
- **`/api/optimizely/debug-*`** — "Four debug endpoints that dump raw Graph responses. We use these when content authoring breaks something."
- **`/api/admin/leads.csv` and `/api/admin/subscribers.csv`** — "CSV exports for the admin team."

> "Two-thirds of these endpoints exist purely to make the Optimizely integration debuggable in production. That is intentional. When a marketer says 'my page is not updating', we have the tools to diagnose it in thirty seconds."

---

## 13. Step Ten — Lead Capture and Subscriptions

**[SHOW] — open `src/components/forms/lead-form.tsx`, then `src/lib/db.ts`, then `src/lib/leads.ts`.**

> "The lead form is a client component. It validates input, posts JSON to `/api/leads`. The route handler validates the payload, writes to Neon via `db.ts`, and also appends to `data/leads.json` through `leads.ts` so we have local visibility during development.

> Why two storage targets? Because Neon is fast in production, but during local development we want to see leads on disk for debugging. Both run in parallel."

**[SHOW] — visit `/admin/leads?key=YOUR_ADMIN_KEY` on the live site.**

> "And here is the admin dashboard. Gated by a query-string key. Tables for leads and subscribers. Download as CSV."

---

## 14. Step Eleven — Optimizely Configuration (the part that scares people, made simple)

**[SHOW] — open the Optimizely CMS authoring UI in the browser.**

> "Now we set up Optimizely. This is the part everyone is afraid of. It is actually six steps."

Speak through it slowly:

### Step 11.1 — Create the content types

> "In Optimizely, go to **Settings → Content Types**. We need exactly four:

> - **`StartPage`** — the home page.
> - **`CMSPage`** — every inner page.
> - **`Header`** — the global header.
> - **`Footer`** — the global footer.

> For `CMSPage`, add a `pageType` text field. This is the discriminator. Values: `service`, `industry`, `insight`, `author`, `contact`, `resource-center`, `standard`, `news-landing`."

### Step 11.2 — Create the block types

> "Same place, create the blocks: `HeroBlock`, `StoryBlock`, `ServicesBlock`, `IndustriesBlock`, `LogosBlock`, `TestimonialsBlock`, `RichTextBlock`, `ImageBlock`, `VideoBlock`, `TeamBlock`, `ContactBlock`, `PortfolioGridBlock`, `NewsListBlock`, `EventsListingBlock`, `LocationsDirectoryBlock`, `SignInBlock`, `PayBillBlock`, `PortalApplicationsBlock`. Each one has the fields documented in `documentation.md` section six."

### Step 11.3 — Generate the API keys

> "Go to **Settings → API Keys**. Create two keys:

> - **Render key** — for published, public reads. We pass this as a query parameter.
> - **App key + secret** — admin credentials for draft and preview. We use these as Basic Auth.

> Copy all three values."

### Step 11.4 — Add credentials to the project

**[SHOW] — open `.env.local` (the file you have currently open).**

> "Open `.env.local` in the project. Paste the keys."

```
CMS_PROVIDER=optimizely
SITE_URL=https://project-coral-eight.vercel.app
PREVIEW_SECRET=<your-random-string>
REVALIDATE_SECRET=<your-random-string>
OPTIMIZELY_AUTHORING_URL=https://app-xxx.cms.optimizely.com
OPTIMIZELY_RENDER_URL=https://cg.optimizely.com
OPTIMIZELY_RENDER_KEY=<paste render key>
OPTIMIZELY_GRAPH_APP_KEY=<paste app key>
OPTIMIZELY_GRAPH_SECRET=<paste secret>
DATABASE_URL=<your Neon connection string>
ADMIN_KEY=<your-random-string>
```

> "Save. Run `npm run dev`. The site is now reading from Optimizely."

### Step 11.5 — Author the content

> "Back in Optimizely. Create one item for each type:

> 1. A `Header` for English and one for Spanish.
> 2. A `Footer` for English and one for Spanish.
> 3. A `StartPage` for the home.
> 4. `CMSPage` items for every Service, Industry, Insight, Author, Contact, Resource Center.

> The slug in Optimizely must match the URL slug in our app. If we have `/en/services/digital-platform-strategy`, the Optimizely slug must be `services/digital-platform-strategy`."

### Step 11.6 — Configure the publish webhook

> "In Optimizely, **Settings → Webhooks**. Add a webhook for the **Content Published** event. URL: `https://project-coral-eight.vercel.app/api/optimizely/webhook?secret=<REVALIDATE_SECRET>`. Method: POST.

> Now every time a marketer publishes a change, Optimizely calls our webhook, our webhook invalidates the cache tags, and the next visitor sees the new content within seconds."

**[SHOW] — open `/api/optimizely/health` in the browser.**

> "Quick sanity check. All five booleans should be `true`. If any is `false`, the message in the response tells us which credential is wrong."

---

## 15. Step Twelve — Draft and Preview Mode

**[SHOW] — open Optimizely, edit any page, click Preview.**

> "Watch what happens when an author clicks Preview in Optimizely. Optimizely opens our `/api/draft` endpoint with the slug and the preview secret. We validate the secret, enable Next.js draft mode, and redirect to the slug. The catch-all reads `draftMode().isEnabled`, passes `draft: true` to the CMS layer, which switches to admin credentials and `cache: 'no-store'`. The author sees unpublished changes."

**[SHOW] — the preview banner at the top of the page.**

> "Notice the small banner at the top — 'Preview mode is enabled'. That tells the author they are looking at a draft. There is a 'Disable preview' link that calls `/api/draft/disable`."

---

## 16. Step Thirteen — Revalidation and Caching

> "Next.js caches our pages at the edge for speed. But the CMS content can change at any moment. Two mechanisms invalidate the cache."

**[SHOW] — open `/api/revalidate/route.ts` and `/api/optimizely/webhook/route.ts`.**

> "Manual revalidation — POST to `/api/revalidate` with a path. Used during emergencies.

> Automatic revalidation — every fetch to Optimizely tags the result with `optimizely:page:{slug}`, `optimizely:header`, or `optimizely:footer`. When Optimizely publishes, the webhook calls `revalidateTag` for those tags. Next.js drops the cached HTML. The next visitor triggers a fresh fetch.

> Both endpoints require the shared `REVALIDATE_SECRET`. Without it they return 401."

---

## 17. Step Fourteen — Deploy to Vercel

**[SHOW] — the Vercel dashboard.**

> "Push to GitHub. Import the repo in Vercel. Add every environment variable from `.env.local` to Vercel — production, preview, and development. Click Deploy.

> First build takes about two minutes. Vercel produces a URL. We point our domain at it. Done."

**[SHOW] — the live URL `https://project-coral-eight.vercel.app`.**

> "Every push to `master` triggers a redeploy. Every pull request gets its own preview URL. The Optimizely webhook points at the production URL."

---

## 18. Step Fifteen — Performance and SEO

**[SHOW] — Lighthouse report.**

> "Final scores — Performance 98, Accessibility 96, Best Practices 100, SEO 100. Here is how we got there:

> - The home page video has `preload='auto'` and `fetchpriority='high'` to win the LCP race.
> - Hero images use `next/image` with `priority` set.
> - Heavy interactive blocks lazy-load via `next/dynamic`.
> - `next.config.ts` whitelists the image CDN so we get automatic AVIF and WebP.
> - `public/robots.txt` ships at the site root.
> - `metadataBase` in the root layout makes every canonical URL absolute.
> - Tailwind v4 emits only the classes we actually use — no CSS bloat."

---

## 19. Step Sixteen — The Refactor That Earned Us Maintainability

**[SHOW] — `FILE_INVENTORY.md` and the `src/lib/cms/` folder.**

> "One last thing — and this is important for whoever maintains the project after us.

> The original CMS layer was a single 2 400-line file. It worked, but no one wanted to touch it. We split it into nineteen files, each under 300 lines. The public surface — every function name, every type, every behavior — is identical. The barrel `index.ts` re-exports everything.

> The page renderer was one giant file too. We split it into five view components and three helper files. Same rule — same exports, smaller files.

> Why? Because the next developer needs to understand a 200-line file in two minutes, not a 2 400-line file in two hours."

---

## 20. The Wrap-Up

**[SHOW] — the live site one more time, with the Optimizely authoring UI side by side.**

> "So to recap.

> We have a Next.js 16 site, server-rendered, edge-cached, deployed on Vercel. Every word on every page comes from Optimizely SaaS CMS. The content layer is fully typed, swappable, and falls back to mock data so we can develop offline. Lead forms write to Neon Postgres. Search is full-text across every page. Draft mode shows unpublished content to authors. A publish in Optimizely invalidates our cache within seconds. Lighthouse scores are 98 or higher on every metric.

> Adding a new page is six clicks in Optimizely. Adding a new block type requires one entry in the type union, one mapper function, one renderer component — and TypeScript tells us if we forget any of them.

> Every file under `src/` is under 300 lines. Every Optimizely shape is contained in `src/lib/cms/`. Every secret is in `.env.local`, mirrored in Vercel.

> That is the project. From scratch to live. Thank you. Questions?"

---

## Appendix A — Quick-Reference Demo Flow (if time is short, do these 6 things)

1. **Show the live site** — change locale, scroll the home page.
2. **Open Optimizely, edit the home hero, click Publish.** Watch the live site update within ten seconds.
3. **Click Preview in Optimizely on an unpublished draft.** Show the preview banner on the redirected page.
4. **Submit the lead form on the contact page.** Open `/admin/leads?key=...` — show the new row.
5. **Open `/api/optimizely/health`** — five `true` values.
6. **Open `src/lib/cms/index.ts`** — point at the 16-line barrel and say "this is the entire public API of our CMS layer."

---

## Appendix B — Likely Audience Questions (and prepared answers)

**Q. "Why Next.js instead of WordPress or pure Optimizely templates?"**
A. We get full control of the front end, server components, automatic CDN caching, and TypeScript end-to-end. Optimizely is the content store; Next.js is the presentation layer. Each does what it is best at.

**Q. "What if Optimizely goes down?"**
A. Our cache holds the last successful response. Even without the cache, every page falls back to the mock dataset — the site stays up. The `/api/optimizely/health` endpoint tells us within seconds if the connection is degraded.

**Q. "How do we add a new language?"**
A. Three changes: add the locale string to the `Locale` type, add a mock dataset for that locale, configure the locale in Optimizely. The catch-all route handles the rest.

**Q. "How do we add a new content type?"**
A. Four files: add the type to the `Page` union in `types.ts`, add an entry to `page-mapper-cms.ts`, add a view in `page-renderer.tsx` (or reuse the default view), and create the type in Optimizely. TypeScript ensures we did not miss anything.

**Q. "Where do the leads go?"**
A. Neon Postgres in production, with a JSON file mirror locally. The admin dashboard reads from Neon. CSV export is one click.

**Q. "How fast does a published change appear on the live site?"**
A. Typically under five seconds. Optimizely fires the webhook on publish. The webhook invalidates the cache tags. The next visitor triggers a fresh fetch.

**Q. "Can a non-developer add a page?"**
A. Yes. Create a `CMSPage` in Optimizely, set the slug, set `pageType`, add blocks, hit Publish. Zero developer work.

**Q. "Is it secure?"**
A. The preview and revalidation endpoints require shared secrets. The admin dashboards require a `?key=ADMIN_KEY` query parameter. Optimizely admin credentials only travel server-to-server, never to the browser. All form submissions are server-validated before they touch the database.
