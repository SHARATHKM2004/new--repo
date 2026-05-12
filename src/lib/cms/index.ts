import { mockPages } from "@/lib/cms/mock-content";
import type {
  ContactPage,
  InsightFilters,
  InsightPage,
  IndustryPage,
  Locale,
  NavigationItem,
  LinkField,
  Page,
  PublishStatus,
  Block,
  ResourceCenterPage,
  ServicePage,
  SiteFooterContent,
  SiteHeaderContent,
} from "@/lib/cms/types";

type OptimizelyGraphResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
  }>;
};

type OptimizelyCmsPageItem = {
  title: string | null;
  shortDescription: string | null;
  keywords: string | null;
  _json?: {
    title?: string;
    shortDescription?: string;
    keywords?: string;
    eyebrow?: string;
    pageType?: string;
    outcomes?: string[];
    audience?: string[];
    featuredTopics?: string[];
    offices?: Array<{
      city?: string;
      phone?: string;
      focus?: string;
    }>;
    _metadata?: {
      key?: string;
      locale?: string;
      displayName?: string;
      url?: {
        default?: string;
        hierarchical?: string;
      };
      routeSegment?: string;
      status?: string;
    };
    blocks?: OptimizelyJsonBlock[];
  };
  _metadata?: {
    key?: string;
    locale?: string;
    displayName?: string;
    types?: string[];
  };
};

type OptimizelyStartPageItem = {
  title: string | null;
  shortDescription: string | null;
  keywords: string | null;
  _json?: {
    title?: string;
    shortDescription?: string;
    keywords?: string;
    blocks?: OptimizelyJsonBlock[];
    _metadata?: {
      key?: string;
      locale?: string;
      displayName?: string;
      url?: {
        default?: string;
        hierarchical?: string;
      };
      routeSegment?: string;
      status?: string;
    };
  };
  _metadata?: {
    key?: string;
    locale?: string;
    displayName?: string;
    types?: string[];
  };
};

type OptimizelyJsonMetadata = {
  displayName?: string;
  locale?: string;
  status?: string;
  key?: string;
  url?: {
    default?: string;
    hierarchical?: string;
  };
};

type OptimizelyJsonBlock = {
  __typename?: string;
  title?: string;
  subtitle?: string;
  showDecoration?: boolean;
  decorationColorsPrimary?: string;
  decorationColorsSecondary?: string;
  description?: string;
  story?: string;
  highlights?: string[];
  content?: string;
  fullName?: string;
  position?: string;
  imageSrc?: string;
  name?: string;
  bio?: string;
  logos?: Array<{
    src?: string;
    alt?: string;
  }>;
  services?: Array<{
    title?: string;
    description?: string;
    icon?: string;
    href?: string;
  }>;
  testimonials?: Array<{
    fullName?: string;
    position?: string;
    content?: string;
    avatarSrc?: string;
  }>;
  items?: Array<{
    title?: string;
    description?: string;
    imageUrl?: string;
    link?: string;
  }>;
  paragraph_text?: {
    html?: string;
    json?: unknown;
  };
  html?: string;
  json?: unknown;
  _metadata?: OptimizelyJsonMetadata;
};

type OptimizelyCmsPageListItem = {
  title: string | null;
  shortDescription: string | null;
  _metadata?: {
    key?: string;
    locale?: string;
    displayName?: string;
    types?: string[];
  };
};

type OptimizelyHeaderItem = {
  logo: string | null;
  ctaText: string | null;
  ctaHref: string | null;
  _json?: {
    title?: string;
    logo?: string;
    tagline?: string;
    switchLabel?: string;
    localeSwitcherLabel?: string;
    ctaText?: string;
    ctaHref?: string;
    navItems?: Array<{
      label?: string;
      href?: string;
    }>;
  };
};

