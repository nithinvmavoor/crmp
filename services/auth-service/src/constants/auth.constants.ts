export const AUTH_HEADERS = {
    REFRESH_TOKEN: "refreshToken",
    ACCESS_TOKEN: "authorization", // optional
};

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    // 7 days in milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/", // available to all routes
};