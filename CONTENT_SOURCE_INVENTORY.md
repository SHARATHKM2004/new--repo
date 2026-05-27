# Content Source Inventory — Where Every String Lives

This file is the ground truth for "what is editable in Optimizely?" vs. "what is hardcoded in the codebase?". For every user-visible element it lists:

- The literal text shown to a visitor (EN + ES where relevant).
- Whether it is **CMS-sourced**, **CMS-sourced with a hardcoded fallback**, or **hardcoded** in the frontend.
- The exact file (and line where stable) it lives in today.

> **May 2026 split.** The `src/lib/cms/index.ts` file was 2 400+ lines and is now a 16-line barrel. The functions and fallback constants that used to live in it have moved to dedicated files (`navigation.ts`, `footer.ts`, `subscription.ts`, `page-resolver.ts`, etc.). All references in the tables below point to the new homes. The mock dataset previously in `mock-content.ts` is now split across `mock-content-pages-*.ts`, `mock-content-articles.ts`, `mock-content-events.ts`, and `mock-articles.ts`. Where exact line numbers shift between content edits, the reference uses the file only.

Legend:
- **CMS** — fetched from Optimizely Graph and rendered as-is (no in-app fallback for this string).
- **CMS + fallback** — fetched from Optimizely; if the CMS returns null or the provider is `mock`, the hardcoded default in the file:line below is used.
- **Hardcoded** — never read from the CMS; editing requires a code change.

---

## Table 1 — Page content sourced from the CMS (mock fallback when offline)

Every page rendered through `/[locale]/[[...slug]]` resolves via `getPageBySlug` (in `src/lib/cms/page-resolver.ts`). With `CMS_PROVIDER=optimizely` these strings come from Optimizely. With `CMS_PROVIDER=mock` they come from the split mock dataset.

| Area | Element | Source (when live) | Fallback file |
|------|---------|--------------------|---------------|
| Home page hero | Eyebrow, title, body, CTA, video poster | Optimizely `StartPage` | `src/lib/cms/mock-content-pages-en.ts` |
| Home page sections | Story, Services, Industries, Logos, Testimonials, CTA blocks | Optimizely `StartPage.blocks` | `src/lib/cms/mock-content-pages-en.ts` |
| Service pages | Title, summary, outcomes, audience, related industries, blocks | Optimizely `CMSPage` (`pageType=service`) | `src/lib/cms/mock-content-pages-en-1.ts` / `-2.ts` |
| Industry pages | Title, summary, related services, blocks | Optimizely `CMSPage` (`pageType=industry`) | `src/lib/cms/mock-content-pages-en-1.ts` / `-2.ts` |
| Insight / article pages | Title, summary, body (RichText), author, publishedAt, readTime, topics, card image | Optimizely `CMSPage` (`pageType=insight`) | `src/lib/cms/mock-content-articles.ts` + `src/lib/cms/mock-articles.ts` |
| Author pages | Name, role, expertise, avatar, bio (RichText) | Optimizely `CMSPage` (`pageType=author`) | `src/lib/cms/mock-authors.ts` |
| Contact page | Hero, intro, lead-form labels (CMS-overridable), office cards | Optimizely `CMSPage` (`pageType=contact`) | `src/lib/cms/mock-content-pages-en-2.ts` |
| Resource Center | Listing eyebrow, title, summary, filter options | Optimizely `CMSPage` (`pageType=resource-center`) | `src/lib/cms/mock-content-pages-en-2.ts` |
| News landing | News items, sidebar, featured | Optimizely `CMSPage` (`pageType=news-landing`) | `src/lib/cms/mock-content-pages-en-2.ts` |
| Events | Event title, date, location, summary | `EventsListingBlock` (CMS) | `src/lib/cms/mock-content-events.ts` |
| Locations | Office name, address, contact, lat/lng | Optimizely `LocationsDirectoryBlock` | `src/lib/cms/mock-content-pages-en-2.ts` |
| Spanish pages | Mirror of EN pages | Optimizely (locale-scoped) | `src/lib/cms/mock-content-pages-es.ts` |
| Block — Article List | Card title, summary, author label, link href | Optimizely block fields | `block-renderer-static.tsx` for layout, content from page data |
| Block — CardGrid | Card title, body, href | Optimizely block fields | `block-renderer-static.tsx` |
| Block — Form | Field labels, submit text | Optimizely `FormBlock` | [block-renderer-static.tsx](src/components/cms/block-renderer-static.tsx) |

