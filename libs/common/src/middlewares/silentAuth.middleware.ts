import axios from "axios";
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { sendErrorResponse } from "../utils/response.util";

type SilentAuthConfig = {
  authServiceRefreshUrl: string; // ex: http://localhost:4001/refresh-cookie
  jwtSecret: string; // access token secret (same across services)
  exposeHeaderToken?: boolean; // default true
};

export const createSilentAuthMiddleware = (config: SilentAuthConfig) => {
  const exposeHeaderToken = config.exposeHeaderToken ?? true;

  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {

      const authHeader = req.headers.authorization;

      // 1) verify access token if provided
      if (authHeader && authHeader.startsWith("Bearer ")) {
        console.log('IN if');
        const token = authHeader.split(" ")[1];

        try {
          const decoded: any = jwt.verify(token, config.jwtSecret);
          req.user = decoded;
          return next();
        } catch (error: any) {
          console.log('IN catch');
          
          // If token is expired, fall through to refresh logic.
          if (error.name !== "TokenExpiredError") {
            return res.status(401).json({
              error: "Invalid access token. Please login again.",
            });
          }
        }
      }
      console.log('outside catch');

      // 2) fallback using refreshToken cookie
      const cookieHeader = req.headers.cookie || "";
      if (!cookieHeader) {
        console.log("Nocookieee");
        return sendErrorResponse(res, 401, "Unauthorized", "UNAUTHORIZED");
      }

      const refreshResp = await axios.post(
        config.authServiceRefreshUrl,
        {},
        {
          headers: { Cookie: cookieHeader },
          withCredentials: true,
        }
      );

      const newToken = refreshResp.data?.data?.token;
      if (!newToken) {
        console.log("API failed");
        return sendErrorResponse(res, 401, "Unauthorized", "UNAUTHORIZED");
      }

      // attach for current request
      req.headers.authorization = `Bearer ${newToken}`;
      req.user = jwt.decode(newToken) as any;

      // optional: expose token for frontend (if you want)
      if (exposeHeaderToken) {
        res.setHeader("x-access-token", newToken);
      }

      return next();
    } catch (error: any) {
      console.log(error.message);

      return sendErrorResponse(res, 401, "Unauthorized", "UNAUTHORIZED");
    }
  };
};
