import type { Page } from "@/lib/cms/types";
import { articleAuthors } from "./mock-authors";
import { articleBlueprints, createArticleInsightPage, articleTranslationKeys, articleInsightPages } from "./mock-articles";

const eventsImagePool = [
  "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=70",
  "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=900&q=70",
];

const englishEvents = [
  {
    dateLine: "May 26 - May 28, 2026",
    typeLabel: "Live Webinar",
    costLabel: "Cost $1050",
    title: "Uniform Guidance regulation training",
    href: "/en/events/uniform-guidance-regulation-training",
    tags: ["Nonprofits", "Governments", "Education", "Tribal gaming and government"],
  },
  {
    dateLine: "May 27, 2026 01:00 PM - 02:30 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost $95",
    title: "Designing recruitment strategies to attract, inspire and hire talent",
    href: "/en/events/designing-recruitment-strategies",
    tags: [
      "Nonprofits",
      "Governments",
      "Education",
      "Construction",
      "Consumer products",
      "Distribution",
      "Healthcare",
      "Financial services",
      "Insurance",
      "Manufacturing",
      "Private equity",
      "Real estate",
      "Retail consulting",
      "Technology industry",
    ],
  },
  {
    dateLine: "May 27, 2026 01:00 PM - 02:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Elevate your Sage Intacct: Q3 2026",
    href: "/en/events/elevate-your-sage-intacct-q3-2026",
    tags: [],
  },
  {
    dateLine: "May 28, 2026 01:00 PM - 02:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "More than a return: Why you need a strategic tax review",
    href: "/en/events/more-than-a-return-strategic-tax-review",
    tags: [],
  },
  {
    dateLine: "Jun 04, 2026 09:30 AM - 11:00 AM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "IT Leadership Roundtable: Evaluating hosting and \u201cas-a-service\u201d infrastructure models",
    href: "/en/events/it-leadership-roundtable",
    tags: ["Financial services", "Financial Institutions", "Banks", "Credit unions"],
  },
  {
    dateLine: "Jun 18, 2026 12:00 PM - 01:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "AI in NetSuite: Practical use cases, strategies and tools",
    href: "/en/events/ai-in-netsuite",
    tags: [],
  },
  {
    dateLine: "Jun 23, 2026 11:00 AM - 12:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Modernizing FP&A: From spreadsheets to decision intelligence",
    href: "/en/events/modernizing-fpa",
    tags: ["Financial services", "Manufacturing", "Distribution"],
  },
  {
    dateLine: "Jul 09, 2026 10:00 AM - 11:30 AM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Cybersecurity readiness for community banks",
    href: "/en/events/cybersecurity-readiness-banks",
    tags: ["Banks", "Credit unions", "Financial Institutions"],
  },
  {
    dateLine: "Jul 22, 2026 01:00 PM - 02:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Healthcare revenue cycle optimization",
    href: "/en/events/healthcare-revenue-cycle",
    tags: ["Healthcare"],
  },
  {
    dateLine: "Aug 05, 2026 12:00 PM - 01:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "ESG reporting essentials for private companies",
    href: "/en/events/esg-reporting-essentials",
    tags: ["Manufacturing", "Consumer products", "Private equity"],
  },
  {
    dateLine: "Aug 19, 2026 09:00 AM - 03:00 PM (CT)",
    typeLabel: "In-Person",
    costLabel: "Cost $495",
    title: "Annual nonprofit finance forum",
    href: "/en/events/annual-nonprofit-finance-forum",
    tags: ["Nonprofits"],
  },
  {
    dateLine: "Sep 10, 2026 11:00 AM - 12:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Tax planning for closely held businesses",
    href: "/en/events/tax-planning-closely-held",
    tags: ["Construction", "Real estate", "Manufacturing"],
  },
  {
    dateLine: "Sep 24, 2026 02:00 PM - 03:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Optimizing Microsoft Dynamics 365 Business Central",
    href: "/en/events/optimizing-d365-business-central",
    tags: ["Distribution", "Manufacturing", "Technology industry"],
  },
  {
    dateLine: "Oct 14, 2026 10:00 AM - 11:00 AM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Workforce planning trends for 2027",
    href: "/en/events/workforce-planning-2027",
    tags: ["Healthcare", "Financial services", "Manufacturing"],
  },
  {
    dateLine: "Oct 28, 2026 09:00 AM - 04:00 PM (CT)",
    typeLabel: "In-Person",
    costLabel: "Cost $750",
    title: "Government leadership summit",
    href: "/en/events/government-leadership-summit",
    tags: ["Governments", "Tribal gaming and government"],
  },
  {
    dateLine: "Nov 12, 2026 12:00 PM - 01:00 PM (CT)",
    typeLabel: "Live Webinar",
    costLabel: "Cost Free",
    title: "Year-end accounting and audit readiness",
    href: "/en/events/year-end-accounting-audit-readiness",
    tags: ["Nonprofits", "Construction", "Manufacturing"],
  },
] as const;

