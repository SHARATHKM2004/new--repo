/**
 * Pushes all variables from .env.local to Vercel (production environment).
 * Skips NODE_TLS_REJECT_UNAUTHORIZED — that's a local dev-only workaround.
 * Run: node scripts/push-env-to-vercel.js
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SKIP = new Set(["NODE_TLS_REJECT_UNAUTHORIZED"]);

const envPath = path.join(__dirname, "..", ".env.local");
const lines = fs.readFileSync(envPath, "utf-8").split(/\r?\n/);

let added = 0;
let skipped = 0;
let failed = 0;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;

  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();

  // Strip surrounding quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  if (SKIP.has(key)) {
    console.log(`  SKIP  ${key}`);
    skipped++;
    continue;
  }

  process.stdout.write(`  ADD   ${key} ... `);

  const result = spawnSync("vercel", ["env", "add", key, "production", "--force"], {
    input: value + "\n",
    encoding: "utf-8",
    shell: true,
  });

  if (result.status === 0) {
    console.log("ok");
    added++;
  } else {
    const err = (result.stderr || result.stdout || "").trim().split("\n").pop();
    console.log(`FAILED — ${err}`);
    failed++;
  }
}

console.log(`\nDone: ${added} added, ${skipped} skipped, ${failed} failed.`);
if (failed === 0) {
  console.log("\nNow run:  vercel --prod --yes");
}
