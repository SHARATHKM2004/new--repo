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
  title?: string;
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

export type ArticleListBlock = {
  type: "articleList";
  title: string;
  ids?: string[];
  limit: number;
  viewAllLabel?: string;
  viewAllHref?: string;
  hero?: {
    imageUrl?: string;
    imageAlt?: string;
    title: string;
    breadcrumbHomeLabel?: string;
    breadcrumbCurrentLabel?: string;
    breadcrumbHomeHref?: string;
  };
  introHeading?: string;
  introBody?: string[];
  initialVisible?: number;
  loadMoreStep?: number;
  loadMoreLabel?: string;
  readMoreLabel?: string;
  fallbackImagePool?: string[];
};

export type FormBlock = {
  type: "form";
  title: string;
  intro: string;
  introText?: string;
  submitLabel?: string;
  formId: "lead";
  emailLabel?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  jobTitleLabel?: string;
  organizationLabel?: string;
  cityLabel?: string;
  stateLabel?: string;
  phoneLabel?: string;
  messageLabel?: string;
  emailPlaceholder?: string;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  jobTitlePlaceholder?: string;
  organizationPlaceholder?: string;
  cityPlaceholder?: string;
  statePlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;
  successMessage?: string;
  errorMessage?: string;
};

export type OfficeEntry = {
  state: string;
  city: string;
  address1?: string;
  address2?: string;
  cityStateZip?: string;
  phone?: string;
  fax?: string;
};

export type LocationsDirectoryBlock = {
  type: "locationsDirectory";
  heading?: string;
  heroImageUrl?: string;
  offices: OfficeEntry[];
};

export type PortalApplicationEntry = {
  title: string;
  description?: string;
  signInUrl?: string;
  signInLabel?: string;
};

export type PortalApplicationsBlock = {
  type: "portalApplications";
  bannerHeading?: string;
  sectionHeading?: string;
  introText?: string;
  applications: PortalApplicationEntry[];
};

export type EventEntry = {
  imageUrl: string;
  imageAlt?: string;
  dateLine: string;
  typeLabel: string;
  costLabel: string;
  title: string;
  href: string;
  tags?: string[];
};

export type EventsCallout = {
  eyebrow?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type EventsListingBlock = {
  type: "eventsListing";
  hero?: {
    imageUrl?: string;
    imageAlt?: string;
    title: string;
    breadcrumbHomeLabel?: string;
    breadcrumbCurrentLabel?: string;
    breadcrumbHomeHref?: string;
  };
  introHeading?: string;
  introBody?: string[];
  callout?: EventsCallout;
  events: EventEntry[];
  initialVisible?: number;
  loadMoreStep?: number;
  loadMoreLabel?: string;
  showingTemplate?: string;
  learnMoreLabel?: string;
};

export type PayBillBlock = {
  type: "payBill";
  logoUrl?: string;
  brandLabel?: string;
  heading?: string;
  introText?: string;
  usernameLabel?: string;
  usernamePlaceholder?: string;
  usernameHelper?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  passwordHelper?: string;
  loginLabel?: string;
  forgotPasswordLabel?: string;
  forgotPasswordUrl?: string;
  needHelpLabel?: string;
  needHelpUrl?: string;
  oneTimePaymentLabel?: string;
  oneTimePaymentUrl?: string;
  registerLabel?: string;
  registerUrl?: string;
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
  | ArticleListBlock
  | FormBlock
  | LocationsDirectoryBlock
  | PortalApplicationsBlock
  | PayBillBlock
  | EventsListingBlock;

export type BasePage = {
  id: string;
  translationKey: string;
  locale: Locale;
  status: PublishStatus;
  contentSource?: "optimizely";
  slug: string[];
  title: string;
  eyebrow?: string;
  summary: string;
  seo: SeoFields;
  sections: Block[];
};

export type HomePage = BasePage & {
  type: "home";
  headerVideoUrl?: string;
  headerVideoPoster?: string;
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
  authorName?: string;
  publishedAt: string;
  readTime: string;
  topics: string[];
  relatedServiceIds: string[];
  relatedIndustryIds: string[];
  relatedInsightIds?: {
    topPicks: string[];
    readMore: string[];
  };
  uiLabels?: {
    backToArticles?: string;
    keyTakeaways?: string;
    topPicks?: string;
    readMore?: string;
    authors?: string;
    viewProfile?: string;
    readFullStory?: string;
  };
  cardImage?: {
    src: string;
    alt: string;
  };
};

export type AuthorPage = BasePage & {
  type: "author";
  role: string;
  expertise: string[];
  avatarSrc?: string;
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

export type NavigationGroup = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type NavigationItem = {
  label: string;
  href: string;
  groups?: NavigationGroup[];
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

export type AlertsCalloutContent = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type SiteFooterContent = {
  eyebrow?: string;
  title?: string;
  body?: string;
  brandLabel?: string;
  columns: SiteFooterColumn[];
  socialLinks: LinkField[];
  copyrightText?: string;
  alertsCallout?: AlertsCalloutContent;
};

export type SubscriptionTopic = {
  title: string;
  body: string;
};

export type SubscriptionPageContent = {
  pageTitle: string;
  breadcrumbHomeLabel: string;
  heading: string;
  intro: string;
  emailsConsentTitle: string;
  emailsConsentBody: string;
  topicsHelpText: string;
  topics: SubscriptionTopic[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
  backLabel: string;
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