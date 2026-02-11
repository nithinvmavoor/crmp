import { sendErrorResponse } from "@crmp/common";
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";


export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];

        return sendErrorResponse(
            res,
            400,
            firstError.msg,
            "VALIDATION_ERROR"
        );
    }

    next();
};
