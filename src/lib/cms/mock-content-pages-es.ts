import type { Page } from "@/lib/cms/types";
import { articleTranslationKeys } from "./mock-articles";

export function buildEsPages(deps: {
  spanishArticlePages: Page[];
  spanishEventsPages: Page[];
}): Page[] {
  const { spanishArticlePages, spanishEventsPages } = deps;
  return [
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
}
