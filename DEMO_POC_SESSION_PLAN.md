# 30-Minute Demo Runbook

## Summit Advisory Group POC

## Purpose

This session should feel like a business-ready product walkthrough, not a technical deep dive.

The objective is to prove three things in 30 minutes:

1. The site already works like a real CMS-driven marketing platform.
2. It supports meaningful business flows, not just page rendering.
3. It has a credible path to Optimizely-backed publishing without changing the front-end experience.

## Audience Strategy

Primary audience fit:

- Bala: focus on visible functionality, business value, and confidence.
- Team members: show enough structure and completeness that the POC feels serious and extensible.

What to optimize for:

- clarity
- confidence
- smooth flow
- visible outcomes
- no live debugging

What to avoid:

- code walkthroughs unless asked
- framework/version details
- GraphQL/query explanations
- implementation tradeoffs
- unstable flows that have not been checked before the call

## One-Line Positioning

Use this opening sentence:

> This is a localized marketing-site POC that already supports content-driven pages, search, forms, subscriptions, and preview-oriented CMS workflows, with the same rendering flow able to work against mock content or Optimizely-backed content.

## Demo Narrative

Keep returning to this message throughout the session:

> The value of this POC is that it already behaves like a real business website. Users can browse structured content, discover insights, submit forms, subscribe, and support multilingual experiences, while content operations can evolve toward Optimizely-managed publishing.

## Recommended 30-Minute Agenda

| Time | Segment | Goal |
| --- | --- | --- |
| 0:00 - 2:00 | Opening context | Set expectations in business language |
| 2:00 - 7:00 | Homepage and navigation | Show the site as a real product |
| 7:00 - 11:00 | Services and industry pages | Show reusable page models |
| 11:00 - 15:00 | Resource center and article flow | Show content discovery and insight journeys |
| 15:00 - 19:00 | Search, contact, and subscription | Show user interaction and conversion paths |
| 19:00 - 23:00 | Localization | Show multi-language readiness |
| 23:00 - 26:00 | Preview/publishing concept | Explain CMS value without going too deep |
| 26:00 - 28:00 | Admin/export business value | Show captured lead/subscriber usefulness |
| 28:00 - 30:00 | Close and Q&A | Reinforce readiness and next-step value |

## Exact Demo Route Order

Use this order so the session feels intentional and smooth.

Core pages:

1. `/en`
2. `/en/services/digital-platform-strategy`
3. `/en/industries/healthcare-financial-resilience`
4. `/en/resource-center`
5. `/en/article/all`
6. One article detail page from the listing, for example:
   `/en/article/why-speed-is-the-missing-link-in-automotive-smart-factory-roi`
7. `/en/contact`
8. `/subscription`
9. `/es`
10. `/es/resource-center`
11. `/es/contact`

Optional admin/business value pages:

1. `/admin/leads?key=YOUR_ADMIN_KEY`
2. `/api/admin/leads.csv?key=YOUR_ADMIN_KEY`
3. `/api/admin/subscribers.csv?key=YOUR_ADMIN_KEY`

Optional preview flow if already validated before the call:

1. `/api/draft?secret=YOUR_PREVIEW_SECRET&slug=/en`
2. Revisit `/en`
3. `/api/draft/disable`

## Speaker Script

## 1. Opening Context

Suggested talk track:

> Today I want to show this as a business-facing POC rather than a code exercise. The goal was to prove that we can support a realistic marketing-site experience with structured content, multilingual delivery, user interaction flows, and a practical path toward Optimizely-managed publishing.

Then set expectations:

- I will start with the website experience.
- Then I will show content and interaction flows.
- I will close with how this supports business operations and CMS readiness.

## 2. Homepage and Navigation

Open `/en`.

What to say:

- This is the landing experience for the site.
- The important point is not only the design, but that the content is structured into reusable sections.
- The same platform can support multiple page types without rebuilding each page separately.

Use the header navigation.

What to emphasize:

- navigation is content-driven in concept
- sections are reusable
- the experience already feels like a production-shaped marketing site

## 3. Services and Industry Pages

Open `/en/services/digital-platform-strategy`.

What to say:

- This is a service-specific page with a focused message and structured sections.
- The point here is that business teams can present a service line consistently without custom-building every page.

Open `/en/industries/healthcare-financial-resilience`.

What to say:

- Here the experience shifts from service-led content to industry-led messaging.
- That shows the model can support different business narratives while staying inside the same platform.

Bridge statement:

> This is where the POC starts to show value beyond static pages. We are not demonstrating isolated screens. We are demonstrating a reusable content model.

## 4. Resource Center and Article Flow

Open `/en/resource-center`.

What to say:

- This is the content discovery side of the site.
- It gives the business a place to organize thought leadership and supporting content.

Open `/en/article/all`.

What to say:

- This shows a full article library view.
- It is important because it demonstrates scalable content presentation rather than one-off article pages.

Open one article detail page.

What to say:

- Now we are at the individual insight level.
- This is where content supports credibility, education, and lead generation.
- The experience also connects back into broader journeys like contact and subscription.

## 5. Search, Contact, and Subscription

If search is easy to show from the UI, demonstrate it from the header.

Message:

- Users are not forced to navigate manually through the whole structure.
- Search makes the content library practical once the site grows.

Open `/en/contact`.

What to say:

- This is where the POC moves from content consumption into business conversion.
- A visitor can submit an actual lead inquiry rather than just browse information.

Recommended live action:

- submit a clean sample lead entry if the environment is ready

Open `/subscription`.

What to say:

- This supports another conversion path: ongoing audience engagement.
- It shows the POC can capture subscriber interest, not just one-time lead forms.

Recommended live action:

- submit a sample subscription entry if already tested beforehand

## 6. Localization

Open `/es` and then `/es/resource-center` or `/es/contact`.

What to say:

- The same site framework can support multilingual delivery.
- This matters for regional publishing, brand consistency, and future expansion.
- The value is that localization is part of the content model, not an afterthought.

Short transition line:

> So far we have seen the same platform support multiple page types, article journeys, form capture, and multilingual delivery.

## 7. Preview and Publishing Concept

Only show this if you have already tested it before the meeting.

What to say:

- The final piece is editor workflow.
- In a CMS-driven setup, content teams need a way to preview and publish changes without waiting on manual page rebuild work.

If preview is stable, show it briefly.

If not, say this instead:

> The POC already includes the preview and revalidation pattern needed for CMS-managed publishing. For this session I am keeping the focus on the stable business flows, but the architecture is already prepared for that next step.

Keep this section high level. Do not drift into secrets, requests, or technical debugging.

## 8. Admin and Business Value

If you have a safe admin key ready, show `/admin/leads?key=YOUR_ADMIN_KEY`.

What to say:

- The site is not only collecting information. It also makes that information usable.
- This turns the POC into something closer to an operational business tool.

Optional follow-up:

- show the CSV export endpoint
- explain that marketing or operations teams can use captured records for follow-up workflows

## 9. Closing

Use this closing summary:

> This POC proves the business journey end to end. We can present structured marketing content, support multilingual experiences, drive search and discovery, capture leads and subscribers, and align the front end with a CMS-backed publishing model. That gives us a practical base for moving from prototype to production hardening.

## What Makes This Demo Land Well

Say these ideas in simple business language:

- This is not a static website mockup.
- It already supports content, interaction, and conversion flows.
- The same model supports multiple page types and growth over time.
- Localization is already part of the experience.
- The CMS integration path is believable because it does not require rethinking the front end.

## Live Demo Checklist

## 30 to 60 Minutes Before the Session

1. Start the app and verify the site loads.
2. Confirm the exact homepage URL you will use.
3. Open every route in the demo order once.
4. Verify search works from the UI if you plan to show it.
5. Verify lead form submission works if you plan to submit live.
6. Verify subscription form submission works if you plan to submit live.
7. Verify admin page or CSV export only if you will show it.
8. Verify preview only if you are fully confident it is stable today.
9. Close unrelated tabs and windows.
10. Keep the browser zoom comfortable and readable.

## 5 Minutes Before the Session

1. Open the key pages in separate tabs in the demo order.
2. Keep one fallback tab on `/en`.
3. Keep one fallback tab on `/en/contact`.
4. Keep any secret-bearing URLs out of visible history if possible.
5. Keep this runbook open in a separate tab or editor pane.

## If Something Breaks

Use this response pattern immediately:

1. Do not debug live.
2. Move to the next stable page.
3. Reframe the conversation around business capability.
4. If a CMS-linked feature is unstable, switch to the stable site experience.

Suggested language:

> I will keep the focus on the stable product flow. The important point is that the front-end experience is already in place and the content provider can be swapped without changing that user journey.

## Q and A Cheat Sheet

### If someone asks, What is the core value here?

Answer:

> The core value is that the POC already connects content presentation, multilingual delivery, user interaction, and conversion flows in one consistent platform.

### If someone asks, Why does this matter for the business?

Answer:

> It reduces the gap between content operations and customer-facing experience. Business teams get a site structure that supports growth, campaigns, insights, and lead generation without rebuilding the front end every time.

### If someone asks, Is this ready for a real CMS?

Answer:

> That is the direction this POC is designed for. The rendering flow is already structured so content can come from mock data now and from Optimizely-backed sources in the same overall model.

### If someone asks, What would the next phase be?

Answer:

> The next phase would be production hardening: final CMS authoring model alignment, access/security cleanup, content governance, deployment validation, and operational rollout.

## Delivery Style

Present this like an owner, not like an intern asking for permission.

That means:

- speak in short, confident sentences
- lead with what works
- keep transitions crisp
- avoid apologizing for features you are not showing
- stay focused on outcomes and readiness

## Best Final Line

> The POC shows that we already have the right business shape: content-driven pages, reusable site structure, multilingual delivery, lead and subscriber capture, and a clear path toward Optimizely-managed publishing.