type OptimizelyFooterItem = {
  copyrightText: string | null;
  _json?: {
    eyebrow?: string;
    title?: string;
    body?: string;
    copyrightText?: string;
    columns?: Array<{
      title?: string;
      links?: Array<{
        label?: string;
        href?: string;
      }>;
    }>;
    socialLinks?: Array<{
      platform?: string;
      href?: string;
    }>;
  };
};

function slugKey(slug: string[]) {
  return slug.join("/");
}

function toSlugSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getPlaceholderCardHref(title: string, icon?: string) {
  const segment = toSlugSegment(title);
  const normalizedIcon = icon?.trim().toLowerCase() ?? "";

  if (normalizedIcon.startsWith("case")) {
    return `/case-studies/${segment}`;
  }

  if (normalizedIcon.startsWith("insight")) {
    return `/insights/${segment}`;
  }

  return `/services/${segment}`;
}

function isOptimizelyProviderEnabled() {
  return process.env.CMS_PROVIDER === "optimizely";
}

function getOptimizelyBasicAuthHeader() {
  const appKey = process.env.OPTIMIZELY_GRAPH_APP_KEY?.trim();
  const secret = process.env.OPTIMIZELY_GRAPH_SECRET?.trim();

  if (!appKey || !secret) {
    return null;
  }

  return `Basic ${Buffer.from(`${appKey}:${secret}`).toString("base64")}`;
}

function getOptimizelyTag(scope: string, locale?: Locale) {
  return locale ? `optimizely:${scope}:${locale}` : `optimizely:${scope}`;
}

export function getOptimizelyRevalidationTags() {
  return [
    "optimizely:page",
    "optimizely:chrome",
    getOptimizelyTag("page", "en"),
    getOptimizelyTag("page", "es"),
    getOptimizelyTag("chrome", "en"),
    getOptimizelyTag("chrome", "es"),
    getOptimizelyTag("start-page", "en"),
    getOptimizelyTag("start-page", "es"),
    getOptimizelyTag("cms-page", "en"),
    getOptimizelyTag("cms-page", "es"),
    getOptimizelyTag("header", "en"),
    getOptimizelyTag("header", "es"),
    getOptimizelyTag("footer", "en"),
    getOptimizelyTag("footer", "es"),
  ];
}

export async function getOptimizelyConnectionStatus() {
  const providerEnabled = isOptimizelyProviderEnabled();
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();
  const basicAuthHeader = getOptimizelyBasicAuthHeader();

  const publicConfigured = Boolean(renderUrl && renderKey);
  const adminConfigured = Boolean(renderUrl && basicAuthHeader);

  if (!providerEnabled || !renderUrl) {
    return {
      providerEnabled,
      publicConfigured,
      adminConfigured,
      publicReachable: false,
      adminReachable: false,
    };
  }

  const query = `query { StartPage(limit: 1) { total } }`;
  const publicResult = publicConfigured
    ? await fetchOptimizelyGraph<{ StartPage: { total: number } }>(query, {
        tags: [getOptimizelyTag("health")],
      })
    : null;
  const adminResult = adminConfigured
    ? await fetchOptimizelyGraph<{ StartPage: { total: number } }>(query, {
        draft: true,
      })
    : null;

  return {
    providerEnabled,
    publicConfigured,
    adminConfigured,
    publicReachable: Boolean(publicResult),
    adminReachable: Boolean(adminResult),
  };
}

