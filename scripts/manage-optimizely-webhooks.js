/**
 * Manage Optimizely Content Graph webhooks via their REST API.
 *
 * Usage:
 *   node scripts/manage-optimizely-webhooks.js list
 *   node scripts/manage-optimizely-webhooks.js register
 *   node scripts/manage-optimizely-webhooks.js delete <id>
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// Load .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const env = Object.fromEntries(
  fs
    .readFileSync(envPath, "utf-8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      let v = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      return [l.slice(0, i).trim(), v];
    }),
);

const APP_KEY = env.OPTIMIZELY_GRAPH_APP_KEY;
const SECRET = env.OPTIMIZELY_GRAPH_SECRET;
const RENDER_URL = env.OPTIMIZELY_RENDER_URL ?? "https://cg.optimizely.com";

if (!APP_KEY || !SECRET) {
  console.error("Missing OPTIMIZELY_GRAPH_APP_KEY or OPTIMIZELY_GRAPH_SECRET in .env.local");
  process.exit(1);
}

const BASIC_AUTH = Buffer.from(`${APP_KEY}:${SECRET}`).toString("base64");
const BASE_URL = new URL(RENDER_URL);

// The URL Optimizely will call when content is published
// Secret passed as query param (matches what project-cms-master uses)
const WEBHOOK_URL =
  "https://new-repo-theta-lovat.vercel.app/api/optimizely/webhook?secret=local-revalidate-secret";

function request(method, pathStr, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: BASE_URL.hostname,
      path: pathStr,
      method,
      headers: {
        Authorization: `Basic ${BASIC_AUTH}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(bodyStr ? { "Content-Length": Buffer.byteLength(bodyStr) } : {}),
      },
      rejectUnauthorized: false,
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        console.log(`${method} ${pathStr} → HTTP ${res.statusCode}`);
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on("error", reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function tryPaths(method, paths, body) {
  for (const p of paths) {
    try {
      const result = await request(method, p, body);
      if (result.status < 500) return result;
    } catch (e) {
      console.log(`  ${p} failed: ${e.message}`);
    }
  }
  return null;
}

async function list() {
  console.log("\n=== Listing Optimizely Graph Webhooks ===\n");
  const result = await tryPaths("GET", [
    "/api/webhooks",
    "/api/v1/webhooks",
    "/api/v2/webhooks",
    "/api/v3/webhooks",
    "/v3/webhooks",
    "/webhooks",
  ]);
  if (result) {
    console.log(JSON.stringify(result.body, null, 2));
  } else {
    console.log("Could not determine correct webhook API path.");
  }
}

async function register() {
  console.log("\n=== Registering Optimizely Graph Webhook ===\n");
  console.log("Target URL:", WEBHOOK_URL);

  const payload = {
    request: {
      url: WEBHOOK_URL,
      method: "post",
    },
    topics: ["doc.published", "doc.updated"],
    filters: [{ status: { eq: "Published" } }],
    preset: "next",
  };

  const result = await tryPaths("POST", ["/api/webhooks"], payload);

  if (result) {
    console.log(JSON.stringify(result.body, null, 2));
  } else {
    console.log("\nCould not register — see manual steps below.");
    console.log("\n--- Manual Option ---");
    console.log("Visit: https://cg.optimizely.com");
    console.log("App Key:", APP_KEY);
    console.log("Secret:", SECRET.slice(0, 6) + "...");
    console.log("Register webhook URL:", WEBHOOK_URL);
  }
}

async function deleteWebhook(id) {
  console.log(`\n=== Deleting webhook ${id} ===\n`);
  const result = await tryPaths("DELETE", [
    `/api/webhooks/${id}`,
    `/api/v1/webhooks/${id}`,
    `/v3/webhooks/${id}`,
  ]);
  if (result) console.log(JSON.stringify(result.body, null, 2));
}

const cmd = process.argv[2];
if (cmd === "register") register().catch(console.error);
else if (cmd === "delete") deleteWebhook(process.argv[3]).catch(console.error);
else list().catch(console.error);
