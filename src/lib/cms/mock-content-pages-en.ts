import type { Page } from "@/lib/cms/types";
import { articleAuthors } from "./mock-authors";
import { articleInsightPages } from "./mock-articles";
import { buildEnPagesPart1 } from "./mock-content-pages-en-1";
import { buildEnPagesPart2 } from "./mock-content-pages-en-2";

export function buildEnPages(deps: {
  englishArticlePages: Page[];
  englishEventsPages: Page[];
}): Page[] {
  return [
    ...buildEnPagesPart1(),
    ...buildEnPagesPart2(),
    ...articleAuthors,
    ...articleInsightPages,
    deps.englishArticlePages[1],
    ...deps.englishEventsPages,
  ];
}
