"use client";

import Link from "next/link";
import { useState } from "react";
import type { SubscriptionPageContent } from "@/lib/cms/types";

export function SubscriptionForm({ content }: { content: SubscriptionPageContent }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    const topics = content.topics
      .map((t) => t.title)
      .filter((title) => data.get(`topic:${title}`) === "on");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          jobTitle: data.get("jobTitle"),
          company: data.get("company"),
          emailsConsent: data.get("emailsConsent") === "on",
          topics,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-10 rounded-lg border-2 border-[#1247ff] bg-[#eff3ff] p-6">
        <h3 className="text-lg font-bold text-[#1247ff]">{content.successTitle}</h3>
        <p className="mt-2 text-sm text-[#4b5563]">{content.successBody}</p>
        <Link
          href="/"
          className="mt-4 inline-flex text-sm font-semibold text-[#1247ff] hover:underline"
        >
          &larr; {content.backLabel}
        </Link>
      </div>
    );
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      <Field label="Email" name="email" type="email" required />
      <Field label="First Name" name="firstName" required />
      <Field label="Last Name" name="lastName" required />
      <Field label="Job Title" name="jobTitle" required />
      <Field label="Company" name="company" required placeholder="Company or Organization" />

      <label className="flex items-start gap-3 pt-2 text-sm text-[#4b5563]">
        <input
          type="checkbox"
          name="emailsConsent"
          defaultChecked
          className="mt-1 h-4 w-4 accent-[#1247ff]"
        />
        <span>
          {content.emailsConsentTitle}
          <br />
          {content.emailsConsentBody}
        </span>
      </label>

      <hr className="my-6 border-[#d1d5db]" />

      <p className="text-sm text-[#4b5563]">{content.topicsHelpText}</p>

      <div className="space-y-5">
        {content.topics.map((topic) => (
          <Checkbox
            key={topic.title}
            name={`topic:${topic.title}`}
            title={topic.title}
            description={topic.body}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded border border-[#d1d5db] bg-white p-3 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-[#1247ff]" />
        <span className="text-[#4b5563]">I&apos;m not a robot</span>
        <span className="ml-auto text-xs text-[#9ca3af]">reCAPTCHA (demo)</span>
      </div>

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex rounded bg-[#1247ff] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0d36cc] disabled:opacity-60"
      >
        {submitting ? "Submitting..." : content.submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0b1220]">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder ?? label}
        className="mt-1 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#1247ff]"
      />
    </div>
  );
}

function Checkbox({
  name,
  title,
  description,
}: {
  name: string;
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" name={name} className="mt-1 h-4 w-4 accent-[#1247ff]" />
      <span>
        <span className="font-bold text-[#0b1220]">{title}</span>
        <br />
        <span className="text-[#4b5563]">{description}</span>
      </span>
    </label>
  );
}