---

## Table 2 — CMS-sourced strings with a hardcoded fallback in the codebase

These have an authored value in Optimizely, but if the CMS returns nothing the in-app constant is used. Edit Optimizely first; the file below is the safety net.

| Area | Element | Fallback EN | Fallback ES | Hardcoded fallback location |
|------|---------|-------------|-------------|------------------------------|
| Global Header | Brand label | Summit Advisory Group | Summit Advisory Group | [src/lib/cms/navigation.ts](src/lib/cms/navigation.ts) |
| Global Header | Primary nav (Services / Industries / Insights / Article / Contact) | Services / Industries / Insights / Article / Contact | Servicios / Industrias / Recursos / Articulo / Contacto | [src/lib/cms/navigation.ts](src/lib/cms/navigation.ts) |
| Global Header | CTA button label + href | Get in touch → `/contact` | Contactenos → `/contact` | [src/lib/cms/navigation.ts](src/lib/cms/navigation.ts) |
| Global Footer | Tagline / body | Strategy, design and engineering that compounds. | Estrategia, diseno e ingenieria que compone valor. | [src/lib/cms/footer.ts](src/lib/cms/footer.ts) |
| Global Footer | Column headings (Practice / Capabilities / Resources / Contact) | Practice / Capabilities / Resources / Contact | Practica / Capacidades / Recursos / Contacto | [src/lib/cms/footer.ts](src/lib/cms/footer.ts) |
| Global Footer | Column links | About / Careers / Insights / Locations / ... | Acerca / Carreras / Articulos / Ubicaciones / ... | [src/lib/cms/footer.ts](src/lib/cms/footer.ts) |
| Global Footer | Copyright line | © {year} Summit Advisory Group ... | © {year} Summit Advisory Group ... | [src/lib/cms/footer.ts](src/lib/cms/footer.ts) |
| Global Footer | Social link aria-labels | LinkedIn / Facebook / Twitter | — | [src/components/site/site-footer.tsx](src/components/site/site-footer.tsx) |
| Subscription Page | Eyebrow / Title / Subtitle | Stay in the loop / Subscribe to Summit insights / Receive curated updates... | — | [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) |
| Subscription Page | Topic group labels | Insights, Events, Industry updates | — | [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) |
| Subscription Page | Topic items + descriptions | Articles / Webinars / Healthcare ... | — | [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) |
| Subscription Page | Consent text | I agree to receive marketing emails... | — | [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) |
| Subscription Page | Submit / Submitting button labels | Subscribe / Submitting... | — | [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) |
| Subscription Page | Success title / body / back link | Thanks for subscribing! / You will receive Summit Advisory Group updates... / Back to home | — | [src/lib/cms/subscription.ts](src/lib/cms/subscription.ts) |
| Insights — featured | "Featured content" rail title + view-all | Featured insights / View all | — | [src/lib/cms/insights.ts](src/lib/cms/insights.ts) |
| Search | API search result limit + ordering | 10 results, score-ordered | — | [src/lib/cms/search.ts](src/lib/cms/search.ts) |
| Block — Article List | View all label | View all articles | — | [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) |

---

## Table 3 — Hardcoded in the frontend

Literal strings inside components or `dictionary[locale]` objects. Editing Optimizely will not change these.

