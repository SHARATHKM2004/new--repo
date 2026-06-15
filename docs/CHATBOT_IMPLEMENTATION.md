# Summit Assistant — Chatbot Implementation Documentation

End-to-end documentation of the floating chatbot widget that appears bottom-right on every public page of the Summit (Wipfli) website. Covers everything from goal to final code, files, request/response flow, and CMS grounding.

---

## 1. Goal

Add a website chatbot that:

- Appears as a **floating launcher** in the bottom-right corner of every public page.
- Expands into a **chat panel** when clicked.
- Greets the visitor and offers **suggested questions** as one-click chips.
- Answers free-text questions **grounded in the actual CMS content** of the site (articles, services, industries, locations, contact, subscribe, sign-in pages).
- Cites the CMS pages it used as **clickable sources** under each answer.
- Falls back to a polite general answer when no relevant CMS content matches (hybrid mode).
- Visually matches the site (same blue as the footer — `#1247ff`).
- Does **not** appear in the admin area (`/admin/*`).

Non-goals: account/session persistence, voice input, file upload, multi-step agents.

---

## 2. Tech choices

| Concern | Choice | Why |
| --- | --- | --- |
| LLM provider | OpenAI (`gpt-4o-mini`) via direct `fetch()` | Cheapest capable model; matches the pattern already used in `src/lib/ai/content-assist.ts`; zero new dependencies |
| Grounding strategy | RAG (Retrieval-Augmented Generation) against Optimizely Graph | Keeps answers on-brand and current; new CMS pages instantly improve the bot |
| Retrieval scoring | In-memory keyword overlap with a small stopword list | Site is small (a few hundred pages); no vector DB needed |
| UI | React client component with Tailwind v4 | Matches the rest of the project |
| Streaming | Not used — single JSON response with `{reply, sources}` | Simpler; latency is fine for this volume |
| Persistence | None — messages live in browser state only | Per-tab; per request from the user |
| Rate limiting | Per-IP in-memory, 20 requests/min | Demo-grade abuse guard |
| New dependencies | **Zero** | Reuses existing fetch patterns |

---

## 3. Files created / modified

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts                  ← NEW  HTTP endpoint POST /api/chat
│   └── [locale]/
│       └── layout.tsx                    ← MODIFIED  mounts <ChatbotWidget/>
├── components/
│   └── chatbot/
│       └── chatbot-widget.tsx            ← NEW  the floating widget UI
└── lib/
    └── ai/
        └── retrieve-cms-context.ts       ← NEW  RAG retrieval from Optimizely Graph
