# ----------------------------
# Builder
# ----------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY libs/common ./libs/common
COPY services/auth-service ./services/auth-service

# Build common
WORKDIR /app/libs/common
RUN npm install
RUN npm run build

# Install + build auth-service
WORKDIR /app/services/auth-service
RUN npm install
RUN npm run build


# ----------------------------
# Runtime
# ----------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

# Copy service runtime deps
COPY --from=builder /app/services/auth-service/node_modules ./node_modules
COPY --from=builder /app/services/auth-service/package.json ./package.json
COPY --from=builder /app/services/auth-service/dist ./dist

# ✅ FIX: vendor common library into node_modules to avoid broken symlink
RUN rm -rf ./node_modules/@crmp \
    && mkdir -p ./node_modules/@crmp/common
COPY --from=builder /app/libs/common/package.json ./node_modules/@crmp/common/package.json
COPY --from=builder /app/libs/common/dist ./node_modules/@crmp/common/dist

EXPOSE 4001
CMD ["node", "dist/server.js"]
    