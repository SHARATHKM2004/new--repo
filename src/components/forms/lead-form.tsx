"use client";

import { useState, useTransition } from "react";

type FormState = {
  type: "idle" | "success" | "error";
  message?: string;
};

const initialFormState: FormState = { type: "idle" };

export function LeadForm({
  locale,
  title,
  intro,
  submitLabel,
}: {
  locale: "en" | "es";
  title?: string;
  intro?: string;
  submitLabel: string;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [isPending, startTransition] = useTransition();

  return (
    <section className="mx-auto w-full max-w-[720px]">
      {title || intro ? (
        <div className="mb-6 max-w-2xl space-y-3">
          {title ? <h2 className="text-[1.9rem] font-medium tracking-tight text-[#1f2937]">{title}</h2> : null}
          {intro ? <p className="text-sm leading-7 text-[#4b5563]">{intro}</p> : null}
        </div>
      ) : null}
      <form
        className="grid gap-x-6 gap-y-3 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const formEl = event.currentTarget;
          const form = new FormData(formEl);

          startTransition(async () => {
            try {
              const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: form.get("email"),
                  firstName: form.get("firstName"),
                  lastName: form.get("lastName"),
                  jobTitle: form.get("jobTitle"),
                  organization: form.get("organization"),
                  city: form.get("city"),
                  state: form.get("state"),
                  phone: form.get("phone"),
                  message: form.get("message"),
                }),
              });

              const payload = (await response
                .json()
                .catch(() => ({}))) as { message?: string };

              if (!response.ok) {
                setState({
                  type: "error",
                  message:
                    payload.message ??
                    (locale === "en"
                      ? "Unable to submit the form."
                      : "No fue posible enviar el formulario."),
                });
                return;
              }

              formEl.reset();
              setState({
                type: "success",
                message:
                  locale === "en"
                    ? "Thanks! We will reach out shortly."
                    : "Gracias. Nos pondremos en contacto pronto.",
              });
            } catch {
              setState({
                type: "error",
                message:
                  locale === "en"
                    ? "Network error. Please try again."
                    : "Error de red. Intente de nuevo.",
              });
            }
          });
        }}
      >
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
          {locale === "en" ? "Email *" : "Correo *"}
          <input
            name="email"
            type="email"
            required
            placeholder={locale === "en" ? "Email" : "Correo"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {locale === "en" ? "First Name *" : "Nombre *"}
          <input
            name="firstName"
            required
            placeholder={locale === "en" ? "First name" : "Nombre"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {locale === "en" ? "Last Name *" : "Apellido *"}
          <input
            name="lastName"
            required
            placeholder={locale === "en" ? "Last name" : "Apellido"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {locale === "en" ? "Job title *" : "Puesto *"}
          <input
            name="jobTitle"
            required
            placeholder={locale === "en" ? "Job title" : "Puesto"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {locale === "en" ? "Organization *" : "Organizacion *"}
          <input
            name="organization"
            required
            placeholder={locale === "en" ? "Organization" : "Organizacion"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {locale === "en" ? "City" : "Ciudad"}
          <input
            name="city"
            placeholder={locale === "en" ? "City" : "Ciudad"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {locale === "en" ? "State" : "Estado"}
          <input
            name="state"
            placeholder={locale === "en" ? "State" : "Estado"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
          {locale === "en" ? "Phone" : "Telefono"}
          <input
            name="phone"
            placeholder={locale === "en" ? "+1  Business phone" : "+1  Telefono"}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
          {locale === "en" ? "How can we help you? *" : "Como podemos ayudarle? *"}
          <textarea
            name="message"
            required
            rows={4}
            placeholder={locale === "en" ? "Topic" : "Tema"}
            className="rounded-none border border-[#9ca3af] bg-white px-3 py-2 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <div className="md:col-span-2 flex items-center gap-4 pt-3">
          <button
            type="submit"
            disabled={isPending}
            className="border border-[#2563eb] px-8 py-2 text-sm font-semibold text-[#2563eb] transition hover:bg-[#2563eb] hover:text-white disabled:cursor-wait disabled:opacity-70"
          >
            {isPending
              ? locale === "en"
                ? "Submitting..."
                : "Enviando..."
              : submitLabel}
          </button>
          {state.type !== "idle" ? (
            <p
              className={`max-w-lg text-sm ${
                state.type === "success" ? "text-[#1d4ed8]" : "text-[#b91c1c]"
              }`}
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </form>
    </section>
  );
}