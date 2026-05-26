import type { Page } from "@/lib/cms/types";

export function buildEnPagesPart2(): Page[] {
  return [
  {
    id: "author-elias-en",
    translationKey: "author-elias",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "elias-hart"],
    title: "Elias Hart",
    eyebrow: "Author",
    summary: "Managing director focused on risk transformation and operating model design.",
    seo: {
      title: "Elias Hart | Summit Advisory Group",
      description: "Author and advisor profile for Elias Hart.",
    },
    role: "Managing director, enterprise risk",
    expertise: ["Risk modernization", "Program management", "Healthcare operations"],
    sections: [
      {
        type: "richText",
        body: [
          "Use author pages to connect people, expertise, and related insights without repeating content manually.",
        ],
      },
    ],
  },
  {
    id: "insight-preview-en",
    translationKey: "insight-preview",
    type: "insight",
    locale: "en",
    status: "published",
    slug: ["insights", "why-preview-trust-decides-cms-adoption"],
    title: "Why preview trust decides CMS adoption",
    eyebrow: "Insight",
    summary:
      "Editors will work around a new platform quickly if preview is unreliable, slow, or inconsistent with production.",
    seo: {
      title: "Why preview trust decides CMS adoption | Summit Advisory Group",
      description: "Thought leadership on preview, publishing confidence, and CMS adoption.",
    },
    authorId: "author-nadia",
    publishedAt: "2026-05-01",
    readTime: "6 min read",
    topics: ["Preview", "Governance"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    sections: [
      {
        type: "richText",
        body: [
          "A CMS implementation lives or dies on trust. If preview is wrong, content teams stop believing the system and move back to screenshots, staging links, and manual approvals.",
          "That is why this practice project includes a draft-mode path from day one instead of treating preview as a late add-on.",
        ],
      },
      {
        type: "cta",
        title: "Inspect the draft path",
        body: "Enable preview mode and compare the homepage hero against live content.",
        action: {
          label: "Enable preview",
          href: "/api/draft?secret=local-preview-secret&slug=/en",
        },
        tone: "accent",
      },
    ],
  },
  {
    id: "insight-taxonomy-en",
    translationKey: "insight-taxonomy",
    type: "insight",
    locale: "en",
    status: "published",
    slug: ["insights", "service-taxonomy-that-editors-can-actually-use"],
    title: "Service taxonomy that editors can actually use",
    eyebrow: "Insight",
    summary:
      "Flat, ambiguous tags look flexible until related content and filtering become impossible to govern.",
    seo: {
      title: "Service taxonomy that editors can actually use | Summit Advisory Group",
      description: "Advice on content modeling and taxonomy design for professional services sites.",
    },
    authorId: "author-nadia",
    publishedAt: "2026-04-18",
    readTime: "5 min read",
    topics: ["Taxonomy", "Content modeling"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: ["industry-healthcare"],
    sections: [
      {
        type: "richText",
        body: [
          "Editors need a small set of clear relationships, not a vague sea of tags. In this project, services, industries, authors, and topics are modeled explicitly so related content stays reliable.",
        ],
      },
    ],
  },
  {
    id: "insight-healthcare-en",
    translationKey: "insight-healthcare",
    type: "insight",
    locale: "en",
    status: "published",
    slug: ["insights", "three-signals-your-health-system-needs-a-content-operating-model"],
    title: "Three signals your health system needs a content operating model",
    eyebrow: "Insight",
    summary:
      "Healthcare organizations often have enough content. What they lack is a model for keeping information current, trusted, and governed.",
    seo: {
      title: "Three signals your health system needs a content operating model | Summit Advisory Group",
      description: "Healthcare-focused thought leadership on content operations and governance.",
    },
    authorId: "author-elias",
    publishedAt: "2026-03-30",
    readTime: "7 min read",
    topics: ["Healthcare", "Operations"],
    relatedServiceIds: ["service-risk", "service-platform"],
    relatedIndustryIds: ["industry-healthcare"],
    sections: [
      {
        type: "richText",
        body: [
          "When ownership is fragmented across service lines, markets, and campaign teams, healthcare content gets stale quickly. Good governance is as much an operating model issue as a technology issue.",
        ],
      },
    ],
  },
  {
    id: "case-study-healthcare-en",
    translationKey: "case-study-healthcare",
    type: "caseStudy",
    locale: "en",
    status: "published",
    slug: ["case-studies", "regional-provider-content-redesign"],
    title: "Regional provider redesigns content operations",
    eyebrow: "Case study",
    summary:
      "A healthcare provider streamlined publishing workflows, reduced stale content, and improved stakeholder trust in website updates.",
    seo: {
      title: "Regional provider redesigns content operations | Summit Advisory Group",
      description: "Case study on healthcare content operations and CMS workflow improvement.",
    },
    client: "Regional provider network",
    challenge: "Inconsistent publishing standards and no trusted preview path across service lines.",
    result: "Launch velocity improved while content quality and governance became easier to enforce.",
    relatedServiceIds: ["service-platform", "service-risk"],
    relatedIndustryIds: ["industry-healthcare"],
    sections: [
      {
        type: "stats",
        title: "Illustrative outcomes",
        items: [
          { label: "Approval steps simplified", value: "38%" },
          { label: "Stale content reduced", value: "52%" },
          { label: "New templates introduced", value: "11" },
        ],
      },
      {
        type: "richText",
        body: [
          "Case studies are where service claims become believable. Use them to connect industries, outcomes, and reusable proof content.",
        ],
      },
    ],
  },
  {
    id: "resource-center-en",
    translationKey: "resource-center",
    type: "resourceCenter",
    locale: "en",
    status: "published",
    slug: ["resource-center"],
    title: "Resource center",
    eyebrow: "Insights hub",
    summary:
      "A query-driven listing page for insights, filters, and content relationships.",
    seo: {
      title: "Resource center | Summit Advisory Group",
      description: "Search and filter insights across services, industries, and topics.",
    },
    featuredTopics: ["Preview", "Healthcare", "Taxonomy"],
    sections: [
      {
        type: "richText",
        body: [
          "This page is intentionally query-driven. It is where your architecture starts proving whether content relationships and filtering rules actually work.",
        ],
      },
    ],
  },
  {
    id: "contact-en",
    translationKey: "contact",
    type: "contact",
    locale: "en",
    status: "published",
    slug: ["contact"],
    title: "Talk with the digital experience team",
    eyebrow: "Contact",
    summary:
      "Use the embedded lead form to practice the split between CMS-managed content and app-managed business data.",
    seo: {
      title: "Contact | Summit Advisory Group",
      description: "Lead generation page for the local practice build.",
    },
    offices: [
      {
        city: "Milwaukee",
        phone: "(414) 555-0132",
        focus: "Corporate marketing and digital platforms",
      },
      {
        city: "Minneapolis",
        phone: "(612) 555-0176",
        focus: "Risk, operations, and healthcare transformation",
      },
    ],
    sections: [
      {
        type: "form",
        title: "Start a scoped conversation",
        intro:
          "This form stores submissions locally so you can validate end-to-end behavior without external services.",
        submitLabel: "Send request",
        formId: "lead",
      },
      {
        type: "cta",
        title: "Need to verify publish freshness too?",
        body: "Use the revalidation endpoint after you wire a real content source or change the mock adapter.",
        action: {
          label: "Stay on this page",
          href: "/en/contact",
        },
        tone: "accent",
      },
    ],
  },
  {
    id: "placeholder-case-healthcare-operations-modernization-en",
    translationKey: "placeholder-case-healthcare-operations-modernization",
    type: "standard",
    locale: "en",
    status: "published",
    slug: ["case-studies", "case-healthcare-operations-modernization"],
    title: "Case Healthcare operations modernization",
    eyebrow: "Case study",
    summary: "",
    seo: {
      title: "Case Healthcare operations modernization | Summit Advisory Group",
      description: "Placeholder page for future CMS-authored case study content.",
      noIndex: true,
    },
    sections: [],
  },
  {
    id: "placeholder-modern-finance-transformation-en",
    translationKey: "placeholder-modern-finance-transformation",
    type: "standard",
    locale: "en",
    status: "published",
    slug: ["insights", "modern-finance-transformation"],
    title: "Modern finance transformation",
    eyebrow: "Insight",
    summary: "",
    seo: {
      title: "Modern finance transformation | Summit Advisory Group",
      description: "Placeholder page for future CMS-authored insight content.",
      noIndex: true,
    },
    sections: [],
  },
  {
    id: "placeholder-data-strategy-for-growth-en",
    translationKey: "placeholder-data-strategy-for-growth",
    type: "standard",
    locale: "en",
    status: "published",
    slug: ["insights", "data-strategy-for-growth"],
    title: "Data strategy for growth",
    eyebrow: "Insight",
    summary: "",
    seo: {
      title: "Data strategy for growth | Summit Advisory Group",
      description: "Placeholder page for future CMS-authored insight content.",
      noIndex: true,
    },
    sections: [],
  },
];
}
