FROM node:22-alpine
WORKDIR /app

COPY frontend-web/package*.json ./
RUN npm ci

COPY frontend-web ./

EXPOSE 5173

# Vite must listen on 0.0.0.0 inside container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
