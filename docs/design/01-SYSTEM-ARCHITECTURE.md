# System Architecture Design

## 1. Overview

The HRMS application is a multi-tenant SaaS platform built using a modern JavaScript/TypeScript stack. It follows a monorepo structure with separate frontend and backend applications sharing common packages.

**Primary deployment target:** shared or VPS hosting with **Plesk** (for example Hostinger), **without** AWS or other hyperscaler-specific services. The architecture stays **vendor-neutral**: the same application runs on any Linux box with Node.js, MySQL, a reverse proxy (Apache or NGINX as provided by the panel), and SMTP for mail.

**Multi-tenant model:** unchanged logically (tenant id on every row, subdomain or header for tenant resolution, configurable RBAC). **Multi-client / scale-out** is achieved by running more Node processes or more servers behind a load balancer when you outgrow a single box—still on generic VPS or dedicated hardware, not tied to AWS.

## 2. High-Level Architecture (Plesk / generic hosting)

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
│              (static build: JS/CSS served by Apache/NGINX in Plesk)          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS (same host or api subdomain)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REVERSE PROXY (Plesk: Apache or NGINX)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  • SSL termination (Let's Encrypt via Plesk)                                │
│  • /api/*  →  reverse proxy to Node (localhost:PORT)                        │
│  • /*      →  static files (dist) or SPA fallback                           │
│  • Optional: rate limits, request size limits, gzip                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Node.js on server)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Express.js API  +  PM2 (or Plesk Node.js app)                      │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐           │   │
│  │  │   Auth    │ │Recruitment│ │    HR     │ │  Employee │           │   │
│  │  └───────────┘ └───────────┘ └───────────┘ └───────────┘           │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐                         │   │
│  │  │   Exit    │ │  Config   │ │   Admin   │                         │   │
│  │  └───────────┘ └───────────┘ └───────────┘                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Prisma ORM  •  optional in-process / DB-backed jobs for email             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌──────────────────────┐ ┌──────────────────┐ ┌──────────────────────┐
│     DATA LAYER       │ │  OPTIONAL CACHE  │ │   FILE STORAGE       │
├──────────────────────┤ ├──────────────────┤ ├──────────────────────┤
│  ┌────────────────┐  │ │ If available:    │ │ ┌────────────────┐   │
│  │     MySQL      │  │ │ Redis (VPS add-on)│ │ │ Outside webroot│   │
│  │  (hosting DB)  │  │ │ OR skip: use     │ │ │ e.g. /var/hrms │   │
│  │                │  │ │ in-memory LRU +  │ │ │ /uploads       │   │
│  │ • tenant_id    │  │ │ MySQL for       │ │ │ • resumes      │   │
│  │ • all entities │  │ │ refresh tokens  │ │ │ • documents    │   │
│  │ • audit logs   │  │ │ (see auth doc)  │ │ │ Served via    │   │
│  └────────────────┘  │ └──────────────────┘ │ │ signed URLs   │   │
└──────────────────────┘                        │ └────────────────┘   │
                                                └──────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OUTBOUND EMAIL (SMTP)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  Hostinger / Plesk SMTP (or any provider): nodemailer or similar            │
│  No SES / SendGrid required; optional later if you add a transactional API  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**What this diagram implies**

- **No S3, no ElastiCache, no ALB:** files live on disk; cache and queues are optional or simplified.
- **Plesk** fronts TLS and routes traffic; **Node** runs the API (typically behind `127.0.0.1` with PM2 for restarts and clustering).
- **Multi-tenant** isolation remains in the application and database layer, not in the cloud account structure.

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
| Node.js | 20.x LTS | Runtime (LTS matches most Plesk Node selectors) |
| Express.js | 4.x | Web Framework |
| TypeScript | 5.x | Type Safety |
| Prisma | 5.x | ORM |
| MySQL | 8.x (or 5.7 per host) | Database (hosting panel DB) |
| JWT | - | Authentication |
| Zod | 3.x | Validation |
| Winston | 3.x | Logging |
| nodemailer (or equivalent) | - | SMTP email (no vendor lock-in) |

**Optional (when the host allows or on a VPS tier)**

| Technology | Purpose |
|------------|---------|
| Redis | Session / refresh token store, rate-limit counters, optional job queue |
| PM2 | Process manager: restarts, cluster mode, logs outside the panel |

**Intentionally omitted from the default stack**

| Not required | Reason |
|--------------|--------|
| AWS S3, MinIO cluster | Files on server disk + backups; S3-compatible only if you add it later |
| BullMQ / Redis-only queues | Start with synchronous or setImmediate-style email send + optional DB job table |
| Kubernetes | Not needed for Plesk/VPS; scale with PM2 or more VMs |

### 3.3 Infrastructure (Plesk / generic Linux, no hyperscaler)

| Layer | Typical implementation |
|-------|-------------------------|
| TLS / HTTP | Plesk-managed Apache or NGINX + Let's Encrypt |
| Static UI | `dist/` deployed under domain document root or subdomain |
| API | Node app on `127.0.0.1:PORT` reverse-proxied to `/api` or `api.` subdomain |
| Database | MySQL/MariaDB included with hosting |
| Files | Directory outside `public_html` (or non-public path) with app-generated signed download URLs |
| Email | SMTP credentials from the same host (or any SMTP you configure in Plesk) |
| Dev environment | Optional Docker Compose on developer machines only (not a production requirement) |

## 4. Project Structure (Monorepo)

```
hrms/
├── package.json                    # Root package.json (workspaces)
├── tsconfig.base.json             # Shared TypeScript config
├── .env.example                   # Environment variables template
├── docker-compose.yml             # Optional: local development only
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
│   │   │   │   ├── email/        # SMTP (e.g. nodemailer)
│   │   │   │   ├── storage/      # Local filesystem + signed URLs
│   │   │   │   └── jobs/         # Optional: DB-backed or in-process jobs
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
│ Apache/NGINX    │  ← Plesk: TLS, proxy to Node, static files
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

Refresh tokens can be stored in **Redis** (if installed) or in **MySQL** (hashed token rows) so a single Node instance remains stateless enough for horizontal scaling later. Diagram shows the optional Redis path.

```
┌─────────┐      ┌─────────┐      ┌─────────────┐      ┌─────────┐
│  Client │      │   API   │      │Redis or DB  │      │  MySQL  │
└────┬────┘      └────┬────┘      └──────┬──────┘      └────┬────┘
     │                │                  │                  │
     │  POST /login   │                  │                  │
     │───────────────>│                  │                  │
     │                │  Verify User     │                  │
     │                │─────────────────────────────────────>│
     │                │                  │    User Data     │
     │                │<─────────────────────────────────────│
     │                │                  │                  │
     │                │ Store refresh    │                  │
     │                │ (Redis or DB)    │                  │
     │                │─────────────────>│                  │
     │                │                  │                  │
     │  Access Token  │                  │                  │
     │  Refresh Token │                  │                  │
     │<───────────────│                  │                  │
     │                │                  │                  │
     │  API Request   │                  │                  │
     │  + Access Token│                  │                  │
     │───────────────>│                  │                  │
     │                │ Verify JWT       │                  │
     │                │ (stateless)      │                  │
     │                │────────┐         │                  │
     │                │        │         │                  │
     │                │<───────┘         │                  │
     │   Response     │                  │                  │
     │<───────────────│                  │                  │
```

## 7. Scalability Strategy (without AWS)

The product must scale **tenants and traffic** without assuming a hyperscaler. Strategy is staged: **vertical first**, then **more processes**, then **more servers**—all on ordinary VPS or dedicated hosts.

### 7.1 Single server (typical Plesk VPS)

- **MySQL:** tune `max_connections`, Prisma pool size, indexes on `tenant_id` composites (see database design).
- **Node:** **PM2 cluster** mode (`instances: max` or fixed N) behind one reverse proxy to use multiple CPU cores.
- **Static assets:** served by Apache/NGINX (not by Node) to keep the API process for API work only.
- **Uploads:** dedicated disk or partition; monitor inode and disk usage; compress or archive old files by policy.

### 7.2 Multi-tenant robustness (software, not cloud features)

- **Strict `tenant_id` on every query** and in JWT claims.
- **Idempotent writes** where it matters (webhooks, payments later).
- **Rate limiting:** start with in-memory per process; with multiple processes use **Redis** or **MySQL** counters so limits are global per tenant.
- **Background work:** Phase 1 = send email in-request or fire-and-forget with retry table in MySQL; Phase 2 = add Redis + worker only if volume requires it.

### 7.3 Horizontal scaling (still no AWS required)

When one machine is not enough:

1. **Second application server** (another VPS) running the same Node build, same `DATABASE_URL`, same upload path **or** shared storage (NFS, Gluster, or rsync for read-heavy static docs—document tradeoffs per client).
2. **Load balancer** in front: **HAProxy**, **NGINX**, or even **DNS round-robin** for coarse distribution (sessionless JWT helps).
3. **MySQL:** move to a managed MySQL on any provider **or** a dedicated DB VPS; read replicas optional when reporting load appears.
4. **Files:** if multiple app nodes, you need **shared filesystem** or **single “file writer” node** until you deliberately add S3-compatible storage (still not AWS-specific—any provider).

### 7.4 Database scaling (practical order)

- Indexes and query review first.
- Larger VPS or dedicated MySQL host second.
- Read replica or replica for reporting third (any host that runs MySQL).

### 7.5 Caching strategy

| Cache Type | Default (no Redis) | With Redis |
|------------|-------------------|------------|
| Tenant config | In-process LRU, short TTL | Shared Redis, 5 min |
| User permissions | In-process + JWT claims | Redis optional |
| Menu items | In-process, 1 hour | Redis optional |
| Refresh tokens | MySQL table | Redis preferred |
| Rate limits | Per-process | Global per tenant |

### 7.6 Multi-client (your customers) vs multi-tenant

- **Tenant** = one organization using the HRMS (`tenant_id` in DB, subdomain).
- **You as vendor** may run **one deployment serving many tenants** (true SaaS) or **one deployment per enterprise client** (separate VPS per client). The codebase is the same; only deployment topology and database isolation level change (shared DB vs per-client database is a deployment choice documented in [Multi-Tenancy](./11-MULTI-TENANCY.md)).

## 8. Security Measures

### 8.1 Authentication

- JWT access tokens (15 min expiry)
- Refresh tokens: **Redis** (preferred if available) **or MySQL** (always possible on Plesk)
- HttpOnly cookies for refresh tokens when using browser-first flows
- Token rotation on refresh

### 8.2 Authorization

- RBAC enforced at API level
- Tenant isolation on all queries
- Row-level security for sensitive data

### 8.3 Data Protection

- TLS via Plesk (Let's Encrypt or commercial cert)
- Bcrypt for password hashing (cost factor 12)
- Encrypt highly sensitive columns at application level if required (keys from env, not from code)
- PII data masking in logs

### 8.4 Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Login | 5 requests / 15 min |
| Password Reset | 3 requests / hour |
| API (authenticated) | 100 requests / min |
| File Upload | 10 requests / min |

Implement with `express-rate-limit` and a **store** that matches your deployment: memory for single process, **Redis or MySQL** when PM2 cluster or multiple nodes are used.

## 9. Deployment Strategy (Plesk / Hostinger class)

### 9.1 Environments

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| Development | Local | Node + local MySQL; optional Docker Compose |
| Staging | QA | Small VPS or subdomain on same server |
| Production | Live | Plesk VPS or any Linux + panel |

### 9.2 Production layout (recommended)

1. **Create MySQL database and user** in Plesk; set `DATABASE_URL` in the Node app environment (Plesk “Node.js” → environment variables).
2. **Build frontend:** `npm run build` → upload `dist/` to the domain’s `httpdocs` (or a subdomain like `app.`).
3. **Deploy API:** upload built server (or `git pull` on server), `npm ci --omit=dev`, `npx prisma migrate deploy`, start with **PM2** or Plesk’s **Node.js** application pointing at `server.js` / `dist/index.js`.
4. **Reverse proxy:** map `https://yourdomain.com/api` → `http://127.0.0.1:3001` (exact port from Plesk).
5. **Uploads directory:** create e.g. `/var/hrms-uploads` with correct Unix owner (the SSH user that runs Node), **not** world-readable; app serves files only via authenticated routes or signed URLs.
6. **SMTP:** configure outbound mail in Plesk; put host, port, user, password in env vars for nodemailer.

### 9.3 CI/CD (optional)

Any Git host (GitHub, GitLab, self-hosted) can run **SSH deploy**: on push, rsync or `git pull` on the VPS and `pm2 reload`. No AWS CodePipeline required.

### 9.4 Docker (optional, not production default)

Docker Compose remains useful **on developer laptops** to spin up MySQL quickly. Production on Plesk typically runs **native Node + PM2**, not containers, unless you explicitly choose a Docker-capable VPS.

```yaml
# docker-compose.yml — DEVELOPMENT ONLY (example)
services:
  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: dev
      MYSQL_DATABASE: hrms
    ports:
      - "3306:3306"
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
- Background job duration (when you add a job table or worker)

### 10.3 Alerting

- Email to ops address on uncaught exceptions (via SMTP)
- Optional: UptimeRobot or similar **external** ping (not AWS-specific)
- Disk and MySQL alerts from **Plesk** or hosting panel where available

## 11. Disaster Recovery

### 11.1 Backup Strategy (panel-friendly)

| Data | Method | Retention |
|------|--------|-----------|
| MySQL | Plesk scheduled backup or `mysqldump` cron | Per policy (e.g. 30 days) |
| Upload directory | Same backup job or `tar`/`rsync` to second disk | Per policy |
| Application code | Git remote (GitHub, etc.) | Indefinite |

### 11.2 Recovery Objectives

- **RPO / RTO:** set per client SLA; Plesk daily backups often yield RPO ≈ 24 h unless you add more frequent DB dumps.

---

## 12. Summary

| Goal | Approach |
|------|----------|
| Simple hosting | Plesk + Node + MySQL + SMTP + local disk |
| Multi-tenant | `tenant_id`, subdomain resolution, strict queries |
| Robust | PM2, migrations, backups, rate limits, structured logs |
| Scale later | PM2 cluster → more VPS → LB → optional Redis → optional shared storage |

---

## Next Steps

1. Review and approve this architecture
2. Align [Multi-Tenancy](./11-MULTI-TENANCY.md) deployment examples with “VPS + Plesk” if you want panel-specific screenshots later
3. Proceed to [Database Design](./02-DATABASE-DESIGN.md)
