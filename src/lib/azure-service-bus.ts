/**
 * Azure Event Grid utility.
 *
 * Publishes CMS publish/change events to an Azure Event Grid topic so that
 * downstream subscribers (storage queues, logic apps, functions, etc.) can
 * react to content changes independently of this Next.js app.
 *
 * Topic:  egtpcsyncIndustryInsightsdev4
 * Queue:  testoptimizely  (stbpubclientportaldev4 storage account)
 *
 * Required env vars:
 *   AZURE_EVENT_GRID_TOPIC_ENDPOINT  – Full topic URL ending in /api/events
 *   AZURE_EVENT_GRID_TOPIC_KEY       – Access key from the Azure portal
 *
 * If either env var is missing the helper logs a warning and returns
 * gracefully so that the webhook endpoint never fails.
 */

import { EventGridPublisherClient } from "@azure/eventgrid";
import { AzureKeyCredential } from "@azure/core-auth";

export type CmsPublishEvent = {
  /** Optimizely webhook event ID (uuid). */
  eventId: string | null;
  /** ISO-8601 timestamp – falls back to Date.now() when Optimizely omits it. */
  timestamp: string;
  /** Event subject reported by Optimizely (e.g. "ContentPage"). */
  subject: string | null;
  /** Event action reported by Optimizely (e.g. "published"). */
  action: string | null;
  /** Optimizely tenant id. */
  tenantId: string | null;
  /** Content identifiers from the webhook payload. */
  data: {
    docId: string | null;
    journalId: string | null;
  };
  /** Next.js cache tags that were revalidated as a result of this event. */
  revalidatedTags: string[];
  /** Next.js paths that were revalidated. */
  revalidatedPaths: string[];
};

let _client: EventGridPublisherClient<"EventGrid"> | null = null;

function getClient(): EventGridPublisherClient<"EventGrid"> | null {
  const endpoint = process.env.AZURE_EVENT_GRID_TOPIC_ENDPOINT;
  const key = process.env.AZURE_EVENT_GRID_TOPIC_KEY;
  if (!endpoint || !key) return null;

  if (!_client) {
    _client = new EventGridPublisherClient(endpoint, "EventGrid", new AzureKeyCredential(key));
  }
  return _client;
}

/**
 * Publishes a CMS publish event to the Azure Event Grid topic.
 * Safe to call without awaiting — errors are caught and logged, never thrown.
 */
export async function enqueueCmsEvent(event: CmsPublishEvent): Promise<void> {
  const client = getClient();

  if (!client) {
    console.warn(
      "[azure-event-grid] AZURE_EVENT_GRID_TOPIC_ENDPOINT or " +
        "AZURE_EVENT_GRID_TOPIC_KEY is not set — skipping event publish.",
    );
    return;
  }

  try {
    await client.send([
      {
        id: event.eventId ?? crypto.randomUUID(),
        eventType: `cms.content.${event.action ?? "change"}`,
        subject: event.subject ?? "Content",
        dataVersion: "1.0",
        eventTime: new Date(event.timestamp),
        data: {
          eventId: event.eventId,
          timestamp: event.timestamp,
          subject: event.subject,
          action: event.action,
          tenantId: event.tenantId,
          docId: event.data.docId,
          journalId: event.data.journalId,
          revalidatedTags: event.revalidatedTags,
          revalidatedPaths: event.revalidatedPaths,
        },
      },
    ]);
    console.log(
      `[azure-event-grid] Published event ${event.eventId ?? "(no id)"} → topic`,
    );
  } catch (err) {
    console.error("[azure-event-grid] Failed to publish CMS event:", err);
  }
}
