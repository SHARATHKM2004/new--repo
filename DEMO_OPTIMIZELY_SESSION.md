# 30-Minute Optimizely + Next.js POC Session

## Summit Advisory Group

This file is the full presenter script for today's 30-minute session.

Audience note: the team is new to Optimizely. So this script explains Optimizely in plain language while walking through the site, and shows live where content is coming from the CMS.

Use this structure:

- Each section has a clear time slot.
- Each section tells you what to **show**, what to **say**, and what to **point to**.
- You do not need to think on the spot. Just follow the script.

## Session Goal

By the end of 30 minutes the audience should understand:

1. What Optimizely CMS is, in simple terms.
2. What we built for Summit Advisory Group.
3. How the website talks to Optimizely.
4. How content created in Optimizely shows up on the live site.
5. What is already working end-to-end.
6. What the next phase would look like.

## Presenter Reminder

- Speak slowly.
- Do not use jargon without explaining it.
- Keep saying "this is how it would work for a content team" or "this is what a business user sees".
- Avoid code. Avoid GraphQL details. Avoid env var values.
- If something breaks, switch to the mock view and keep talking about capability.

---

## 30-Minute Flow at a Glance

| Time | Segment | What you cover |
| --- | --- | --- |
| 0:00 - 3:00 | Welcome and goal | Frame today, what we built, what we will show |
| 3:00 - 7:00 | What Optimizely CMS is | Plain-language explanation for the non-Optimizely audience |
| 7:00 - 10:00 | How our site connects to Optimizely | High-level integration story |
| 10:00 - 14:00 | Homepage and navigation | Show the live site and connect it to CMS concepts |
| 14:00 - 18:00 | Service and industry pages | Show that pages are content types, not hand-built screens |
| 18:00 - 22:00 | Articles and content discovery | Show how editorial content scales through the CMS model |
| 22:00 - 25:00 | Localization and multilingual content | Show that the same model supports multiple languages |
| 25:00 - 27:00 | Forms, lead capture, subscription | Show that the POC supports real business outcomes |
| 27:00 - 29:00 | Editorial workflow: preview and publishing | Show the CMS-to-site update story |
| 29:00 - 30:00 | Close and what comes next | Strong, confident summary |

---

## 0:00 - 3:00

## Welcome and Goal of Today

### What to show

Open the homepage at:

`/en`

Keep it visible while you talk.

### What to say

> Thanks for joining. The goal of today's session is to walk through the Optimizely CMS integration with Next.js for the Summit Advisory Group POC.

> Most of you are not coming from an Optimizely background, so I will keep the session focused on the business and product picture rather than technical internals.

> What I am going to cover in the next 30 minutes is structured like this:
>
> First, I will explain what Optimizely CMS actually is, in simple terms.
>
> Then I will explain how our website connects to it.
>
> Then I will walk through the live site, and at each step I will show you which parts are coming from the CMS.
>
> After that I will cover localization, lead capture, subscription, and the editorial preview and publishing flow.
>
> I will close with what is already working and what the next phase would look like.

### Transition

> Before I go to the site, let me first explain Optimizely CMS clearly, because that is the foundation of everything we are showing today.

---

## 3:00 - 7:00

## What Optimizely CMS Is

### What to show

You can stay on the homepage screen while explaining.

If you have the Optimizely CMS editor open in a tab, switch to it for a moment so the audience can see where editors work, then come back to the site.

### What to say

> Optimizely CMS is a content management system used by enterprise marketing and content teams. The simplest way to think about it is:
>
> Optimizely is where business and content teams create, organize, and publish website content.
>
> The website itself, the part the visitor actually sees, is built separately. In our case, that is the Next.js application we are looking at right now.

> What makes Optimizely useful for a business is three things:
>
> 1. Content is structured. Editors are not writing raw HTML. They are filling in fields like Hero text, Services, Contact information, and so on.
>
> 2. Content is organized by content types. So instead of one giant page, content lives as Pages, Blocks, and reusable components.
>
> 3. Content has a workflow. There is a clear separation between Draft and Published versions, so editors can review changes before they are live.

> So when business teams work in Optimizely, they are not touching the website code. They are working in the content layer, and the website renders that content automatically.

### Key terms to introduce briefly

> A few terms you will hear me use:
>
> - "Content type" means a kind of page or kind of block defined in Optimizely.
>
> - "Block" means a reusable section like Hero, Services, Contact, or Testimonials.
>
> - "Optimizely Graph" is the way our website asks Optimizely for content. Think of it as the bridge between the CMS and the website.
>
> - "Draft" and "Published" are the editorial states content can be in.

### Transition

> Now that you have the picture of what Optimizely is, let me explain how our specific Next.js site connects to it.

---

## 7:00 - 10:00

## How Our Website Connects to Optimizely

### What to show

Stay on the homepage.

If useful, briefly mention the .env file conceptually but do not display it on screen.

### What to say

> Our Next.js site is designed so that the same site can either run from a built-in mock content set or from a real Optimizely CMS, without changing how the pages render.