const englishEventsListEntries = englishEvents.map((event, index) => ({
  imageUrl: eventsImagePool[index % eventsImagePool.length],
  imageAlt: event.title,
  dateLine: event.dateLine,
  typeLabel: event.typeLabel,
  costLabel: event.costLabel,
  title: event.title,
  href: event.href,
  tags: [...event.tags],
}));

const englishEventsPages: Page[] = [
  {
    id: "events-en",
    translationKey: "events",
    type: "standard",
    locale: "en",
    status: "published",
    slug: ["events"],
    title: "",
    eyebrow: "",
    summary: "",
    seo: {
      title: "Events | Summit Advisory Group",
      description:
        "Upcoming events, seminars, webinars, and forums hosted by Summit Advisory Group.",
    },
    sections: [
      {
        type: "eventsListing",
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=70",
          imageAlt: "Speaker presenting at an event",
          title: "Upcoming Events",
          breadcrumbHomeLabel: "Home",
          breadcrumbCurrentLabel: "Events",
          breadcrumbHomeHref: "/",
        },
        introHeading: "Events to help grow your organization",
        introBody: [
          "Summit Advisory Group offers various events, seminars and forums on a wide range of topics during the course of the year. We are excited to offer you a wide variety of forums to help you stay ahead of the curve and help your organization continue to grow.",
          "Search our wide selection of learning opportunities via industry, service, type or location.",
        ],
        callout: {
          eyebrow: "ARE YOU READY FOR THE FUTURE?",
          body: "Our team provides insights through thought leadership articles, publications and events.",
          ctaLabel: "Learn more",
          ctaHref: "/resource-center",
        },
        events: englishEventsListEntries,
        initialVisible: 6,
        loadMoreStep: 4,
        loadMoreLabel: "Load more",
        learnMoreLabel: "Learn more",
      },
    ],
  },
];

const spanishEventsListEntries = englishEventsListEntries.map((event) => ({
  ...event,
  href: event.href.replace("/en/", "/es/"),
}));

