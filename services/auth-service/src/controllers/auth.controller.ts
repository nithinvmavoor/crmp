import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { AUTH_HEADERS, COOKIE_OPTIONS } from "../constants/auth.constants";

export const authController = {
  register: async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: result,
      error: null,
    });
  },

  login: async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    // set refresh token in cookie
    res.cookie(AUTH_HEADERS.REFRESH_TOKEN, result.refreshToken, COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      data: result,
      error: null,
    });
  },

  refresh: async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    const result = await authService.refreshToken(refreshToken);
    res.status(201).json({
      success: true,
      data: result,
      error: null,
    });
  },
};
