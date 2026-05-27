"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/cms/types";

type SearchResult = {
  id: string;
  title: string;
  summary: string;
  href: string;
};

export function HeaderSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setCount(0);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("search failed");
        }
        const data: { count: number; results: SearchResult[] } = await response.json();
        setResults(data.results);
        setCount(data.count);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
          setCount(0);
        }
      } finally {
        setLoading(false);
      }
    }, 180);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, locale]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const placeholder = locale === "en" ? "Search ..." : "Buscar ...";
  const matchesLabel = (n: number) =>
    locale === "en"
      ? `${n} ${n === 1 ? "match" : "matches"}`
      : `${n} ${n === 1 ? "coincidencia" : "coincidencias"}`;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 rounded-sm bg-[#f3f4f6] px-3 py-1.5">
        <input
          type="search"
          id="site-header-search"
          name="q"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="w-44 bg-transparent text-xs text-[#111827] placeholder:text-[#4b5563] focus:outline-none"
          aria-label={placeholder}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#6b7280]"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      {open && query.trim() ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[360px] rounded-md border border-[#e5e7eb] bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#1247ff]">
            <span>{loading ? (locale === "en" ? "Searching..." : "Buscando...") : matchesLabel(count)}</span>
            {count > results.length ? (
              <span className="text-[10px] text-[#6b7280]">
                {locale === "en"
                  ? `Showing top ${results.length}`
                  : `Mostrando ${results.length}`}
              </span>
            ) : null}
          </div>
          {results.length ? (
            <ul className="max-h-[360px] overflow-y-auto">
              {results.map((result) => (
                <li key={result.id} className="border-b border-[#f3f4f6] last:border-none">
                  <Link
                    href={result.href}
                    className="block px-4 py-3 hover:bg-[#f9fafb]"
                    onClick={() => setOpen(false)}
                  >
                    <p className="text-sm font-semibold text-[#1247ff]">{result.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-[#4b5563]">{result.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : !loading ? (
            <p className="px-4 py-4 text-xs text-[#6b7280]">
              {locale === "en" ? "No matches found." : "Sin coincidencias."}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
