import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getLocationOffices, getOfficeSlug } from "@/lib/cms";
import { isLocale } from "@/lib/cms/types";
import type { OfficeEntry } from "@/lib/cms/types";

type RouteParams = { locale: string; slug: string };

function groupByState(offices: OfficeEntry[]) {
  const map = new Map<string, OfficeEntry[]>();
  for (const office of offices) {
    const list = map.get(office.state) ?? [];
    list.push(office);
    map.set(office.state, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const { offices } = await getLocationOffices(locale, false);
  const office = offices.find((o) => getOfficeSlug(o) === slug);
  if (!office) return { title: "Location not found" };
  return {
    title: office.city,
    description: office.intro ?? `${office.city} office`,
  };
}

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const draft = await draftMode();
  const { offices } = await getLocationOffices(locale, draft.isEnabled);
  const office = offices.find((o) => getOfficeSlug(o) === slug);

  if (!office) notFound();

  const grouped = groupByState(offices);

  return (
    <main className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white">
      {/* Hero band */}
      <section className="bg-[#d9d9dd]">
        <div className="mx-auto max-w-[1260px] px-6 py-12 lg:px-10 lg:py-16">
          <h1 className="text-[3.8rem] font-light tracking-tight text-[#1554ff] lg:text-[4.5rem]">
            {office.city}
          </h1>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-[#5a6470] text-white">
        <div className="mx-auto max-w-[1260px] px-6 py-3 text-sm lg:px-10">
          <Link href={`/${locale}`} className="font-semibold hover:underline">
            Home
          </Link>
          <span className="mx-3 opacity-60">|</span>
          <Link href={`/${locale}/about`} className="font-semibold hover:underline">
            About
          </Link>
          <span className="mx-3 opacity-60">|</span>
          <Link href={`/${locale}/locations`} className="font-semibold hover:underline">
            Locations
          </Link>
          <span className="mx-3 opacity-60">|</span>
          <span className="font-semibold">{office.state}</span>
          <span className="mx-3 opacity-60">|</span>
          <span className="font-semibold">{office.city}</span>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto grid max-w-[1260px] gap-10 px-6 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10 lg:py-16">
        {/* Sidebar */}
        <aside className="text-sm">
          <h3 className="mb-4 text-xl font-semibold text-[#1554ff]">Locations</h3>
          <ul className="space-y-1">
            {grouped.map(([state, list]) => {
              const isCurrentState = state === office.state;
              return (
                <li key={state}>
                  <div className="flex items-center gap-2 py-1 font-bold text-[#0b1220]">
                    <span aria-hidden="true">&gt;</span>
                    <span>{state}</span>
                  </div>
                  {isCurrentState ? (
                    <ul className="ml-5 mt-1 space-y-1">
                      {list.map((o) => {
                        const oSlug = getOfficeSlug(o);
                        const isCurrent = oSlug === slug;
                        return (
                          <li key={o.city}>
                            {isCurrent ? (
                              <span className="font-semibold text-[#0b1220]">{o.city}</span>
                            ) : (
                              <Link
                                href={`/${locale}/locations/${oSlug}`}
                                className="text-[#374151] hover:text-[#1554ff] hover:underline"
                              >
                                {o.city}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main content */}
        <div className="space-y-6 text-[15px] leading-7 text-[#374151]">
          {office.mapLinkUrl ? (
            <a
              href={office.mapLinkUrl}
              className="block text-[15px] font-semibold text-[#1554ff] hover:underline"
            >
              {office.mapLinkLabel ?? "Click here for Map and Contact Information"}
            </a>
          ) : null}

          {office.intro ? (
            <h2 className="text-[1.8rem] font-normal leading-tight text-[#1554ff] lg:text-[2rem]">
              {office.intro}
            </h2>
          ) : null}

          {office.paragraphs?.map((p, i) => (
            <p key={`p-${i}`}>{p}</p>
          ))}

          {office.services?.length ? (
            <ul className="ml-5 list-disc space-y-1">
              {office.services.map((s, i) => (
                <li key={`s-${i}`}>{s}</li>
              ))}
            </ul>
          ) : null}

          {office.aboutTitle ? (
            <h3 className="pt-4 text-base font-bold text-[#0b1220]">{office.aboutTitle}</h3>
          ) : null}
          {office.aboutParagraphs?.map((p, i) => (
            <p key={`ap-${i}`}>{p}</p>
          ))}

          {/* Address + map row */}
          <div className="grid gap-8 pt-6 lg:grid-cols-2">
            <div className="space-y-1">
              <h4 className="mb-2 text-[15px] font-semibold text-[#1554ff]">{office.city}</h4>
              {office.address1 ? <div>{office.address1}</div> : null}
              {office.address2 ? <div>{office.address2}</div> : null}
              {office.cityStateZip ? <div>{office.cityStateZip}</div> : null}
              {office.phone ? <div className="mt-2">Tel: {office.phone}</div> : null}
              {office.fax ? <div>Fax: {office.fax}</div> : null}
              {office.email ? (
                <div className="mt-3">
                  <a
                    href={`mailto:${office.email}`}
                    className="text-[#1554ff] hover:underline"
                  >
                    {office.email}
                  </a>
                </div>
              ) : null}
            </div>

            {office.mapEmbedUrl ? (
              <div className="h-[280px] w-full">
                <iframe
                  src={office.mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title={`${office.city} map`}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