```

| File | Role |
| --- | --- |
| [src/components/chatbot/chatbot-widget.tsx](../src/components/chatbot/chatbot-widget.tsx) | Client component. Launcher button + panel + messages + suggested chips + input + typing indicator + source-citation rendering. |
| [src/app/api/chat/route.ts](../src/app/api/chat/route.ts) | Server route. Validates body, calls RAG retrieval, builds the system prompt, calls OpenAI, returns `{ reply, sources }`. Includes per-IP rate limit. |
| [src/lib/ai/retrieve-cms-context.ts](../src/lib/ai/retrieve-cms-context.ts) | Queries Optimizely Graph for all CMS pages, scores them by keyword overlap with the user's question, returns top N snippets. |
| [src/app/[locale]/layout.tsx](../src/app/%5Blocale%5D/layout.tsx) | Renders `<ChatbotWidget locale={locale} />` once per locale layout, so it appears site-wide except in `/admin/*` (which uses its own layout). |

---

## 4. End-to-end request flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Browser                                                                 │
│                                                                         │
│  ┌──────────────────┐                                                   │
│  │  Launcher button │  (always on, bottom-right)                        │
│  └────────┬─────────┘                                                   │
│           │ click                                                       │
│           ▼                                                             │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Chat panel                                                       │   │
│  │ ─────────────────────────────────────────────────────────────    │   │
│  │ greeting + suggested chips                                       │   │
│  │   user types ──► POST /api/chat                                  │   │
│  │   { messages, locale }                                           │   │
│  └────────┬─────────────────────────────────────────────────────────┘   │
└───────────┼─────────────────────────────────────────────────────────────┘
            │ fetch
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Next.js server (Vercel)                                                 │
│ src/app/api/chat/route.ts                                               │
│                                                                         │
│   1. parse body, sanitise messages                                      │
│   2. per-IP rate limit                                                  │
│   3. retrieveCmsContext(question, locale)  ◄── lib/ai/retrieve-cms-…    │
│   4. buildSystemPrompt(snippets, locale)                                │
│   5. fetch OpenAI chat/completions                                      │
│   6. respond { reply, sources }                                         │
└───────────┬─────────────────────────────────┬───────────────────────────┘
            │                                 │
            ▼                                 ▼
┌─────────────────────────────┐   ┌─────────────────────────────────────┐
│ Optimizely Graph            │   │ OpenAI API                          │
│ POST /content/v2            │   │ POST /v1/chat/completions           │
│ returns CMSPage items       │   │ returns chat completion             │
└─────────────────────────────┘   └─────────────────────────────────────┘
```

---

## 5. Stage 1 — UI (the floating widget)

[src/components/chatbot/chatbot-widget.tsx](../src/components/chatbot/chatbot-widget.tsx)

It's a single client component (`"use client"`). State is local React state — no global store, no context, no persistence.

### State

```tsx
const [open, setOpen] = useState(false);
const [messages, setMessages] = useState<Message[]>([
  { role: "assistant", content: GREETING },
]);
const [input, setInput] = useState("");
const [pending, setPending] = useState(false);
```

### Layout

- **Launcher** (when `!open`): a `fixed bottom-5 right-5` round blue button with a chat-bubble icon. Hidden when the panel is open.
- **Panel** (when `open`): a 380×600 card with three regions:
  1. Header — blue (`bg-[#1247ff]`), title, clear button, close button.
  2. Scrollable message list — bubbles, suggested chips (only before the first user message), typing dots while waiting for response.
  3. Input bar — `<textarea>` + send button. Enter sends, Shift+Enter newlines.

### Colour palette (matches site footer)

| Element | Class |
| --- | --- |
| Header / launcher / send / user bubble | `bg-[#1247ff]` |
| Hover state | `bg-[#0a39d6]` |
| Chip border / link / focus ring | `border-[#1247ff]`, `text-[#1247ff]`, `focus:ring-[#1247ff]` |

### The send function

This is the central client-side method — it appends the user's message, calls the API, and appends the assistant reply.

```tsx
const sendMessage = useCallback(async (text: string) => {
  const trimmed = text.trim();
  if (!trimmed || pending) return;

  const nextMessages: Message[] = [
    ...messages,
    { role: "user", content: trimmed },
  ];
  setMessages(nextMessages);
  setInput("");
  setPending(true);

  try {
    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages.map(({ role, content }) => ({ role, content })),
        locale,
      }),
    });
    const data = await resp.json() as { reply?: string; sources?: Source[] };
    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content: data.reply?.trim() || "Sorry, I couldn't generate a response.",
        sources: data.sources ?? [],
      },
    ]);
  } catch {
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "I couldn't reach the assistant right now." },
    ]);
  } finally {
    setPending(false);
  }
}, [messages, pending, locale]);
```

### Message rendering

Each bubble renders the message text and — for assistant messages with sources — a small list of clickable citations underneath.

```tsx
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
        isUser
          ? "bg-[#1247ff] text-white"
          : "bg-white text-gray-800 ring-1 ring-gray-200"
      }`}>
        <RichText text={message.content} />
        {!isUser && message.sources && message.sources.length > 0 ? (
          <div className="mt-2 space-y-1 border-t border-gray-200 pt-2">
            {message.sources.slice(0, 4).map((s, i) => (
              <a key={i} href={s.url} className="block truncate text-xs text-[#1247ff] hover:underline">
                {s.type}: {s.title}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
```

`RichText` is a tiny inline renderer that turns `[label](url)` markdown links (which the model is allowed to emit) into real anchors, while preserving line breaks. We chose this over pulling in a markdown library to keep zero new dependencies.

### Mounting it once on every locale page

[src/app/[locale]/layout.tsx](../src/app/%5Blocale%5D/layout.tsx)

```tsx
import { ChatbotWidget } from "@/components/chatbot/chatbot-widget";

// ...
return (
  <div className="site-shell flex min-h-screen flex-col">
    <SiteHeader ... />
    {children}
    <SiteFooter ... />
    <ChatbotWidget locale={locale} />
  </div>
);
```

Because `/admin/*` has its own root layout (no locale segment), the widget never renders there — no extra conditional needed.

---

## 6. Stage 2 — Server route (`/api/chat`)

[src/app/api/chat/route.ts](../src/app/api/chat/route.ts)

A standard Next.js App Router POST handler:

```ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Parse body
  const body = await request.json();
  const messages = (body.messages ?? [])
    .filter(/* valid role + string content */)
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_USER_MESSAGE_CHARS) }));

  const lastUser = [...messages].reverse().find(m => m.role === "user");
  if (!lastUser?.content.trim()) return NextResponse.json({ error: ... }, { status: 400 });

  // 2. Rate limit per IP
  if (!checkRateLimit(clientKey(request))) return NextResponse.json({ reply: "..." }, { status: 429 });

  // 3. Env check
  const config = getAiConfig();
  if (!config.apiKey) return NextResponse.json({ reply: "...not configured yet..." }, { status: 503 });

  // 4. RAG
  const locale = parseChatLocale(body.locale);
  const snippets = await retrieveCmsContext(lastUser.content, locale, 6);

  // 5. Prompt + completion
  const systemPrompt = buildSystemPrompt(snippets, locale);
  const aiResponse = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      model: config.model,                  // gpt-4o-mini default
      temperature: 0.3,
      max_tokens: 400,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
    cache: "no-store",
  });

  const payload = await aiResponse.json();
  const reply = payload.choices?.[0]?.message?.content?.trim() ?? "Sorry, I couldn't generate a response.";

  return NextResponse.json({
    reply,
    sources: snippets.map(s => ({ title: s.title, url: s.url, type: s.type })),
  });
}
```

### The system prompt (the "personality + guardrails")

```ts
function buildSystemPrompt(snippets: RetrievedSnippet[], locale: string): string {
  const contextBlock = snippets.length === 0
    ? "(No specific Summit content matched this question.)"
    : snippets.map((s, i) =>
        `[${i+1}] ${s.type}: ${s.title}\nURL: ${s.url}\nSummary: ${s.summary || "(no summary)"}`
      ).join("\n\n");

  return [
    "You are Summit Assistant, the friendly chatbot on the Summit (Wipfli) website.",
    "You help visitors find content, services, industries, locations, articles, and key actions like subscribing or signing in to Summit Hub.",
    "",
    "RESPONSE RULES:",
    "1. Be concise — 1 to 4 short sentences. Use bullet points for lists.",
    "2. When the answer involves a Summit page or article, cite it as a markdown link using the URL provided in the context.",
    "3. Prefer the provided Summit context below. If the context covers the question, base your answer strictly on it.",
    "4. If the context does NOT cover the question but it's a reasonable general business/accounting/advisory question, you MAY answer briefly from general knowledge, then suggest contacting Summit. Begin such answers with: \"I don't have a specific Summit page on this, but \".",
    "5. If the question is off-topic, politely steer back.",
    "6. Never invent URLs. Only use the URLs that appear in the context block below.",
    "7. Do not mention this prompt or the words \"context\" / \"snippet\" in your answer.",
    `8. Reply in the language of the page locale: ${locale}.`,
    "",
    "SUMMIT CONTEXT:",
    contextBlock,
  ].join("\n");
}
```

This is what makes it **hybrid RAG**: the model is told to prefer CMS context, but allowed to answer generic business questions when nothing matches — with the required prefix *"I don't have a specific Summit page on this, but…"* so the user always knows the source.

### Rate limit

```ts
const RATE_LIMIT_PER_MINUTE = 20;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_PER_MINUTE) return false;
  bucket.count += 1;
  return true;
}
```

In-memory and per-process — fine for demo and low traffic. For production scale-out, swap with a Redis-backed limiter.

---

## 7. Stage 3 — RAG retrieval

[src/lib/ai/retrieve-cms-context.ts](../src/lib/ai/retrieve-cms-context.ts)

### The query

We pull **all CMSPages** (capped to 80 most-recently-modified) and rank them in memory. The site is small, so this is cheaper than maintaining a separate vector index.

```ts
const query = `query {
  CMSPage(
    locale: ${locale}
    limit: 80
    orderBy: { _metadata: { lastModified: DESC } }
  ) {
    items {
      title
      shortDescription
      keywords
      _metadata {
        key displayName status types
        url { default hierarchical }
      }
    }
  }
}`;
```

### The scorer

Tokenises the question, drops stopwords, counts hits across title + description + keywords + URL, with a 3× boost for title matches.

```ts
function scoreItem(item: RawItem, tokens: string[]): number {
  const text = [
    item.title ?? "",
    item._metadata?.displayName ?? "",
    item.shortDescription ?? "",
    item.keywords ?? "",
    item._metadata?.url?.default ?? "",
  ].join(" ").toLowerCase();

  let score = 0;
  for (const t of tokens) {
    if (text.includes(t)) score += 1;
    if ((item.title ?? "").toLowerCase().includes(t)) score += 2;   // title boost
  }
  return score;
}
```

### The pipeline

```ts
const scored = items
  .filter(it => !it._metadata?.status || it._metadata.status.toLowerCase() === "published")
  .map(it => ({ item: it, score: scoreItem(it, tokens) }))
  .filter(row => row.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit);

