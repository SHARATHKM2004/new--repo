# Mentor Meeting Script

## 1. Opening script

Say:

"I built this project to prove a real website workflow where developers control the frontend in VS Code and content authors control content in Optimizely CMS. The goal was not just to build pages, but to build the complete working path from local development to CMS integration, preview, publish, and deployment."

Show:

- [MENTOR_HANDOFF.md](c:\Users\koris\project\MENTOR_HANDOFF.md)

If asked what the main goal was, say:

"The main goal was to make sure UI changes can be done locally in code, content changes can be done in Optimizely, and both localhost and the deployed app reflect those changes correctly."

If asked what the advanced goal was, say:

"The advanced goal was to connect this to real Optimizely SaaS CMS, support unpublished preview, support publish revalidation, and deploy the same app publicly so the full workflow works end to end."

## 2. Project summary script

Say:

"Technically, this is a Next.js 16 App Router project using React, TypeScript, Tailwind, and an Optimizely Graph integration layer. I built a typed CMS abstraction so the app does not depend directly on raw CMS JSON. Instead, CMS data is normalized into internal page and block models and then rendered through shared React components."

Show:

- [README.md](c:\Users\koris\project\README.md)
- [src/lib/cms/index.ts](c:\Users\koris\project\src\lib\cms\index.ts)
- [src/lib/cms/types.ts](c:\Users\koris\project\src\lib\cms\types.ts)

If asked why that matters, say:

"That separation makes the frontend more stable and maintainable, because UI components only deal with normalized application models, not with CMS-specific response shapes."

## 3. Architecture script

Say:

"The frontend is split into a few clear layers. The site chrome lives in header and footer components. The CMS rendering layer is split into a page renderer and a block renderer. The CMS integration layer handles fetching, normalization, preview logic, and fallback behavior. API routes handle preview, revalidation, webhook processing, and diagnostics."

Show:

- [src/components/site/site-header.tsx](c:\Users\koris\project\src\components\site\site-header.tsx)
- [src/components/site/site-footer.tsx](c:\Users\koris\project\src\components\site\site-footer.tsx)
- [src/components/cms/page-renderer.tsx](c:\Users\koris\project\src\components\cms\page-renderer.tsx)
- [src/components/cms/block-renderer.tsx](c:\Users\koris\project\src\components\cms\block-renderer.tsx)
- [src/app/api/optimizely/health/route.ts](c:\Users\koris\project\src\app\api\optimizely\health\route.ts)

If asked why a block renderer exists, say:

"Because the CMS sends modular content. A block renderer lets us support reusable content sections like hero, rich text, stats, quote, CTA, and featured content without hardcoding each page layout."

## 4. What was built script

Say:

"The implementation happened in five phases. First, I built the local app foundation with routing, rendering, and reusable sections. Second, I created a mock CMS layer so development could start before live Optimizely data was ready. Third, I integrated live Optimizely Graph content. Fourth, I added preview mode, revalidation, and webhook support. Fifth, I deployed it to Vercel and fixed production so it uses the same live CMS connection as localhost."

Show:

- [MENTOR_HANDOFF.md](c:\Users\koris\project\MENTOR_HANDOFF.md)

If asked what is working today, say:

"Localhost reads live Optimizely content, production reads live Optimizely content, preview infrastructure is implemented, revalidation and webhook routes exist, and the deployment health route confirms live CMS connectivity."

## 5. Demo 1: local frontend control

Say:

"First I want to show that the frontend is developer-controlled in VS Code. This is important because layout, styling, and interaction logic should remain application-owned and not be embedded inside the CMS."

Show:

- [src/components/site/site-header.tsx](c:\Users\koris\project\src\components\site\site-header.tsx)
or
- [src/components/cms/block-renderer.tsx](c:\Users\koris\project\src\components\cms\block-renderer.tsx)

Say while showing code:

"This is where the UI structure lives. If I want to change spacing, labels, layout, colors, or rendering behavior, I do it here in code. That means the developer owns the experience and the CMS only provides the content."

