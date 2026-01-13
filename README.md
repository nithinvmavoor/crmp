# Cloud-Native Restaurant Management Platform (CRMP)

CRMP is a cloud-native microservices platform built to gain hands-on experience in:
- Microservices architecture (service separation + SRP)
- Backend + Frontend development
- JWT Authentication (AuthN) & Role-Based Authorization (AuthZ)
- Docker + containerized local development
- MongoDB schema design + startup index creation
- Redis caching + async queue processing
- Environment separation (Dev / QA / Prod)
- AWS Deployment (ECS Fargate, ECR, ALB, Secrets Manager, CloudWatch, ElastiCache Redis)
- Observability, scaling, and performance tuning

---

## 1) Microservices

| Service | Responsibility |
|--------|-----------------|
| **auth-service** | Authentication & Authorization only |
| **catalog-service** | Menu management only |
| **order-service** | Order lifecycle only |
| **notification-service** | Async notifications only |
| **frontend-web** | UI only |

---

## 2) Architecture & Rules

### Single Responsibility (SRP)
Each microservice handles **only its own bounded context**.  
No service should contain logic that belongs to another service.

### Service Communication
- REST over HTTP between services (internal network in Docker / AWS)
- Notification processing is async using Redis-based queue

---

## 3) Common Conventions (Must Follow)

### 3.1 API Response Format (All Services)

All APIs must return responses using the same standard structure.

**✅ Success response**
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

**❌ Error response**
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

---

### 3.2 Error Format & Standard Error Codes

All services must use this error structure:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

**Recommended error codes**

| Code | Meaning |
|------|--------|
| `VALIDATION_ERROR` | Request input is invalid |
| `UNAUTHORIZED` | Missing/invalid JWT |
| `FORBIDDEN` | JWT valid but role not allowed |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Duplicate values (e.g., email already exists) |
| `INTERNAL_ERROR` | Unexpected server failure |

---

### 3.3 Logging Format (JSON logs only)

All logs must be **structured JSON** (no plain text logs) so they can be searched and monitored in CloudWatch later.

**✅ Example request log**
```json
{
  "level": "info",
  "service": "catalog-service",
  "route": "/items",
  "method": "GET",
  "statusCode": 200,
  "durationMs": 41,
  "cacheHit": true,
  "time": "2026-01-13T12:00:00.000Z"
}
```

**❌ Example error log**
```json
{
  "level": "error",
  "service": "order-service",
  "route": "/orders",
  "method": "POST",
  "statusCode": 500,
  "errorCode": "INTERNAL_ERROR",
  "errorMessage": "Database connection failed",
  "time": "2026-01-13T12:00:00.000Z"
}
```

---

## 4) Authentication & Authorization

### Authentication (AuthN)
- Email + password based login
- JWT token returned on login

### Authorization (AuthZ)
Role-Based Access Control (RBAC) with roles:
- `ADMIN`
- `STAFF`
- `CUSTOMER`

JWT is mandatory for all APIs except:
- `POST /register`
- `POST /login`

**✅ Rule**
- Only `ADMIN` can create menu items (`POST /items`)

---

## 5) API Specification

### Auth Service

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/register` | Public |
| POST | `/login` | Public |

### Catalog Service

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/items` | Any authenticated user |
| POST | `/items` | `ADMIN` only |

### Order Service

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/orders` | Any authenticated user |
| GET | `/orders/:id` | Any authenticated user |

### Notification Service

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/notify` | Async only (queue) |

---

## 6) Database & Indexing (MongoDB)

MongoDB is used across services.  
Each service must ensure indexes are created on startup.

### Required Indexes

**Orders indexed by**
- `status`
- `createdAt`

Example:
```js
db.orders.createIndex({ status: 1, createdAt: -1 })
```

**Menu items indexed by**
- `category`

Example:
```js
db.menuItems.createIndex({ category: 1 })
```

---

## 7) Redis Usage

Redis is used for:
1. Caching menu items
2. Caching frequently accessed orders
3. Async queue (notification service)

### Cache KPIs
- Redis cache hit ratio > 80%
- Menu API latency < 100ms
- Order creation < 400ms
- Error rate < 1%

---

## 8) Environments (Dev / QA / Prod)

The system supports:
- Dev
- QA
- Prod

Each environment must have:
- Separate Mongo database
- Separate ECS services
- Isolated configuration
- No hardcoded secrets

---

## 9) Local Development (Docker)

### Prerequisites
- Node.js 22+
- Docker Desktop + Docker Compose
- WSL2 recommended on Windows

### Start all services
From `infra/`:
```bash
docker compose up --build
```

### Stop all services
```bash
docker compose down
```

### Health Checks
```bash
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
curl http://localhost:4004/health
```

---

## 10) Cloud Deployment (AWS)

AWS services planned:
- ECS Fargate
- ECR
- Application Load Balancer (path-based routing)
- Secrets Manager
- CloudWatch Logs & Metrics
- ElastiCache Redis
- MongoDB Atlas

### ALB Path Routing

| Route | Service |
|------|---------|
| `/auth/*` | auth-service |
| `/catalog/*` | catalog-service |
| `/order/*` | order-service |
| `/notify/*` | notification-service |
| `/` | frontend-web |

---
