import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;

if (!url) {
  // eslint-disable-next-line no-console
  console.warn("[db] DATABASE_URL is not set");
}

export const sql = neon(url ?? "");

let subscribersInitialized = false;
let leadsInitialized = false;

export async function ensureSubscribersTable() {
  if (subscribersInitialized) return;
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
  subscribersInitialized = true;
}

export async function ensureLeadsTable() {
  if (leadsInitialized) return;
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id           SERIAL PRIMARY KEY,
      name         TEXT NOT NULL,
      email        TEXT NOT NULL,
      company      TEXT NOT NULL,
      message      TEXT NOT NULL,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS first_name TEXT`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_name TEXT`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS job_title TEXT`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS city TEXT`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS state TEXT`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone TEXT`;
  leadsInitialized = true;
}
