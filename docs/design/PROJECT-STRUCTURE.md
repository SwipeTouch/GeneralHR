# Project Structure (Minimal Scope)

Simplified monorepo — full v1 structure archived in [../archive/v1-full-hrms/design/PROJECT-STRUCTURE.md](../archive/v1-full-hrms/design/PROJECT-STRUCTURE.md).

```
hrms/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/
│   │       │   ├── recruitment/    # candidates, comments, documents
│   │       │   ├── portal/         # candidate upload
│   │       │   ├── staff/          # employees, attendance
│   │       │   ├── settings/       # salary heads, tenant settings
│   │       │   └── payroll/        # PHP adapter + routes
│   │       ├── integrations/
│   │       │   └── payroll-php/
│   │       └── shared/
│   │           ├── storage/        # local uploads
│   │           └── email/          # SMTP
│   └── web/
│       └── src/
│           ├── modules/
│           │   ├── recruitment/
│           │   ├── portal/
│           │   ├── staff/
│           │   └── settings/
│           └── shared/
├── packages/core/                  # types, status enums, constants
├── docs/
│   ├── design/                     # current minimal design
│   ├── archive/v1-full-hrms/       # previous full design
│   └── REQUIREMENTS.md
└── package.json
```