const spanishEventsPages: Page[] = [
  {
    id: "events-es",
    translationKey: "events",
    type: "standard",
    locale: "es",
    status: "published",
    slug: ["events"],
    title: "",
    eyebrow: "",
    summary: "",
    seo: {
      title: "Eventos | Summit Advisory Group",
      description:
        "Proximos eventos, seminarios, webinars y foros organizados por Summit Advisory Group.",
    },
    sections: [
      {
        type: "eventsListing",
        hero: {
          imageUrl:
            "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=70",
          imageAlt: "Ponente presentando en un evento",
          title: "Proximos Eventos",
          breadcrumbHomeLabel: "Inicio",
          breadcrumbCurrentLabel: "Eventos",
          breadcrumbHomeHref: "/",
        },
        introHeading: "Eventos para ayudar a crecer su organizacion",
        introBody: [
          "Summit Advisory Group ofrece distintos eventos, seminarios y foros sobre una amplia variedad de temas durante el ano. Nos complace ofrecerle una amplia variedad de foros para mantenerse a la vanguardia y ayudar a su organizacion a seguir creciendo.",
          "Explore nuestra amplia seleccion de oportunidades de aprendizaje por industria, servicio, tipo o ubicacion.",
        ],
        callout: {
          eyebrow: "ESTA LISTO PARA EL FUTURO?",
          body: "Nuestro equipo aporta perspectivas a traves de articulos, publicaciones y eventos.",
          ctaLabel: "Mas informacion",
          ctaHref: "/resource-center",
        },
        events: spanishEventsListEntries,
        initialVisible: 6,
        loadMoreStep: 4,
        loadMoreLabel: "Cargar mas",
        learnMoreLabel: "Mas informacion",
      },
    ],
  },
];

const englishArticlePages: Page[] = [
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
        limit: 3,
        viewAllLabel: "View all articles",
        viewAllHref: "/en/article/all",
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
        limit: 15,
      },
    ],
  },
];

const spanishArticlePages: Page[] = [
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
        limit: 3,
        viewAllLabel: "View all articles",
        viewAllHref: "/es/article/all",
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
        limit: 15,
      },
    ],
  },
];

