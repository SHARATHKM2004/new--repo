# IAS Setup Guide

## Purpose

This document explains the complete end-to-end setup, implementation flow, and verification process for the CMS-driven website built in this project.

This guide is written for beginners to Optimizely CMS.

The intended readers are:

1. Gijo, as mentor
2. Vaishali, as teammate
3. Any new developer or content author joining the project later

The goal of this guide is simple:

1. Explain what we started with
2. Explain what we built
3. Explain why each part was needed
4. Explain how to recreate the same setup from scratch
5. Explain how to verify each step without confusion

If someone follows this guide carefully, they should be able to reproduce the same working setup without needing extra clarification.

---

## 1. Original Goal

We started with an empty workspace and the goal of building a real CMS-driven company website where:

1. Developers control the frontend in code using VS Code
2. Content authors control the content in Optimizely CMS
3. The same content workflow works in local development and in deployment
4. CMS changes appear on localhost and on the deployed site
5. The site supports reusable page types and reusable content blocks

Later, the scope expanded into a more realistic production-style implementation.

The final practical goal became:

1. Build a real Next.js application
2. Connect it to Optimizely SaaS CMS and Optimizely Graph
3. Support published content and draft preview
4. Support deployment to Vercel
5. Support shared header/footer content from CMS
6. Support CMS-driven service pages, industry pages, and article-style pages
7. Support article pages containing text, images, and videos from CMS

---

## 2. Final Outcome

At the current stopping point, the project already supports the following:

1. A deployed Next.js website connected to Optimizely CMS
2. CMS-driven header content
3. CMS-driven footer content
4. A CMS-driven service page at `/en/services/digital-platform-strategy`
5. CMS-driven related cards on that service page
6. A CMS-driven industry page at `/en/industries/healthcare-financial-resilience`
7. Separate article/detail pages opened from service-page Explore links
8. One real CMS-driven case-study page with text and image content
9. Frontend support for CMS-driven image blocks and video blocks

Production URL:

`https://project-coral-eight.vercel.app`

GitHub repository used during this work:

`https://github.com/SHARATHKM2004/project-cms.git`

---

## 3. Technology Stack

This project uses:

1. Next.js 16 App Router
2. React 19
3. TypeScript 5
4. Tailwind CSS v4
5. Optimizely SaaS CMS
6. Optimizely Graph
7. Vercel deployment
8. Local JSON persistence for form submissions

---

## 4. Important Architecture Idea

The app does not render raw Optimizely responses directly in page components.

Instead, the flow is:

1. Fetch content from Optimizely Graph
2. Normalize it into internal app models
3. Render those normalized page and block models with React components

This is important because:

1. Frontend code stays stable
2. CMS response shape changes are easier to manage
3. Both mock content and live CMS content can use the same renderer

---

## 5. Key Project Files

### Frontend rendering

1. `src/components/site/site-header.tsx`
2. `src/components/site/site-footer.tsx`
3. `src/components/cms/page-renderer.tsx`
4. `src/components/cms/block-renderer.tsx`

### CMS integration

1. `src/lib/cms/index.ts`
2. `src/lib/cms/types.ts`
3. `src/lib/cms/mock-content.ts`

### App routes and APIs

1. `src/app/[locale]/[[...slug]]/page.tsx`
2. `src/app/[locale]/layout.tsx`
3. `src/app/api/draft/route.ts`
4. `src/app/api/draft/disable/route.ts`
5. `src/app/api/revalidate/route.ts`
6. `src/app/api/optimizely/webhook/route.ts`
7. `src/app/api/optimizely/health/route.ts`

### Other important files

1. `README.md`
2. `MENTOR_HANDOFF.md`
3. `MENTOR_MEETING_SCRIPT.md`
4. `.env.local`
5. `data/leads.json`

---

## 6. Local Environment Setup

### Step 1: install dependencies

Run:

```bash
npm install
```

### Step 2: create `.env.local`

Use the following environment variables:

```env
CMS_PROVIDER=optimizely
SITE_URL=http://localhost:3000
PREVIEW_SECRET=local-preview-secret
REVALIDATE_SECRET=local-revalidate-secret
OPTIMIZELY_AUTHORING_URL=https://your-authoring-url/
OPTIMIZELY_RENDER_URL=https://cg.optimizely.com
OPTIMIZELY_RENDER_KEY=your-render-key
OPTIMIZELY_GRAPH_APP_KEY=your-admin-graph-app-key
OPTIMIZELY_GRAPH_SECRET=your-admin-graph-secret
OPTIMIZELY_CONTENT_CLIENT_ID=optional
OPTIMIZELY_CONTENT_SECRET=optional
```

### Step 3: start the app

Run:

```bash
npm run dev
```

### Step 4: open the site

Open:

`http://localhost:3000/en`

### Step 5: verify CMS connectivity

Open:

`http://localhost:3000/api/optimizely/health`

Expected healthy result:

```json
{
  "providerEnabled": true,
  "publicConfigured": true,
  "adminConfigured": true,
  "publicReachable": true,
  "adminReachable": true
}
```

If this route is not healthy, the app cannot read Optimizely correctly.

---

## 7. Deployment Setup

The app was deployed to Vercel.

### Required Vercel environment variables

The same key values from `.env.local` must also exist in Vercel.

If localhost works but production does not, the most common reason is missing Vercel environment variables.

### Important note for this environment

In this Windows environment, deployment commands required:

```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
```

This was needed because of certificate or corporate TLS interception issues in the local machine environment.

---

## 8. How the Content Model Works in Practice

The project uses a combination of page-level content and block-level content.

### Pages

The most important page type used in this implementation is:

1. `CMS Page`

This page type is used for:

1. service detail pages
2. industry pages
3. case-study pages
4. article-style detail pages

### Shared CMS pages/items

These were also used:

1. `Header`
2. `Footer`
3. `StartPage`

### Reusable blocks used in the project

Examples already supported and used:

1. `Hero Block`
2. `Paragraph of text`
3. `Story Block`
4. `Services Block`
5. `Service Item`
6. `Contact Block`

### New blocks added for richer article pages

Frontend support was added for:

1. `Image Block`
2. `Video Block`

---

## 9. Page Tree Created in Optimizely

The content tree that was built during the work looks like this logically:

1. `Root`
2. `StartPage`
3. `Header`
4. `Footer`
5. `Services`
6. `Digital Platform Strategy`
7. `Industries`
8. `Healthcare financial resilience`
9. `Case Studies`
10. `Case Healthcare operations modernization`

This structure matters because route matching depends on where the page sits in the tree.

Examples:

1. A page under `Services` becomes `/services/...`
2. A page under `Industries` becomes `/industries/...`
3. A page under `Case Studies` becomes `/case-studies/...`

---

## 10. Routes That Were Built and Verified

### Shared site

1. `/en`
2. `/es`

### Services

1. `/en/services/digital-platform-strategy`

### Industries

1. `/en/industries/healthcare-financial-resilience`

### Case study/article pages

1. `/en/case-studies/case-healthcare-operations-modernization`
2. `/en/insights/modern-finance-transformation`
3. `/en/insights/data-strategy-for-growth`

Initially, the three detail routes were placeholders. Then one of them was converted into a real CMS-authored page.

---

## 11. Exact Chronological Build Journey

This section captures the actual implementation journey from start to current state.

### Phase 1: create the app foundation

We started with an empty workspace and created a Next.js full-stack app.

What was done:

1. scaffolded the project
2. added App Router
3. added TypeScript and Tailwind
4. added locale-aware routing
5. built shared header, footer, and content rendering system

### Phase 2: build mock CMS support first

Before full live integration, a mock CMS layer was added.

What was done:

1. created normalized page and block types
2. created mock content for service, industry, insight, author, case study, resource center, and contact pages
3. built a renderer that could work from those internal types

This was important because frontend development could continue before all live CMS content existed.

### Phase 3: connect to live Optimizely

The app was then connected to Optimizely Graph.

What was done:

1. added published-content fetching using render URL and render key
2. added draft/admin fetching using app key and secret
3. mapped live `StartPage` and `CMSPage`
4. mapped reusable Optimizely blocks into app block types
5. added header/footer CMS support

### Phase 4: add preview and publish flow

What was done:

1. added `/api/draft`
2. added `/api/draft/disable`
3. added preview banner support
4. added `/api/revalidate`
5. added `/api/optimizely/webhook`
6. added Optimizely revalidation tags

### Phase 5: deploy and fix production

What was done:

1. deployed to Vercel
2. noticed production was not reading live CMS
3. added missing Vercel environment variables
4. redeployed
5. verified the live health endpoint

### Phase 6: make shared site chrome CMS-driven

What was done:

1. added support for CMS-driven header title, nav, CTA, and locale switch label
2. added support for CMS-driven footer content, columns, and links
3. verified content changes on the deployed site

### Phase 7: make service pages CMS-driven

What was done:

1. patched CMS page-type inference so Optimizely `CMSPage` items could behave as service pages
2. created `Services` parent page in Optimizely
3. created `Digital Platform Strategy` child page
4. verified title, summary, and body paragraph from CMS

### Phase 8: move service related content into CMS

What was done:

1. removed reliance on the old hardcoded service related-content fallback when CMS-authored card blocks exist
2. authored a `Services Block` with three cards in Optimizely
3. verified those 3 cards on the deployed service page

### Phase 9: make industry page CMS-driven

What was done:

1. created `Industries` parent page
2. created `Healthcare financial resilience` child page
3. made sure it lived under the correct parent so route became `/industries/...`
4. authored CMS blocks for the industry page
5. verified it on the deployed site

### Phase 10: create separate article/detail pages from Explore links

What was done:

1. the service-page card `Explore` links were made to open separate routes
2. placeholder routes were created for those pages in the frontend
3. then a real `Case Studies` parent page and `Case Healthcare operations modernization` child page were created in Optimizely
4. that case-study route was then taken over by CMS

### Phase 11: add CMS image and video support

What was done:

1. frontend support for `Image Block` was implemented
2. frontend support for `Video Block` was implemented
3. `Image Block` content type was created in Optimizely
4. a case-study image was authored and verified live
5. `Video Block` support is ready in the frontend and can be used once the content type is authored in Optimizely

---

## 12. Exact Optimizely Content Types Used or Added

### Existing content types that were reused

These were already available in the Optimizely environment and were reused:

1. `CMS Page`
2. `Header`
3. `Footer`
4. `StartPage`
5. `Hero Block`
6. `Paragraph of text`
7. `Services Block`
8. `Service Item`
9. `Story Block`
10. `Contact Block`

### New content types added during the richer article work

#### `Image Block`

This block was created to support CMS-authored images inside article/detail pages.

Required properties:

1. `title` as text string
2. `imageUrl` as text string
3. `altText` as text string
4. `caption` as long text

These property names matter. The frontend was written to read these exact names.

#### `Video Block`

This block should be created to support CMS-authored videos inside article/detail pages.

Required properties:

1. `title` as text string
2. `embedUrl` as text string
3. `videoUrl` as text string
4. `caption` as long text
5. `posterImageUrl` as text string

These names also matter because the frontend is already prepared to read them.

---

## 13. How to Rebuild the Exact Same Setup

This is the practical rebuild section.

### Step 1: clone or open the project

1. Open the project in VS Code
2. Install dependencies with `npm install`
3. Configure `.env.local`
4. Run `npm run dev`

### Step 2: verify Optimizely connectivity locally

1. open `/api/optimizely/health`
2. confirm public and admin connectivity are true

### Step 3: set up shared CMS chrome

Create or populate:

1. `Header`
2. `Footer`

Verify on the deployed site that header/footer text changes are reflected.

### Step 4: create the service page

In Optimizely:

1. create parent page `Services`
2. under it, create `Digital Platform Strategy`
3. use `CMS Page`
4. set title and short description
5. add body content using `Paragraph of text`

Verify on:

`/en/services/digital-platform-strategy`

