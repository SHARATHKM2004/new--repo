import type { AuthorPage, InsightPage, Page } from "@/lib/cms/types";

const articleAuthors: AuthorPage[] = [
  {
    id: "author-bryan-powrozek-en",
    translationKey: "author-bryan-powrozek",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "bryan-powrozek"],
    title: "Bryan Powrozek",
    eyebrow: "Author",
    summary: "Principal focused on manufacturing strategy, smart operations, and plant modernization.",
    seo: {
      title: "Bryan Powrozek | Summit Advisory Group",
      description: "Author profile for Bryan Powrozek.",
    },
    role: "Principal, industrial operations",
    expertise: ["Manufacturing", "Automation", "Technology consulting"],
    avatarSrc: "https://i.pravatar.cc/96?img=12",
    sections: [
      {
        type: "richText",
        body: [
          "Bryan advises industrial clients on automation, plant data visibility, and operating-model change.",
        ],
      },
    ],
  },
  {
    id: "author-nick-ansley-en",
    translationKey: "author-nick-ansley",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "nick-g-ansley"],
    title: "Nick G. Ansley",
    eyebrow: "Author",
    summary: "Advisor to financial institutions navigating controls, compliance, and modernization programs.",
    seo: {
      title: "Nick G. Ansley | Summit Advisory Group",
      description: "Author profile for Nick G. Ansley.",
    },
    role: "Managing director, financial risk",
    expertise: ["Financial services", "Risk advisory", "Controls modernization"],
    avatarSrc: "https://i.pravatar.cc/96?img=15",
    sections: [
      {
        type: "richText",
        body: [
          "Nick writes about governance, reporting, and control environments for regulated organizations.",
        ],
      },
    ],
  },
  {
    id: "author-marybeth-marchione-en",
    translationKey: "author-marybeth-marchione",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "mary-beth-marchione"],
    title: "Mary Beth Marchione",
    eyebrow: "Author",
    summary: "Strategy leader covering fintech, digital platforms, and growth-stage governance.",
    seo: {
      title: "Mary Beth Marchione | Summit Advisory Group",
      description: "Author profile for Mary Beth Marchione.",
    },
    role: "Partner, fintech strategy",
    expertise: ["Technology companies", "Risk advisory", "Payments"],
    avatarSrc: "https://i.pravatar.cc/96?img=32",
    sections: [
      {
        type: "richText",
        body: [
          "Mary Beth helps operators turn emerging-market complexity into clearer product and governance decisions.",
        ],
      },
    ],
  },
  {
    id: "author-alicia-roberts-en",
    translationKey: "author-alicia-roberts",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "alicia-roberts"],
    title: "Alicia Roberts",
    eyebrow: "Author",
    summary: "Leader in customer experience, digital content strategy, and commercial growth programs.",
    seo: {
      title: "Alicia Roberts | Summit Advisory Group",
      description: "Author profile for Alicia Roberts.",
    },
    role: "Director, digital growth",
    expertise: ["Customer experience", "B2B marketing", "Content strategy"],
    avatarSrc: "https://i.pravatar.cc/96?img=44",
    sections: [
      {
        type: "richText",
        body: [
          "Alicia focuses on how advisory firms turn expertise into a clearer digital buyer journey.",
        ],
      },
    ],
  },
  {
    id: "author-devon-cho-en",
    translationKey: "author-devon-cho",
    type: "author",
    locale: "en",
    status: "published",
    slug: ["authors", "devon-cho"],
    title: "Devon Cho",
    eyebrow: "Author",
    summary: "Operations advisor writing on logistics, energy, and enterprise transformation sequencing.",
    seo: {
      title: "Devon Cho | Summit Advisory Group",
      description: "Author profile for Devon Cho.",
    },
    role: "Director, operations transformation",
    expertise: ["Logistics", "Energy", "Program execution"],
    avatarSrc: "https://i.pravatar.cc/96?img=53",
    sections: [
      {
        type: "richText",
        body: [
          "Devon covers the execution realities behind automation, service continuity, and enterprise change.",
        ],
      },
    ],
  },
];

