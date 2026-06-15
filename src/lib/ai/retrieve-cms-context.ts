// Summit Assistant — RAG retrieval against Optimizely Graph.
//
// Pulls a small set of relevant CMS pages (articles, services, industries,
// locations, generic pages) for a given user question. The retrieved
// snippets are injected into the chat completion prompt so the model
// grounds its answers in real site content.

const SUPPORTED_LOCALES = ["en", "es"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function parseChatLocale(raw: string | null | undefined): SupportedLocale {
  const v = (raw ?? "").trim().toLowerCase();
  return (SUPPORTED_LOCALES as readonly string[]).includes(v)
    ? (v as SupportedLocale)
    : "en";
}

export type RetrievedSnippet = {
  title: string;
  url: string;
  summary: string;
  type: string;
};

type RawItem = {
  title?: string | null;
  shortDescription?: string | null;
  keywords?: string | null;
  _metadata?: {
    key?: string;
    displayName?: string;
    types?: string[];
    status?: string;
    url?: { default?: string; hierarchical?: string };
  };
};

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "for", "to", "in", "on", "at",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "i", "you", "we", "they", "he", "she", "it",
  "what", "where", "when", "who", "why", "how", "which", "this", "that",
  "these", "those", "me", "my", "our", "your", "with", "about", "from",
  "can", "could", "would", "should", "will", "may", "might", "tell", "show",
  "give", "find", "list", "summit", "wipfli", "please", "hello", "hi",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

/** Naive keyword scoring — counts how many query tokens appear in the
 *  page's combined title/description/keywords/url text. */
function scoreItem(item: RawItem, tokens: string[]): number {
  if (!tokens.length) return 0;
  const text = [
    item.title ?? "",
    item._metadata?.displayName ?? "",
    item.shortDescription ?? "",
    item.keywords ?? "",
    item._metadata?.url?.default ?? "",
    item._metadata?.url?.hierarchical ?? "",
  ]
    .join(" ")
    .toLowerCase();
  let score = 0;
  for (const t of tokens) {
    if (text.includes(t)) score += 1;
    // boost when token appears in title
    if ((item.title ?? "").toLowerCase().includes(t)) score += 2;
  }
  return score;
}

function inferType(path: string): string {
  if (/\/article\//.test(path)) return "Article";
  if (/\/services?\//.test(path)) return "Service";
  if (/\/industries?\//.test(path)) return "Industry";
  if (/\/locations?\//.test(path)) return "Location";
  if (/\/contact|\/rfp/.test(path)) return "Contact";
  if (/\/subscri/.test(path)) return "Subscribe";
  if (/\/login|\/sign-?in|\/hub/.test(path)) return "Sign-in";
  return "Page";
}

/**
 * Retrieve up to `limit` CMS pages most relevant to the user's question.
 * Searches all CMSPage content (not just articles) so the bot can talk
 * about services, industries, locations, contact, subscribe, etc.
 */
export async function retrieveCmsContext(
  question: string,
  locale: SupportedLocale = "en",
  limit = 6,
): Promise<RetrievedSnippet[]> {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();
  if (!renderUrl || !renderKey) return [];

  const tokens = tokenize(question);
  // Pull a generous window so the in-memory scorer has variety. The site
  // is small (few hundred pages at most), so this is fine.
  const graphLimit = 80;
  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;

  const query = `query {
    CMSPage(
      locale: ${locale}
      limit: ${graphLimit}
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

  let items: RawItem[] = [];
  try {
    const resp = await fetch(`${baseUrl}?auth=${encodeURIComponent(renderKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });
    const payload = (await resp.json()) as {
      data?: { CMSPage?: { items?: RawItem[] } };
    };
    items = payload?.data?.CMSPage?.items ?? [];
  } catch {
    return [];
  }

  const scored = items
    .filter((it) => {
      const status = (it._metadata?.status ?? "").toLowerCase();
      return !status || status === "published";
    })
    .map((it) => ({ item: it, score: scoreItem(it, tokens) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // Fallback: if no token matches at all, return a few latest articles as
  // generic context (helps for greetings like "hi" / "what can you do").
  const finalRows =
    scored.length > 0
      ? scored.map((row) => row.item)
      : items
          .filter((it) => /\/article\//.test(it._metadata?.url?.default ?? ""))
          .slice(0, 3);

  return finalRows.map((it) => {
    const path = it._metadata?.url?.default ?? it._metadata?.url?.hierarchical ?? "";
    return {
      title: (it.title ?? it._metadata?.displayName ?? "").trim() || "Untitled",
      url: path,
      summary: (it.shortDescription ?? "").trim(),
      type: inferType(path),
    };
  });
}
