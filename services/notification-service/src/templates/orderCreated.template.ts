import {
  NotificationJob,
  NotificationMessage,
  NotificationChannel,
} from "../types/notification.types";

type BuilderFn = () => NotificationMessage;

export const buildOrderCreatedMessage = (
  job: NotificationJob,
  channel: NotificationChannel
): NotificationMessage => {
  const orderId = job.data.orderId;
  const total = job.data.totalAmount;

  const baseBody = `Your order (${orderId}) has been created successfully. Total: ₹${total}.`;
  const base = {
    body: baseBody,
    to: job.user,
    meta: { orderId, total, traceId: job.traceId },
  };

  const builders: Record<NotificationChannel, BuilderFn> = {
    EMAIL: () => ({
      channel: "EMAIL",
      subject: "Order Created",
      ...base,
    }),

    SMS: () => ({
      channel: "SMS",
      ...base,
    }),

    PUSH: () => ({
      channel: "PUSH",
      title: "Order Created",
      ...base,
    }),
  };

  return builders[channel]();
};
