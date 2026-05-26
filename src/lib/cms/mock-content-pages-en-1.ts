import type { Page } from "@/lib/cms/types";

export function buildEnPagesPart1(): Page[] {
  return [
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
  ];
}
