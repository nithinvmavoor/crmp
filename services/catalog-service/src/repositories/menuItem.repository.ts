import { MenuItemModel } from "../models/menuItem.model";
import mongoose from "mongoose";

export type MenuItemCreateInput = {
    name: string;
    price: number;
    category: string;
    description?: string;
    isAvailable?: boolean;
};

export const menuItemRepository = {
    findAll: (filter: any) => MenuItemModel.find(filter).lean(),

    create: (input: MenuItemCreateInput) => MenuItemModel.create(input),

    findByIds: (ids: mongoose.Types.ObjectId[]) =>
        MenuItemModel.find({ _id: { $in: ids } })
            .select("name price category isAvailable")
            .lean(),
};
