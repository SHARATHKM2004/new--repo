# Scratch-to-Finish Build Guide

This document explains exactly how this project was built, what each part does, and how to rebuild the same implementation from scratch.

## 1. Project goal

Build a real CMS-driven website where:

1. Developers control the frontend in code.
2. Content authors control content in Optimizely CMS.
3. The same application works locally and in production.
4. Published content appears on localhost and on the deployed site.
5. Unpublished content can be previewed.
6. Publishing can trigger revalidation.

## 2. Tech stack used in this repo

From `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## 3. High-level architecture

The application does not render raw Optimizely JSON directly inside page components.

Instead, the flow is:

1. Fetch content from Optimizely Graph or mock content.
2. Normalize that content into internal TypeScript models.
3. Render those internal models through shared page and block renderers.

This is the main architecture decision that keeps the frontend stable.

## 4. Important project structure

```text
src/
  app/
    [locale]/
      layout.tsx
      [[...slug]]/page.tsx
    api/
      draft/route.ts
      draft/disable/route.ts
      leads/route.ts
      optimizely/
        health/route.ts
        webhook/route.ts
      revalidate/route.ts
  components/
    cms/
      block-renderer.tsx
      page-renderer.tsx
    forms/
      lead-form.tsx
    site/
      site-header.tsx
      site-footer.tsx
  lib/
    leads.ts
    cms/
      index.ts
      mock-content.ts
      types.ts
data/
  leads.json
```

## 5. Build order from scratch

### Phase 1: Create the Next.js foundation

1. Create a new Next.js app with App Router, TypeScript, and Tailwind.
2. Confirm `npm install` and `npm run dev` work.
3. Create the shared app shell and global styling.
4. Add localized routing using a locale segment.

In this repo, the main localized page route is:

- `src/app/[locale]/[[...slug]]/page.tsx`

The locale layout is:

- `src/app/[locale]/layout.tsx`

### Phase 2: Define internal CMS types first

Before connecting Optimizely, define the app's own content models.

Representative code from `src/lib/cms/types.ts`:

```ts
export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export type HeroBlock = {
  type: "hero";
  eyebrow?: string;
  title: string;
  intro: string;
};

export type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};

export type VideoBlock = {
  type: "video";
  src: string;
  title: string;
  caption?: string;
  poster?: string;
  mode: "embed" | "file";
};

export type BasePage = {
  id: string;
  translationKey: string;
  locale: Locale;
  slug: string[];
  title: string;
  summary: string;
  sections: Block[];
};
```

This matters because the React UI should depend on `Page` and `Block` models owned by the app, not on Optimizely response shapes.

### Phase 3: Build the renderer layer

Create reusable rendering components before wiring live CMS data.

Files:

- `src/components/cms/page-renderer.tsx`
- `src/components/cms/block-renderer.tsx`

Representative block rendering code:

```tsx
export async function BlockRenderer({
  block,
  locale,
  draft,
}: {
  block: Block;
  locale: Locale;
  draft: boolean;
}) {
  switch (block.type) {
    case "hero":
      return (
        <section>
          <h1>{block.title}</h1>
          <p>{block.intro}</p>
        </section>
      );
    case "featuredContent": {
      const items = await getFeaturedContent({
        locale,
        contentTypes: block.contentTypes,
        topic: block.topic,
        service: block.service,
        industry: block.industry,
        ids: block.ids,
        limit: block.limit,
        draft,
      });

      return <section>{items.map((item) => <ContentCard key={item.id} page={item} />)}</section>;
    }
    case "form":
      return <LeadForm locale={locale} title={block.title} intro={block.intro} submitLabel={block.submitLabel ?? "Submit"} />;
    default:
      return null;
  }
}
```

Supported block families in this implementation include:

1. Hero
2. Rich text
3. HTML
4. Image
5. Video
6. Stats
7. Quote
8. Card grid
9. CTA
10. Featured content
11. Form

### Phase 4: Add a mock CMS provider

Before live Optimizely integration is ready, build a mock provider.

File:

- `src/lib/cms/mock-content.ts`

Why this exists:

1. The frontend can be built without waiting for CMS authors.
2. The renderer contract can be tested early.
3. Live CMS can be introduced later without rewriting UI components.

### Phase 5: Add the CMS integration layer

Main file:

- `src/lib/cms/index.ts`

This file is the integration boundary between the app and CMS providers.

Important behavior in this file:

1. It checks whether `CMS_PROVIDER=optimizely`.
2. It builds public Graph requests with `OPTIMIZELY_RENDER_KEY`.
3. It builds admin Graph requests with `OPTIMIZELY_GRAPH_APP_KEY` and `OPTIMIZELY_GRAPH_SECRET`.
4. It maps Optimizely content into internal `Page` and `Block` models.
5. It returns mock content as fallback where live content does not exist yet.

Representative code:

```ts
function isOptimizelyProviderEnabled() {
  return process.env.CMS_PROVIDER === "optimizely";
}

