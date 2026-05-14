# System Architecture Design

## 1. Overview

The HRMS application is a multi-tenant SaaS platform built using a modern JavaScript/TypeScript stack. It follows a monorepo structure with separate frontend and backend applications sharing common packages.

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  Recruitment │ │  HR Portal   │ │   Employee   │ │  Candidate   │       │
│  │    Portal    │ │              │ │    Portal    │ │    Portal    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│                         ┌──────────────┐                                    │
│                         │   Lifetime   │                                    │
│                         │    Portal    │                                    │
│                         └──────────────┘                                    │
│                                                                             │
│                    React + TypeScript + Ant Design                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     NGINX / Load Balancer                            │   │
│  │  • SSL Termination  • Rate Limiting  • Request Routing               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          APPLICATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Express.js API Server                             │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │   Auth    │ │Recruitment│ │    HR     │ │  Employee │           │   │
│  │  │  Module   │ │  Module   │ │  Module   │ │   Module  │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐                         │   │
│  │  │   Exit    │ │  Config   │ │   Admin   │                         │   │
│  │  │  Module   │ │  Module   │ │   Module  │                         │   │
│  │  └───────────┘ └───────────┘ └───────────┘                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                    Node.js + TypeScript + Prisma ORM                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│     DATA LAYER       │ │   CACHE LAYER    │ │   STORAGE LAYER      │
├──────────────────────┤ ├──────────────────┤ ├──────────────────────┤
│  ┌────────────────┐  │ │ ┌──────────────┐ │ │ ┌────────────────┐   │
│  │     MySQL      │  │ │ │    Redis     │ │ │ │    AWS S3      │   │
│  │    Database    │  │ │ │    Cache     │ │ │ │   / MinIO      │   │
│  │                │  │ │ │              │ │ │ │                │   │
│  │ • Tenant Data  │  │ │ │ • Sessions   │ │ │ │ • Documents    │   │
│  │ • All Entities │  │ │ │ • Cache      │ │ │ │ • Resumes      │   │
│  │ • Audit Logs   │  │ │ │ • Job Queue  │ │ │ │ • Templates    │   │
│  └────────────────┘  │ │ └──────────────┘ │ │ └────────────────┘   │
└──────────────────────┘ └──────────────────┘ └──────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKGROUND SERVICES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐                   │
│  │   Email   │ │Notification│ │  Report   │ │  Cleanup  │                   │
│  │  Worker   │ │   Worker   │ │  Worker   │ │  Worker   │                   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘                   │
│                                                                             │
│                         BullMQ (Redis-based)                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 5.x | Build Tool |
| Ant Design | 5.x | UI Component Library |
| Zustand | 4.x | State Management |
| React Router | 6.x | Routing |
| React Query | 5.x | Server State Management |
| Axios | 1.x | HTTP Client |
| Day.js | 1.x | Date Handling |

### 3.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| Express.js | 4.x | Web Framework |
| TypeScript | 5.x | Type Safety |
| Prisma | 5.x | ORM |
| MySQL | 8.x | Database |
| Redis | 7.x | Cache & Queue |
| BullMQ | 4.x | Job Queue |
| JWT | - | Authentication |
| Zod | 3.x | Validation |
| Winston | 3.x | Logging |

### 3.3 Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local Development |
| NGINX | Reverse Proxy / Load Balancer |
| AWS S3 / MinIO | File Storage |
| SendGrid / AWS SES | Email Service |

## 4. Project Structure (Monorepo)

