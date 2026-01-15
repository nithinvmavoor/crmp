import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  price: number;
  category: string;
  description?: string;
  isAvailable: boolean;
  createdAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String },
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// required index
MenuItemSchema.index({ category: 1 });

export const MenuItemModel = mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
