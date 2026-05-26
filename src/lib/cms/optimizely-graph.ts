import {
  getOptimizelyBasicAuthHeader,
  getOptimizelyTag,
  isOptimizelyProviderEnabled,
} from "./optimizely-config";
import type { OptimizelyGraphResponse } from "./optimizely-types";

export async function getOptimizelyConnectionStatus() {
  const providerEnabled = isOptimizelyProviderEnabled();
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();
  const basicAuthHeader = getOptimizelyBasicAuthHeader();

  const publicConfigured = Boolean(renderUrl && renderKey);
  const adminConfigured = Boolean(renderUrl && basicAuthHeader);

  if (!providerEnabled || !renderUrl) {
    return {
      providerEnabled,
      publicConfigured,
      adminConfigured,
      publicReachable: false,
      adminReachable: false,
    };
  }

  const query = `query { StartPage(limit: 1) { total } }`;
  const publicResult = publicConfigured
    ? await fetchOptimizelyGraph<{ StartPage: { total: number } }>(query, {
        tags: [getOptimizelyTag("health")],
      })
    : null;
  const adminResult = adminConfigured
    ? await fetchOptimizelyGraph<{ StartPage: { total: number } }>(query, {
        draft: true,
      })
    : null;

  return {
    providerEnabled,
    publicConfigured,
    adminConfigured,
    publicReachable: Boolean(publicResult),
    adminReachable: Boolean(adminResult),
  };
}

export async function fetchOptimizelyGraph<T>(
  query: string,
  options?: {
    draft?: boolean;
    tags?: string[];
  },
) {
  const renderUrl = process.env.OPTIMIZELY_RENDER_URL?.trim();
  const renderKey = process.env.OPTIMIZELY_RENDER_KEY?.trim();
  const basicAuthHeader = getOptimizelyBasicAuthHeader();

  if (!renderUrl) {
    return null;
  }

  const baseUrl = `${renderUrl.replace(/\/$/, "")}/content/v2`;
  const useAdminAuth = Boolean(options?.draft && basicAuthHeader);

  if (!useAdminAuth && !renderKey) {
    return null;
  }

  const response = await fetch(useAdminAuth ? baseUrl : `${baseUrl}?auth=${encodeURIComponent(renderKey!)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(useAdminAuth ? { Authorization: basicAuthHeader! } : {}),
    },
    body: JSON.stringify({ query }),
    cache: options?.draft ? "no-store" : undefined,
    next: options?.draft
      ? undefined
      : {
          revalidate: 60,
          tags: options?.tags,
        },
  });

  if (!response.ok) {
    console.error("Optimizely Graph request failed", {
      status: response.status,
      draft: Boolean(options?.draft),
      tags: options?.tags,
    });
    return null;
  }

  const payload = (await response.json()) as OptimizelyGraphResponse<T>;

  if (payload.errors?.length) {
    console.error("Optimizely Graph returned errors", {
      draft: Boolean(options?.draft),
      tags: options?.tags,
      errors: payload.errors,
    });
    return null;
  }

  return payload.data ?? null;
}
