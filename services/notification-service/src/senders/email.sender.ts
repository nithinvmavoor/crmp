import { NotificationSender } from "./notification.sender";
import { NotificationMessage } from "../types/notification.types";
import { sleep } from "../workers/notification.worker";
import { logger } from "@crmp/common";

export class EmailSender implements NotificationSender {
  async send(message: NotificationMessage): Promise<void> {
    const email = message.to.email;

    if (!email) {
      throw new Error("EMAIL_MISSING");
    }

    // Replace later with SendGrid / SES
    await sleep(10000);

    logger("info", "EMAIL sent", {
      to: email,
      subject: message.subject,
      body: message.body,
    });
  }
}