const articleBlueprints = [
  {
    translationKey: "article-smart-factory-roi",
    slug: "why-speed-is-the-missing-link-in-automotive-smart-factory-roi",
    title: "Why speed is the missing link in automotive smart factory ROI",
    summary: "Speed to operational learning is what turns factory pilots into ROI, not the number of sensors installed.",
    authorId: "author-bryan-powrozek",
    publishedAt: "2026-05-18",
    readTime: "5 min read",
    topics: ["Manufacturing", "Technology consulting"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
      alt: "Engineer reviewing a smart factory floor",
    },
    body: [
      "Manufacturers do not struggle because they lack use cases. They struggle because decision cycles are too slow to convert pilot signals into real production changes.",
      "The strongest smart-factory programs set up operating rhythms around experiment review, local plant ownership, and ROI checkpoints that can be acted on inside a quarter.",
    ],
  },
  {
    translationKey: "article-bank-fdicia",
    slug: "cfos-if-your-bank-is-approaching-1-billion-in-assets-you-cant-keep-putting-off-fdicia",
    title: "CFOs: If your bank is approaching $1 billion in assets, you can't keep putting off FDICIA",
    summary: "Banks approaching the threshold need governance, controls, and reporting discipline before the deadline pressure peaks.",
    authorId: "author-nick-ansley",
    publishedAt: "2026-05-15",
    readTime: "6 min read",
    topics: ["Financial services", "Risk advisory"],
    relatedServiceIds: ["service-risk"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
      alt: "Advisors reviewing financial reporting on a laptop",
    },
    body: [
      "FDICIA readiness is rarely blocked by technical accounting knowledge alone. More often, the issue is fragmented ownership across finance, controls, and internal audit.",
      "CFOs that start early can phase documentation, testing, and remediation in a way that builds confidence without disrupting growth priorities.",
    ],
  },
  {
    translationKey: "article-stablecoins-fintech-risk",
    slug: "stablecoins-represent-a-growing-but-potentially-risky-part-of-the-financial-system-what-do-fintech-leaders-need-to-know",
    title: "Stablecoins represent a growing but potentially risky part of the financial system. What do fintech leaders need to know?",
    summary: "Product teams need a clearer view of governance, liquidity exposure, and partner risk before stablecoin use moves from experiment to core flow.",
    authorId: "author-marybeth-marchione",
    publishedAt: "2026-05-14",
    readTime: "5 min read",
    topics: ["Technology companies", "Risk advisory"],
    relatedServiceIds: ["service-risk"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      alt: "Leadership team discussing fintech strategy in a meeting room",
    },
    body: [
      "Stablecoins have moved from an edge case to a strategic consideration for many fintech operators. That shift raises harder questions about treasury, counterparties, and product controls.",
      "The right response is not blanket avoidance. It is a more explicit operating model for how emerging payment rails are reviewed, monitored, and escalated.",
    ],
  },
  {
    translationKey: "article-middle-market-plant-analytics",
    slug: "why-middle-market-manufacturers-are-redesigning-plant-analytics-now",
    title: "Why middle-market manufacturers are redesigning plant analytics now",
    summary: "Plant leaders are moving analytics closer to daily decisions instead of leaving insights trapped in monthly reporting decks.",
    authorId: "author-bryan-powrozek",
    publishedAt: "2026-05-12",
    readTime: "4 min read",
    topics: ["Manufacturing", "Operations"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
      alt: "Factory worker reviewing plant analytics on a tablet",
    },
    body: [
      "The analytics redesign happening in middle-market plants is less about dashboards and more about decision timing. Teams need data framed around shifts, bottlenecks, and maintenance tradeoffs.",
      "Programs that win start with a small set of operational questions and design the data flow backwards from those moments.",
    ],
  },
  {
    translationKey: "article-healthcare-ai-governance",
    slug: "what-healthcare-boards-expect-from-ai-risk-governance-in-2026",
    title: "What healthcare boards expect from AI risk governance in 2026",
    summary: "Boards want evidence that AI decisions are governed through clear ownership, clinical context, and auditability.",
    authorId: "author-nick-ansley",
    publishedAt: "2026-05-10",
    readTime: "7 min read",
    topics: ["Healthcare", "Risk advisory"],
    relatedServiceIds: ["service-risk"],
    relatedIndustryIds: ["industry-healthcare"],
    cardImage: {
      src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      alt: "Healthcare executives discussing governance around AI tools",
    },
    body: [
      "Healthcare boards are no longer satisfied with broad assurance that AI use is being monitored. They want to know where decisions are made, who can intervene, and what evidence exists when outcomes are challenged.",
      "That means governance has to be practical enough for operators while still producing decision trails leadership can trust.",
    ],
  },
  {
    translationKey: "article-commercial-banking-controls",
    slug: "the-new-operating-model-for-commercial-banking-controls-modernization",
    title: "The new operating model for commercial banking controls modernization",
    summary: "Controls programs are shifting from periodic remediation projects to persistent product-and-process ownership.",
    authorId: "author-nick-ansley",
    publishedAt: "2026-05-08",
    readTime: "6 min read",
    topics: ["Financial services", "Controls"],
    relatedServiceIds: ["service-risk"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
      alt: "Banking professionals reviewing controls modernization planning",
    },
    body: [
      "Commercial banking control programs break down when they are staffed like one-time initiatives. The underlying processes evolve too quickly for that model to hold.",
      "The stronger pattern is product-style ownership with clearer control maps, issue tracking, and reporting tied to the business rhythm.",
    ],
  },
  {
    translationKey: "article-private-equity-data-room",
    slug: "how-private-equity-portfolio-teams-are-using-data-rooms-after-close",
    title: "How private equity portfolio teams are using data rooms after close",
    summary: "The best portfolio teams are turning diligence structures into operating assets for the first 180 days after close.",
    authorId: "author-alicia-roberts",
    publishedAt: "2026-05-05",
    readTime: "5 min read",
    topics: ["Private equity", "Data strategy"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      alt: "Private equity team in a conference room reviewing portfolio materials",
    },
    body: [
      "Too many data rooms become archival storage the moment a transaction closes. Leading portfolio teams are reusing that structure to accelerate value-creation planning.",
      "The benefit is less duplication and a cleaner handoff into operating dashboards, workplans, and leadership reviews.",
    ],
  },
  {
    translationKey: "article-energy-self-service-reset",
    slug: "what-energy-suppliers-gain-from-a-digital-self-service-reset",
    title: "What energy suppliers gain from a digital self-service reset",
    summary: "Self-service redesign pays off when customer flows reduce friction for both end users and service teams.",
    authorId: "author-devon-cho",
    publishedAt: "2026-05-03",
    readTime: "4 min read",
    topics: ["Energy", "Customer experience"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
      alt: "Energy operations team discussing digital customer service workflows",
    },
    body: [
      "Energy suppliers are under pressure to make digital service simpler while keeping exception handling safe and compliant. That usually requires resetting the workflow, not just refreshing the interface.",
      "The most credible programs map customer effort, internal handoffs, and escalation logic as one connected design problem.",
    ],
  },
  {
    translationKey: "article-wealth-compliance-workflows",
    slug: "a-practical-roadmap-for-wealth-firms-modernizing-compliance-workflows",
    title: "A practical roadmap for wealth firms modernizing compliance workflows",
    summary: "Workflow modernization works when policy intent, user behavior, and evidence capture are redesigned together.",
    authorId: "author-nick-ansley",
    publishedAt: "2026-05-01",
    readTime: "6 min read",
    topics: ["Wealth management", "Compliance"],
    relatedServiceIds: ["service-risk"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
      alt: "Wealth management professionals reviewing compliance workflow steps",
    },
    body: [
      "Compliance teams often inherit workflows that reflect old organizational boundaries instead of current risk priorities. Modernization should start with where decisions and approvals actually happen now.",
      "From there, firms can simplify evidence capture, remove duplicate reviews, and improve management visibility without weakening control intent.",
    ],
  },
  {
    translationKey: "article-insurers-claims-content",
    slug: "why-insurers-are-rethinking-claims-content-for-digital-first-customers",
    title: "Why insurers are rethinking claims content for digital-first customers",
    summary: "Claims journeys are exposing how often content, forms, and service operations are designed separately.",
    authorId: "author-alicia-roberts",
    publishedAt: "2026-04-29",
    readTime: "5 min read",
    topics: ["Insurance", "Customer experience"],
    relatedServiceIds: ["service-platform", "service-risk"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
      alt: "Insurance team discussing digital claims communication",
    },
    body: [
      "Insurers are discovering that digital claims performance is tied closely to the quality of the content customers receive during stressful moments. Content gaps quickly become operational friction.",
      "Teams that redesign this journey well align plain-language guidance, forms logic, and service escalation around the same customer outcome.",
    ],
  },
  {
    translationKey: "article-logistics-automation-sequencing",
    slug: "how-logistics-operators-are-sequencing-automation-without-service-disruption",
    title: "How logistics operators are sequencing automation without service disruption",
    summary: "Successful automation programs are staged around service continuity, labor trust, and exception handling capacity.",
    authorId: "author-devon-cho",
    publishedAt: "2026-04-27",
    readTime: "5 min read",
    topics: ["Logistics", "Automation"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      alt: "Warehouse automation in a logistics environment",
    },
    body: [
      "Logistics leaders know that automation gains can disappear quickly if service levels wobble during rollout. That is why sequencing matters as much as technology selection.",
      "Programs that work tend to isolate failure modes early, build manual fallback paths, and give site leaders a real voice in the cutover plan.",
    ],
  },
  {
    translationKey: "article-treasury-transformation-metrics",
    slug: "three-metrics-that-make-treasury-transformation-programs-believable",
    title: "Three metrics that make treasury transformation programs believable",
    summary: "Leadership confidence rises when treasury transformation is translated into measurable resilience, accuracy, and decision speed.",
    authorId: "author-nick-ansley",
    publishedAt: "2026-04-24",
    readTime: "4 min read",
    topics: ["Treasury", "Transformation"],
    relatedServiceIds: ["service-risk"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      alt: "Finance leader reviewing treasury transformation metrics",
    },
    body: [
      "Treasury programs lose credibility when success is framed in platform language instead of business language. Executives want to know what decisions improve and what risk exposure changes.",
      "A small metric set tied to liquidity visibility, forecast confidence, and cycle-time reduction usually tells the story better than a long backlog report.",
    ],
  },
  {
    translationKey: "article-thought-leadership-pipeline",
    slug: "how-advisory-firms-can-turn-thought-leadership-into-pipeline-signals",
    title: "How advisory firms can turn thought leadership into pipeline signals",
    summary: "Editorial programs work better when content journeys, CRM handoffs, and subject-matter ownership are designed together.",
    authorId: "author-alicia-roberts",
    publishedAt: "2026-04-22",
    readTime: "5 min read",
    topics: ["B2B marketing", "Content strategy"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      alt: "Advisory firm team discussing thought leadership performance",
    },
    body: [
      "Thought leadership rarely fails because the ideas are weak. It fails because the system around the content does not make the next action obvious.",
      "Firms that improve conversion tend to define intended audience paths, surface related proof points, and align follow-up processes before publishing volume increases.",
    ],
  },
  {
    translationKey: "article-b2b-service-microsites",
    slug: "what-enterprise-buyers-expect-from-b2b-service-microsites-now",
    title: "What enterprise buyers expect from B2B service microsites now",
    summary: "Microsites have to feel coherent, credible, and connected to the rest of the buying journey to be worth maintaining.",
    authorId: "author-alicia-roberts",
    publishedAt: "2026-04-19",
    readTime: "4 min read",
    topics: ["B2B marketing", "Digital experience"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      alt: "B2B team reviewing a service microsite strategy",
    },
    body: [
      "Enterprise buyers are less tolerant of disconnected campaign experiences than they were a few years ago. A microsite now has to earn its place in the broader architecture.",
      "That means stronger navigation, clearer proof, and more intentional connections back to the main service and contact flows.",
    ],
  },
  {
    translationKey: "article-finance-platform-governance",
    slug: "a-cfo-guide-to-governance-before-a-finance-platform-migration",
    title: "A CFO guide to governance before a finance platform migration",
    summary: "Platform migration decisions land better when governance is clarified before build choices harden into delivery risk.",
    authorId: "author-nick-ansley",
    publishedAt: "2026-04-16",
    readTime: "6 min read",
    topics: ["Finance", "Governance"],
    relatedServiceIds: ["service-risk", "service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      alt: "Finance executive planning platform migration governance",
    },
    body: [
      "Migration programs often concentrate on tool selection too early. Finance leaders create less delivery risk when they define decision rights, escalation paths, and reporting expectations upfront.",
      "That governance work gives the implementation a steadier shape and reduces the number of late surprises that derail timelines.",
    ],
  },
  {
    translationKey: "article-healthcare-access-orchestration",
    slug: "what-health-systems-learn-when-patient-access-orchestration-finally-gets-measured",
    title: "What health systems learn when patient access orchestration finally gets measured",
    summary: "Patient access redesign becomes more credible when teams can see wait-time friction, content confusion, and handoff loss in one picture.",
    authorId: "author-devon-cho",
    publishedAt: "2026-04-14",
    readTime: "5 min read",
    topics: ["Healthcare", "Operations"],
    relatedServiceIds: ["service-platform", "service-risk"],
    relatedIndustryIds: ["industry-healthcare"],
    cardImage: {
      src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
      alt: "Healthcare operations team planning patient access improvements",
    },
    body: [
      "Patient access problems usually span staffing, process design, digital content, and system handoffs. Measuring only one of those layers hides the actual bottlenecks.",
      "Health systems that orchestrate the full journey can make smarter staffing choices and simplify how patients move from intent to scheduled care.",
    ],
  },
  {
    translationKey: "article-industrial-safety-dashboards",
    slug: "why-industrial-safety-dashboards-fail-without-line-supervisor-ownership",
    title: "Why industrial safety dashboards fail without line-supervisor ownership",
    summary: "Dashboards help only when frontline leaders see them as tools for action rather than compliance artifacts.",
    authorId: "author-bryan-powrozek",
    publishedAt: "2026-04-12",
    readTime: "4 min read",
    topics: ["Manufacturing", "Safety"],
    relatedServiceIds: ["service-platform"],
    relatedIndustryIds: [],
    cardImage: {
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      alt: "Industrial supervisor reviewing safety and operations data",
    },
    body: [
      "Safety dashboards fail when they are designed for executive reporting but expected to change frontline behavior. The daily owner has to see a clear decision inside the data.",
      "Line supervisors adopt tools faster when the metrics connect directly to shift planning, escalation, and near-term risk reduction.",
    ],
  },
] as const;

