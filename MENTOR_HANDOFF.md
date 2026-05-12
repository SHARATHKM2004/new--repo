# Summit Advisory Group Practice Build: Mentor Handoff

## 1.purpose

This project was built as a practical full-stack website implementation to prove a real editorial workflow using local development plus Optimizely SaaS CMS.

The core requirement was:

1. Developers should be able to change UI and frontend components locally in VS Code.
2. Content authors should be able to add, remove, or override content in Optimizely CMS.
3. Those content changes should appear in localhost, preview mode, and the deployed app.
4. The same application should run locally and in production.



## 2. goal

After the basic app was working, the scope expanded into a more realistic implementation.

The advanced goal became:

1. Connect the site to a real Optimizely SaaS CMS environment.
2. Support published content rendering from Optimizely Graph.
3. Support unpublished draft preview using admin Graph credentials.
4. Support webhook-based revalidation after publishing.
5. Keep the frontend developer-controlled in code while keeping editorial content CMS-controlled.
6. Deploy the same application publicly and verify the real workflow end to end.



## 4. Technical stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS v4
- Optimizely SaaS CMS with Optimizely Graph
- Vercel for deployment
- Local JSON persistence for lead capture

## 5. Project architecture

### Frontend rendering

- `src/components/site/site-header.tsx`: shared header UI
- `src/components/site/site-footer.tsx`: shared footer UI
- `src/components/cms/block-renderer.tsx`: renders normalized CMS blocks
- `src/components/cms/page-renderer.tsx`: renders full normalized pages

### CMS abstraction

- `src/lib/cms/types.ts`: shared page, block, SEO, locale, and webhook types
- `src/lib/cms/index.ts`: main CMS integration layer
- `src/lib/cms/mock-content.ts`: mock content fallback

### Routing and APIs

- `src/app/[locale]/[[...slug]]/page.tsx`: main locale-aware page route
- `src/app/[locale]/layout.tsx`: shared locale shell and preview banner
- `src/app/api/draft/route.ts`: enable preview mode
- `src/app/api/draft/disable/route.ts`: disable preview mode
- `src/app/api/revalidate/route.ts`: manual revalidation endpoint
- `src/app/api/optimizely/webhook/route.ts`: Optimizely webhook receiver
- `src/app/api/optimizely/health/route.ts`: deployment and CMS connectivity diagnostic

### Data persistence

- `data/leads.json`: locally stored form submissions

## 6. How the content model works

The app does not render Optimizely JSON directly in page components. Instead, it normalizes data into internal application models.

The flow is:

1. Fetch data from Optimizely Graph.
2. Map Graph content into internal `Page` and `Block` types.
3. Render those normalized models through shared React components.

This architecture makes the site easier to maintain because the app rendering layer is stable even if CMS content models evolve.

## 7. What was built

### Phase 1: Local app foundation

1. Scaffolded a new Next.js application in the project folder.
2. Added localized routing for `en` and `es`.
3. Built reusable CMS-driven page rendering.
4. Added reusable block rendering for hero, rich text, stats, quote, card grid, CTA, featured content, form, and HTML blocks.
5. Added a local lead capture API with JSON persistence.

### Phase 2: Mock CMS workflow

1. Built typed CMS abstractions.
2. Added a mock content source so the site could be developed before live CMS integration.
3. Implemented page types for homepage, service pages, industry pages, insights, authors, case studies, contact, and resource center.

### Phase 3: Live Optimizely integration

1. Connected published content to Optimizely Graph using render URL plus render key.
2. Added StartPage mapping.
3. Added CMSPage mapping.
4. Added support for Optimizely block mapping into internal block types.
5. Added support for CMS-driven shared header and footer content.

### Phase 4: Preview and publish workflow

1. Added draft mode preview routes.
2. Added preview banner in the layout.
3. Added admin Graph auth for unpublished preview content.
4. Added manual revalidation endpoint.
5. Added webhook receiver for Optimizely Graph publish events.
6. Added tag-based cache invalidation.

### Phase 5: Deployment and production hardening

1. Deployed the site to Vercel.
2. Added diagnostics at `/api/optimizely/health`.
3. Improved SEO metadata generation from CMS content.
4. Switched helper methods to prefer live Optimizely pages and use mock content only as fallback.
5. Fixed production by adding the missing Vercel environment variables and redeploying.

## 8. Current verified behavior

The following has been verified:

1. `npm run build` passes locally.
2. Localhost reads live Optimizely StartPage content.
3. The deployed site now reads live Optimizely StartPage content.
4. The deployed health route returns successful Optimizely connectivity.
5. Preview mode infrastructure is implemented and active.
6. Revalidation and webhook routes exist and are deployable.