async function fetchOptimizelyGraph<T>(
  query: string,
  options?: {
    draft?: boolean;
    tags?: string[];
  },
) {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();
  const basicAuthHeader = getOptimizelyBasicAuthHeader();

  if (!renderUrl) {
    return null;
  }

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;
  const useAdminAuth = Boolean(options?.draft && basicAuthHeader);

  if (!useAdminAuth && !renderKey) {
    return null;
  }

  const response = await fetch(useAdminAuth ? baseUrl : `${baseUrl}?auth=${encodeURIComponent(renderKey!)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(useAdminAuth ? { Authorization: basicAuthHeader! } : {}),
    },
    body: JSON.stringify({ query }),
    cache: options?.draft ? "no-store" : undefined,
    next: options?.draft
      ? undefined
      : {
          revalidate: 60,
          tags: options?.tags,
        },
  });

  if (!response.ok) {
    console.error("Optimizely Graph request failed", {
      status: response.status,
      draft: Boolean(options?.draft),
      tags: options?.tags,
    });
    return null;
  }

  const payload = (await response.json()) as OptimizelyGraphResponse<T>;

  if (payload.errors?.length) {
    console.error("Optimizely Graph returned errors", {
      draft: Boolean(options?.draft),
      tags: options?.tags,
      errors: payload.errors,
    });
    return null;
  }

  return payload.data ?? null;
}

function normalizeLinkItems(items: Array<LinkField | null | undefined>) {
  return items.filter((item): item is LinkField => Boolean(item));
}

function mapOptimizelyBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  switch (block.__typename) {
    case "HeroBlock":
      return {
        type: "hero",
        eyebrow: block.showDecoration ? "Live Optimizely Hero" : "Optimizely Hero",
        title: block.title ?? fallbackTitle ?? "Hero",
        intro: block.subtitle ?? "",
      };
    case "ContactBlock":
      return {
        type: "form",
        formId: "lead",
        title: block.title ?? "Contact us",
        intro: block.description ?? "",
      };
    case "StoryBlock": {
      const body = [block.story, ...(block.highlights ?? []).map((item) => `- ${item}`)].filter(
        (value): value is string => Boolean(value?.trim()),
      );

      return body.length
        ? {
            type: "richText",
            body,
          }
        : null;
    }
    case "ServicesBlock": {
      const cards = (block.services ?? [])
        .map((item) => {
          const title = item.title?.trim();
          const body = item.description?.trim();
          const icon = item.icon?.trim();

          if (!title || !body) {
            return null;
          }

          return {
            eyebrow: icon,
            title,
            body,
            href: item.href?.trim() || getPlaceholderCardHref(title, icon),
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      return cards.length
        ? {
            type: "cardGrid",
            title: block.title ?? "Services",
            cards,
          }
        : null;
    }
    case "TestimonialsBlock": {
      const cards = (block.testimonials ?? [])
        .map((item) => {
          const body = item.content?.trim();
          if (!body) {
            return null;
          }

          return {
            eyebrow: item.fullName?.trim(),
            title: item.position?.trim() || "Testimonial",
            body,
            href: "/en",
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      return cards.length
        ? {
            type: "cardGrid",
            title: block.title ?? "Testimonials",
            cards,
          }
        : null;
    }
    case "PortfolioGridBlock": {
      const cards = (block.items ?? [])
        .map((item) => {
          const title = item.title?.trim();
          const body = item.description?.trim();

          if (!title || !body) {
            return null;
          }

          return {
            title,
            body,
            href: item.link?.trim() || "/en",
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));

      return cards.length
        ? {
            type: "cardGrid",
            title: block.title ?? "Portfolio",
            cards,
          }
        : null;
    }
    case "ProfileBlock": {
      const body = [block.bio?.trim()].filter((value): value is string => Boolean(value));

      return body.length
        ? {
            type: "richText",
            body: [`${block.name ?? "Profile"}${block.title ? ` - ${block.title}` : ""}`, ...body],
          }
        : null;
    }
    case "ParagraphTextElement": {
      const html = block.paragraph_text?.html?.trim();
      if (!html) {
        return null;
      }

      return {
        type: "html",
        html,
      };
    }
    default: {
      const html = block.html?.trim();

      if (html) {
        return {
          type: "html",
          html,
        };
      }

      return null;
    }
  }
}

function mapOptimizelyBlocks(blocks: OptimizelyJsonBlock[] | undefined, fallbackTitle?: string) {
  return (blocks ?? [])
    .map((block) => mapOptimizelyBlock(block, fallbackTitle))
    .filter((block): block is Block => Boolean(block));
}

function normalizeKeywords(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeStringArray(values?: string[] | null) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function inferCmsPageType(slug: string[], pageType?: string | null) {
  const normalizedPageType = pageType?.trim().toLowerCase();

  switch (normalizedPageType) {
    case "service":
    case "industry":
    case "resourcecenter":
    case "resource-center":
    case "contact":
      return normalizedPageType === "resourcecenter" ? "resourceCenter" : normalizedPageType;
    default:
      break;
  }

  if (!slug.length) {
    return "standard" as const;
  }

  switch (slug[0]) {
    case "services":
      return "service" as const;
    case "industries":
      return "industry" as const;
    case "resource-center":
      return "resourceCenter" as const;
    case "contact":
      return "contact" as const;
    default:
      return "standard" as const;
  }
}

function normalizeOptimizelySlug(pathname?: string) {
  if (!pathname) {
    return [];
  }

  return pathname
    .split("/")
    .filter(Boolean)
    .slice(1);
}

function mapOptimizelyCmsPage(item: OptimizelyCmsPageItem): Page | null {
  const jsonMetadata = item._json?._metadata;
  const metadata = item._metadata;
  const locale: Locale = (jsonMetadata?.locale ?? metadata?.locale) === "es" ? "es" : "en";
  const status: PublishStatus = jsonMetadata?.status === "Published" ? "published" : "draft";
  const title = item.title ?? item._json?.title ?? jsonMetadata?.displayName ?? metadata?.displayName ?? "Untitled page";
  const summary = item.shortDescription ?? item._json?.shortDescription ?? "Published from Optimizely SaaS CMS.";
  const slug = normalizeOptimizelySlug(
    jsonMetadata?.url?.default ?? jsonMetadata?.url?.hierarchical,
  );
  const translationKey = jsonMetadata?.key ?? metadata?.key ?? slugKey(slug) ?? "optimizely-cms-page";
  const sections = mapOptimizelyBlocks(item._json?.blocks, title);
  const pageType = inferCmsPageType(slug, item._json?.pageType);
  const eyebrow = item._json?.eyebrow?.trim() || "Optimizely CMS";
  const basePage = {
    id: jsonMetadata?.key ?? metadata?.key ?? translationKey,
    translationKey,
    locale,
    status,
    slug,
    title,
    eyebrow,
    summary,
    seo: {
      title,
      description: summary,
      keywords: normalizeKeywords(item.keywords ?? item._json?.keywords),
      noIndex: status !== "published",
    },
    sections:
      sections.length > 0
        ? sections
        : [
            {
              type: "richText" as const,
              body: [
                "This page is being loaded from the live Optimizely SaaS CMS Graph endpoint.",
                `Display name: ${jsonMetadata?.displayName ?? metadata?.displayName ?? title}`,
                `Content key: ${jsonMetadata?.key ?? metadata?.key ?? "Unavailable"}`,
                `Keywords: ${item.keywords ?? item._json?.keywords ?? "None"}`,
              ],
            },
          ],
  };

  switch (pageType) {
    case "service":
      return {
        ...basePage,
        type: "service",
        outcomes: normalizeStringArray(item._json?.outcomes),
      } satisfies ServicePage;
    case "industry":
      return {
        ...basePage,
        type: "industry",
        audience: normalizeStringArray(item._json?.audience),
      } satisfies IndustryPage;
    case "resourceCenter":
      return {
        ...basePage,
        type: "resourceCenter",
        featuredTopics: normalizeStringArray(item._json?.featuredTopics),
      } satisfies ResourceCenterPage;
    case "contact":
      return {
        ...basePage,
        type: "contact",
        offices: (item._json?.offices ?? [])
          .map((office) => ({
            city: office.city?.trim(),
            phone: office.phone?.trim(),
            focus: office.focus?.trim(),
          }))
          .filter(
            (office): office is ContactPage["offices"][number] =>
              Boolean(office.city && office.phone && office.focus),
          ),
      } satisfies ContactPage;
    default:
      return {
        ...basePage,
        type: "standard",
      };
  }
}

function mapOptimizelyStartPage(item: OptimizelyStartPageItem): Page | null {
  const jsonMetadata = item._json?._metadata;
  const metadata = item._metadata;
  const locale = (jsonMetadata?.locale ?? metadata?.locale) === "es" ? "es" : "en";
  const title = item.title ?? item._json?.title ?? jsonMetadata?.displayName ?? metadata?.displayName ?? "Start Page";
  const summary = item.shortDescription ?? item._json?.shortDescription ?? "Published from Optimizely SaaS CMS.";
  const slug = normalizeOptimizelySlug(
    jsonMetadata?.url?.default ?? jsonMetadata?.url?.hierarchical,
  );
  const sections = mapOptimizelyBlocks(item._json?.blocks, title);

  return {
    id: jsonMetadata?.key ?? metadata?.key ?? "optimizely-start-page",
    translationKey: jsonMetadata?.key ?? metadata?.key ?? slugKey(slug) ?? "optimizely-start-page",
    type: "home",
    locale,
    status: jsonMetadata?.status === "Published" ? "published" : "draft",
    slug,
    title,
    eyebrow: "Optimizely Start Page",
    summary,
    seo: {
      title,
      description: summary,
      keywords: normalizeKeywords(item.keywords ?? item._json?.keywords),
      noIndex: jsonMetadata?.status !== "Published",
    },
    sections: sections.length
      ? sections
      : [
          {
            type: "richText",
            body: [summary],
          },
        ],
  };
}

async function getOptimizelyPageBySlug(options: {
  locale: Locale;
  slug: string[];
  draft?: boolean;
}) {
  const startPage = await getOptimizelyStartPage(options.locale, options.draft);

  if (startPage) {
    if (!options.slug.length || slugKey(options.slug) === slugKey(startPage.slug)) {
      return startPage;
    }
  }

  const pages = await getOptimizelyCmsPages(options.locale, options.draft);

  if (!pages.length) {
    return null;
  }

  if (!options.slug.length) {
    return pages[0] ?? null;
  }

  return pages.find((page) => slugKey(page.slug) === slugKey(options.slug)) ?? null;
}

async function getOptimizelyStartPage(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    StartPage: {
      item: OptimizelyStartPageItem | null;
    };
  }>(
    `query {
      StartPage(limit: 1, locale: ${locale}) {
        item {
          title
          shortDescription
          keywords
          _json
          _metadata {
            key
            locale
            displayName
            types
          }
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("page", locale), getOptimizelyTag("start-page", locale)],
    },
  );

  const item = data?.StartPage?.item;

  if (!item) {
    return null;
  }

  return mapOptimizelyStartPage(item);
}

async function getOptimizelyCmsPages(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    CMSPage: {
      items: OptimizelyCmsPageListItem[];
    };
  }>(
    `query {
      CMSPage(limit: 20, locale: ${locale}) {
        items {
          title
          shortDescription
          _metadata {
            key
            locale
            displayName
            types
          }
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("page", locale), getOptimizelyTag("cms-page", locale)],
    },
  );

  const keys = Array.from(
    new Set(
      (data?.CMSPage?.items ?? [])
        .map((item) => item._metadata?.key)
        .filter((key): key is string => Boolean(key)),
    ),
  );

  if (!keys.length) {
    return [];
  }

  const pages = await Promise.all(
    keys.map(async (key) => {
      const pageData = await fetchOptimizelyGraph<{
        CMSPage: {
          item: OptimizelyCmsPageItem | null;
        };
      }>(
        `query {
          CMSPage(limit: 1, locale: ${locale}, ids: ["${key}"]) {
            item {
              title
              shortDescription
              keywords
              _json
              _metadata {
                key
                locale
                displayName
                types
              }
            }
          }
        }`,
        {
          draft,
          tags: [getOptimizelyTag("page", locale), getOptimizelyTag("cms-page", locale)],
        },
      );

      const page = pageData?.CMSPage?.item ? mapOptimizelyCmsPage(pageData.CMSPage.item) : null;
      return page;
    }),
  );

  return pages.filter((page): page is Page => Boolean(page));
}

async function getLivePages(locale: Locale, draft = false) {
  const pages: Page[] = [];
  const startPage = await getOptimizelyStartPage(locale, draft);

  if (startPage) {
    pages.push(startPage);
  }

  const cmsPages = await getOptimizelyCmsPages(locale, draft);

  for (const page of cmsPages) {
    if (!pages.some((candidate) => candidate.translationKey === page.translationKey)) {
      pages.push(page);
    }
  }

  return pages;
}

function resolvePages(locale: Locale, draft = false) {
  const byTranslation = new Map<string, Page[]>();

  for (const page of mockPages) {
    const bucket = byTranslation.get(page.translationKey) ?? [];
    bucket.push(page);
    byTranslation.set(page.translationKey, bucket);
  }

  return Array.from(byTranslation.values())
    .map((variants) => {
      const localeDraft = variants.find(
        (page) => page.locale === locale && page.status === "draft",
      );
      const localePublished = variants.find(
        (page) => page.locale === locale && page.status === "published",
      );
      const defaultDraft = variants.find(
        (page) => page.locale === "en" && page.status === "draft",
      );
      const defaultPublished = variants.find(
        (page) => page.locale === "en" && page.status === "published",
      );

      if (draft && localeDraft) {
        return localeDraft;
      }

      return localePublished ?? (draft ? defaultDraft : undefined) ?? defaultPublished;
    })
    .filter((page): page is Page => Boolean(page));
}

async function getPagesForLocale(locale: Locale, draft = false) {
  const mockPagesForLocale = resolvePages(locale, draft);

  if (!isOptimizelyProviderEnabled()) {
    return mockPagesForLocale;
  }

  const livePages = await getLivePages(locale, draft);

  if (!livePages.length) {
    return mockPagesForLocale;
  }

  const merged = new Map<string, Page>();

  for (const page of livePages) {
    merged.set(page.translationKey, page);
  }

  for (const page of mockPagesForLocale) {
    if (!merged.has(page.translationKey)) {
      merged.set(page.translationKey, page);
    }
  }

  return Array.from(merged.values());
}

export async function getPageBySlug(options: {
  locale: Locale;
  slug: string[];
  draft?: boolean;
}) {
  if (isOptimizelyProviderEnabled()) {
    const page = await getOptimizelyPageBySlug({
      locale: options.locale,
      slug: options.slug,
      draft: options.draft,
    });

    if (page) {
      return page;
    }
  }

  const pages = await getPagesForLocale(options.locale, options.draft);
  return pages.find((page) => slugKey(page.slug) === slugKey(options.slug)) ?? null;
}

async function getOptimizelyHeader(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    Header: {
      item: OptimizelyHeaderItem | null;
    };
  }>(
    `query {
      Header(limit: 1, locale: ${locale}) {
        item {
          logo
          ctaText
          ctaHref
          _json
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("chrome", locale), getOptimizelyTag("header", locale)],
    },
  );

  return data?.Header?.item ?? null;
}

async function getOptimizelyFooter(locale: Locale, draft = false) {
  const data = await fetchOptimizelyGraph<{
    Footer: {
      item: OptimizelyFooterItem | null;
    };
  }>(
    `query {
      Footer(limit: 1, locale: ${locale}) {
        item {
          copyrightText
          _json
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("chrome", locale), getOptimizelyTag("footer", locale)],
    },
  );

  return data?.Footer?.item ?? null;
}

export async function getNavigation(locale: Locale, draft = false): Promise<NavigationItem[]> {
  const dictionary = {
    en: {
      services: "Services",
      industries: "Industries",
      insights: "Insights",
      contact: "Contact",
    },
    es: {
      services: "Servicios",
      industries: "Industrias",
      insights: "Recursos",
      contact: "Contacto",
    },
  } as const;

  if (isOptimizelyProviderEnabled()) {
    const header = await getOptimizelyHeader(locale, draft);
    const liveItems = (header?._json?.navItems ?? [])
      .map((item) => {
        const label = item.label?.trim();
        const href = item.href?.trim();

        if (!label || !href) {
          return null;
        }

        return { label, href };
      })
      .filter((item): item is NavigationItem => Boolean(item));

    if (liveItems.length) {
      return liveItems;
    }
  }

  return [
    {
      label: dictionary[locale].services,
      href: `/${locale}/services/digital-platform-strategy`,
    },
    {
      label: dictionary[locale].industries,
      href: `/${locale}/industries/healthcare-financial-resilience`,
    },
    {
      label: dictionary[locale].insights,
      href: `/${locale}/resource-center`,
    },
    {
      label: dictionary[locale].contact,
      href: `/${locale}/contact`,
    },
  ];
}

export async function getSiteHeaderContent(
  locale: Locale,
  draft = false,
): Promise<SiteHeaderContent> {
  const dictionary = {
    en: {
      title: "Summit Advisory Group",
      tagline: "CMS practice build",
      switchLabel: "ES",
      ctaLabel: "Talk to us",
      ctaHref: `/${locale}/contact`,
    },
    es: {
      title: "Summit Advisory Group",
      tagline: "Proyecto de practica CMS",
      switchLabel: "EN",
      ctaLabel: "Contactar",
      ctaHref: `/${locale}/contact`,
    },
  } as const;

  if (!isOptimizelyProviderEnabled()) {
    return dictionary[locale];
  }

  const header = await getOptimizelyHeader(locale, draft);

  return {
    title:
      header?._json?.title?.trim() ||
      header?.logo?.trim() ||
      header?._json?.logo?.trim() ||
      dictionary[locale].title,
    tagline: header?._json?.tagline?.trim() || dictionary[locale].tagline,
    switchLabel:
      header?._json?.switchLabel?.trim() ||
      header?._json?.localeSwitcherLabel?.trim() ||
      dictionary[locale].switchLabel,
    ctaLabel: header?.ctaText?.trim() || header?._json?.ctaText?.trim() || dictionary[locale].ctaLabel,
    ctaHref: header?.ctaHref?.trim() || header?._json?.ctaHref?.trim() || dictionary[locale].ctaHref,
  };
}

export async function getSiteFooterContent(
  locale: Locale,
  draft = false,
): Promise<SiteFooterContent> {
  const fallback: SiteFooterContent = {
    eyebrow: locale === "en" ? "Practice project" : "Proyecto de practica",
    title:
      locale === "en"
        ? "Build the architecture you actually want to inherit."
        : "Construya la arquitectura que si quiera heredar.",
    body:
      locale === "en"
        ? "This scaffold is intentionally opinionated about page modeling, editor guardrails, and the split between CMS content and application-owned workflows."
        : "Esta base es intencionalmente opinionada sobre modelado de paginas, guardrails editoriales y la separacion entre contenido del CMS y flujos propios de la aplicacion.",
    columns: [
      {
        title: locale === "en" ? "Core paths" : "Rutas clave",
        links: [
          { label: "Home", href: `/${locale}` },
          { label: "Resource center", href: `/${locale}/resource-center` },
          { label: "Contact", href: `/${locale}/contact` },
        ],
      },
      {
        title: "Developer hooks",
        links: [
          { label: "Enable preview", href: "/api/draft?secret=local-preview-secret&slug=/en" },
          { label: "Disable preview", href: "/api/draft/disable" },
        ],
      },
    ],
    socialLinks: [],
  };

  if (!isOptimizelyProviderEnabled()) {
    return fallback;
  }

  const footer = await getOptimizelyFooter(locale, draft);

  if (!footer) {
    return fallback;
  }

  const columns = (footer._json?.columns ?? [])
    .map((column) => {
      const title = column.title?.trim();
      const links = (column.links ?? [])
        .map((link) => {
          const label = link.label?.trim();
          const href = link.href?.trim();

          if (!label || !href) {
            return null;
          }

          return { label, href };
        })
        .filter((link): link is { label: string; href: string } => Boolean(link));

      if (!title || !links.length) {
        return null;
      }

      return { title, links };
    })
    .filter((column): column is SiteFooterContent["columns"][number] => Boolean(column));

  const socialLinks = (footer._json?.socialLinks ?? [])
    .map((link) => {
      const label = link.platform?.trim();
      const href = link.href?.trim();

      if (!label || !href) {
        return null;
      }

      return { label, href };
    })
    .filter((link): link is { label: string; href: string } => Boolean(link));

  return {
    eyebrow: footer._json?.eyebrow?.trim() || fallback.eyebrow,
    title: footer._json?.title?.trim() || fallback.title,
    body: footer._json?.body?.trim() || fallback.body,
    columns: columns.length ? columns : fallback.columns,
    socialLinks,
    copyrightText:
      footer.copyrightText?.trim() || footer._json?.copyrightText?.trim() || undefined,
  };
}

export async function getInsights(filters: InsightFilters) {
  const pages = await getPagesForLocale(filters.locale, filters.draft);

  return pages
    .filter((page): page is InsightPage => page.type === "insight")
    .filter((page) => {
      const query = filters.query?.trim().toLowerCase();
      if (!query) {
        return true;
      }

      return [page.title, page.summary, page.topics.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .filter((page) => {
      if (!filters.topic) {
        return true;
      }

      return page.topics.includes(filters.topic);
    })
    .filter((page) => {
      if (!filters.service) {
        return true;
      }

      return page.relatedServiceIds.includes(filters.service);
    })
    .filter((page) => {
      if (!filters.industry) {
        return true;
      }

      return page.relatedIndustryIds.includes(filters.industry);
    })
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getRelatedPages(options: {
  locale: Locale;
  ids: string[];
  draft?: boolean;
}) {
  const pages = await getPagesForLocale(options.locale, options.draft);
  return options.ids
    .map((id) => pages.find((page) => page.translationKey === id) ?? null)
    .filter((page): page is Page => Boolean(page));
}

export async function getFeaturedContent(options: {
  locale: Locale;
  contentTypes: Array<"insight" | "caseStudy">;
  topic?: string;
  service?: string;
  industry?: string;
  ids?: string[];
  limit: number;
  draft?: boolean;
}) {
  const pages = (await getPagesForLocale(options.locale, options.draft)).filter((page) =>
    options.contentTypes.includes(page.type as "insight" | "caseStudy"),
  );

  if (options.ids?.length) {
    return options.ids
      .map((id) => pages.find((page) => page.translationKey === id) ?? null)
      .filter((page): page is Page => Boolean(page))
      .slice(0, options.limit);
  }

  return pages
    .filter((page) => {
      if (page.type === "insight") {
        if (options.topic && !page.topics.includes(options.topic)) {
          return false;
        }

        if (options.service && !page.relatedServiceIds.includes(options.service)) {
          return false;
        }

        if (options.industry && !page.relatedIndustryIds.includes(options.industry)) {
          return false;
        }
      }

      if (page.type === "caseStudy") {
        if (options.service && !page.relatedServiceIds.includes(options.service)) {
          return false;
        }

        if (options.industry && !page.relatedIndustryIds.includes(options.industry)) {
          return false;
        }
      }

      return true;
    })
    .slice(0, options.limit);
}

export async function getAuthorForInsight(options: {
  locale: Locale;
  authorId: string;
  draft?: boolean;
}) {
  const pages = await getPagesForLocale(options.locale, options.draft);
  const author = pages.find(
    (page) => page.type === "author" && page.translationKey === options.authorId,
  );

  return author?.type === "author" ? author : null;
}

export async function getInsightsByAuthor(options: {
  locale: Locale;
  authorId: string;
  draft?: boolean;
}) {
  const pages = await getPagesForLocale(options.locale, options.draft);
  return pages.filter(
    (page): page is InsightPage =>
      page.type === "insight" && page.authorId === options.authorId,
  );
}