import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getLocationOffices, getOfficeSlug } from "@/lib/cms";
import { isLocale } from "@/lib/cms/types";
import type { OfficeEntry } from "@/lib/cms/types";

type RouteParams = { locale: string; state: string };

export function stateSlug(state: string) {
  return state
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  const { locale, state } = await params;
  if (!isLocale(locale)) return {};
  const { offices } = await getLocationOffices(locale, false);
  const match = offices.find((o) => stateSlug(o.state) === state);
  if (!match) return { title: "Location not found" };
  return {
    title: match.state,
    description: `${match.state} offices`,
  };
}

export default async function LocationStatePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale, state } = await params;
  if (!isLocale(locale)) notFound();

  const draft = await draftMode();
  const { offices } = await getLocationOffices(locale, draft.isEnabled);

  const grouped = groupByState(offices);
  const match = grouped.find(([s]) => stateSlug(s) === state);
  if (!match) notFound();

  const [stateName, stateOffices] = match;

  return (
    <main className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white">
      {/* Hero band */}
      <section className="bg-[#d9d9dd]">
        <div className="mx-auto max-w-[1260px] px-6 py-12 lg:px-10 lg:py-16">
          <h1 className="text-[3.8rem] font-light tracking-tight text-[#1554ff] lg:text-[4.5rem]">
            {stateName}
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
          <span className="font-semibold">{stateName}</span>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto grid max-w-[1260px] gap-10 px-6 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10 lg:py-16">
        {/* Sidebar */}
        <aside className="text-sm">
          <h3 className="mb-4 text-xl font-semibold uppercase tracking-wide text-[#1554ff]">
            {stateName}
          </h3>
          <ul className="space-y-1">
            {stateOffices.map((o) => {
              const oSlug = getOfficeSlug(o);
              return (
                <li key={o.city}>
                  <Link
                    href={`/${locale}/locations/${oSlug}`}
                    className="text-[#374151] hover:text-[#1554ff] hover:underline"
                  >
                    {o.city}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Office cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {stateOffices.map((o) => {
            const oSlug = getOfficeSlug(o);
            return (
              <Link
                key={o.city}
                href={`/${locale}/locations/${oSlug}`}
                className="block bg-[#f3f4f6] p-6 transition hover:bg-[#e5e7eb]"
              >
                <h3 className="mb-3 text-base font-bold uppercase tracking-wide text-[#1554ff]">
                  {o.city}
                </h3>
                <div className="space-y-1 text-[14px] leading-6 text-[#1f2937]">
                  {o.address1 ? <div>{o.address1}</div> : null}
                  {o.address2 ? <div>{o.address2}</div> : null}
                  {o.cityStateZip ? <div>{o.cityStateZip}</div> : null}
                  {o.phone ? <div className="mt-2">Tel: {o.phone}</div> : <div className="mt-2">Tel: -</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
