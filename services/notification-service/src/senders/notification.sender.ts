import { NotificationMessage } from "../types/notification.types";

export interface NotificationSender {
  send(message: NotificationMessage): Promise<void>;
}
