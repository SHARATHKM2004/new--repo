import { QueueServiceClient } from "@azure/storage-queue";
import { NextResponse } from "next/server";

/**
 * GET /api/admin/queue?key=<ADMIN_KEY>&peek=<number>
 *
 * Reads the most recent messages from the Azure Storage Queue so you can
 * verify that Event Grid events are landing without needing Azure portal access.
 *
 * Query params:
 *   key    – must match ADMIN_KEY env var  (required)
 *   peek   – how many messages to fetch, max 32  (default 10)
 *   purge  – set to "1" to delete all messages after peeking
 *   source – "ours" to show only our app's events (cms.content.*),
 *             "other" for project-cms-master only, omit for all
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Auth
  const adminKey = process.env.ADMIN_KEY ?? "";
  if (!adminKey || searchParams.get("key") !== adminKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const queueName = process.env.AZURE_STORAGE_QUEUE_NAME ?? "testoptimizely";

  if (!connectionString) {
    return NextResponse.json(
      { error: "AZURE_STORAGE_CONNECTION_STRING is not configured." },
      { status: 500 },
    );
  }

  const peekCount = Math.min(Number(searchParams.get("peek") ?? "10"), 32);
  const purge = searchParams.get("purge") === "1";
  const sourceFilter = searchParams.get("source"); // "ours" | "other" | null (all)

  try {
    const serviceClient = QueueServiceClient.fromConnectionString(connectionString);
    const queueClient = serviceClient.getQueueClient(queueName);

    // Peek — reads messages without locking them
    const peeked = await queueClient.peekMessages({ numberOfMessages: peekCount });

    const messages = peeked.peekedMessageItems.map((msg) => {
      let body: unknown = msg.messageText;
      // Event Grid base64-encodes message bodies in storage queues
      try {
        const decoded = Buffer.from(msg.messageText, "base64").toString("utf-8");
        body = JSON.parse(decoded);
      } catch {
        try {
          body = JSON.parse(msg.messageText);
        } catch {
          body = msg.messageText;
        }
      }
      return {
        messageId: msg.messageId,
        insertedOn: msg.insertedOn,
        expiresOn: msg.expiresOn,
        dequeueCount: msg.dequeueCount,
        body,
      };
    });

    // Filter by source if requested
    const filtered = sourceFilter
      ? messages.filter((msg) => {
          const eventType =
            (msg.body as Record<string, string>)?.eventType ?? "";
          const isOurs = eventType.startsWith("cms.");
          return sourceFilter === "ours" ? isOurs : !isOurs;
        })
      : messages;

    // Optional purge — receive + delete all messages
    if (purge) {
      await queueClient.clearMessages();
    }

    const props = await queueClient.getProperties();

    return NextResponse.json({
      queue: queueName,
      approximateMessageCount: props.approximateMessagesCount ?? 0,
      peeked: filtered.length,
      purged: purge,
      sourceFilter: sourceFilter ?? "all",
      messages: filtered,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
