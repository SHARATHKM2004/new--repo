import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BigMarkerRegistrationWidget } from "@/components/cms/bigmarker-registration-widget";

interface Presenter {
  name?: string;
  email?: string;
}

interface BMConferenceDetail {
  id: string;
  title: string;
  purpose?: string;
  start_time?: string;
  scheduled_end_time?: string;
  duration?: number;
  time_zone?: string;
  conference_address?: string;
  banner_image_url?: string;
  presenters?: Presenter[];
  tags?: { name?: string }[];
  privacy?: string;
}

async function getConference(id: string): Promise<BMConferenceDetail | null> {
  const apiKey = process.env.BIGMARKER_API_KEY;
  if (!apiKey) return null;
  const res = await fetch(`https://web.bigmarker.com/api/v1/conferences/${id}`, {
    headers: { "API-KEY": apiKey },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

function formatDateTime(dt?: string, tz?: string) {
  if (!dt) return null;
  const d = new Date(dt);
  return d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    ...(tz ? { timeZone: tz } : {}),
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const conf = await getConference(id);

  if (!conf) notFound();

  const startFormatted = formatDateTime(conf.start_time, conf.time_zone);
  const endFormatted = formatDateTime(conf.scheduled_end_time, conf.time_zone);

  return (
    <main className="flex-1">
      {/* Hero banner */}
      <div className="relative w-full">
        <div className="relative h-[280px] w-full overflow-hidden lg:h-[360px] bg-[#1247ff]">
          {conf.banner_image_url ? (
            <Image
              src={conf.banner_image_url}
              alt={conf.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <h1 className="text-center text-3xl font-light tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] lg:text-5xl max-w-4xl">
              {conf.title}
            </h1>
          </div>
        </div>
        {/* Breadcrumb */}
        <div className="w-full bg-[#5b6471]">
          <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-6 py-4 text-sm text-white lg:px-10">
            <Link href={`/${locale}`} className="text-white/90 hover:text-white">
              Home
            </Link>
            <span className="text-white/60">|</span>
            <Link href={`/${locale}/events`} className="text-white/90 hover:text-white">
              Events
            </Link>
            <span className="text-white/60">|</span>
            <span className="text-white line-clamp-1">{conf.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">

          {/* Left — details */}
          <div className="space-y-8">
            {/* Date / time */}
            {(startFormatted || conf.duration) && (
              <div className="rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-6 space-y-3">
                {startFormatted && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-[#1247ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                    </svg>
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6b7280]">Start</p>
                      <p className="text-[15px] text-[#0f172a]">{startFormatted}</p>
                    </div>
                  </div>
                )}
                {endFormatted && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-[#1247ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6b7280]">End</p>
                      <p className="text-[15px] text-[#0f172a]">{endFormatted}</p>
                    </div>
                  </div>
                )}
                {conf.duration && (
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-5 w-5 shrink-0 text-[#1247ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6b7280]">Duration</p>
                      <p className="text-[15px] text-[#0f172a]">{conf.duration} minutes</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Purpose / description */}
            {conf.purpose && (
              <div>
                <h2 className="text-xl font-semibold text-[#0f172a] mb-3">About this event</h2>
                <p className="text-[15px] leading-7 text-[#374151] whitespace-pre-line">{conf.purpose}</p>
              </div>
            )}

            {/* Presenters */}
            {conf.presenters && conf.presenters.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-[#0f172a] mb-4">Presenters</h2>
                <div className="flex flex-wrap gap-3">
                  {conf.presenters.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-sm text-[#374151]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1247ff]/10 text-xs font-bold text-[#1247ff]">
                        {p.name?.charAt(0) ?? "?"}
                      </div>
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {conf.tags && conf.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {conf.tags.map((t, i) => (
                  <span key={i} className="rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] text-[#374151]">
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right — registration widget */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-[#0f172a]">Register for this event</h2>
              <BigMarkerRegistrationWidget conferenceId={conf.id} />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