| Area | Element / Label | EN | ES | File |
|------|-----------------|----|----|------|
| Global Header | Tagline rendering | CMS practice build | Proyecto de practica CMS | [src/components/site/site-header.tsx](src/components/site/site-header.tsx) |
| Global Header | Resource Center label | Resource Center | Centro de Recursos | [src/components/site/site-header.tsx](src/components/site/site-header.tsx) |
| Global Header | Contact label | Contact | Contacto | [src/components/site/site-header.tsx](src/components/site/site-header.tsx) |
| Locale Switcher | Switch label | ES | EN | [src/components/site/site-header.tsx](src/components/site/site-header.tsx) |
| Header Search | Input placeholder | Search ... | Buscar ... | [src/components/site/header-search.tsx](src/components/site/header-search.tsx) |
| Header Search | Match count words | match / matches | coincidencia / coincidencias | [src/components/site/header-search.tsx](src/components/site/header-search.tsx) |
| Header Search | Loading status | Searching... | Buscando... | [src/components/site/header-search.tsx](src/components/site/header-search.tsx) |
| Header Search | Overflow text | Showing top {n} | Mostrando {n} | [src/components/site/header-search.tsx](src/components/site/header-search.tsx) |
| Header Search | Empty state | No matches found. | Sin coincidencias. | [src/components/site/header-search.tsx](src/components/site/header-search.tsx) |
| Header Panel | Section dividers + close button labels | "Explore" / "Close menu" | "Explorar" / "Cerrar menu" | [src/components/site/site-header-panel.tsx](src/components/site/site-header-panel.tsx) |
| Alerts Callout | Eyebrow | SUMMIT ALERTS & UPDATES | SUMMIT ALERTAS Y ACTUALIZACIONES | [src/components/site/alerts-callout.tsx](src/components/site/alerts-callout.tsx) |
| Alerts Callout | Heading | FORESIGHT CHANGES OUTCOMES. | LA PERSPECTIVA LO CAMBIA TODO. | [src/components/site/alerts-callout.tsx](src/components/site/alerts-callout.tsx) |
| Alerts Callout | Body | Receive timely industry developments... | Reciba a tiempo desarrollos de la... | [src/components/site/alerts-callout.tsx](src/components/site/alerts-callout.tsx) |
| Alerts Callout | CTA button | GET ALERTS AND UPDATES | RECIBIR ALERTAS Y ACTUALIZACIONES | [src/components/site/alerts-callout.tsx](src/components/site/alerts-callout.tsx) |
| Global Footer | Social aria-labels | LinkedIn / Facebook / Twitter | — | [src/components/site/site-footer.tsx](src/components/site/site-footer.tsx) |
| Global Footer | Brand aria-label | Summit Advisory Group | — | [src/components/site/site-footer.tsx](src/components/site/site-footer.tsx) |
| Default page view | Trending heading / View-all link | "Trending" / "View all →" | "Tendencias" / "Ver todos →" | [src/components/cms/page-renderer-default-view.tsx](src/components/cms/page-renderer-default-view.tsx) |
| Insight Page | Back link | Back to Articles | Volver a articulos | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | Key takeaways label | Key takeaways | — | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | Top picks label | Top picks | Destacados | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | Read more label | Read more | — | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | Authors label | Author(s) | — | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | View profile | View Profile → | Ver perfil → | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | Read full story | Read full story → | Leer articulo → | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Insight Page | Fallback notice | This page is falling back to mock content... | Esta pagina usa contenido de respaldo... | [src/components/cms/page-renderer-insight-view.tsx](src/components/cms/page-renderer-insight-view.tsx) |
| Article Card | Author fallback | Editorial team | — | [src/components/cms/article-listing.tsx](src/components/cms/article-listing.tsx) |
| Article Card | Read full story link | Read full story | — | [src/components/cms/article-listing.tsx](src/components/cms/article-listing.tsx) |
| Resource Center | Search placeholder | Search insights | Buscar articulos | [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) |
| Resource Center | Service filter default | All services | Todos los servicios | [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) |
| Resource Center | Industry filter default | All industries | Todas las industrias | [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) |
| Resource Center | Topic filter default | All topics | Todos los temas | [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) |
| Resource Center | Filter button | Filter | Filtrar | [src/components/cms/page-renderer-resource-center.tsx](src/components/cms/page-renderer-resource-center.tsx) |
| News Listing | Filter labels, "Load more" | Topic / All / Load more | Tema / Todos / Cargar mas | [src/components/cms/news-listing.tsx](src/components/cms/news-listing.tsx) |
| Events Listing | "Register" / "Add to calendar" labels | Register → / Add to calendar | Registrarse → / Anadir al calendario | [src/components/cms/events-listing.tsx](src/components/cms/events-listing.tsx) |
| Locations Directory | "Search offices" placeholder + state labels | Search offices / All states | Buscar oficinas / Todos los estados | [src/components/cms/locations-directory.tsx](src/components/cms/locations-directory.tsx) |
| Sign-in (401k) | Field labels, "Sign in" button | Username / Password / Sign in | — | [src/components/cms/sign-in/variant-401k.tsx](src/components/cms/sign-in/variant-401k.tsx) |
| Sign-in (Hub) | Field labels, "Sign in" button | Username / Password / Sign in | — | [src/components/cms/sign-in/variant-hub.tsx](src/components/cms/sign-in/variant-hub.tsx) |
| Sign-in (ShareFile) | Field labels, "Sign in" button | Subdomain / Email / Sign in | — | [src/components/cms/sign-in/variant-sharefile.tsx](src/components/cms/sign-in/variant-sharefile.tsx) |
| Pay Bill | Field labels, "Pay now" button | Invoice number / Email / Amount / Pay now | — | [src/components/cms/pay-bill.tsx](src/components/cms/pay-bill.tsx) |
| Portal Applications | "Launch" button label | Launch → | — | [src/components/cms/portal-applications.tsx](src/components/cms/portal-applications.tsx) |
| Lead Form | Section label | Lead generation | Captura de leads | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Name field label | Name | Nombre | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Email field label | Email | Correo | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Company field label | Company | Empresa | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Message label | What do you want to learn or build? | Que desea aprender o construir? | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Submit button | Submit / Submitting... | Enviar / Enviando... | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Success message | Thanks! We will reach out shortly. | Gracias. Nos pondremos en contacto pronto. | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Validation error | Unable to submit the form. | No fue posible enviar el formulario. | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | Network error | Network error. Please try again. | Error de red. Intente de nuevo. | [src/components/forms/lead-form.tsx](src/components/forms/lead-form.tsx) |
| Lead Form | US states list | (50 states + DC) | — | [src/components/forms/lead-form-helpers.ts](src/components/forms/lead-form-helpers.ts) |
| Subscription Form | Email / First Name / Last Name / Job Title / Company labels | — | — | [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) |
| Subscription Form | Company placeholder | Company or Organization | — | [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) |
| Subscription Form | Robot checkbox | I'm not a robot | — | [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) |
| Subscription Form | reCAPTCHA label | reCAPTCHA (demo) | — | [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) |
| Subscription Form | Submit button (busy) | Submitting... | — | [src/app/subscription/subscription-form.tsx](src/app/subscription/subscription-form.tsx) |
| Admin Leads | Auth gate heading | Admin access | — | [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) |
| Admin Leads | Auth gate instruction | Append ?key=YOUR_ADMIN_KEY to the URL | — | [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) |
| Admin Leads | Page heading | Leads | — | [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) |
| Admin Leads | Counter / Download button | entries (latest 500) / Download CSV | — | [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) |
| Admin Leads | Table headers | Submitted, Name, Email, Company, Message | — | [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) |
| Admin Leads | Empty state | No leads yet. | — | [src/app/admin/leads/page.tsx](src/app/admin/leads/page.tsx) |
| Admin Subscribers | Auth gate heading / instruction | Admin access / Append ?key=YOUR_ADMIN_KEY to the URL | — | [src/app/admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx) |
| Admin Subscribers | Page heading / counter / download | Subscribers / entries (latest 500) / Download CSV | — | [src/app/admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx) |
| Admin Subscribers | Table headers | Submitted, Name, Email, Company, Job Title, Consent, Topics | — | [src/app/admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx) |
| Admin Subscribers | Consent values / Empty state | Yes / No / No subscribers yet. | — | [src/app/admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx) |
| 404 / Not Found | Eyebrow, heading, message, button | 404 / Page not found / The requested route does not exist. / Return home | — | [src/app/not-found.tsx](src/app/not-found.tsx) |
| Draft Mode Banner | Banner text | Preview mode is enabled. | — | [src/app/[locale]/layout.tsx](src/app/%5Blocale%5D/layout.tsx) |
| Block — Card Grid | "Explore →" link label | Explore → | — | [src/components/cms/block-renderer-static.tsx](src/components/cms/block-renderer-static.tsx) |
| Block — Featured Content | Explore link | Explore | — | [src/components/cms/block-renderer-static.tsx](src/components/cms/block-renderer-static.tsx) |
| Block — Article List | "Showing top" line | Showing top {n} | — | [src/components/cms/block-renderer-static.tsx](src/components/cms/block-renderer-static.tsx) |
| Block — Form | Submit label | Submit | Enviar | [src/components/cms/block-renderer-static.tsx](src/components/cms/block-renderer-static.tsx) |
