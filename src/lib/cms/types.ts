export const locales = ["en", "es"] as const;

export type Locale = (typeof locales)[number];

export type PublishStatus = "published" | "draft";

export type SeoFields = {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
};

export type LinkField = {
  label: string;
  href: string;
};

export type StatItem = {
  label: string;
  value: string;
};

export type CardItem = {
  eyebrow?: string;
  title: string;
  body: string;
  href: string;
};

export type HeroBlock = {
  type: "hero";
  eyebrow?: string;
  title: string;
  intro: string;
  primaryCta?: LinkField;
  secondaryCta?: LinkField;
};

export type RichTextBlock = {
  type: "richText";
  body: string[];
};

export type HtmlBlock = {
  type: "html";
  html: string;
};

export type ImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};

export type VideoBlock = {
  type: "video";
  src: string;
  title: string;
  caption?: string;
  poster?: string;
  mode: "embed" | "file";
};

export type StatsBlock = {
  type: "stats";
  title: string;
  items: StatItem[];
};

export type QuoteBlock = {
  type: "quote";
  quote: string;
  attribution: string;
  role?: string;
};

export type CardGridBlock = {
  type: "cardGrid";
  title: string;
  intro?: string;
  cards: CardItem[];
};

export type CtaBlock = {
  type: "cta";
  title: string;
  body: string;
  action: LinkField;
  tone: "accent" | "dark";
};

export type FeaturedContentBlock = {
  type: "featuredContent";
  title: string;
  intro?: string;
  contentTypes: Array<"insight" | "caseStudy">;
  limit: number;
  topic?: string;
  service?: string;
  industry?: string;
  ids?: string[];
};

export type FormBlock = {
  type: "form";
  title: string;
  intro: string;
  submitLabel?: string;
  formId: "lead";
};

export type Block =
  | HeroBlock
  | RichTextBlock
  | HtmlBlock
  | ImageBlock
  | VideoBlock
  | StatsBlock
  | QuoteBlock
  | CardGridBlock
  | CtaBlock
  | FeaturedContentBlock
  | FormBlock;

export type BasePage = {
  id: string;
  translationKey: string;
  locale: Locale;
  status: PublishStatus;
  slug: string[];
  title: string;
  eyebrow?: string;
  summary: string;
  seo: SeoFields;
  sections: Block[];
};

export type HomePage = BasePage & {
  type: "home";
};

export type StandardPage = BasePage & {
  type: "standard";
};

export type ServicePage = BasePage & {
  type: "service";
  outcomes: string[];
};

export type IndustryPage = BasePage & {
  type: "industry";
  audience: string[];
};

export type InsightPage = BasePage & {
  type: "insight";
  authorId: string;
  publishedAt: string;
  readTime: string;
  topics: string[];
  relatedServiceIds: string[];
  relatedIndustryIds: string[];
};

export type AuthorPage = BasePage & {
  type: "author";
  role: string;
  expertise: string[];
};

export type CaseStudyPage = BasePage & {
  type: "caseStudy";
  client: string;
  challenge: string;
  result: string;
  relatedServiceIds: string[];
  relatedIndustryIds: string[];
};

export type ResourceCenterPage = BasePage & {
  type: "resourceCenter";
  featuredTopics: string[];
};

export type ContactPage = BasePage & {
  type: "contact";
  offices: Array<{
    city: string;
    phone: string;
    focus: string;
  }>;
};

export type Page =
  | HomePage
  | StandardPage
  | ServicePage
  | IndustryPage
  | InsightPage
  | AuthorPage
  | CaseStudyPage
  | ResourceCenterPage
  | ContactPage;

export type NavigationItem = {
  label: string;
  href: string;
};

export type SiteHeaderContent = {
  title: string;
  tagline?: string;
  switchLabel?: string;
  ctaLabel: string;
  ctaHref: string;
};

export type SiteFooterColumn = {
  title: string;
  links: LinkField[];
};

export type SiteFooterContent = {
  eyebrow?: string;
  title?: string;
  body?: string;
  columns: SiteFooterColumn[];
  socialLinks: LinkField[];
  copyrightText?: string;
};

export type OptimizelyWebhookPayload = {
  id?: string;
  timestamp?: string;
  tenantId?: string;
  type?: {
    subject?: string;
    action?: string;
  };
  data?: {
    docId?: string;
    journalId?: string;
  };
};

export type InsightFilters = {
  locale: Locale;
  query?: string;
  topic?: string;
  service?: string;
  industry?: string;
  draft?: boolean;
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}