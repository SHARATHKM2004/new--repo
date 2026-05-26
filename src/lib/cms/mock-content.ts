import type { Page } from "@/lib/cms/types";
import { englishEventsPages, spanishEventsPages } from "./mock-content-events";
import { englishArticlePages, spanishArticlePages } from "./mock-content-articles";
import { buildEnPages } from "./mock-content-pages-en";
import { buildEsPages } from "./mock-content-pages-es";

const enPages: Page[] = buildEnPages({ englishArticlePages, englishEventsPages });

const esPages: Page[] = buildEsPages({ spanishArticlePages, spanishEventsPages });

export const mockPages: Page[] = [...enPages, ...esPages];
