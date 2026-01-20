import { SenderFactory } from "../factories/sender.factory";
import { NotificationJob } from "../types/notification.types";
import { logger } from "@crmp/common";
import { buildOrderCreatedMessage } from "../templates/orderCreated.template";

export class NotificationService {
  async process(job: NotificationJob): Promise<void> {
    logger("info", "Processing notification job", {
      eventType: job.eventType,
      channels: job.channels,
      traceId: job.traceId,
    });

    const results = await Promise.allSettled(
      job.channels.map(async (channel) => {
        const sender = SenderFactory.getSender(channel);

        // Build channel-specific payload (Template) 
        // TODO: This can be moved to sender.buildMessage
        const message =
          job.eventType === "ORDER_CREATED"
            ? buildOrderCreatedMessage(job, channel)
            : buildOrderCreatedMessage(job, channel); // add other templates later

        await sender.send(message);
      })
    );

    // Track failures
    const failures = results
      .map((r, idx) => ({ r, channel: job.channels[idx] }))
      .filter((x) => x.r.status === "rejected");

    if (failures.length > 0) {
      logger("error", "Some notification channels failed", {
        failures: failures.map((f) => ({
          channel: f.channel,
          reason: (f.r as PromiseRejectedResult).reason?.message || "UNKNOWN",
        })),
        traceId: job.traceId,
      });

      // Later you can push failed channels to retry queue / DLQ
      return;
    }

    logger("info", "Notification job completed", { traceId: job.traceId });
  }
}
