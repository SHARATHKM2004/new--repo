# Project Setup and Deployment Documentation

End-to-end technical guide to clone, run, connect to Optimizely SaaS CMS, and deploy this project to Vercel.

---

## Step 1: Clone the GitHub Repository in VS Code

1. Open VS Code.
2. Open a new terminal.
3. Navigate to the folder where you want to keep the project.
4. Clone the repository.
   Command:
   ```powershell
   git clone https://github.com/SHARATHKM2004/project-cms.git
   ```
5. Open the cloned folder in VS Code.
   Command:
   ```powershell
   code project-cms
   ```
6. Verify the project root contains:
   - `package.json`
   - `next.config.ts`
   - `tsconfig.json`
   - `src/`
   - `public/`
7. Confirm the branch is `master`.
   Command:
   ```powershell
   git branch
   ```

---

## Step 2: Install Dependencies and Add `.env.local`

1. Open the cloned project in VS Code.
2. Open the integrated terminal.
3. Install all project dependencies.
   Command:
   ```powershell
   npm install
   ```
4. Wait for installation to complete with no errors.
5. Create the local environment file at the project root: `.env.local`.
6. Paste the provided environment values into this file.
   Required variables:
   - `CMS_PROVIDER`
   - `SITE_URL`
   - `PREVIEW_SECRET`
   - `REVALIDATE_SECRET`
   - `OPTIMIZELY_AUTHORING_URL`
   - `OPTIMIZELY_RENDER_URL`
   - `OPTIMIZELY_RENDER_KEY`
   - `OPTIMIZELY_GRAPH_APP_KEY`
   - `OPTIMIZELY_GRAPH_SECRET`
   - `OPTIMIZELY_CONTENT_CLIENT_ID`
   - `OPTIMIZELY_CONTENT_SECRET`
7. Save the file.
8. Confirm the file exists at the project root and is not committed to Git.

---

## Step 3: Run the Project Locally and Verify It Loads

1. Open the integrated terminal in VS Code at the project root.
2. Start the local development server.
   Command:
   ```powershell
   npm run dev
   ```
3. Wait until the terminal shows the local URL is ready.
4. Open the local site in a browser: `http://localhost:3000`.
5. Confirm the homepage loads without errors.
6. Verify locale-based routing works:
   - `http://localhost:3000/en`
   - `http://localhost:3000/en/services/digital-platform-strategy`
   - `http://localhost:3000/en/industries/healthcare-financial-resilience`
   - `http://localhost:3000/en/resource-center`
   - `http://localhost:3000/en/contact`
7. Verify the CMS connection by opening the health endpoint:
   - `http://localhost:3000/api/optimizely/health`

   Expected response keys:
   - `providerEnabled`
   - `publicConfigured`
   - `adminConfigured`
   - `publicReachable`
   - `adminReachable`
8. Stop the dev server when finished: `Ctrl + C`.

---

## Step 4: Understand the Project Structure

1. Main folders:
   - `src/app`
   - `src/components`
   - `src/lib`
   - `public`
2. Routing layer is inside `src/app`.
   Key files:
   - `src/app/layout.tsx`
   - `src/app/page.tsx`
   - `src/app/[locale]/layout.tsx`
   - `src/app/[locale]/[[...slug]]/page.tsx`
3. API endpoints are inside `src/app/api`. Used for:
   - draft/preview mode
   - revalidation
   - webhook
   - health check
   - lead handling
4. Shared site components are inside `src/components/site`. Used for:
   - site header
   - site footer
5. CMS rendering components are inside `src/components/cms`. Used for:
   - page renderer
   - block renderer
6. CMS integration layer is inside `src/lib/cms`.
   Key files:
   - `src/lib/cms/index.ts`
   - `src/lib/cms/types.ts`
   - `src/lib/cms/mock-content.ts`
