import { CouponModel } from "../models/coupon.model";

export const couponRepository = {
    findByCode: (code: string) => CouponModel.findOne({ code }).lean(),
    create: (data: any) => CouponModel.create(data),
};
