export type JwtPayload = {
  userId: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CUSTOMER";
  exp: number;
};

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};