7. Responsibility rule:
   - Routing layer: handles URL and locale
   - CMS layer: fetches and normalizes data
   - Components layer: renders normalized data
   - No raw CMS shapes outside `src/lib/cms`

---

## Step 5: Set Up the Optimizely SaaS CMS Environment

1. Open the Optimizely SaaS CMS authoring URL in a browser.
   Example: `https://app-wipf02saastp45ent002.cms.optimizely.com/`
2. Sign in with the provided Optimizely account.
3. Select the correct Optimizely environment (Trial/Test environment used for development and demo).
4. Confirm access to:
   - Content tree
   - Content types
   - Settings
   - Import/Export
   - Graph configuration
5. Confirm the Optimizely Graph endpoint matches `.env.local`:
   - `OPTIMIZELY_RENDER_URL=https://cg.optimizely.com`
6. Confirm the Graph access keys match `.env.local`:
   - `OPTIMIZELY_RENDER_KEY`
   - `OPTIMIZELY_GRAPH_APP_KEY`
   - `OPTIMIZELY_GRAPH_SECRET`
7. Confirm enabled languages include `en`.
8. Confirm the content tree shows existing top-level entries (if already authored):
   - Start Page
   - Header
   - Footer
   - Services
   - Industries
   - Resource Center / Insights
   - Case Studies
9. Do not create new content types or content items in this step. They are covered in Step 6 and Step 7.

---

## Step 6: Create the Required Content Types in Optimizely

Content types are the schemas the CMS uses. The site needs four page-level types plus reusable block types referenced inside pages.

### 6.1 Open the Content Types area

1. In Optimizely CMS, open **Settings** → **Content Types**.
2. Use **+ Create** to add each content type listed below.
3. Match the **type key** exactly (case sensitive). The Graph queries depend on these names.

### 6.2 Create the page-level content types

| Type Key | Purpose |
|---|---|
| `StartPage` | Home page (one per locale) |
| `CMSPage` | All inner pages (Service, Industry, Insight, Author, Contact, Resource Center) |
| `Header` | Global site header (one per locale) |
| `Footer` | Global site footer (one per locale) |

### 6.3 Add fields to `StartPage`

1. `title` — String
2. `shortDescription` — String (long)
3. `keywords` — String
4. `blocks` — Content Area (accepts block content types from 6.7)

### 6.4 Add fields to `CMSPage`

1. `title` — String
2. `shortDescription` — String (long)
3. `keywords` — String
4. `pageType` — String (values: `service`, `industry`, `insight`, `author`, `contact`, `resource-center`)
5. `eyebrow` — String
6. `outcomes` — String list
7. `audience` — String list
8. `featuredTopics` — String list
9. `authorId` — String
10. `publishedAt` — DateTime
11. `readTime` — String
12. `topics` — String list
13. `relatedServiceIds` — String list
14. `relatedIndustryIds` — String list
15. `cardImageUrl` — URL
16. `cardImageAlt` — String
17. `role` — String
18. `expertise` — String list
19. `avatarSrc` — URL
20. `offices` — JSON / list of objects (`city`, `phone`, `focus`)
21. `blocks` — Content Area

### 6.5 Add fields to `Header`

1. `logo` — String / URL
2. `tagline` — String
3. `localeSwitcherLabel` — String
4. `ctaText` — String
5. `ctaHref` — URL
6. `navItems` — JSON / list of objects (`label`, `href`)

### 6.6 Add fields to `Footer`

1. `eyebrow` — String
2. `title` — String
3. `body` — Rich Text
4. `copyrightText` — String
5. `columns` — JSON / list of objects (`title`, `links[{label, href}]`)
6. `socialLinks` — JSON / list of objects (`platform`, `href`)

### 6.7 Create the reusable block content types

These are placed inside the `blocks` content area of `StartPage` and `CMSPage`.

