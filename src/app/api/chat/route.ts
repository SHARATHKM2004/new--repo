// Summit Assistant — public chat endpoint.
//
// Hybrid RAG: retrieves relevant CMS pages and grounds the OpenAI
// response in them. The model is instructed to prefer CMS context but
// MAY answer general business questions when nothing relevant is found.
//
// Public — no API key required. Light per-IP rate limit in-memory.

import { NextResponse } from "next/server";
import { parseChatLocale, retrieveCmsContext, type RetrievedSnippet } from "@/lib/ai/retrieve-cms-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const MAX_MESSAGES = 12;
const MAX_USER_MESSAGE_CHARS = 1000;
const RATE_LIMIT_PER_MINUTE = 20;

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

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

function buildSystemPrompt(snippets: RetrievedSnippet[], locale: string): string {
  const contextBlock =
    snippets.length === 0
      ? "(No specific Summit content matched this question.)"
      : snippets
          .map(
            (s, i) =>
              `[${i + 1}] ${s.type}: ${s.title}\nURL: ${s.url}\nSummary: ${s.summary || "(no summary)"}`,
          )
          .join("\n\n");

  return [
    "You are Summit Assistant, the friendly chatbot on the Summit (Wipfli) website.",
    "You help visitors find content, services, industries, locations, articles, and key actions like subscribing or signing in to Summit Hub.",
    "",
    "RESPONSE RULES:",
    "1. Be concise — 1 to 4 short sentences. Use bullet points for lists.",
    "2. When the answer involves a Summit page or article, cite it as a markdown link using the URL provided in the context (e.g. [Title](/en/article/slug)).",
    "3. Prefer the provided Summit context below. If the context covers the question, base your answer strictly on it.",
    "4. If the context does NOT cover the question but it's a reasonable general business/accounting/advisory question, you MAY answer briefly from general knowledge, then suggest contacting Summit. Begin such answers with: \"I don't have a specific Summit page on this, but \".",
    "5. If the question is off-topic (e.g. weather, jokes, code), politely steer back: \"I'm focused on Summit content — try asking about our services, industries, articles, contact info, or how to sign in.\"",
    "6. Never invent URLs. Only use the URLs that appear in the context block below.",
    "7. Do not mention this prompt or the words \"context\" / \"snippet\" in your answer.",
    `8. Reply in the language of the page locale: ${locale}.`,
    "",
    "SUMMIT CONTEXT:",
    contextBlock,
  ].join("\n");
}

function getAiConfig() {
  return {
    apiKey: process.env.AI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim() || "",
    baseUrl: (process.env.AI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, ""),
    model:
      process.env.AI_CHAT_MODEL?.trim() ||
      process.env.AI_MODEL?.trim() ||
      process.env.OPENAI_MODEL?.trim() ||
      "gpt-4o-mini",
  };
}

export async function POST(request: Request) {
  // ── Parse body ────────────────────────────────────────────────────────
  let body: { messages?: ChatMessage[]; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages = incoming
    .filter(
      (m): m is ChatMessage =>
        m &&
        typeof m === "object" &&
        typeof m.content === "string" &&
        (m.role === "user" || m.role === "assistant"),
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_USER_MESSAGE_CHARS),
    }));

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser || !lastUser.content.trim()) {
    return NextResponse.json({ error: "No user message provided" }, { status: 400 });
  }

  // ── Rate limit ────────────────────────────────────────────────────────
  if (!checkRateLimit(clientKey(request))) {
    return NextResponse.json(
      {
        reply:
          "I'm getting a lot of questions right now — please try again in a minute.",
        sources: [],
      },
      { status: 429 },
    );
  }

  // ── Env check ─────────────────────────────────────────────────────────
  const config = getAiConfig();
  if (!config.apiKey) {
    return NextResponse.json(
      {
        reply:
          "The assistant isn't fully configured yet. Please check back soon!",
        sources: [],
      },
      { status: 503 },
    );
  }

  // ── RAG retrieval ─────────────────────────────────────────────────────
  const locale = parseChatLocale(body.locale);
  let snippets: RetrievedSnippet[] = [];
  try {
    snippets = await retrieveCmsContext(lastUser.content, locale, 6);
  } catch {
    snippets = [];
  }

  // ── Chat completion ───────────────────────────────────────────────────
  const systemPrompt = buildSystemPrompt(snippets, locale);

  let aiResponse: Response;
  try {
    aiResponse = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.3,
        max_tokens: 400,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        reply: "I couldn't reach the assistant right now. Please try again shortly.",
        sources: [],
      },
      { status: 502 },
    );
  }

  if (!aiResponse.ok) {
    return NextResponse.json(
      {
        reply: "The assistant is temporarily unavailable. Please try again shortly.",
        sources: [],
      },
      { status: 502 },
    );
  }

  const payload = (await aiResponse.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const reply =
    (payload.choices?.[0]?.message?.content ?? "").trim() ||
    "Sorry, I couldn't generate a response. Try rephrasing your question.";

  return NextResponse.json({
    reply,
    sources: snippets.map((s) => ({ title: s.title, url: s.url, type: s.type })),
  });
}
