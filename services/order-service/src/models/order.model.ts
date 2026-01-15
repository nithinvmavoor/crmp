import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus = "CREATED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface IOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CREATED", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "CREATED",
      index: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

// Required index: Orders must be indexed by status and createdAt
OrderSchema.index({ status: 1, createdAt: -1 });

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
