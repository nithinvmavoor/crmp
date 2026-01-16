import { workerRedisClient } from "../db/redis";
import { logger } from "../utils/logger";
import { NotifyPayload } from "../types/notification.types";

const QUEUE = process.env.QUEUE_NAME || "notify:queue";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const startNotificationWorker = async () => {
  logger("info", "Notification worker started", { queue: QUEUE });

  while (true) {
    try {
      // BRPOP blocks until item available
      const res = await workerRedisClient.brPop(QUEUE, 0);
      console.log("here!!!");

      if (!res) continue;

      const payload: NotifyPayload = JSON.parse(res.element);

      // simulate sending notification
      logger("info", "Processing notification", payload);

      // simulate delay like email provider
      await sleep(10000);

      logger("info", "Notification sent", payload);
    } catch (err: any) {
      logger("error", "Worker failed to process job", { errorMessage: err.message });

      // prevent tight loop in case of repeated failures
      await sleep(10000);
    }
  }
};