| Block Type Key | Main Fields |
|---|---|
| `HeroBlock` | `title`, `subtitle`, `description`, `showDecoration`, `decorationColorsPrimary`, `decorationColorsSecondary`, `ctaText`, `ctaHref` |
| `ServicesBlock` | `title`, `subtitle`, `services[{title, description, icon, href}]` |
| `IndustriesBlock` | `title`, `subtitle`, `items[{title, description, imageUrl, link}]` |
| `LogosBlock` | `title`, `logos[{src, alt}]` |
| `TestimonialsBlock` | `title`, `testimonials[{fullName, position, content, avatarSrc}]` |
| `StoryBlock` | `title`, `story`, `highlights` (string list) |
| `RichTextBlock` | `paragraph_text` (Rich Text) |
| `ImageBlock` | `image{url, alt}` or `imageUrl`, `altText`, `caption` |
| `VideoBlock` | `videoUrl`, `embedUrl`, `posterImageUrl`, `caption` |
| `TeamBlock` | `title`, `items[{fullName, position, imageSrc, bio}]` |

### 6.8 Publish all content types

1. Save each content type.
2. Confirm they appear in the content type list.
3. Confirm each one is enabled for the `en` language.

---

## Step 7: Create the Required Content Items in Optimizely

Content items are the actual records the site reads from Optimizely Graph. Create one per row below. Each must be **published** in the `en` language.

### 7.1 Create global content (Header and Footer)

1. **Header** (type `Header`)
   - `logo`: brand logo URL or text
   - `tagline`: short tagline
   - `localeSwitcherLabel`: e.g. `Language`
   - `ctaText`: e.g. `Contact us`
   - `ctaHref`: e.g. `/en/contact`
   - `navItems`: entries for `Services`, `Industries`, `Insights`, `Resource Center`, `About`, `Contact`
2. **Footer** (type `Footer`)
   - `eyebrow`: short label
   - `title`: footer headline
   - `body`: rich text paragraph
   - `copyrightText`: e.g. `© 2026 Company`
   - `columns`: 3–4 columns each with `title` and `links[{label, href}]`
   - `socialLinks`: entries with `platform` and `href`

### 7.2 Create the Start Page (Home)

1. Create **one** `StartPage` item.
2. Required fields: `title`, `shortDescription`, `keywords`.
3. In `blocks`, add: `HeroBlock`, `ServicesBlock`, `IndustriesBlock`, `LogosBlock`, `TestimonialsBlock`.
4. Publish in `en`.

### 7.3 Create the Service pages (`CMSPage` with `pageType=service`)

1. `services/digital-platform-strategy`
2. `services/composable-architecture`
3. `services/experience-design-and-content`
4. `services/data-and-personalization`
5. `services/managed-cloud-operations`

Add `blocks`: `HeroBlock`, `RichTextBlock`, `ServicesBlock` (offerings), `TestimonialsBlock`.

### 7.4 Create the Industry pages (`CMSPage` with `pageType=industry`)

1. `industries/healthcare-financial-resilience`
2. `industries/financial-services`
3. `industries/manufacturing`
4. `industries/energy-and-utilities`
5. `industries/private-equity`

Add `blocks`: `HeroBlock`, `StoryBlock`, `RichTextBlock`, `ServicesBlock`.

### 7.5 Create the Resource Center page (`CMSPage` with `pageType=resource-center`)

1. Slug: `resource-center`
2. Fields: `title`, `shortDescription`, `keywords`.
3. Blocks: `HeroBlock`, `RichTextBlock`.

### 7.6 Create the Insight pages (`CMSPage` with `pageType=insight`)

Each needs `publishedAt`, `readTime`, `topics`, `cardImageUrl`, `cardImageAlt`, `authorId`, `relatedServiceIds`, `relatedIndustryIds`.

