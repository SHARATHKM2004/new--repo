import type { Locale, SubscriptionPageContent } from "@/lib/cms/types";
import { fetchOptimizelyGraph } from "./optimizely-graph";
import { getOptimizelyTag, isOptimizelyProviderEnabled } from "./optimizely-config";
import { toArray } from "./text-helpers";

export type OptimizelySubscriptionPageItem = {
  _json?: Record<string, unknown>;
};

type SubscriptionTopicLike = { title: string; body: string };

export function pickStr(json: Record<string, unknown> | undefined, ...keys: string[]): string | undefined {
  if (!json) return undefined;
  for (const k of keys) {
    const v = json[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export async function getSubscriptionPageContent(
  locale: Locale,
  draft = false,
): Promise<SubscriptionPageContent> {
  const fallback: SubscriptionPageContent = {
    pageTitle: "Summit Advisory Group subscription center",
    breadcrumbHomeLabel: "Home",
    heading: "Want to stay in the know?",
    intro:
      "At Summit Advisory Group, we strive to keep you aware of relevant issues impacting your organization so you can make more informed decisions. From important updates and compelling thought leadership to educational webinars and events, get the latest news and information on the topics you care about, delivered straight to your inbox.",
    emailsConsentTitle: "Sign up for Summit Advisory Group emails.",
    emailsConsentBody: "You can select specific e-communications you wish to receive below.",
    topicsHelpText:
      "Check the boxes below to receive the latest information impacting you and your organization.",
    topics: [
      {
        title: "Thought Leadership",
        body: "The latest insights on topics that matter to you. Types of communications include thought leadership content, industry newsletters, e-books, news and alerts.",
      },
      {
        title: "Event Invitations",
        body: "Receive event invitations relevant to you and your business needs. Examples of events include forums, conferences, webinars, in-person events, networking events, and trainings.",
      },
      {
        title: "Summit Weekly",
        body: "A weekly update of the most critical advisory insights, market shifts, and operational updates.",
      },
      {
        title: "Regulatory Reporting Requirements",
        body: "Opt in to receive an email when key regulatory reference tables are updated.",
      },
    ],
    submitLabel: "Submit",
    successTitle: "Thanks for subscribing!",
    successBody:
      "You will receive Summit Advisory Group updates on the topics you selected.",
    backLabel: "Back to home",
  };

  if (!isOptimizelyProviderEnabled()) {
    return fallback;
  }

  const data = await fetchOptimizelyGraph<{
    SubscriptionPage: { item: OptimizelySubscriptionPageItem | null };
  }>(
    `query {
      SubscriptionPage(limit: 1, locale: ${locale}) {
        item {
          _json
        }
      }
    }`,
    {
      draft,
      tags: [getOptimizelyTag("subscription", locale)],
    },
  );

  const json = data?.SubscriptionPage?.item?._json;

  if (!json) {
    return fallback;
  }

  const topics: SubscriptionTopicLike[] = [];
  for (let i = 1; i <= 6; i++) {
    const title = pickStr(json, `topic${i}Title`, `Topic${i}Title`);
    const body = pickStr(json, `topic${i}Body`, `Topic${i}Body`);
    if (title && body) {
      topics.push({ title, body });
    }
  }

  return {
    pageTitle: pickStr(json, "pageTitle", "PageTitle") ?? fallback.pageTitle,
    breadcrumbHomeLabel:
      pickStr(json, "breadcrumbHomeLabel", "BreadcrumbHomeLabel") ?? fallback.breadcrumbHomeLabel,
    heading: pickStr(json, "heading", "Heading") ?? fallback.heading,
    intro: pickStr(json, "intro", "Intro") ?? fallback.intro,
    emailsConsentTitle:
      pickStr(json, "emailsConsentTitle", "EmailsConsentTitle") ?? fallback.emailsConsentTitle,
    emailsConsentBody:
      pickStr(json, "emailsConsentBody", "EmailsConsentBody") ?? fallback.emailsConsentBody,
    topicsHelpText:
      pickStr(json, "topicsHelpText", "TopicsHelpText") ?? fallback.topicsHelpText,
    topics: topics.length ? topics : fallback.topics,
    submitLabel: pickStr(json, "submitLabel", "SubmitLabel") ?? fallback.submitLabel,
    successTitle: pickStr(json, "successTitle", "SuccessTitle") ?? fallback.successTitle,
    successBody: pickStr(json, "successBody", "SuccessBody") ?? fallback.successBody,
    backLabel: pickStr(json, "backLabel", "BackLabel") ?? fallback.backLabel,
  };
}

