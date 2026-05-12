import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type LeadSubmission = {
  name: string;
  email: string;
  company: string;
  message: string;
  createdAt: string;
};

const leadsPath = path.join(process.cwd(), "data", "leads.json");

async function ensureStorage() {
  await mkdir(path.dirname(leadsPath), { recursive: true });

  try {
    await readFile(leadsPath, "utf8");
  } catch {
    await writeFile(leadsPath, "[]", "utf8");
  }
}

export async function saveLeadSubmission(submission: LeadSubmission) {
  await ensureStorage();
  const existing = await readFile(leadsPath, "utf8");
  const parsed = JSON.parse(existing) as LeadSubmission[];
  parsed.unshift(submission);
  await writeFile(leadsPath, JSON.stringify(parsed, null, 2), "utf8");
}