1. `insights/why-speed-is-the-missing-link-in-automotive-smart-factory-roi`
2. `insights/cfos-if-your-bank-is-approaching-1-billion-in-assets-you-cant-keep-putting-off-fdicia`
3. `insights/stablecoins-represent-a-growing-but-potentially-risky-part-of-the-financial-system-what-do-fintech-leaders-need-to-know`
4. `insights/why-middle-market-manufacturers-are-redesigning-plant-analytics-now`
5. `insights/what-healthcare-boards-expect-from-ai-risk-governance-in-2026`
6. `insights/the-new-operating-model-for-commercial-banking-controls-modernization`
7. `insights/how-private-equity-portfolio-teams-are-using-data-rooms-after-close`
8. `insights/what-energy-suppliers-gain-from-a-digital-self-service-reset`
9. `insights/a-practical-roadmap-for-wealth-firms-modernizing-compliance-workflows`
10. `insights/why-insurers-are-rethinking-claims-content-for-digital-first-customers`
11. `insights/how-logistics-operators-are-sequencing-automation-without-service-disruption`
12. `insights/three-metrics-that-make-treasury-transformation-programs-believable`
13. `insights/how-advisory-firms-can-turn-thought-leadership-into-pipeline-signals`
14. `insights/what-enterprise-buyers-expect-from-b2b-service-microsites-now`
15. `insights/a-cfo-guide-to-governance-before-a-finance-platform-migration`
16. `insights/what-health-systems-learn-when-patient-access-orchestration-finally-gets-measured`

Blocks: `HeroBlock`, `RichTextBlock`, `ImageBlock` or `VideoBlock`.

### 7.7 Create the Author pages (`CMSPage` with `pageType=author`)

Each needs `role`, `expertise`, `avatarSrc`, `offices`.

1. `authors/bryan-powrozek`
2. `authors/nick-g-ansley`
3. `authors/mary-beth-marchione`
4. `authors/alicia-roberts`
5. `authors/devon-cho`

### 7.8 Create the Contact page (`CMSPage` with `pageType=contact`)

1. Slug: `contact`
2. Fields: `title`, `shortDescription`, `offices`.
3. Blocks: `HeroBlock`, `RichTextBlock`.

### 7.9 Publish everything

1. Publish every item in the `en` language.
2. Confirm each item shows status **Published**.
3. Confirm slugs in the content tree match the slugs above exactly.

---

## Step 8: Verify CMS Content Loads on the Local Site

1. Start the dev server.
   Command:
   ```powershell
   npm run dev
   ```
2. Open the health endpoint to confirm Optimizely Graph is reachable:
   - `http://localhost:3000/api/optimizely/health`

   Expected:
   ```json
   {
     "providerEnabled": true,
     "publicConfigured": true,
     "adminConfigured": true,
     "publicReachable": true,
     "adminReachable": true
   }
   ```
3. Open the home page and confirm Optimizely content renders:
   - `http://localhost:3000/en`

   Verify:
   - Header logo, nav links and CTA come from the `Header` item
   - Footer columns, body and social links come from the `Footer` item
   - Home page blocks come from the `StartPage` item
4. Open one Service page:
   - `http://localhost:3000/en/services/digital-platform-strategy`
5. Open one Industry page:
   - `http://localhost:3000/en/industries/healthcare-financial-resilience`
6. Open one Insight page and confirm metadata renders:
   - `http://localhost:3000/en/insights/why-speed-is-the-missing-link-in-automotive-smart-factory-roi`
7. Open the Resource Center page:
   - `http://localhost:3000/en/resource-center`
8. Open the Contact page:
   - `http://localhost:3000/en/contact`
9. Confirm no errors are logged in the terminal or browser console.
10. If a page falls back to mock content, check:
    - The matching CMS item is **Published**
    - The slug matches exactly
    - `pageType` is set correctly
    - Language is set to `en`

---

## Step 9: Deploy to Vercel

1. Sign in to Vercel and open the dashboard.
2. Create a new project.
   - **Add New** → **Project**
   - Select the imported GitHub repository
   - Framework preset: **Next.js**
   - Root directory: repository root
