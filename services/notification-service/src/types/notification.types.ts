export type NotificationType = "ORDER_CREATED" | "ORDER_CONFIRMED";

export type NotifyPayload = {
  type: NotificationType;
  orderId: string;
  customerId: string;
  createdAt: string;
};

export type NotificationChannel = "EMAIL" | "SMS" | "PUSH";

export type NotificationEventType = "ORDER_CREATED" | "ORDER_CONFIRMED";

export type UserContacts = {
  email?: string;
  phone?: string;
  deviceToken?: string;
};

export type NotificationJob = {
  eventType: NotificationEventType;
  channels: NotificationChannel[];

  // who to notify
  user: UserContacts;

  // event-specific data
  data: Record<string, any>;

  createdAt: string;
  traceId?: string;
};

// Standard message used internally by senders
export type NotificationMessage = {
  channel: NotificationChannel;
  subject?: string; // email
  title?: string; // push
  body: string; // all channels
  to: UserContacts;
  meta?: Record<string, any>;
};