> The way that works is simple to describe:
>
> There is a small CMS layer inside the project. When a page is requested, this layer decides whether to ask Optimizely for the content or use the built-in mock content. The visitor always sees a complete page either way.

> The connection to Optimizely is configured through a small set of environment values. Just by name, these are:
>
> - `CMS_PROVIDER` - this tells the site whether to use Optimizely or mock content.
>
> - `OPTIMIZELY_RENDER_URL` and `OPTIMIZELY_RENDER_KEY` - these tell the site how to ask Optimizely for published content.
>
> - `OPTIMIZELY_GRAPH_APP_KEY` and `OPTIMIZELY_GRAPH_SECRET` - these tell the site how to fetch draft content for preview.
>
> - `PREVIEW_SECRET` - this protects the preview link.
>
> - `REVALIDATE_SECRET` - this protects the webhook that triggers content refresh after a publish.

> You do not need to remember those names. The point is that the integration is configured, not hardcoded, so it can be moved between environments cleanly.

### Content flow in one sentence

> The flow we built can be described in one sentence: a content team publishes in Optimizely, our site asks Optimizely for the latest content, and the published change shows up on the site.

### Transition

> With that picture, let me now walk through the actual website and show you which parts are coming from the CMS as we go.

---

## 10:00 - 14:00

## Homepage and Navigation

### What to show

Stay on:

`/en`

Scroll slowly through the homepage. Use the navigation in the header.

### What to say

> This is the homepage of the Summit Advisory Group POC.

> The important thing here is that this page is not hand-coded as a single screen. It is built from content sections that map to what Optimizely calls Blocks.

> For example, the top of the page is a Hero section, then we have Services, then Story, then a Testimonials section, then a Contact section near the bottom. Each of those corresponds to a block type that an editor can manage in Optimizely.

> The header navigation and the footer also follow this pattern. Both come from dedicated Header and Footer content types in Optimizely. So a content team can change the navigation labels and footer columns from the CMS, without touching the website code.

### What to point at while speaking

- The Hero area at the top of the homepage.
- A mid-page section like services, story, or testimonials.
- The footer.
- The top navigation.

### Business message

> The takeaway here is that the homepage is already content-driven. Once Optimizely is connected, every block you see on this page becomes something a content team can change from the CMS.

---

## 14:00 - 18:00

## Service and Industry Pages

### What to show

Open:

`/en/services/digital-platform-strategy`

Then open:

`/en/industries/healthcare-financial-resilience`

### What to say on the service page

> This is a service-focused page. In Optimizely terms, this is one of our main page content types, called `CMSPage`.

> What that means in practice is that every service page in the future, whether it is a digital advisory service, a risk service, or something new, follows the same structure. The editor fills in the same set of fields, and the website renders it consistently.

> So we are not building a custom page every time the business adds a service. We are configuring a new entry inside the same content model.

### What to say on the industry page

> This is an industry-focused page. Same content type underneath, different content inside.

> This is important because the business often needs both kinds of pages, service-led and industry-led. With this setup, both come out of the same model, just with different content. That is exactly the kind of reuse a CMS-driven model is meant to enable.

### Tie back to Optimizely

> In Optimizely, an editor would create one of these pages by choosing the page type, adding the relevant blocks, and publishing. After that, the page appears on the live site automatically, in the same shape you see now.

---

## 18:00 - 22:00

## Articles, Resource Center, and Content Discovery

### What to show

Open:

`/en/resource-center`

Then:

`/en/article/all`

Then open one article detail page, for example:

`/en/article/why-speed-is-the-missing-link-in-automotive-smart-factory-roi`

### What to say on the resource center

> This is the resource center. For a marketing or advisory business, this is one of the most valuable parts of a site, because it gives the business a place to publish insights, thought leadership, and supporting content.

> This page is also a Page content type in our model. So the structure is defined once, and content is added over time.

### What to say on the article listing

> This is the full article listing view. Every entry you see here is an article that lives as its own content item.

> The important point is that this listing scales. If a content team publishes one article today and twenty more next month, the listing keeps working without anyone touching the site code.

### What to say on the article detail page

> At the article level, this is where content really earns its value. The article supports credibility, education, and indirectly supports lead generation, because every article connects back into the broader site journey.

### Tie back to Optimizely

> In Optimizely, articles like this are created by editors as content items, with fields like Title, Summary, Image, Topics, Author, and the article body. Once published, they appear in the listing and detail pages on the live site automatically, and our search and related-content logic picks them up.

---

## 22:00 - 25:00

## Localization and Multilingual Content

### What to show

Open:

`/es`

Then:

`/es/resource-center`

If useful, also open:

`/es/contact`

### What to say

> One of the strengths of Optimizely as a platform, and one of the strengths of how we built this POC, is multilingual content support.

> The same page content type can have English and Spanish versions. The URL changes from `/en` to `/es`, and the site automatically picks up the Spanish version when available.

> If a Spanish version does not exist, the system has a fallback so the visitor still sees a complete page instead of a blank screen.

> From the editor's point of view, this means a content team can manage multiple language versions of the same page from one CMS, instead of running two separate websites.

### Business message

> The takeaway here is that multilingual delivery is built into the model. It is not a future enhancement. It is already working.