const enPages: Page[] = [
  {
    id: "home-en-published",
    translationKey: "home",
    type: "home",
    locale: "en",
    status: "published",
    slug: [],
    title: "Confidence for your next move.",
    eyebrow: "Summit Advisory Group",
    summary:
      "A corporate marketing platform for firms that need industry stories, service pages, and a scalable editorial workflow.",
    seo: {
      title: "Summit Advisory Group | Strategy, risk, and digital transformation",
      description:
        "A local full-stack practice site for Optimizely-style page composition, insights, preview, and lead capture.",
    },
    sections: [
      {
        type: "hero",
        eyebrow: "Corporate marketing platform",
        title: "Advisory storytelling built for complex service firms.",
        intro:
          "Create service pages, industry narratives, thought leadership, and campaign CTAs inside a typed CMS pipeline that is ready for preview, localization, and governance.",
        primaryCta: {
          label: "Explore services",
          href: "/en/services/digital-platform-strategy",
        },
        secondaryCta: {
          label: "Visit resource center",
          href: "/en/resource-center",
        },
      },
      {
        type: "stats",
        title: "What this practice build is testing",
        items: [
          { label: "Page types", value: "8" },
          { label: "Reusable sections", value: "7" },
          { label: "Locales", value: "2" },
          { label: "Preview path", value: "Ready" },
        ],
      },
      {
        type: "cardGrid",
        title: "Practice the same site shape you are likely to ship",
        intro:
          "The structure mirrors a consulting or advisory firm website rather than a toy demo.",
        cards: [
          {
            eyebrow: "Service pages",
            title: "Position capabilities clearly",
            body: "Model outcomes, proof points, and related insights without duplicating templates.",
            href: "/en/services/enterprise-risk-operations",
          },
          {
            eyebrow: "Industry pages",
            title: "Tell focused market stories",
            body: "Connect industry pain points to service offerings and proof content.",
            href: "/en/industries/healthcare-financial-resilience",
          },
          {
            eyebrow: "Insights hub",
            title: "Build filterable editorial flows",
            body: "Practice tagging, related content, search, and resource center navigation.",
            href: "/en/resource-center",
          },
        ],
      },
      {
        type: "featuredContent",
        title: "Latest insights",
        intro: "Use this block to mix manually selected or filter-driven editorial content.",
        contentTypes: ["insight"],
        limit: 3,
      },
      {
        type: "cta",
        title: "Pressure-test the full stack, not just the renderer",
        body: "This project already includes preview hooks, a revalidation endpoint, and local lead capture so you can train against the real integration seams.",
        action: {
          label: "Open contact page",
          href: "/en/contact",
        },
        tone: "dark",
      },
    ],
  },
  {
    id: "home-en-draft",
    translationKey: "home",
    type: "home",
    locale: "en",
    status: "draft",
    slug: [],
    title: "Confidence for your next move.",
    eyebrow: "Summit Advisory Group",
    summary:
      "Draft version of the homepage used to verify preview mode and editorial changes before publish.",
    seo: {
      title: "Draft | Summit Advisory Group",
      description: "Draft homepage content for preview mode testing.",
      noIndex: true,
    },
    sections: [
      {
        type: "hero",
        eyebrow: "Preview mode enabled",
        title: "This hero only appears when draft mode is on.",
        intro:
          "Use it to verify preview routing, cache bypassing, and editor confidence before you wire a real Optimizely delivery API.",
        primaryCta: {
          label: "View resource center",
          href: "/en/resource-center",
        },
        secondaryCta: {
          label: "Turn preview off",
          href: "/api/draft/disable",
        },
      },
      {
        type: "stats",
        title: "Draft checks",
        items: [
          { label: "Draft banner", value: "Visible" },
          { label: "Homepage copy", value: "Changed" },
          { label: "Noindex", value: "Enabled" },
          { label: "Live content", value: "Unaffected" },
        ],
      },
      {
        type: "cta",
        title: "Preview the editorial workflow before kickoff",
        body: "Once your real CMS endpoint is available, keep this path and swap the underlying content provider.",
        action: {
          label: "Explore contact flow",
          href: "/en/contact",
        },
        tone: "accent",
      },
    ],
  },
  {
    id: "service-platform-en",
    translationKey: "service-platform",
    type: "service",
    locale: "en",
    status: "published",
    slug: ["services", "digital-platform-strategy"],
    title: "Digital platform strategy",
    eyebrow: "Service",
    summary:
      "Align content systems, web experience, and operating model so marketing teams can move faster with less friction.",
    seo: {
      title: "Digital platform strategy | Summit Advisory Group",
      description:
        "Architect content platforms, governance, and delivery workflows for enterprise marketing organizations.",
    },
    outcomes: [
      "Composable web architecture",
      "Clear CMS governance",
      "Faster campaign launches",
    ],
    sections: [
      {
        type: "richText",
        body: [
          "Enterprise web programs usually fail at the seams: unclear ownership, brittle rendering layers, and no trust in preview or publish flow.",
          "This service page demonstrates the kind of messaging, outcome framing, and related-content model that a professional services site needs.",
        ],
      },
      {
        type: "quote",
        quote:
          "The right CMS project is less about page templates and more about how calmly the organization can operate the site six months later.",
        attribution: "Nadia Patel",
        role: "Principal, digital experience",
      },
      {
        type: "featuredContent",
        title: "Related thinking",
        intro: "Filter-driven content blocks let editors feature relevant proof without hand-curating every page.",
        contentTypes: ["insight", "caseStudy"],
        service: "service-platform",
        limit: 3,
      },
    ],
  },
  {
    id: "service-risk-en",
    translationKey: "service-risk",
    type: "service",
    locale: "en",
    status: "published",
    slug: ["services", "enterprise-risk-operations"],
    title: "Enterprise risk operations",
    eyebrow: "Service",
    summary:
      "Modernize risk, compliance, and operating processes with clearer data, reporting, and change management.",
    seo: {
      title: "Enterprise risk operations | Summit Advisory Group",
      description:
        "Advisory support for risk transformation, controls modernization, and program execution.",
    },
    outcomes: ["Operational clarity", "Program governance", "Executive reporting"],
    sections: [
      {
        type: "richText",
        body: [
          "Service pages should not be long unstructured brochures. They should connect to proof, industries, and next actions.",
        ],
      },
      {
        type: "cta",
        title: "Need industry-specific proof?",
        body: "Connect this service to industries and case studies so editors can tell a more credible story.",
        action: {
          label: "See healthcare example",
          href: "/en/industries/healthcare-financial-resilience",
        },
        tone: "accent",
      },
    ],
  },
  {
    id: "industry-healthcare-en",
    translationKey: "industry-healthcare",
    type: "industry",
    locale: "en",
    status: "published",
    slug: ["industries", "healthcare-financial-resilience"],
    title: "Healthcare financial resilience",
    eyebrow: "Industry",
    summary:
      "Help provider organizations respond to margin pressure, digital expectations, and workforce constraints.",
    seo: {
      title: "Healthcare financial resilience | Summit Advisory Group",
      description:
        "Industry story combining operations, digital experience, and financial resilience for healthcare organizations.",
    },
    audience: ["Integrated health systems", "Regional providers", "Managed care organizations"],
    sections: [
      {
        type: "cardGrid",
        title: "Where healthcare organizations are asking for help",
        cards: [
          {
            title: "Margin recovery",
            body: "Model initiatives, owners, and operating metrics across large transformation programs.",
            href: "/en/services/enterprise-risk-operations",
          },
          {
            title: "Digital front door",
            body: "Modernize patient and stakeholder experience with clearer information architecture and content operations.",
            href: "/en/services/digital-platform-strategy",
          },
        ],
      },
      {
        type: "featuredContent",
        title: "Healthcare insights",
        contentTypes: ["insight", "caseStudy"],
        industry: "industry-healthcare",
        limit: 3,
      },
    ],
  },
  {
    id: "author-nadia-en",
    translationKey: "author-nadia",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "nadia-patel"],
    title: "Nadia Patel",
    eyebrow: "Author",
    summary:
      "Principal advising enterprise teams on content platforms, operating models, and CMS governance.",
    seo: {
      title: "Nadia Patel | Summit Advisory Group",
      description: "Author and advisor profile for Nadia Patel.",
    },
    role: "Principal, digital experience",
    expertise: ["Content operations", "CMS architecture", "Preview workflows"],
    sections: [
      {
        type: "richText",
        body: [
          "Author pages matter on advisory sites because they reinforce credibility, connect expertise to content, and support editorial reuse.",
        ],
      },
    ],
  },
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
  ...articleAuthors,
  ...articleInsightPages,
  englishArticlePages[1],
  ...englishEventsPages,
];

