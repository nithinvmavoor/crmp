import { OrderModel } from "../models/order.model";

export const orderRepository = {
    create: (data: any) => OrderModel.create(data),
    findByIdLean: (id: string) => OrderModel.findById(id).lean(),
};
