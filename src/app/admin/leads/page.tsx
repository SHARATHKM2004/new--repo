import { ensureLeadsTable, sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadRow = {
  id: number;
  name: string;
  email: string;
  company: string;
  message: string;
  submitted_at: string;
};

export default async function AdminLeadsPage({
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

  await ensureLeadsTable();
  const rows = (await sql`
    SELECT id, name, email, company, message, submitted_at
    FROM leads
    ORDER BY submitted_at DESC
    LIMIT 500
  `) as LeadRow[];

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0b1220]">Leads</h1>
          <p className="mt-1 text-sm text-[#4b5563]">{rows.length} entries (latest 500)</p>
        </div>
        <a
          href={`/api/admin/leads.csv?key=${encodeURIComponent(key ?? "")}`}
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
              <th className="px-3 py-2">Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[#e5e7eb] align-top text-[#0b1220]">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-[#4b5563]">
                  {new Date(r.submitted_at).toLocaleString()}
                </td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.email}</td>
                <td className="px-3 py-2">{r.company}</td>
                <td className="px-3 py-2 text-xs text-[#4b5563] whitespace-pre-wrap">{r.message}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-[#4b5563]">No leads yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
