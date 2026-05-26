import type { Block } from "@/lib/cms/types";
import type { OptimizelyJsonBlock } from "./optimizely-block-type";

export function mapContentBlock(block: OptimizelyJsonBlock, fallbackTitle?: string): Block | null {
  switch (block.__typename) {
    case "HeroBlock":
      return {
        type: "hero",
        eyebrow: block.showDecoration ? "Live Optimizely Hero" : "Optimizely Hero",
        title: block.title ?? fallbackTitle ?? "Hero",
        intro: block.subtitle ?? "",
      };
    case "ContactBlock":
      return {
        type: "form",
        formId: "lead",
        title: block.title ?? "",
        intro: (block.title?.trim() || block.description?.trim() || ""),
        introText: block.introText ?? block.IntroText ?? undefined,
        emailLabel: block.emailLabel ?? block.EmailLabel ?? undefined,
        firstNameLabel: block.firstNameLabel ?? block.FirstNameLabel ?? undefined,
        lastNameLabel: block.lastNameLabel ?? block.LastNameLabel ?? undefined,
        jobTitleLabel: block.jobTitleLabel ?? block.JobTitleLabel ?? undefined,
        organizationLabel: block.organizationLabel ?? block.OrganizationLabel ?? undefined,
        cityLabel: block.cityLabel ?? block.CityLabel ?? undefined,
        stateLabel: block.stateLabel ?? block.StateLabel ?? undefined,
        phoneLabel: block.phoneLabel ?? block.PhoneLabel ?? undefined,
        messageLabel: block.messageLabel ?? block.MessageLabel ?? undefined,
        emailPlaceholder: block.emailPlaceholder ?? block.EmailPlaceholder ?? undefined,
        firstNamePlaceholder: block.firstNamePlaceholder ?? block.FirstNamePlaceholder ?? undefined,
        lastNamePlaceholder: block.lastNamePlaceholder ?? block.LastNamePlaceholder ?? undefined,
        jobTitlePlaceholder: block.jobTitlePlaceholder ?? block.JobTitlePlaceholder ?? undefined,
        organizationPlaceholder: block.organizationPlaceholder ?? block.OrganizationPlaceholder ?? undefined,
        cityPlaceholder: block.cityPlaceholder ?? block.CityPlaceholder ?? undefined,
        statePlaceholder: block.statePlaceholder ?? block.StatePlaceholder ?? undefined,
        phonePlaceholder: block.phonePlaceholder ?? block.PhonePlaceholder ?? undefined,
        messagePlaceholder: block.messagePlaceholder ?? block.MessagePlaceholder ?? undefined,
        submitLabel: block.submitLabel ?? block.SubmitLabel ?? undefined,
        successMessage: block.successMessage ?? block.SuccessMessage ?? undefined,
        errorMessage: block.errorMessage ?? block.ErrorMessage ?? undefined,
        uploadLabel: block.uploadLabel ?? block.UploadLabel ?? undefined,
        stateAsDropdown: block.stateAsDropdown ?? block.StateAsDropdown ?? undefined,
      };
    case "LocationsDirectoryBlock": {
      const raw = block.officesJson ?? block.OfficesJson ?? "";
      let offices: Array<Record<string, unknown>> = [];
      if (raw && typeof raw === "string") {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) offices = parsed;
        } catch {
          offices = [];
        }
      }
      const normalized = offices
        .map((office) => {
          const strArr = (v: unknown): string[] | undefined => {
            if (!Array.isArray(v)) return undefined;
            const arr = v
              .filter((x): x is string => typeof x === "string")
              .map((x) => x.trim())
              .filter(Boolean);
            return arr.length ? arr : undefined;
          };
          const str = (v: unknown): string | undefined =>
            typeof v === "string" && v.trim() ? v.trim() : undefined;
          return {
            state: str(office.state) ?? "",
            city: str(office.city) ?? "",
            address1: str(office.address1),
            address2: str(office.address2),
            cityStateZip: str(office.cityStateZip),
            phone: str(office.phone),
            fax: str(office.fax),
            slug: str(office.slug),
            intro: str(office.intro),
            paragraphs: strArr(office.paragraphs),
            services: strArr(office.services),
            aboutTitle: str(office.aboutTitle),
            aboutParagraphs: strArr(office.aboutParagraphs),
            email: str(office.email),
            mapEmbedUrl: str(office.mapEmbedUrl),
            mapLinkUrl: str(office.mapLinkUrl),
            mapLinkLabel: str(office.mapLinkLabel),
          };
        })
        .filter((o) => o.state && o.city);
      return normalized.length
        ? {
            type: "locationsDirectory",
            heading: block.title?.trim() || block._metadata?.displayName?.trim() || undefined,
            heroImageUrl: block.heroImageUrl?.trim() || block.HeroImageUrl?.trim() || undefined,
            offices: normalized,
          }
        : null;
    }
    case "PortalApplicationsBlock": {
      const raw = block.applicationsJson ?? block.ApplicationsJson ?? block.ApplicationsJSON;
      let apps: Array<Record<string, unknown>> = [];
      if (Array.isArray(raw)) {
        apps = raw as Array<Record<string, unknown>>;
      } else if (typeof raw === "string" && raw.trim()) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) apps = parsed;
        } catch {
          apps = [];
        }
      }
      const normalized = apps
        .map((app) => ({
          title: typeof app.title === "string" ? app.title.trim() : "",
          description: typeof app.description === "string" ? app.description.trim() : undefined,
          signInUrl: typeof app.signInUrl === "string" ? app.signInUrl.trim() : undefined,
          signInLabel: typeof app.signInLabel === "string" ? app.signInLabel.trim() : undefined,
        }))
        .filter((a) => a.title);
      return {
        type: "portalApplications",
        bannerHeading: block.bannerHeading?.trim() || block.BannerHeading?.trim() || undefined,
        sectionHeading: block.sectionHeading?.trim() || block.SectionHeading?.trim() || undefined,
        introText: block.introText?.trim() || block.IntroText?.trim() || undefined,
        applications: normalized,
      };
    }
    case "PayBillBlock": {
      return {
        type: "payBill",
        logoUrl: block.logoUrl?.trim() || block.LogoUrl?.trim() || undefined,
        brandLabel: block.brandLabel?.trim() || block.BrandLabel?.trim() || undefined,
        heading: block.title?.trim() || undefined,
        introText: block.introText?.trim() || block.IntroText?.trim() || undefined,
        usernameLabel: block.usernameLabel?.trim() || block.UsernameLabel?.trim() || undefined,
        usernamePlaceholder: block.firstNamePlaceholder?.trim() || undefined,
        usernameHelper: block.usernameHelper?.trim() || block.UsernameHelper?.trim() || undefined,
        passwordLabel: block.passwordLabel?.trim() || block.PasswordLabel?.trim() || undefined,
        passwordPlaceholder: block.lastNamePlaceholder?.trim() || undefined,
        passwordHelper: block.passwordHelper?.trim() || block.PasswordHelper?.trim() || undefined,
        loginLabel: block.loginLabel?.trim() || block.LoginLabel?.trim() || undefined,
        forgotPasswordLabel:
          block.forgotPasswordLabel?.trim() || block.ForgotPasswordLabel?.trim() || undefined,
        forgotPasswordUrl:
          block.forgotPasswordUrl?.trim() || block.ForgotPasswordUrl?.trim() || undefined,
        needHelpLabel: block.needHelpLabel?.trim() || block.NeedHelpLabel?.trim() || undefined,
        needHelpUrl: block.needHelpUrl?.trim() || block.NeedHelpUrl?.trim() || undefined,
        oneTimePaymentLabel:
          block.oneTimePaymentLabel?.trim() || block.OneTimePaymentLabel?.trim() || undefined,
        oneTimePaymentUrl:
          block.oneTimePaymentUrl?.trim() || block.OneTimePaymentUrl?.trim() || undefined,
        registerLabel: block.registerLabel?.trim() || block.RegisterLabel?.trim() || undefined,
        registerUrl: block.registerUrl?.trim() || block.RegisterUrl?.trim() || undefined,
      };
    }
    case "SignInBlock": {
      const variantRaw = (block.variant ?? block.Variant ?? "").trim().toLowerCase();
      const variant: "401k" | "hub" | "sharefile" =
        variantRaw === "hub" ? "hub" : variantRaw === "sharefile" ? "sharefile" : "401k";
      return {
        type: "signIn",
        variant,
        configJson: block.signInConfigJson?.trim() || block.SignInConfigJson?.trim() || undefined,
      };
    }
    case "EventsListingBlock": {
      const raw = block.eventsJson ?? block.EventsJson ?? "";
      if (!raw || typeof raw !== "string") {
        return null;
      }
      let parsed: Record<string, unknown> | null = null;
      try {
        const value = JSON.parse(raw);
        if (value && typeof value === "object" && !Array.isArray(value)) {
          parsed = value as Record<string, unknown>;
        }
      } catch {
        parsed = null;
      }
      if (!parsed) {
        return null;
      }
      const eventsRaw = Array.isArray(parsed.events) ? (parsed.events as Array<Record<string, unknown>>) : [];
      const events = eventsRaw
        .map((event) => ({
          imageUrl: typeof event.imageUrl === "string" ? event.imageUrl.trim() : "",
          imageAlt: typeof event.imageAlt === "string" ? event.imageAlt.trim() : undefined,
          dateLine: typeof event.dateLine === "string" ? event.dateLine.trim() : "",
          typeLabel: typeof event.typeLabel === "string" ? event.typeLabel.trim() : "",
          costLabel: typeof event.costLabel === "string" ? event.costLabel.trim() : "",
          title: typeof event.title === "string" ? event.title.trim() : "",
          href: typeof event.href === "string" ? event.href.trim() : "",
          tags: Array.isArray(event.tags)
            ? (event.tags as unknown[])
                .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
                .filter(Boolean)
            : [],
        }))
        .filter((event) => event.title && event.href);
      const hero = parsed.hero && typeof parsed.hero === "object"
        ? (parsed.hero as Record<string, unknown>)
        : null;
      const callout = parsed.callout && typeof parsed.callout === "object"
        ? (parsed.callout as Record<string, unknown>)
        : null;
      const introBody = Array.isArray(parsed.introBody)
        ? (parsed.introBody as unknown[])
            .map((value) => (typeof value === "string" ? value : ""))
            .filter(Boolean)
        : [];
      return {
        type: "eventsListing",
        hero: hero
          ? {
              imageUrl: typeof hero.imageUrl === "string" ? hero.imageUrl.trim() : undefined,
              imageAlt: typeof hero.imageAlt === "string" ? hero.imageAlt.trim() : undefined,
              title: typeof hero.title === "string" && hero.title.trim()
                ? hero.title.trim()
                : "Upcoming Events",
              breadcrumbHomeLabel:
                typeof hero.breadcrumbHomeLabel === "string" ? hero.breadcrumbHomeLabel.trim() : undefined,
              breadcrumbCurrentLabel:
                typeof hero.breadcrumbCurrentLabel === "string" ? hero.breadcrumbCurrentLabel.trim() : undefined,
              breadcrumbHomeHref:
                typeof hero.breadcrumbHomeHref === "string" ? hero.breadcrumbHomeHref.trim() : undefined,
            }
          : undefined,
        introHeading: typeof parsed.introHeading === "string" ? parsed.introHeading.trim() : undefined,
        introBody,
        callout: callout
          ? {
              eyebrow: typeof callout.eyebrow === "string" ? callout.eyebrow.trim() : undefined,
              body: typeof callout.body === "string" ? callout.body.trim() : undefined,
              ctaLabel: typeof callout.ctaLabel === "string" ? callout.ctaLabel.trim() : undefined,
              ctaHref: typeof callout.ctaHref === "string" ? callout.ctaHref.trim() : undefined,
            }
          : undefined,
        events,
        initialVisible: typeof parsed.initialVisible === "number" ? parsed.initialVisible : 6,
        loadMoreStep: typeof parsed.loadMoreStep === "number" ? parsed.loadMoreStep : 4,
        loadMoreLabel: typeof parsed.loadMoreLabel === "string" ? parsed.loadMoreLabel.trim() : undefined,
        showingTemplate: typeof parsed.showingTemplate === "string" ? parsed.showingTemplate.trim() : undefined,
        learnMoreLabel: typeof parsed.learnMoreLabel === "string" ? parsed.learnMoreLabel.trim() : undefined,
      };
    }
    default:
      return null;
  }
}
