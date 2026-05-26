// keyword metadata + page-type helpers extracted from index.ts
export function normalizeKeywords(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeStringArray(values?: string[] | null) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

export function parseCmsKeywordMetadata(value?: string | null) {
  const entries = (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const topics: string[] = [];
  const services: string[] = [];
  const industries: string[] = [];
  const topPickIds: string[] = [];
  const readMoreIds: string[] = [];
  let authorName: string | undefined;
  let authorId: string | undefined;
  let publishedAt: string | undefined;
  let readTime: string | undefined;
  let backToArticlesLabel: string | undefined;
  let keyTakeawaysLabel: string | undefined;
  let topPicksLabel: string | undefined;
  let readMoreLabel: string | undefined;
  let authorsLabel: string | undefined;
  let viewProfileLabel: string | undefined;
  let readFullStoryLabel: string | undefined;

  for (const entry of entries) {
    const separatorIndex = entry.indexOf(":");

    if (separatorIndex === -1) {
      topics.push(entry);
      continue;
    }

    const key = entry.slice(0, separatorIndex).trim().toLowerCase();
    const fieldValue = entry.slice(separatorIndex + 1).trim();

    if (!fieldValue) {
      continue;
    }

    switch (key) {
      case "author":
        authorName = fieldValue;
        break;
      case "authorid":
        authorId = fieldValue;
        break;
      case "date":
      case "publisheddate":
        publishedAt = fieldValue;
        break;
      case "time":
      case "readtime":
        readTime = fieldValue;
        break;
      case "topic":
      case "tag":
        topics.push(fieldValue);
        break;
      case "service":
        services.push(fieldValue);
        break;
      case "industry":
        industries.push(fieldValue);
        break;
      case "toppickid":
      case "toppicksid":
        topPickIds.push(fieldValue);
        break;
      case "readmoreid":
        readMoreIds.push(fieldValue);
        break;
      case "backlabel":
      case "backtoarticleslabel":
        backToArticlesLabel = fieldValue;
        break;
      case "keytakeawayslabel":
      case "takeawayslabel":
        keyTakeawaysLabel = fieldValue;
        break;
      case "toppickslabel":
        topPicksLabel = fieldValue;
        break;
      case "readmorelabel":
        readMoreLabel = fieldValue;
        break;
      case "authorslabel":
        authorsLabel = fieldValue;
        break;
      case "viewprofilelabel":
        viewProfileLabel = fieldValue;
        break;
      case "readfullstorylabel":
        readFullStoryLabel = fieldValue;
        break;
      default:
        topics.push(fieldValue);
        break;
    }
  }

  return {
    authorName,
    authorId,
    publishedAt,
    readTime,
    topics,
    relatedServiceIds: services,
    relatedIndustryIds: industries,
    relatedInsightIds: {
      topPicks: topPickIds,
      readMore: readMoreIds,
    },
    uiLabels: {
      backToArticles: backToArticlesLabel,
      keyTakeaways: keyTakeawaysLabel,
      topPicks: topPicksLabel,
      readMore: readMoreLabel,
      authors: authorsLabel,
      viewProfile: viewProfileLabel,
      readFullStory: readFullStoryLabel,
    },
  };
}

export function inferCmsPageType(slug: string[], pageType?: string | null) {
  const normalizedPageType = pageType?.trim().toLowerCase();

  switch (normalizedPageType) {
    case "service":
    case "industry":
    case "insight":
    case "author":
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
    case "article":
      return slug.length > 1 && slug[1] !== "all" ? ("insight" as const) : ("standard" as const);
    case "services":
      return "service" as const;
    case "industries":
      return "industry" as const;
    case "resource-center":
      return "resourceCenter" as const;
    case "contact":
      return "contact" as const;
    case "rfp":
      return "contact" as const;
    default:
      return "standard" as const;
  }
}

export function normalizeOptimizelySlug(pathname?: string) {
  if (!pathname) {
    return [];
  }

  return pathname
    .split("/")
    .filter(Boolean)
    .slice(1);
}

