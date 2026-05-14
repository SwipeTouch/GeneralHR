# Project Structure

## Overview

This document outlines the complete folder and file organization for the HRMS application monorepo.

## Root Structure

```
hrms/
├── .github/                          # GitHub workflows and templates
│   ├── workflows/
│   │   ├── ci.yml                   # CI pipeline
│   │   └── deploy.yml               # Deployment pipeline
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                             # Documentation
│   ├── design/                       # Design documents
│   │   ├── 00-INDEX.md
│   │   ├── 01-SYSTEM-ARCHITECTURE.md
│   │   ├── 02-DATABASE-DESIGN.md
│   │   ├── 03-API-DESIGN.md
│   │   ├── 04-AUTH-RBAC-DESIGN.md
│   │   ├── 05-RECRUITMENT-MODULE.md
│   │   ├── 06-HR-MODULE.md
│   │   ├── 07-EMPLOYEE-PORTAL.md
│   │   ├── 08-EXIT-MODULE.md
│   │   ├── 09-CONFIGURATION-SYSTEM.md
│   │   ├── 10-FRONTEND-ARCHITECTURE.md
│   │   ├── 11-MULTI-TENANCY.md
│   │   └── PROJECT-STRUCTURE.md
│   ├── api/                          # API documentation
│   │   └── openapi.yaml
│   └── REQUIREMENTS.md               # Full requirements document
│
├── packages/                         # Shared packages
│   └── core/                         # Shared types, constants, utilities
│
├── apps/                             # Applications
│   ├── api/                          # Express backend
│   └── web/                          # React frontend
│
├── tenant-configs/                   # Per-tenant configurations
│   └── default/
│
├── scripts/                          # Utility scripts
│   ├── setup.sh
│   ├── seed-tenant.ts
│   └── migrate.sh
│
├── docker/                           # Docker configurations
│   ├── api.Dockerfile
│   ├── web.Dockerfile
│   └── nginx.conf
│
├── .env.example                      # Environment variables template
├── .gitignore
├── docker-compose.yml                # Local development setup
├── docker-compose.prod.yml           # Production setup
├── package.json                      # Root package.json (workspaces)
├── tsconfig.base.json               # Shared TypeScript config
└── README.md
```

## Packages Structure

### packages/core/

Shared code used by both frontend and backend.

```
packages/core/
├── src/
│   ├── types/                        # TypeScript interfaces
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── tenant.ts
│   │   ├── recruitment.ts
│   │   ├── employee.ts
│   │   ├── leave.ts
│   │   ├── exit.ts
│   │   ├── config.ts
│   │   ├── common.ts
│   │   └── index.ts
│   │
│   ├── constants/                    # Shared constants
│   │   ├── recruitment.ts
│   │   ├── leave.ts
│   │   ├── exit.ts
│   │   ├── rbac.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   │
│   ├── utils/                        # Utility functions
│   │   ├── date.ts
│   │   ├── string.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   │
│   └── index.ts                      # Main export
│
├── package.json
└── tsconfig.json
```

## Backend Structure

### apps/api/

Express.js backend application.

