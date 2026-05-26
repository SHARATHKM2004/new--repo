import type { OptimizelyJsonBlock, OptimizelyJsonMetadata } from "./optimizely-block-type";

export type { OptimizelyJsonBlock, OptimizelyJsonMetadata };

export type OptimizelyGraphResponse<T> = {
  data?: T;
  errors?: Array<{
    message: string;
  }>;
};

export type OptimizelyRichTextField = {
  html?: string;
  json?: unknown;
};

export type OptimizelyCmsPageItem = {
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
    authorId?: string;
    publishedAt?: string;
    readTime?: string;
    topics?: string[];
    relatedServiceIds?: string[];
    relatedIndustryIds?: string[];
    cardImageUrl?: string;
    CardImageUrl?: string;
    cardImageAlt?: string;
    CardImageAlt?: string;
    role?: string;
    expertise?: string[];
    avatarSrc?: string;
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

export type OptimizelyStartPageItem = {
  title: string | null;
  shortDescription: string | null;
  keywords: string | null;
  _json?: {
    title?: string;
    shortDescription?: string;
    keywords?: string;
    headerVideoUrl?: string;
    HeaderVideoUrl?: string;
    headerVideoPoster?: string;
    HeaderVideoPoster?: string;
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


export type OptimizelyCmsPageListItem = {
  title: string | null;
  shortDescription: string | null;
  _metadata?: {
    key?: string;
    locale?: string;
    displayName?: string;
    types?: string[];
  };
};

export type OptimizelyHeaderItem = {
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

export type OptimizelyFooterItem = {
  copyrightText: string | null;
  _json?: {
    eyebrow?: string;
    title?: string;
    body?: string | OptimizelyRichTextField;
    brandLabel?: string;
    BrandLabel?: string;
    logoLabel?: string;
    LogoLabel?: string;
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
    alertsEyebrow?: string;
    AlertsEyebrow?: string;
    alertsHeading?: string;
    AlertsHeading?: string;
    alertsBody?: string;
    AlertsBody?: string;
    alertsCtaLabel?: string;
    AlertsCtaLabel?: string;
    alertsCtaHref?: string;
    AlertsCtaHref?: string;
  };
};

