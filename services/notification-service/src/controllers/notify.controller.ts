import { Response } from "express";
import { redisClient } from "../db/redis";
import { logger } from "../utils/logger";
import { sendErrorResponse } from "../utils/error-response.util";
import { AuthRequest } from "../middlewares/auth.middleware";
import { NotifyPayload } from "../types/notification.types";

const QUEUE = process.env.QUEUE_NAME || "notify:queue";

export const enqueueNotification = async (req: AuthRequest, res: Response) => {
  logger("info", "Redis status", {
    isOpen: redisClient.isOpen,
    isReady: redisClient.isReady,
  });

  try {
    const { type, orderId, customerId } = req.body;

    if (!type || !orderId || !customerId) {
      console.log("type, orderId and customerId are required");
      return sendErrorResponse(
        res,
        400,
        "type, orderId and customerId are required",
        "VALIDATION_ERROR"
      );
    }

    const payload: NotifyPayload = {
      type,
      orderId,
      customerId,
      createdAt: new Date().toISOString(),
    };

    // queue (LPUSH)
    await redisClient.lPush(QUEUE, JSON.stringify(payload));

    logger("info", "Notification queued", {
      queue: QUEUE,
      type,
      orderId,
      customerId,
    });

    return res.status(202).json({
      success: true,
      data: { queued: true },
      error: null,
    });
  } catch (err: any) {
    logger("error", "Failed to queue notification", { errorMessage: err.message });
    return sendErrorResponse(res, 500, "Internal server error", "INTERNAL_ERROR");
  }
};
