import { UserModel } from "../models/user.model";

export const userRepository = {
    findByEmail: (email: string) => UserModel.findOne({ email }),
    findById: (id: string) => UserModel.findById(id),
    create: (data: any) => UserModel.create(data),
};
