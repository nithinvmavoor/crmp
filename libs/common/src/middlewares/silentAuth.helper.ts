import { createSilentAuthMiddleware } from "./silentAuth.middleware";

export const silentAuthMiddleware = (config: { AUTH_SERVICE_URL: string| undefined; JWT_SECRET: string| undefined; }) => {
  const authBaseUrl = config.AUTH_SERVICE_URL;
  const jwtSecret = config.JWT_SECRET;

  if (!authBaseUrl) {
    throw new Error("AUTH_SERVICE_URL is not configured");
  }

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return createSilentAuthMiddleware({
    authServiceRefreshUrl: `${authBaseUrl}/refresh-cookie`,
    jwtSecret,
    exposeHeaderToken: true,
  });
};
