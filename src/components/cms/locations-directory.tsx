"use client";

import { useMemo, useState } from "react";
import type { LocationsDirectoryBlock, OfficeEntry } from "@/lib/cms/types";

type Props = {
  block: LocationsDirectoryBlock;
  locale: "en" | "es";
};

function groupByState(offices: OfficeEntry[]) {
  const map = new Map<string, OfficeEntry[]>();
  for (const office of offices) {
    const list = map.get(office.state) ?? [];
    list.push(office);
    map.set(office.state, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function LocationsDirectory({ block, locale }: Props) {
  const grouped = useMemo(() => groupByState(block.offices), [block.offices]);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const toggle = (state: string) => {
    setOpenStates((prev) => ({ ...prev, [state]: !prev[state] }));
  };

  const heading =
    block.heading ?? (locale === "en" ? "Get in touch with your local Summit office" : "Pongase en contacto con su oficina local de Summit");

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-white">
      <div
        className="relative h-[280px] w-full bg-cover bg-center lg:h-[420px]"
        style={{
          backgroundImage: `url('${block.heroImageUrl ?? "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1920&q=70"}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto flex h-full max-w-[1260px] items-center px-6 lg:px-10">
          <h1 className="text-5xl font-light text-white lg:text-6xl">
            {locale === "en" ? "Locations" : "Ubicaciones"}
          </h1>
        </div>
      </div>
      <div className="bg-[#5a6470] text-white">
        <div className="mx-auto max-w-[1260px] px-6 py-3 text-sm lg:px-10">
          <span className="opacity-90">{locale === "en" ? "Home" : "Inicio"}</span>
          <span className="mx-3 opacity-60">|</span>
          <span className="opacity-90">{locale === "en" ? "About" : "Acerca"}</span>
          <span className="mx-3 opacity-60">|</span>
          <span>{locale === "en" ? "Locations" : "Ubicaciones"}</span>
        </div>
      </div>
      <div className="mx-auto grid max-w-[1260px] gap-10 px-6 py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-10 lg:py-16">
        <aside className="text-sm">
          <h3 className="mb-4 text-xl font-semibold text-[#1554ff]">
            {locale === "en" ? "Locations" : "Ubicaciones"}
          </h3>
          <ul className="space-y-1">
            {grouped.map(([state, offices]) => {
              const isOpen = !!openStates[state];
              return (
                <li key={state}>
                  <button
                    type="button"
                    onClick={() => toggle(state)}
                    className="flex w-full items-center gap-2 py-1 text-left font-semibold text-[#1f2937] hover:text-[#1554ff]"
                  >
                    <span
                      className="inline-block w-3 text-xs"
                      aria-hidden="true"
                    >
                      {isOpen ? "v" : ">"}
                    </span>
                    {state}
                  </button>
                  {isOpen ? (
                    <ul className="ml-5 mt-1 space-y-1">
                      {offices.map((office) => (
                        <li key={`${state}-${office.city}`}>
                          <span className="text-[#374151]">{office.city}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </aside>

        <div>
          <h2 className="mb-8 text-[2.2rem] font-normal text-[#1554ff] lg:text-[2.6rem]">
            {heading}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.flatMap(([state, offices]) =>
              offices.map((office) => (
                <div
                  key={`${state}-${office.city}`}
                  id={`office-${slugify(state)}-${slugify(office.city)}`}
                  className="relative overflow-hidden bg-[#f3f4f6] p-5 text-sm leading-6 text-[#374151]"
                >
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-[#1554ff]">
                    {office.city}
                  </h4>
                  {office.address1 ? <div>{office.address1}</div> : null}
                  {office.address2 ? <div>{office.address2}</div> : null}
                  {office.cityStateZip ? <div>{office.cityStateZip}</div> : null}
                  {office.phone ? <div className="mt-1">Tel: {office.phone}</div> : null}
                  {office.fax ? <div>Fax: {office.fax}</div> : null}
                </div>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
