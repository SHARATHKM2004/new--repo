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
  title: string;
  intro: string;
  submitLabel: string;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [isPending, startTransition] = useTransition();

  return (
    <section className="panel rounded-[2rem] p-8">
      <div className="max-w-2xl space-y-3">
        <p className="eyebrow text-xs font-semibold">
          {locale === "en" ? "Lead generation" : "Captura de leads"}
        </p>
        <h2 className="serif text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-7 text-muted">{intro}</p>
      </div>
      <form
        className="mt-8 grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);

          startTransition(async () => {
            const response = await fetch("/api/leads", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                company: form.get("company"),
                message: form.get("message"),
              }),
            });

            const payload = (await response.json()) as { message?: string };

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

            event.currentTarget.reset();
            setState({
              type: "success",
              message:
                locale === "en"
                  ? "Lead captured locally. Check data/leads.json to inspect the submission."
                  : "Lead guardado localmente. Revise data/leads.json para ver el envio.",
            });
          });
        }}
      >
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          {locale === "en" ? "Name" : "Nombre"}
          <input
            name="name"
            required
            className="rounded-2xl border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          {locale === "en" ? "Email" : "Correo"}
          <input
            name="email"
            type="email"
            required
            className="rounded-2xl border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
          {locale === "en" ? "Company" : "Empresa"}
          <input
            name="company"
            required
            className="rounded-2xl border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <div className="hidden md:block" />
        <label className="flex flex-col gap-2 text-sm font-medium text-foreground md:col-span-2">
          {locale === "en" ? "What do you want to learn or build?" : "Que desea aprender o construir?"}
          <textarea
            name="message"
            required
            rows={5}
            className="rounded-[1.5rem] border border-border bg-white/75 px-4 py-3 outline-none transition focus:border-accent"
          />
        </label>
        <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-wait disabled:opacity-70"
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
                state.type === "success" ? "text-accent-strong" : "text-accent-warm"
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