### Step 5: create service related cards from CMS

On the service page:

1. add a `Services Block`
2. inside it, add three `Service Item` entries
3. use labels like case study and insight in the icon field

Verify the 3 cards appear on the deployed page.

### Step 6: create the industry page

In Optimizely:

1. create parent page `Industries`
2. under it, create `Healthcare financial resilience`
3. make sure it is not under `Services`
4. use `CMS Page`
5. add the required top content and supporting blocks

Verify on:

`/en/industries/healthcare-financial-resilience`

### Step 7: create the article/detail route parent

In Optimizely:

1. create parent page `Case Studies`
2. use `CMS Page`

### Step 8: create the first real article/detail page

Under `Case Studies`:

1. create `Case Healthcare operations modernization`
2. use `CMS Page`
3. confirm its slug becomes `case-healthcare-operations-modernization`

Verify route:

`/en/case-studies/case-healthcare-operations-modernization`

### Step 9: add basic article content

On the case-study page:

1. fill title
2. fill short description
3. fill keywords
4. add a `Paragraph of text` block

Verify the page shows CMS-authored text.

### Step 10: add the image block type

Create `Image Block` with the exact properties described above.

### Step 11: add an image on the case-study page

On the case-study page:

1. add an `Image Block`
2. fill `title`
3. fill `imageUrl`
4. fill `altText`
5. fill `caption`

Verify the image appears live.

### Step 12: add the video block type

Create `Video Block` with the exact properties described above.

### Step 13: add a video on the case-study page

On the case-study page:

1. add a `Video Block`
2. fill `title`
3. use `embedUrl` for an embedded player such as YouTube or Vimeo
4. or use `videoUrl` for a direct mp4/webm file
5. optionally use `posterImageUrl`

### Step 14: repeat the same pattern for the other two detail pages

Repeat for:

1. `/en/insights/modern-finance-transformation`
2. `/en/insights/data-strategy-for-growth`

### Step 15: confirm the final workflow

At the end, the complete workflow should be:

1. update frontend in code when layout or renderer behavior changes are needed
2. update content in CMS when page content, media, or article structure changes are needed
3. verify changes locally and on the deployed site

---

## 14. Exact Example Content Used During the Build

### Service page

Title:

`Digital platform strategy from CMS`

Summary:

`This service page is now coming from Optimizely CMS.`

Paragraph:

`This paragraph is coming from Optimizely CMS for the service page test.`

### Industry page

Title:

`Healthcare financial resilience`

Summary:

`Help provider organizations respond to margin pressure, digital expectations, and workforce constraints.`

### Case-study page

Title:

`Case Healthcare operations modernization`

Summary:

`How we helped a healthcare client simplify reporting, reduce manual work, and improve decision-making.`

Paragraph text example:

`Healthcare organizations often struggle with fragmented publishing workflows, duplicate reporting, and slow content updates. This case study page will be authored fully from Optimizely CMS and will later include supporting media and richer article sections.`

Image block example:

1. `title`: `Operations dashboard rollout`
2. `imageUrl`: a public image URL
3. `altText`: `Healthcare operations dashboard`
4. `caption`: `A sample image for the case study page.`

Video block example:

1. `title`: `Case study walkthrough`
2. `embedUrl`: `https://www.youtube.com/embed/dQw4w9WgXcQ`
3. `videoUrl`: leave empty if using embed
4. `caption`: `A sample embedded video for the case study page.`
5. `posterImageUrl`: optional

---

## 15. Verification Checklist

Use this checklist after setup.

### Project and CMS connectivity

1. `npm install` works
2. `npm run dev` works
3. `/api/optimizely/health` returns healthy values

### Shared site chrome

1. header content changes in CMS appear in the app
2. footer content changes in CMS appear in the app

### Service page

1. `/en/services/digital-platform-strategy` loads
2. title and summary come from CMS
3. related-content cards come from CMS-authored block content

### Industry page

1. `/en/industries/healthcare-financial-resilience` loads
2. industry hero comes from CMS
3. lower content blocks come from CMS-authored blocks

