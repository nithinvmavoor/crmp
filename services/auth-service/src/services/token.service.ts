import jwt, { SignOptions } from "jsonwebtoken";
import { ApiError } from "@crmp/common";

export const tokenService = {

    signAccessToken: (payload: object) =>
        jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] }),

    signRefreshToken: (payload: object) =>
        jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" }),

    verifyRefreshToken: (token: string) => {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
        } catch {
            throw new ApiError(401, "Invalid refresh token");
        }
    },
};
