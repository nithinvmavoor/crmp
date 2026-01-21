import { Response } from "express";
import { ApiError, AuthRequest } from "@crmp/common";
import { orderService } from "../services/order.service";


export const orderController = {
  createOrder: async (req: AuthRequest, res: Response) => {
    const customerId = req.user?.userId;
    if (!customerId) throw new ApiError(401, "Invalid user");

    const token = req.headers.authorization; // forward token

    const order = await orderService.createOrder(customerId, req.body, token);

    return res.status(201).json({
      success: true,
      data: order,
      error: null,
    });
  },
  getOrderById: async (req: AuthRequest, res: Response) => {
    const customerId = req.user?.userId;
    if (!customerId) throw new ApiError(401, "Invalid user");

    const order = await orderService.getOrderById(req.params.id as string, customerId);

    return res.json({
      success: true,
      data: order,
      error: null,
    });
  }
}