### Case-study page

1. `/en/case-studies/case-healthcare-operations-modernization` loads
2. hero title comes from CMS
3. paragraph text comes from CMS
4. image appears from CMS
5. video appears from CMS after `Video Block` is created and used

### Deployment

1. deployed site shows the same content as localhost for published content
2. Vercel environment variables match local requirements

---

## 16. Troubleshooting Guide

### Problem: localhost works but production does not

Most likely reason:

1. Vercel is missing one or more environment variables

What to check:

1. `CMS_PROVIDER`
2. `OPTIMIZELY_RENDER_URL`
3. `OPTIMIZELY_RENDER_KEY`
4. `OPTIMIZELY_GRAPH_APP_KEY`
5. `OPTIMIZELY_GRAPH_SECRET`
6. `PREVIEW_SECRET`
7. `REVALIDATE_SECRET`

### Problem: a page still shows mock content

Most likely reasons:

1. the real Optimizely page for that route does not exist yet
2. the page exists under the wrong parent in the content tree
3. the slug does not match the expected route

Example:

If an industry page is mistakenly placed under `Services`, the route becomes wrong.

### Problem: a block type does not appear in the page block picker

Most likely reasons:

1. the block type was not created as a block content type
2. properties were configured incorrectly
3. block type permissions or content type setup are incomplete

### Problem: the service Explore links open a page, but it is empty

That is expected until a real CMS-authored page replaces the placeholder.

### Problem: image or video does not render

Check:

1. property names match exactly
2. `imageUrl`, `embedUrl`, `videoUrl`, `posterImageUrl` are filled correctly
3. the page is published
4. the media URL is public and accessible

### Problem: CMS page changes do not show immediately in deployment

Check:

1. page is published, not only autosaved
2. webhook or revalidation path is working
3. deployed health endpoint is healthy

---

## 17. Clear Responsibility Split

### What developers control in code

Developers should change:

1. layout
2. styling
3. rendering logic
4. route behavior
5. content mapping logic
6. preview, deployment, and API behavior

### What editors control in Optimizely

Editors should change:

1. page titles
2. summaries
3. body text
4. cards and section content
5. images
6. videos
7. CTA labels and content copy

This separation was one of the core goals of the project.

---

## 18. What Is Complete Today

The following platform work is already complete:

1. Next.js application foundation
2. locale-aware routing
3. typed CMS abstraction
4. mock content provider
5. live Optimizely Graph integration
6. preview infrastructure
7. revalidation infrastructure
8. Optimizely webhook support
9. Vercel deployment
10. production health diagnostics
11. CMS-driven header and footer support
12. CMS-driven service page support
13. CMS-driven industry page support
14. separate detail-page routing from service cards
15. CMS-driven text and image support for article/detail pages
16. frontend support for CMS-driven video blocks

---

## 19. What Still Remains

The remaining work is mostly content completion, not platform foundation.

Remaining work includes:

1. finish `Video Block` creation in Optimizely if not already completed
2. add a real video to the case-study page
3. convert the other two placeholder detail pages into real CMS pages
4. continue moving more insight and contact content fully into CMS where needed

---

## 20. Recommended Beginner Workflow Going Forward

If a beginner needs to build more pages after reading this guide, the safest workflow is:

1. create the parent page in the correct tree location
2. create the child `CMS Page`
3. fill title and short description
4. add one text block first
5. publish and verify the route works
6. then add image block
7. publish and verify again
8. then add video block
9. publish and verify again

This order reduces confusion because route problems are solved before media problems.

---

## 21. Final Summary

This project successfully proved the full intended workflow:

1. frontend developers can build and control UI locally in code
2. content authors can manage page content in Optimizely CMS
3. shared site content can be controlled through CMS
4. service and industry pages can be CMS-driven
5. detail/article pages can be CMS-driven
6. text, images, and videos can be rendered from CMS
7. localhost and deployment can both reflect live CMS content

In simple words, we started from an empty workspace and ended with a real working CMS-integrated website where code owns the experience and Optimizely owns the content.