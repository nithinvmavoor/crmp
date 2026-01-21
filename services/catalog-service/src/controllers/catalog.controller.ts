import { Request, Response } from "express";
import { sendErrorResponse, logger } from "@crmp/common";
import { catalogService } from "../services/catalog.service";
import { ApiError } from "@crmp/common";

type ItemsByIdsBody = {
  ids: string[];
};

export const catalogController = {
  getItems: async (req: Request, res: Response) => {
    const category = req.query.category as string | undefined;

    const items = await catalogService.getItems(category);

    return res.json({
      success: true,
      data: items,
      error: null,
    });
  },
  createItem: async (req: Request, res: Response) => {
    const item = await catalogService.createItem(req.body);

    return res.status(201).json({
      success: true,
      data: item,
      error: null,
    });

  },
  getItemsByIds: async (req: Request, res: Response) => {
    const body = req.body as ItemsByIdsBody;

    const items = await catalogService.getItemsByIds(body?.ids);

    return res.json({
      success: true,
      data: items,
      error: null,
    });
  }
}