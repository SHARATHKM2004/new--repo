import Link from "next/link";
import { draftMode } from "next/headers";
import { getSubscriptionPageContent } from "@/lib/cms";
import { SubscriptionForm } from "./subscription-form";

export default async function SubscriptionPage() {
  const draft = await draftMode();
  const content = await getSubscriptionPageContent("en", draft.isEnabled);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#f3f4f6]">
        <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
          <h1 className="text-4xl font-semibold text-[#1247ff] lg:text-5xl">
            {content.pageTitle}
          </h1>
        </div>
      </section>

      <nav className="bg-[#4b5563] text-sm text-white">
        <div className="mx-auto max-w-5xl px-6 py-3 lg:px-10">
          <Link href="/" className="hover:underline">
            {content.breadcrumbHomeLabel}
          </Link>
          <span className="mx-3 text-white/60">|</span>
          <span className="text-[#fbbf24]">{content.pageTitle}</span>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
        <h2 className="text-2xl font-semibold text-[#1247ff]">{content.heading}</h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4b5563]">
          {content.intro}
        </p>

        <SubscriptionForm content={content} />
      </div>
    </main>
  );
}
