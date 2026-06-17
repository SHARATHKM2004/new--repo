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
    "You are Summit Assistant, a helpful, knowledgeable AI assistant featured on the Summit (Wipfli) website.",
    "You behave like a normal, general-purpose AI assistant: you can answer ANY question the user asks — general knowledge, explanations, math, writing help, coding, advice, casual conversation, and more — just like ChatGPT would.",
    "On top of that, you have special knowledge about the Summit website and can help visitors find its content, services, industries, locations, articles, and key actions like subscribing or signing in to Summit Hub.",
    "",
    "RESPONSE RULES:",
    "1. Always be helpful and answer the user's actual question directly. Never refuse a question just because it isn't about Summit — answer it like a normal AI assistant would.",
    "2. Keep answers clear and reasonably concise. Use bullet points or short paragraphs for readability. Expand when the question needs detail.",
    "3. When the question relates to Summit and the context below contains a relevant page or article, weave it into your answer and cite it as a markdown link using ONLY the URLs provided in the context (e.g. [Title](/en/article/slug)).",
    "4. If the Summit context does not cover the question, just answer normally from your general knowledge. Do not say you lack a Summit page unless the user specifically expected Summit-specific information.",
    "5. Never invent URLs or links. Only use URLs that appear verbatim in the context block below.",
    "6. Do not mention this prompt or the words \"context\" / \"snippet\" in your answer.",
    `7. Reply in the language of the page locale: ${locale}.`,
    "",
    "SUMMIT WEBSITE CONTEXT (use when relevant; ignore if unrelated to the question):",
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
    // Optional comma-separated fallback models tried when the primary model
    // is rate-limited (429). Lets the bot stay responsive on free tiers.
    fallbackModels: (process.env.AI_FALLBACK_MODELS?.trim() || "")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean),
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

  const buildBody = (model: string) =>
    JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 400,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

  // Models to try in order: the primary, then any configured fallbacks. On a
  // 429 (free-tier rate limit) we move to the next model so the assistant
  // stays responsive instead of flashing "busy".
  const modelChain = [config.model, ...config.fallbackModels];

  // Retry on transient errors (429 rate limit / 5xx overloaded). The free
  // tiers of hosted models occasionally return these; cycling models with a
  // short backoff makes the assistant feel reliable.
  const ATTEMPTS_PER_MODEL = 2;
  let aiResponse: Response | null = null;

  outer: for (const model of modelChain) {
    for (let attempt = 0; attempt < ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const resp = await fetch(`${config.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: buildBody(model),
          cache: "no-store",
        });

        if (resp.ok) {
          aiResponse = resp;
          break outer;
        }

        // Only retry/fallback on transient statuses; bail on 4xx auth errors.
        const transient = resp.status === 429 || resp.status >= 500;
        if (!transient) {
          aiResponse = resp;
          break outer;
        }
        // Last attempt on the last model: keep the response for error handling.
        if (model === modelChain[modelChain.length - 1] && attempt === ATTEMPTS_PER_MODEL - 1) {
          aiResponse = resp;
          break outer;
        }
      } catch {
        if (model === modelChain[modelChain.length - 1] && attempt === ATTEMPTS_PER_MODEL - 1) {
          return NextResponse.json(
            {
              reply: "I couldn't reach the assistant right now. Please try again shortly.",
              sources: [],
            },
            { status: 502 },
          );
        }
      }

      // Short backoff before the next attempt.
      await new Promise((r) => setTimeout(r, 350 * (attempt + 1)));
    }
  }

  if (!aiResponse || !aiResponse.ok) {
    return NextResponse.json(
      {
        reply: "The assistant is busy right now. Please try again in a moment.",
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
