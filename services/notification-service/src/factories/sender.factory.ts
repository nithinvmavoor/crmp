import { NotificationChannel } from "../types/notification.types";
import { NotificationSender } from "../senders/notification.sender";
import { EmailSender } from "../senders/email.sender";
import { SmsSender } from "../senders/sms.sender";
import { PushSender } from "../senders/push.sender";

// Define a registry mapping channels to their respective class constructors
const SENDER_MAP: Record<NotificationChannel, new () => NotificationSender> = {
  EMAIL: EmailSender,
  SMS: SmsSender,
  PUSH: PushSender,
};
export class SenderFactory {

  static getSender(channel: NotificationChannel): NotificationSender {
    const SenderClass = SENDER_MAP[channel];

    if (!SenderClass) {
      throw new Error("INVALID_CHANNEL");
    }

    return new SenderClass();
  }
}