If you want to make a tiny visible change live, say:

"I can make a small frontend change here, refresh localhost, and the UI updates immediately. That proves the local developer workflow is in place."

If asked why not do all of this in CMS, say:

"Because presentation logic, layout consistency, and maintainability are better handled in code. The CMS should control content, not own the full application structure."

## 6. Demo 2: local CMS content update

Say:

"Next I want to show the editor workflow. Here the content author changes content in Optimizely, and the application reflects that content without changing frontend code."

Show:

- Optimizely CMS authoring screen
- localhost at `http://localhost:3000/en`

Say while showing Optimizely:

"This StartPage and its blocks are authored in Optimizely. For example, this hero block contains the title and subtitle that appear on the homepage."

Then say:

"If I edit this field in Optimizely and save or publish it, the change appears in the application. That demonstrates CMS-controlled content running through the app."

What to show exactly:

1. Open `StartPage`
2. Open the hero block
3. Show the title and subtitle fields
4. Show localhost rendering the same values

What to say when it updates:

"This proves the site is not hardcoded locally. The displayed content is coming from Optimizely."

If asked why this matters, say:

"It separates responsibilities correctly. Developers maintain the product, editors maintain the message."

## 7. Demo 3: preview mode

Say:

"The next requirement was preview. Editors need to validate unpublished changes before they go live. So I implemented draft mode using Next.js preview plus Optimizely admin Graph credentials."

Show:

- deployed site or localhost in preview mode
- preview banner on the page

Say:

"When preview mode is enabled, the application fetches draft content instead of only public published content. The banner tells the user they are currently viewing draft content."

If the preview banner is visible, say:

"This is the preview confirmation. It means the route is in draft mode and the app is using the preview content path."

If asked why admin credentials are needed, say:

"Public render keys only guarantee published content. To preview unpublished changes, the app needs authorized Graph access."

## 8. Demo 4: deployed production site

Say:

"The next important part was deployment. I needed the same app to run publicly, not just on localhost."

Show:

- `https://project-coral-eight.vercel.app/en`

Say:

"This is the deployed production site. It now uses the same live Optimizely CMS connection as localhost. Earlier production was showing fallback content because Vercel environment variables were missing, and I fixed that by configuring the Optimizely values in production and redeploying."

If asked what exactly was broken, say:

"Local development had Optimizely credentials in `.env.local`, but Vercel production did not. So localhost was reading live CMS data while the deployed app fell back to mock content. After adding the production environment variables and redeploying, production started reading the same live Optimizely content."

## 9. Demo 5: health and diagnostics

Say:

"To make troubleshooting clear, I added a health route that confirms whether the app can reach Optimizely with both public and admin credentials."

Show:

- `https://project-coral-eight.vercel.app/api/optimizely/health`

Say when showing the JSON:

"This confirms the provider is enabled, the environment variables are configured, and both public and admin access to Optimizely Graph are reachable."

If asked why this route matters, say:

"It reduces guesswork. If content does not appear, this route tells us whether the issue is environment configuration, network access, or content modeling rather than frontend code."

## 10. Revalidation and publish flow script

Say:

"Published content also needs to update the deployed application cleanly. For that, I implemented a revalidation endpoint and an Optimizely webhook receiver."

Show:

- [src/app/api/revalidate/route.ts](c:\Users\koris\project\src\app\api\revalidate\route.ts)
- [src/app/api/optimizely/webhook/route.ts](c:\Users\koris\project\src\app\api\optimizely\webhook\route.ts)

Say:

"When content is published, the webhook can trigger invalidation of the affected content tags and refresh the deployed application paths. That closes the loop between authoring and production delivery."

If asked whether that is fully working, say:

"The infrastructure is implemented and deployed. The remaining work is mostly broader content population and a final pass of preview validation across all content types."

## 11. Completion status script

Say:

