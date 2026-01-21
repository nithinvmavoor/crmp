export const env = {
    CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS ?? 120),
    CATALOG_SERVICE_URL: process.env.CATALOG_SERVICE_URL ?? "http://127.0.0.1:4002",
    NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL ?? "http://127.0.0.1:4004",
};