## 9. Current deployed URL

Production URL:

- `https://project-coral-eight.vercel.app`

Health diagnostic URL:

- `https://project-coral-eight.vercel.app/api/optimizely/health`

Expected health response:

```json
{
  "providerEnabled": true,
  "publicConfigured": true,
  "adminConfigured": true,
  "publicReachable": true,
  "adminReachable": true
}
```

## 10. How to run the project from scratch

### Step 1: install dependencies

```bash
npm install
```

### Step 2: configure environment variables

Create `.env.local` based on `.env.example` and set the values below.

Required values:

```env
CMS_PROVIDER=optimizely
SITE_URL=http://localhost:3000
PREVIEW_SECRET=your-preview-secret
REVALIDATE_SECRET=your-revalidate-secret
OPTIMIZELY_AUTHORING_URL=https://your-optimizely-authoring-url/
OPTIMIZELY_RENDER_URL=https://cg.optimizely.com
OPTIMIZELY_RENDER_KEY=your-render-key
OPTIMIZELY_GRAPH_APP_KEY=your-graph-app-key
OPTIMIZELY_GRAPH_SECRET=your-graph-secret
OPTIMIZELY_CONTENT_CLIENT_ID=optional-content-client-id
OPTIMIZELY_CONTENT_SECRET=optional-content-secret
```

### Step 3: start the app

```bash
npm run dev
```

### Step 4: open the app

- `http://localhost:3000/en`

### Step 5: verify CMS connectivity

- `http://localhost:3000/api/optimizely/health`

If the route returns all `true`, the application can reach Optimizely correctly.

## 11. How the editing workflow works

### Developer-owned changes

Developers edit UI in VS Code.

Examples:

- update header layout in `src/components/site/site-header.tsx`
- update footer layout in `src/components/site/site-footer.tsx`
- update page section rendering in `src/components/cms/page-renderer.tsx`
- update block rendering in `src/components/cms/block-renderer.tsx`

These changes affect layout, structure, styling, and behavior.

### Editor-owned changes

Editors change content in Optimizely.

Examples:

- edit `StartPage`
- edit `CMSPage`
- edit a `HeroBlock`
- publish those items from Optimizely

These changes affect page text, block content, CTA labels, descriptions, and authored structure.

## 12. How preview works

Preview mode is used to view unpublished changes.

### Enable preview

```text
/api/draft?secret=<PREVIEW_SECRET>&slug=/en
```

### Disable preview

```text
/api/draft/disable
```

### Expected behavior

1. Enable preview.
2. The application displays a preview banner.
3. Unpublished draft content is fetched using admin Graph credentials.
4. The user can validate editorial changes before publishing.

## 13. How publish updates work

Published changes should appear after Optimizely publishes content and the webhook or revalidation path runs.

### Manual revalidation

```json
{
  "secret": "your-revalidate-secret",
  "path": "/en"
}
```

### Webhook route

Optimizely Graph webhooks call:

- `/api/optimizely/webhook`

The webhook route invalidates shared tags and revalidates key site paths.





## 17. completed

1. Next.js project scaffold and structure
2. Localized page routing
3. Shared site layout and componentized frontend
4. Typed CMS abstraction
5. Mock content provider
6. Live Optimizely StartPage and CMSPage integration
7. Reusable Optimizely block mapping
8. Preview mode routes and banner
9. Manual revalidation route
10. Optimizely webhook route
11. Local lead capture persistence
12. Vercel deployment
13. Production Optimizely environment configuration
14. CMS health endpoint
15. Live-first page helper behavior with fallback support

## 18. partially completed

1. Branch preview environment parity in Vercel
2. Full unpublished preview testing for every content type
3. Full live replacement for all listing and related-content surfaces
4. CMS-driven shared header and footer content, depending on authored items existing in Optimizely

## 19.left

1. Create real Optimizely `Header` and `Footer` items if fully CMS-driven chrome is required.
2. Create more live authored content such as insights, authors, case studies, and resource listings.
3. Remove the last mock fallback areas once corresponding Optimizely content exists.
4. Complete a final end-to-end preview test using unpublished authored changes.
5. Optionally refine design polish for a more production-like visual finish.


## 21. Final summary

This project successfully demonstrates a realistic developer and editor workflow:

- developers edit UI in code
- editors edit content in Optimizely
- localhost reflects CMS content
- preview supports draft validation
- production reflects published CMS content
- deployment and CMS connectivity are verified