3. Add the environment variables in project settings before the first build.
   Path: **Project** → **Settings** → **Environment Variables**.
   Variables (paste the same values as `.env.local`):
   - `CMS_PROVIDER`
   - `SITE_URL` (set to the Vercel production URL)
   - `PREVIEW_SECRET`
   - `REVALIDATE_SECRET`
   - `OPTIMIZELY_AUTHORING_URL`
   - `OPTIMIZELY_RENDER_URL`
   - `OPTIMIZELY_RENDER_KEY`
   - `OPTIMIZELY_GRAPH_APP_KEY`
   - `OPTIMIZELY_GRAPH_SECRET`
   - `OPTIMIZELY_CONTENT_CLIENT_ID`
   - `OPTIMIZELY_CONTENT_SECRET`

   Apply each variable to **Production**, **Preview**, and **Development**.
4. Trigger the first deploy.
   - Click **Deploy** on the project import screen, or
   - Push any commit to the `master` branch
5. Wait for the build to complete.
   - Build log shows no errors
   - Deployment status is **Ready**
6. Confirm the production URL is assigned (example: `https://project-coral-eight.vercel.app`).
7. Verify the deployed health endpoint:
   - `https://<your-vercel-domain>/api/optimizely/health`
   Expected:
   - `providerEnabled: true`
   - `publicReachable: true`
   - `adminReachable: true`
8. Confirm auto-deploy:
   - Push to `master` → Production deploy
   - Push to other branches / PRs → Preview deploy
9. (Optional) Add a custom domain via **Project** → **Settings** → **Domains** → **Add**.

---

## Step 10: Validate the Deployed Site, Preview Mode, and Revalidation

Replace `<DOMAIN>` with your deployed Vercel domain.

### 10.1 Validate all main routes

1. `https://<DOMAIN>/en`
2. `https://<DOMAIN>/en/services/digital-platform-strategy`
3. `https://<DOMAIN>/en/industries/healthcare-financial-resilience`
4. `https://<DOMAIN>/en/resource-center`
5. `https://<DOMAIN>/en/contact`
6. `https://<DOMAIN>/en/insights/why-speed-is-the-missing-link-in-automotive-smart-factory-roi`
7. `https://<DOMAIN>/en/authors/bryan-powrozek`

### 10.2 Validate the health endpoint

- `https://<DOMAIN>/api/optimizely/health`

Confirm:
- `providerEnabled: true`
- `publicReachable: true`
- `adminReachable: true`

### 10.3 Validate preview (draft) mode

1. From Optimizely CMS, use the **Preview** button on any draft content, or open:
   - `https://<DOMAIN>/api/draft?secret=<PREVIEW_SECRET>&slug=/en`
2. Confirm draft content renders.
3. Disable preview mode:
   - `https://<DOMAIN>/api/draft/disable`

### 10.4 Validate on-demand revalidation

1. Trigger revalidation manually:
   - `https://<DOMAIN>/api/revalidate?secret=<REVALIDATE_SECRET>&path=/en`
2. Confirm response is `{ "revalidated": true }`.
3. Update a field in Optimizely, publish, reload the page, confirm the change appears.

### 10.5 Validate the Optimizely webhook

1. In Optimizely, configure a webhook pointing to:
   - `https://<DOMAIN>/api/optimizely/webhook`
2. Publish a content change.
3. Confirm the page on the deployed site updates automatically.

### 10.6 Validate the leads endpoint

1. Submit the contact form at `https://<DOMAIN>/en/contact`.
2. Confirm the request to `/api/leads` succeeds.

### 10.7 Validate auto-deploy

1. Push a small change to `master`.
2. Confirm Vercel automatically builds and deploys.
3. Confirm the change is live on the production URL.

### 10.8 Final checks

1. No 500 errors in the Vercel **Logs** tab.
2. No console errors in browser DevTools.
3. Header and footer populated from CMS (not fallback).
4. Insight and Service pages list correctly on the home page and Resource Center.
