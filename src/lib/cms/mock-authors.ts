import type { AuthorPage } from "@/lib/cms/types";

export const articleAuthors: AuthorPage[] = [
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
        body: ["Bryan advises industrial clients on automation, plant data visibility, and operating-model change."],
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
        body: ["Nick writes about governance, reporting, and control environments for regulated organizations."],
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
        body: ["Mary Beth helps operators turn emerging-market complexity into clearer product and governance decisions."],
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
        body: ["Alicia focuses on how advisory firms turn expertise into a clearer digital buyer journey."],
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
        body: ["Devon covers the execution realities behind automation, service continuity, and enterprise change."],
      },
    ],
  },
];