"At this point I consider the engineering foundation substantially complete. The local frontend workflow is complete. Localhost CMS-backed rendering is complete. Production CMS-backed rendering is complete. Preview infrastructure is implemented. Revalidation and webhook support are implemented. The main remaining work is content completion and reducing the final fallback-only areas."

If asked for percentage, say:

"Overall, I would report this as about 85 percent complete. The platform foundation is done. The remaining 15 percent is mostly content completeness, final preview verification, and removal of the last mock fallback surfaces once live authored content exists for those sections."

If asked for exact breakdown, say:

"Local frontend workflow is 100 percent complete. Localhost CMS-backed rendering is about 95 percent complete. Production CMS-backed rendering is about 95 percent complete. Draft preview implementation is about 85 percent complete. Full live replacement of mock content is about 60 percent complete because some content types still need real authored items in Optimizely."

## 12. What is completed script

Say:

"The completed items are: project scaffold, localized routing, shared frontend layout, typed CMS abstraction, mock provider, live StartPage and CMSPage integration, reusable Optimizely block mapping, preview routes and banner, revalidation route, webhook route, local lead capture, deployment, production CMS environment configuration, health diagnostics, and live-first helper behavior with fallback support."

If asked what that means in business terms, say:

"It means the application already supports the real engineering workflow that the project was meant to prove."

## 13. What is left script

Say:

"The remaining work is not foundational plumbing anymore. What is left is mainly content completion and polish. Specifically, real authored Header and Footer items should be created if fully CMS-driven chrome is required. More live authored content should be created for insights, authors, case studies, and resource listings. The last mock fallback areas should be removed once matching live content exists. A final end-to-end preview validation should also be completed across more content types."

If asked why those parts are still pending, say:

"Because some of those surfaces still depend on authored content not yet existing in Optimizely. The application can support them, but the live CMS inventory is not fully populated yet."

## 14. Short closing script

Say:

"In summary, this project successfully proves the intended architecture and workflow. Developers can control the frontend in VS Code, editors can control content in Optimizely, localhost and production both read live CMS data, preview infrastructure exists for draft validation, and deployment plus diagnostics are in place. The remaining work is mainly authoring completeness and final polish rather than core platform engineering."

## 15. Likely questions and direct answers

### Question: Why did you use a typed CMS abstraction instead of binding components directly to Optimizely responses?

Answer:

"Because a typed abstraction makes the frontend easier to maintain, reduces coupling to CMS response formats, and gives a stable rendering model across both mock and live content sources."

### Question: Why keep mock content at all?

Answer:

"Mock content allowed development to start before the full live Optimizely content inventory existed. It also acts as fallback for pages and listings that do not yet have live authored equivalents."

### Question: What was the hardest issue?

Answer:

"The biggest production issue was that localhost and deployed production were behaving differently because Vercel did not have the Optimizely environment variables. Once that was corrected and the app was redeployed, production started reading the same live CMS content as localhost."

### Question: What exactly proves this is connected to live CMS?

Answer:

"Two things prove it clearly. First, the visible StartPage and Hero values on localhost and production match the authored values in Optimizely. Second, the health route confirms that public and admin Graph access are both reachable."

### Question: Can someone else rebuild this from your documentation?

Answer:

"Yes. The repository now contains the app structure, CMS abstraction, preview and webhook routes, deployment setup, environment requirements, and a mentor handoff document explaining the implementation from start to finish."

### Question: If you had more time, what would you do next?

Answer:

"I would finish replacing the remaining fallback-backed listing surfaces with fully authored Optimizely content, complete broader preview validation, add live Header and Footer entries, and do a final polish pass on visual design and content modeling."

## 16. Fast fallback script if time is short

Say:

"I built a Next.js full-stack site integrated with Optimizely SaaS CMS. Developers control the frontend in VS Code, editors control content in Optimizely, localhost and production now both reflect live CMS content, draft preview and publish revalidation are implemented, and the remaining work is mainly content completion and final polish."