// Fallback: if nothing matched (e.g. "hi"), return 3 latest articles
const finalRows = scored.length > 0
  ? scored.map(r => r.item)
  : items.filter(it => /\/article\//.test(it._metadata?.url?.default ?? "")).slice(0, 3);
```

### Page-type inference

Each snippet is labelled with a friendly type that appears in the "Sources" footer (`Article`, `Service`, `Industry`, `Location`, `Contact`, `Subscribe`, `Sign-in`, `Page`):

```ts
function inferType(path: string): string {
  if (/\/article\//.test(path))            return "Article";
  if (/\/services?\//.test(path))          return "Service";
  if (/\/industries?\//.test(path))        return "Industry";
  if (/\/locations?\//.test(path))         return "Location";
  if (/\/contact|\/rfp/.test(path))        return "Contact";
  if (/\/subscri/.test(path))              return "Subscribe";
  if (/\/login|\/sign-?in|\/hub/.test(path)) return "Sign-in";
  return "Page";
}
```

---

## 8. Stage 4 — Reply rendering

The widget receives `{ reply, sources }` and pushes one assistant `Message`. The bubble renders the markdown links inside `reply`, and the source list underneath.

Example response from `/api/chat`:

```json
{
  "reply": "We serve 12 industries including financial services, manufacturing and distribution, healthcare, and technology. See [What does Wipfli do for healthcare?](/en/article/healthcare-modernization).",
  "sources": [
    { "title": "Healthcare modernization", "url": "/en/article/healthcare-modernization", "type": "Article" },
    { "title": "Industries we serve", "url": "/en/industries", "type": "Industry" }
  ]
}
```

The widget renders that as one assistant bubble with the inline link, plus a "Sources" footer with two clickable items.

---

## 9. Environment variables

| Var | Required | Default | Purpose |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | ✅ | — | The OpenAI key. Without it the bot returns a polite "not configured yet" message. |
| `AI_API_KEY` | (alias) | — | Alternate name accepted for parity with `content-assist.ts`. |
| `AI_BASE_URL` | optional | `https://api.openai.com/v1` | Override to point at Azure OpenAI or any compatible endpoint. |
| `AI_CHAT_MODEL` | optional | `gpt-4o-mini` | Model used for chat. Falls back to `AI_MODEL` / `OPENAI_MODEL`. |
| `OPTIMIZELY_RENDER_URL` | ✅ | — | Already set; used by RAG retrieval. |
| `OPTIMIZELY_RENDER_KEY` | ✅ | — | Already set; used by RAG retrieval. **Must be the non-production sandbox key**. |

For production deployment on Vercel, add the same vars under **Settings → Environment Variables** and redeploy.

---

## 10. Behavior matrix

| Situation | Result |
| --- | --- |
| User opens panel for first time | Greeting + 6 suggested-question chips visible |
| User clicks a chip | The chip's text is sent as a user message |
| User types and hits Enter | Same as click (Shift+Enter inserts newline) |
| OpenAI key missing | Bot replies `"The assistant isn't fully configured yet. Please check back soon!"` (HTTP 503) |
| Too many requests from one IP | `"I'm getting a lot of questions right now — please try again in a minute."` (HTTP 429) |
| OpenAI unreachable | `"I couldn't reach the assistant right now. Please try again shortly."` (HTTP 502) |
| User asks about CMS content | Grounded answer + clickable sources |
| User asks generic business question | `"I don't have a specific Summit page on this, but…"` |
| User asks off-topic | `"I'm focused on Summit content — try asking about our services, industries, articles, contact info, or how to sign in."` |
| User clicks the refresh icon | Conversation resets to the initial greeting |
| User clicks × | Panel closes; launcher returns; conversation is preserved within the tab |

---

## 11. Security and privacy notes

- The endpoint is **public** (no auth) so anyone can chat. This is intentional for a public website widget.
- Per-IP rate limit (20/min) blocks naive abuse.
- The OpenAI API does **not** train on requests made through `api.openai.com` (different from consumer ChatGPT). Standard 30-day abuse-monitoring retention.
- The chatbot reads CMS content from whatever `OPTIMIZELY_RENDER_URL` + `OPTIMIZELY_RENDER_KEY` are set to. Today these point at the **Test2 sandbox**, not production. Keep it that way.
- Only **already-public** CMS content (title, short description, URL) is sent to OpenAI. No drafts, no internal-only fields.

---

## 12. Cost expectations

Using `gpt-4o-mini` at current pricing (~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens):

- Each chat turn averages ~800 input tokens (system prompt + 6 snippets + 3-5 messages) and ~120 output tokens.
- Cost per turn: roughly **$0.0002**.
- 100 chats/day × 5 turns each × 30 days = **~$3/month**. Well inside demo budget.

---

## 13. How we built it — the journey

1. **Sized the options.** Walked through three approaches with the user: static keyword bot, dynamic RAG bot, or a hybrid. Chose **hybrid RAG** for the right mix of usefulness, demo polish, and on-brand grounding.
2. **Inspected the existing AI scaffolding.** Found `src/lib/ai/content-assist.ts` already calling OpenAI via plain `fetch()`. Reused that pattern — no AI SDK install, no new dependencies.
3. **Built [retrieve-cms-context.ts](../src/lib/ai/retrieve-cms-context.ts)** first: one GraphQL call against `CMSPage`, in-memory tokenisation + scoring, page-type inference for friendly source labels. Includes a sensible fallback when no tokens match (e.g. "hi") — returns the 3 latest articles so the bot has something useful to say.
4. **Built [route.ts](../src/app/api/chat/route.ts):** body validation → per-IP rate limit → RAG retrieval → system-prompt assembly with strict response rules (cite sources, never invent URLs, hybrid fallback prefix) → OpenAI chat completion → return `{reply, sources}`.
5. **Built [chatbot-widget.tsx](../src/components/chatbot/chatbot-widget.tsx):** floating launcher → expandable panel → message bubbles → suggested chips on the first turn → typing indicator while pending → inline-link rendering for `[text](url)` so the bot can produce real anchors → source-citation footer per assistant bubble.
6. **Mounted it once** in `src/app/[locale]/layout.tsx`. Because admin uses a separate root layout, no admin-route exclusion logic was needed.
7. **Verified the build** with `next build`. Confirmed `/api/chat` appeared in the route table alongside `/api/portal/insights` and existing routes — no regressions.
8. **Pushed to GitHub.** Vercel auto-deployed.
9. **Polish pass:** recoloured the whole widget to use the site footer blue `#1247ff` with a darker hover state `#0a39d6`, so the chatbot feels native to the Summit brand.
10. **Did NOT touch** any of the user's other in-progress files (`block-mapper-content.ts`, `ai-helper/`, `api/admin/ai/`, etc.) — only chatbot-related files were staged and committed.

End result: a brand-consistent, CMS-grounded, demo-ready chatbot that lives on every public page, costs cents per month to run, and has zero new dependencies.