function getOptimizelyBasicAuthHeader() {
  const appKey = process.env.OPTIMIZELY_GRAPH_APP_KEY?.trim();
  const secret = process.env.OPTIMIZELY_GRAPH_SECRET?.trim();

  if (!appKey || !secret) {
    return null;
  }

  return `Basic ${Buffer.from(`${appKey}:${secret}`).toString("base64")}`;
}
```

Graph fetch behavior:

```ts
const response = await fetch(useAdminAuth ? baseUrl : `${baseUrl}?auth=${encodeURIComponent(renderKey!)}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(useAdminAuth ? { Authorization: basicAuthHeader! } : {}),
  },
  body: JSON.stringify({ query }),
  cache: options?.draft ? "no-store" : undefined,
  next: options?.draft
    ? undefined
    : {
        revalidate: 60,
        tags: options?.tags,
      },
});
```

This is the key split:

1. Published content uses the public render key.
2. Draft preview uses admin credentials.
3. Published content uses caching and tags.
4. Draft content uses `no-store`.

## 6. Exact environment variables used

The local `.env.local` setup is:

```env
CMS_PROVIDER=optimizely
SITE_URL=http://localhost:3000
PREVIEW_SECRET=local-preview-secret
REVALIDATE_SECRET=local-revalidate-secret

OPTIMIZELY_AUTHORING_URL=https://your-authoring-url/
OPTIMIZELY_RENDER_URL=https://cg.optimizely.com
OPTIMIZELY_RENDER_KEY=your-render-key
OPTIMIZELY_GRAPH_APP_KEY=your-graph-app-key
OPTIMIZELY_GRAPH_SECRET=your-graph-secret
OPTIMIZELY_CONTENT_CLIENT_ID=your-content-client-id
OPTIMIZELY_CONTENT_SECRET=your-content-secret
```

Production must use the same values in Vercel.

## 7. Route flow and page resolution

The main dynamic route is `src/app/[locale]/[[...slug]]/page.tsx`.

Representative logic:

```tsx
async function loadPage(routeParams: RouteParams) {
  if (!isLocale(routeParams.locale)) {
    return null;
  }

  const draft = await draftMode();

  return getPageBySlug({
    locale: routeParams.locale,
    slug: routeParams.slug ?? [],
    draft: draft.isEnabled,
  });
}
```

The page route does four important things:

1. Validates locale.
2. Checks whether preview mode is enabled.
3. Loads the page through the CMS abstraction layer.
4. Renders the page through `PageRenderer`.

Metadata is also generated from the normalized page model, not directly from CMS JSON.

## 8. Shared layout, header, footer, and preview banner

The locale layout is in `src/app/[locale]/layout.tsx`.

Representative code:

```tsx
const draft = await draftMode();
const navigation = await getNavigation(locale, draft.isEnabled);
const headerContent = await getSiteHeaderContent(locale, draft.isEnabled);
const footerContent = await getSiteFooterContent(locale, draft.isEnabled);

return (
  <div className="site-shell flex min-h-screen flex-col">
    {draft.isEnabled ? (
      <div>
        Preview mode is enabled. Draft content is currently visible.
      </div>
    ) : null}
    <SiteHeader locale={locale} navigation={navigation} content={headerContent} />
    {children}
    <SiteFooter locale={locale} content={footerContent} />
  </div>
);
```

This ensures:

1. Shared chrome is loaded centrally.
2. Preview state affects the full page shell.
3. Header and footer can also be CMS-driven.

## 9. Preview mode implementation

Preview enable route:

- `src/app/api/draft/route.ts`

Exact behavior:

```ts
export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug") ?? "/en";
  const previewSecret = process.env.PREVIEW_SECRET ?? "local-preview-secret";

  if (secret !== previewSecret) {
    return new Response("Invalid preview secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return Response.redirect(new URL(slug, request.url));
}
```

How to use it locally:

```text
/api/draft?secret=local-preview-secret&slug=/en
```

Disable preview:

```text
/api/draft/disable
```

## 10. Revalidation and webhook flow

Manual revalidation route:

- `src/app/api/revalidate/route.ts`

Representative code:

```ts
export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{
    secret: string;
    path: string;
    tags: string[];
  }>;

  if (body.secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid revalidation secret." }, { status: 401 });
  }

  const path = body.path?.trim() || "/en";
  const tags = Array.isArray(body.tags) ? body.tags.filter(Boolean) : [];
  const defaultTags = getOptimizelyRevalidationTags();

  revalidatePath(path);
  for (const tag of defaultTags) {
    revalidateTag(tag, { expire: 0 });
  }

  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, path, tags: [...defaultTags, ...tags] });
}
```

Sample request:

```json
{
  "secret": "local-revalidate-secret",
  "path": "/en"
}
```

This enables:

1. Manual page refresh by path.
2. Global tag invalidation for Optimizely-backed content.
3. Hooking CMS publish events into application cache refresh.

## 11. Health and diagnostics route

File:

- `src/app/api/optimizely/health/route.ts`

Exact implementation:

```ts
export async function GET() {
  const status = await getOptimizelyConnectionStatus();

  return NextResponse.json(status, {
    status: status.providerEnabled && status.publicReachable ? 200 : 503,
  });
}
```

This route checks whether:

1. The Optimizely provider is enabled.
2. Public credentials are configured.
3. Admin credentials are configured.
4. Public Graph access works.
5. Admin Graph access works.

Use this route first when content is not appearing.

## 12. Lead capture and local persistence

The app includes local lead storage.

Form component:

- `src/components/forms/lead-form.tsx`

Storage utility:

- `src/lib/leads.ts`

Representative save logic:

```ts
const leadsPath = path.join(process.cwd(), "data", "leads.json");

export async function saveLeadSubmission(submission: LeadSubmission) {
  await ensureStorage();
  const existing = await readFile(leadsPath, "utf8");
  const parsed = JSON.parse(existing) as LeadSubmission[];
  parsed.unshift(submission);
  await writeFile(leadsPath, JSON.stringify(parsed, null, 2), "utf8");
}
```

This keeps form submissions local and easy to inspect during development.

## 13. Step-by-step rebuild checklist

1. Create the Next.js app.
2. Add global layout and styles.
3. Add locale-based routing.
4. Define all internal CMS types first.
5. Build page and block renderers.
6. Add mock content.
7. Add the CMS abstraction layer.
8. Connect published Optimizely Graph content.
9. Map StartPage, CMSPage, Header, Footer, and reusable blocks.
10. Add draft preview mode with admin credentials.
11. Add the preview banner in the layout.
12. Add manual revalidation and webhook support.
13. Add the health route.
14. Add form handling and local lead persistence if needed.
15. Deploy to Vercel.
16. Copy all local environment variables into Vercel.
17. Re-test localhost, preview, revalidation, and production.

## 14. Local setup steps

1. Install dependencies.

```bash
npm install
```

2. Create `.env.local` with the required variables.

3. Start the application.

```bash
npm run dev
```

4. Open the app:

```text
http://localhost:3000/en
```

5. Check health:

```text
http://localhost:3000/api/optimizely/health
```

## 15. Production deployment steps

1. Deploy the app to Vercel.
2. Add the same CMS variables to the Vercel environment.
3. Redeploy after environment variables are added.
4. Verify the deployed homepage is using live Optimizely content.
5. Verify the deployed health route returns a healthy response.

## 16. Final verification checklist

1. `npm run build` passes.
2. Localhost loads `/en` successfully.
3. Localhost reads live Optimizely content.
4. Preview mode enables successfully.
5. The preview banner appears.
6. Unpublished content can be fetched in preview mode.
7. Manual revalidation works.
8. The webhook route is available.
9. The health route returns correct connectivity information.
10. Production uses the same CMS connection as local development.
11. Fallback content is only used where live authored content does not yet exist.


## 17. Core lesson from this build

The correct order is not to connect the CMS first.

The correct order is:

1. Build the app structure.
2. Define normalized internal models.
3. Build renderers.
4. Add mock content.
5. Connect the real CMS.
6. Add preview, cache refresh, and diagnostics.

That order keeps the frontend maintainable and prevents the project from being blocked by incomplete CMS content or unstable external response shapes.
