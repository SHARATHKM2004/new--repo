"use client";

import Link from "next/link";
import { useState } from "react";
import type { SubscriptionPageContent } from "@/lib/cms/types";

export function SubscriptionForm({ content }: { content: SubscriptionPageContent }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
      <Field label="Email" type="email" required />
      <Field label="First Name" required />
      <Field label="Last Name" required />
      <Field label="Job Title" required />
      <Field label="Company" required placeholder="Company or Organization" />

      <label className="flex items-start gap-3 pt-2 text-sm text-[#4b5563]">
        <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 accent-[#1247ff]" />
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
          <Checkbox key={topic.title} title={topic.title} description={topic.body} />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded border border-[#d1d5db] bg-white p-3 text-sm">
        <input type="checkbox" className="h-5 w-5 accent-[#1247ff]" />
        <span className="text-[#4b5563]">I&apos;m not a robot</span>
        <span className="ml-auto text-xs text-[#9ca3af]">reCAPTCHA (demo)</span>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex rounded bg-[#1247ff] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0d36cc]"
      >
        {content.submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
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
        type={type}
        required={required}
        placeholder={placeholder ?? label}
        className="mt-1 w-full rounded border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#1247ff]"
      />
    </div>
  );
}

function Checkbox({ title, description }: { title: string; description: string }) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" className="mt-1 h-4 w-4 accent-[#1247ff]" />
      <span>
        <span className="font-bold text-[#0b1220]">{title}</span>
        <br />
        <span className="text-[#4b5563]">{description}</span>
      </span>
    </label>
  );
}