function createArticleInsightPage(article: (typeof articleBlueprints)[number]): InsightPage {
  return {
    id: `${article.translationKey}-en`,
    translationKey: article.translationKey,
    type: "insight",
    locale: "en",
    status: "published",
    slug: ["article", article.slug],
    title: article.title,
    eyebrow: "Article",
    summary: article.summary,
    seo: {
      title: `${article.title} | Summit Advisory Group`,
      description: article.summary,
    },
    authorId: article.authorId,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    topics: [...article.topics],
    relatedServiceIds: [...article.relatedServiceIds],
    relatedIndustryIds: [...article.relatedIndustryIds],
    cardImage: article.cardImage,
    sections: [
      {
        type: "image",
        src: article.cardImage.src,
        alt: article.cardImage.alt,
        caption: article.summary,
      },
      {
        type: "richText",
        body: [...article.body],
      },
      {
        type: "cta",
        title: "Continue exploring the article library",
        body: "Return to the article hub to browse more stories from the CMS-backed listing.",
        action: {
          label: "View all articles",
          href: "/en/article/all",
        },
        tone: "accent",
      },
    ],
  };
}

const articleTranslationKeys = articleBlueprints.map((article) => article.translationKey);
const articleInsightPages = articleBlueprints.map(createArticleInsightPage);
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
  spanishArticlePages[1],
];

export const mockPages: Page[] = [...enPages, ...esPages];