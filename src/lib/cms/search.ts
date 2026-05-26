import type { Locale, Page } from "@/lib/cms/types";
import { getPagesForLocale } from "./page-resolver";
import { preferCmsPagesBySlug } from "./text-helpers";

export type SubscriptionTopicLike = { title: string; body: string };

export function collectSearchableText(page: Page): string {
  const parts: string[] = [page.title, page.summary, page.eyebrow ?? ""];

  if (page.type === "insight") {
    parts.push(page.topics.join(" "));
  }

  for (const block of page.sections) {
    switch (block.type) {
      case "hero":
        parts.push(block.title, block.intro, block.eyebrow ?? "");
        break;
      case "richText":
        parts.push(block.title ?? "", block.body.join(" "));
        break;
      case "html":
        parts.push(block.html.replace(/<[^>]+>/g, " "));
        break;
      case "image":
        parts.push(block.alt, block.caption ?? "");
        break;
      case "video":
        parts.push(block.title, block.caption ?? "");
        break;
      case "stats":
        parts.push(block.title, block.items.map((i) => `${i.label} ${i.value}`).join(" "));
        break;
      case "quote":
        parts.push(block.quote, block.attribution);
        break;
      case "cardGrid":
        parts.push(
          block.title,
          block.intro ?? "",
          block.cards.map((c) => `${c.title} ${c.body} ${c.eyebrow ?? ""}`).join(" "),
        );
        break;
      case "cta":
        parts.push(block.title, block.body);
        break;
      case "featuredContent":
        parts.push(block.title, block.intro ?? "");
        break;
      case "articleList":
        parts.push(block.title);
        break;
      case "form":
        parts.push(block.title, block.intro);
        break;
      default:
        break;
    }
  }

  return parts.join(" ").toLowerCase();
}

export async function searchAllPages(options: { locale: Locale; query: string; draft?: boolean }) {
  const query = options.query.trim().toLowerCase();
  if (!query) {
    return [];
  }

  const pages = preferCmsPagesBySlug(await getPagesForLocale(options.locale, options.draft));

  return pages
    .filter((page) => collectSearchableText(page).includes(query))
    .map((page) => ({
      id: page.id,
      type: page.type,
      title: page.title,
      summary: page.summary,
      href: `/${options.locale}/${page.slug.join("/")}`,
    }));
}

