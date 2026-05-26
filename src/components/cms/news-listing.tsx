"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/cms/types";

export type NewsItem = {
  id: string;
  slug: string[];
  title: string;
  publishedAt?: string;
  industries: string[];
};

function formatDate(iso?: string, locale: Locale = "en") {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function monthKey(iso?: string) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(key: string, locale: Locale) {
  const [year, month] = key.split("-").map(Number);
  if (!year || !month) return key;
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
  });
}

type Props = {
  locale: Locale;
  items: NewsItem[];
};

export function NewsListing({ locale, items }: Props) {
  const [date, setDate] = useState("");
  const [industry, setIndustry] = useState("");

  const dateOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      const k = monthKey(it.publishedAt);
      if (k) set.add(k);
    });
    return Array.from(set).sort().reverse();
  }, [items]);

  const industryOptions = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => it.industries.forEach((i) => i && set.add(i)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (date && monthKey(it.publishedAt) !== date) return false;
      if (industry && !it.industries.includes(industry)) return false;
      return true;
    });
  }, [items, date, industry]);

  return (
    <>
      <form className="mb-10 flex flex-wrap gap-4" onSubmit={(e) => e.preventDefault()}>
        <select
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-12 min-w-[260px] rounded-none border border-[#d1d5db] bg-[#f3f4f6] px-4 text-sm text-[#1f2937]"
        >
          <option value="">
            {locale === "en" ? "Filter By Date (all)" : "Filtrar por fecha (todas)"}
          </option>
          {dateOptions.map((key) => (
            <option key={key} value={key}>
              {formatMonthLabel(key, locale)}
            </option>
          ))}
        </select>
        <select
          name="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="h-12 min-w-[260px] rounded-none border border-[#d1d5db] bg-[#f3f4f6] px-4 text-sm text-[#1f2937]"
        >
          <option value="">
            {locale === "en" ? "Industry (all)" : "Industria (todas)"}
          </option>
          {industryOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {(date || industry) && (
          <button
            type="button"
            onClick={() => {
              setDate("");
              setIndustry("");
            }}
            className="h-12 rounded-none border border-[#d1d5db] bg-white px-4 text-sm text-[#1554ff] hover:bg-[#f3f4f6]"
          >
            {locale === "en" ? "Clear filters" : "Limpiar filtros"}
          </button>
        )}
      </form>

      <h2 className="text-xl font-semibold uppercase tracking-wide text-[#1554ff]">
        {locale === "en" ? "Most recent news" : "Noticias recientes"}
      </h2>
      <ul className="mt-6 space-y-8">
        {filtered.map((item) => (
          <li key={item.id} className="space-y-2">
            <h3 className="text-[1.35rem] font-semibold leading-snug text-[#1554ff]">
              <Link href={`/${locale}/${item.slug.join("/")}`} className="hover:underline">
                {item.title}
              </Link>
            </h3>
            <p className="text-sm text-[#4b5563]">{formatDate(item.publishedAt, locale)}</p>
            <Link
              href={`/${locale}/${item.slug.join("/")}`}
              className="inline-flex text-sm text-[#1554ff] hover:underline"
            >
              {locale === "en" ? "View More" : "Ver mas"}
            </Link>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="text-sm text-[#4b5563]">
            {locale === "en"
              ? items.length === 0
                ? "No news items yet. Publish CMS articles to populate this list."
                : "No news items match the selected filters."
              : "No hay noticias que coincidan con los filtros."}
          </li>
        ) : null}
      </ul>
    </>
  );
}
