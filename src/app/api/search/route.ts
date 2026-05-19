import { NextResponse } from "next/server";
import { getInsights } from "@/lib/cms";
import type { Locale } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const localeParam = (url.searchParams.get("locale") ?? "en") as Locale;
  const locale: Locale = localeParam === "es" ? "es" : "en";

  if (!q) {
    return NextResponse.json({ count: 0, results: [] });
  }

  const insights = await getInsights({ locale, query: q });

  const results = insights.slice(0, 10).map((page) => ({
    id: page.id,
    title: page.title,
    summary: page.summary,
    href: `/${locale}/${page.slug.join("/")}`,
  }));

  return NextResponse.json({ count: insights.length, results });
}
