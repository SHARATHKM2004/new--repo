import type { Page } from "@/lib/cms/types";
import { articleBlueprints, createArticleInsightPage, articleTranslationKeys } from "./mock-articles";
import { articleFallbackImagePool } from "./mock-content-events";

export const englishArticlePages: Page[] = [
  {
    id: "article-en",
    translationKey: "article",
    type: "standard",
    locale: "en",
    status: "published",
    slug: ["article"],
    title: "",
    eyebrow: "",
    summary: "",
    seo: {
      title: "Article | Summit Advisory Group",
      description: "CMS-backed article listing page.",
    },
    sections: [
      {
        type: "articleList",
        title: "Articles",
        ids: articleTranslationKeys,
        limit: 9,
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2400&q=80",
          imageAlt: "Newsroom desk overhead view",
          title: "Articles",
          breadcrumbHomeLabel: "Home",
          breadcrumbCurrentLabel: "Articles",
          breadcrumbHomeHref: "/en",
        },
        introHeading: "Insights you can act on",
        introBody: [
          "Stay up to date with the latest perspectives from our advisors. Browse stories on strategy, finance, technology, and risk - all curated to help you take the next confident step.",
        ],
        initialVisible: 9,
        loadMoreStep: 6,
        loadMoreLabel: "Load more",
        readMoreLabel: "Read full story",
        fallbackImagePool: articleFallbackImagePool,
      },
    ],
  },
  {
    id: "article-all-en",
    translationKey: "article-all",
    type: "standard",
    locale: "en",
    status: "published",
    slug: ["article", "all"],
    title: "",
    eyebrow: "",
    summary: "",
    seo: {
      title: "All articles | Summit Advisory Group",
      description: "Full article grid showing all CMS-backed stories.",
    },
    sections: [
      {
        type: "articleList",
        title: "Articles",
        ids: articleTranslationKeys,
        limit: 999,
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2400&q=80",
          imageAlt: "Newsroom desk overhead view",
          title: "Articles",
          breadcrumbHomeLabel: "Home",
          breadcrumbCurrentLabel: "Articles",
          breadcrumbHomeHref: "/en",
        },
        introHeading: "Every article in one place",
        introBody: [
          "The full library of advisor-written perspectives. Use Load more to browse the complete collection of stories on strategy, finance, technology, and risk.",
        ],
        initialVisible: 9,
        loadMoreStep: 6,
        loadMoreLabel: "Load more",
        readMoreLabel: "Read full story",
        fallbackImagePool: articleFallbackImagePool,
      },
    ],
  },
];

export const spanishArticlePages: Page[] = [
  {
    id: "article-es",
    translationKey: "article",
    type: "standard",
    locale: "es",
    status: "published",
    slug: ["article"],
    title: "",
    eyebrow: "",
    summary: "",
    seo: {
      title: "Articulo | Summit Advisory Group",
      description: "Pagina de listado de articulos desde el CMS.",
    },
    sections: [
      {
        type: "articleList",
        title: "Articles",
        ids: articleTranslationKeys,
        limit: 9,
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2400&q=80",
          imageAlt: "Vista cenital de un escritorio",
          title: "Articulos",
          breadcrumbHomeLabel: "Inicio",
          breadcrumbCurrentLabel: "Articulos",
          breadcrumbHomeHref: "/es",
        },
        introHeading: "Ideas para actuar",
        introBody: [
          "Mantente al dia con las ultimas perspectivas de nuestros asesores. Explora historias sobre estrategia, finanzas, tecnologia y riesgo.",
        ],
        initialVisible: 9,
        loadMoreStep: 6,
        loadMoreLabel: "Cargar mas",
        readMoreLabel: "Leer mas",
        fallbackImagePool: articleFallbackImagePool,
      },
    ],
  },
  {
    id: "article-all-es",
    translationKey: "article-all",
    type: "standard",
    locale: "es",
    status: "published",
    slug: ["article", "all"],
    title: "",
    eyebrow: "",
    summary: "",
    seo: {
      title: "Todos los articulos | Summit Advisory Group",
      description: "Grid completo de articulos desde el CMS.",
    },
    sections: [
      {
        type: "articleList",
        title: "Articles",
        ids: articleTranslationKeys,
        limit: 999,
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2400&q=80",
          imageAlt: "Vista cenital de un escritorio",
          title: "Articulos",
          breadcrumbHomeLabel: "Inicio",
          breadcrumbCurrentLabel: "Articulos",
          breadcrumbHomeHref: "/es",
        },
        introHeading: "Todos los articulos en un solo lugar",
        introBody: [
          "La biblioteca completa de perspectivas escritas por nuestros asesores. Usa Cargar mas para explorar toda la coleccion.",
        ],
        initialVisible: 9,
        loadMoreStep: 6,
        loadMoreLabel: "Cargar mas",
        readMoreLabel: "Leer mas",
        fallbackImagePool: articleFallbackImagePool,
      },
    ],
  },
];

