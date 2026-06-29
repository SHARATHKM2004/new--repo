const https = require("https");

const r = https.request(
  {
    hostname: "new-repo-theta-lovat.vercel.app",
    path: "/api/optimizely/capture?key=summit-admin-2026",
    rejectUnauthorized: false,
  },
  (res) => {
    let d = "";
    res.on("data", (c) => (d += c));
    res.on("end", () => {
      try {
        const json = JSON.parse(d);
        console.log(`\nCaptures found: ${json.count}`);
        if (json.count === 0) {
          console.log("Nothing captured yet — Optimizely has not called this URL.");
        } else {
          json.captures.forEach((c, i) => {
            console.log(`\n=== Capture ${i + 1} @ ${c.capturedAt} ===`);
            console.log("Method:", c.method);
            console.log("Headers:", JSON.stringify(c.headers, null, 2));
            console.log("Body:", JSON.stringify(c.body, null, 2));
          });
        }
      } catch {
        console.log(d);
      }
    });
  },
);
r.on("error", (e) => console.error(e.message));
r.end();
