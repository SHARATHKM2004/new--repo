# Summit Advisory Group Practice Build

For a full mentor-ready handoff, implementation summary, rebuild instructions, demo script, and completion status, see `MENTOR_HANDOFF.md`.

This project is a local full-stack practice app for an Optimizely-style corporate marketing and insights platform. It ships with a mock CMS provider by default so you can build and validate the frontend architecture before wiring it to a real Optimizely environment.

## What is included

- localized routing with `en` and `es`
- CMS page rendering through a typed content registry
- service, industry, insight, author, case study, resource center, and contact pages
- preview mode hooks through `draftMode`
- publish/revalidation webhook endpoints
- lead-capture form persisted to a local JSON file
- mock content source with a clean abstraction point for a future Optimizely adapter

## Getting started

1. Install dependencies if they are not already present:

```bash
npm install
```

2. Create an env file:

```bash
copy .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`. The root route redirects to `/en`.

## Preview mode

Enable preview:

```text
/api/draft?secret=local-preview-secret&slug=/en
```

Disable preview:

```text
/api/draft/disable
```

The mock dataset contains draft content for the homepage so you can verify the banner and draft rendering path immediately.

When `CMS_PROVIDER=optimizely`, published content is fetched through the Optimizely single-key endpoint and preview requests use Optimizely Graph admin credentials (`OPTIMIZELY_GRAPH_APP_KEY` and `OPTIMIZELY_GRAPH_SECRET`) so unpublished changes can bypass the public-content restriction.

## Revalidation endpoint

Send a POST request to `/api/revalidate` with this JSON body:

```json
{
	"secret": "local-revalidate-secret",
	"path": "/en"
}
```

Optimizely Graph webhooks can call `/api/optimizely/webhook` using either the `x-webhook-secret` header or a `?secret=` query parameter set to `REVALIDATE_SECRET`. The route invalidates the shared Optimizely page and chrome tags and revalidates `/`, `/en`, and `/es`.

## Lead submissions

Lead form submissions are written to `data/leads.json` so the app remains fully local.

## Wiring a real Optimizely source

The `src/lib/cms` layer now supports both mock content and an Optimizely-backed provider.

- published public content uses `OPTIMIZELY_RENDER_URL` + `OPTIMIZELY_RENDER_KEY`
- preview/draft content uses `OPTIMIZELY_GRAPH_APP_KEY` + `OPTIMIZELY_GRAPH_SECRET`
- shared listings and related-content helpers now prefer live Optimizely pages first and only fall back to mock pages for content that has not been authored yet
- shared site chrome can be driven by Optimizely `Header` and `Footer` types when those items exist
- reusable Optimizely blocks such as `HeroBlock`, `ContactBlock`, `StoryBlock`, `ServicesBlock`, `TestimonialsBlock`, `PortfolioGridBlock`, and `ParagraphTextElement` are mapped into the local renderer model

If `Header` or `Footer` items do not exist in Optimizely yet, the app falls back to local defaults for those sections.

## Optimizely diagnostics

Use `/api/optimizely/health` to confirm whether the app can reach the Optimizely Graph endpoint with both public and admin credentials. The route returns `200` when the provider is enabled and the public endpoint is reachable, otherwise it returns `503` with a JSON status payload.
