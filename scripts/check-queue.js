/**
 * Check Azure Storage Queue messages via the deployed queue viewer API.
 * Run: node scripts/check-queue.js
 */
const https = require("https");

const HOST = "new-repo-theta-lovat.vercel.app";
const KEY = "summit-admin-2026";
const PEEK = 32;

const req = https.request(
  {
    hostname: HOST,
    path: `/api/admin/queue?key=${KEY}&peek=${PEEK}`,
    method: "GET",
    rejectUnauthorized: false, // corporate SSL proxy
  },
  (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        console.log("=== Azure Storage Queue ===");
        console.log(`Queue         : ${json.queue}`);
        console.log(`Total messages: ${json.approximateMessageCount}`);
        console.log(`Peeked        : ${json.peeked}`);

        if (json.messages.length === 0) {
          console.log("\nNo messages in queue yet.");
          console.log("Either the publish event hasn't arrived, or the queue was already drained.");
        } else {
          json.messages.forEach((msg, i) => {
            console.log(`\n--- Message ${i + 1} ---`);
            console.log(`Inserted : ${msg.insertedOn}`);
            console.log(`Dequeued : ${msg.dequeueCount} times`);
            console.log("Body:");
            console.log(JSON.stringify(msg.body, null, 2));
          });
        }
      } catch {
        console.log("Raw response:", data);
      }
    });
  },
);

req.on("error", (e) => console.error("Error:", e.message));
req.end();
