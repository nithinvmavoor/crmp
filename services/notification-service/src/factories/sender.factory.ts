import { NotificationChannel } from "../types/notification.types";
import { NotificationSender } from "../senders/notification.sender";
import { EmailSender } from "../senders/email.sender";
import { SmsSender } from "../senders/sms.sender";
import { PushSender } from "../senders/push.sender";

export class SenderFactory {
  static getSender(channel: NotificationChannel): NotificationSender {
    switch (channel) {
      case "EMAIL":
        return new EmailSender();
      case "SMS":
        return new SmsSender();
      case "PUSH":
        return new PushSender();
      default:
        throw new Error("INVALID_CHANNEL");
    }
  }
}