---

## 25:00 - 27:00

## Forms, Lead Capture, and Subscription

### What to show

Open:

`/en/contact`

Then open:

`/subscription`

If pre-tested, submit one clean sample lead entry, and optionally one subscription entry.

### What to say on the contact page

> This page is where the POC moves from content into business outcome. A visitor can go from reading content to actually submitting a structured inquiry.

> This lead form is captured by the application and persisted, so the business can follow up.

### What to say on the subscription page

> This is a second engagement path. Instead of only direct leads, the site also supports subscription. That allows the business to build a longer-term audience rather than treating every visit as one-time.

### Tie back to the bigger picture

> So at this point, you have seen content from the CMS, structured pages, multilingual delivery, and now actual conversion flows. That is what makes this more than a UI prototype.

---

## 27:00 - 29:00

## Editorial Workflow: Preview and Publishing

### What to show

If preview was already tested and is stable today:

Open the preview link briefly and return to the homepage.

If preview is not validated for today, do not open it. Just explain it.

### What to say

> One of the key reasons businesses choose Optimizely is the editorial workflow. So I want to explain how that works in our setup.

> Editors work on content in Optimizely as a draft. They can preview the draft on a special preview link that shows draft content while the public site continues to show only published content.

> When the editor publishes the change, Optimizely sends a signal to our website. The website refreshes the affected content automatically, so visitors see the new version without a manual deployment.

> That means a content change in Optimizely can become a live site update without involving the engineering team for every edit.

### Safe line if you do not show preview live

> For this session I am intentionally keeping the focus on the stable business flows. The preview and publishing pattern is already part of the architecture and ready to be exercised in the next phase.

---

## 29:00 - 30:00

## Close and What Comes Next

### What to show

Return to the homepage or stay on the cleanest page.

### What to say

> To close, here is what this POC already proves end to end.
>
> We have a real marketing site that supports multiple page types, reusable content blocks, multilingual delivery, content discovery, article journeys, lead capture, subscription, and an editor-friendly preview and publishing flow.
>
> The integration with Optimizely is built into the architecture, not bolted on. The site can work against mock content during development and against Optimizely-managed content in production, using the same rendering layer.
>
> The next phase is production hardening: finalizing the Optimizely content model, cleaning up access and security, validating publishing workflows end-to-end with the business team, and preparing rollout.

> I am happy to take questions.

---

## Quick Reference for the Audience

You can paste this into chat after the session if useful.

### What is this POC

> A Next.js website for Summit Advisory Group, designed to work with Optimizely CMS as the content source.

### What is Optimizely CMS in one line

> Optimizely CMS is where business and content teams create and publish structured website content.

### What is connected

> Pages, blocks, header, footer, multilingual content, articles, and editorial preview/publish flow.

### How content reaches the site

> The website asks Optimizely for content through Optimizely Graph. Published content is shown to visitors. Draft content is visible only through the preview link.

### Configuration values used

> CMS_PROVIDER, OPTIMIZELY_RENDER_URL, OPTIMIZELY_RENDER_KEY, OPTIMIZELY_GRAPH_APP_KEY, OPTIMIZELY_GRAPH_SECRET, PREVIEW_SECRET, REVALIDATE_SECRET.

### What is working today

> Page rendering, navigation, services, industries, articles, search, contact form, subscription, multilingual delivery, and Optimizely connectivity through Graph.

### What comes next

> Production hardening, full editorial flow validation, content model finalization, and rollout readiness.

---

## Q and A Cheat Sheet

### If asked: What does Optimizely actually do?

> Optimizely lets business and content teams create, organize, and publish structured website content without changing the website code.

### If asked: Why Next.js?

> Because it lets us render fast, content-aware pages, while keeping the connection to Optimizely clean. The user gets a polished site, and the content team gets a CMS-driven workflow.

### If asked: Is this just frontend?

> No. The site supports real business flows like lead capture, subscription, and editorial preview, and it can read live content from Optimizely.

### If asked: How are pages structured?

> Pages are content types in Optimizely, made up of reusable blocks like Hero, Services, Story, Testimonials, and Contact. The site renders those blocks consistently.

### If asked: How does a new article appear on the site?

> An editor creates the article in Optimizely. After publishing, our site asks Optimizely for the latest content, and the article appears in the listing and as a detail page automatically.

### If asked: How do you preview a draft?

> Through a dedicated preview link protected by a secret. That link shows draft content. The public site continues to show only published content.

### If asked: What needs to happen before production?

> Final content model alignment, security and access cleanup, publishing workflow validation with business users, and rollout planning.

---

## Emergency Recovery Lines

If something breaks live, use one of these immediately:

1. > I will continue with the stable business flow. The point is what the platform supports, not one environment detail.

2. > The rendering layer is the same whether content comes from Optimizely or from the built-in mock content, so I will move on without losing the message.

3. > Rather than spending time on a single integration detail, let me move forward through the journey.

---

## Final Reminder

- This session is about value, not code.
- Keep tying every page back to the CMS story.
- Stay confident. You built it.
- The final impression you want to leave is: this POC is real, it works, and it is ready for the next phase.
