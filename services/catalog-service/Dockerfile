FROM node:22-alpine AS builder
WORKDIR /app

COPY libs/common ./libs/common
COPY services/catalog-service ./services/catalog-service

WORKDIR /app/libs/common
RUN npm install
RUN npm run build

WORKDIR /app/services/catalog-service
RUN npm install
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

# Copy service runtime deps
COPY --from=builder /app/services/catalog-service/node_modules ./node_modules
COPY --from=builder /app/services/catalog-service/package.json ./package.json
COPY --from=builder /app/services/catalog-service/dist ./dist

# ✅ FIX: vendor common library into node_modules to avoid broken symlink
RUN rm -rf ./node_modules/@crmp \
    && mkdir -p ./node_modules/@crmp/common
COPY --from=builder /app/libs/common/package.json ./node_modules/@crmp/common/package.json
COPY --from=builder /app/libs/common/dist ./node_modules/@crmp/common/dist

EXPOSE 4002
CMD ["node", "dist/server.js"]
