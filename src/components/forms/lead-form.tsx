"use client";

import { useState, useTransition } from "react";

const US_STATES: ReadonlyArray<{ code: string; name: string }> = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const isTruthy = (v?: string) => {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "true" || s === "yes" || s === "1" || s === "on" || s === "us";
};

type FormState = {
  type: "idle" | "success" | "error";
  message?: string;
};

const initialFormState: FormState = { type: "idle" };

export function LeadForm({
  locale,
  title,
  intro,
  introText,
  submitLabel,
  emailLabel,
  firstNameLabel,
  lastNameLabel,
  jobTitleLabel,
  organizationLabel,
  cityLabel,
  stateLabel,
  phoneLabel,
  messageLabel,
  emailPlaceholder,
  firstNamePlaceholder,
  lastNamePlaceholder,
  jobTitlePlaceholder,
  organizationPlaceholder,
  cityPlaceholder,
  statePlaceholder,
  phonePlaceholder,
  messagePlaceholder,
  successMessage,
  errorMessage,
  uploadLabel,
  stateAsDropdown,
}: {
  locale: "en" | "es";
  title?: string;
  intro?: string;
  introText?: string;
  submitLabel: string;
  emailLabel?: string;
  firstNameLabel?: string;
  lastNameLabel?: string;
  jobTitleLabel?: string;
  organizationLabel?: string;
  cityLabel?: string;
  stateLabel?: string;
  phoneLabel?: string;
  messageLabel?: string;
  emailPlaceholder?: string;
  firstNamePlaceholder?: string;
  lastNamePlaceholder?: string;
  jobTitlePlaceholder?: string;
  organizationPlaceholder?: string;
  cityPlaceholder?: string;
  statePlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;
  successMessage?: string;
  errorMessage?: string;
  uploadLabel?: string;
  stateAsDropdown?: string;
}) {
  const [state, setState] = useState<FormState>(initialFormState);
  const [isPending, startTransition] = useTransition();

  const t = (en: string, es: string) => (locale === "en" ? en : es);
  const lEmail = emailLabel ?? t("Email *", "Correo *");
  const lFirstName = firstNameLabel ?? t("First Name *", "Nombre *");
  const lLastName = lastNameLabel ?? t("Last Name *", "Apellido *");
  const lJobTitle = jobTitleLabel ?? t("Job title *", "Puesto *");
  const lOrg = organizationLabel ?? t("Organization *", "Organizacion *");
  const lCity = cityLabel ?? t("City", "Ciudad");
  const lState = stateLabel ?? t("State", "Estado");
  const lPhone = phoneLabel ?? t("Phone", "Telefono");
  const lMessage = messageLabel ?? t("How can we help you? *", "Como podemos ayudarle? *");
  const pEmail = emailPlaceholder ?? t("Email", "Correo");
  const pFirstName = firstNamePlaceholder ?? t("First name", "Nombre");
  const pLastName = lastNamePlaceholder ?? t("Last name", "Apellido");
  const pJobTitle = jobTitlePlaceholder ?? t("Job title", "Puesto");
  const pOrg = organizationPlaceholder ?? t("Organization", "Organizacion");
  const pCity = cityPlaceholder ?? t("City", "Ciudad");
  const pState = statePlaceholder ?? t("State", "Estado");
  const pPhone = phonePlaceholder ?? t("+1  Business phone", "+1  Telefono");
  const pMessage = messagePlaceholder ?? t("Topic", "Tema");

  const introParagraphs = (introText ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="mx-auto w-full max-w-[720px]">
      {intro || introParagraphs.length || title ? (
        <div className="mb-8 space-y-4 text-left">
          {intro ? (
            <h2 className="text-[2.4rem] font-normal leading-[1.15] text-[#1554ff] lg:text-[2.7rem]">
              {intro}
            </h2>
          ) : title ? (
            <h2 className="text-[2.4rem] font-normal leading-[1.15] text-[#1554ff] lg:text-[2.7rem]">
              {title}
            </h2>
          ) : null}
          {introParagraphs.map((paragraph, index) => (
            <p key={index} className="text-[13px] leading-6 text-[#374151]">
              {paragraph}
            </p>
          ))}
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
                  documentName: (form.get("document") as File | null)?.name || undefined,
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
                    errorMessage ??
                    t("Unable to submit the form.", "No fue posible enviar el formulario."),
                });
                return;
              }

              formEl.reset();
              setState({
                type: "success",
                message:
                  successMessage ??
                  t("Thanks! We will reach out shortly.", "Gracias. Nos pondremos en contacto pronto."),
              });
            } catch {
              setState({
                type: "error",
                message:
                  errorMessage ?? t("Network error. Please try again.", "Error de red. Intente de nuevo."),
              });
            }
          });
        }}
      >
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
          {lEmail}
          <input
            name="email"
            type="email"
            required
            placeholder={pEmail}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {lFirstName}
          <input
            name="firstName"
            required
            placeholder={pFirstName}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {lLastName}
          <input
            name="lastName"
            required
            placeholder={pLastName}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {lJobTitle}
          <input
            name="jobTitle"
            required
            placeholder={pJobTitle}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {lOrg}
          <input
            name="organization"
            required
            placeholder={pOrg}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {lCity}
          <input
            name="city"
            placeholder={pCity}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151]">
          {lState}
          {isTruthy(stateAsDropdown) ? (
            <select
              name="state"
              defaultValue=""
              className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
            >
              <option value="" disabled>
                {pState}
              </option>
              {US_STATES.map((st) => (
                <option key={st.code} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              name="state"
              placeholder={pState}
              className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
            />
          )}
        </label>
        {uploadLabel ? (
          <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
            {uploadLabel}
            <input
              name="document"
              type="file"
              className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 py-2 text-[14px] outline-none transition focus:border-[#2563eb] file:mr-3 file:border file:border-[#9ca3af] file:bg-white file:px-3 file:py-1 file:text-[13px] file:text-[#374151]"
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
          {lPhone}
          <input
            name="phone"
            placeholder={pPhone}
            className="h-10 rounded-none border border-[#9ca3af] bg-white px-3 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#374151] md:col-span-2">
          {lMessage}
          <textarea
            name="message"
            required
            rows={4}
            placeholder={pMessage}
            className="rounded-none border border-[#9ca3af] bg-white px-3 py-2 text-[15px] outline-none transition focus:border-[#2563eb]"
          />
        </label>
        <div className="md:col-span-2 flex items-center gap-4 pt-3">
          <button
            type="submit"
            disabled={isPending}
            className="border border-[#2563eb] px-8 py-2 text-sm font-semibold text-[#2563eb] transition hover:bg-[#2563eb] hover:text-white disabled:cursor-wait disabled:opacity-70"
          >
            {isPending ? t("Submitting...", "Enviando...") : submitLabel}
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