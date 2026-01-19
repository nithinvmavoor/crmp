import type { Request } from "express-serve-static-core";
import type { UserRole } from "./roles";

export type JwtUser = {
  userId: string;
  email: string;
  role: UserRole;
};

export type AuthRequest = Request & {
  user?: JwtUser;
};
