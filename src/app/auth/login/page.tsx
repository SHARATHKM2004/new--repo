import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  getExpectedPassword,
  getExpectedUser,
} from "@/lib/api-auth";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ next?: string; error?: string }>;

async function loginAction(formData: FormData) {
  "use server";

  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/api/articles");
  const next = nextRaw.startsWith("/") ? nextRaw : "/api/articles";

  const secret = getExpectedPassword();
  if (!secret) {
    redirect(`/auth/login?error=server&next=${encodeURIComponent(next)}`);
  }

  if (user !== getExpectedUser() || password !== secret) {
    redirect(`/auth/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  const token = createSessionToken(secret);
  const jar = await cookies();
  jar.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  redirect(next);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next = "/api/articles", error } = await searchParams;

  const errorMessage =
    error === "invalid"
      ? "Invalid username or password."
      : error === "server"
      ? "Server auth not configured."
      : null;

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
      <form
        action={loginAction}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: 12,
          padding: "1.75rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          API access
        </h1>
        <p style={{ marginTop: 6, marginBottom: 18, fontSize: 13, color: "#94a3b8" }}>
          Sign in to view this endpoint. Session lasts {SESSION_TTL_SECONDS} seconds.
        </p>

        <input type="hidden" name="next" value={next} />

        <label style={{ display: "block", fontSize: 12, color: "#cbd5e1", marginBottom: 4 }}>
          Username
        </label>
        <input
          name="user"
          autoComplete="username"
          defaultValue="admin"
          required
          style={inputStyle}
        />

        <label
          style={{
            display: "block",
            fontSize: 12,
            color: "#cbd5e1",
            marginTop: 12,
            marginBottom: 4,
          }}
        >
          Password
        </label>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          style={inputStyle}
        />

        {errorMessage ? (
          <p style={{ color: "#fca5a5", fontSize: 13, marginTop: 12, marginBottom: 0 }}>
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          style={{
            marginTop: 18,
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: 0,
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#f8fafc",
  fontSize: 14,
  boxSizing: "border-box",
};
