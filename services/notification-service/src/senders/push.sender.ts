import { NotificationSender } from "./notification.sender";
import { NotificationMessage } from "../types/notification.types";
import { logger } from "@crmp/common";
import { sleep } from "../workers/notification.worker";

export class PushSender implements NotificationSender {
  async send(message: NotificationMessage): Promise<void> {
    const token = message.to.deviceToken;

    if (!token) {
      throw new Error("DEVICE_TOKEN_MISSING");
    }

    // Replace later with Firebase FCM
    //await sleep(10000);

    logger("info", "PUSH sent", {
      to: token,
      title: message.title,
      body: message.body,
    });
  }
}