```
hrms/
├── package.json                    # Root package.json (workspaces)
├── tsconfig.base.json             # Shared TypeScript config
├── .env.example                   # Environment variables template
├── docker-compose.yml             # Local development setup
│
├── packages/                      # Shared packages
│   ├── core/                      # Shared types, constants, utilities
│   │   ├── src/
│   │   │   ├── types/            # TypeScript interfaces
│   │   │   ├── constants/        # Shared constants
│   │   │   └── utils/            # Utility functions
│   │   └── package.json
│   │
│   └── ui-components/            # Shared React components (optional)
│       ├── src/
│       └── package.json
│
├── apps/
│   ├── api/                      # Express Backend
│   │   ├── src/
│   │   │   ├── modules/          # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   ├── recruitment/
│   │   │   │   ├── hr/
│   │   │   │   ├── employee/
│   │   │   │   ├── exit/
│   │   │   │   ├── config/
│   │   │   │   └── admin/
│   │   │   ├── middleware/       # Express middleware
│   │   │   ├── shared/           # Shared services
│   │   │   │   ├── database/
│   │   │   │   ├── email/
│   │   │   │   ├── storage/
│   │   │   │   └── queue/
│   │   │   └── app.ts            # Express app setup
│   │   ├── prisma/
│   │   │   ├── schema.prisma     # Database schema
│   │   │   ├── migrations/       # Database migrations
│   │   │   └── seed.ts           # Seed data
│   │   └── package.json
│   │
│   └── web/                      # React Frontend
│       ├── src/
│       │   ├── modules/          # Feature modules
│       │   │   ├── auth/
│       │   │   ├── recruitment/
│       │   │   ├── hr/
│       │   │   ├── employee/
│       │   │   ├── exit/
│       │   │   ├── candidate/
│       │   │   ├── lifetime/
│       │   │   └── admin/
│       │   ├── shared/           # Shared components
│       │   │   ├── components/
│       │   │   ├── hooks/
│       │   │   ├── contexts/
│       │   │   ├── layouts/
│       │   │   └── utils/
│       │   ├── config/           # App configuration
│       │   ├── services/         # API service layer
│       │   └── App.tsx
│       ├── public/
│       └── package.json
│
├── tenant-configs/               # Per-tenant configurations
│   └── default/
│       └── config.json
│
└── docs/                         # Documentation
    ├── design/                   # Design documents
    └── api/                      # API documentation
```

## 5. Module Structure

### 5.1 Backend Module Pattern

Each backend module follows this structure:

```
modules/recruitment/
├── recruitment.controller.ts     # HTTP request handlers
├── recruitment.service.ts        # Business logic
├── recruitment.repository.ts     # Database operations
├── recruitment.routes.ts         # Route definitions
├── recruitment.validator.ts      # Request validation (Zod)
├── recruitment.types.ts          # Module-specific types
└── index.ts                      # Module exports
```

### 5.2 Frontend Module Pattern

Each frontend module follows this structure:

```
modules/recruitment/
├── components/                   # Module components
│   ├── CaseList.tsx
│   ├── CaseDetail.tsx
│   ├── CaseKanban.tsx
│   └── ...
├── pages/                        # Page components
│   ├── DashboardPage.tsx
│   ├── CasesPage.tsx
│   └── ...
├── hooks/                        # Module hooks
│   ├── useCases.ts
│   ├── useCase.ts
│   └── ...
├── services/                     # API calls
│   └── recruitment.service.ts
├── store/                        # Module state (if needed)
│   └── recruitment.store.ts
├── types/                        # Module types
│   └── index.ts
└── index.ts                      # Module exports
```

## 6. Data Flow

### 6.1 Request Flow

```
Client Request
      │
      ▼
┌─────────────────┐
│   NGINX/LB      │  ← SSL Termination, Rate Limiting
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Middleware│  ← JWT Validation, Token Refresh
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│Tenant Middleware│  ← Tenant Resolution from subdomain/header
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ RBAC Middleware │  ← Permission Check
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Validator     │  ← Request Validation (Zod)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │  ← HTTP Layer
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │  ← Business Logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │  ← Data Access (Prisma)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │  ← MySQL
└─────────────────┘
```

