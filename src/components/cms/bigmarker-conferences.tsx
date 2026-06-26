"use client";

import { useEffect, useState } from "react";

interface BMConference {
  id: string;
  title: string;
  conference_address: string;
  purpose?: string;
  start_time?: string;
  end_time?: string;
  banner_image?: { url?: string };
  channel?: { name?: string };
  conference_type?: string;
  cost?: string;
}

function formatDateLine(start?: string, end?: string) {
  if (!start) return null;
  const s = new Date(start);
  const dateStr = s.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const startTime = s.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  if (!end) return `${dateStr} ${startTime}`;
  const e = new Date(end);
  const endTime = e.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return `${dateStr} | ${startTime} – ${endTime}`;
}

function ConferenceCard({ conf }: { conf: BMConference }) {
  const imageUrl = conf.banner_image?.url;
  const dateLine = formatDateLine(conf.start_time, conf.end_time);
  const typeLabel = conf.conference_type ?? "Webinar";
  const costLabel = conf.cost ? `Cost $${conf.cost}` : "Cost Free";

  return (
    <article className="flex h-full flex-col bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <a
        href={conf.conference_address}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden bg-slate-100"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={conf.title}
            loading="lazy"
            decoding="async"
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-[#1247ff]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-[#1247ff]/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
              />
            </svg>
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {dateLine && (
          <p className="text-[13px] text-[#374151]">
            <span>{dateLine}</span>
            <span className="mx-2 text-[#c2410c]">|</span>
            <span className="capitalize">{typeLabel}</span>
            <span className="mx-2 text-[#c2410c]">|</span>
            <span>{costLabel}</span>
          </p>
        )}

        <a
          href={conf.conference_address}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[20px] font-semibold leading-snug text-[#1247ff] hover:underline"
        >
          {conf.title}
        </a>

        {conf.purpose && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-[#6b7280]">
            {conf.purpose}
          </p>
        )}

        <a
          href={conf.conference_address}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-[#0f172a] hover:text-[#1247ff]"
        >
          Learn more <span className="text-[#1247ff]">&rarr;</span>
        </a>
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] animate-pulse">
      <div className="h-52 w-full bg-slate-200" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-3 w-3/4 rounded bg-slate-200" />
        <div className="h-5 w-full rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-2/3 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function BigMarkerConferences() {
  const [conferences, setConferences] = useState<BMConference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bigmarker/conferences")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setConferences(data.conferences ?? []);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="mt-10 text-center text-sm text-[#6b7280]">
        Unable to load events. Please try again later.
      </p>
    );
  }

  if (conferences.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-[#6b7280]">
        No upcoming events found.
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {conferences.map((conf) => (
        <ConferenceCard key={conf.id} conf={conf} />
      ))}
    </div>
  );
}
