import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  // eslint-disable-next-line no-console
  console.warn("[db] DATABASE_URL is not set");
}

export const sql = neon(url ?? "");

let initialized = false;

export async function ensureSubscribersTable() {
  if (initialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id           SERIAL PRIMARY KEY,
      email        TEXT NOT NULL,
      first_name   TEXT NOT NULL,
      last_name    TEXT NOT NULL,
      job_title    TEXT NOT NULL,
      company      TEXT NOT NULL,
      emails_consent BOOLEAN NOT NULL DEFAULT TRUE,
      topics       TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  initialized = true;
}
