export type NotificationType = "ORDER_CREATED" | "ORDER_CONFIRMED";

export type NotifyPayload = {
  type: NotificationType;
  orderId: string;
  customerId: string;
  createdAt: string;
};
