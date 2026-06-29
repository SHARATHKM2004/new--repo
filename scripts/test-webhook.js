/**
 * Test script — simulates an Optimizely publish webhook.
 * Usage:
 *   node scripts/test-webhook.js           → hits localhost:3000
 *   node scripts/test-webhook.js prod      → hits the Vercel production URL
 */

const http = require("http");
const https = require("https");

const TARGET = process.argv[2] === "prod"
  ? "https://new-repo-theta-lovat.vercel.app"
  : "http://localhost:3000";

const isProd = TARGET.startsWith("https");

const payload = {
  id: `test-event-${Date.now()}`,
  timestamp: new Date().toISOString(),
  tenantId: "wipf02saastp45ent001",
  type: { subject: "ContentPage", action: "published" },
  data: { docId: "doc-abc-123", journalId: "journal-xyz-456" },
};

const body = JSON.stringify(payload);

const url = new URL(TARGET + "/api/optimizely/webhook");
const options = {
  hostname: url.hostname,
  port: url.port || (isProd ? 443 : 80),
  path: url.pathname,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-webhook-secret": "local-revalidate-secret",
    "Content-Length": Buffer.byteLength(body),
  },
};

console.log(`\nSending test webhook to: ${TARGET}`);

const transport = isProd ? https : http;
const req = transport.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("\n=== Webhook Response ===");
    console.log("Status:", res.statusCode);
    try {
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    } catch {
      console.log(data);
    }
    console.log("\n=== Where to check logs ===");
    if (isProd) {
      console.log("1. Vercel logs:    vercel logs new-repo-theta-lovat.vercel.app --follow");
      console.log("2. Vercel dashboard: https://vercel.com/vaishalisingh2017-7206s-projects/new--repo");
    } else {
      console.log("1. Dev server terminal: look for [azure-event-grid] Published event");
    }
    console.log("3. Azure Portal → Event Grid topic egtpcsyncIndustryInsightsdev4 → Metrics");
    console.log("4. Azure Portal → stbpubclientportaldev4 → Queues → testoptimizely → Peek");
  });
});

req.on("error", (e) => {
  console.error("Request failed:", e.message);
  if (!isProd) console.error("Make sure the app is running: npm run dev");
});

req.write(body);
req.end();
