import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BigMarkerRegistrationWidget } from "@/components/cms/bigmarker-registration-widget";
import { EventCountdown } from "@/components/cms/event-countdown";

interface Presenter {
  display_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  title?: string;
  bio?: string;
  presenter_image_url?: string;
  display_on_landing_page?: boolean;
  can_manage?: boolean;
}

interface BMConferenceDetail {
  id: string;
  title: string;
  event_type?: string;
  purpose?: string;
  start_time?: string;
  scheduled_end_time?: string;
  duration?: number;
  time_zone?: string;
  conference_address?: string;
  background_image_url?: string;
  banner_image?: { url?: string };
  presenters?: Presenter[];
  tags?: { name?: string; value?: string | null }[];
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
  const data = await res.json();
  // BigMarker may wrap the response as { conference: {...} }
  return (data.conference ?? data) as BMConferenceDetail;
}

function formatDateTime(dt?: string, tz?: string) {
  if (!dt) return null;
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  const opts: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  };
  // Only apply tz if it's a valid IANA identifier — BigMarker may return
  // non-standard names like "IST" or "Eastern Time" that throw RangeError
  if (tz) {
    try {
      Intl.DateTimeFormat("en-US", { timeZone: tz }).format(d);
      opts.timeZone = tz;
    } catch {
      // invalid tz — render in local/UTC time, append raw tz label
    }
  }
  const formatted = d.toLocaleString("en-US", opts);
  // Append raw timezone label when we couldn't use it as IANA zone
  return tz && !opts.timeZone ? `${formatted} (${tz})` : formatted;
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

  // Banner: detail endpoint uses background_image_url; list uses banner_image.url
  const bannerUrl = conf.background_image_url ?? conf.banner_image?.url;

  // Info bar data
  const eventTypeLabel = conf.event_type
    ? conf.event_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;
  const industryTag = conf.tags?.find((t) => t.name?.toLowerCase() === "industry")?.value;
  const serviceTag = conf.tags?.find((t) => t.name?.toLowerCase() === "service line")?.value;
  // Event contact = first presenter with can_manage true, else first presenter
  const contact =
    conf.presenters?.find((p) => p.can_manage) ??
    conf.presenters?.[0] ??
    null;
  const contactName =
    contact?.display_name?.trim() ||
    [contact?.first_name, contact?.last_name].filter(Boolean).join(" ") ||
    null;

  // Presenters shown on landing page (display_on_landing_page === true)
  const visiblePresenters = conf.presenters?.filter((p) => p.display_on_landing_page) ?? [];

  return (
    <main className="flex-1">
      {/* ── Hero banner ── */}
      <div className="relative w-full">
        <div className="relative min-h-[300px] w-full overflow-hidden bg-[#1247ff] lg:min-h-[380px]">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt={conf.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <h1 className="text-3xl font-light tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] lg:text-5xl max-w-4xl">
              {conf.title}
            </h1>
            {conf.start_time && (
              <EventCountdown startTime={conf.start_time} />
            )}
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
            <span className="line-clamp-1 text-white">{conf.title}</span>
          </div>
        </div>
      </div>

      {/* ── Gray metadata bar ── */}
      <div className="w-full border-b border-[#e5e7eb] bg-[#f3f4f6]">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-2 lg:px-10">
          {/* Left: event type / industry / service */}
          <div className="space-y-2 text-sm text-[#374151]">
            {eventTypeLabel && (
              <p>
                <span className="font-semibold text-[#0f172a]">Type: </span>
                {eventTypeLabel}
              </p>
            )}
            {industryTag && industryTag !== "N/A" && (
              <p>
                <span className="font-semibold text-[#0f172a]">Industry: </span>
                {industryTag}
              </p>
            )}
            {serviceTag && serviceTag !== "N/A" && (
              <p>
                <span className="font-semibold text-[#0f172a]">Service: </span>
                {serviceTag}
              </p>
            )}
            {startFormatted && (
              <p>
                <span className="font-semibold text-[#0f172a]">Date: </span>
                {startFormatted}
              </p>
            )}
            {conf.duration && (
              <p>
                <span className="font-semibold text-[#0f172a]">Duration: </span>
                {conf.duration} minutes
              </p>
            )}
          </div>

          {/* Right: event contact */}
          {contactName && (
            <div className="space-y-1 text-sm text-[#374151]">
              <p className="font-semibold text-[#0f172a]">Event Contact:</p>
              <p>
                <span className="font-medium">Name: </span>
                {contactName}
              </p>
              {contact?.email && (
                <p>
                  <span className="font-medium">Email: </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#1247ff] hover:underline"
                  >
                    {contact.email}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main 2-col content ── */}
      <div className="mx-auto w-full max-w-[1100px] px-6 py-12 lg:px-10 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_290px]">

          {/* Left — description + presenters */}
          <div className="space-y-10">
            {/* Purpose / description */}
            {conf.purpose ? (
              <div className="prose prose-slate max-w-none text-[15px] leading-7 text-[#374151] whitespace-pre-line">
                {conf.purpose}
              </div>
            ) : (
              <p className="text-[15px] text-[#6b7280] italic">No description available for this event.</p>
            )}

            {/* Presenters */}
            {visiblePresenters.length > 0 && (
              <div>
                <h2 className="mb-5 text-xl font-semibold text-[#0f172a]">Presenters</h2>
                <div className="flex flex-col gap-4">
                  {visiblePresenters.map((p, i) => {
                    const fullName =
                      p.display_name?.trim() ||
                      [p.first_name, p.last_name].filter(Boolean).join(" ") ||
                      p.email ||
                      "Unknown";
                    const initials = fullName
                      .split(" ")
                      .map((w: string) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-4 rounded-lg border border-[#e5e7eb] bg-white p-5"
                      >
                        {p.presenter_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.presenter_image_url}
                            alt={fullName}
                            className="h-16 w-16 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1247ff]/10 text-base font-bold text-[#1247ff]">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[#0f172a]">{fullName}</p>
                          {p.title && (
                            <p className="text-[13px] text-[#6b7280]">{p.title}</p>
                          )}
                          {p.bio && (
                            <p className="mt-2 text-[13px] leading-relaxed text-[#374151]">
                              {p.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right — registration widget */}
          <div className="h-fit">
            <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
              <div className="px-5 pt-4 pb-1">
                <h2 className="text-lg font-semibold text-[#0050ff]">Reserve your spot</h2>
              </div>
              <div className="p-3 pt-0">
                <BigMarkerRegistrationWidget conferenceId={conf.id} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
