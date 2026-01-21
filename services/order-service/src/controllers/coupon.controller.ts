import { Request, Response } from "express";
import { couponService } from "../services/coupon.service";


export const couponController = {
  createCoupon: async (req: Request, res: Response) => {
    const coupon = await couponService.createCoupon(req.body);

    return res.status(201).json({
      success: true,
      data: coupon,
      error: null,
    });
  }
}