import type { Page } from "@/lib/cms/types";

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
];

export const mockPages: Page[] = [...enPages, ...esPages];