### 6.2 Authentication Flow

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│  Client │      │   API   │      │  Redis  │      │  MySQL  │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │  POST /login   │                │                │
     │───────────────>│                │                │
     │                │  Verify User   │                │
     │                │───────────────────────────────>│
     │                │                │    User Data   │
     │                │<───────────────────────────────│
     │                │                │                │
     │                │ Store Refresh  │                │
     │                │───────────────>│                │
     │                │                │                │
     │  Access Token  │                │                │
     │  Refresh Token │                │                │
     │<───────────────│                │                │
     │                │                │                │
     │  API Request   │                │                │
     │  + Access Token│                │                │
     │───────────────>│                │                │
     │                │ Verify JWT     │                │
     │                │────────┐       │                │
     │                │        │       │                │
     │                │<───────┘       │                │
     │                │                │                │
     │   Response     │                │                │
     │<───────────────│                │                │
     │                │                │                │
```

## 7. Scalability Strategy

### 7.1 Horizontal Scaling

- **Stateless API Servers**: No session state stored in memory
- **Load Balancer**: NGINX distributes traffic across multiple API instances
- **Database Connection Pooling**: Prisma manages connection pool
- **Redis Cluster**: For session and cache scaling

### 7.2 Database Scaling

- **Read Replicas**: For reporting and read-heavy operations
- **Connection Pooling**: PgBouncer or Prisma's built-in pooling
- **Query Optimization**: Proper indexing, query analysis
- **Archival Strategy**: Old audit logs moved to cold storage

### 7.3 Caching Strategy

| Cache Type | TTL | Purpose |
|------------|-----|---------|
| Tenant Config | 5 min | Branding, features, settings |
| User Permissions | 5 min | RBAC permissions |
| Menu Items | 1 hour | Navigation menu |
| Static Data | 1 hour | Departments, designations, etc. |
| Session | 15 min | User session data |

## 8. Security Measures

### 8.1 Authentication

- JWT access tokens (15 min expiry)
- Refresh tokens stored in Redis (7 day expiry)
- HttpOnly cookies for refresh tokens
- Token rotation on refresh

### 8.2 Authorization

- RBAC enforced at API level
- Tenant isolation on all queries
- Row-level security for sensitive data

### 8.3 Data Protection

- TLS 1.3 for all communications
- Bcrypt for password hashing (cost factor 12)
- AES-256 encryption for sensitive data at rest
- PII data masking in logs

### 8.4 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Login | 5 requests / 15 min |
| Password Reset | 3 requests / hour |
| API (authenticated) | 100 requests / min |
| File Upload | 10 requests / min |

## 9. Deployment Strategy

### 9.1 Environments

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| Development | Local development | Docker Compose |
| Staging | QA, UAT | Single server |
| Production | Live system | Multi-server / K8s |

### 9.2 CI/CD Pipeline

```
Code Push → Lint/Test → Build → Deploy to Staging → Manual Approval → Deploy to Production
```

### 9.3 Docker Setup

```yaml
# docker-compose.yml (simplified)
services:
  api:
    build: ./apps/api
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL
      - REDIS_URL
    depends_on:
      - mysql
      - redis

  web:
    build: ./apps/web
    ports:
      - "3000:3000"

  mysql:
    image: mysql:8
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
```

## 10. Monitoring & Logging

### 10.1 Application Logs

- Structured JSON logging (Winston)
- Log levels: error, warn, info, debug
- Request ID for tracing
- Sensitive data redaction

### 10.2 Metrics

- API response times
- Error rates
- Database query times
- Queue job processing times

### 10.3 Alerting

- API error rate > 1%
- Response time > 500ms (p95)
- Database connection failures
- Queue job failures

## 11. Disaster Recovery

### 11.1 Backup Strategy

| Data | Frequency | Retention |
|------|-----------|-----------|
| Database | Daily | 30 days |
| File Storage | Daily | 90 days |
| Audit Logs | Daily | 1 year |

### 11.2 Recovery Objectives

- **RPO (Recovery Point Objective)**: 24 hours
- **RTO (Recovery Time Objective)**: 4 hours

---

## Next Steps

1. Review and approve this architecture
2. Proceed to [Database Design](./02-DATABASE-DESIGN.md)
