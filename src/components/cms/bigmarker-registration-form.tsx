"use client";

import { useState } from "react";

const INDUSTRY_OPTIONS = [
  "Construction and real estate",
  "Financial Services",
  "Healthcare",
  "Manufacturing, retail, distribution",
  "Nonprofit, government, education",
  "Technology",
  "Tribal",
  "Other",
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  organization: string;
  organizationIndustry: string;
}

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  organization: "",
  organizationIndustry: "",
};

export function BigMarkerRegistrationForm({ conferenceId }: Readonly<{ conferenceId: string }>) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/bigmarker/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conferenceId, ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Registration failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base font-semibold text-[#0f172a]">You&apos;re registered!</p>
        <p className="text-sm text-[#6b7280]">Check your email for confirmation details.</p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded border border-[#d1d5db] bg-white px-3 py-2 text-[13px] text-[#0f172a] placeholder-[#9ca3af] outline-none focus:border-[#0050ff] focus:ring-1 focus:ring-[#0050ff]";
  const labelClass = "mb-1 block text-[12px] font-semibold text-[#374151]";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label htmlFor="bm-firstName" className={labelClass}>
          First name <span className="text-red-500">*</span>
        </label>
        <input
          id="bm-firstName"
          name="firstName"
          type="text"
          required
          autoComplete="given-name"
          value={form.firstName}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bm-lastName" className={labelClass}>
          Last name <span className="text-red-500">*</span>
        </label>
        <input
          id="bm-lastName"
          name="lastName"
          type="text"
          required
          autoComplete="family-name"
          value={form.lastName}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bm-email" className={labelClass}>
          Your email <span className="text-red-500">*</span>
        </label>
        <input
          id="bm-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bm-jobTitle" className={labelClass}>
          Job title <span className="text-red-500">*</span>
        </label>
        <input
          id="bm-jobTitle"
          name="jobTitle"
          type="text"
          required
          autoComplete="organization-title"
          value={form.jobTitle}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bm-organization" className={labelClass}>
          Organization <span className="text-red-500">*</span>
        </label>
        <input
          id="bm-organization"
          name="organization"
          type="text"
          required
          autoComplete="organization"
          value={form.organization}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bm-industry" className={labelClass}>
          Organization industry <span className="text-red-500">*</span>
        </label>
        <select
          id="bm-industry"
          name="organizationIndustry"
          required
          value={form.organizationIndustry}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="" disabled>
            Select an industry
          </option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {status === "error" && (
        <p className="rounded bg-red-50 px-3 py-2 text-[13px] text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 w-full rounded bg-[#0050ff] py-2.5 text-[12px] font-semibold uppercase tracking-widest text-white hover:bg-[#0041cc] disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Confirm Registration"}
      </button>

      <p className="text-[11px] leading-relaxed text-[#9ca3af]">
        We use BigMarker as our webinar platform. By clicking Register, you acknowledge that the
        information you provide will be transferred to BigMarker in accordance with their{" "}
        <a href="https://www.bigmarker.com/terms" className="underline hover:text-[#374151]" target="_blank" rel="noopener noreferrer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="https://www.bigmarker.com/privacy" className="underline hover:text-[#374151]" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>.
      </p>
    </form>
  );
}
