import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "ADMIN" | "STAFF" | "CUSTOMER";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "STAFF", "CUSTOMER"], default: "CUSTOMER" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
