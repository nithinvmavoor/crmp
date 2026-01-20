import jwt from "jsonwebtoken";

export const createAccessToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "", { expiresIn: "15m" });
};

export const createRefreshToken = (payload: object) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || "", { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "");
};
