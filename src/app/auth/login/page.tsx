import { API_ACCESS_QUERY_PARAM } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next = "/api/articles" } = await searchParams;
  const safeNext = next.startsWith("/") ? next : "/api/articles";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1220",
        color: "#f1f5f9",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        padding: "1.5rem",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 540,
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: 12,
          padding: "1.75rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>API access</h1>
        <p style={{ marginTop: 10, marginBottom: 0, fontSize: 14, color: "#cbd5e1", lineHeight: 1.6 }}>
          Cookie-based login has been removed. Protected API and debug endpoints now expect a
          shared secret directly in the URL query string.
        </p>
        <p style={{ marginTop: 16, marginBottom: 0, fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>
          Use this pattern:
        </p>
        <pre
          style={{
            marginTop: 10,
            marginBottom: 0,
            padding: "12px 14px",
            borderRadius: 8,
            background: "#0f172a",
            border: "1px solid #334155",
            color: "#f8fafc",
            overflowX: "auto",
            fontSize: 13,
          }}
        >
          {`${safeNext}${safeNext.includes("?") ? "&" : "?"}${API_ACCESS_QUERY_PARAM}=YOUR_SECRET`}
        </pre>
      </section>
    </main>
  );
}
