import { NextResponse } from "next/server";
import { searchAllPages } from "@/lib/cms";
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

  const matches = await searchAllPages({ locale, query: q });

  return NextResponse.json({
    count: matches.length,
    results: matches.slice(0, 10),
  });
}
