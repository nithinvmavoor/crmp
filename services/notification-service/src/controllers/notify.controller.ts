import { Response } from "express";
import { redisClient } from "../db/redis";
import { sendErrorResponse } from "../utils/error-response.util";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middlewares/auth.middleware";
import { NotificationJob, NotificationChannel } from "../types/notification.types";

const QUEUE = process.env.QUEUE_NAME || "notify:queue";

export const enqueueNotification = async (req: AuthRequest, res: Response) => {
  try {
    const { eventType, channels, user, data, traceId } = req.body;

    if (!eventType || !channels || !Array.isArray(channels) || channels.length === 0) {
      logger("error", "Required parameters missing: eventType, channels, user, data, traceId");
      return sendErrorResponse(res, 400, "eventType and channels are required", "VALIDATION_ERROR");
    }

    const allowed: NotificationChannel[] = ["EMAIL", "SMS", "PUSH"];
    const invalid = channels.filter((c: string) => !allowed.includes(c as NotificationChannel));
    if (invalid.length > 0) {
      return sendErrorResponse(
        res,
        400,
        `Invalid channels: ${invalid.join(", ")}`,
        "VALIDATION_ERROR"
      );
    }

    const job: NotificationJob = {
      eventType,
      channels,
      user: user || {},
      data: data || {},
      createdAt: new Date().toISOString(),
      traceId,
    };

    // TODO: Push 3 tasks as separate items into quwue.
    await redisClient.lPush(QUEUE, JSON.stringify(job));

    logger("info", "Notification queued", {
      eventType,
      channels,
      queue: QUEUE,
      traceId,
    });

    return res.status(202).json({
      success: true,
      data: { queued: true },
      error: null,
    });
  } catch (err: any) {
    logger("error", "Failed to enqueue notification", { errorMessage: err.message });
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
