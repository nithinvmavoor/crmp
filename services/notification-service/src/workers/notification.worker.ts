import { workerRedisClient } from "../db/redis";
import { logger } from "../utils/logger";
import { NotificationService } from "../services/notification.service";
import { NotificationJob } from "../types/notification.types";

const QUEUE = process.env.QUEUE_NAME || "notify:queue";
const service = new NotificationService();

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const startNotificationWorker = async () => {
  logger("info", "Notification worker started", { queue: QUEUE });

  while (true) {
    try {
      const res = await workerRedisClient.brPop(QUEUE, 0);
      if (!res) continue;

      const job: NotificationJob = JSON.parse(res.element);

      await service.process(job);
    } catch (err: any) {
      logger("error", "Worker failed to process job", { errorMessage: err.message });
      await sleep(1000);
    }
  }
};