```
apps/api/
├── src/
│   ├── modules/                      # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validator.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── recruitment/
│   │   │   ├── controllers/
│   │   │   │   ├── job-posting.controller.ts
│   │   │   │   ├── candidate.controller.ts
│   │   │   │   ├── case.controller.ts
│   │   │   │   ├── interview.controller.ts
│   │   │   │   └── offer.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── job-posting.service.ts
│   │   │   │   ├── candidate.service.ts
│   │   │   │   ├── case.service.ts
│   │   │   │   ├── interview.service.ts
│   │   │   │   └── offer.service.ts
│   │   │   ├── repositories/
│   │   │   │   ├── job-posting.repository.ts
│   │   │   │   ├── candidate.repository.ts
│   │   │   │   ├── case.repository.ts
│   │   │   │   └── interview.repository.ts
│   │   │   ├── validators/
│   │   │   │   ├── job-posting.validator.ts
│   │   │   │   ├── case.validator.ts
│   │   │   │   └── offer.validator.ts
│   │   │   ├── recruitment.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── hr/
│   │   │   ├── controllers/
│   │   │   │   ├── employee.controller.ts
│   │   │   │   ├── department.controller.ts
│   │   │   │   ├── leave-type.controller.ts
│   │   │   │   ├── leave-policy.controller.ts
│   │   │   │   ├── leave-request.controller.ts
│   │   │   │   └── holiday.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── employee.service.ts
│   │   │   │   ├── leave.service.ts
│   │   │   │   └── holiday.service.ts
│   │   │   ├── repositories/
│   │   │   ├── validators/
│   │   │   ├── hr.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── employee/
│   │   │   ├── controllers/
│   │   │   │   ├── profile.controller.ts
│   │   │   │   ├── my-leave.controller.ts
│   │   │   │   └── my-document.controller.ts
│   │   │   ├── services/
│   │   │   ├── validators/
│   │   │   ├── employee.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── exit/
│   │   │   ├── controllers/
│   │   │   │   ├── exit-request.controller.ts
│   │   │   │   ├── clearance.controller.ts
│   │   │   │   └── exit-interview.controller.ts
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── validators/
│   │   │   ├── exit.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── config/
│   │   │   ├── controllers/
│   │   │   │   ├── entity.controller.ts
│   │   │   │   ├── custom-field.controller.ts
│   │   │   │   ├── email-template.controller.ts
│   │   │   │   └── workflow.controller.ts
│   │   │   ├── services/
│   │   │   ├── validators/
│   │   │   ├── config.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/
│   │   │   ├── controllers/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── role.controller.ts
│   │   │   │   └── audit-log.controller.ts
│   │   │   ├── services/
│   │   │   ├── validators/
│   │   │   ├── admin.routes.ts
│   │   │   └── index.ts
│   │   │
│   │   └── notification/
│   │       ├── notification.controller.ts
│   │       ├── notification.service.ts
│   │       ├── notification.routes.ts
│   │       └── index.ts
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── tenant.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── index.ts
│   │
│   ├── shared/                       # Shared services
│   │   ├── database/
│   │   │   ├── prisma.ts
│   │   │   ├── prisma-tenant.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── email/
│   │   │   ├── email.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── offer-letter.html
│   │   │   │   ├── welcome.html
│   │   │   │   └── ...
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── storage.service.ts
│   │   │   ├── local.provider.ts
│   │   │   ├── s3.provider.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── queue/
│   │   │   ├── queue.service.ts
│   │   │   ├── workers/
│   │   │   │   ├── email.worker.ts
│   │   │   │   └── notification.worker.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cache/
│   │   │   ├── redis.ts
│   │   │   ├── cache.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── pdf/
│   │   │   ├── pdf.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── logger/
│   │   │   ├── logger.ts
│   │   │   └── index.ts
│   │   │
│   │   └── utils/
│   │       ├── response.ts
│   │       ├── pagination.ts
│   │       └── index.ts
│   │
│   ├── config/                       # App configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── storage.config.ts
│   │   └── index.ts
│   │
│   ├── app.ts                        # Express app setup
│   ├── routes.ts                     # Route aggregation
│   └── server.ts                     # Server entry point
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── seed/
│       ├── seed.ts                   # Main seed script
│       ├── menu-items.ts
│       ├── permissions.ts
│       ├── email-templates.ts
│       └── document-templates.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Frontend Structure

### apps/web/

React frontend application.

```
apps/web/
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── modules/                      # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── ForgotPasswordPage.tsx
│   │   │   │   └── ResetPasswordPage.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── recruitment/
│   │   │   ├── components/
│   │   │   │   ├── CaseCard.tsx
│   │   │   │   ├── CaseKanban.tsx
│   │   │   │   ├── CaseTimeline.tsx
│   │   │   │   ├── CaseFilters.tsx
│   │   │   │   ├── InterviewScheduleForm.tsx
│   │   │   │   ├── InterviewFeedbackForm.tsx
│   │   │   │   ├── OfferForm.tsx
│   │   │   │   ├── DocumentVerification.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── JobPostingsPage.tsx
│   │   │   │   ├── JobPostingDetailPage.tsx
│   │   │   │   ├── CasesPage.tsx
│   │   │   │   ├── CaseDetailPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useCases.ts
│   │   │   │   ├── useCase.ts
│   │   │   │   ├── useJobPostings.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   └── recruitment.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── hr/
│   │   │   ├── components/
│   │   │   │   ├── EmployeeCard.tsx
│   │   │   │   ├── EmployeeForm.tsx
│   │   │   │   ├── DepartmentTree.tsx
│   │   │   │   ├── LeaveRequestTable.tsx
│   │   │   │   ├── LeaveApprovalModal.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── EmployeesPage.tsx
│   │   │   │   ├── EmployeeDetailPage.tsx
│   │   │   │   ├── DepartmentsPage.tsx
│   │   │   │   ├── LeaveTypesPage.tsx
│   │   │   │   ├── LeavePoliciesPage.tsx
│   │   │   │   ├── LeaveRequestsPage.tsx
│   │   │   │   ├── HolidaysPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   ├── employee/
│   │   │   ├── components/
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   ├── ProfileEditForm.tsx
│   │   │   │   ├── LeaveBalanceCard.tsx
│   │   │   │   ├── LeaveApplicationForm.tsx
│   │   │   │   ├── LeaveHistoryTable.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   ├── LeavesPage.tsx
│   │   │   │   ├── DocumentsPage.tsx
│   │   │   │   ├── PayslipsPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   ├── exit/
│   │   │   ├── components/
│   │   │   │   ├── ExitRequestForm.tsx
│   │   │   │   ├── ClearanceChecklist.tsx
│   │   │   │   ├── ExitInterviewForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── ExitRequestsPage.tsx
│   │   │   │   ├── ExitDetailPage.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   ├── candidate/
│   │   │   ├── components/
│   │   │   │   ├── DocumentUploadForm.tsx
│   │   │   │   ├── DocumentChecklist.tsx
│   │   │   │   └── index.ts
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── DocumentsPage.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── lifetime/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── DocumentsPage.tsx
│   │   │   │   ├── QueriesPage.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── UserForm.tsx
│   │       │   ├── RoleForm.tsx
│   │       │   ├── PermissionMatrix.tsx
│   │       │   ├── EmailTemplateEditor.tsx
│   │       │   └── index.ts
│   │       ├── pages/
│   │       │   ├── UsersPage.tsx
│   │       │   ├── RolesPage.tsx
│   │       │   ├── ConfigurationPage.tsx
│   │       │   ├── EmailTemplatesPage.tsx
│   │       │   ├── WorkflowsPage.tsx
│   │       │   ├── AuditLogsPage.tsx
│   │       │   └── index.ts
│   │       ├── hooks/
│   │       ├── services/
│   │       └── index.ts
│   │
│   ├── shared/                       # Shared code
│   │   ├── components/
│   │   │   ├── DataTable/
│   │   │   │   ├── DataTable.tsx
│   │   │   │   └── index.ts
│   │   │   ├── FileUpload/
│   │   │   │   ├── FileUpload.tsx
│   │   │   │   ├── FileList.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PageHeader/
│   │   │   │   ├── PageHeader.tsx
│   │   │   │   └── index.ts
│   │   │   ├── StatusBadge/
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Timeline/
│   │   │   │   ├── Timeline.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PermissionGate/
│   │   │   │   ├── PermissionGate.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ProtectedRoute/
│   │   │   │   ├── ProtectedRoute.tsx
│   │   │   │   └── index.ts
│   │   │   ├── ErrorBoundary/
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   └── index.ts
│   │   │   ├── LoadingScreen/
│   │   │   │   ├── LoadingScreen.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── usePermission.ts
│   │   │   ├── useTenant.ts
│   │   │   ├── useNotifications.ts
│   │   │   ├── useApiError.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── TenantContext.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── utils/
│   │       ├── api.ts
│   │       ├── storage.ts
│   │       ├── date.ts
│   │       ├── format.ts
│   │       └── index.ts
│   │
│   ├── config/
│   │   ├── routes.tsx
│   │   ├── menu.ts
│   │   ├── theme.ts
│   │   └── constants.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── tenant.store.ts
│   │   ├── app.store.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js (optional)
```

## Configuration Files

### Root package.json

```json
{
  "name": "hrms",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:api\" \"npm run dev:web\"",
    "dev:api": "npm run dev --workspace=@hrms/api",
    "dev:web": "npm run dev --workspace=@hrms/web",
    "build": "npm run build --workspaces",
    "lint": "npm run lint --workspaces",
    "test": "npm run test --workspaces",
    "db:generate": "npm run db:generate --workspace=@hrms/api",
    "db:push": "npm run db:push --workspace=@hrms/api",
    "db:migrate": "npm run db:migrate --workspace=@hrms/api",
    "db:seed": "npm run db:seed --workspace=@hrms/api"
  }
}
```

### tsconfig.base.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CaseCard.tsx` |
| Hooks | camelCase with "use" prefix | `useCases.ts` |
| Services | camelCase with ".service" suffix | `recruitment.service.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `RecruitmentCase.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |
| Tests | Same as source with ".test" | `CaseCard.test.tsx` |