const esPages: Page[] = [
  {
    id: "home-es-published",
    translationKey: "home",
    type: "home",
    locale: "es",
    status: "published",
    slug: [],
    title: "Confianza para su siguiente paso.",
    eyebrow: "Summit Advisory Group",
    summary:
      "Una plataforma corporativa impulsada por CMS para practicar composicion de paginas, contenido editorial y flujos de vista previa.",
    seo: {
      title: "Summit Advisory Group | Estrategia, riesgo y transformacion digital",
      description:
        "Sitio local para practicar una arquitectura tipo Optimizely con localizacion, vista previa y captura de leads.",
    },
    sections: [
      {
        type: "hero",
        eyebrow: "Plataforma de marketing corporativo",
        title: "Historias de asesoramiento para firmas de servicios complejos.",
        intro:
          "Modele paginas de servicios, industrias, liderazgo intelectual y llamados a la accion dentro de una canalizacion tipada lista para vista previa y localizacion.",
        primaryCta: {
          label: "Explorar servicios",
          href: "/es/services/digital-platform-strategy",
        },
        secondaryCta: {
          label: "Ir al centro de recursos",
          href: "/es/resource-center",
        },
      },
      {
        type: "stats",
        title: "Que cubre esta practica",
        items: [
          { label: "Tipos de pagina", value: "8" },
          { label: "Secciones reutilizables", value: "7" },
          { label: "Idiomas", value: "2" },
          { label: "Ruta de preview", value: "Lista" },
        ],
      },
      {
        type: "cta",
        title: "Practique con la misma forma de sitio que construira en un proyecto real",
        body: "La version en espanol es parcial a proposito para que pueda probar la logica de fallback.",
        action: {
          label: "Abrir contacto",
          href: "/es/contact",
        },
        tone: "accent",
      },
    ],
  },
  {
    id: "resource-center-es",
    translationKey: "resource-center",
    type: "resourceCenter",
    locale: "es",
    status: "published",
    slug: ["resource-center"],
    title: "Centro de recursos",
    eyebrow: "Centro editorial",
    summary: "Pagina de listado con filtros y fallback cuando falta traduccion.",
    seo: {
      title: "Centro de recursos | Summit Advisory Group",
      description: "Busque y filtre articulos por temas, servicio e industria.",
    },
    featuredTopics: ["Preview", "Healthcare"],
    sections: [
      {
        type: "richText",
        body: [
          "Algunas piezas del sitio usan contenido en ingles como fallback para probar una estrategia de localizacion mas realista.",
        ],
      },
    ],
  },
  {
    id: "contact-es",
    translationKey: "contact",
    type: "contact",
    locale: "es",
    status: "published",
    slug: ["contact"],
    title: "Hable con el equipo de experiencia digital",
    eyebrow: "Contacto",
    summary: "El formulario guarda envios localmente para practicar un flujo full stack.",
    seo: {
      title: "Contacto | Summit Advisory Group",
      description: "Pagina de contacto y captura de leads.",
    },
    offices: [
      {
        city: "Milwaukee",
        phone: "(414) 555-0132",
        focus: "Plataformas digitales y marketing corporativo",
      },
    ],
    sections: [
      {
        type: "form",
        title: "Inicie la conversacion",
        intro: "Este formulario funciona de extremo a extremo en su maquina local.",
        submitLabel: "Enviar solicitud",
        formId: "lead",
      },
    ],
  },
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
        limit: 3,
        viewAllLabel: "View all articles",
        viewAllHref: "/es/article/all",
      },
    ],
  },
  {
    id: "placeholder-case-healthcare-operations-modernization-es",
    translationKey: "placeholder-case-healthcare-operations-modernization",
    type: "standard",
    locale: "es",
    status: "published",
    slug: ["case-studies", "case-healthcare-operations-modernization"],
    title: "Case Healthcare operations modernization",
    eyebrow: "Caso de estudio",
    summary: "",
    seo: {
      title: "Case Healthcare operations modernization | Summit Advisory Group",
      description: "Pagina placeholder para contenido futuro desde CMS.",
      noIndex: true,
    },
    sections: [],
  },
  {
    id: "placeholder-modern-finance-transformation-es",
    translationKey: "placeholder-modern-finance-transformation",
    type: "standard",
    locale: "es",
    status: "published",
    slug: ["insights", "modern-finance-transformation"],
    title: "Modern finance transformation",
    eyebrow: "Insight",
    summary: "",
    seo: {
      title: "Modern finance transformation | Summit Advisory Group",
      description: "Pagina placeholder para contenido futuro desde CMS.",
      noIndex: true,
    },
    sections: [],
  },
  {
    id: "placeholder-data-strategy-for-growth-es",
    translationKey: "placeholder-data-strategy-for-growth",
    type: "standard",
    locale: "es",
    status: "published",
    slug: ["insights", "data-strategy-for-growth"],
    title: "Data strategy for growth",
    eyebrow: "Insight",
    summary: "",
    seo: {
      title: "Data strategy for growth | Summit Advisory Group",
      description: "Pagina placeholder para contenido futuro desde CMS.",
      noIndex: true,
    },
    sections: [],
  },
  ...spanishArticlePages,
  ...spanishEventsPages,
];

export const mockPages: Page[] = [...enPages, ...esPages];
