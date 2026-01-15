import { Response } from "express";

/**
 * Standardized error response utility function
 * @param res Express response object
 * @param statusCode HTTP status code
 * @param message Error message string
 * @param code Error code string
 * @returns Express response with error JSON
 */
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  code: string
): Response => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: { message, code },
  });
};
