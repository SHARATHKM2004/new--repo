"use client";

import { useState } from "react";

export function AlertsCallout({ locale }: { locale: string }) {
  const [active, setActive] = useState(false);

  const eyebrow =
    locale === "es" ? "SUMMIT ALERTAS Y ACTUALIZACIONES" : "SUMMIT ALERTS & UPDATES";
  const heading =
    locale === "es" ? "LA PERSPECTIVA LO CAMBIA TODO." : "FORESIGHT CHANGES OUTCOMES.";
  const body =
    locale === "es"
      ? "Reciba a tiempo desarrollos de la industria, cambios regulatorios y otras noticias que impactan su exito."
      : "Receive timely industry developments, regulatory changes and other news impacting your success.";
  const cta =
    locale === "es" ? "RECIBIR ALERTAS Y ACTUALIZACIONES" : "GET ALERTS AND UPDATES";

  function handleClick() {
    setActive(true);
    setTimeout(() => {
      window.location.reload();
    }, 250);
  }

  return (
    <section className="bg-[#f3f4f6]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1247ff]">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-4xl font-extrabold uppercase leading-tight tracking-tight text-[#0b1220] lg:text-6xl">
          {heading}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#4b5563]">{body}</p>
        <button
          type="button"
          onClick={handleClick}
          className={`mt-8 inline-flex items-center justify-center border-2 border-[#1247ff] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
            active
              ? "bg-[#1247ff] text-white"
              : "bg-transparent text-[#1247ff] hover:bg-[#1247ff] hover:text-white"
          }`}
        >
          {cta}
        </button>
      </div>
    </section>
  );
}
