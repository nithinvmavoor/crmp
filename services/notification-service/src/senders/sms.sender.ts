import { NotificationSender } from "./notification.sender";
import { NotificationMessage } from "../types/notification.types";
import { logger } from "../utils/logger";
import { sleep } from "../workers/notification.worker";

export class SmsSender implements NotificationSender {
  async send(message: NotificationMessage): Promise<void> {
    const phone = message.to.phone;

    if (!phone) {
      throw new Error("PHONE_MISSING");
    }

    // Replace later with Twilio / SNS
    await sleep(10000);

    logger("info", "SMS sent", {
      to: phone,
      body: message.body,
    });
  }
}
