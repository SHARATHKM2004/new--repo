"use client";

import Link from "next/link";
import { useState } from "react";

export default function SubscriptionPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#f3f4f6]">
        <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
          <h1 className="text-4xl font-semibold text-[#1247ff] lg:text-5xl">
            Summit Advisory Group subscription center
          </h1>
        </div>
      </section>

      <nav className="bg-[#4b5563] text-sm text-white">
        <div className="mx-auto max-w-5xl px-6 py-3 lg:px-10">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-3 text-white/60">|</span>
          <span className="text-[#fbbf24]">Summit Advisory Group subscription center</span>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
        <h2 className="text-2xl font-semibold text-[#1247ff]">Want to stay in the know?</h2>
        <p className="mt-4 text-sm leading-7 text-[#4b5563]">
          At Summit Advisory Group, we strive to keep you aware of relevant issues impacting your
          organization so you can make more informed decisions. From important updates and
          compelling{" "}
          <span className="text-[#1247ff]">
            thought leadership to educational webinars and events
          </span>
          , get the latest news and information on the topics you care about, delivered straight to
          your inbox.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-lg border-2 border-[#1247ff] bg-[#eff3ff] p-6">
            <h3 className="text-lg font-bold text-[#1247ff]">Thanks for subscribing!</h3>
            <p className="mt-2 text-sm text-[#4b5563]">
              You will receive Summit Advisory Group updates on the topics you selected.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex text-sm font-semibold text-[#1247ff] hover:underline"
            >
              &larr; Back to home
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Field label="Email" type="email" required />
            <Field label="First Name" required />
            <Field label="Last Name" required />
            <Field label="Job Title" required />
            <Field label="Company" required placeholder="Company or Organization" />

            <label className="flex items-start gap-3 pt-2 text-sm text-[#4b5563]">
              <input
                type="checkbox"
                defaultChecked
                className="mt-1 h-4 w-4 accent-[#1247ff]"
              />
              <span>
                Sign up for Summit Advisory Group emails.
                <br />
                You can select specific e-communications you wish to receive below.
              </span>
            </label>

            <hr className="my-6 border-[#d1d5db]" />

            <p className="text-sm text-[#4b5563]">
              Check the boxes below to receive the latest information impacting you and your
              organization.
            </p>

            <div className="space-y-5">
              <Checkbox
                title="Thought Leadership"
                description="The latest insights on topics that matter to you. Types of communications include thought leadership content, industry newsletters, e-books, news and alerts."
              />
              <Checkbox
                title="Event Invitations"
                description="Receive event invitations relevant to you and your business needs. Examples of events include forums, conferences, webinars, in-person events, networking events, and trainings."
              />
              <Checkbox
                title="Summit Weekly"
                description="A weekly update of the most critical advisory insights, market shifts, and operational updates."
              />
              <Checkbox
                title="Regulatory Reporting Requirements"
                description="Opt in to receive an email when key regulatory reference tables are updated."
              />
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
              Submit
            </button>
          </form>
        )}
      </div>
    </main>
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
