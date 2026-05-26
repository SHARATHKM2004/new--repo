import type { Locale } from "@/lib/cms/types";

export function isOptimizelyProviderEnabled() {
  return process.env.CMS_PROVIDER === "optimizely";
}

export function getOptimizelyBasicAuthHeader() {
  const appKey = process.env.OPTIMIZELY_GRAPH_APP_KEY?.trim();
  const secret = process.env.OPTIMIZELY_GRAPH_SECRET?.trim();

  if (!appKey || !secret) {
    return null;
  }

  return `Basic ${Buffer.from(`${appKey}:${secret}`).toString("base64")}`;
}

export function getOptimizelyTag(scope: string, locale?: Locale) {
  return locale ? `optimizely:${scope}:${locale}` : `optimizely:${scope}`;
}

export function getOptimizelyRevalidationTags() {
  return [
    "optimizely:page",
    "optimizely:chrome",
    getOptimizelyTag("page", "en"),
    getOptimizelyTag("page", "es"),
    getOptimizelyTag("chrome", "en"),
    getOptimizelyTag("chrome", "es"),
    getOptimizelyTag("start-page", "en"),
    getOptimizelyTag("start-page", "es"),
    getOptimizelyTag("cms-page", "en"),
    getOptimizelyTag("cms-page", "es"),
    getOptimizelyTag("header", "en"),
    getOptimizelyTag("header", "es"),
    getOptimizelyTag("footer", "en"),
    getOptimizelyTag("footer", "es"),
  ];
}

