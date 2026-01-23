import { ApiError } from "@crmp/common";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

export const authService = {
    register: async (payload: { email: string; password: string; role: any; }) => {
        const existing = await userRepository.findByEmail(payload.email);
        if (existing) throw new ApiError(409, "User already exists");

        const hashed = await passwordService.hash(payload.password);

        const user = await userRepository.create({
            email: payload.email,
            passwordHash: hashed,
        });

        //const accessToken = tokenService.signAccessToken({ userId: user.id, role: user.role });
        //const refreshToken = tokenService.signRefreshToken({ userId: user.id });

        return { user };
    },

    login: async ({ email, password }: { email: string; password: string; }) => {
        const user = await userRepository.findByEmail(email);
        if (!user) throw new ApiError(401, "Invalid credentials");

        const valid = await passwordService.compare(password, user.passwordHash);
        if (!valid) throw new ApiError(401, "Invalid credentials");

        const accessToken = tokenService.signAccessToken({ userId: user.id, role: user.role, email: user.email });
        const refreshToken = tokenService.signRefreshToken({ userId: user.id, email: user.email });

        return { user, token: accessToken, refreshToken };
    },

    refreshToken: async (refreshToken: string) => {
        const payload = tokenService.verifyRefreshToken(refreshToken);
        const user = await userRepository.findById(payload.userId);
        if (!user) throw new ApiError(401, "Invalid refresh token");

        const newAccessToken = tokenService.signAccessToken({ userId: user.id, role: user.role, email: user.email });
        return { token: newAccessToken, user };
    },
};
