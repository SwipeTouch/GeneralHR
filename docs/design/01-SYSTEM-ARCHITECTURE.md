# System Architecture (Minimal Scope)

## 1. Overview

**GeneralHR (minimal)** is a multi-tenant web app on **React + Express + MySQL**, deployable on **Plesk / Hostinger-class VPS** (no AWS required).

Three logical areas:

| Area | Purpose |
|------|---------|
| **Recruitment** | Store candidates, status, comments; offered candidates upload documents |
| **Staff** | Employee master, attendance, salary structure |
| **Payroll bridge** | Sync/hand off to existing **PHP payroll** system |

## 2. Architecture diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Browsers                                                        │
│  • Admin / HR app (React)                                        │
│  • Candidate upload portal (React, limited login)                │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Plesk: Apache / NGINX                                           │
│  • Static React build                                            │
│  • /api → Node (127.0.0.1:PORT)                                  │
└────────────────────────────┬────────────────────────────────────┘
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Express API (Node.js + TypeScript + Prisma)                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ Recruitment │ │   Staff     │ │ Compensation│ │  Payroll   │ │
│  │  module     │ │  + Attend.  │ │   module    │ │  adapter   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │
└────────────┬───────────────────────────────┬────────────────────┘
             │                               │
             ▼                               ▼
    ┌────────────────┐              ┌────────────────┐
    │ MySQL          │              │ File storage   │
    │ (tenant-scoped)│              │ /uploads       │
    └────────────────┘              └────────────────┘
             │
             │  optional HTTP / webhook
             ▼
    ┌────────────────┐
    │ PHP Payroll    │  (existing system — out of repo)
    │ (per tenant)   │
    └────────────────┘
```

## 3. Technology stack

| Layer | Choice |
|-------|--------|
| Frontend | React 18, TypeScript, Vite, Ant Design |
| Backend | Node 20 LTS, Express, Prisma |
| Database | MySQL / MariaDB (hosting panel) |
| Files | Local disk outside web root; served via API |
| Email | SMTP (upload notification to HR/admin) |
| Process | PM2 or Plesk Node.js |
| Payroll | **Adapter interface** → PHP system via HTTP API (tenant-configured base URL + credentials) |

**Not in scope:** Redis, job queues, S3, workflow engines, leave/exit modules.

## 4. Portals / roles

| Role | Access |
|------|--------|
| **System admin** | Tenants, users, salary heads (structure), payroll adapter config |
| **HR / Admin** | Candidates CRUD, status, comments, export, view uploads, unlock uploads |
| **Candidate (offered)** | Upload documents only (after invite / portal access for that candidate) |

## 5. Multi-tenancy

- Every business table includes `tenant_id`.
- Login resolves tenant (subdomain or header).
- PHP payroll base URL and API keys are **per tenant** in settings.

## 6. Deployment (unchanged principle)

- Build React → `httpdocs`
- Run API behind reverse proxy
- `DATABASE_URL`, `UPLOAD_DIR`, `SMTP_*`, `PAYROLL_PHP_BASE_URL` in environment
- Backups: MySQL + upload folder via Plesk

## 7. What was removed vs v1

See [archive](../archive/v1-full-hrms/): workflows, cases, interviews, offers engine, leave, exit, lifetime portal, granular RBAC matrix, configurable entity engine.
