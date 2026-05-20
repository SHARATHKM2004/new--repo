# Content Source Inventory

Every user-visible string on the website, split by where its value comes from. Three tables, no mixing.

- **Table 1 — CMS (Optimizely Graph)**: comes from Optimizely (or the mock dataset in `src/lib/cms/mock-content.ts` when `CMS_PROVIDER=mock`). No string fallback in the component.
- **Table 2 — CMS with hardcoded fallback**: fetched from Optimizely, but `src/lib/cms/index.ts` supplies a default string used when the field is missing or the provider is `mock`.
- **Table 3 — Hardcoded in the frontend**: literal strings in components or `dictionary[locale]` objects. Cannot be edited in Optimizely.

---

## Table 1 — CMS (Optimizely Graph)

| Area | Element / Label | Example text | File:line |
|------|-----------------|--------------|-----------|
| Home (StartPage) | Hero eyebrow | Corporate marketing platform | [mock-content.ts](src/lib/cms/mock-content.ts#L655) |
| Home (StartPage) | Hero title | Advisory storytelling built for... | [mock-content.ts](src/lib/cms/mock-content.ts#L656) |
| Home (StartPage) | Hero intro | Create service pages, industry... | [mock-content.ts](src/lib/cms/mock-content.ts#L657) |
| Home (StartPage) | Hero primary CTA | Explore services | [mock-content.ts](src/lib/cms/mock-content.ts#L661) |
| Home (StartPage) | Hero secondary CTA | Visit resource center | [mock-content.ts](src/lib/cms/mock-content.ts#L665) |
| Home (StartPage) | Stats block title | What this practice build is... | [mock-content.ts](src/lib/cms/mock-content.ts#L670) |
| Home (StartPage) | Stats items | Page types (8), Reusable sections (7), Locales (2), Preview path (Ready) | [mock-content.ts](src/lib/cms/mock-content.ts#L671-L674) |
| Home (StartPage) | Card grid title | Practice the same site shape... | [mock-content.ts](src/lib/cms/mock-content.ts#L677) |
| Home (StartPage) | Card grid intro | The structure mirrors a... | [mock-content.ts](src/lib/cms/mock-content.ts#L678) |
| Home (StartPage) | Card 1 (eyebrow/title/body) | Service pages → Position capabilities clearly → Model outcomes... | [mock-content.ts](src/lib/cms/mock-content.ts#L681-L683) |
| Home (StartPage) | Card 2 (eyebrow/title/body) | Industry pages → Tell focused market stories → Connect industry pain points... | [mock-content.ts](src/lib/cms/mock-content.ts#L687-L689) |
| Home (StartPage) | Card 3 (eyebrow/title/body) | Insights hub → Build filterable editorial... → Practice tagging... | [mock-content.ts](src/lib/cms/mock-content.ts#L693-L695) |
| Home (StartPage) | Featured content section | Latest insights + intro | [mock-content.ts](src/lib/cms/mock-content.ts#L701-L702) |
| Home (StartPage) | CTA block | Pressure-test the full stack... / Open contact page | [mock-content.ts](src/lib/cms/mock-content.ts#L709-L712) |
| Service Page | Title | Digital platform strategy | [mock-content.ts](src/lib/cms/mock-content.ts#L713) |
| Service Page | Eyebrow | Service | [mock-content.ts](src/lib/cms/mock-content.ts#L715) |
| Service Page | Outcome tags | Composable web architecture, Clear CMS governance, Faster campaign launches | [mock-content.ts](src/lib/cms/mock-content.ts#L728-L730) |
| Service Page | Body text | Enterprise web programs... | [mock-content.ts](src/lib/cms/mock-content.ts#L733-L734) |
| Industry / Insight / Author / Contact / Resource Center pages | All headings, summaries, body, office details, related IDs | (per content item) | [mock-content.ts](src/lib/cms/mock-content.ts) |
| Contact Page | Office labels (Client / Challenge / Result) | (per office record) | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L140-L146) |
| Block — Hero | eyebrow, title, intro, CTAs | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L109) |
| Block — Rich Text | body paragraphs | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L130) |
| Block — HTML | raw HTML | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L136) |
| Block — Image | alt text, caption | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L145-L146) |
| Block — Video | iframe title, caption | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L154-L158) |
| Block — Stats | title, item label, item value | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L164-L169) |
| Block — Quote | quote, attribution, role | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L177-L180) |
| Block — Card Grid | title, intro, card title, card body | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L184-L198) |
| Block — CTA | title, body, action label | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L213-L218) |
| Block — Featured Content | title, intro, resolved card content | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L41-L234) |
| Block — Form | title, intro | (per block) | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L276-L277) |
| Admin Leads (rows) | Submitted, Name, Email, Company, Message values | (per submission) | [data/leads.json](data/leads.json) |
| Admin Subscribers (rows) | Subscriber field values | (per submission) | persisted via `/api/subscribe` |

---

## Table 2 — CMS with hardcoded fallback

These come from Optimizely when authored; if missing, the default string in `src/lib/cms/index.ts` is used.

| Area | Element / Label | Fallback text (EN) | Fallback text (ES) | File:line |
|------|-----------------|---------------------|---------------------|-----------|
| Global Header | Brand title | Summit Advisory Group | Summit Advisory Group | [cms/index.ts](src/lib/cms/index.ts#L1318-L1335) |
| Global Header | Tagline | CMS practice build | Proyecto de practica CMS | [cms/index.ts](src/lib/cms/index.ts#L1318-L1335) |
| Global Header | CTA label | Talk to us | Contactar | [cms/index.ts](src/lib/cms/index.ts#L1318-L1335) |
| Locale Switcher | Switch label | ES | EN | [cms/index.ts](src/lib/cms/index.ts#L1318-L1335) |
| Global Footer | Eyebrow | Practice project | Proyecto de practica | [cms/index.ts](src/lib/cms/index.ts#L1369) |
| Global Footer | Title | Build the architecture you actually want to inherit. | Construya la arquitectura que si quiera heredar. | [cms/index.ts](src/lib/cms/index.ts#L1371-L1373) |
| Global Footer | Body | This scaffold is intentionally opinionated... | Esta base es intencionalmente opinionada... | [cms/index.ts](src/lib/cms/index.ts#L1375-L1378) |
| Global Footer | Column 1 title | Core paths | Rutas clave | [cms/index.ts](src/lib/cms/index.ts#L1380) |
| Global Footer | Column 1 links | Home, Resource center, Contact | — | [cms/index.ts](src/lib/cms/index.ts#L1381-L1383) |
| Global Footer | Column 2 title | Developer hooks | — | [cms/index.ts](src/lib/cms/index.ts#L1387) |
| Global Footer | Column 2 links | Enable preview, Disable preview | — | [cms/index.ts](src/lib/cms/index.ts#L1388-L1389) |
| Subscription Page | Page title | Summit Advisory Group subscription center | — | [cms/index.ts](src/lib/cms/index.ts#L1520) |
| Subscription Page | Breadcrumb home label | Home | — | [cms/index.ts](src/lib/cms/index.ts#L1521) |
| Subscription Page | Heading | Want to stay in the know? | — | [cms/index.ts](src/lib/cms/index.ts#L1522) |
| Subscription Page | Intro | At Summit Advisory Group, we strive... | — | [cms/index.ts](src/lib/cms/index.ts#L1523-L1524) |
| Subscription Page | Emails consent title | Sign up for Summit Advisory Group emails. | — | [cms/index.ts](src/lib/cms/index.ts#L1525) |
| Subscription Page | Emails consent body | You can select specific e-communications... | — | [cms/index.ts](src/lib/cms/index.ts#L1526) |
| Subscription Page | Topics help text | Check the boxes below to receive... | — | [cms/index.ts](src/lib/cms/index.ts#L1527) |
| Subscription Page | Topic 1 (title + body) | Thought Leadership + body | — | [cms/index.ts](src/lib/cms/index.ts#L1529-L1530) |
| Subscription Page | Topic 2 (title + body) | Event Invitations + body | — | [cms/index.ts](src/lib/cms/index.ts#L1534-L1535) |
| Subscription Page | Topic 3 (title + body) | Summit Weekly + body | — | [cms/index.ts](src/lib/cms/index.ts#L1539-L1540) |
| Subscription Page | Topic 4 (title + body) | Regulatory Reporting Requirements + body | — | [cms/index.ts](src/lib/cms/index.ts#L1543-L1544) |
| Subscription Page | Submit label | Submit | — | [cms/index.ts](src/lib/cms/index.ts#L1546) |
| Subscription Page | Success title | Thanks for subscribing! | — | [cms/index.ts](src/lib/cms/index.ts#L1547) |
| Subscription Page | Success body | You will receive Summit Advisory Group updates... | — | [cms/index.ts](src/lib/cms/index.ts#L1548) |
| Subscription Page | Back link | Back to home | — | [cms/index.ts](src/lib/cms/index.ts#L1549) |
| Block — Article List | View all label | View all articles | — | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L357) |

---

## Table 3 — Hardcoded in the frontend

Literal strings inside components or `dictionary[locale]` objects. Editing Optimizely will not change these.

| Area | Element / Label | EN | ES | File:line |
|------|-----------------|----|----|-----------|
| Global Header | Tagline rendering | CMS practice build | Proyecto de practica CMS | [site-header.tsx](src/components/site/site-header.tsx#L24) |
| Global Header | Resource Center link | Resource Center | Centro de Recursos | [site-header.tsx](src/components/site/site-header.tsx#L18-L20) |
| Global Header | Contact link | Contact | Contacto | [site-header.tsx](src/components/site/site-header.tsx#L18-L20) |
| Locale Switcher | Switch label | ES | EN | [site-header.tsx](src/components/site/site-header.tsx#L18-L20) |
| Navigation Menu | Services | Services | Servicios | [cms/index.ts](src/lib/cms/index.ts#L1285-L1293) |
| Navigation Menu | Industries | Industries | Industrias | [cms/index.ts](src/lib/cms/index.ts#L1285-L1293) |
| Navigation Menu | Insights | Insights | Recursos | [cms/index.ts](src/lib/cms/index.ts#L1285-L1293) |
| Navigation Menu | Article | Article | Articulo | [cms/index.ts](src/lib/cms/index.ts#L1285-L1293) |
| Navigation Menu | Contact | Contact | Contacto | [cms/index.ts](src/lib/cms/index.ts#L1285-L1293) |
| Header Search | Input placeholder | Search ... | Buscar ... | [header-search.tsx](src/components/site/header-search.tsx#L68) |
| Header Search | Match count words | match / matches | coincidencia / coincidencias | [header-search.tsx](src/components/site/header-search.tsx#L69) |
| Header Search | Loading status | Searching... | Buscando... | [header-search.tsx](src/components/site/header-search.tsx#L81) |
| Header Search | Overflow text | Showing top {n} | Mostrando {n} | [header-search.tsx](src/components/site/header-search.tsx#L82-L84) |
| Header Search | Empty state | No matches found. | Sin coincidencias. | [header-search.tsx](src/components/site/header-search.tsx#L100) |
| Alerts Callout | Eyebrow | SUMMIT ALERTS & UPDATES | SUMMIT ALERTAS Y ACTUALIZACIONES | [alerts-callout.tsx](src/components/site/alerts-callout.tsx#L21) |
| Alerts Callout | Heading | FORESIGHT CHANGES OUTCOMES. | LA PERSPECTIVA LO CAMBIA TODO. | [alerts-callout.tsx](src/components/site/alerts-callout.tsx#L23-L25) |
| Alerts Callout | Body | Receive timely industry developments... | Reciba a tiempo desarrollos de la... | [alerts-callout.tsx](src/components/site/alerts-callout.tsx#L26-L29) |
| Alerts Callout | CTA button | GET ALERTS AND UPDATES | RECIBIR ALERTAS Y ACTUALIZACIONES | [alerts-callout.tsx](src/components/site/alerts-callout.tsx#L30-L32) |
| Global Footer | Social aria-labels | LinkedIn / Facebook / Twitter | — | [site-footer.tsx](src/components/site/site-footer.tsx#L31-L53) |
| Global Footer | Brand aria-label | Summit Advisory Group | — | [site-footer.tsx](src/components/site/site-footer.tsx#L81) |
| Insight Page | Back link | Back to Articles | Volver a articulos | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L204) |
| Insight Page | Key takeaways label | Key takeaways | — | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L205) |
| Insight Page | Top picks label | Top picks | Destacados | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L206) |
| Insight Page | Read more label | Read more | — | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L207) |
| Insight Page | Authors label | Author(s) | — | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L208) |
| Insight Page | View profile | View Profile → | Ver perfil → | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L209) |
| Insight Page | Read full story | Read full story → | Leer articulo → | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L210) |
| Insight Page | Fallback notice | This page is falling back to mock content... | Esta pagina usa contenido de respaldo... | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L166) |
| Article Card | Author fallback | Editorial team | — | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L47) |
| Article Card | Read full story link | Read full story | — | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L90) |
| Resource Center | Search placeholder | Search insights | Buscar articulos | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L264) |
| Resource Center | Service filter default | All services | Todos los servicios | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L268) |
| Resource Center | Industry filter default | All industries | Todas las industrias | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L273) |
| Resource Center | Topic filter default | All topics | Todos los temas | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L278) |
| Resource Center | Filter button | Filter | Filtrar | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L290) |
| Resource Center | Filter option values | Digital platform strategy, Healthcare, Preview, Taxonomy, ... | — | [page-renderer.tsx](src/components/cms/page-renderer.tsx#L267-L279) |
| Lead Form | Section label | Lead generation | Captura de leads | [lead-form.tsx](src/components/forms/lead-form.tsx#L30) |
| Lead Form | Name field label | Name | Nombre | [lead-form.tsx](src/components/forms/lead-form.tsx#L69) |
| Lead Form | Email field label | Email | Correo | [lead-form.tsx](src/components/forms/lead-form.tsx#L72) |
| Lead Form | Company field label | Company | Empresa | [lead-form.tsx](src/components/forms/lead-form.tsx#L75) |
| Lead Form | Message label | What do you want to learn or build? | Que desea aprender o construir? | [lead-form.tsx](src/components/forms/lead-form.tsx#L81) |
| Lead Form | Submit button | Submit / Submitting... | Enviar / Enviando... | [lead-form.tsx](src/components/forms/lead-form.tsx#L88) |
| Lead Form | Success message | Thanks! We will reach out shortly. | Gracias. Nos pondremos en contacto pronto. | [lead-form.tsx](src/components/forms/lead-form.tsx#L62-L64) |
| Lead Form | Validation error | Unable to submit the form. | No fue posible enviar el formulario. | [lead-form.tsx](src/components/forms/lead-form.tsx#L57-L59) |
| Lead Form | Network error | Network error. Please try again. | Error de red. Intente de nuevo. | [lead-form.tsx](src/components/forms/lead-form.tsx#L75-L78) |
| Subscription Form | Email field label | Email | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L80) |
| Subscription Form | First Name field label | First Name | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L81) |
| Subscription Form | Last Name field label | Last Name | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L82) |
| Subscription Form | Job Title field label | Job Title | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L83) |
| Subscription Form | Company field label | Company | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L84) |
| Subscription Form | Company placeholder | Company or Organization | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L84) |
| Subscription Form | Robot checkbox | I'm not a robot | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L101) |
| Subscription Form | reCAPTCHA label | reCAPTCHA (demo) | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L102) |
| Subscription Form | Submit button (busy) | Submitting... | — | [subscription-form.tsx](src/app/subscription/subscription-form.tsx#L114) |
| Admin Leads | Auth gate heading | Admin access | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L23) |
| Admin Leads | Auth gate instruction | Append ?key=YOUR_ADMIN_KEY to the URL | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L24-L25) |
| Admin Leads | Page heading | Leads | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L39) |
| Admin Leads | Counter text | entries (latest 500) | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L40) |
| Admin Leads | Download button | Download CSV | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L44) |
| Admin Leads | Table headers | Submitted, Name, Email, Company, Message | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L50-L54) |
| Admin Leads | Empty state | No leads yet. | — | [admin/leads/page.tsx](src/app/admin/leads/page.tsx#L65) |
| Admin Subscribers | Auth gate heading | Admin access | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L23) |
| Admin Subscribers | Auth gate instruction | Append ?key=YOUR_ADMIN_KEY to the URL | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L24-L25) |
| Admin Subscribers | Page heading | Subscribers | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L39) |
| Admin Subscribers | Counter text | entries (latest 500) | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L40) |
| Admin Subscribers | Download button | Download CSV | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L44) |
| Admin Subscribers | Table headers | Submitted, Name, Email, Company, Job Title, Consent, Topics | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L50-L56) |
| Admin Subscribers | Consent values | Yes / No | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L66) |
| Admin Subscribers | Empty state | No subscribers yet. | — | [admin/subscribers/page.tsx](src/app/admin/subscribers/page.tsx#L72) |
| 404 / Not Found | Eyebrow | 404 | — | [not-found.tsx](src/app/not-found.tsx#L6) |
| 404 / Not Found | Heading | Page not found | — | [not-found.tsx](src/app/not-found.tsx#L7) |
| 404 / Not Found | Message | The requested route does not exist. | — | [not-found.tsx](src/app/not-found.tsx#L8) |
| 404 / Not Found | Return button | Return home | — | [not-found.tsx](src/app/not-found.tsx#L15) |
| Draft Mode Banner | Banner text | Preview mode is enabled. | — | [[locale]/layout.tsx](src/app/%5Blocale%5D/layout.tsx#L26) |
| Block — Card Grid | "Explore →" link label | Explore → | — | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L204) |
| Block — Featured Content | Explore link | Explore | — | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L47) |
| Block — Article List | "Showing top" line | Showing top {n} | — | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L257) |
| Block — Form | Submit label | Submit | Enviar | [block-renderer.tsx](src/components/cms/block-renderer.tsx#L278) |
