# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime stage
FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev

ENV NODE_ENV=production
EXPOSE 4001

CMD ["node", "dist/server.js"]
