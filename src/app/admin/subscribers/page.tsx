import { ensureSubscribersTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubscriberRow = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  job_title: string;
  company: string;
  emails_consent: boolean;
  topics: string | null;
  submitted_at: string;
};

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey || key !== adminKey) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-2xl font-semibold text-[#0b1220]">Admin access</h1>
        <p className="mt-3 text-sm text-[#4b5563]">
          Append <code>?key=YOUR_ADMIN_KEY</code> to the URL.
        </p>
      </main>
    );
  }

  await ensureSubscribersTable();
  const rows = (await sql`
    SELECT id, email, first_name, last_name, job_title, company, emails_consent, topics, submitted_at
    FROM subscribers
    ORDER BY submitted_at DESC
    LIMIT 500
  `) as SubscriberRow[];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0b1220]">Subscribers</h1>
          <p className="mt-1 text-sm text-[#4b5563]">{rows.length} entries (latest 500)</p>
        </div>
        <a
          href={`/api/admin/subscribers.csv?key=${encodeURIComponent(key ?? "")}`}
          className="rounded bg-[#1247ff] px-4 py-2 text-sm font-semibold text-white"
        >
          Download CSV
        </a>
      </header>

      <div className="overflow-x-auto rounded border border-[#e5e7eb]">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead className="bg-[#f3f4f6] text-left text-xs uppercase tracking-wide text-[#4b5563]">
            <tr>
              <th className="px-3 py-2">Submitted</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Job Title</th>
              <th className="px-3 py-2">Consent</th>
              <th className="px-3 py-2">Topics</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[#e5e7eb] text-[#0b1220]">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#4b5563]">
                  {new Date(r.submitted_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">{r.first_name} {r.last_name}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.company}</td>
                <td className="px-3 py-2">{r.job_title}</td>
                <td className="px-3 py-2">{r.emails_consent ? "Yes" : "No"}</td>
                <td className="px-3 py-2 text-xs text-[#4b5563]">{r.topics ?? ""}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-3 py-6 text-center text-[#4b5563]">No subscribers yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
